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

import {
    OrganizationLoginConfirmationInterface,
    OrganizationLoginConfirmationParamsInterface
} from "../models/shared-access";

const ENHANCED_ORGANIZATION_LOGIN_KEY: string = "applications:edit.sections.enhancedOrganizationLogin.confirmation";
const ORGANIZATION_CUSTOM_ROLES_KEY: string = "applications:edit.sections.organizationCustomRoles.confirmation";

/**
 * Resolves the confirmation details for changes to the enhanced organization login and organization custom roles
 * settings.
 *
 * @param params - Changes made to the settings and the role audience of the application.
 * @returns Confirmation details as i18n keys.
 */
export const resolveOrganizationLoginConfirmation = ({
    isEnhancedOrganizationLoginChanged,
    isOrganizationCustomRolesDisabled = false,
    isOrganizationAudience
}: OrganizationLoginConfirmationParamsInterface): OrganizationLoginConfirmationInterface => {
    // Disabling organization custom roles deletes application custom roles, but not organization roles.
    const isDestructive: boolean = isOrganizationCustomRolesDisabled && !isOrganizationAudience;

    const contentKeys: string[] = [];

    if (isEnhancedOrganizationLoginChanged) {
        contentKeys.push(`${ ENHANCED_ORGANIZATION_LOGIN_KEY }.content.0`);
    }

    if (isOrganizationCustomRolesDisabled) {
        if (isOrganizationAudience) {
            contentKeys.push(`${ ORGANIZATION_CUSTOM_ROLES_KEY }.content.disableOrganizationAudience`);
        } else if (isEnhancedOrganizationLoginChanged) {
            // Disabling enhanced organization login also disables organization custom roles.
            contentKeys.push(`${ ENHANCED_ORGANIZATION_LOGIN_KEY }.content.1`);
        } else {
            contentKeys.push(`${ ORGANIZATION_CUSTOM_ROLES_KEY }.content.disableApplicationAudience`);
        }
    }

    let messageKey: string = `${ ORGANIZATION_CUSTOM_ROLES_KEY }.message`;

    if (isDestructive) {
        messageKey = `${ ORGANIZATION_CUSTOM_ROLES_KEY }.disableMessage`;
    } else if (isEnhancedOrganizationLoginChanged) {
        messageKey = `${ ENHANCED_ORGANIZATION_LOGIN_KEY }.message`;
    }

    return {
        assertionHintKey: isDestructive ? `${ ORGANIZATION_CUSTOM_ROLES_KEY }.assertionHint` : undefined,
        contentKeys,
        isDestructive,
        messageKey
    };
};
