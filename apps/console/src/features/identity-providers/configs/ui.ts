/**
 * Copyright (c) 2019-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { identityProviderConfig } from "../../../extensions/configs/identity-provider";
import BasicAuthIcon from "../../../themes/default/assets/images/authenticators/basic-auth.png";
import SMSOTPIcon from "../../../themes/default/assets/images/authenticators/sms-otp.svg";
import SalesforceLogo from "../../../themes/default/assets/images/connectors/salesforce.png";
import SCIMLogo from "../../../themes/default/assets/images/connectors/scim.png";
import SPMLLogo from "../../../themes/default/assets/images/connectors/spml.png";
import BackupCodesAuthenticatorLogo from "../../../themes/default/assets/images/icons/backup-code-icon.svg";
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
import HyprLogo from "../../../themes/default/assets/images/identity-providers/hypr.svg";
import KerberosLogo from "../../../themes/default/assets/images/identity-providers/kerberos.png";
import Office365Logo from "../../../themes/default/assets/images/identity-providers/office-365.svg";
import OrganizationSSOIcon from "../../../themes/default/assets/images/identity-providers/organization-sso.svg";
import TrustedTokenIssuerIcon 
    from "../../../themes/default/assets/images/identity-providers/trusted-token-issuer-illustration.svg";
import TwitterLogo from "../../../themes/default/assets/images/identity-providers/twitter.svg";
import YahooLogo from "../../../themes/default/assets/images/identity-providers/yahoo.svg";
import OIDCLogo from "../../../themes/default/assets/images/protocols/openid-connect.png";
import OpenIDLogo from "../../../themes/default/assets/images/protocols/openid.png";
import SamlLogo from "../../../themes/default/assets/images/protocols/saml.png";
import WSFedLogo from "../../../themes/default/assets/images/protocols/ws-fed.png";
import JWTLogo from "../../../themes/default/assets/images/technologies/jwt-logo.svg";
import AppleLogo from "../../../themes/default/assets/images/third-party/apple-logo.svg";
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
        apple: AppleLogo,
        backupCode: BackupCodesAuthenticatorLogo,
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
        hypr: HyprLogo,
        iwaKerberos: KerberosLogo,
        linkedIn: LinkedInLogo,
        microsoft: MicrosoftLogo,
        office365: Office365Logo,
        oidc: OIDCLogo,
        organizationSSO:  OrganizationSSOIcon,
        saml: SamlLogo,
        smsOTP: SMSOTPIcon,
        trustedTokenIssuer: TrustedTokenIssuerIcon,
        twitter: TwitterLogo,
        wsFed: WSFedLogo,
        yahoo: YahooLogo,
        ...identityProviderConfig.getIconExtensions()
    };
};

export const getIdPTemplateDocsIcons = (): any => {

    return {
        apple: AppleLogo,
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
