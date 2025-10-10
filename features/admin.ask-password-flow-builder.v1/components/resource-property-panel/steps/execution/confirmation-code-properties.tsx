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


import Box from "@oxygen-ui/react/Box";
import Button  from "@oxygen-ui/react/Button";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import {
    GovernanceConnectorInterface,
    RevertGovernanceConnectorConfigInterface
} from "@wso2is/admin.server-configurations.v1/models/governance-connectors";
import { ServerConfigurationsConstants } from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import {
    getConnectorDetails,
    revertGovernanceConnectorProperties
} from "@wso2is/admin.server-configurations.v1/api/governance-connectors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AskPasswordConfigurations } from "./ask-password-configurations";
import useAskPasswordFlowBuilder from "../../../../hooks/use-ask-password-flow-builder";
import "./confirmation-code-properties.scss";

/**
 * Props interface of {@link ConfirmationCodeProperties}
 */
export type ConfirmationCodePropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;
/**
 * Confirmation code step properties component.
 *
 * @param props - Props injected to the component.
 * @returns ConfirmationCodeProperties component.
 */
const ConfirmationCodeProperties: FunctionComponent<ConfirmationCodePropertiesPropsInterface> = ({
    ["data-componentid"]: componentId = "confirmation-code-properties-component"
}: ConfirmationCodePropertiesPropsInterface): ReactElement => {

    const {
        connector,
        setConnector
    } = useAskPasswordFlowBuilder();

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const hasConnectorUpdatePermission: boolean = useRequiredScopes(featureConfig.governanceConnectors.scopes?.update);

    // Fallback to API if context is null.
    useEffect(() => {
        if (!connector) {
            loadConnectorDetails();
        }
    }, [ connector, setConnector ]);

    const handleRevertSuccess = () => {
        dispatch(
            addAlert({
                description: t(
                    "governanceConnectors:notifications.revertConnector.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "governanceConnectors:notifications.revertConnector.success.message"
                )
            })
        );
    };

    const handleRevertError = () => {
        dispatch(
            addAlert({
                description: t(
                    "governanceConnectors:notifications.revertConnector.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "governanceConnectors:notifications.revertConnector.error.message"
                )
            })
        );
    };

    const loadConnectorDetails = () => {
        getConnectorDetails(
            ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
            ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID
        ).then((response: GovernanceConnectorInterface) => {
            // Set connector categoryID if not available.
            if (!response?.categoryId) {
                response.categoryId = ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID;
            }
            setConnector(response);
        }).catch(() => {
            setConnector(undefined);
        });
    };

    const onAskPasswordRevert = () => {
        const revertRequest: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.ASK_PASSWORD_ENABLE,
                ServerConfigurationsConstants.ASK_PASSWORD_LOCK_ON_CREATION,
                ServerConfigurationsConstants.ASK_PASSWORD_ACCOUNT_ACTIVATION,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_EXPIRY_TIME,
                ServerConfigurationsConstants.ASK_PASSWORD_EMAIL_OTP,
                ServerConfigurationsConstants.ASK_PASSWORD_SMS_OTP,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_LOWERCASE,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_NUMERIC,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_UPPERCASE,
                ServerConfigurationsConstants.ASK_PASSWORD_OTP_LENGTH
            ]
        };

        revertGovernanceConnectorProperties(
            ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
            ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID,
            revertRequest
        )
            .then(() => {
                handleRevertSuccess();
            })
            .catch(() => {
                handleRevertError();
            }).finally(() => {
                loadConnectorDetails();
            });
    };

    return (
        <Stack gap={ 1 } data-componentid={ componentId } className="confirmation-code-properties">
            <Box className="configuration-section">
                <AskPasswordConfigurations
                    connector={ connector }
                    readOnly={ !hasConnectorUpdatePermission }
                    isConnectorEnabled={ true }
                    isSubmitting={ false }
                    data-componentid="confirmation-code-properties"
                />
            </Box>
            <Box className="configuration-revert-section">
                <Button
                    variant="outlined"
                    onClick={ () => onAskPasswordRevert() }
                    color="error"
                    className="revert-button"
                >
                    <Typography variant="body1" color="error" className="revert-button-text">
                        { t("governanceConnectors:dangerZone.heading") }
                    </Typography>
                </Button>
            </Box>
        </Stack>
    );
};

export default ConfirmationCodeProperties;
