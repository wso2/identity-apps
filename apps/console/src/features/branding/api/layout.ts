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

import { HttpMethods } from "@wso2is/core/models";
import { Config } from "../../core/configs";
import { AppConstants } from "../../core/constants";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { PredefinedLayouts } from "../meta";

/**
 * Hook to get the layout.
 *
 * @param layout - Layout name.
 * @param tenantDomain - Tenant name.
 * @param shouldFetch - Should fetch the data.
 * @returns Layouts.
 */
export const useLayout = <Data = Blob, Error = RequestErrorInterface>(
    layout: PredefinedLayouts,
    tenantDomain: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const basename: string = AppConstants.getAppBasename()
        ? `/${AppConstants.getAppBasename()}`
        : "";

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "text/html",
            "Content-Type": "text/html"
        },
        method: HttpMethods.GET,
        responseType: "blob",
        url:
            layout === PredefinedLayouts.CUSTOM
                ? `${
                    Config.getDeploymentConfig().extensions?.layoutStoreURL
                        ? (Config.getDeploymentConfig().extensions.layoutStoreURL as string)
                            .replace("${tenantDomain}", tenantDomain)
                        : `https://${window.location.host}${basename}/libs/login-portal-layouts`}/body.html`
                : `https://${window.location.host}${basename}/libs/login-portal-layouts/${layout}/body.html`
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null, { attachToken: false });

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Hook to get the layout styles.
 *
 * @param layout - Layout name.
 * @param tenantDomain - Tenant name.
 * @returns Layout styles.
 */
export const useLayoutStyle = <Data = Blob, Error = RequestErrorInterface>(
    layout: PredefinedLayouts,
    tenantDomain: string
): RequestResultInterface<Data, Error> => {
    const basename: string = AppConstants.getAppBasename()
        ? `/${AppConstants.getAppBasename()}`
        : "";

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "text/css",
            "Content-Type": "text/css"
        },
        method: HttpMethods.GET,
        responseType: "blob",
        url:
            layout === PredefinedLayouts.CUSTOM
                ? `${
                    Config.getDeploymentConfig().extensions?.layoutStoreURL
                        ? (Config.getDeploymentConfig().extensions.layoutStoreURL as string)
                            .replace("${tenantDomain}", tenantDomain)
                        : `https://${window.location.host}${basename}/libs/login-portal-layouts`}/styles.css`
                : `https://${window.location.host}${basename}/libs/login-portal-layouts/${layout}/styles.css`
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<Data, Error>(requestConfig, { attachToken: false });

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
