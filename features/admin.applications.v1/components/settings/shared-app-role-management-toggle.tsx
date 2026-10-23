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
 * Props interface for the SharedAppRoleManagementToggle component.
 */
interface SharedAppRoleManagementTogglePropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the application being configured.
     */
    appId: string;
    /**
     * Whether organizations are currently allowed to manage roles for the application.
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
     * Role audience of the application. With organization audience, the organization roles of organizations are
     * honoured for the application, and disallowing does not delete them.
     */
    roleAudience?: string;
}

/**
 * Toggle card to allow or disallow organizations to manage roles for the shared applications of an application.
 * With application audience roles, disallowing it deletes the application roles created by organizations, after
 * confirmation. With organization audience roles, disallowing it deletes no roles.
 *
 * @param props - Props injected to the component.
 * @returns Shared application role management toggle component.
 */
export const SharedAppRoleManagementToggle: FunctionComponent<SharedAppRoleManagementTogglePropsInterface> = ({
    appId,
    isEnabled,
    onUpdate,
    readOnly,
    roleAudience,
    "data-componentid": componentId
}: SharedAppRoleManagementTogglePropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ showConfirmation, setShowConfirmation ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ pendingValue, setPendingValue ] = useState<boolean>(false);

    const isOrganizationAudience: boolean = roleAudience?.toUpperCase() === RoleAudienceTypes.ORGANIZATION;
    // Disallowing deletes the application roles created by organizations, but not their organization roles.
    const isDeletingOrganizationRoles: boolean = !pendingValue && !isOrganizationAudience;

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
            allowSharedAppRoleManagement: newValue
        })
            .then((): void => {
                dispatch(addAlert({
                    description: t(
                        "applications:edit.sections.sharedAppRoleManagement" +
                        `.notifications.${direction}.success.description`
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "applications:edit.sections.sharedAppRoleManagement" +
                        `.notifications.${direction}.success.message`
                    )
                }));
                onUpdate();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t(
                        "applications:edit.sections.sharedAppRoleManagement" +
                        `.notifications.${direction}.error.description`
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "applications:edit.sections.sharedAppRoleManagement" +
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
                header={ t("applications:edit.sections.sharedAppRoleManagement.title") }
                subheader={ t("applications:edit.sections.sharedAppRoleManagement.description") }
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
                // Disallowing deletes the application roles created by organizations. Hence, it needs an assertion.
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
                    { t("applications:edit.sections.sharedAppRoleManagement.confirmation.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning={ !isDeletingOrganizationRoles }
                    negative={ isDeletingOrganizationRoles }
                >
                    { isDeletingOrganizationRoles
                        ? t("applications:edit.sections.sharedAppRoleManagement.confirmation.disableMessage")
                        : t("applications:edit.sections.sharedAppRoleManagement.confirmation.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    <p>
                        { t("applications:edit.sections.sharedAppRoleManagement.confirmation.content." +
                            (pendingValue ? "enable" : "disable") +
                            (isOrganizationAudience ? "OrganizationAudience" : "")) }
                    </p>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
 * Default props for the SharedAppRoleManagementToggle component.
 */
SharedAppRoleManagementToggle.defaultProps = {
    "data-componentid": "shared-app-role-management-toggle"
};
