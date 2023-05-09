/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider } from "semantic-ui-react";
import { deleteIDVP } from "../../api";
import { IdentityVerificationProviderInterface } from "../../models";
import { handleIDVPDeleteError } from "../../utils";
import { GeneralDetailsForm } from "../forms";

/**
 * Proptypes for the identity verification provider general settings component.
 */
interface GeneralSettingsInterface extends IdentifiableComponentInterface {
    /**
     * IDVP that is being edited.
     */
    idvp: IdentityVerificationProviderInterface;
    /**
     * IDVP description.
     */
    description?: string;
    /**
     * Is the IDVP enabled.
     */
    isEnabled?: boolean;
    /**
     * IDVP image URL.
     */
    imageUrl?: string;
    /**
     * Is the IDVP info request loading.
     */
    isLoading?: boolean;
    /**
     * Name of the IDVP.
     */
    name: string;
    /**
     * Callback to be triggered after deleting the IDVP.
     */
    onDelete: () => void;
    /**
     * Callback to update the IDVP details.
     */
    onUpdate: (id: string) => void;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 * Component to edit the general settings of the identity verification provider.
 *
 * @param props - Props injected to the component.
 * @returns General Settings component.
 */
export const GeneralSettings: FunctionComponent<GeneralSettingsInterface> = (
    props: GeneralSettingsInterface
): ReactElement => {

    const {
        idvp,
        name,
        description,
        isEnabled,
        imageUrl,
        isLoading,
        onDelete,
        onUpdate,
        isReadOnly,
        loader: Loader,
        [ "data-componentid" ]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState(false);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const handleIdentityVerificationProviderDeleteAction = (): void => {
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Deletes an identity verification provider.
     */
    const handleIdentityVerificationProviderDelete = (): void => {

        setLoading(true);

        deleteIDVP(idvp.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.idvp.notifications.deleteIDVP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idvp.notifications.deleteIDVP.success.message")
                }));
            })
            .catch((error: AxiosError) => {
                // TODO: Handle error properly
                handleIDVPDeleteError(error);
            })
            .finally(() => {
                setLoading(false);
                setShowDeleteConfirmationModal(false);
                onDelete();
            });
    };

    /**
     * Handles form submit action.
     *
     * @param updatedDetails - Form values.
     */
    const handleFormSubmit = (updatedDetails: IdentityVerificationProviderInterface): void => {
        setIsSubmitting(true);

        // updateIdentityProviderDetails({ id: editingIDP.id, ...updatedDetails })
        //     .then(() => {
        //         dispatch(addAlert({
        //             description: t("console:develop.features.authenticationProvider.notifications.updateIDP." +
        //                 "success.description"),
        //             level: AlertLevels.SUCCESS,
        //             message: t("console:develop.features.authenticationProvider.notifications.updateIDP." +
        //                 "success.message")
        //         }));
        //         onUpdate(editingIDP.id);
        //     })
        //     .catch((error) => {
        //         handleIDPUpdateError(error);
        //     })
        //     .finally(() => {
        //         setIsSubmitting(false);
        //     });
    };

    const handleIdentityVerificationProviderDisable = (event: any, data: CheckboxProps) => {
        // getIDPConnectedApps(editingIDP.id)
        //     .then(async (response: ConnectedAppsInterface) => {
        //         if (response.count === 0) {
        //             handleFormSubmit(
        //                 {
        //                     isEnabled: data.checked
        //                 }
        //             );
        //         } else {
        //             dispatch(addAlert({
        //                 description: "There are applications using this identity provider.",
        //                 level: AlertLevels.WARNING,
        //                 message: "Cannot Disable."
        //             }));
        //         }
        //     })
        //     .catch((error) => {
        //         dispatch(addAlert({
        //             description: error?.description || "Error occurred while trying to retrieve connected " +
        //                 "applications.",
        //             level: AlertLevels.ERROR,
        //             message: error?.message || "Error Occurred."
        //         }));
        //     })
        //     .finally(() => {
        //         setIsAppsLoading(false);
        //     });

    };

    return (
        !isLoading
            ? (
                <>
                    <GeneralDetailsForm
                        name={ name }
                        editingIDP={ idvp }
                        description={ description }
                        onSubmit={ handleFormSubmit }
                        onUpdate={ onUpdate }
                        imageUrl={ imageUrl }
                        data-componentid={ `${ componentId }-form` }
                        isReadOnly={ isReadOnly }
                        isSubmitting={ isSubmitting }
                    />
                    <Divider hidden />
                    <Show when={ AccessControlConstants.IDP_EDIT || AccessControlConstants.IDP_DELETE }>
                        <DangerZoneGroup
                            sectionHeader={ t("console:develop.features.idvp.dangerZoneGroup.header") }>
                            <Show when={ AccessControlConstants.IDP_EDIT }>
                                <DangerZone
                                    actionTitle={
                                        t("console:develop.features.idvp.dangerZoneGroup.disableIDVP.actionTitle",
                                            { state: isEnabled ? t("common:disable") : t("common:enable") })
                                    }
                                    header={
                                        t("console:develop.features.idvp.dangerZoneGroup.disableIDVP.header",
                                            { state: isEnabled ? t("common:disable") : t("common:enable") } )
                                    }
                                    subheader={
                                        isEnabled ?
                                            t("console:develop.features.idvp.dangerZoneGroup.disableIDVP.subheader") :
                                            t("console:develop.features.idvp.dangerZoneGroup.disableIDVP.subheader2")
                                    }
                                    onActionClick={ undefined }
                                    toggle={ {
                                        checked: isEnabled,
                                        onChange: handleIdentityVerificationProviderDisable
                                    } }
                                    data-componentid={ `${ componentId }-disable-idvp-danger-zone` }
                                />
                            </Show>
                            <Show when={ AccessControlConstants.IDP_DELETE }>
                                <DangerZone
                                    actionTitle={ t("console:develop.features.idvp.dangerZoneGroup" +
                                        ".deleteIDVP.actionTitle") }
                                    header={ t("console:develop.features.idvp.dangerZoneGroup.deleteIDVP.header") }
                                    subheader={ t("console:develop.features.idvp.dangerZoneGroup" +
                                        ".deleteIDVP.subheader") }
                                    onActionClick={ handleIdentityVerificationProviderDeleteAction }
                                    data-componentid={ `${ componentId }-delete-idvp-danger-zone` }
                                />
                            </Show>
                        </DangerZoneGroup>
                    </Show>

                    {
                        showDeleteConfirmationModal && (
                            <ConfirmationModal
                                primaryActionLoading={ loading }
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="negative"
                                open={ showDeleteConfirmationModal }
                                assertionHint={ t("console:develop.features.idvp.confirmations" +
                                    ".deleteIDVP.assertionHint") }
                                assertionType="checkbox"
                                primaryAction={ t("common:confirm") }
                                secondaryAction={ t("common:cancel") }
                                onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                                onPrimaryActionClick={ (): void => handleIdentityVerificationProviderDelete() }
                                data-componentid={ `${ componentId }-delete-idvp-confirmation` }
                                closeOnDimmerClick={ false }
                            >
                                <ConfirmationModal.Header
                                    data-componentid={ `${ componentId }-delete-idvp-confirmation` }>
                                    { t("console:develop.features.idvp.confirmations.deleteIDVP.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached
                                    negative
                                    data-componentid={ `${ componentId }-delete-idvp-confirmation` }>
                                    { t("console:develop.features.idvp.confirmations.deleteIDVP.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content
                                    data-componentid={ `${ componentId }-delete-idvp-confirmation` }>
                                    { t("console:develop.features.idvp.confirmations.deleteIDVP.content") }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                </>

            )
            : <Loader />
    );
};

/**
 * Default proptypes for the IDP general settings component.
 */
GeneralSettings.defaultProps = {
    "data-componentid": "idvp-edit-general-settings"
};
