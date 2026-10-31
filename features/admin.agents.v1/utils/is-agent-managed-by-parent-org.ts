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

import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";

/**
 * Checks whether the agent is shared down from a parent organization.
 *
 * Agents are SCIM users, hence a shared agent carries the `managedOrg` system schema attribute
 * holding the ID of the organization that owns it, exactly as shared users do.
 *
 * @param agent - Agent resource returned by the SCIM API.
 * @returns `true` when the agent is managed by a parent organization.
 */
const isAgentManagedByParentOrg = (agent: unknown): boolean => {
    const systemSchema: Record<string, unknown> =
        (agent as Record<string, Record<string, unknown>>)?.[SCIMConfigs.scim.systemSchema];

    return Boolean(systemSchema?.managedOrg);
};

export default isAgentManagedByParentOrg;
