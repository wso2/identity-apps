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

import BasicAuthIcon from "../../../themes/default/assets/images/authenticators/basic-auth.png";
import FIDOIcon from "../../../themes/default/assets/images/authenticators/fido-passkey-black.svg";
import SalesforceLogo from "../../../themes/default/assets/images/connectors/salesforce.png";
import SCIMLogo from "../../../themes/default/assets/images/connectors/scim.png";
import SPMLLogo from "../../../themes/default/assets/images/connectors/spml.png";
import FacebookLogo from "../../../themes/default/assets/images/identity-providers/facebook-idp-illustration.svg";
import GithubIdPIcon from "../../../themes/default/assets/images/identity-providers/github-idp-illustration.svg";
import GoogleLogo from "../../../themes/default/assets/images/identity-providers/google-idp-illustration.svg";
import KerberosLogo from "../../../themes/default/assets/images/identity-providers/kerberos.png";
import Office365Logo from "../../../themes/default/assets/images/identity-providers/office-365.svg";
import TrustedTokenIssuerIcon
    from "../../../themes/default/assets/images/identity-providers/trusted-token-issuer-illustration.svg";
import TwitterLogo from "../../../themes/default/assets/images/identity-providers/twitter.svg";
import YahooLogo from "../../../themes/default/assets/images/identity-providers/yahoo.svg";
import JWTLogo from "../../../themes/default/assets/images/technologies/jwt-logo.svg";
import AppleLogo from "../../../themes/default/assets/images/third-party/apple-logo.svg";
import MicrosoftLogo from "../../../themes/default/assets/images/third-party/microsoft-logo.svg";
import { SupportedServices } from "../models/connection";
import ConnectionIcon from "../resources/assets/images/icons/connection.svg";
import { ReactComponent as DefaultConnectionIcon
} from "../resources/assets/images/icons/default-connection-icon.svg";
import { ReactComponent as DocumentIcon } from "../resources/assets/images/icons/document-icon.svg";
import EmailOTPIcon from "../resources/assets/images/icons/email-otp.svg";
import { ReactComponent as EnterpriseConnectionIcon
} from "../resources/assets/images/icons/enterprise-icon.svg";
import { ReactComponent as GearsIcon } from "../resources/assets/images/icons/gears-icon.svg";
import MagicLinkIcon from "../resources/assets/images/icons/magic-link-icon.svg";
import OIDCConnectionIcon from "../resources/assets/images/icons/oidc-connection-icon.png";
import OrganizationSSOIcon from "../resources/assets/images/icons/organization-sso-icon.svg";
import {
    ReactComponent as ProvisionIcon
} from "../resources/assets/images/icons/provision.svg";
import { ReactComponent as ReportIcon } from "../resources/assets/images/icons/report-icon.svg";
import SAMLConnectionIcon from "../resources/assets/images/icons/saml-connection-icon.png";
import SMSOTPIcon from "../resources/assets/images/icons/sms-otp.svg";
import TOTPIcon from "../resources/assets/images/icons/totp.svg";
import WSFederationIcon from "../resources/assets/images/icons/ws-fed.png";

export const getConnectionWizardStepIcons = (): any => {

    return {
        authenticatorSettings: GearsIcon,
        general: DocumentIcon,
        outboundProvisioningSettings: GearsIcon,
        summary: ReportIcon
    };
};

export const getConnectorIcons = (): any => {

    return {
        google: GoogleLogo,
        salesforce: SalesforceLogo,
        scim: SCIMLogo,
        spml: SPMLLogo
    };
};

export const getConnectionIcons = (): any => {

    return {
        Microsoft: MicrosoftLogo,
        apple: AppleLogo,
        basic: BasicAuthIcon,
        basicAuthenticator: BasicAuthIcon,
        default: DefaultConnectionIcon,
        "email-otp-authenticator": EmailOTPIcon,
        emailOTP: EmailOTPIcon,
        enterprise: EnterpriseConnectionIcon,
        facebook: FacebookLogo,
        fido: FIDOIcon,
        githubAuthenticator: GithubIdPIcon,
        google: GoogleLogo,
        googleOIDCAuthenticator: GoogleLogo,
        iwaKerberos: KerberosLogo,
        jwtBasic: JWTLogo,
        magicLink: MagicLinkIcon,
        microsoft: MicrosoftLogo,
        office365: Office365Logo,
        oidc: OIDCConnectionIcon,
        organizationSSO: OrganizationSSOIcon,
        saml: SAMLConnectionIcon,
        smsOTP: SMSOTPIcon,
        totp: TOTPIcon,
        trustedTokenIssuer: TrustedTokenIssuerIcon,
        twitter: TwitterLogo,
        wsFed: WSFederationIcon,
        yahoo: YahooLogo
    };
};

export const getConnectionCapabilityIcons = (): any => {

    return {
        [ SupportedServices.AUTHENTICATION ]: ConnectionIcon,
        [ SupportedServices.PROVISIONING ]: ProvisionIcon
    };
};

export const getOutboundProvisioningConnectorWizardIcons = (): any => {

    return {
        connectorDetails: DocumentIcon,
        connectorSelection: GearsIcon,
        summary: ReportIcon
    };
};
