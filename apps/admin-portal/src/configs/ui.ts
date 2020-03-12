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
    AlertIcon,
    ArrowRight,
    MaximizeIcon,
    MinimizeIcon,
    MagnifierIcon,
    DragSquaresIcon,
    LaunchIcon,
    AngularLogo,
    AppIcon,
    AuthenticationCapabilityIcon,
    BasicAuthIcon,
    BlockedMagnifierIcon,
    BoxIcon,
    CaretRightIcon,
    CloseIcon,
    CodeIcon,
    CrossIcon,
    DashboardIcon,
    DocumentIcon,
    DotNetLogo,
    DragIcon,
    DummyUser,
    EmailOTPIcon,
    EmptySearchResultsIllustration,
    ErrorIcon,
    FacebookIdPIcon,
    FacebookLogo,
    FIDOLogo,
    ForbiddenIcon,
    GearsIcon,
    GithubIdPIcon,
    GoogleIdPIcon,
    GoogleLogo,
    HomeTileIcons,
    InfoIcon,
    JavaLogo,
    Logo,
    MFAIconSet,
    OIDCLogo,
    OpenIDLogo,
    PlugIcon,
    ProvisionCapabilityIcon,
    ReactLogo,
    ReportIcon,
    SamlLogo,
    SettigsSectionIconSet,
    SMSOTPIcon,
    SPATemplateIllustration,
    SpinWheelIcon,
    SuccessIcon,
    TOTPIcon,
    TwitterIdPIcon,
    TwitterLogo,
    UserIcon,
    VueLogo,
    WarningIcon,
    WebAppTemplateIllustration,
    WSFedLogo,
    WSTrustLogo,
    ClaimsIcon,
    UserStoreIcon
} from "@wso2is/theme";

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
    childIcon: ArrowRight,
    connections: PlugIcon,
    overview: DashboardIcon,
    usersAndRoles: UserIcon,
    claims: ClaimsIcon,
    userStore: UserStoreIcon
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
    wsTrust: WSTrustLogo
};

export const ApplicationTemplateIllustrations = {
    spa: SPATemplateIllustration,
    webApp: WebAppTemplateIllustration
};

export const TechnologyLogos = {
    angular: AngularLogo,
    dotNet: DotNetLogo,
    java: JavaLogo,
    react: ReactLogo,
    vue: VueLogo
};

export const ApplicationWizardStepIcons = {
    general: DocumentIcon,
    protocolConfig: GearsIcon,
    protocolSelection: SpinWheelIcon,
    summary: ReportIcon
};

export const AuthenticatorIcons = {
    basic: BasicAuthIcon,
    emailOTP: EmailOTPIcon,
    facebook: FacebookLogo,
    fido: FIDOLogo,
    google: GoogleLogo,
    smsOTP: SMSOTPIcon,
    totp: TOTPIcon,
    twitter: TwitterLogo
};

export const PlaceHolderIcons = {
    drag: DragIcon
};

export const IdPIcons = {
    facebook: FacebookIdPIcon,
    github: GithubIdPIcon,
    google: GoogleIdPIcon,
    twitter: TwitterIdPIcon
};

export const IdPCapabilityIcons = {
    authentication: AuthenticationCapabilityIcon,
    provision: ProvisionCapabilityIcon
};

export const OperationIcons = {
    drag: DragSquaresIcon,
    maximize: MaximizeIcon,
    minimize: MinimizeIcon
};
