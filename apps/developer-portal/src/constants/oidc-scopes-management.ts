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

/**
 * Class containing OIDC scopes management constants.
 */
export class OIDCScopesManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */

    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    public static readonly OIDC_ATTRIBUTE_ID: string = "aHR0cDovL3dzbzIub3JnL29pZGMvY2xhaW0";

    public static readonly OIDC_SCOPES_FETCH_ERROR: string = "An error occurred while fetching " +
        "the OIDC scopes.";
    public static readonly OIDC_SCOPE_DETAILS_FETCH_ERROR: string = "An error occurred while fetching " +
        "the details of the OIDC scope.";
    public static readonly OIDC_SCOPE_UPDATE_ERROR: string = "An error occurred while updating " +
        "the details of the OIDC scope.";
    public static readonly OIDC_SCOPE_CREATE_ERROR: string = "An error occurred while creating " +
        "the new OIDC scope.";
    public static readonly OIDC_SCOPE_DELETE_ERROR: string = "An error occurred while deleting " +
        "the OIDC scope.";
}
