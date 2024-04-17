/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { CheckboxProps, Divider } from "semantic-ui-react";
import { AppState, FeatureConfigInterface } from "../../../admin.core.v1";
import { deleteIDVP } from "../../api";
import { IdentityVerificationProviderInterface } from "../../models";
import {
    handleIDVPDeleteError,
    handleIDVPDeleteSuccess,
    updateIDVP
} from "../../utils";
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
     * Is the IDVP info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to be triggered after deleting the IDVP.
     */
    onDelete: () => void;
    /**
     * Callback to be triggerred on updating the IDVP details.
     */
    onUpdate: () => void;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Specifies if the IDVP can be deleted.
     */
    isDeletePermitted: boolean;
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
        isLoading,
        onDelete,
        onUpdate,
        isReadOnly,
        isDeletePermitted,
        loader: Loader,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState(false);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const handleIdentityVerificationProviderDeleteAction = (): void => {
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Deletes an identity verification provider.
     *
     * @returns void
     */
    const handleIdentityVerificationProviderDelete = (): void => {

        setLoading(true);
        deleteIDVP(idvp.id)
            .then(handleIDVPDeleteSuccess)
            .catch((error: IdentityAppsApiException) => {
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
     * @returns void
     */
    const handleFormSubmit = (updatedDetails: IdentityVerificationProviderInterface): void => {

        for (const key in updatedDetails) {
            if (updatedDetails[key] !== undefined) {
                idvp[key] = updatedDetails[key];
            }
        }
        updateIDVP(idvp, setIsSubmitting, onUpdate);
    };

    /**
     * Handles disabling of the identity verification provider.
     *
     * @param event - IDVP enable/disable event.
     * @param data - data of the checkbox.
     */
    const handleIdentityVerificationProviderDisable = (event: any, data: CheckboxProps) => {
        handleFormSubmit({ isEnabled: data.checked });
    };

    return (
        !isLoading
            ? (
                <>
                    <GeneralDetailsForm
                        identityVerificationProvider={ idvp }
                        onSubmit={ handleFormSubmit }
                        onUpdate={ onUpdate }
                        data-componentid={ `${ componentId }-form` }
                        isReadOnly={ isReadOnly }
                        isSubmitting={ isSubmitting }
                    />
                    <Divider hidden />
                    { (isDeletePermitted || !isReadOnly) &&(
                        <DangerZoneGroup
                            sectionHeader={ t("idvp:dangerZoneGroup.header") }>
                            <Show when={ featureConfig?.identityVerificationProviders?.scopes?.update }>
                                <DangerZone
                                    actionTitle={
                                        t("idvp:dangerZoneGroup.disableIDVP.actionTitle",
                                            { state: idvp.isEnabled ? t("common:disable") : t("common:enable") })
                                    }
                                    header={
                                        t("idvp:dangerZoneGroup.disableIDVP.header",
                                            { state: idvp.isEnabled ? t("common:disable") : t("common:enable") } )
                                    }
                                    subheader={
                                        idvp.isEnabled ?
                                            t("idvp:dangerZoneGroup.disableIDVP.subheader") :
                                            t("idvp:dangerZoneGroup.disableIDVP.subheader2")
                                    }
                                    onActionClick={ undefined }
                                    toggle={ {
                                        checked: idvp.isEnabled,
                                        onChange: handleIdentityVerificationProviderDisable
                                    } }
                                    data-componentid={ `${ componentId }-disable-idvp-danger-zone` }
                                />
                            </Show>
                            <Show when={ featureConfig?.identityVerificationProviders?.scopes?.delete }>
                                <DangerZone
                                    actionTitle={ t("idvp:dangerZoneGroup" +
                                        ".deleteIDVP.actionTitle") }
                                    header={ t("idvp:dangerZoneGroup.deleteIDVP.header") }
                                    subheader={ t("idvp:dangerZoneGroup" +
                                        ".deleteIDVP.subheader") }
                                    onActionClick={ handleIdentityVerificationProviderDeleteAction }
                                    data-componentid={ `${ componentId }-delete-idvp-danger-zone` }
                                />
                            </Show>
                        </DangerZoneGroup>
                    ) }
                    {
                        showDeleteConfirmationModal && (
                            <ConfirmationModal
                                primaryActionLoading={ loading }
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="negative"
                                open={ showDeleteConfirmationModal }
                                assertionHint={ t("idvp:confirmations" +
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
                                    { t("idvp:confirmations.deleteIDVP.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message
                                    attached
                                    negative
                                    data-componentid={ `${ componentId }-delete-idvp-confirmation` }>
                                    { t("idvp:confirmations.deleteIDVP.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content
                                    data-componentid={ `${ componentId }-delete-idvp-confirmation` }>
                                    { t("idvp:confirmations.deleteIDVP.content") }
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
 * Default proptypes for the IDVP general settings component.
 */
GeneralSettings.defaultProps = {
    "data-componentid": "idvp-edit-general-settings"
};
