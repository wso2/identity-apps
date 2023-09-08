/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

/**
 * Interface to store basic role data.
 */
export interface RoleBasicInterface {
    name: string;
}

/**
 * Interface to store application role data grouped by application.
 */
export interface ApplicationRoleInterface {
    app: string;
    appName?: string;
    roles: RoleBasicInterface[];
}

/**
 * Interface for group role assignment payload.
 */
export interface GroupRoleAssignPayloadInterface {
    added_roles: ApplicationRoleInterface[];
    removed_roles: ApplicationRoleInterface[];
}
