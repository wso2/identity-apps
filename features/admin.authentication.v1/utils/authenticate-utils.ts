/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AuthParams, AuthReactConfig, ResponseMode, SPAUtils, Storage } from "@asgardeo/auth-react";
import { Config } from "@wso2is/admin.core.v1";
import { TokenConstants } from "@wso2is/core/constants";
import { UserAgentParser } from "@wso2is/core/helpers";
import { StringUtils } from "@wso2is/core/utils";
import axios, { AxiosResponse } from "axios";

/**
 * Response mode fallback.
 */
const responseModeFallback: ResponseMode =
    process.env.NODE_ENV === "production" ? ResponseMode.formPost : ResponseMode.query;

/**
 * Utility class for authenticate operations.
 */
export class AuthenticateUtils {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInitializeConfig = (): AuthReactConfig => {
        const baseUrl: string = window["AppUtils"]?.getConfig()?.serverOriginWithTenant;

        return {
            baseUrl,
            checkSessionInterval: window[ "AppUtils" ]?.getConfig()?.session?.checkSessionInterval,
            clientHost: window["AppUtils"]?.getConfig()?.clientOriginWithTenant,
            clientID: window["AppUtils"]?.getConfig()?.clientID,
            clockTolerance: window[ "AppUtils" ]?.getConfig().idpConfigs?.clockTolerance,
            disableTrySignInSilently: new URL(location.href).searchParams.get("disable_silent_sign_in") === "true",
            enableOIDCSessionManagement: window["AppUtils"]?.getConfig().idpConfigs?.enableOIDCSessionManagement
                ?? true,
            enablePKCE: window["AppUtils"]?.getConfig()?.idpConfigs?.enablePKCE ?? true,
            endpoints: {
                authorizationEndpoint: window["AppUtils"]?.getConfig()?.idpConfigs?.authorizeEndpointURL,
                checkSessionIframe: window["AppUtils"]?.getConfig()?.idpConfigs?.oidcSessionIFrameEndpointURL,
                endSessionEndpoint: window["AppUtils"]?.getConfig()?.idpConfigs?.logoutEndpointURL,
                issuer: window["AppUtils"]?.getConfig()?.idpConfigs?.issuer,
                jwksUri: window["AppUtils"]?.getConfig()?.idpConfigs?.jwksEndpointURL,
                revocationEndpoint: window["AppUtils"]?.getConfig()?.idpConfigs?.tokenRevocationEndpointURL,
                tokenEndpoint: window["AppUtils"]?.getConfig()?.idpConfigs?.tokenEndpointURL
            },
            periodicTokenRefresh: window["AppUtils"]?.getConfig()?.idpConfigs?.periodicTokenRefresh,
            resourceServerURLs: AuthenticateUtils.resolveBaseUrls(),
            responseMode: window["AppUtils"]?.getConfig()?.idpConfigs?.responseMode ?? responseModeFallback,
            scope: window["AppUtils"]?.getConfig()?.idpConfigs?.scope ?? [ TokenConstants.SYSTEM_SCOPE ],
            sendCookiesInRequests: true,
            sessionRefreshInterval: -1,
            signInRedirectURL: window["AppUtils"]?.getConfig()?.loginCallbackURL,
            signOutRedirectURL: window["AppUtils"]?.getConfig()?.loginCallbackURL,
            storage: AuthenticateUtils.resolveStorage() as Storage.WebWorker,
            validateIDTokenIssuer: window["AppUtils"]?.getConfig()?.idpConfigs?.validateIDTokenIssuer,
            ...window["AppUtils"]?.getConfig().idpConfigs
        };
    };

    /**
     * Determines what storage type should be used to store session information.
     *
     * @returns Storage
     */
    public static resolveStorage(): Storage {

        const storageFallback: Storage =
            new UserAgentParser().browser.name === "IE" ? Storage.SessionStorage : Storage.WebWorker;

        if (window["AppUtils"]?.getConfig()?.idpConfigs?.storage) {
            if (
                window["AppUtils"].getConfig().idpConfigs.storage === Storage.WebWorker &&
                new UserAgentParser().browser.name === "IE"
            ) {
                return Storage.SessionStorage;
            }

            return window["AppUtils"].getConfig().idpConfigs?.storage;
        }

        return storageFallback;
    }

    /**
     * By specifying the base URL, we are restricting the endpoints to which the requests could be sent.
     * So, an attacker can't obtain the token by sending a request to their endpoint. This is mandatory
     * when the storage is set to Web Worker.
     *
     * @returns string[]
     */
    public static resolveBaseUrls(): string[] {
        let baseUrls: string[] = window["AppUtils"]?.getConfig()?.idpConfigs?.baseUrls;
        const serverOrigin: string = window["AppUtils"]?.getConfig()?.serverOrigin;

        if (baseUrls) {
            // If the server origin is not specified in the overridden config, append it.
            if (!baseUrls.includes(serverOrigin)) {
                baseUrls = [ ...baseUrls, serverOrigin ];
            }

            return baseUrls;
        }

        return [ serverOrigin ];
    }

    /**
     * Resolves IDP URLs when the tenant resolves. Returns
     *
     * @param originalURL - Original URL.
     * @param overriddenURL - Overridden URL from config.
     * @returns string
     */
    public static resolveIdpURLSAfterTenantResolves(originalURL: string, overriddenURL: string): string {
        const parsedOriginalURL: URL = new URL(originalURL);
        const parsedOverrideURL: URL = new URL(overriddenURL);

        // If the override URL & original URL has search params, try to moderate the URL.
        if (parsedOverrideURL.search && parsedOriginalURL.search) {
            for (const [ key, value ] of parsedOriginalURL.searchParams.entries()) {
                if (!parsedOverrideURL.searchParams.has(key)) {
                    parsedOverrideURL.searchParams.append(key, value);
                }
            }

            return parsedOverrideURL.toString();
        }

        return overriddenURL + parsedOriginalURL.search;
    }

    public static getAuthParams = (): Promise<AuthParams> => {
        if (!SPAUtils.hasAuthSearchParamsInURL()
            && Config.getDeploymentConfig()?.idpConfigs?.responseMode === ResponseMode.formPost) {

            const contextPath: string = window[ "AppUtils" ].getConfig().appBase
                ? `/${ StringUtils.removeSlashesFromPath(window[ "AppUtils" ].getConfig().appBase) }`
                : "";

            return axios.get(contextPath + "/auth").then((response: AxiosResponse ) => {
                return Promise.resolve({
                    authorizationCode: response?.data?.authCode,
                    sessionState: response?.data?.sessionState,
                    state: response?.data?.state
                });
            });
        }

        return;
    };
}
