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

import { identityProviderConfig } from "../../../extensions/configs/identity-provider";
import BasicAuthIcon from "../../../themes/default/assets/images/authenticators/basic-auth.png";
import SMSOTPIcon from "../../../themes/default/assets/images/authenticators/sms-otp.svg";
import SalesforceLogo from "../../../themes/default/assets/images/connectors/salesforce.png";
import SCIMLogo from "../../../themes/default/assets/images/connectors/scim.png";
import SPMLLogo from "../../../themes/default/assets/images/connectors/spml.png";
import CertificateColoredIcon from "../../../themes/default/assets/images/icons/certificate-colored-icon.svg";
import ClockColoredIcon from "../../../themes/default/assets/images/icons/clock-colored-icon.svg";
import ConnectionIcon from "../../../themes/default/assets/images/icons/connection.svg";
import { ReactComponent as DocumentIcon } from "../../../themes/default/assets/images/icons/document-icon.svg";
import FIDOLogo from "../../../themes/default/assets/images/icons/fingerprint.svg";
import { ReactComponent as GearsIcon } from "../../../themes/default/assets/images/icons/gears-icon.svg";
import MagicLinkLogo from "../../../themes/default/assets/images/icons/magic-link-icon.svg";
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
} from "../../../themes/default/assets/images/identity-providers/expert.svg";
import FacebookLogo from "../../../themes/default/assets/images/identity-providers/facebook-idp-illustration.svg";
import GithubIdPIcon from "../../../themes/default/assets/images/identity-providers/github-idp-illustration.svg";
import GoogleLogo from "../../../themes/default/assets/images/identity-providers/google-idp-illustration.svg";
import KerberosLogo from "../../../themes/default/assets/images/identity-providers/kerberos.png";
import Office365Logo from "../../../themes/default/assets/images/identity-providers/office-365.svg";
import OrganizationSSOIcon from "../../../themes/default/assets/images/identity-providers/organization-sso.svg";
import TwitterLogo from "../../../themes/default/assets/images/identity-providers/twitter.svg";
import YahooLogo from "../../../themes/default/assets/images/identity-providers/yahoo.svg";
import OIDCLogo from "../../../themes/default/assets/images/protocols/openid-connect.png";
import OpenIDLogo from "../../../themes/default/assets/images/protocols/openid.png";
import SamlLogo from "../../../themes/default/assets/images/protocols/saml.png";
import WSFedLogo from "../../../themes/default/assets/images/protocols/ws-fed.png";
import JWTLogo from "../../../themes/default/assets/images/technologies/jwt-logo.svg";
import AppleLogo
    from "../../../themes/default/assets/images/third-party/apple-logo.svg";
import LinkedInLogo
    from "../../../themes/default/assets/images/third-party/linkedin-logo.svg";
import MicrosoftLogo from "../../../themes/default/assets/images/third-party/microsoft-logo.svg";
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
        google: GoogleLogo,
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
        expert: ExpertModeIdPIcon,
        facebook: FacebookLogo,
        github: GithubIdPIcon,
        google: GoogleLogo,
        iwaKerberos: KerberosLogo,
        linkedIn: LinkedInLogo,
        microsoft: MicrosoftLogo,
        office365: Office365Logo,
        oidc: OIDCLogo,
        organizationSSO:  OrganizationSSOIcon,
        saml: SamlLogo,
        smsOTP: SMSOTPIcon,
        twitter: TwitterLogo,
        wsFed: WSFedLogo,
        yahoo: YahooLogo,
        ...identityProviderConfig.getIconExtensions()
    };
};

export const getIdPTemplateDocsIcons = (): any => {

    return {
        facebook: FacebookLogo,
        github: GithubIdPIcon,
        google: GoogleLogo,
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
