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

/* eslint-disable sort-keys */
export const deploymentConfigMock = {
    accountApp: {
        path: "/account-portal/overview"
    },
    appBaseName: "sample-portal",
    clientID: "SAMPLE_PORTAL",
    debug: false,
    i18nResourcePath: "",
    loginCallbackPath: "/login",
    logoutCallbackPath: "/login",
    routePaths: {
        home: "/overview",
        login: "/login",
        logout: "/logout"
    },
    ui: {
        appCopyright: "WSO2 Identity Server",
        appTitle: "WSO2 Identity Server Sample Dashboard",
        appName: "Identity Server",
        appLogoPath: "/assets/images/logo.svg"
    }
};
/* eslint-enable sort-keys */
