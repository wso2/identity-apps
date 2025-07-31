/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Link from "@oxygen-ui/react/Link";
import Switch from "@oxygen-ui/react/Switch";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowLeftIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import updateFlowConfig from "@wso2is/admin.flows.v1/api/update-flow-config";
import useGetFlowConfig from "@wso2is/admin.flows.v1/api/use-get-flow-config";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useAskPasswordFlowBuilder from "../hooks/use-ask-password-flow-builder";

/**
 * Props interface of {@link AskPasswordFlowBuilderPageHeader}
 */
export type AskPasswordFlowBuilderPageHeaderProps = IdentifiableComponentInterface;

/**
 * Interface for the path state.
 */
interface PathStateInterface {
    from?: {
        /**
         * Path to navigate back to.
         */
        pathname?: string;
    }
}

/**
 * Header for the Password Recovery flow builder page.
 *
 * @param props - Props injected to the component.
 * @returns AskPasswordFlowBuilderPageHeader component.
 */
const AskPasswordFlowBuilderPageHeader: FunctionComponent<AskPasswordFlowBuilderPageHeaderProps> = ({
    ["data-componentid"]: componentId = "ask-password-flow-builder-page-header"
}: AskPasswordFlowBuilderPageHeaderProps): ReactElement => {
    const { onPublish } = useAskPasswordFlowBuilder();
    const {
        data: flowConfig,
        mutate: mutateFlowConfig,
        error: flowConfigError
    } = useGetFlowConfig(FlowTypes.INVITED_USER_REGISTRATION);
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isFlowConfigUpdating, setIsFlowConfigUpdating ] = useState<boolean>(false);

    /**
     * Handle flow config fetch errors using useEffect
     */
    useEffect(() => {
        if (flowConfigError) {
            dispatch(addAlert<AlertInterface>({
                description: t("flows:askPassword.notifications.fetchFlowConfig.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("flows:askPassword.notifications.fetchFlowConfig.genericError.message")
            }));
        }
    }, [ flowConfigError ]);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {

        let backPath: string = AppConstants.getPaths().get("FLOWS");

        if (history?.location?.state) {
            const state: PathStateInterface = history.location.state as PathStateInterface;

            if (state?.from?.pathname) {
                backPath = state.from.pathname;
            }
        }

        history.push(backPath);
    };

    /**
     * Dispatches error alerts for flow config API errors.
     *
     * @param operation - The operation being performed (enable, disable).
     */
    const handleFlowConfigError = (operation: string): void => {
        dispatch(addAlert<AlertInterface>({
            description: t(`flows:askPassword.notifications.${operation}Flow.genericError.description`),
            level: AlertLevels.ERROR,
            message: t(`flows:askPassword.notifications.${operation}Flow.genericError.message`)
        }));
    };

    /**
     * Dispatches success alerts for flow config operations.
     *
     * @param operation - The operation that was successful (enable, disable, publish).
     */
    const handleFlowConfigSuccess = (operation: string): void => {
        dispatch(addAlert<AlertInterface>({
            description: t(`flows:askPassword.notifications.${operation}Flow.success.description`),
            level: AlertLevels.SUCCESS,
            message: t(`flows:askPassword.notifications.${operation}Flow.success.message`)
        }));
    };

    /**
     * Handles the toggle switch change event.
     */
    const handleToggleFlow = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const isEnabled: boolean = event.target.checked;

        setIsFlowConfigUpdating(true);

        try {
            let isPublishSuccess: boolean = true;

            if (isEnabled) {
                isPublishSuccess = await onPublish();
            }

            if (isPublishSuccess) {
                await updateFlowConfig({
                    flowType: FlowTypes.INVITED_USER_REGISTRATION,
                    isEnabled
                });
                handleFlowConfigSuccess(isEnabled ? "enable" : "disable");
                await mutateFlowConfig();
            }
        } catch (error) {
            handleFlowConfigError(isEnabled ? "enable" : "disable");
        } finally {
            setIsFlowConfigUpdating(false);
        }
    };

    return (
        <Box
            display="flex"
            className="page-header"
            justifyContent="space-between"
            alignItems="center"
            data-componentid={ componentId }
        >
            <Box display="flex" gap={ 3 } alignItems="center">
                <IconButton onClick={ handleBackButtonClick }>
                    <ArrowLeftIcon />
                </IconButton>
                <Breadcrumbs aria-label="breadcrumb" className="ask-password-flow-builder-page-header-breadcrumbs">
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={ () => history.push(AppConstants.getPaths().get("FLOWS")) }
                    >
                        Flows
                    </Link>
                    <Typography sx={ { color: "text.primary" } }>Edit Invite User Registration Flow</Typography>
                </Breadcrumbs>
            </Box>
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Tooltip
                    title={
                        flowConfig?.isEnabled
                            ? t("flows:askPassword.tooltip.disableFlow")
                            : t("flows:askPassword.tooltip.enableFlow")
                    }
                >
                    <Switch
                        checked={ flowConfig?.isEnabled || false }
                        onChange={ handleToggleFlow }
                        disabled={ isFlowConfigUpdating }
                        data-componentid={ `${componentId}-toggle-switch` }
                    />
                </Tooltip>
            </Box>
        </Box>
    );
};

export default AskPasswordFlowBuilderPageHeader;
