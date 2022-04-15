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

import BasicAuthIcon from "../../../themes/default/assets/images/authenticators/basic-auth.png";
import SMSOTPIcon from "../../../themes/default/assets/images/authenticators/sms-otp.svg";
import SalesforceLogo from "../../../themes/default/assets/images/connectors/salesforce.png";
import SCIMLogo from "../../../themes/default/assets/images/connectors/scim.png";
import SPMLLogo from "../../../themes/default/assets/images/connectors/spml.png";
import CertificateColoredIcon from "../../../themes/default/assets/images/icons/certificate-colored-icon.svg";
import ClockColoredIcon from "../../../themes/default/assets/images/icons/clock-colored-icon.svg";
import ConnectionIcon from "../../../themes/default/assets/images/icons/connection.svg";
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import MagicLinkLogo from "../../../themes/default/assets/images/icons/magic-link-icon.svg";
import FIDOLogo from "../../../themes/default/assets/images/icons/fingerprint.svg";
import { ReactComponent as GearsIcon } from "../../../themes/default/assets/images/icons/gears-icon.svg";
import MagnifierColoredIcon from "../../../themes/default/assets/images/icons/magnifier-colored-icon.svg";
import { ReactComponent as OpenBookIcon } from "../../../themes/default/assets/images/icons/open-book-icon.svg";
import TOTPIcon from "../../../themes/default/assets/images/icons/outline-icons/clock-outline.svg";
import { ReactComponent as ReportIcon } from "../../../themes/default/assets/images/icons/report-icon.svg";
import EmailOTPIcon from "../../../themes/default/assets/images/icons/solid-icons/email-solid.svg";
import {
    ReactComponent as ProvisionCapabilityIcon
} from "../../../themes/default/assets/images/identity-provider-capabilities/provision.svg";
import {
    ReactComponent as EnterpriseModeIdPIcon
} from "../../../themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";
import {
    ReactComponent as ExpertModeIdPIcon
} from "../../../themes/default/assets/images/identity-providers/expert-idp-illustration.svg";
import FacebookIdPIcon from "../../../themes/default/assets/images/identity-providers/facebook-idp-illustration.svg";
import GithubIdPIcon from "../../../themes/default/assets/images/identity-providers/github-idp-illustration.svg";
import GoogleIdPIcon from "../../../themes/default/assets/images/identity-providers/google-idp-illustration.svg";
import IWAKerberosIdPIllustration
    from "../../../themes/default/assets/images/identity-providers/iwa-idp-illustration.svg";
import Office365IdPIllustration
    from "../../../themes/default/assets/images/identity-providers/office365-idp-illustration.svg";
import {
    ReactComponent as TwitterIdPIllustration
} from "../../../themes/default/assets/images/identity-providers/twitter-idp-illustration.svg";
import {
    ReactComponent as YahooIdPIllustration
} from "../../../themes/default/assets/images/identity-providers/yahoo-idp-illustration.svg";
import OIDCLogo from "../../../themes/default/assets/images/protocols/openid-connect.png";
import OpenIDLogo from "../../../themes/default/assets/images/protocols/openid.png";
import SamlLogo from "../../../themes/default/assets/images/protocols/saml.png";
import WSFedLogo from "../../../themes/default/assets/images/protocols/ws-fed.png";
import FacebookLogo from "../../../themes/default/assets/images/social/facebook.svg";
import GoogleLogo from "../../../themes/default/assets/images/social/google.svg";
import TwitterLogo from "../../../themes/default/assets/images/social/twitter.svg";
import JWTLogo from "../../../themes/default/assets/images/technologies/jwt-logo.svg";
import AppleLogo
    from "../../../themes/default/assets/images/third-party/apple-logo.svg";
import LinkedInLogo
    from "../../../themes/default/assets/images/third-party/linkedin-logo.svg";
import MicrosoftLogo from "../../../themes/default/assets/images/third-party/microsoft-logo.svg";
import Office365Logo from "../../../themes/default/assets/images/third-party/office-365-logo.svg";
import YahooLogo from "../../../themes/default/assets/images/third-party/yahoo-logo.svg";
import { SupportedServices } from "../models";

export const getAddIDPCertificateWizardStepIcons = (): any => {

    return {
        general: DocumentIcon
    };
};

export const getIdentityProviderWizardStepIcons = (): any => {

    return {
        authenticatorSettings: GearsIcon,
        general: DocumentIcon,
        outboundProvisioningSettings: GearsIcon,
        summary: ReportIcon
    };
};

export const getAuthenticatorIcons = (): any => {

    return {
        basic: BasicAuthIcon,
        default: ConnectionIcon,
        emailOTP: EmailOTPIcon,
        facebook: FacebookLogo,
        fido: FIDOLogo,
        google: GoogleLogo,
        identifierFirst: MagnifierColoredIcon,
        jwtBasic: JWTLogo,
        magicLink: MagicLinkLogo,
        microsoft: MicrosoftLogo,
        office365: Office365Logo,
        sessionExecutor: ClockColoredIcon,
        smsOTP: SMSOTPIcon,
        totp: TOTPIcon,
        twitter: TwitterLogo,
        x509: CertificateColoredIcon,
        yahoo: YahooLogo
    };
};

export const getConnectorIcons = (): any => {

    return {
        google: GoogleIdPIcon,
        salesforce: SalesforceLogo,
        scim: SCIMLogo,
        spml: SPMLLogo
    };
};

export const getIdPIcons = (): any => {

    return {
        apple: AppleLogo,
        default: ConnectionIcon,
        emailOTP: EmailOTPIcon,
        enterprise: EnterpriseModeIdPIcon,
        facebook: FacebookIdPIcon,
        github: GithubIdPIcon,
        google: GoogleIdPIcon,
        iwaKerberos: IWAKerberosIdPIllustration,
        linkedIn: LinkedInLogo,
        microsoft: MicrosoftLogo,
        office365: Office365IdPIllustration,
        oidc: OIDCLogo,
        saml: SamlLogo,
        smsOTP: SMSOTPIcon,
        twitter: TwitterIdPIllustration,
        wsFed: WSFedLogo,
        yahoo: YahooIdPIllustration
    };
};

export const getIdPTemplateDocsIcons = (): any => {

    return {
        facebook: FacebookIdPIcon,
        github: GithubIdPIcon,
        google: GoogleIdPIcon,
        manualsetup: ExpertModeIdPIcon,
        openidconnect: OpenIDLogo
    };
};

export const getIdPCapabilityIcons = (): any => {

    return {
        [ SupportedServices.AUTHENTICATION ]: ConnectionIcon,
        [ SupportedServices.PROVISIONING ]: ProvisionCapabilityIcon
    };
};

export const getOutboundProvisioningConnectorWizard = (): any => {

    return {
        connectorDetails: DocumentIcon,
        connectorSelection: GearsIcon,
        summary: ReportIcon
    };
};

export const getHelpPanelIcons = (): any => {

    return {
        tabs: {
            docs: OpenBookIcon
        }
    };
};
