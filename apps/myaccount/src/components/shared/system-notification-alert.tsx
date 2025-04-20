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
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {  LinkButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { getPreference, resendVerificationLinkOrCode } from "../../api";
import { ProfileConstants as MyAccountProfileConstants, RecoveryScenario } from "../../constants";
import { SCIMConfigs } from "../../extensions/configs/scim";
import { AlertLevels, AuthStateInterface } from "../../models";
import { PreferenceConnectorResponse, PreferenceProperty, PreferenceRequest } from "../../models/preference";
import { AppState } from "../../store";
import { addAlert } from "../../store/actions";
import "./system-notification-alert.scss";

/**
 * SystemNotificationAlert component props.
 */
export type SystemNotificationAlertProps = IdentifiableComponentInterface;

/**
 * System Notification Alert component.
 *
 * @param props - Props injected into the component.
 * @returns ReactElement
 */
export const SystemNotificationAlert: FunctionComponent<SystemNotificationAlertProps> = (
    props: SystemNotificationAlertProps
): ReactElement | null => {
    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);

    const [ isSRSendOtpInEmailEnabled, setIsSRSendOtpInEmailEnabled ] = useState<boolean>(false);
    const [ isAccountStatePendingSR, setIsAccountStatePendingSR ] = useState<boolean>(false);
    const [ isPreferredChannelEmail, setIsPreferredChannelEmail ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        getSelfSignUpPreferences();
    }, []);

    useEffect(() => {
        const accountState: string = profileDetails
            ?.profileInfo
            ?.[SCIMConfigs?.scim?.systemSchema]
            ?.[ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(MyAccountProfileConstants.ACCOUNT_STATE)];

        const preferredChannel: string = profileDetails
            ?.profileInfo
            ?.[SCIMConfigs?.scim?.systemSchema]
            ?.[ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(MyAccountProfileConstants.PREFERRED_CHANNEL)];

        setIsAccountStatePendingSR(accountState === MyAccountProfileConstants.ACCOUNT_STATE_PENDING_SR);
        setIsPreferredChannelEmail(preferredChannel === MyAccountProfileConstants.PREFERRED_CHANNEL_EMAIL);
    }, [ profileDetails?.profileInfo ]);

    /**
     * Gets the self sign up account confirmation preferences.
     */
    const getSelfSignUpPreferences = (): void => {
        const selfSignUpConnector: PreferenceRequest[] = [ {
            "connector-name": ProfileConstants.SELF_SIGN_UP_CONNECTOR,
            properties: [ ProfileConstants.SELF_SIGN_UP_ENABLE_SEND_OTP_IN_EMAIL ]
        } ];

        getPreference(selfSignUpConnector)
            .then((response: PreferenceConnectorResponse[]) => {
                if (response) {
                    const selfSignUpOptions: PreferenceConnectorResponse[] = response;
                    const responseProperties: PreferenceProperty[] = selfSignUpOptions[0].properties;

                    const sendOtpInEmailProperty: PreferenceProperty = responseProperties?.find(
                        (prop: PreferenceProperty) =>
                            prop.name === ProfileConstants.SELF_SIGN_UP_ENABLE_SEND_OTP_IN_EMAIL
                    );
                    const isSendOtpInEmailEnabled: boolean = sendOtpInEmailProperty?.value === "true";

                    setIsSRSendOtpInEmailEnabled(isSendOtpInEmailEnabled);
                } else {
                    dispatch(addAlert({
                        description: t(
                            "myAccount:components.selfSignUp.preference.notifications.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.selfSignUp.preference.notifications.genericError.message"
                        )
                    }));
                }
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    dispatch(addAlert({
                        description: t(
                            "myAccount:components.selfSignUp.preference.notifications.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:components.selfSignUp.preference.notifications.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t(
                        "myAccount:components.selfSignUp.preference.notifications.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.selfSignUp.preference.notifications.genericError.message")
                }));
            });
    };

    /**
     * Resends the account confirmation Email link.
     */
    const resendAccountConfirmationLink = (): void => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        resendVerificationLinkOrCode(RecoveryScenario.SELF_SIGN_UP)
            .then(() => {
                dispatch(addAlert({
                    description: t("myAccount:components.systemNotificationAlert.selfSignUp." +
                        "notifications.resendSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("myAccount:components.systemNotificationAlert.selfSignUp." +
                        "notifications.resendSuccess.message")
                }));
            })
            .catch((errorMessage: AxiosError) => {
                dispatch(addAlert({
                    description: t("myAccount:components.systemNotificationAlert.selfSignUp." +
                        "notifications.resendError.description", { error: errorMessage }),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.systemNotificationAlert.selfSignUp." +
                        "notifications.resendError.message")
                }));
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    /*
    * The resending capability is available only when account confirmation is configured
    * to use an Email Link. The rationale for excluding Email OTP and SMS OTP confirmation
    *  methods is that their respective code validations must occur during the initial
    * user registration flow itself rather in a later stage via MyAccount.
    */
    if (isAccountStatePendingSR && isPreferredChannelEmail && !isSRSendOtpInEmailEnabled) {
        return (
            <Alert
                severity={ AlertLevels.WARNING }
                data-componentid={ componentId }
                className="system-notification-alert"
            >
                { t("myAccount:components.systemNotificationAlert.selfSignUp." +
                        "awaitingAccountConfirmation") }
                <LinkButton
                    onClick={ resendAccountConfirmationLink }
                    aria-disabled={ isSubmitting }
                    disabled={ isSubmitting }
                    data-testid={ `${ componentId }-resend-link` }
                >
                    { t("myAccount:components.systemNotificationAlert.resend") }
                </LinkButton>
            </Alert>
        );
    }

    return null;
};

/**
 * Default properties of {@link SystemNotificationAlert}
 */
SystemNotificationAlert.defaultProps = {
    "data-componentid": "system-notification-alert"
};

