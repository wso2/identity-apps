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

export const getInboundProtocolLogos = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        oidc: import(`../../../themes/${ theme }/assets/images/protocols/oidc.png`),
        openid: import(`../../../themes/${ theme }/assets/images/protocols/openid.png`),
        "passive-sts": import(`../../../themes/${ theme }/assets/images/protocols/ws-fed.png`),
        saml: import(`../../../themes/${ theme }/assets/images/protocols/saml.png`),
        "ws-trust": import(`../../../themes/${ theme }/assets/images/protocols/ws-trust.png`),
        wsFed: import(`../../../themes/${ theme }/assets/images/protocols/ws-fed.png`),
        wsTrust: import(`../../../themes/${ theme }/assets/images/protocols/ws-trust.png`)
    };
};

export const getApplicationTemplateIllustrations = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        box: import(`../../../themes/${ theme }/assets/images/illustrations/box-template-illustration.svg`),
        customApp: import(`../../../themes/${ theme }/assets/images/illustrations/custom-app-illustration.svg`),
        oidcMobile: import(`../../../themes/${
            theme
        }/assets/images/illustrations/oidc-mobile-template-illustration.svg`),
        oidcWebApp: import(`../../../themes/${
            theme
        }/assets/images/illustrations/oidc-web-app-template-illustration.svg`),
        passiveSTS: import(`../../../themes/${
            theme
        }/assets/images/illustrations/passive-sts-template-illustration.svg`),
        samlWebApp: import(`../../../themes/${
            theme
        }/assets/images/illustrations/saml-web-app-template-illustration.svg`),
        slack: import(`../../../themes/${
            theme
        }/assets/images/illustrations/slack-template-illustration.svg`),
        spa: import(`../../../themes/${ theme }/assets/images/illustrations/spa-template-illustration.svg`),
        windowsNative: import(`../../../themes/${
            theme
        }/assets/images/illustrations/windows-template-illustration.svg`),
        workday: import(`../../../themes/${ theme }/assets/images/illustrations/workday-template-illustration.svg`),
        wsTrust: import(`../../../themes/${ theme }/assets/images/illustrations/ws-trust-template-illustration.svg`),
        zoom: import(`../../../themes/${ theme }/assets/images/illustrations/zoom-template-illustration.svg`)
    };
};

export const getApplicationWizardStepIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        general: import(`../../../themes/${ theme }/assets/images/icons/document-icon.svg`),
        protocolConfig: import(`../../../themes/${ theme }/assets/images/icons/gears-icon.svg`),
        protocolSelection: import(`../../../themes/${ theme }/assets/images/icons/spin-wheel-icon.svg`),
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

export const getHelpPanelIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        endpoints: {
            authorize: import(`../../../themes/${ theme }/assets/images/icons/authorize.svg`),
            certificate: import(`../../../themes/${ theme }/assets/images/icons/idp-certificate.svg`),
            introspect: import(`../../../themes/${ theme }/assets/images/icons/introspect.svg`),
            issuer: import(`../../../themes/${ theme }/assets/images/icons/issuer.svg`),
            jwks: import(`../../../themes/${ theme }/assets/images/icons/jwks.svg`),
            metadata: import(`../../../themes/${ theme }/assets/images/icons/metadata.svg`),
            samlSLO: import(`../../../themes/${ theme }/assets/images/icons/slo.svg`),
            samlSSO: import(`../../../themes/${ theme }/assets/images/icons/sso.svg`),
            token: import(`../../../themes/${ theme }/assets/images/icons/token.svg`),
            userInfo: import(`../../../themes/${ theme }/assets/images/icons/userInfo.svg`),
            wellKnown: import(`../../../themes/${ theme }/assets/images/icons/outline-icons/discovery-endpoint.svg`)
        },
        tabs: {
            docs: import(`../../../themes/${ theme }/assets/images/icons/open-book-icon.svg`),
            guide: import(`../../../themes/${ theme }/assets/images/icons/cog-wheel-icon.svg`),
            samples: import(`../../../themes/${ theme }/assets/images/icons/code-icon.svg`),
            sdks: import(`../../../themes/${ theme }/assets/images/icons/cube-stack-icon.svg`),
            whatsNext: import(`../../../themes/${ theme }/assets/images/icons/shuttle-icon.svg`)
        }
    };
};
