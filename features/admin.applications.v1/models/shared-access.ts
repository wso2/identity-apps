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

import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { RolesInterface } from "@wso2is/core/models";

export interface TreeViewBaseItemWithRoles extends TreeViewBaseItem {
    roles?: RolesInterface[];
    parentId?: string;
}

export interface OrganizationLoginConfirmationParamsInterface {
    /**
     * Whether the enhanced organization login setting is changed.
     */
    isEnhancedOrganizationLoginChanged: boolean;
    /**
     * Whether organization custom roles are being disabled. Enabling them does not need a confirmation.
     */
    isOrganizationCustomRolesDisabled?: boolean;
    /**
     * Whether the role audience of the application is organization.
     */
    isOrganizationAudience: boolean;
}

/**
 * Confirmation details as i18n keys, so that the callers can translate them.
 */
export interface OrganizationLoginConfirmationInterface {
    isDestructive: boolean;
    messageKey: string;
    contentKeys: string[];
    /**
     * Hint for the assertion checkbox, set only for destructive confirmations.
     */
    assertionHintKey?: string;
}
