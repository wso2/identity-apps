/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Link, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps } from "semantic-ui-react";
import { addSMSPublisher, deleteSMSPublisher, useSMSNotificationSenders } from "../../../api/connections";
import { AuthenticatorManagementConstants } from "../../../constants/autheticator-constants";

/**
 * Interface for SMS OTP Authenticator Activation Section props.
 */
interface SmsOtpAuthenticatorActivationSectionInterface extends IdentifiableComponentInterface {
    onActivate: (isActivated: boolean) => void
}

/**
 * SMS OTP Authenticator Enable/Disable Section.
 *
 * @returns Functional component.
 */
export const SmsOtpAuthenticatorActivationSection: FunctionComponent<SmsOtpAuthenticatorActivationSectionInterface> = (
    props: SmsOtpAuthenticatorActivationSectionInterface
): ReactElement => {

    const { onActivate } = props;
    const { t } = useTranslation();
    const [ isEnableSMSOTP, setEnableSMSOTP ] = useState<boolean>(false);
    const dispatch: Dispatch = useDispatch();

    const {
        data: notificationSendersList,
        error: notificationSendersListFetchRequestError
    } = useSMSNotificationSenders();

    useEffect(() => {
        if (!notificationSendersListFetchRequestError) {
            if (notificationSendersList) {
                let enableSMSOTP: boolean = false;

                for (const notificationSender of notificationSendersList) {
                    const channelValues: {
                        key:string;
                        value:string;
                    }[] = notificationSender.properties ? notificationSender.properties : [];

                    if (notificationSender.name === "SMSPublisher" &&
                        (channelValues.filter((prop : { key:string, value:string }) =>
                            prop.key === "channel.type" && prop.value === "choreo")
                            .length > 0)
                    ) {
                        enableSMSOTP = true;

                        break;
                    }
                }
                setEnableSMSOTP(enableSMSOTP);
                onActivate(enableSMSOTP);
            }
        } else {
            dispatch(addAlert({
                description: t("extensions:develop.identityProviders.smsOTP.settings.errorNotifications" +
                    ".notificationSendersRetrievalError.description"),
                level: AlertLevels.ERROR,
                message:t("extensions:develop.identityProviders.smsOTP.settings.errorNotifications" +
                    ".notificationSendersRetrievalError.message")
            }));
        }
    }, [ notificationSendersList, notificationSendersListFetchRequestError ]);

    /**
     * Handle enable/disable SMS OTP.
     *
     * @param event - Event.
     * @param data - Data.
     */
    const handleUpdateSMSPublisher = ( event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        
        // Create SMS Publisher only if does not exist.
        if (notificationSendersList.length === 0) {
            if (data.checked) {
                // Add SMS Publisher when enabling the feature.
                addSMSPublisher().then(() => {
                    setEnableSMSOTP(true);
                    onActivate(true);
                }).catch(() => {
                    dispatch(addAlert({
                        description: t("extensions:develop.identityProviders.smsOTP.settings" +
                            ".errorNotifications.smsPublisherCreationError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.identityProviders.smsOTP.settings" +
                            ".errorNotifications.smsPublisherCreationError.message")
                    }));
                });
            } else {
                // Delete SMS Publisher when enabling the feature.
                deleteSMSPublisher().then(() => {
                    setEnableSMSOTP(false);
                    onActivate(false);
                }).catch((error: IdentityAppsApiException) => {
                    const errorType : string = error.code === AuthenticatorManagementConstants.ErrorMessages
                        .SMS_NOTIFICATION_SENDER_DELETION_ERROR_ACTIVE_SUBS.getErrorCode() ? "activeSubs" :
                        ( error.code === AuthenticatorManagementConstants.ErrorMessages
                            .SMS_NOTIFICATION_SENDER_DELETION_ERROR_CONNECTED_APPS.getErrorCode() ? "connectedApps"
                            : "generic" );
    
                    dispatch(addAlert({
                        description: t("extensions:develop.identityProviders.smsOTP.settings." +
                            `errorNotifications.smsPublisherDeletionError.${errorType}.description`),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.identityProviders.smsOTP.settings." +
                            `errorNotifications.smsPublisherDeletionError.${errorType}.message`)
                    }));
                });
            }
        } else {
            if (data.checked) {
                setEnableSMSOTP(true);
                onActivate(true);
            } else {
                setEnableSMSOTP(false);
                onActivate(false);
            }
        }
    };

    return (
        <>
            <Message
                type={ "info" }
            >
                <Trans
                    i18nKey={
                        "extensions:develop.identityProviders.smsOTP.settings.enableRequiredNote.message"
                    }
                >
                    Asgardeo publishes events to Choreo to enable SMS OTP, where Choreo webhooks will be used to
                    integrate with multiple services to publish OTP Notifications. Follow the
                    <Link link="https://wso2.com/asgardeo/docs/guides/authentication/mfa/add-smsotp-login/">
                    Add SMS OTP Guide</Link> to configure Choreo webhooks for Asgardeo publish events.
                </Trans>
            </Message>
            <Checkbox
                toggle
                label={ (!isEnableSMSOTP
                    ? t("extensions:develop.identityProviders.smsOTP.settings." +
                        "smsOtpEnableDisableToggle.labelEnable")
                    : t("extensions:develop.identityProviders.smsOTP.settings.smsOtpEnableDisableToggle.labelDisable"))
                }
                data-componentid="sms-otp-enable-toggle"
                checked={ isEnableSMSOTP }
                onChange={ (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps): void => {
                    handleUpdateSMSPublisher(event, data);
                } }
                className="feature-toggle"
            />
        </>
    );
};

/**
 * Default props for the component.
 */
SmsOtpAuthenticatorActivationSection.defaultProps = {
    "data-componentid": "sms-otp-authenticator-activation-section"
};
