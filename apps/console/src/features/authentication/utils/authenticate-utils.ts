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

import { AuthReactConfig, ResponseMode, Storage } from "@asgardeo/auth-react";
import { TokenConstants } from "@wso2is/core/constants";
import UAParser from "ua-parser-js";

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
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static initializeConfig: AuthReactConfig = {
        baseUrl:
            window["AppUtils"].getConfig().idpConfigs?.serverOrigin ??
            window[ "AppUtils" ].getConfig().idpConfigs.serverOrigin,
        checkSessionInterval: window[ "AppUtils" ].getConfig()?.session?.checkSessionInterval,
        clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
        clientID: window["AppUtils"].getConfig().clientID,
        clockTolerance: window[ "AppUtils" ].getConfig().idpConfigs?.clockTolerance,
        disableTrySignInSilently: new URL(location.href).searchParams.get("disable_silent_sign_in") === "true",
        enableOIDCSessionManagement: true,
        enablePKCE: window["AppUtils"].getConfig().idpConfigs?.enablePKCE ?? true,
        endpoints: {
            authorizationEndpoint: window["AppUtils"].getConfig().idpConfigs?.authorizeEndpointURL,
            checkSessionIframe: window["AppUtils"].getConfig().idpConfigs?.oidcSessionIFrameEndpointURL,
            endSessionEndpoint: window["AppUtils"].getConfig().idpConfigs?.logoutEndpointURL,
            jwksUri: window["AppUtils"].getConfig().idpConfigs?.jwksEndpointURL,
            revocationEndpoint: window["AppUtils"].getConfig().idpConfigs?.tokenRevocationEndpointURL,
            tokenEndpoint: window["AppUtils"].getConfig().idpConfigs?.tokenEndpointURL
        },
        resourceServerURLs: AuthenticateUtils.resolveBaseUrls(),
        responseMode: window["AppUtils"].getConfig().idpConfigs?.responseMode ?? responseModeFallback,
        scope: window["AppUtils"].getConfig().idpConfigs?.scope ?? [TokenConstants.SYSTEM_SCOPE],
        sendCookiesInRequests: true,
        sessionRefreshInterval: window[ "AppUtils" ].getConfig()?.session?.sessionRefreshTimeOut,
        signInRedirectURL: window["AppUtils"].getConfig().loginCallbackURL,
        signOutRedirectURL: window["AppUtils"].getConfig().loginCallbackURL,
        storage: AuthenticateUtils.resolveStorage() as Storage.WebWorker
    };

    /**
     * Determines what storage type should be used to store session information.
     *
     * @returns {Storage}
     */
    public static resolveStorage(): Storage {
        const storageFallback: Storage =
            new UAParser().getBrowser().name === "IE" ? Storage.SessionStorage : Storage.WebWorker;

        if (window["AppUtils"].getConfig().idpConfigs?.storage) {
            if (
                window["AppUtils"].getConfig().idpConfigs?.storage === Storage.WebWorker &&
                new UAParser().getBrowser().name === "IE"
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
     * @return {string[]}
     */
    public static resolveBaseUrls(): string[] {
        let baseUrls = window["AppUtils"].getConfig().idpConfigs?.baseUrls;
        const serverOrigin = window["AppUtils"].getConfig().serverOrigin;

        if (baseUrls) {
            // If the server origin is not specified in the overridden config, append it.
            if (!baseUrls.includes(serverOrigin)) {
                baseUrls = [ ...baseUrls, serverOrigin ];
            }

            return baseUrls;
        }

        return [serverOrigin];
    }

    /**
     * Resolves IDP URLs when the tenant resolves. Returns
     *
     * @param {string} originalURL - Original URL.
     * @param {string} overriddenURL - Overridden URL from config.
     * @return {string}
     */
    public static resolveIdpURLSAfterTenantResolves(originalURL: string, overriddenURL: string): string {
        const parsedOriginalURL: URL = new URL(originalURL);
        const parsedOverrideURL: URL = new URL(overriddenURL);

        // If the override URL & original URL has search params, try to moderate the URL.
        if (parsedOverrideURL.search && parsedOriginalURL.search) {
            for (const [key, value] of parsedOriginalURL.searchParams.entries()) {
                if (!parsedOverrideURL.searchParams.has(key)) {
                    parsedOverrideURL.searchParams.append(key, value);
                }
            }

            return parsedOverrideURL.toString();
        }

        return overriddenURL + parsedOriginalURL.search;
    }
}
