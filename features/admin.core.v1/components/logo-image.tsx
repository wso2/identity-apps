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

import Image from "@oxygen-ui/react/Image";
import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { StringUtils } from "@wso2is/core/utils";
import React from "react";
import { useSelector } from "react-redux";
import { ConfigReducerStateInterface } from "../models/reducer-state";
import { AppState } from "../store";

const LogoImage = () => {
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    return (
        <Image
            src={ resolveAppLogoFilePath(
                window["AppUtils"].getConfig().ui.appLogo?.defaultLogoPath ??
                    window["AppUtils"].getConfig().ui.appLogoPath,
                `${window["AppUtils"].getConfig().clientOrigin}/` +
                    `${
                        StringUtils.removeSlashesFromPath(window["AppUtils"].getConfig().appBase) !== ""
                            ? StringUtils.removeSlashesFromPath(window["AppUtils"].getConfig().appBase) + "/"
                            : ""
                    }libs/themes/` +
                    config.ui.theme.name
            ) }
            alt="logo"
        />
    );
};

export default LogoImage;
