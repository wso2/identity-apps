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

import { DocumentationConstants } from "@wso2is/core/constants";
import { DocumentationProviders, DocumentationStructureFileTypes } from "@wso2is/core/models";
import { DeploymentConfigInterface } from "../models/config";

/**
 * Class to handle application config operations.
 */
export class AppConfig {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * This method adds organization path to the server host if an organization is selected.
     *
     * @param enforceOrgPath - Enforces the organization path
     *
     * @returns Server host.
     */
    public static resolveServerHost(_enforceOrgPath?: boolean): string {
        return window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant;
    }

    /**
     * Get the deployment config.
     *
     * @returns Deployment config object.
     */
    public static getDeploymentConfig(): DeploymentConfigInterface {
        return {
            accountApp: window[ "AppUtils" ]?.getConfig()?.accountApp,
            adminApp: window[ "AppUtils" ]?.getConfig()?.adminApp,
            allowMultipleAppProtocols: window[ "AppUtils" ]?.getConfig()?.allowMultipleAppProtocols,
            appBaseName: window[ "AppUtils" ]?.getConfig()?.appBaseWithTenant,
            appBaseNameWithoutTenant: window[ "AppUtils" ]?.getConfig()?.appBase,
            appHomePath: window[ "AppUtils" ]?.getConfig()?.routes?.home,
            appLoginPath: window[ "AppUtils" ]?.getConfig()?.routes?.login,
            appLogoutPath: window[ "AppUtils" ]?.getConfig()?.routes?.logout,
            clientHost: window[ "AppUtils" ]?.getConfig()?.clientOriginWithTenant,
            clientID: window[ "AppUtils" ]?.getConfig()?.clientID,
            clientOrigin: window[ "AppUtils" ]?.getConfig()?.clientOrigin,
            customServerHost: window[ "AppUtils" ]?.getConfig()?.customServerHost,
            developerApp: window[ "AppUtils" ]?.getConfig()?.developerApp,
            docSiteURL: window[ "AppUtils" ]?.getConfig()?.docSiteUrl,
            documentation: {
                baseURL: window[ "AppUtils" ]?.getConfig()?.documentation?.baseURL
                    ?? DocumentationConstants.GITHUB_API_BASE_URL,
                contentBaseURL: window[ "AppUtils" ]?.getConfig()?.documentation?.contentBaseURL
                    ?? DocumentationConstants.DEFAULT_CONTENT_BASE_URL,
                githubOptions: {
                    branch: window[ "AppUtils" ]?.getConfig()?.documentation?.githubOptions?.branch
                        ?? DocumentationConstants.DEFAULT_BRANCH
                },
                imagePrefixURL: window[ "AppUtils" ]?.getConfig()?.documentation?.imagePrefixURL
                    ?? DocumentationConstants.DEFAULT_IMAGE_PREFIX_URL,
                provider: window[ "AppUtils" ]?.getConfig()?.documentation?.provider
                    ?? DocumentationProviders.GITHUB,
                structureFileType: window[ "AppUtils" ]?.getConfig()?.documentation?.structureFileType
                    ?? DocumentationStructureFileTypes.YAML,
                structureFileURL: window[ "AppUtils" ]?.getConfig()?.documentation?.structureFileURL
                    ?? DocumentationConstants.DEFAULT_STRUCTURE_FILE_URL
            },
            extensions: window[ "AppUtils" ]?.getConfig()?.extensions,
            idpConfigs: window[ "AppUtils" ]?.getConfig()?.idpConfigs,
            loginCallbackUrl: window[ "AppUtils" ]?.getConfig()?.loginCallbackURL,
            organizationPrefix: window["AppUtils"]?.getConfig()?.organizationPrefix,
            serverHost: window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant,
            serverOrigin: window[ "AppUtils" ]?.getConfig()?.serverOrigin,
            superTenant: window[ "AppUtils" ]?.getConfig()?.superTenant,
            tenant: window[ "AppUtils" ]?.getConfig()?.tenant,
            tenantPath: window[ "AppUtils" ]?.getConfig()?.tenantPath,
            tenantPrefix: window[ "AppUtils" ]?.getConfig()?.tenantPrefix
        };
    }
}
