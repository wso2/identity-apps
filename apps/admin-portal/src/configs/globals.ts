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

interface RuntimeConfigInterface {
    appBaseName?: string;
    appHomePath?: string;
    appLoginPath?: string;
    applicationName?: string;
    clientHost?: string;
    clientID?: string;
    clientOrigin?: string;
    copyrightText?: string;
    loginCallbackUrl?: string;
    serverHost?: string;
    serverOrigin?: string;
    tenant: string;
    tenantPath: string;
    titleText?: string;
    userPortalBaseName: string;
    userPortalClientHost: string;
}

// tslint:disable-next-line:no-string-literal
const RUNTIME_CONFIG: RuntimeConfigInterface = window["runConfig"];

export let GlobalConfig: RuntimeConfigInterface = {
    appBaseName: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.appBaseName || APP_BASENAME) : APP_BASENAME,
    appHomePath: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.appHomePath || APP_HOME_PATH) : APP_HOME_PATH,
    appLoginPath: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.appLoginPath || APP_LOGIN_PATH) : APP_LOGIN_PATH,
    applicationName: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.applicationName || APP_NAME) : APP_NAME,
    clientHost: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.clientHost || CLIENT_HOST_DEFAULT) : CLIENT_HOST_DEFAULT,
    clientID: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.clientID || CLIENT_ID_DEFAULT) : CLIENT_ID_DEFAULT,
    clientOrigin: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.clientOrigin || CLIENT_ORIGIN_DEFAULT) : CLIENT_ORIGIN_DEFAULT,
    copyrightText: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.copyrightText || COPYRIGHT_TEXT_DEFAULT) : COPYRIGHT_TEXT_DEFAULT,
    loginCallbackUrl: (RUNTIME_CONFIG) ?
        (RUNTIME_CONFIG.clientHost || CLIENT_HOST_DEFAULT) + (RUNTIME_CONFIG.loginCallbackUrl || LOGIN_CALLBACK_URL) :
        LOGIN_CALLBACK_URL,
    serverHost: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.serverHost || SERVER_HOST_DEFAULT) : SERVER_HOST_DEFAULT,
    serverOrigin: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.serverOrigin || SERVER_ORIGIN_DEFAULT) : SERVER_ORIGIN_DEFAULT,
    tenant: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.tenant || TENANT_DEFAULT) : TENANT_DEFAULT,
    tenantPath: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.tenantPath || TENANT_PATH_DEFAULT) : TENANT_PATH_DEFAULT,
    titleText: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.copyrightText || TITLE_TEXT_DEFAULT) : TITLE_TEXT_DEFAULT,
    userPortalBaseName: (RUNTIME_CONFIG) ?
        (RUNTIME_CONFIG.userPortalBaseName || USER_PORTAL_BASENAME) : USER_PORTAL_BASENAME,
    userPortalClientHost: (RUNTIME_CONFIG) ?
        (RUNTIME_CONFIG.userPortalClientHost || USER_PORTAL_CLIENT_HOST_DEFAULT) : USER_PORTAL_CLIENT_HOST_DEFAULT
};
