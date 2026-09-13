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

import Alert, { AlertProps } from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Collapse from "@oxygen-ui/react/Collapse";
import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowUpRightFromSquareIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Props interface for the PlanLimitExceededAlert component.
 */
interface PlanLimitExceededAlertPropsInterface extends IdentifiableComponentInterface, Pick<AlertProps, "sx"> {
    /**
     * Alert heading. e.g. "All applications are disabled — plan limit exceeded".
     */
    title: string;
    /**
     * Sentence explaining why the resources were disabled.
     */
    description: string;
    /**
     * i18n key of the "Upgrade your plan" resolution.
     */
    upgradeResolutionKey: string;
    /**
     * i18n key of the "Stay on your current plan" resolution. See `upgradeResolutionKey`.
     */
    stayResolutionKey: string;
}

/**
 * Alert shown on a resource listing page when the resources of that type have been disabled
 * because the organization holds more of them than its subscription plan allows.
 *
 * @param props - Props injected to the component.
 * @returns Plan limit exceeded alert component.
 */
const PlanLimitExceededAlert: FunctionComponent<PlanLimitExceededAlertPropsInterface> = (
    {
        title,
        description,
        upgradeResolutionKey,
        stayResolutionKey,
        sx,
        [ "data-componentid" ]: componentId = "plan-limit-exceeded-alert"
    }: PlanLimitExceededAlertPropsInterface
): ReactElement => {

    const { t } = useTranslation();

    const [ isDetailsShown, setIsDetailsShown ] = useState<boolean>(true);

    const pricingURL: string = useSelector(
        (state: AppState): string =>
            (state?.config?.deployment?.extensions as { pricingURL?: string })?.pricingURL ?? "https://wso2.com"
    );

    const handleDetailsToggle: () => void = useCallback((): void => {
        setIsDetailsShown((isShown: boolean) => !isShown);
    }, []);

    const renderResolution = (resolutionKey: string): ReactElement => (
        <Typography variant="body2" component="li">
            <Trans i18nKey={ resolutionKey } components={ { strong: <strong/> } } />
        </Typography>
    );

    return (
        <Alert
            severity="error"
            data-componentid={ componentId }
            sx={ {
                "& .MuiAlert-action": {
                    flexShrink: 0,
                    mr: 0,
                    pl: 3
                },
                mb: 2,
                ...sx
            } }
            action={ (
                <Link
                    component="button"
                    variant="body2"
                    underline="none"
                    onClick={ handleDetailsToggle }
                    sx={ { whiteSpace: "nowrap" } }
                    data-componentid={ `${ componentId }-details-toggle` }
                >
                    { isDetailsShown
                        ? t("console:common.planLimitExceededAlert.hideDetails")
                        : t("console:common.planLimitExceededAlert.showDetails") }
                </Link>
            ) }
        >
            <AlertTitle>{ title }</AlertTitle>
            <Typography variant="body2">
                { description }
                { " " }
                <Link
                    href={ pricingURL }
                    target="_blank"
                    rel="noopener noreferrer"
                    data-componentid={ `${ componentId }-compare-plans-link` }
                >
                    { t("console:common.planLimitExceededAlert.comparePlansAction") }
                    <ArrowUpRightFromSquareIcon className="ml-1" size={ 14 } verticalAlign="middle" />
                </Link>
            </Typography>
            <Collapse in={ isDetailsShown } data-componentid={ `${ componentId }-details` }>
                <Typography variant="body2" sx={ { mt: 1.5 } }>
                    { t("console:common.planLimitExceededAlert.resolutionsHeading") }
                </Typography>
                <Box
                    component="ul"
                    sx={ {
                        "& li + li": {
                            mt: 0.25
                        },
                        mb: 0,
                        mt: 0.5,
                        pl: 3
                    } }
                >
                    { renderResolution(upgradeResolutionKey) }
                    { renderResolution(stayResolutionKey) }
                </Box>
            </Collapse>
        </Alert>
    );
};

export default PlanLimitExceededAlert;
