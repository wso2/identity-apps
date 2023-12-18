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
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { Heading, InfoCard, useMediaContext } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Segment } from "semantic-ui-react";
import { identityProviderConfig } from "../../../../../extensions/configs/identity-provider";
import useAuthenticationFlow from "../../../../authentication-flow-builder/hooks/use-authentication-flow";
import { EventPublisher, FeatureConfigInterface } from "../../../../core";
import {
    IdentityProviderManagementConstants
} from "../../../../identity-providers/constants/identity-provider-management-constants";
import { OrganizationType } from "../../../../organizations/constants";
import { useGetCurrentOrganizationType } from "../../../../organizations/hooks/use-get-organization-type";
import { getAuthenticatorIcons } from "../../../configs/ui";
import { LoginFlowTypes } from "../../../models";

/**
 * Prop-types for the sign in methods landing component.
 */
interface SignInMethodLandingPropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Client ID of the application.
     */
    clientId?: string;
    /**
     * Callback to set the selected login flow option.
     */
    onLoginFlowSelect: (type: LoginFlowTypes) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Set of login flow options to hide.
     */
    hiddenOptions?: LoginFlowTypes[];
    [ "data-componentid" ]?: string;
}

/**
 * Landing component for Application Sign-in method configurations.
 *
 * @param props - Props injected to the component.
 * @returns Sign In Methods Landing component.
 */
export const SignInMethodLanding: FunctionComponent<SignInMethodLandingPropsInterface> = (
    props: SignInMethodLandingPropsInterface
): ReactElement => {
    const {
        isLoading,
        onLoginFlowSelect,
        hiddenOptions,
        clientId,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();
    const { hiddenAuthenticators } = useAuthenticationFlow();

    const { organizationType } = useGetCurrentOrganizationType();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    return (
        <Segment
            data-componentid={ componentId }
            loading={ isLoading }
            className="sign-in-method-landing"
            basic
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <Heading as="h2" textAlign={ isMobileViewport ? "center" : "left" }>
                            { t(
                                "console:develop.features.applications.edit.sections.signOnMethod.sections." +
                                "landing.flowBuilder.heading"
                            ) }
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="pt-5">
                    <Grid.Column computer={ 8 } tablet={ 16 } mobile={ 16 } className="flow-options-column">
                        <div className="pr-3">
                            { !hiddenOptions.includes(LoginFlowTypes.DEFAULT) && (
                                <>
                                    <Heading as="h4">
                                        { t(
                                            "console:develop.features.applications.edit." +
                                            "sections.signOnMethod.sections." +
                                            "landing.flowBuilder.headings.default"
                                        ) }
                                    </Heading>
                                    <InfoCard
                                        fluid
                                        data-componentid="basic-configuration-flow-card"
                                        image={ getAuthenticatorIcons().basic }
                                        imageSize="mini"
                                        header={ t(
                                            "console:develop.features.applications.edit.sections.signOnMethod." +
                                            "sections.landing.flowBuilder.types.defaultConfig.heading"
                                        ) }
                                        description={ t(
                                            "console:develop.features.applications.edit.sections.signOnMethod." +
                                            "sections.landing.flowBuilder.types.defaultConfig.description"
                                        ) }
                                        onClick={ () => {
                                            eventPublisher.publish(
                                                "application-begin-sign-in-default-configuration",
                                                { "client-id": clientId }
                                            );
                                            onLoginFlowSelect(LoginFlowTypes.DEFAULT);
                                        } }
                                        showSetupGuideButton={ false }
                                        showCardAction={ false }
                                    />
                                </>
                            ) }
                            <Heading as="h4">
                                { t(
                                    "console:develop.features.applications.edit." +
                                    "sections.signOnMethod.sections." +
                                    "landing.flowBuilder.headings.multiFactorLogin"
                                ) }
                            </Heading>
                            { !hiddenOptions.includes(LoginFlowTypes.SECOND_FACTOR_TOTP) && (
                                <InfoCard
                                    fluid
                                    data-componentid="totp-mfa-flow-card"
                                    image={ getAuthenticatorIcons().totp }
                                    imageSize="mini"
                                    header={ t(
                                        "console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder.types.totp.heading"
                                    ) }
                                    description={ t(
                                        "console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder.types.totp.description"
                                    ) }
                                    onClick={ () => {
                                        eventPublisher.publish(
                                            "application-begin-sign-in-totp-mfa",
                                            { "client-id": clientId }
                                        );
                                        onLoginFlowSelect(LoginFlowTypes.SECOND_FACTOR_TOTP);
                                    } }
                                    showSetupGuideButton={ false }
                                    showCardAction={ false }
                                />
                            ) }
                            { !hiddenOptions.includes(LoginFlowTypes.SECOND_FACTOR_EMAIL_OTP) && (
                                <InfoCard
                                    fluid
                                    data-componentid="email-otp-mfa-flow-card"
                                    image={ getAuthenticatorIcons().emailOTP }
                                    imageSize="mini"
                                    header={ t(
                                        "console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder.types.emailOTP.heading"
                                    ) }
                                    description={ t(
                                        "console:develop.features.applications.edit.sections" +
                                        ".signOnMethod.sections.landing.flowBuilder.types.emailOTP.description"
                                    ) }
                                    onClick={ () => {
                                        eventPublisher.publish("application-begin-sign-in-email-otp-mfa", {
                                            "client-id": clientId
                                        });
                                        onLoginFlowSelect(LoginFlowTypes.SECOND_FACTOR_EMAIL_OTP);
                                    } }
                                    showSetupGuideButton={ false }
                                    showCardAction={ false }
                                />
                            ) }
                            {
                                (!hiddenOptions.includes(LoginFlowTypes.SECOND_FACTOR_SMS_OTP) &&
                                    !(organizationType === OrganizationType.SUBORGANIZATION &&
                                    identityProviderConfig?.disableSMSOTPInSubOrgs)) && (
                                    <InfoCard
                                        fluid
                                        data-componentid="sms-otp-mfa-flow-card"
                                        image={ getAuthenticatorIcons().smsOTP }
                                        imageSize="mini"
                                        header={ t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder.types.smsOTP.heading"
                                        ) }
                                        description={ t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder.types.smsOTP.description"
                                        ) }
                                        onClick={ () => {
                                            eventPublisher.publish(
                                                "application-begin-sign-in-sms-otp-mfa",
                                                { "client-id": clientId }
                                            );
                                            onLoginFlowSelect(LoginFlowTypes.SECOND_FACTOR_SMS_OTP);
                                        } }
                                        showSetupGuideButton={ false }
                                        showCardAction={ false }
                                    />
                                )
                            }
                        </div>
                    </Grid.Column>
                    <Grid.Column computer={ 8 } tablet={ 16 } mobile={ 16 } className="flow-options-column">
                        <div className="pl-3">
                            <Heading as="h4">
                                { t(
                                    "console:develop.features.applications.edit." +
                                    "sections.signOnMethod.sections." +
                                    "landing.flowBuilder.headings.passwordlessLogin"
                                ) }
                            </Heading>
                            { !hiddenOptions?.includes(LoginFlowTypes.FIDO_LOGIN) &&
                                !hiddenAuthenticators?.includes(
                                    IdentityProviderManagementConstants.FIDO_AUTHENTICATOR
                                ) && (
                                <InfoCard
                                    fluid
                                    data-componentid="usernameless-flow-card"
                                    image={ getAuthenticatorIcons().fido }
                                    imageSize="mini"
                                    header={ t(
                                        "console:develop.features.applications.edit.sections.signOnMethod" +
                                        ".sections.landing.flowBuilder.types.passkey.heading")
                                    }
                                    description={ t(
                                        "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.passkey.description"
                                    ) }
                                    onClick={ () => {
                                        eventPublisher.publish(
                                            "application-begin-sign-in-biometrics-password-less",
                                            { "client-id": clientId }
                                        );
                                        onLoginFlowSelect(LoginFlowTypes.FIDO_LOGIN);
                                    } }
                                    showSetupGuideButton={ false }
                                    showCardAction={ false }
                                />
                            ) }
                            { !hiddenOptions?.includes(LoginFlowTypes.MAGIC_LINK) &&
                                !hiddenAuthenticators?.includes(
                                    IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR
                                ) && (
                                <InfoCard
                                    fluid
                                    data-componentid="magic-link-flow-card"
                                    image={ getAuthenticatorIcons().magicLink }
                                    imageSize="mini"
                                    header={ t(
                                        "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.magicLink.heading"
                                    ) }
                                    description={ t(
                                        "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.magicLink.description"
                                    ) }
                                    onClick={ () => {
                                        eventPublisher.publish(
                                            "application-begin-sign-in-magiclink-password-less",
                                            { "client-id": clientId }
                                        );
                                        onLoginFlowSelect(LoginFlowTypes.MAGIC_LINK);
                                    } }
                                    showSetupGuideButton={ false }
                                    showCardAction={ false }
                                />
                            ) }
                            { !hiddenOptions?.includes(LoginFlowTypes.EMAIL_OTP) &&
                                !hiddenAuthenticators?.includes(
                                    IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID
                                ) && (
                                <InfoCard
                                    fluid
                                    data-componentid="email-otp-flow-card"
                                    image={ getAuthenticatorIcons().emailOTP }
                                    imageSize="mini"
                                    header={ t(
                                        "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.emailOTPFirstFactor.heading"
                                    ) }
                                    description={ t(
                                        "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.landing.flowBuilder." +
                                            "types.emailOTPFirstFactor.description"
                                    ) }
                                    onClick={ () => {
                                        eventPublisher.publish(
                                            "application-begin-sign-in-email-otp-password-less",
                                            { "client-id": clientId }
                                        );
                                        onLoginFlowSelect(LoginFlowTypes.EMAIL_OTP);
                                    } }
                                    showSetupGuideButton={ false }
                                    showCardAction={ false }
                                />
                            ) }
                            { (!hiddenOptions.includes(LoginFlowTypes.GOOGLE_LOGIN) ||
                                !hiddenOptions.includes(LoginFlowTypes.FACEBOOK_LOGIN) ||
                                !hiddenOptions.includes(LoginFlowTypes.GITHUB_LOGIN) ||
                                !hiddenOptions.includes(LoginFlowTypes.MICROSOFT_LOGIN) ||
                                !hiddenOptions.includes(LoginFlowTypes.APPLE_LOGIN)) && (
                                <>
                                    <Heading as="h4">
                                        { t(
                                            "console:develop.features.applications.edit." +
                                            "sections.signOnMethod.sections." +
                                            "landing.flowBuilder.headings.socialLogin"
                                        ) }
                                    </Heading>
                                    { !hiddenOptions.includes(LoginFlowTypes.GOOGLE_LOGIN) && (
                                        <InfoCard
                                            fluid
                                            data-componentid="google-login-flow-card"
                                            imageSize="mini"
                                            image={ getAuthenticatorIcons().google }
                                            header={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder.types.google.heading"
                                            ) }
                                            description={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder." +
                                                "types.google.description"
                                            ) }
                                            onClick={ () => {
                                                eventPublisher.publish(
                                                    "application-begin-sign-in-google-social-login",
                                                    { type: clientId }
                                                );
                                                onLoginFlowSelect(LoginFlowTypes.GOOGLE_LOGIN);
                                            } }
                                            showSetupGuideButton={ false }
                                            showCardAction={ false }
                                        />
                                    ) }

                                    { !hiddenOptions.includes(LoginFlowTypes.GITHUB_LOGIN) && (
                                        <InfoCard
                                            fluid
                                            data-componentid="github-login-flow-card"
                                            imageSize="mini"
                                            image={ getAuthenticatorIcons().github }
                                            header={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder.types.github.heading"
                                            ) }
                                            description={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder." +
                                                "types.github.description"
                                            ) }
                                            onClick={ () => onLoginFlowSelect(LoginFlowTypes.GITHUB_LOGIN) }
                                            showSetupGuideButton={ false }
                                            showCardAction={ false }
                                        />
                                    ) }
                                    { !hiddenOptions.includes(LoginFlowTypes.FACEBOOK_LOGIN) && (
                                        <InfoCard
                                            fluid
                                            data-componentid="facebook-login-flow-card"
                                            imageSize="mini"
                                            image={ getAuthenticatorIcons().facebook }
                                            header={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder.types.facebook.heading"
                                            ) }
                                            description={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder." +
                                                "types.facebook.description"
                                            ) }
                                            onClick={ () => onLoginFlowSelect(LoginFlowTypes.FACEBOOK_LOGIN) }
                                            showSetupGuideButton={ false }
                                            showCardAction={ false }
                                        />
                                    ) }
                                    { !hiddenOptions.includes(LoginFlowTypes.MICROSOFT_LOGIN) && (
                                        <InfoCard
                                            fluid
                                            data-componentid="microsoft-login-flow-card"
                                            imageSize="mini"
                                            image={ getAuthenticatorIcons().microsoft }
                                            header={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder.types.microsoft.heading"
                                            ) }
                                            description={ t(
                                                "console:develop.features.applications.edit.sections" +
                                                ".signOnMethod.sections.landing.flowBuilder." +
                                                "types.microsoft.description"
                                            ) }
                                            onClick={ () => {
                                                eventPublisher.publish(
                                                    "application-begin-sign-in-microsoft-social-login",
                                                    { type: clientId }
                                                );
                                                onLoginFlowSelect(LoginFlowTypes.MICROSOFT_LOGIN);
                                            } }
                                            showSetupGuideButton={ false }
                                            showCardAction={ false }
                                        />
                                    ) }
                                    { !hiddenOptions.includes(LoginFlowTypes.APPLE_LOGIN) && (
                                        <InfoCard
                                            fluid
                                            data-componentid="apple-login-flow-card"
                                            imageSize="mini"
                                            image={ getAuthenticatorIcons().apple }
                                            header={
                                                t("console:develop.features.applications.edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder.types.apple.heading")
                                            }
                                            description={
                                                t("console:develop.features.applications.edit.sections" +
                                                    ".signOnMethod.sections.landing.flowBuilder." +
                                                    "types.apple.description")
                                            }
                                            onClick={ () => onLoginFlowSelect(LoginFlowTypes.APPLE_LOGIN) }
                                            showSetupGuideButton={ false }
                                            showCardAction={ false }
                                        />
                                    ) }
                                </>
                            ) }
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

/**
 * Default props for the Application Sign-in method landing component.
 */
SignInMethodLanding.defaultProps = {
    "data-componentid": "sign-in-method-landing",
    hiddenOptions: [ LoginFlowTypes.FACEBOOK_LOGIN, LoginFlowTypes.GITHUB_LOGIN ]
};
