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

/**
 * Class containing constants related to Console roles onboarding.
 */
export class ConsoleRolesOnboardingConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    public static readonly ADD_NEW_ROLE_FORM_ID: string = "add-new-console-role-wizard-form";

    public static readonly ROLE_ASSIGNMENTS_ROLE_ID: string = "roleAssignments";
    public static readonly ROLE_V1_API_RESOURCES_COLLECTION_NAME: string = "rolesV1";
    public static readonly ROLE_API_RESOURCES_COLLECTION_NAME: string = "roles";
    public static readonly ORG_ROLE_ASSIGNMENTS_ROLE_ID: string = "org_roleAssignments";
    public static readonly ORG_ROLE_V1_API_RESOURCES_COLLECTION_NAME: string = "org_rolesV1";
    public static readonly ORG_ROLE_API_RESOURCES_COLLECTION_NAME: string = "org_roles";
    public static readonly ADMINISTRATOR: string = "Administrator";
}
