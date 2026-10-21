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
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone, DangerZoneToggleProps } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateApplicationConfigurations } from "../../api/application";

/**
 * Confirmation modal content resolved for the value the user is toggling to.
 */
export interface SharedAccessSettingConfirmationInterface {
    /**
     * Whether the change is destructive and needs a stronger, assertion-based confirmation.
     */
    isDestructive: boolean;
    message: ReactNode;
    content: ReactNode;
}

interface SharedAccessSettingAlertInterface {
    message: string;
    description: string;
}

/**
 * Translated alerts shown after enabling or disabling the setting.
 */
export interface SharedAccessSettingNotificationsInterface {
    enableSuccess: SharedAccessSettingAlertInterface;
    enableError: SharedAccessSettingAlertInterface;
    disableSuccess: SharedAccessSettingAlertInterface;
    disableError: SharedAccessSettingAlertInterface;
}

/**
 * Props interface for the SharedAccessSettingToggle component.
 */
interface SharedAccessSettingTogglePropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the application being configured.
     */
    appId: string;
    /**
     * Current value of the setting.
     */
    isEnabled: boolean;
    header: string;
    subheader: string;
    confirmationHeader: string;
    notifications: SharedAccessSettingNotificationsInterface;
    /**
     * Builds the application configuration payload to persist for the new value.
     */
    getConfigurationPayload: (newValue: boolean) => Record<string, unknown>;
    /**
     * Resolves the confirmation modal content for the value being toggled to.
     */
    getConfirmation: (pendingValue: boolean) => SharedAccessSettingConfirmationInterface;
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
     * Tooltip shown on the toggle while it is disabled.
     */
    disableHint?: string;
}

/**
 * Generic danger zone toggle for shared access settings, with a confirmation modal and save/notify handling.
 *
 * @param props - Props injected to the component.
 * @returns Shared access setting toggle component.
 */
const SharedAccessSettingToggle: FunctionComponent<SharedAccessSettingTogglePropsInterface> = ({
    appId,
    isEnabled,
    header,
    subheader,
    confirmationHeader,
    notifications,
    getConfigurationPayload,
    getConfirmation,
    onUpdate,
    readOnly,
    disabled,
    disableHint,
    "data-componentid": componentId = "shared-access-setting-toggle"
}: SharedAccessSettingTogglePropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ showConfirmation, setShowConfirmation ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ pendingValue, setPendingValue ] = useState<boolean>(false);

    const { isDestructive, message, content }: SharedAccessSettingConfirmationInterface =
        getConfirmation(pendingValue);

    const handleToggle: DangerZoneToggleProps["onChange"] = (
        _event: SyntheticEvent,
        data: { checked?: boolean }
    ): void => {
        if (readOnly) {
            return;
        }
        setPendingValue(data.checked ?? false);
        setShowConfirmation(true);
    };

    const saveConfiguration: (newValue: boolean) => Promise<void> = (newValue: boolean): Promise<void> => {
        const successAlert: SharedAccessSettingAlertInterface = newValue
            ? notifications.enableSuccess
            : notifications.disableSuccess;
        const errorAlert: SharedAccessSettingAlertInterface = newValue
            ? notifications.enableError
            : notifications.disableError;

        setIsSubmitting(true);

        return updateApplicationConfigurations(appId, getConfigurationPayload(newValue))
            .then((): void => {
                dispatch(addAlert({
                    description: successAlert.description,
                    level: AlertLevels.SUCCESS,
                    message: successAlert.message
                }));
                onUpdate();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: errorAlert.description,
                    level: AlertLevels.ERROR,
                    message: errorAlert.message
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
                header={ header }
                subheader={ subheader }
                actionTitle=""
                onActionClick={ (): void => undefined }
                toggle={ {
                    checked: isEnabled,
                    disableHint,
                    disabled: readOnly || disabled || isSubmitting,
                    onChange: handleToggle
                } }
            />

            <ConfirmationModal
                data-componentid={ `${componentId}-confirmation-modal` }
                onClose={ (): void => setShowConfirmation(false) }
                type={ isDestructive ? "negative" : "warning" }
                open={ showConfirmation }
                assertionHint={ isDestructive
                    ? t("applications:edit.sections.organizationCustomRoles.confirmation.assertionHint")
                    : undefined }
                assertionType={ isDestructive ? "checkbox" : undefined }
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
                    { confirmationHeader }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    warning={ !isDestructive }
                    negative={ isDestructive }
                >
                    { message }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { content }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

export default SharedAccessSettingToggle;
