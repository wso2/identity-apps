/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Image from "@oxygen-ui/react/Image";
import { PredefinedThemes } from "@wso2is/common.branding.v1/models";
import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider } from "semantic-ui-react";
import { ReactComponent as Pulse } from "./pulse.svg";
import { useGetBrandingPreference } from "../../../api";
import { AppConstants } from "../../../constants";
import { commonConfig } from "../../../extensions";
import "./pre-loader.css";

/**
 * Pre loader component props interface.
 */
type PreLoaderPropsInterface = IdentifiableComponentInterface;

/**
 * Pre-Loader for the application.
 *
 * @param props - Props injected to the component.
 *
 * @returns Pre-Loader component.
 */
export const PreLoader: FunctionComponent<PreLoaderPropsInterface> = (
    props: PreLoaderPropsInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const {
        data: brandingPreference,
        isLoading: isBrandingLoading,
        error: brandingError
    } = useGetBrandingPreference(AppConstants.getTenant());

    const getDefaultLogo = (): string => {
        return resolveAppLogoFilePath(
            brandingPreference?.preference?.theme?.activeTheme === PredefinedThemes.DARK
                ? window[ "AppUtils" ].getConfig().ui.appWhiteLogoPath
                : window[ "AppUtils" ].getConfig().ui.appLogoPath,
            `${ window[ "AppUtils" ].getConfig().clientOrigin
            }/` +
            `${ StringUtils.removeSlashesFromPath(
                window[ "AppUtils" ].getConfig()
                    .appBase
            ) !== ""
                ? StringUtils.removeSlashesFromPath(
                    window[ "AppUtils" ].getConfig()
                        .appBase
                ) + "/"
                : ""
            }libs/themes/wso2is`
        );
    };

    return (
        <div className="pre-loader-wrapper" data-testid={ `${ componentId }-wrapper` }>
            {
                AppConstants.getTenant() === AppConstants.getSuperTenant() && !commonConfig?.enableDefaultPreLoader ? (
                    <Box
                        data-testid={ componentId }
                        sx={ {
                            "& svg": {
                                animation: "app-pre-loader-pulse 2s ease-in-out infinite",
                                height: 80,
                                width: 80
                            },
                            "@keyframes app-pre-loader-pulse": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.5 }
                            },
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center"
                        } }
                    >
                        <Pulse data-testid={ `${ componentId }-svg` } />
                    </Box>
                ) : (
                    <>
                        {
                            !isBrandingLoading && (!brandingError || brandingError?.response?.status === 404) ? (
                                <Image
                                    className="pre-loader-logo"
                                    src={
                                        brandingPreference?.preference?.theme[
                                            brandingPreference?.preference?.theme?.activeTheme
                                        ]?.images?.myAccountLogo?.imgURL ?? getDefaultLogo()
                                    }
                                    alt="logo"
                                />
                            ) : null
                        }
                        <Divider hidden />
                        <ContentLoader data-componentid={ componentId }/>
                    </>
                )
            }
        </div>
    );
};

/**
 * Default props for the component.
 */
PreLoader.defaultProps = {
    "data-componentid": "pre-loader"
};
