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

import { SupportedServices } from "../models";
import { ReactComponent as AppIcon } from "../themes/dark/assets/images/icons/app-icon.svg";
import BasicAuthIcon from "../themes/default/assets/images/authenticators/basic-auth.png";
import { ReactComponent as EmailOTPIcon } from "../themes/default/assets/images/authenticators/email-otp.svg";
import FIDOLogo from "../themes/default/assets/images/authenticators/fido.png";
import { ReactComponent as SMSOTPIcon } from "../themes/default/assets/images/authenticators/sms-otp.svg";
import TOTPIcon from "../themes/default/assets/images/authenticators/totp.png";
import SalesforceLogo from "../themes/default/assets/images/connectors/salesforce.png";
import SCIMLogo from "../themes/default/assets/images/connectors/scim.png";
import SPMLLogo from "../themes/default/assets/images/connectors/spml.png";
import { ReactComponent as AlertIcon } from "../themes/default/assets/images/icons/alert-icon.svg";
import { ReactComponent as ArrowRight } from "../themes/default/assets/images/icons/arrow-right-icon.svg";
import { ReactComponent as AuthorizeIcon } from "../themes/default/assets/images/icons/authorize.svg";
import {
    ReactComponent as BlockedMagnifierIcon
} from "../themes/default/assets/images/icons/blocked-magnifier-icon.svg";
import { ReactComponent as BoxIcon } from "../themes/default/assets/images/icons/box-icon.svg";
import { ReactComponent as BuildingIcon } from "../themes/default/assets/images/icons/building-icon.svg";
import { ReactComponent as CaretRightIcon } from "../themes/default/assets/images/icons/caret-right-icon.svg";
import { ReactComponent as CertificateAvatar } from "../themes/default/assets/images/icons/certificate-avatar.svg";
import {
    ReactComponent as CertificateColoredIcon
} from "../themes/default/assets/images/icons/certificate-colored-icon.svg";
import { ReactComponent as ClockColoredIcon } from "../themes/default/assets/images/icons/clock-colored-icon.svg";
import { ReactComponent as CloseIcon } from "../themes/default/assets/images/icons/close-icon.svg";
import { ReactComponent as CodeForkIcon } from "../themes/default/assets/images/icons/code-fork.svg";
import { ReactComponent as CrossIcon } from "../themes/default/assets/images/icons/cross-icon.svg";
import { ReactComponent as DashboardIcon } from "../themes/default/assets/images/icons/dashboard-icon.svg";
import { ReactComponent as DocumentIcon } from "../themes/default/assets/images/icons/document-icon.svg";
import { ReactComponent as DragSquaresIcon } from "../themes/default/assets/images/icons/drag-squares-icon.svg";
import { ReactComponent as ForbiddenIcon } from "../themes/default/assets/images/icons/forbidden-icon.svg";
import { ReactComponent as GearsIcon } from "../themes/default/assets/images/icons/gears-icon.svg";
import {
    ReactComponent as IDPCertificateIcon
} from "../themes/default/assets/images/icons/idpCertificate.svg";
import { ReactComponent as IntrospectIcon } from "../themes/default/assets/images/icons/introspect.svg";
import { ReactComponent as IssuerIcon } from "../themes/default/assets/images/icons/issuer.svg";
import { ReactComponent as JWKSIcon } from "../themes/default/assets/images/icons/jwks.svg";
import { ReactComponent as LaunchIcon } from "../themes/default/assets/images/icons/launch-icon.svg";
import { ReactComponent as LockShieldIcon } from "../themes/default/assets/images/icons/lock-shield.svg";
import {
    ReactComponent as MagnifierColoredIcon
} from "../themes/default/assets/images/icons/magnifier-colored-icon.svg";
import { ReactComponent as MagnifierIcon } from "../themes/default/assets/images/icons/magnifier-icon.svg";
import { ReactComponent as MaximizeIcon } from "../themes/default/assets/images/icons/maximize-icon.svg";
import { ReactComponent as IDPMetadataIcon } from "../themes/default/assets/images/icons/metadata.svg";
import { ReactComponent as MinimizeIcon } from "../themes/default/assets/images/icons/minimize-icon.svg";
import { ReactComponent as PinIcon } from "../themes/default/assets/images/icons/pin-icon.svg";
import { ReactComponent as PlugIcon } from "../themes/default/assets/images/icons/plug-icon.svg";
import { ReactComponent as ReportIcon } from "../themes/default/assets/images/icons/report-icon.svg";
import { ReactComponent as SLOIcon } from "../themes/default/assets/images/icons/slo.svg";
import { ReactComponent as SpinWheelIcon } from "../themes/default/assets/images/icons/spin-wheel-icon.svg";
import { ReactComponent as SSOIcon } from "../themes/default/assets/images/icons/sso.svg";
import { ReactComponent as TokenIcon } from "../themes/default/assets/images/icons/token.svg";
import { ReactComponent as FileUploadIllustration } from "../themes/default/assets/images/icons/upload.svg";
import { ReactComponent as UserInfoIcon } from "../themes/default/assets/images/icons/userInfo.svg";
import {
    ReactComponent as AuthenticationCapabilityIcon
} from "../themes/default/assets/images/identity-provider-capabilities/authentication.svg";
import {
    ReactComponent as ProvisionCapabilityIcon
} from "../themes/default/assets/images/identity-provider-capabilities/provision.svg";
import {
    ReactComponent as ExpertModeIdPIcon
} from "../themes/default/assets/images/identity-providers/expert-idp-illustration.svg";
import {
    ReactComponent as FacebookIdPIcon
} from "../themes/default/assets/images/identity-providers/facebook-idp-illustration.svg";
import {
    ReactComponent as GithubIdPIcon
} from "../themes/default/assets/images/identity-providers/github-idp-illustration.svg";
import {
    ReactComponent as GoogleIdPIcon
} from "../themes/default/assets/images/identity-providers/google-idp-illustration.svg";
import {
    ReactComponent as IWAKerberosIdPIllustration
} from "../themes/default/assets/images/identity-providers/iwa-idp-illustration.svg";
import {
    ReactComponent as MicrosoftIdPIllustration
} from "../themes/default/assets/images/identity-providers/microsoft-idp-illustration.svg";
import {
    ReactComponent as Office365IdPIllustration
} from "../themes/default/assets/images/identity-providers/office365-idp-illustration.svg";
import {
    ReactComponent as TwitterIdPIllustration
} from "../themes/default/assets/images/identity-providers/twitter-idp-illustration.svg";
import {
    ReactComponent as YahooIdPIllustration
} from "../themes/default/assets/images/identity-providers/yahoo-idp-illustration.svg";
import { ReactComponent as CertificateBadge } from "../themes/default/assets/images/illustrations/badge.svg";
import {
    ReactComponent as CertificateIllustration
} from "../themes/default/assets/images/illustrations/certificate.svg";
import {
    ReactComponent as CustomApplicationTemplateIllustration
} from "../themes/default/assets/images/illustrations/custom-app-illustration.svg";
import {
    ReactComponent as EmptySearchResultsIllustration
} from "../themes/default/assets/images/illustrations/no-search-results.svg";
import {
    ReactComponent as OIDCMobileTemplateIllustration
} from "../themes/default/assets/images/illustrations/oidc-mobile-template-illustration.svg";
import {
    ReactComponent as OIDCWebAppTemplateIllustration
} from "../themes/default/assets/images/illustrations/oidc-web-app-template-illustration.svg";
import {
    ReactComponent as PassiveSTSTemplateIllustration
} from "../themes/default/assets/images/illustrations/passive-sts-template-illustration.svg";
import { ReactComponent as CertificateRibbon } from "../themes/default/assets/images/illustrations/ribbon.svg";
import {
    ReactComponent as SAMLWebAppTemplateIllustration
} from "../themes/default/assets/images/illustrations/saml-web-app-template-illustration.svg";
import {
    ReactComponent as SPATemplateIllustration
} from "../themes/default/assets/images/illustrations/spa-template-illustration.svg";
import {
    ReactComponent as WindowsTemplateIllustration
} from "../themes/default/assets/images/illustrations/windows-template-illustration.svg";
import {
    ReactComponent as WSTrustTemplateIllustration
} from "../themes/default/assets/images/illustrations/ws-trust-template-illustration.svg";
import BannerSprites from "../themes/default/assets/images/misc/banner-sprites.svg";
import OIDCLogo from "../themes/default/assets/images/protocols/oidc.png";
import OpenIDLogo from "../themes/default/assets/images/protocols/openid.png";
import SamlLogo from "../themes/default/assets/images/protocols/saml.png";
import WSFedLogo from "../themes/default/assets/images/protocols/ws-fed.png";
import WSTrustLogo from "../themes/default/assets/images/protocols/ws-trust.png";
import { ReactComponent as FacebookLogo } from "../themes/default/assets/images/social/facebook.svg";
import { ReactComponent as GoogleLogo } from "../themes/default/assets/images/social/google.svg";
import { ReactComponent as TwitterLogo } from "../themes/default/assets/images/social/twitter.svg";
import { ReactComponent as AndroidLogo } from "../themes/default/assets/images/technologies/android-logo.svg";
import { ReactComponent as AngularLogo } from "../themes/default/assets/images/technologies/angular-logo.svg";
import { ReactComponent as AppleLogo } from "../themes/default/assets/images/technologies/apple-logo.svg";
import { ReactComponent as CSharpLogo } from "../themes/default/assets/images/technologies/c-sharp-logo.svg";
import { ReactComponent as CordovaLogo } from "../themes/default/assets/images/technologies/cordova-logo.svg";
import { ReactComponent as DotNetLogo } from "../themes/default/assets/images/technologies/dotnet-logo.svg";
import { ReactComponent as HTMLLogo } from "../themes/default/assets/images/technologies/html-logo.svg";
import { ReactComponent as JavaLogo } from "../themes/default/assets/images/technologies/java-logo.svg";
import { ReactComponent as JavaScriptLogo } from "../themes/default/assets/images/technologies/javascript-logo.svg";
import { ReactComponent as JWTLogo } from "../themes/default/assets/images/technologies/jwt-logo.svg";
import { ReactComponent as NodeJSLogo } from "../themes/default/assets/images/technologies/nodejs-logo.svg";
import { ReactComponent as PythonLogo } from "../themes/default/assets/images/technologies/python-logo.svg";
import { ReactComponent as ReactLogo } from "../themes/default/assets/images/technologies/react-logo.svg";
import { ReactComponent as VueLogo } from "../themes/default/assets/images/technologies/vue-logo.svg";
import { ReactComponent as WindowsLogo } from "../themes/default/assets/images/technologies/windows-logo.svg";
import { ReactComponent as MicrosoftLogo } from "../themes/default/assets/images/third-party/microsoft-logo.svg";
import { ReactComponent as Office365Logo } from "../themes/default/assets/images/third-party/office-365-logo.svg";
import { ReactComponent as YahooLogo } from "../themes/default/assets/images/third-party/yahoo-logo.svg";

export const SidePanelIcons = {
    appLogs: IDPMetadataIcon,
    applications: AppIcon,
    childIcon: ArrowRight,
    identityProviders: PlugIcon,
    overview: DashboardIcon,
    remoteRepo: CodeForkIcon
};

export const SidePanelMiscIcons = {
    caretRight: CaretRightIcon
};

export const AdvancedSearchIcons = {
    clear: CrossIcon
};

export const EmptyPlaceholderIllustrations = {
    alert: AlertIcon,
    emptyList: BoxIcon,
    emptySearch: MagnifierIcon,
    fileUpload: FileUploadIllustration,
    genericError: CloseIcon,
    loginError: ForbiddenIcon,
    newList: LaunchIcon,
    pageNotFound: BlockedMagnifierIcon,
    search: EmptySearchResultsIllustration
};

export const InboundProtocolLogos = {
    oidc: OIDCLogo,
    openid: OpenIDLogo,
    "passive-sts": WSFedLogo,
    saml: SamlLogo,
    "ws-trust": WSTrustLogo,
    wsFed: WSFedLogo,
    wsTrust: WSTrustLogo
};

export const ApplicationTemplateIllustrations = {
    customApp: CustomApplicationTemplateIllustration,
    oidcMobile: OIDCMobileTemplateIllustration,
    oidcWebApp: OIDCWebAppTemplateIllustration,
    passiveSTS: PassiveSTSTemplateIllustration,
    samlWebApp: SAMLWebAppTemplateIllustration,
    spa: SPATemplateIllustration,
    windowsNative: WindowsTemplateIllustration,
    wsTrust: WSTrustTemplateIllustration
};

export const TechnologyLogos = {
    android: AndroidLogo,
    angular: AngularLogo,
    apple: AppleLogo,
    cSharp: CSharpLogo,
    cordova: CordovaLogo,
    dotNet: DotNetLogo,
    html: HTMLLogo,
    ios: AppleLogo,
    java: JavaLogo,
    javascript: JavaScriptLogo,
    nodejs: NodeJSLogo,
    openidconnect: OIDCLogo,
    python: PythonLogo,
    react: ReactLogo,
    saml: SamlLogo,
    vue: VueLogo,
    windows: WindowsLogo
};

export const ApplicationWizardStepIcons = {
    general: DocumentIcon,
    protocolConfig: GearsIcon,
    protocolSelection: SpinWheelIcon,
    summary: ReportIcon
};

export const IdentityProviderWizardStepIcons = {
    authenticatorSettings: GearsIcon,
    general: DocumentIcon,
    outboundProvisioningSettings: GearsIcon,
    summary: ReportIcon
};

export const AuthenticatorIcons = {
    basic: BasicAuthIcon,
    default: LockShieldIcon,
    emailOTP: EmailOTPIcon,
    facebook: FacebookLogo,
    fido: FIDOLogo,
    google: GoogleLogo,
    identifierFirst: MagnifierColoredIcon,
    jwtBasic: JWTLogo,
    microsoft: MicrosoftLogo,
    office365: Office365Logo,
    sessionExecutor: ClockColoredIcon,
    smsOTP: SMSOTPIcon,
    totp: TOTPIcon,
    twitter: TwitterLogo,
    x509: CertificateColoredIcon,
    yahoo: YahooLogo
};

export const ConnectorIcons = {
    google: GoogleIdPIcon,
    salesforce: SalesforceLogo,
    scim: SCIMLogo,
    spml: SPMLLogo
};

export const IdPIcons = {
    emailOTP: EmailOTPIcon,
    expert: ExpertModeIdPIcon,
    facebook: FacebookIdPIcon,
    github: GithubIdPIcon,
    google: GoogleIdPIcon,
    iwaKerberos: IWAKerberosIdPIllustration,
    microsoft: MicrosoftIdPIllustration,
    office365: Office365IdPIllustration,
    oidc: OIDCLogo,
    saml: SamlLogo,
    smsOTP: SMSOTPIcon,
    twitter: TwitterIdPIllustration,
    wsFed: WSFedLogo,
    yahoo: YahooIdPIllustration
};

export const IdPTemplateDocsIcons = {
    facebook: FacebookIdPIcon,
    google: GoogleIdPIcon,
    manualsetup: ExpertModeIdPIcon,
    openidconnect: OpenIDLogo
};

export const IdPCapabilityIcons = {
    [ SupportedServices.AUTHENTICATION ]: AuthenticationCapabilityIcon,
    [ SupportedServices.PROVISIONING ]: ProvisionCapabilityIcon
};

export const OperationIcons = {
    drag: DragSquaresIcon,
    maximize: MaximizeIcon,
    minimize: MinimizeIcon
};

export const HelpSidebarIcons = {
    actionPanel: {
        close: CrossIcon,
        pin: PinIcon
    },
    mini: {
        SDKs: BoxIcon,
        docs: DocumentIcon
    }
};

export const CertificateIllustrations = {
    avatar: CertificateAvatar,
    badge: CertificateBadge,
    file: CertificateIllustration,
    ribbon: CertificateRibbon,
    uploadPlaceholder: FileUploadIllustration
};

export const OutboundProvisioningConnectorWizard = {
    connectorDetails: DocumentIcon,
    connectorSelection: GearsIcon,
    summary: ReportIcon
};

export const OverviewPageImages = {
    jumbotron: {
        background: BannerSprites
    },
    quickLinks: {
        applications: AppIcon,
        idp: BuildingIcon
    }
};

export const HelpPanelIcons = {
    endpoints: {
        authorize: AuthorizeIcon,
        certificate: IDPCertificateIcon,
        introspect: IntrospectIcon,
        issuer: IssuerIcon,
        jwks: JWKSIcon,
        metadata: IDPMetadataIcon,
        samlSLO: SLOIcon,
        samlSSO: SSOIcon,
        token: TokenIcon,
        userInfo: UserInfoIcon
    }
};
