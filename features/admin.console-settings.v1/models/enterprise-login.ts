/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
 * Interface for a single group-to-role mapping row.
 */
export interface GroupRoleMappingInterface {
    /**
     * The IDP group name.
     */
    idpGroup: string;
    /**
     * The IDP group ID (if it already exists on the IDP).
     */
    idpGroupId?: string;
    /**
     * The console role ID.
     */
    roleId: string;
    /**
     * The console role display name.
     */
    roleName: string;
}

/**
 * Interface for the complete enterprise login configuration state.
 */
export interface EnterpriseLoginConfigInterface {
    /**
     * The ID of the selected identity provider.
     */
    idpId: string;
    /**
     * The name of the selected identity provider.
     */
    idpName: string;
    /**
     * The default authenticator name of the selected IDP.
     */
    authenticatorName: string;
    /**
     * The default authenticator ID of the selected IDP.
     */
    authenticatorId: string;
    /**
     * The group-to-role mappings.
     */
    mappings: GroupRoleMappingInterface[];
}

/**
 * IDP identifiers that should be preserved in the console login flow
 * and not removed when configuring enterprise login.
 */
export class EnterpriseLoginConstants {

    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    /**
     * IDP names in the authentication sequence that should never be removed.
     * LOCAL = basic auth / local authenticators.
     * SSO = Organization authenticator.
     * PlatformIDP = Asgardeo platform IDP for SaaS.
     */
    public static readonly PRESERVED_IDP_NAMES: ReadonlySet<string> = new Set([
        "LOCAL",
        "SSO",
        "Asgardeo Platform IDP"
    ]);
}
