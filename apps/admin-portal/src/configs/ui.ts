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
    AppIcon,
    BlockedMagnifierIcon,
    BoxIcon,
    CaretRightIcon,
    CloseIcon,
    CodeIcon,
    CrossIcon,
    DashboardIcon,
    DotIcon,
    DummyUser,
    EmptySearchResultsIllustration,
    ErrorIcon,
    ForbiddenIcon,
    HomeTileIcons,
    InfoIcon,
    Logo,
    MFAIconSet,
    OIDCLogo,
    OpenIDLogo,
    PlugIcon,
    SamlLogo,
    SettigsSectionIconSet,
    SuccessIcon,
    UserIcon,
    WarningIcon,
    WSFedLogo,
    WSTrustLogo
} from "@wso2is/theme";

type ImageType = string;
type TitleTextType = string;

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
    childIcon: DotIcon,
    connections: PlugIcon,
    overview: DashboardIcon,
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

export const TitleText: TitleTextType = "Identity Server";
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
export const DESKTOP_CONTENT_TOP_PADDING: number = 50;

/**
 * Constant to handle mobile layout content padding.
 * @type {string}
 */
export const MOBILE_CONTENT_PADDING: string = "2rem 1rem";

export const EmptyPlaceholderIllustrations = {
    alert: AlertIcon,
    emptyList: BoxIcon,
    genericError: CloseIcon,
    loginError: ForbiddenIcon,
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
