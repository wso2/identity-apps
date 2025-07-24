/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

/*
 * Application roles constants.
 */
export class ApplicationRolesConstants {

    /**
     * Application role name regex pattern.
     */
    public static readonly APPLICATION_ROLE_NAME_REGEX_PATTERN: string = "^[a-zA-Z][a-zA-Z0-9-_]{2,29}$";
    /**
     * Choreo application template ID.
     */
    public static readonly CHOREO_APP_TEMPLATE_ID: string = "choreo-apim-application-oidc";
    /**
     * Choreo application SP property.
     */
    public static readonly IS_CHOREO_APP_SP_PROPERTY: string = "isChoreoApp";
    /**
     * Organization Login authenticator name
     */
    public static readonly ORGANIZATION_LOGIN: string = "Organization Login";
}

export enum ShareType {
    SHARE_ALL = "SHARE_ALL",
    SHARE_SELECTED = "SHARE_SELECTED",
    UNSHARE = "UNSHARE"
}

export enum RoleShareType {
    SHARE_WITH_ALL = "SHARE_ALL",
    SHARE_SELECTED = "SHARE_SELECTED",
    SHARE_NONE = "SHARE_NONE"
}
