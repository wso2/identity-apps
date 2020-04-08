/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels, CRUDPermissionsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteApplication, regenerateClientSecret, revokeClientSecret, updateApplicationDetails } from "../../api";
import { ApplicationInterface, ConfigReducerStateInterface } from "../../models";
import { AppState } from "../../store";
import { GeneralDetailsForm } from "./forms";
import { setHelpPanelDocsContentURL } from "../../store/actions";

/**
 * Proptypes for the applications general details component.
 */
interface GeneralApplicationSettingsInterface {
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
     * CRUD permissions,
     */
    permissions?: CRUDPermissionsInterface;
    /**
     * whether to show regenerate in danger zones or not
     */
    showRegenerate?: boolean;
    /**
     * whether to show revoke in danger zones or not
     */
    showRevoke?: boolean;
}

/**
 * Component to edit general details of the application.
 *
 * @param {GeneralApplicationSettingsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const GeneralApplicationSettings: FunctionComponent<GeneralApplicationSettingsInterface> = (
    props: GeneralApplicationSettingsInterface
): ReactElement => {

    const {
        appId,
        name,
        description,
        discoverability,
        imageUrl,
        accessUrl,
        isLoading,
        onDelete,
        onUpdate,
        permissions,
        showRegenerate,
        showRevoke
    } = props;

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const helpPanelMetadata = useSelector((state: AppState) => state.helpPanel.metadata);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showRevokeConfirmationModal, setShowRevokeConfirmationModal ] = useState<boolean>(false);
    const [ showRegenerateConfirmationModal, setShowRegenerateConfirmationModal ] = useState<boolean>(false);

    /**
     * Set the default doc content URL for the tab.
     */
    useEffect(() => {
        if (!helpPanelMetadata?.applications?.docs?.general) {
            return;
        }

        dispatch(setHelpPanelDocsContentURL(helpPanelMetadata.applications.docs.general));
    }, [ helpPanelMetadata ]);

    /**
     * Deletes an application.
     */
    const handleApplicationDelete = (): void => {
        deleteApplication(appId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully deleted the application",
                    level: AlertLevels.SUCCESS,
                    message: "Delete successful"
                }));

                setShowDeleteConfirmationModal(false);
                onDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Delete Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while deleting the application",
                    level: AlertLevels.ERROR,
                    message: "Application Delete Error"
                }));
            });
    };

    /**
     * Revokes application.
     */
    const handleApplicationRevoke = (): void => {
        revokeClientSecret(appId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully revoked the application",
                    level: AlertLevels.SUCCESS,
                    message: "Revoke successful"
                }));

                setShowDeleteConfirmationModal(false);
                onDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application revoke Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while revoking the application",
                    level: AlertLevels.ERROR,
                    message: "Application Revoke Error"
                }));
            });
    };

    /**
     * Revokes application.
     */
    const handleApplicationRegenerate = (): void => {
        regenerateClientSecret(appId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully regenerated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Regenerate successful"
                }));

                setShowDeleteConfirmationModal(false);
                onDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Regenerate Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while regenerating the application",
                    level: AlertLevels.ERROR,
                    message: "Application Regenerate Error"
                }));
            });
    };


    /**
     * Handles form submit action.
     *
     * @param {ApplicationInterface} updatedDetails - Form values.
     */
    const handleFormSubmit = (updatedDetails: ApplicationInterface): void => {
        updateApplicationDetails(updatedDetails)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    return (
        !isLoading
            ? (
                <>
                    <GeneralDetailsForm
                        name={ name }
                        appId={ appId }
                        description={ description }
                        discoverability={ discoverability }
                        onSubmit={ handleFormSubmit }
                        imageUrl={ imageUrl }
                        accessUrl={ accessUrl }
                    />
                    {
                        (permissions && permissions.delete === false)
                            ? null
                            : !config.deployment.doNotDeleteApplications.includes(name) && (
                            <DangerZoneGroup sectionHeader="Danger Zone">
                                { showRegenerate && (
                                    <DangerZone
                                        actionTitle="Regenerate"
                                        header="Regenerate the client secret"
                                        subheader="This action is irreversible. Please proceed with caution."
                                        onActionClick={ (): void => setShowRegenerateConfirmationModal(true) }
                                    />
                                )
                                }
                                { showRevoke && (
                                    <DangerZone
                                        actionTitle="Revoke"
                                        header="Revoke the application"
                                        subheader="This action is reversible but cannot use the same
                                                client secret. Please proceed with caution."
                                        onActionClick={ (): void => setShowRevokeConfirmationModal(true) }
                                    />
                                )
                                }
                                <DangerZone
                                    actionTitle="Delete"
                                    header="Delete the application"
                                    subheader="This action is irreversible. Please proceed with caution."
                                    onActionClick={ (): void => setShowDeleteConfirmationModal(true) }
                                />
                            </DangerZoneGroup>
                        )
                    }
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ name }
                        assertionHint={ <p>Please type <strong>{ name }</strong> to confirm.</p> }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleApplicationDelete() }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the application.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this application, you will not be able to get it back. All the applications
                            depending on this also might stop working. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                    <ConfirmationModal
                        onClose={ (): void => setShowRevokeConfirmationModal(false) }
                        type="warning"
                        open={ showRevokeConfirmationModal }
                        assertion={ name }
                        assertionHint={ <p>Please type <strong>{ name }</strong> to confirm.</p> }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowRevokeConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleApplicationRevoke() }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is can be reversed by regenerating client secret.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you Revoke this application, All the applications
                            depending on this also might stop working. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                    <ConfirmationModal
                        onClose={ (): void => setShowRegenerateConfirmationModal(false) }
                        type="warning"
                        open={ showRegenerateConfirmationModal }
                        assertion={ name }
                        assertionHint={ <p>Please type <strong>{ name }</strong> to confirm.</p> }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowRegenerateConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleApplicationRegenerate() }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and permanently change the client secret.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you regenerate this application, All the applications
                            depending on this also might stop working. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </>
            )
            : <ContentLoader/>
    );
};
