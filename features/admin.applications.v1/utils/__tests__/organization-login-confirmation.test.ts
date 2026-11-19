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

import { OrganizationLoginConfirmationInterface } from "../../models/shared-access";
import { resolveOrganizationLoginConfirmation } from "../organization-login-confirmation";

const ENHANCED_KEY: string = "applications:edit.sections.enhancedOrganizationLogin.confirmation";
const CUSTOM_ROLES_KEY: string = "applications:edit.sections.organizationCustomRoles.confirmation";

describe("resolveOrganizationLoginConfirmation", () => {
    it("should resolve a non-destructive confirmation when only enhanced organization login changes", () => {
        const result: OrganizationLoginConfirmationInterface = resolveOrganizationLoginConfirmation({
            isEnhancedOrganizationLoginChanged: true,
            isOrganizationAudience: false
        });

        expect(result).toEqual({
            assertionHintKey: undefined,
            contentKeys: [ `${ ENHANCED_KEY }.content.0` ],
            isDestructive: false,
            messageKey: `${ ENHANCED_KEY }.message`
        });
    });

    it("should resolve a destructive confirmation when disabling both for application audience", () => {
        const result: OrganizationLoginConfirmationInterface = resolveOrganizationLoginConfirmation({
            isEnhancedOrganizationLoginChanged: true,
            isOrganizationAudience: false,
            isOrganizationCustomRolesDisabled: true
        });

        expect(result).toEqual({
            assertionHintKey: `${ CUSTOM_ROLES_KEY }.assertionHint`,
            contentKeys: [ `${ ENHANCED_KEY }.content.0`, `${ ENHANCED_KEY }.content.1` ],
            isDestructive: true,
            messageKey: `${ CUSTOM_ROLES_KEY }.disableMessage`
        });
    });

    it("should resolve a non-destructive confirmation when disabling both for organization audience", () => {
        const result: OrganizationLoginConfirmationInterface = resolveOrganizationLoginConfirmation({
            isEnhancedOrganizationLoginChanged: true,
            isOrganizationAudience: true,
            isOrganizationCustomRolesDisabled: true
        });

        expect(result).toEqual({
            assertionHintKey: undefined,
            contentKeys: [ `${ ENHANCED_KEY }.content.0`, `${ CUSTOM_ROLES_KEY }.content.disableOrganizationAudience` ],
            isDestructive: false,
            messageKey: `${ ENHANCED_KEY }.message`
        });
    });

    it("should resolve a destructive confirmation when only disabling custom roles for application audience", () => {
        const result: OrganizationLoginConfirmationInterface = resolveOrganizationLoginConfirmation({
            isEnhancedOrganizationLoginChanged: false,
            isOrganizationAudience: false,
            isOrganizationCustomRolesDisabled: true
        });

        expect(result).toEqual({
            assertionHintKey: `${ CUSTOM_ROLES_KEY }.assertionHint`,
            contentKeys: [ `${ CUSTOM_ROLES_KEY }.content.disableApplicationAudience` ],
            isDestructive: true,
            messageKey: `${ CUSTOM_ROLES_KEY }.disableMessage`
        });
    });

    it("should resolve a non-destructive confirmation when disabling custom roles for organization audience", () => {
        const result: OrganizationLoginConfirmationInterface = resolveOrganizationLoginConfirmation({
            isEnhancedOrganizationLoginChanged: false,
            isOrganizationAudience: true,
            isOrganizationCustomRolesDisabled: true
        });

        expect(result).toEqual({
            assertionHintKey: undefined,
            contentKeys: [ `${ CUSTOM_ROLES_KEY }.content.disableOrganizationAudience` ],
            isDestructive: false,
            messageKey: `${ CUSTOM_ROLES_KEY }.message`
        });
    });
});
