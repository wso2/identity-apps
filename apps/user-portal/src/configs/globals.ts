/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
}

export const GlobalConfig: RuntimeConfigInterface = {
    appBaseName: window["AppUtils"].getConfig().appBaseWithTenant,
    appHomePath: window["AppUtils"].getConfig().routes.home,
    appLoginPath: window["AppUtils"].getConfig().routes.login,
    applicationName: window["AppUtils"].getConfig().ui.appName,
    clientHost: window["AppUtils"].getConfig().clientOriginWithTenant,
    clientID: window["AppUtils"].getConfig().clientID,
    clientOrigin: window["AppUtils"].getConfig().clientOrigin,
    copyrightText: `${window["AppUtils"].getConfig().ui.appCopyright} \u00A9 ${ new Date().getFullYear() }`,
    loginCallbackUrl: window["AppUtils"].getConfig().loginCallbackURL,
    serverHost: window["AppUtils"].getConfig().serverOriginWithTenant,
    serverOrigin: window["AppUtils"].getConfig().serverOrigin,
    tenant: window["AppUtils"].getConfig().tenant,
    tenantPath: window["AppUtils"].getConfig().tenantPath,
    titleText: window["AppUtils"].getConfig().appTitle
};
