/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

export enum RoleSharedAccessModes {
    DO_NOT_SHARE = "do-not-share",
    SHARE_ALL_ROLES_WITH_ALL_ORGS = "share-all-roles-with-all-orgs",
    SHARE_WITH_ALL_ORGS = "share-with-all-orgs",
    SHARE_WITH_SELECTED_ORGS_AND_ROLES = "share-with-selected-orgs-and-roles"
}

export enum ApplicationSharingPolicy {
    ALL_EXISTING_AND_FUTURE_ORGS = "ALL_EXISTING_AND_FUTURE_ORGS",
    SELECTED_ORG_ONLY = "SELECTED_ORG_ONLY",
    SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN = "SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN",
    ALL_EXISTING_ORGS_ONLY = "ALL_EXISTING_ORGS_ONLY"
}

export enum RoleSharingModes {
    ALL = "ALL",
    SELECTED = "SELECTED",
    NONE = "NONE"
}
