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

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import {
    CommonResourcePropertiesPropsInterface 
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import {
    AskPasswordFormConstants,
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants 
} from "@wso2is/admin.server-configurations.v1";
import { getConnectorDetails } from "@wso2is/admin.server-configurations.v1/api/governance-connectors";
import {
    AskPasswordFormValuesInterface,
    VerificationOption
} from "@wso2is/admin.server-configurations.v1/models/ask-password";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import useAskPasswordFlowBuilder from "../../../../hooks/use-ask-password-flow-builder";

/**
 * Props interface of {@link FlowCompletionProperties}
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
    const { t } = useTranslation();

    // Get from context first
    const {
        connector,
        invitedUserRegistrationConfig,
        setConnector,
        setInvitedUserRegistrationConfig,
        setIsInvitedUserRegistrationConfigUpdated
    } = useAskPasswordFlowBuilder();
    const [ isInviteUserToSetPasswordEnabled, setIsInviteUserToSetPasswordEnabled ]= useState<boolean>(false);
    const [ isUpperCaseEnabled, setIsUpperCaseEnabled ] = useState<boolean>(false);
    const [ isLowerCaseEnabled, setIsLowerCaseEnabled ] = useState<boolean>(false);
    const [ isNumericEnabled, setIsNumericEnabled ] = useState<boolean>(false);
    const [ askPasswordOption, setAskPasswordOption ] = useState<string>(VerificationOption.EMAIL_LINK);

    // Fallback to API if context is null
    useEffect(() => {
        if (!invitedUserRegistrationConfig) {
            getConnectorDetails(
                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID
            ).then((response: GovernanceConnectorInterface) => {
                setConnector(response);
            }).catch(() => {
                setConnector(undefined);
            });
        }
    }, [ invitedUserRegistrationConfig ]);

    /**
     * Flattens and resolved form connector values and field metadata.
     */
    useEffect(() => {
        if (isEmpty(connector?.properties)) {
            return;
        }

        let resolvedInitialValues: AskPasswordFormValuesInterface = null;

        connector.properties.map((property: ConnectorPropertyInterface) => {
            if (AskPasswordFormConstants.allowedConnectorFields.includes(property?.name)) {
                switch (property.name) {
                    case ServerConfigurationsConstants.ASK_PASSWORD_ENABLE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableInviteUserToSetPassword: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_LOCK_ON_CREATION:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableAccountLockOnCreation: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_ACCOUNT_ACTIVATION:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableAccountActivationEmail: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_EXPIRY_TIME:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            expiryTime: property.value
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_EMAIL_OTP:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableEmailOtp: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_SMS_OTP:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            enableSmsOtp: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_LOWERCASE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseLowercase: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_NUMERIC:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseNumeric: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_USE_UPPERCASE:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpUseUppercase: CommonUtils.parseBoolean(property.value)
                        };

                        break;
                    case ServerConfigurationsConstants.ASK_PASSWORD_OTP_LENGTH:
                        resolvedInitialValues = {
                            ...resolvedInitialValues,
                            otpLength: property.value
                        };

                        break;
                    default:
                        // Invalid type is not handled since the form is generated based on the allowed fields.
                        break;
                }
            }
        });
        setInvitedUserRegistrationConfig(resolvedInitialValues);
        setIsInviteUserToSetPasswordEnabled(resolvedInitialValues?.enableInviteUserToSetPassword);
        setIsUpperCaseEnabled(resolvedInitialValues?.otpUseUppercase);
        setIsLowerCaseEnabled(resolvedInitialValues?.otpUseLowercase);
        setIsNumericEnabled(resolvedInitialValues?.otpUseNumeric);
        if (resolvedInitialValues?.enableSmsOtp) {
            setAskPasswordOption(VerificationOption.SMS_OTP);
        } else if (resolvedInitialValues?.enableEmailOtp) {
            setAskPasswordOption(VerificationOption.EMAIL_OTP);
        } else {
            setAskPasswordOption(VerificationOption.EMAIL_LINK);
        }
    }, [ connector ]);

    // If configs are not loaded yet, show nothing
    if (!invitedUserRegistrationConfig) {
        return null;
    }

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography>
                <Alert severity="info">
                    <Trans i18nKey="flows:askPassword.steps.confirmationCode.description">
                        The <strong>Confirmation Code</strong>
                        step defines how the confirmation code is handled for the invited user.
                        You can configure the OTP length, expiry, and allowed character types.
                    </Trans>
                </Alert>
            </Typography>
        </Stack>
    );
};

export default ConfirmationCodeProperties;
