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

import { ResourceOrigin, ShareStateValue } from "./organization-management";

export interface UnificationRuleModel {
    rule_id: string;
    property_name: string;
    rule_name: string;
    is_active: boolean;
    priority: number;
    // Organization management: OWNED, or SHARED by the organization in owner_org_handle.
    origin?: ResourceOrigin;
    owner_org_handle?: string;
    // Organization management: ACTIVE, or the reason why the rule does not run in this organization.
    state?: ShareStateValue;
}

/**
 * Only these fields can be updated
 */
export interface UpdateUnificationRulePayload {
    rule_name?: string;
    is_active?: boolean;
    priority?: number;
}

export interface CreateUnificationRulePayload {
    property_name: string;
    rule_name: string;
    is_active: boolean;
    priority: number;
}
