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
 * Props interface for the OrganizationCustomRolesToggle component.
 */
interface OrganizationCustomRolesTogglePropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the application being configured.
     */
    appId: string;
    /**
     * Whether organization custom roles are currently enabled for the application.
     */
    isEnabled: boolean;
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
    /**
     * Role audience of the application.
     */
    roleAudience?: string;
}

/**
 * Toggle to enable or disable organization custom roles for shared applications.
 *
 * @param props - Props injected to the component.
 * @returns Organization custom roles toggle component.
 */
const OrganizationCustomRolesToggle: FunctionComponent<OrganizationCustomRolesTogglePropsInterface> = ({
    appId,
    isEnabled,
    onUpdate,
    readOnly,
    disabled,
    roleAudience,
    "data-componentid": componentId = "organization-custom-roles-toggle"
}: OrganizationCustomRolesTogglePropsInterface): ReactElement => {

    const { t } = useTranslation();

    const isOrganizationAudience: boolean = roleAudience?.toUpperCase() === RoleAudienceTypes.ORGANIZATION;

    const notifications: SharedAccessSettingNotificationsInterface = {
        disableError: {
            description: t(
                "applications:edit.sections.organizationCustomRoles.notifications.disable.error.description"
            ),
            message: t("applications:edit.sections.organizationCustomRoles.notifications.disable.error.message")
        },
        disableSuccess: {
            description: t(
                "applications:edit.sections.organizationCustomRoles.notifications.disable.success.description"
            ),
            message: t("applications:edit.sections.organizationCustomRoles.notifications.disable.success.message")
        },
        enableError: {
            description: t("applications:edit.sections.organizationCustomRoles.notifications.enable.error.description"),
            message: t("applications:edit.sections.organizationCustomRoles.notifications.enable.error.message")
        },
        enableSuccess: {
            description: t(
                "applications:edit.sections.organizationCustomRoles.notifications.enable.success.description"
            ),
            message: t("applications:edit.sections.organizationCustomRoles.notifications.enable.success.message")
        }
    };

    /**
     * Resolves the confirmation details for toggling organization custom roles. Enabling them does not need a
     * confirmation.
     */
    const getConfirmation: (pendingValue: boolean) => SharedAccessSettingConfirmationInterface | null = (
        pendingValue: boolean
    ): SharedAccessSettingConfirmationInterface | null => {
        if (pendingValue) {
            return null;
        }

        const confirmation: OrganizationLoginConfirmationInterface = resolveOrganizationLoginConfirmation({
            isEnhancedOrganizationLoginChanged: false,
            isOrganizationAudience,
            isOrganizationCustomRolesDisabled: true
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
                ? t("applications:edit.sections.organizationCustomRoles.disableHint")
                : undefined }
            onUpdate={ onUpdate }
            header={ t("applications:edit.sections.organizationCustomRoles.title") }
            subheader={ t("applications:edit.sections.organizationCustomRoles.description") }
            confirmationHeader={ t("applications:edit.sections.organizationCustomRoles.confirmation.header") }
            notifications={ notifications }
            getConfigurationPayload={ (newValue: boolean): Record<string, unknown> => ({
                organizationCustomRolesEnabled: newValue
            }) }
            getConfirmation={ getConfirmation }
        />
    );
};

export default OrganizationCustomRolesToggle;
