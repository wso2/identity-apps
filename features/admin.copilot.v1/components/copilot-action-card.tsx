/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Theme, alpha } from "@mui/material/styles";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Paper from "@oxygen-ui/react/Paper";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CopilotActionFieldInterface, CopilotActionInterface } from "../store/types/copilot-action-types";

/**
 * Console routes for the resources an action can create, by `resource.type`.
 */
const RESOURCE_ROUTES: Record<string, { route: string; params?: Record<string, string> }> = {
    agent: { route: "AGENT_EDIT" },
    api_resource: { params: { categoryId: "custom" }, route: "API_RESOURCE_EDIT" },
    application: { route: "APPLICATION_EDIT" },
    group: { route: "GROUP_EDIT" },
    role: { route: "ROLE_EDIT" },
    user: { route: "USER_EDIT" }
};

/**
 * Props for the action card.
 */
interface CopilotActionCardProps extends IdentifiableComponentInterface {
    action: CopilotActionInterface;
    onRespond: (decision: "confirm" | "cancel") => void;
}

/**
 * Value of a field as plain text. Values come from the model, so they are never rendered as
 * Markdown or HTML, and URLs are not links.
 */
const renderFieldValue = (field: CopilotActionFieldInterface): ReactNode => {
    const { type, value, options } = field;

    if (type === "enum") {
        return options?.find((option: { value: string; label: string }) => option.value === value)?.label
            ?? String(value ?? "");
    }
    if (type === "url") {
        return <Box component="span" sx={ { wordBreak: "break-all" } }>{ String(value ?? "") }</Box>;
    }
    if (type === "url_list" && Array.isArray(value)) {
        return value.map((url: unknown, index: number) => (
            <Box key={ index } component="span" sx={ { display: "block", wordBreak: "break-all" } }>
                { String(url) }
            </Box>
        ));
    }
    if (type === "boolean") {
        return value ? "Yes" : "No";
    }
    if (type === "reference" && value && typeof value === "object") {
        return String((value as { label?: string }).label ?? "");
    }
    if ((type === "text_list" || type === "reference_list") && Array.isArray(value)) {
        return value.map((item: unknown, index: number) => (
            <Box key={ index } component="span" sx={ { display: "block", wordBreak: "break-word" } }>
                { item && typeof item === "object" ? String((item as { label?: string }).label ?? "") : String(item) }
            </Box>
        ));
    }

    return Array.isArray(value) ? value.map(String).join(", ") : String(value ?? "");
};

/**
 * Minutes left until the proposal expires, or 0 once it has.
 */
const minutesLeft = (expiresAt: string): number => {
    const expires: number = Date.parse(expiresAt);

    if (Number.isNaN(expires)) {
        return 0;
    }

    return Math.max(0, Math.ceil((expires - Date.now()) / 60000));
};

/**
 * A change the copilot proposed. Nothing happens until the user confirms it here; the backend
 * then runs exactly what this card shows.
 *
 * @param props - Props injected to the component.
 * @returns The action card.
 */
const CopilotActionCard: FunctionComponent<CopilotActionCardProps> = (
    props: CopilotActionCardProps
): ReactElement => {
    const { action, onRespond, ["data-componentid"]: componentId = "copilot-action-card" } = props;
    const { t } = useTranslation();

    const [ remaining, setRemaining ] = useState<number>(minutesLeft(action.expires_at));
    // An elevated card (e.g. an admin role or a new agent) needs an explicit "I've reviewed this".
    const [ reviewed, setReviewed ] = useState<boolean>(false);
    const needsReview: boolean = action.risk === "elevated";

    // Re-check the expiry every 15 seconds while the card is still pending.
    useEffect(() => {
        if (action.status !== "PENDING") {
            return;
        }
        setRemaining(minutesLeft(action.expires_at));
        const timer: ReturnType<typeof setInterval> = setInterval(
            () => setRemaining(minutesLeft(action.expires_at)), 15000
        );

        return () => clearInterval(timer);
    }, [ action.expires_at, action.status ]);

    const expired: boolean = action.status === "EXPIRED" || (action.status === "PENDING" && remaining === 0);
    const pending: boolean = action.status === "PENDING" && !expired;
    const resourceRoute: { route: string; params?: Record<string, string> } | undefined =
        action.resource && RESOURCE_ROUTES[action.resource.type];

    const openResource = (): void => {
        let path: string = AppConstants.getPaths().get(resourceRoute.route).replace(":id", action.resource.id);

        Object.entries(resourceRoute.params ?? {}).forEach(([ key, value ]: [ string, string ]) => {
            path = path.replace(`:${key}`, value);
        });
        history.push(path);
    };

    const renderOutcome = (): ReactNode => {
        if (pending) {
            return null;
        }

        let icon: ReactNode = <HelpOutlineIcon fontSize="small" color="warning" />;
        let text: string = t("console:common.copilot.actionCard.unknown");

        switch (action.status) {
            case "EXECUTING":
                icon = <CircularProgress size={ 16 } />;
                text = t("console:common.copilot.actionCard.confirming");

                break;
            case "SUCCEEDED":
                icon = <CheckCircleOutlineIcon fontSize="small" color="success" />;
                text = t("console:common.copilot.actionCard.succeeded");

                break;
            case "FAILED":
            case "PARTIAL":
                icon = <ErrorOutlineIcon fontSize="small" color="error" />;
                text = action.error?.message || t("console:common.copilot.actionCard.failed");

                break;
            case "CANCELLED":
                icon = <HighlightOffIcon fontSize="small" color="disabled" />;
                text = t("console:common.copilot.actionCard.cancelled");

                break;
            case "UNAVAILABLE":
                icon = <HighlightOffIcon fontSize="small" color="disabled" />;
                text = t("console:common.copilot.actionCard.notAvailable");

                break;
            default:
                if (expired) {
                    icon = <HighlightOffIcon fontSize="small" color="disabled" />;
                    text = t("console:common.copilot.actionCard.expired");
                }
        }

        return (
            <Stack direction="row" spacing={ 1 } alignItems="center" data-componentid={ `${componentId}-outcome` }>
                { icon }
                <Typography variant="body2">{ text }</Typography>
                { action.status === "SUCCEEDED" && resourceRoute && (
                    <Button
                        size="small"
                        variant="text"
                        onClick={ openResource }
                        data-componentid={ `${componentId}-open-resource` }
                    >
                        { t("console:common.copilot.actionCard.openResource") }
                    </Button>
                ) }
            </Stack>
        );
    };

    return (
        <Paper
            variant="outlined"
            data-componentid={ componentId }
            sx={ (theme: Theme) => ({
                borderColor: pending ? alpha(theme.palette.primary.main, 0.4) : theme.palette.divider,
                borderRadius: 2,
                mt: 1,
                p: 2
            }) }
        >
            <Typography variant="subtitle2" sx={ { fontWeight: 600 } }>{ action.title }</Typography>
            <Typography variant="body2" color="text.secondary" sx={ { mb: 1.5 } }>{ action.summary }</Typography>

            { pending && action.warnings?.map((warning: string, index: number) => (
                <Alert
                    key={ index }
                    severity="warning"
                    sx={ { mb: 1.5 } }
                    data-componentid={ `${componentId}-warning` }
                >
                    { warning }
                </Alert>
            )) }

            <Box component="dl" sx={ { display: "grid", gap: 1, gridTemplateColumns: "max-content 1fr", m: 0 } }>
                { action.fields
                    .filter((field: CopilotActionFieldInterface) => field.type !== "secret")
                    .map((field: CopilotActionFieldInterface) => (
                        <React.Fragment key={ field.key }>
                            <Typography component="dt" variant="body2" color="text.secondary">
                                { field.label }
                            </Typography>
                            <Typography component="dd" variant="body2" sx={ { m: 0, wordBreak: "break-word" } }>
                                { renderFieldValue(field) }
                            </Typography>
                        </React.Fragment>
                    )) }
            </Box>

            <Box sx={ { mt: 2 } }>
                { pending && needsReview && (
                    <FormControlLabel
                        control={ (
                            <Checkbox
                                size="small"
                                checked={ reviewed }
                                onChange={ (_event: React.ChangeEvent, checked: boolean) => setReviewed(checked) }
                                data-componentid={ `${componentId}-reviewed` }
                            />
                        ) }
                        label={ (
                            <Typography variant="body2">
                                { t("console:common.copilot.actionCard.reviewed") }
                            </Typography>
                        ) }
                        sx={ { mb: 1 } }
                    />
                ) }
                { pending ? (
                    <Stack direction="row" spacing={ 1 } alignItems="center" flexWrap="wrap">
                        <Button
                            variant="contained"
                            size="small"
                            disabled={ !action.ready || action.submitting || (needsReview && !reviewed) }
                            onClick={ () => onRespond("confirm") }
                            data-componentid={ `${componentId}-confirm` }
                        >
                            { t("console:common.copilot.actionCard.confirm") }
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={ !action.ready || action.submitting }
                            onClick={ () => onRespond("cancel") }
                            data-componentid={ `${componentId}-cancel` }
                        >
                            { t("console:common.copilot.actionCard.cancel") }
                        </Button>
                        { action.submitting && <CircularProgress size={ 16 } /> }
                        <Typography variant="caption" color="text.secondary">
                            { t("console:common.copilot.actionCard.note") }
                            { " " }
                            { t("console:common.copilot.actionCard.expiresIn", { minutes: remaining }) }
                        </Typography>
                    </Stack>
                ) : renderOutcome() }
                { pending && action.error && (
                    <Typography variant="caption" color="error" sx={ { display: "block", mt: 1 } }>
                        { action.error.message }
                    </Typography>
                ) }
            </Box>
        </Paper>
    );
};

export default CopilotActionCard;
