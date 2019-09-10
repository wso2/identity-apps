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
 *
 */

export const Theme = require("./theme");
// TODO: Revist default theme loading
// export const DefaultTheme = Theme.compile(
//     "./libs/styles/less/theme-module/themes/default/index.less",
//     "./libs/styles/less/theme-module/themes/default", {}
// );
export const Logo = require("../lib/assets/images/logo.svg");
export const DummyUser = require("../lib/assets/images/user.png");
export const DefaultAppIcon = require("../lib/assets/images/default-app-icon.svg");
export const HomeTileIcons = {
    profile: require("../lib/assets/images/home_profile_mgt.png"),
    security: require("../lib/assets/images/home_security_mgt.png"),
    consent: require("../lib/assets/images/home_consent_mgt.png")
};
export const SidePanelIconSet = {
    overview: require("../lib/assets/images/icons/dashboard-icon.svg"),
    personal: require("../lib/assets/images/icons/user-icon.svg"),
    security: require("../lib/assets/images/icons/lock-icon.svg"),
    account: require("../lib/assets/images/icons/controls-icon.svg"),
    session: require("../lib/assets/images/icons/monitor-icon.svg"),
    consent: require("../lib/assets/images/icons/tick-circle-icon.svg"),
};
export const SettigsSectionIconSet = {
    associatedAccounts: require("../lib/assets/images/illustrations/associated-accounts.svg"),
    profileExport: require("../lib/assets/images/illustrations/profile-export.svg"),
    securityQuestions: require("../lib/assets/images/illustrations/security-questions.svg")
};
