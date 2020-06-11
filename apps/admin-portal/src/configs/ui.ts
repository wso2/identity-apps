/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
    BlockedMagnifierIcon,
    BoxIcon,
    CaretRightIcon,
    CloseIcon,
    CrossIcon,
    DashboardIcon,
    EmptySearchResultsIllustration,
    ErrorIcon,
    ForbiddenIcon,
    InfoIcon,
    LaunchIcon,
    Logo,
    MagnifierIcon,
    SecurityIllustration,
    SuccessIcon,
    WarningIcon
} from "@wso2is/theme";

export const LogoImage = Logo;

// Icon set for the side panel.
export const SidePanelIcons = {
    overview: DashboardIcon
};

export const SidePanelMiscIcons = {
    caretRight: CaretRightIcon
};

export const AdvancedSearchIcons = {
    clear: CrossIcon
};

export const AlertIcons = {
    error: ErrorIcon,
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon
};

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

export const OverviewPageIllustrations = {
    jumbotronIllustration: SecurityIllustration
};
