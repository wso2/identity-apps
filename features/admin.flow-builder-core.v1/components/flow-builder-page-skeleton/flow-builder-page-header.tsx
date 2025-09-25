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
import React, { FunctionComponent, ReactElement, MutableRefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteProps } from "react-router-dom";
import { Dispatch } from "redux";
import updateFlowConfig from "../../api/update-flow-config";
import useGetFlowConfig from "../../api/use-get-flow-config";
import ValidationStatusLabels from "../../components/validation-panel/validation-status-labels";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import useValidationStatus from "../../hooks/use-validation-status";
import  moment from "moment";

/**
 * Props interface of {@link FlowBuilderPageHeader}
 */
export interface FlowBuilderPageHeaderProps extends IdentifiableComponentInterface, RouteProps {
    flowType: any;
    flowTypeDisplayName: string;
    isPublishing: boolean;
    onPublish: any;
}

const RotateIcon = (): ReactElement => {
    /* eslint-disable-next-line max-len */
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={ 16 } height={ 16 }><path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z" /></svg>;
};

const ClockRotateIcon = ({ height = 16, width = 16}): ReactElement => {
    /* eslint-disable-next-line max-len */
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={ width } height={ height }><path d="M320 128C426 128 512 214 512 320C512 426 426 512 320 512C254.8 512 197.1 479.5 162.4 429.7C152.3 415.2 132.3 411.7 117.8 421.8C103.3 431.9 99.8 451.9 109.9 466.4C156.1 532.6 233 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C234.3 64 158.5 106.1 112 170.7L112 144C112 126.3 97.7 112 80 112C62.3 112 48 126.3 48 144L48 256C48 273.7 62.3 288 80 288L104.6 288C105.1 288 105.6 288 106.1 288L192.1 288C209.8 288 224.1 273.7 224.1 256C224.1 238.3 209.8 224 192.1 224L153.8 224C186.9 166.6 249 128 320 128zM344 216C344 202.7 333.3 192 320 192C306.7 192 296 202.7 296 216L296 320C296 326.4 298.5 332.5 303 337L375 409C384.4 418.4 399.6 418.4 408.9 409C418.2 399.6 418.3 384.4 408.9 375.1L343.9 310.1L343.9 216z"/></svg>;
};

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
    const { isAutoSavingLocalHistory, lastLocalHistoryAutoSaveTimestamp, setIsVersionHistoryPanelOpen } = useAuthenticationFlowBuilderCore();
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isFlowConfigUpdating, setIsFlowConfigUpdating ] = useState<boolean>(false);
    const [ showSavingSuspense, setShowSavingSuspense ] = useState<boolean>(false);

    const suspenseTimeoutRef: MutableRefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null);

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
     * Handle auto-saving suspense logic - keep saving indicator for 2 seconds
     */
    useEffect(() => {
        if (isAutoSavingLocalHistory) {
            setShowSavingSuspense(true);

            if (suspenseTimeoutRef.current) {
                clearTimeout(suspenseTimeoutRef.current);
            }

            suspenseTimeoutRef.current = setTimeout(() => {
                setShowSavingSuspense(false);
                suspenseTimeoutRef.current = null;
            }, 2000);
        }
    }, [ isAutoSavingLocalHistory ]);

    /**
     * Cleanup timeout on unmount
     */
    useEffect(() => {
        return () => {
            if (suspenseTimeoutRef.current) {
                clearTimeout(suspenseTimeoutRef.current);
            }
        };
    }, []);

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
            <Box display="flex" justifyContent="center" alignItems="center" gap={ 2 }>
                { (showSavingSuspense || isFlowConfigUpdating) && (
                    <Box sx={ { alignItems: "center", display: "flex", gap: 1  } }>
                        <RotateIcon />
                        <Typography variant="body2" color="text.secondary">
                            { t("flows:core.autoSave.savingInProgress") }
                        </Typography>
                    </Box>
                ) }
                <Box>
                    <Tooltip title={ `Version History (Local)` }>
                        <IconButton onClick={ () => setIsVersionHistoryPanelOpen(true) }>
                            <ClockRotateIcon height={ 20 } width={ 20 } />
                        </IconButton>
                    </Tooltip>
                </Box>
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
