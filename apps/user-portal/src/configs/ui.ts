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
    AccountRecoveryIconSet,
    CodeIcon,
    ConsentForm,
    CrossIcon,
    DummyUser,
    EmptySearchResultsIllustration,
    HomeTileIcons,
    Logo,
    MFAIconSet,
    OrangeAppIconBackground,
    PackageIcon,
    Padlock,
    SettigsSectionIconSet,
    SidePanelIconSet,
    StatusShieldDanger,
    StatusShieldGood,
    StatusShieldWarning
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
export const ConsentedAppIcon = PackageIcon;
export const DefaultAppIcon = CodeIcon;
export const SidePanelIcons = SidePanelIconSet;
export const SettingsSectionIcons = SettigsSectionIconSet;
export const MFAIcons = MFAIconSet;
export const AccountRecoveryIcons = AccountRecoveryIconSet;
export const AccountStatusShields = {
    danger: StatusShieldDanger,
    good: StatusShieldGood,
    warning: StatusShieldWarning
};
export const WidgetIcons = {
    accountSecurity: Padlock,
    consents: ConsentForm
};

export const TitleText: TitleTextType = "User Portal";
export const customCSS: CustomCSSType = {
    dark: {
        appPrimaryColor: "#ff5000"
    },
    light: {
        appPrimaryColor: "#ff5000"
    }
};

export const AdvancedSearchIcons = {
    clear: CrossIcon
};

export const EmptyPlaceholderIllustrations = {
    search: EmptySearchResultsIllustration
};

export const AppIconBackgrounds = {
    orange: OrangeAppIconBackground
};
