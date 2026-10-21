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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps } from "semantic-ui-react";
import { updateApplicationConfigurations } from "../../api/application";

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
     * Whether organizations are currently allowed to manage roles for the application. This requires
     * enhanced organization login, hence it is disallowed together when enhanced organization login is disabled.
     */
    isSharedAppRoleManagementAllowed?: boolean;
    /**
     * Role audience of the application. With organization audience, disallowing role management for organizations
     * does not delete their organization roles.
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
}

/**
 * Toggle card to enable or disable the enhanced organization login flow for an application.
 *
 * @param props - Props injected to the component.
 * @returns Enhanced organization login toggle component.
 */
export const EnhancedOrganizationLoginToggle: FunctionComponent<EnhancedOrganizationLoginTogglePropsInterface> = ({
    appId,
    isEnabled,
    isSharedAppRoleManagementAllowed,
    onUpdate,
    readOnly,
    roleAudience,
    "data-componentid": componentId
}: EnhancedOrganizationLoginTogglePropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ showConfirmation, setShowConfirmation ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ pendingValue, setPendingValue ] = useState<boolean>(false);

    const isOrganizationAudience: boolean = roleAudience?.toUpperCase() === RoleAudienceTypes.ORGANIZATION;
    // Disabling enhanced organization login also disallows role management for organizations. With application
    // audience, it deletes the application roles created by organizations. With organization audience, their
    // organization roles are only no longer honoured for the application.
    const isDisallowingRoleManagement: boolean = !pendingValue && !!isSharedAppRoleManagementAllowed;
    const isDeletingOrganizationRoles: boolean = isDisallowingRoleManagement && !isOrganizationAudience;

    const handleToggle: (_event: SyntheticEvent, data: CheckboxProps) => void = (
        _event: SyntheticEvent,
        data: CheckboxProps
    ): void => {
        if (readOnly) {
            return;
        }
        setPendingValue(data.checked ?? false);
        setShowConfirmation(true);
    };

    const saveConfiguration: (newValue: boolean) => Promise<void> = (newValue: boolean): Promise<void> => {
        const direction: string = newValue ? "enable" : "disable";

        setIsSubmitting(true);

        return updateApplicationConfigurations(appId, {
            enhancedOrgAuthenticationEnabled: newValue,
            // Application role management for shared applications requires enhanced organization login.
            ...(!newValue && isSharedAppRoleManagementAllowed ? { sharedAppRoleManagementEnabled: false } : {})
        })
            .then((): void => {
                dispatch(addAlert({
                    description: t(
                        "applications:edit.sections.enhancedOrganizationLogin" +
                        `.notifications.${direction}.success.description`
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "applications:edit.sections.enhancedOrganizationLogin" +
                        `.notifications.${direction}.success.message`
                    )
                }));
                onUpdate();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t(
                        "applications:edit.sections.enhancedOrganizationLogin" +
                        `.notifications.${direction}.error.description`
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "applications:edit.sections.enhancedOrganizationLogin" +
                        `.notifications.${direction}.error.message`
                    )
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
            });
    };

    return (
        <>
            <DangerZone
                data-componentid={ componentId }
                className="action-zone"
                header={ t("applications:edit.sections.enhancedOrganizationLogin.title") }
                subheader={ t("applications:edit.sections.enhancedOrganizationLogin.description") }
                actionTitle=""
                onActionClick={ (): void => undefined }
                toggle={ {
                    checked: isEnabled,
                    disabled: readOnly || isSubmitting,
                    onChange: handleToggle
                } }
            />

            <ConfirmationModal
                data-componentid={ `${componentId}-confirmation-modal` }
                onClose={ (): void => setShowConfirmation(false) }
                // With application audience, disabling while role management is allowed deletes the application
                // roles created by organizations.
                type={ isDeletingOrganizationRoles ? "negative" : "warning" }
                open={ showConfirmation }
                assertionHint={ isDeletingOrganizationRoles
                    ? t("applications:edit.sections.sharedAppRoleManagement.confirmation.assertionHint")
                    : undefined }
                assertionType={ isDeletingOrganizationRoles ? "checkbox" : undefined }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onPrimaryActionClick={ (): void => {
                    setShowConfirmation(false);
                    saveConfiguration(pendingValue);
                } }
                onSecondaryActionClick={ (): void => setShowConfirmation(false) }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("applications:edit.sections.enhancedOrganizationLogin.confirmation.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning={ !isDeletingOrganizationRoles }
                    negative={ isDeletingOrganizationRoles }
                >
                    { isDeletingOrganizationRoles
                        ? t("applications:edit.sections.sharedAppRoleManagement.confirmation.disableMessage")
                        : t("applications:edit.sections.enhancedOrganizationLogin.confirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    <p>
                        { t("applications:edit.sections.enhancedOrganizationLogin" +
                            ".confirmation.content.0") }
                    </p>
                    { isDisallowingRoleManagement && (
                        <p data-componentid={ `${componentId}-shared-app-role-management-note` }>
                            { isOrganizationAudience
                                ? t("applications:edit.sections.sharedAppRoleManagement.confirmation.content" +
                                    ".disableOrganizationAudience")
                                : t("applications:edit.sections.enhancedOrganizationLogin.confirmation.content.1") }
                        </p>
                    ) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
 * Default props for the EnhancedOrganizationLoginToggle component.
 */
EnhancedOrganizationLoginToggle.defaultProps = {
    "data-componentid": "enhanced-organization-login-toggle"
};
