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

import {
    ActiveDirectoryUserstoreIllustration,
    AlertIcon,
    AndroidLogo,
    AngularLogo,
    AppIcon,
    AppleLogo,
    ArrowRight,
    AuthenticationCapabilityIcon,
    BasicAuthIcon,
    BlockedMagnifierIcon,
    BoxIcon,
    CSharpLogo,
    CaretRightIcon,
    CertificateAvatar,
    CertificateBadge,
    CertificateColoredIcon,
    CertificateIcon,
    CertificateIllustration,
    CertificateRibbon,
    ClaimsIcon,
    ClockColoredIcon,
    CloseIcon,
    CodeIcon,
    CordovaLogo,
    CrossIcon,
    CustomApplicationTemplateIllustration,
    DashboardIcon,
    DatabaseAvatar,
    DatabaseIcon,
    DocumentIcon,
    DotNetLogo,
    DragIcon,
    DragSquaresIcon,
    DummyUser,
    EmailIcon,
    EmailOTPIcon,
    EmptySearchResultsIllustration,
    ErrorIcon,
    ExpertModeIdPIcon,
    FIDOLogo,
    FacebookIdPIcon,
    FacebookLogo,
    FileUploadIllustration,
    ForbiddenIcon,
    GearsIcon,
    GithubIdPIcon,
    GoogleIdPIcon,
    GoogleLogo,
    HTMLLogo,
    HomeTileIcons,
    InfoIcon,
    JDBCUserstoreIllustration,
    JWTLogo,
    JavaLogo,
    JavaScriptLogo,
    KeyIcon,
    LDAPUserstoreIllustration,
    LaunchIcon,
    LockShieldIcon,
    Logo,
    MFAIconSet,
    MagnifierColoredIcon,
    MagnifierIcon,
    MaximizeIcon,
    MicrosoftLogo,
    MinimizeIcon,
    NodeJSLogo,
    OIDCLogo,
    OIDCWebAppTemplateIllustration,
    Office365Logo,
    OpenIDLogo,
    PassiveSTSTemplateIllustration,
    PinIcon,
    PlugIcon,
    ProvisionCapabilityIcon,
    ReactLogo,
    ReportIcon,
    SAMLWebAppTemplateIllustration,
    SCIMLogo,
    SMSOTPIcon,
    SPATemplateIllustration,
    SPMLLogo,
    SalesforceLogo,
    SamlLogo,
    SettigsSectionIconSet,
    SpinWheelIcon,
    SuccessIcon,
    TOTPIcon,
    TwitterIdPIcon,
    TwitterLogo,
    UserIcon,
    VueLogo,
    WSFedLogo,
    WSTrustLogo,
    WSTrustTemplateIllustration,
    WarningIcon,
    WindowsTemplateIllustration,
    YahooLogo
} from "@wso2is/theme";

import { SupportedServices } from "../models";

type ImageType = string;

interface StylesType {
    appPrimaryColor?: string;
    appBackgroundColor?: string;
}

interface CustomCSSType {
    dark?: StylesType;
    light?: StylesType;
}

export const LogoImage = Logo;
export const UserImage: ImageType = DummyUser;
export const HomeTileIconImages = HomeTileIcons;

// Icon set for the side panel.
export const SidePanelIcons = {
    applications: AppIcon,
    certificate: CertificateIcon,
    childIcon: ArrowRight,
    claims: ClaimsIcon,
    connections: PlugIcon,
    overview: DashboardIcon,
    serverConfigurations: GearsIcon,
    userStore: DatabaseIcon,
    usersAndRoles: UserIcon
};

export const SidePanelMiscIcons = {
    caretRight: CaretRightIcon
};

export const GenericAppIcon = CodeIcon;
export const SettingsSectionIcons = SettigsSectionIconSet;
export const MFAIcons = MFAIconSet;

export const AdvancedSearchIcons = {
    clear: CrossIcon
};

export const TitleText = "Identity Server";
export const customCSS: CustomCSSType = {
    dark: {
        appPrimaryColor: "#ff5000"
    },
    light: {
        appPrimaryColor: "#ff5000"
    }
};

export const AlertIcons = {
    error: ErrorIcon,
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon
};

/**
 * Constant to handle desktop layout content top padding.
 * @type {number}
 */
export const DESKTOP_CONTENT_TOP_PADDING = 50;

/**
 * Constant to handle mobile layout content padding.
 * @type {string}
 */
export const MOBILE_CONTENT_PADDING = "2rem 1rem";

export const EmptyPlaceholderIllustrations = {
    alert: AlertIcon,
    emptyList: BoxIcon,
    emptySearch: MagnifierIcon,
    genericError: CloseIcon,
    loginError: ForbiddenIcon,
    newList: LaunchIcon,
    pageNotFound: BlockedMagnifierIcon,
    search: EmptySearchResultsIllustration
};

export const InboundProtocolLogos = {
    oidc: OIDCLogo,
    openid: OpenIDLogo,
    saml: SamlLogo,
    wsFed: WSFedLogo,
    wsTrust: WSTrustLogo,
    "ws-trust": WSTrustLogo,
    "passive-sts": WSFedLogo
};

export const ApplicationTemplateIllustrations = {
    customApp: CustomApplicationTemplateIllustration,
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
    react: ReactLogo,
    saml: SamlLogo,
    vue: VueLogo
};

export const ApplicationWizardStepIcons = {
    general: DocumentIcon,
    protocolConfig: GearsIcon,
    protocolSelection: SpinWheelIcon,
    summary: ReportIcon
};

export const UserWizardStepIcons = {
    general: DocumentIcon,
    groups: GearsIcon,
    roles: SpinWheelIcon,
    summary: ReportIcon
};

export const RolesWizardStepIcons = {
    general: DocumentIcon,
    permissions: KeyIcon,
    assignUser: UserIcon,
    summary: ReportIcon
};

export const EmailTemplateIllustrations = {
    emptyEmailListing: EmailIcon
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

export const PlaceHolderIcons = {
    drag: DragIcon
};

export const IdPIcons = {
    emailOTP: EmailOTPIcon,
    expert: ExpertModeIdPIcon,
    facebook: FacebookIdPIcon,
    github: GithubIdPIcon,
    google: GoogleIdPIcon,
    iwaKerberos: GoogleIdPIcon,
    microsoft: GoogleIdPIcon,
    office365: GoogleIdPIcon,
    oidc: OIDCLogo,
    saml: SamlLogo,
    smsOTP: SMSOTPIcon,
    twitter: TwitterIdPIcon,
    wsFed: WSFedLogo,
    yahoo: GoogleIdPIcon
};

export const IdPCapabilityIcons = {
    [SupportedServices.AUTHENTICATION]: AuthenticationCapabilityIcon,
    [SupportedServices.PROVISIONING]: ProvisionCapabilityIcon
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

/**
 * The userstore avatar.
 */
export const DatabaseAvatarGraphic = DatabaseAvatar;

export const CertificateIllustrations = {
    /**
     * Certificate avatar.
     */
    avatar: CertificateAvatar,

    /**
     * Certificate Badge Illustration.
     */
    badge: CertificateBadge,

    /**
     * Certificate illustration.
     */
    file: CertificateIllustration,

    /**
     * Certificate Ribbon.
     */
    ribbon: CertificateRibbon,

    /**
     * File upload placeholder.
     */
    uploadPlaceholder: FileUploadIllustration
};

export const OutboundProvisioningConnectorWizard = {
    connectorDetails: DocumentIcon,
    connectorSelection: GearsIcon,
    summary: ReportIcon
};

export const UserstoreTemplateIllustrations = {
    ad: ActiveDirectoryUserstoreIllustration,
    default: CustomApplicationTemplateIllustration,
    jdbc: JDBCUserstoreIllustration,
    ldap: LDAPUserstoreIllustration
};
