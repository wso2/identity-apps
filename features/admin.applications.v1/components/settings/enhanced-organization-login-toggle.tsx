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

import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import SharedAccessSettingToggle, {
    SharedAccessSettingConfirmationInterface,
    SharedAccessSettingNotificationsInterface
} from "./shared-access-setting-toggle";
import { OrganizationLoginConfirmationInterface } from "../../models/shared-access";
import { resolveOrganizationLoginConfirmation } from "../../utils/organization-login-confirmation";

/**
 * Props interface for the EnhancedOrganizationLoginToggle component.
 */
interface EnhancedOrganizationLoginTogglePropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the application being configured.
     */
    appId: string;
    /**
     * Whether enhanced organization login is currently enabled.
     */
    isEnabled: boolean;
    /**
     * Saved value of the organization custom roles setting.
     */
    isOrganizationCustomRolesEnabled?: boolean;
    /**
     * Whether the organization custom roles feature is enabled.
     */
    isOrganizationCustomRolesFeatureEnabled?: boolean;
    /**
     * Role audience of the application.
     */
    roleAudience?: string;
    /**
     * Callback fired after a successful update.
     */
    onUpdate: () => void;
    /**
     * If true, renders the toggle in read-only mode.
     */
    readOnly?: boolean;
    /**
     * If true, renders the toggle disabled.
     */
    disabled?: boolean;
}

/**
 * Toggle card to enable or disable the enhanced organization login flow for an application.
 *
 * @param props - Props injected to the component.
 * @returns Enhanced organization login toggle component.
 */
const EnhancedOrganizationLoginToggle: FunctionComponent<EnhancedOrganizationLoginTogglePropsInterface> = ({
    appId,
    isEnabled,
    isOrganizationCustomRolesEnabled,
    isOrganizationCustomRolesFeatureEnabled,
    onUpdate,
    readOnly,
    disabled,
    roleAudience,
    "data-componentid": componentId = "enhanced-organization-login-toggle"
}: EnhancedOrganizationLoginTogglePropsInterface): ReactElement => {

    const { t } = useTranslation();

    const isOrganizationAudience: boolean = roleAudience?.toUpperCase() === RoleAudienceTypes.ORGANIZATION;

    const notifications: SharedAccessSettingNotificationsInterface = {
        disableError: {
            description: t(
                "applications:edit.sections.enhancedOrganizationLogin.notifications.disable.error.description"
            ),
            message: t("applications:edit.sections.enhancedOrganizationLogin.notifications.disable.error.message")
        },
        disableSuccess: {
            description: t(
                "applications:edit.sections.enhancedOrganizationLogin.notifications.disable.success.description"
            ),
            message: t("applications:edit.sections.enhancedOrganizationLogin.notifications.disable.success.message")
        },
        enableError: {
            description: t(
                "applications:edit.sections.enhancedOrganizationLogin.notifications.enable.error.description"
            ),
            message: t("applications:edit.sections.enhancedOrganizationLogin.notifications.enable.error.message")
        },
        enableSuccess: {
            description: t(
                "applications:edit.sections.enhancedOrganizationLogin.notifications.enable.success.description"
            ),
            message: t("applications:edit.sections.enhancedOrganizationLogin.notifications.enable.success.message")
        }
    };

    /**
     * Resolves the confirmation details for toggling enhanced organization login.
     */
    const getConfirmation: (pendingValue: boolean) => SharedAccessSettingConfirmationInterface = (
        pendingValue: boolean
    ): SharedAccessSettingConfirmationInterface => {
        // Disabling enhanced organization login also disables organization custom roles.
        const confirmation: OrganizationLoginConfirmationInterface = resolveOrganizationLoginConfirmation({
            isEnhancedOrganizationLoginChanged: true,
            isOrganizationAudience,
            isOrganizationCustomRolesDisabled: !pendingValue && isOrganizationCustomRolesFeatureEnabled
                && isOrganizationCustomRolesEnabled
        });

        return {
            assertionHint: confirmation.assertionHintKey ? t(confirmation.assertionHintKey) : undefined,
            content: (
                <>
                    { confirmation.contentKeys.map((contentKey: string) => (
                        <p key={ contentKey }>{ t(contentKey) }</p>
                    )) }
                </>
            ),
            isDestructive: confirmation.isDestructive,
            message: t(confirmation.messageKey)
        };
    };

    return (
        <SharedAccessSettingToggle
            data-componentid={ componentId }
            appId={ appId }
            isEnabled={ isEnabled }
            readOnly={ readOnly }
            disabled={ disabled }
            disableHint={ disabled
                ? t("applications:edit.sections.enhancedOrganizationLogin.disableHint")
                : undefined }
            onUpdate={ onUpdate }
            header={ t("applications:edit.sections.enhancedOrganizationLogin.title") }
            subheader={ t("applications:edit.sections.enhancedOrganizationLogin.description") }
            confirmationHeader={ t("applications:edit.sections.enhancedOrganizationLogin.confirmation.header") }
            notifications={ notifications }
            getConfigurationPayload={ (newValue: boolean): Record<string, unknown> => ({
                enhancedOrgAuthenticationEnabled: newValue,
                // Organization custom roles require enhanced organization login. Clear the stored value even when
                // the feature is off, since the server rejects disabling enhanced organization login while it is set.
                ...(!newValue && isOrganizationCustomRolesEnabled ? { organizationCustomRolesEnabled: false } : {})
            }) }
            getConfirmation={ getConfirmation }
        />
    );
};

export default EnhancedOrganizationLoginToggle;
