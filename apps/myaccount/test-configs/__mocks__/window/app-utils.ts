/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * @fileoverview AppUtils object Mock.
 *
 * @remarks Document and place all the AppUtils mocks in this file.
 */

interface CustomWindow extends Window {
    AppUtils: { 
        getConfig: () => any;
    };
}

/**
 * `AppUtils` Mock.
 * @remarks The `deployment.config.json file is resolved and stored in the window object under `AppUtils`.
 * This has a method called `getConfig` that needs mocking.
 * IMPORTANT: Constantly keep this updated by executing `window.AppUtils.getConfig()` on the browser.
 */
(window as CustomWindow & typeof globalThis).AppUtils = {
    /* eslint-disable sort-keys, max-len */
    getConfig: function () {
        return {
            consoleApp: {
                path: null
            },
            appBase: "myaccount",
            appBaseNameForHistoryAPI: "/",
            appBaseWithTenant: "/myaccount",
            clientID: "MY_ACCOUNT",
            clientOrigin: "https://localhost:9000",
            clientOriginWithTenant: "https://localhost:9000",
            debug: false,
            idpConfigs: {
                serverOrigin: "https://localhost:9443",
                enablePKCE: true,
                clockTolerance: 300,
                responseMode: "query",
                scope: [
                    "SYSTEM"
                ],
                storage: "webWorker"
            },
            isSaas: true,
            loginCallbackURL: "https://localhost:9000/myaccount",
            logoutCallbackURL: "https://localhost:9000/myaccount",
            productVersionConfig: {
                allowSnapshot: true,
                textCase: "uppercase",
                labelColor: "primary"
            },
            routes: {
                home: "/myaccount/overview",
                login: "/myaccount",
                logout: "/myaccount/logout"
            },
            serverOrigin: "https://localhost:9443",
            serverOriginWithTenant: "https://localhost:9443",
            session: {
                userIdleTimeOut: 600,
                userIdleWarningTimeOut: 580,
                sessionRefreshTimeOut: 300,
                checkSessionInterval: 3
            },
            superTenant: "carbon.super",
            superTenantProxy: "carbon.super",
            tenant: "carbon.super",
            tenantPath: "",
            tenantPrefix: "t",
            ui: {
                appCopyright: "WSO2 Identity Server ${copyright} ${year}",
                appTitle: "My Account | WSO2 Identity Server",
                appName: "My Account",
                appLogoPath: "/assets/images/branding/logo.svg",
                authenticatorApp: [],
                disableMFAforSuperTenantUser: false,
                features: {
                    applications: {
                        disabledFeatures: [],
                        enabled: true,
                        scopes: {
                            create: [],
                            read: [],
                            update: [],
                            delete: []
                        }
                    },
                    overview: {
                        disabledFeatures: [],
                        enabled: true,
                        scopes: {
                            create: [],
                            read: [],
                            update: [],
                            delete: []
                        }
                    },
                    personalInfo: {
                        disabledFeatures: [
                            "profileInfo.mobileVerification"
                        ],
                        enabled: true,
                        scopes: {
                            create: [],
                            read: [],
                            update: [],
                            delete: []
                        }
                    },
                    security: {
                        disabledFeatures: [
                            "security.loginVerifyData.typingDNA"
                        ],
                        enabled: true,
                        scopes: {
                            create: [],
                            read: [],
                            update: [],
                            delete: []
                        }
                    }
                },
                i18nConfigs: {
                    showLanguageSwitcher: true,
                    langAutoDetectEnabled: false
                },
                isCookieConsentBannerEnabled: true,
                isHeaderAvatarLabelAllowed: true,
                privacyPolicyConfigs: {
                    visibleOnFooter: true
                },
                productName: "WSO2 Identity Server",
                productVersionConfig: {
                    allowSnapshot: true,
                    textCase: "uppercase",
                    labelColor: "primary"
                },
                isProfileUsernameReadonly: false,
                theme: {
                    name: "default"
                }
            }
        };
    }
    /* eslint-disable sort-keys, max-len */
};
