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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import { VerificationOption } from "@wso2is/admin.server-configurations.v1/models/ask-password";
import { ConnectorPropertyInterface } from "@wso2is/admin.server-configurations.v1/models/governance-connectors";
import { ProfileConstants } from "@wso2is/core/constants";
import { Claim, IdentifiableComponentInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import { Link, Message, Popup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid, Menu } from "semantic-ui-react";
import { AskPasswordOptionTypes } from "../../../../constants/user-management-constants";
import { isFieldDisplayableInUserCreationWizard } from "../../../../utils/user-management-utils";

/**
 * User add wizard Ask Password component props interface.
 */
interface AskPasswordOptionPropsInterface extends IdentifiableComponentInterface {
    profileSchema: ProfileSchemaInterface[];
    isInviteUserToSetPasswordEnabled: boolean;
    isEmailRequired: boolean;
    isEmailFilled: boolean;
    isValidEmail: boolean;
    selectedAskPasswordOption: AskPasswordOptionTypes;
    onAskPasswordOptionChange: (option: AskPasswordOptionTypes) => void;
    connectorProperties: ConnectorPropertyInterface[];
    isAttributeProfileForUserCreationEnabled: boolean;
    isMultipleEmailAndMobileNumberEnabled: boolean;
    isDistinctAttributeProfilesDisabled: boolean;
    localClaims: Claim[];
}

/**
 * User add wizard Ask Password component.
 */
const AskPasswordOption: FunctionComponent<AskPasswordOptionPropsInterface> = ({
    profileSchema,
    isInviteUserToSetPasswordEnabled,
    isEmailRequired,
    isEmailFilled,
    isValidEmail,
    selectedAskPasswordOption,
    onAskPasswordOptionChange,
    connectorProperties,
    isAttributeProfileForUserCreationEnabled,
    isMultipleEmailAndMobileNumberEnabled,
    isDistinctAttributeProfilesDisabled,
    localClaims,
    ["data-componentid"]: componentId = "ask-password-option"
}: AskPasswordOptionPropsInterface): ReactElement => {
    const { t } = useTranslation();

    /**
     * Process connector properties to determine ask password verification option.
     */
    const askPasswordVerificationOption: VerificationOption = useMemo(() => {
        if (!connectorProperties) {
            return;
        }

        const smsOTPConnector: ConnectorPropertyInterface = connectorProperties.find(
            (property: ConnectorPropertyInterface) =>
                property.name === ServerConfigurationsConstants.ASK_PASSWORD_SMS_OTP
        );

        if (smsOTPConnector?.value === "true") {
            return VerificationOption.SMS_OTP;
        }

        const emailOTPConnector: ConnectorPropertyInterface = connectorProperties.find(
            (property: ConnectorPropertyInterface) =>
                property.name === ServerConfigurationsConstants.ASK_PASSWORD_EMAIL_OTP
        );

        if (emailOTPConnector?.value === "true") {
            return VerificationOption.EMAIL_OTP;
        }

        return VerificationOption.EMAIL_LINK;
    }, [ connectorProperties ]);

    /**
     * Check whether mobile field is available for user creation.
     *
     * @returns isMobileFieldAvailable - whether mobile field is available.
     */
    const isMobileFieldAvailable = (): boolean => {
        if (!isAttributeProfileForUserCreationEnabled || !profileSchema) {
            return false;
        }

        const mobileNumbersSchema: ProfileSchemaInterface = profileSchema?.find(
            (schema: ProfileSchemaInterface) => schema.name === ProfileConstants
                .SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS"));
        const mobileSchema: ProfileSchemaInterface = profileSchema?.find(
            (schema: ProfileSchemaInterface) => schema.name === ProfileConstants
                .SCIM2_SCHEMA_DICTIONARY.get("MOBILE"));

        // Check if multiple mobile numbers field is available
        if (isMultipleEmailAndMobileNumberEnabled && mobileNumbersSchema &&
            isFieldDisplayableInUserCreationWizard(mobileNumbersSchema, isDistinctAttributeProfilesDisabled)) {
            return true;
        }

        // Check if single mobile field is available
        if (isFieldDisplayableInUserCreationWizard(mobileSchema, isDistinctAttributeProfilesDisabled)) {
            return true;
        }

        return false;
    };

    const renderAskPasswordOptionPopupContent = (): ReactElement => {
        if (!isInviteUserToSetPasswordEnabled) {
            return (
                <Trans
                    i18nKey="user:modals.addUserWizard.askPassword.emailVerificationDisabled"
                >
                    To invite users to set the password, enable email invitations for user password setup from <Link
                        onClick={ () => history.push(AppConstants.getPaths().get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                            .replace(":connectorId", ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID)) }
                        external={ false }
                    >Login & Registration settings</Link>.
                </Trans>
            );
        }

        if (askPasswordVerificationOption === VerificationOption.SMS_OTP && !isMobileFieldAvailable()) {
            const mobileClaimId: string = localClaims?.find(
                (attribute: Claim) =>
                    attribute?.[ClaimManagementConstants.CLAIM_URI_ATTRIBUTE_KEY] ===
                    ClaimManagementConstants.MOBILE_CLAIM_URI
            )?.id || "";

            return (
                <Trans
                    i18nKey="user:modals.addUserWizard.askPassword.mobileNumberAlreadyExists"
                >
                    Please enable mobile as required field <Link
                        onClick={ () => {
                            const editClaimPath: string = AppConstants.getPaths()
                                .get("LOCAL_CLAIMS_EDIT")
                                .replace(":id", mobileClaimId);

                            history.push(editClaimPath);
                        } }
                        external={ false }
                    >Mobile Attribute Settings</Link>.
                </Trans>
            );
        }

        if (!isEmailFilled || !isValidEmail) {
            return t(
                "user:modals.addUserWizard.askPassword.emailInvalid"
            );
        }

        return null;
    };

    /**
     * Get the message icon based on the verification option.
     *
     * @returns The icon name for the message.
     */
    const getMessageIcon = (): string => {
        switch (askPasswordVerificationOption) {
            case VerificationOption.EMAIL_OTP:
            case VerificationOption.EMAIL_LINK:
                return "mail";
            case VerificationOption.SMS_OTP:
                return "mobile";
            default:
                return "mail";
        }
    };

    /**
     * Get the message content based on the verification option.
     *
     * @returns The translated message content.
     */
    const getMessageContent = (): string => {
        switch (askPasswordVerificationOption) {
            case VerificationOption.EMAIL_OTP:
                return t("extensions:manage.features.user.addUser.inviteUserTooltip.emailOTPInviteTooltip");
            case VerificationOption.SMS_OTP:
                return t("extensions:manage.features.user.addUser.inviteUserTooltip.smsOTPInviteTooltip");
            case VerificationOption.EMAIL_LINK:
            default:
                return t("extensions:manage.features.user.addUser.inviteUserTooltip.emailLinkInviteTooltip");
        }
    };

    /**
     * Get the menu item text for the invite online option.
     * Decided based on the verification option.
     *
     * @returns The translated menu item text.
     */
    const getInviteOnlineMenuItemText = (): string => {
        switch (askPasswordVerificationOption) {
            case VerificationOption.SMS_OTP:
                return t("user:modals.addUserWizard.askPassword.inviteViaSMS");
            case VerificationOption.EMAIL_OTP:
            case VerificationOption.EMAIL_LINK:
            default:
                return t("user:modals.addUserWizard.askPassword.inviteViaEmail");
        }
    };

    return (
        <div className="mt-4 mb-4 ml-4" data-componentid={ componentId }>
            <Menu
                compact={ true }
                size="small"
                className="mb-4"
            >
                {
                    (!isInviteUserToSetPasswordEnabled ||
                        ((askPasswordVerificationOption === VerificationOption.EMAIL_OTP ||
                            askPasswordVerificationOption === VerificationOption.EMAIL_LINK) &&
                            !isEmailRequired && !isValidEmail) ||
                        (askPasswordVerificationOption === VerificationOption.SMS_OTP && !isMobileFieldAvailable())) ? (
                            <Popup
                                basic
                                inverted
                                position="top center"
                                content={ renderAskPasswordOptionPopupContent() }
                                hoverable
                                trigger={
                                    (
                                        <Menu.Item
                                            name={ getInviteOnlineMenuItemText() }
                                            disabled
                                        />
                                    )
                                }
                            />
                        ) : (
                            <Menu.Item
                                name={ getInviteOnlineMenuItemText() }
                                active={ selectedAskPasswordOption === AskPasswordOptionTypes.EMAIL }
                                onClick={ () => onAskPasswordOptionChange(AskPasswordOptionTypes.EMAIL) }
                            />
                        )
                }
                <Menu.Item
                    name={ t("user:modals.addUserWizard.askPassword.inviteOffline") }
                    active={ selectedAskPasswordOption === AskPasswordOptionTypes.OFFLINE }
                    onClick={ () => onAskPasswordOptionChange(AskPasswordOptionTypes.OFFLINE) }
                />
            </Menu>

            { selectedAskPasswordOption === AskPasswordOptionTypes.EMAIL && (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <Message
                            icon={ getMessageIcon() }
                            content={ getMessageContent() }
                            size="small"
                        />
                    </Grid.Column>
                </Grid.Row>
            ) }

            { selectedAskPasswordOption === AskPasswordOptionTypes.OFFLINE && (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <Message
                            icon="copy"
                            content={ t(
                                "extensions:manage.features.user.addUser.inviteUserOfflineTooltip"
                            ) }
                            size="small"
                        />
                    </Grid.Column>
                </Grid.Row>
            ) }
        </div>
    );
};

export default AskPasswordOption;
