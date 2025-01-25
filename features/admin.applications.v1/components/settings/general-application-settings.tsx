/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants, AppState, FeatureConfigInterface, UIConfigInterface, history } from "@wso2is/admin.core.v1";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Link
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FormEvent, FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider } from "semantic-ui-react";
import { deleteApplication, disableApplication, updateApplicationDetails } from "../../api/application";
import {
    ApplicationInterface,
    ApplicationTemplateListItemInterface
} from "../../models/application";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";
import { GeneralDetailsForm } from "../forms/general-details-form/general-details-form";

/**
 * Proptypes for the applications general details component.
 */
interface GeneralApplicationSettingsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {

    /**
     * Application access URL.
     */
    accessUrl?: string;
    /**
     * Currently editing application id.
     */
    appId?: string;
    /**
     * Application description.
     */
    description?: string;
    /**
     * Is the application discoverable.
     */
    discoverability?: boolean;
    /**
     * Set of hidden fields.
     */
    hiddenFields?: string[];
    /**
     * Application logo URL.
     */
    imageUrl?: string;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Name of the application.
     */
    name: string;
    /**
     * Callback to be triggered after deleting the application.
     */
    onDelete: () => void;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Application template.
     */
    template?: ApplicationTemplateListItemInterface;
    /**
     * Specifies a Management Application
     */
    isManagementApp?: boolean;
    /**
     * Application.
     */
    application?: ApplicationInterface;
    /**
     * Is branding section hidden.
     */
    isBrandingSectionHidden?: boolean;
}

/**
 * Component to edit general details of the application.
 *
 * @param props - Props injected to the component.
 *
 * @returns ReactElement
 */
export const GeneralApplicationSettings: FunctionComponent<GeneralApplicationSettingsInterface> = (
    props: GeneralApplicationSettingsInterface
): ReactElement => {

    const {
        appId,
        name,
        description,
        discoverability,
        featureConfig,
        imageUrl,
        accessUrl,
        isLoading,
        onDelete,
        onUpdate,
        readOnly,
        isManagementApp,
        application,
        isBrandingSectionHidden,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);

    const hasApplicationsUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.applications?.scopes?.update
    );

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showDisableConfirmationModal, setShowDisableConfirmationModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDeletionInProgress, setIsDeletionInProgress ] = useState<boolean>(false);
    const [ isDisableInProgress, setIsDisableInProgress ] = useState<boolean>(false);
    const [ enableStatus, setEnableStatus ] = useState<boolean>(false);

    /**
     * Deletes an application.
     */
    const handleApplicationDelete = (): void => {
        setIsDeletionInProgress(true);
        deleteApplication(appId)
            .then(() => {
                setIsDeletionInProgress(false);
                dispatch(addAlert({
                    description: t("applications:notifications.deleteApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.deleteApplication.success.message")
                }));

                setShowDeleteConfirmationModal(false);
                onDelete();
            })
            .catch((error: AxiosError) => {
                setIsDeletionInProgress(false);
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.deleteApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.deleteApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.deleteApplication.genericError" +
                        ".message")
                }));
            });
    };

    /**
     * Handles form submit action.
     *
     * @param updatedDetails - Form values.
     */
    const handleFormSubmit = (updatedDetails: ApplicationInterface): void => {
        setIsSubmitting(true);

        updateApplicationDetails(updatedDetails)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.updateApplication.success.message")
                }));

                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Handles the toggle change to show confirmation modal.
     *
     * @param event - Form event.
     * @param data - Checkbox data.
     */
    const handleAppEnableDisableToggleChange = (event: FormEvent<HTMLInputElement>, data: CheckboxProps): void => {
        setEnableStatus(!data.checked);
        setShowDisableConfirmationModal(true);
    };

    /**
     * Disables an application.
     */
    const handleApplicationDisable = (): void => {
        setIsDisableInProgress(true);
        disableApplication(appId, enableStatus)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.disableApplication.success" +
                            ".description", {  state: enableStatus ? "enabled" : "disabled" }),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.disableApplication.success.message",
                        { state: enableStatus ? "enabled" : "disabled" })
                }));
                setShowDisableConfirmationModal(false);
                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.disableApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.disableApplication" +
                        ".genericError.description", {  state: enableStatus ? "enable" : "disable" }),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.disableApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setIsDisableInProgress(false);
                setIsSubmitting(false);
            });
    };

    /**
     * Resolves the danger actions.
     *
     * @returns React.ReactElement DangerZoneGroup element.
     */
    const resolveDangerActions = (): ReactElement => {
        if (!hasApplicationsUpdatePermissions) {
            return null;
        }

        if (UIConfig.systemAppsIdentifiers.includes(name)) {
            return null;
        }

        if (!applicationConfig.editApplication.showDangerZone(application)) {
            return null;
        }

        if (!application?.advancedConfigurations?.fragment) {
            return (
                <Show
                    when={ featureConfig?.applications?.scopes?.delete ||  featureConfig?.applications?.scopes?.update }
                >
                    <DangerZoneGroup
                        sectionHeader={ t("applications:dangerZoneGroup.header") }
                    >
                        <Show when={ featureConfig?.applications?.scopes?.update }>
                            <DangerZone
                                actionTitle={ t("applications:dangerZoneGroup.disableApplication.actionTitle") }
                                header={ t("applications:dangerZoneGroup.disableApplication.header") }
                                subheader={ t("applications:dangerZoneGroup.disableApplication.subheader") }
                                onActionClick={ undefined }
                                toggle={ {
                                    checked: !application.applicationEnabled,
                                    onChange: handleAppEnableDisableToggleChange
                                } }
                                data-testid={ `${ componentId }-danger-zone-disable` }
                            />
                        </Show>
                        <Show when={ featureConfig?.applications?.scopes?.delete }>
                            <DangerZone
                                actionTitle={
                                    t("applications:dangerZoneGroup.deleteApplication" +
                                        ".actionTitle")
                                }
                                header={
                                    t("applications:dangerZoneGroup.deleteApplication.header")
                                }
                                subheader={
                                    t("applications:dangerZoneGroup.deleteApplication" +
                                        ".subheader")
                                }
                                onActionClick={ (): void => setShowDeleteConfirmationModal(true) }
                                data-testid={ `${ componentId }-danger-zone` }
                            />
                        </Show>
                    </DangerZoneGroup>
                </Show>
            );
        }

        return null;
    };

    return (
        !isLoading
            ? (
                <>
                    <EmphasizedSegment padded="very">
                        <GeneralDetailsForm
                            name={ name }
                            appId={ appId }
                            application={ application }
                            description={ description }
                            discoverability={ discoverability }
                            onSubmit={ handleFormSubmit }
                            imageUrl={ imageUrl }
                            accessUrl={ accessUrl }
                            readOnly={
                                readOnly
                                || !hasApplicationsUpdatePermissions
                            }
                            hasRequiredScope={ hasApplicationsUpdatePermissions }
                            isBrandingSectionHidden={ isBrandingSectionHidden }
                            data-testid={ `${ componentId }-form` }
                            isSubmitting={ isSubmitting }
                            isManagementApp={ isManagementApp }
                        />
                    </EmphasizedSegment>
                    <Divider hidden />
                    { resolveDangerActions() }
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("applications:confirmations.deleteApplication." +
                            "assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleApplicationDelete() }
                        closeOnDimmerClick={ false }
                        primaryActionLoading={ isDeletionInProgress }
                        data-testid={ `${ componentId }-application-delete-confirmation-modal` }
                    >

                        {
                            ApplicationManagementUtils.isChoreoApplication(application)
                                ? (
                                    <>
                                        <ConfirmationModal.Header
                                            data-testid={
                                                `${ componentId }-application-delete-confirmation-modal-header`
                                            }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteChoreoApplication.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            negative
                                            data-testid={
                                                `${ componentId }-application-delete-confirmation-modal-message`
                                            }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteChoreoApplication.message") }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={
                                                `${ componentId }-application-delete-confirmation-modal-content`
                                            }
                                        >
                                            <Trans
                                                i18nKey= { "applications:confirmations." +
                                                "deleteChoreoApplication.content" }>
                                                Deleting this application will break the authentication flows and cause
                                                the associated Choreo application to be unusable with its credentials.
                                                <b>Proceed at your own risk.</b>
                                            </Trans>
                                        </ConfirmationModal.Content>
                                    </>
                                )
                                : (
                                    <>
                                        <ConfirmationModal.Header
                                            data-testid={
                                                `${ componentId }-application-delete-confirmation-modal-header`
                                            }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteApplication.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            negative
                                            data-testid={
                                                `${ componentId }-application-delete-confirmation-modal-message`
                                            }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteApplication.message") }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={
                                                `${ componentId }-application-delete-confirmation-modal-content`
                                            }
                                        >
                                            { t("applications:confirmations." +
                                                "deleteApplication.content") }
                                        </ConfirmationModal.Content>
                                    </>
                                )
                        }
                    </ConfirmationModal>
                    <ConfirmationModal
                        onClose={ (): void => setShowDisableConfirmationModal(false) }
                        type="warning"
                        open={ showDisableConfirmationModal }
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDisableConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleApplicationDisable() }
                        closeOnDimmerClick={ false }
                        primaryActionLoading={ isDisableInProgress }
                        data-testid={ `${ componentId }-application-disable-confirmation-modal` }
                    >
                        <ConfirmationModal.Header
                            data-testid={
                                `${ componentId }-application-disable-confirmation-modal-header`
                            }
                        >
                            { enableStatus
                                ? t("applications:confirmations.enableApplication.header")
                                : t("applications:confirmations.disableApplication.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={
                                `${ componentId }-application-disable-confirmation-modal-message`
                            }
                        >
                            { enableStatus
                                ? t("applications:confirmations.enableApplication.message")
                                : t("applications:confirmations.disableApplication.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={
                                `${ componentId }-application-disable-confirmation-modal-content`
                            }
                        >
                            { enableStatus
                                ? t("applications:confirmations.enableApplication.content")
                                : (
                                    <>
                                        <Trans
                                            i18nKey={ "applications:confirmations.disableApplication.content.0" }
                                        >
                                        This may prevent consumers from accessing the application,
                                        but it can be resolved by re-enabling the application.
                                        </Trans>
                                        <br /><br />
                                        <Trans
                                            i18nKey={ "applications:confirmations.disableApplication.content.1" }
                                        >
                                            Ensure that the references to the application in
                                            <Link
                                                data-componentid={ `${componentId}-link-email-templates-page` }
                                                onClick={
                                                    () => history.push(AppConstants.getPaths().get("EMAIL_MANAGEMENT"))
                                                }
                                                external={ false }
                                            >
                                                email templates
                                            </Link> and other relevant locations are updated to reflect the
                                            application status accordingly.
                                        </Trans>
                                    </>
                                )
                            }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </>
            ) :
            (
                <EmphasizedSegment padded="very">
                    <ContentLoader inline="centered" active/>
                </EmphasizedSegment>
            )
    );
};

/**
 * Default props for the application general settings component.
 */
GeneralApplicationSettings.defaultProps = {
    "data-componentid": "application-general-settings"
};
