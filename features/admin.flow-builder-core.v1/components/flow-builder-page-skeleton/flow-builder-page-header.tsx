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
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteProps } from "react-router-dom";
import { Dispatch } from "redux";
import updateFlowConfig from "../../api/update-flow-config";
import useGetFlowConfig from "../../api/use-get-flow-config";
import ValidationStatusLabels from "../../components/validation-panel/validation-status-labels";
import useValidationStatus from "../../hooks/use-validation-status";

/**
 * Props interface of {@link FlowBuilderPageHeader}
 */
export interface FlowBuilderPageHeaderProps extends IdentifiableComponentInterface, RouteProps {
    flowType: any;
    flowTypeDisplayName: string;
    isPublishing: boolean;
    onPublish: any;
}

/**
 * Header for the flow builder page.
 *
 * @param props - Props injected to the component.
 * @returns FlowBuilderPageHeader component.
 */
const FlowBuilderPageHeader: FunctionComponent<FlowBuilderPageHeaderProps> = ({
    ["data-componentid"]: componentId = "flow-builder-page-header",
    onPublish,
    flowType,
    flowTypeDisplayName
}: FlowBuilderPageHeaderProps): ReactElement => {
    const { isValid } = useValidationStatus();
    const { data: flowConfig, mutate: mutateFlowConfig, error: flowConfigError } = useGetFlowConfig(flowType);
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isFlowConfigUpdating, setIsFlowConfigUpdating ] = useState<boolean>(false);

    /**
     * Handle flow config fetch errors using useEffect
     */
    useEffect(() => {
        if (flowConfigError) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("flows:core.notifications.fetchFlowConfig.genericError.description", {
                        flowType: flowTypeDisplayName
                    }),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.fetchFlowConfig.genericError.message", {
                        flowType: flowTypeDisplayName
                    })
                })
            );
        }
    }, [ flowConfigError ]);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        let backPath: string = AppConstants.getPaths().get("FLOWS");

        if (history?.location?.state) {
            const state: {
                from?: {
                    pathname: string;
                };
            } = history.location.state;

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
        dispatch(
            addAlert<AlertInterface>({
                description: t(`flows:core.notifications.${operation}Flow.genericError.description`, {
                    flowType: flowTypeDisplayName
                }),
                level: AlertLevels.ERROR,
                message: t(`flows:core.notifications.${operation}Flow.genericError.message`, {
                    flowType: flowTypeDisplayName
                })
            })
        );
    };

    /**
     * Dispatches success alerts for flow config operations.
     *
     * @param operation - The operation that was successful (enable, disable, publish).
     */
    const handleFlowConfigSuccess = (operation: string): void => {
        dispatch(
            addAlert<AlertInterface>({
                description: t(`flows:core.notifications.${operation}Flow.success.description`, {
                    flowType: flowTypeDisplayName
                }),
                level: AlertLevels.SUCCESS,
                message: t(`flows:core.notifications.${operation}Flow.success.message`, {
                    flowType: flowTypeDisplayName
                })
            })
        );
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
                    flowType,
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
                <Breadcrumbs aria-label="breadcrumb" className="flow-builder-page-header-breadcrumbs">
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={ () => history.push(AppConstants.getPaths().get("FLOWS")) }
                    >
                        { t("flows:label") }
                    </Link>
                    <Typography>{ t("flows:core.breadcrumb", { flowType: flowTypeDisplayName }) }</Typography>
                </Breadcrumbs>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" gap={ 4 }>
                <ValidationStatusLabels />
                <Box display="flex" alignItems="center">
                    <Typography>
                        {
                            flowConfig?.isEnabled
                                ? t("flows:core.labels.disableFlow")
                                : t("flows:core.labels.enableFlow")
                        }
                    </Typography>
                    <Tooltip
                        title={
                            flowConfig?.isEnabled
                                ? t("flows:core.tooltip.disableFlow")
                                : t("flows:core.tooltip.enableFlow")
                        }
                    >
                        <Switch
                            checked={ flowConfig?.isEnabled || false }
                            onChange={ handleToggleFlow }
                            disabled={ isFlowConfigUpdating || (!flowConfig?.isEnabled && !isValid) }
                            data-componentid={ `${componentId}-toggle-switch` }
                        />
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

export default FlowBuilderPageHeader;
