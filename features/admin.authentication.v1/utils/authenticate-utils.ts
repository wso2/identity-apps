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
import { TokenConstants } from "@wso2is/core/constants";
import { UserAgentParser } from "@wso2is/core/helpers";
import { StringUtils } from "@wso2is/core/utils";
import axios, { AxiosResponse } from "axios";
import isLegacyAuthzRuntime from "../../admin.authorization.v1/utils/get-legacy-authz-runtime";
import { Config } from "../../admin.core.v1";
import { AppConfigs } from "../../admin.core.v1/configs/app-configs";

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
        let baseUrl: string = AppConfigs.getAppUtils()?.getConfig()?.serverOriginWithTenant;

        if (isLegacyAuthzRuntime()) {
            baseUrl = AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.serverOrigin;
        }

        return {
            baseUrl,
            checkSessionInterval: AppConfigs.getAppUtils()?.getConfig()?.session?.checkSessionInterval,
            clientHost: AppConfigs.getAppUtils()?.getConfig()?.clientOriginWithTenant,
            clientID: AppConfigs.getAppUtils()?.getConfig()?.clientID,
            clockTolerance: AppConfigs.getAppUtils()?.getConfig().idpConfigs?.clockTolerance,
            disableTrySignInSilently: new URL(location.href).searchParams.get("disable_silent_sign_in") === "true",
            enableOIDCSessionManagement: AppConfigs.getAppUtils()?.getConfig().idpConfigs?.enableOIDCSessionManagement
                ?? true,
            enablePKCE: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.enablePKCE ?? true,
            endpoints: {
                authorizationEndpoint: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.authorizeEndpointURL,
                checkSessionIframe: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.oidcSessionIFrameEndpointURL,
                endSessionEndpoint: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.logoutEndpointURL,
                issuer: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.issuer,
                jwksUri: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.jwksEndpointURL,
                revocationEndpoint: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.tokenRevocationEndpointURL,
                tokenEndpoint: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.tokenEndpointURL
            },
            periodicTokenRefresh: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.periodicTokenRefresh,
            resourceServerURLs: AuthenticateUtils.resolveBaseUrls(),
            responseMode: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.responseMode ?? responseModeFallback,
            scope: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.scope ?? [ TokenConstants.SYSTEM_SCOPE ],
            sendCookiesInRequests: true,
            sessionRefreshInterval: -1,
            signInRedirectURL: AppConfigs.getAppUtils()?.getConfig()?.loginCallbackURL,
            signOutRedirectURL: AppConfigs.getAppUtils()?.getConfig()?.loginCallbackURL,
            storage: AuthenticateUtils.resolveStorage() as Storage.WebWorker,
            validateIDTokenIssuer: AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.validateIDTokenIssuer,
            ...AppConfigs.getAppUtils()?.getConfig().idpConfigs
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

        if (AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.storage) {
            if (
                AppConfigs.getAppUtils().getConfig().idpConfigs.storage === Storage.WebWorker &&
                new UserAgentParser().browser.name === "IE"
            ) {
                return Storage.SessionStorage;
            }

            return AppConfigs.getAppUtils().getConfig().idpConfigs?.storage;
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
        let baseUrls: string[] = AppConfigs.getAppUtils()?.getConfig()?.idpConfigs?.baseUrls;
        const serverOrigin: string = AppConfigs.getAppUtils()?.getConfig()?.serverOrigin;

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

            const contextPath: string = AppConfigs.getAppUtils().getConfig().appBase
                ? `/${ StringUtils.removeSlashesFromPath(AppConfigs.getAppUtils().getConfig().appBase) }`
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
