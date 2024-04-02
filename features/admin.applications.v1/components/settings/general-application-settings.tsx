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

import { Show } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider } from "semantic-ui-react";
import { applicationConfig } from "../../../admin.extensions.v1";
import { AccessControlConstants } from "../../../admin.access-control.v1/constants/access-control";
import { AppState, FeatureConfigInterface, UIConfigInterface } from "../../../admin.core.v1";
import { deleteApplication, updateApplicationDetails } from "../../api";
import {
    ApplicationInterface,
    ApplicationTemplateListItemInterface
} from "../../models";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";
import { GeneralDetailsForm } from "../forms";

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
    application?: ApplicationInterface
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
        hiddenFields,
        imageUrl,
        accessUrl,
        isLoading,
        onDelete,
        onUpdate,
        readOnly,
        isManagementApp,
        application,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isDeletionInProgress, setIsDeletionInProgress ] = useState<boolean>(false);

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
     * Resolves the danger actions.
     *
     * @returns React.ReactElement DangerZoneGroup element.
     */
    const resolveDangerActions = (): ReactElement => {
        if (!hasRequiredScopes(
            featureConfig?.applications, featureConfig?.applications?.scopes?.update, allowedScopes)) {
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
                    when={ AccessControlConstants.APPLICATION_DELETE }
                >
                    <DangerZoneGroup
                        sectionHeader={ t("applications:dangerZoneGroup.header") }
                    >
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
                            hiddenFields={ hiddenFields }
                            readOnly={
                                readOnly
                                || !hasRequiredScopes(
                                    featureConfig?.applications, featureConfig?.applications?.scopes?.update,
                                    allowedScopes
                                )
                            }
                            hasRequiredScope={ hasRequiredScopes(
                                featureConfig?.applications, featureConfig?.applications?.scopes?.update,
                                allowedScopes) }
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
