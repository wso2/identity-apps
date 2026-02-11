/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import OxygenHeader from "@oxygen-ui/react/Header";
import Image from "@oxygen-ui/react/Image";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { ConfigReducerStateInterface } from "@wso2is/admin.core.v1/models/reducer-state";
import { AppState } from "@wso2is/admin.core.v1/store";
import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { StringUtils } from "@wso2is/core/utils";
import React from "react";
import { useSelector } from "react-redux";

export const Header = () => {
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    return (
        <OxygenHeader
            className="is-header"
            brand={ {
                logo: {
                    desktop: (
                        <Image
                            src={ resolveAppLogoFilePath(
                                window["AppUtils"].getConfig().ui.appLogo?.defaultLogoPath ??
                                    window["AppUtils"].getConfig().ui.appLogoPath,
                                `${window["AppUtils"].getConfig().clientOrigin}/` +
                                    `${
                                        StringUtils.removeSlashesFromPath(window["AppUtils"].getConfig().appBase) !== ""
                                            ? StringUtils.removeSlashesFromPath(
                                                window["AppUtils"].getConfig().appBase
                                            ) + "/"
                                            : ""
                                    }libs/themes/` +
                                    config.ui.theme.name
                            ) }
                            alt="logo"
                        />
                    )
                },
                onClick: () => {
                    history.push(AppConstants.getPaths().get("DASHBOARD"));
                },
                title: "Onboarding"
            } }
            position="fixed"
            sx={ {
                "& .OxygenHeader-userDropdownMenu": {
                    display: "none"
                }
            } }
        />
    );
};

export default Header;
