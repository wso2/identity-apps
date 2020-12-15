/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AppConstants } from "../../core/constants";
import { SupportedServices } from "../models";

export const getAddIDPCertificateWizardStepIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        general: import(`../../../themes/${ theme }/assets/images/icons/document-icon.svg`)
    };
};

export const getIdentityProviderWizardStepIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        authenticatorSettings: import(`../../../themes/${ theme }/assets/images/icons/gears-icon.svg`),
        general: import(`../../../themes/${ theme }/assets/images/icons/document-icon.svg`),
        outboundProvisioningSettings: import(`../../../themes/${ theme }/assets/images/icons/gears-icon.svg`),
        summary: import(`../../../themes/${ theme }/assets/images/icons/report-icon.svg`)
    };
};

export const getAuthenticatorIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        basic: import(`../../../themes/${ theme }/assets/images/authenticators/basic-auth.png`),
        default: import(`../../../themes/${ theme }/assets/images/icons/lock-shield.svg`),
        emailOTP: import(`../../../themes/${ theme }/assets/images/authenticators/email-otp.svg`),
        facebook: import(`../../../themes/${ theme }/assets/images/social/facebook.svg`),
        fido: import(`../../../themes/${ theme }/assets/images/authenticators/fido.png`),
        google: import(`../../../themes/${ theme }/assets/images/social/google.svg`),
        identifierFirst: import(`../../../themes/${ theme }/assets/images/icons/magnifier-colored-icon.svg`),
        jwtBasic: import(`../../../themes/${ theme }/assets/images/technologies/jwt-logo.svg`),
        microsoft: import(`../../../themes/${ theme }/assets/images/third-party/microsoft-logo.svg`),
        office365: import(`../../../themes/${ theme }/assets/images/third-party/office-365-logo.svg`),
        sessionExecutor: import(`../../../themes/${ theme }/assets/images/icons/clock-colored-icon.svg`),
        smsOTP: import(`../../../themes/${ theme }/assets/images/authenticators/sms-otp.svg`),
        totp: import(`../../../themes/${ theme }/assets/images/authenticators/totp.png`),
        twitter: import(`../../../themes/${ theme }/assets/images/social/twitter.svg`),
        x509: import(`../../../themes/${ theme }/assets/images/icons/certificate-colored-icon.svg`),
        yahoo: import(`../../../themes/${ theme }/assets/images/third-party/yahoo-logo.svg`)
    };
};

export const getConnectorIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        google: import(`../../../themes/${ theme }/assets/images/identity-providers/google-idp-illustration.svg`),
        salesforce: import(`../../../themes/${ theme }/assets/images/connectors/salesforce.png`),
        scim: import(`../../../themes/${ theme }/assets/images/connectors/scim.png`),
        spml: import(`../../../themes/${ theme }/assets/images/connectors/spml.png`)
    };
};

export const getIdPIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        default: import(`../../../themes/${ theme }/assets/images/identity-provider-capabilities/authentication.svg`),
        emailOTP: import(`../../../themes/${ theme }/assets/images/authenticators/email-otp.svg`),
        expert: import(`../../../themes/${ theme }/assets/images/identity-providers/expert-idp-illustration.svg`),
        facebook: import(`../../../themes/${ theme }/assets/images/identity-providers/facebook-idp-illustration.svg`),
        github: import(`../../../themes/${ theme }/assets/images/identity-providers/github-idp-illustration.svg`),
        google: import(`../../../themes/${ theme }/assets/images/identity-providers/google-idp-illustration.svg`),
        iwaKerberos: import(`../../../themes/${ theme }/assets/images/identity-providers/iwa-idp-illustration.svg`),
        microsoft: import(`../../../themes/${ theme }/assets/images/identity-providers/microsoft-idp-illustration.svg`),
        office365: import(`../../../themes/${ theme }/assets/images/identity-providers/office365-idp-illustration.svg`),
        oidc: import(`../../../themes/${ theme }/assets/images/protocols/oidc.png`),
        saml: import(`../../../themes/${ theme }/assets/images/protocols/saml.png`),
        smsOTP: import(`../../../themes/${ theme }/assets/images/authenticators/sms-otp.svg`),
        twitter: import(`../../../themes/${ theme }/assets/images/identity-providers/twitter-idp-illustration.svg`),
        wsFed: import(`../../../themes/${ theme }/assets/images/protocols/ws-fed.png`),
        yahoo: import(`../../../themes/${ theme }/assets/images/identity-providers/yahoo-idp-illustration.svg`)
    };
};

export const getIdPTemplateDocsIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        facebook: import(`../../../themes/${ theme }/assets/images/identity-providers/facebook-idp-illustration.svg`),
        google: import(`../../../themes/${ theme }/assets/images/identity-providers/google-idp-illustration.svg`),
        manualsetup: import(`../../../themes/${ theme }/assets/images/identity-providers/expert-idp-illustration.svg`),
        openidconnect: import(`../../../themes/${ theme }/assets/images/protocols/openid.png`)
    };
};

export const getIdPCapabilityIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        [ SupportedServices.AUTHENTICATION ]: import(`../../../themes/${
            theme
        }/assets/images/identity-provider-capabilities/authentication.svg`),
        [ SupportedServices.PROVISIONING ]: import(`../../../themes/${
            theme
        }/assets/images/identity-provider-capabilities/provision.svg`)
    };
};

export const getOutboundProvisioningConnectorWizard = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        connectorDetails: import(`../../../themes/${ theme }/assets/images/icons/document-icon.svg`),
        connectorSelection: import(`../../../themes/${ theme }/assets/images/icons/gears-icon.svg`),
        summary: import(`../../../themes/${ theme }/assets/images/icons/report-icon.svg`)
    };
};

export const getHelpPanelIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        tabs: {
            docs: import(`../../../themes/${ theme }/assets/images/icons/open-book-icon.svg`)
        }
    };
};
