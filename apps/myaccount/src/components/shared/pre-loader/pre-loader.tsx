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

import Image from "@oxygen-ui/react/Image";
import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { StringUtils } from "@wso2is/core/utils";
import { PredefinedThemes } from "@wso2is/common.branding.v1/models";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider } from "semantic-ui-react";
import { useGetBrandingPreference } from "../../../api";
import { AppConstants } from "../../../constants";
import { commonConfig } from "../../../extensions";

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
                    <div className="trifacta-pre-loader" data-testid={ componentId }>
                        <svg
                            data-testid={ `${ componentId }-svg` }
                            xmlns="http://www.w3.org/2000/svg"
                            width="67.56"
                            height="58.476"
                            viewBox="0 0 67.56 58.476">
                            <g id="logo-only" transform="translate(-424.967 -306)">
                                <path
                                    id="_3"
                                    data-name="3"
                                    d="M734.291,388.98l6.194,10.752-6.868,11.907h13.737l6.226,10.751H714.97Z"
                                    transform="translate(-261.054 -82.98)"
                                    fill="#ff7300"/>
                                <path
                                    id="_2"
                                    data-name="2"
                                    d={ "M705.95,422.391l6.227-10.751h13.736l-6.867-11.907,6.193-10.752,19"
                                        + ".321,33.411Z" }
                                    transform="translate(-280.983 -82.98)"
                                    fill="#ff7300"/>
                                <path
                                    id="_1"
                                    data-name="1"
                                    d="M736.65,430.2l-6.868-11.907-6.9,11.907H710.46l19.322-33.411L749.071,430.2Z"
                                    transform="translate(-271.019 -65.725)"
                                    fill="#000"/>
                            </g>
                        </svg>
                    </div>
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
