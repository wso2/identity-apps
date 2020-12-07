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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { CheckboxProps, Divider } from "semantic-ui-react";
import { deleteIdentityProvider, updateIdentityProviderDetails } from "../../api";
import { IdentityProviderManagementConstants } from "../../constants";
import { IdentityProviderInterface } from "../../models";
import { GeneralDetailsForm } from "../forms";
import { handleIDPDeleteError, handleIDPUpdateError } from "../utils";

/**
 * Proptypes for the identity provider general details component.
 */
interface GeneralSettingsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: IdentityProviderInterface;
    /**
     * Identity provider description.
     */
    description?: string;
    /**
     * Is the idp enabled.
     */
    isEnabled?: boolean;
    /**
     * IDP image URL.
     */
    imageUrl?: string;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Name of the idp.
     */
    name: string;
    /**
     * Callback to be triggered after deleting the idp.
     */
    onDelete: () => void;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 * Component to edit general details of the identity provider.
 *
 * @param {GeneralSettingsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const GeneralSettings: FunctionComponent<GeneralSettingsInterface> = (
    props: GeneralSettingsInterface
): ReactElement => {

    const {
        editingIDP,
        name,
        description,
        isEnabled,
        imageUrl,
        isLoading,
        onDelete,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);

    const handleIdentityProviderDeleteAction = (): void => {
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Deletes an identity provider.
     */
    const handleIdentityProviderDelete = (): void => {
        deleteIdentityProvider(editingIDP.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.deleteIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idp.notifications.deleteIDP.success.message")
                }));

                setShowDeleteConfirmationModal(false);
                onDelete();
            })
            .catch((error) => {
                handleIDPDeleteError(error);
            });
    };

    /**
     * Handles form submit action.
     *
     * @param {IdentityProviderInterface} updatedDetails - Form values.
     */
    const handleFormSubmit = (updatedDetails: IdentityProviderInterface): void => {
        updateIdentityProviderDetails({ id: editingIDP.id, ...updatedDetails })
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idp.notifications.updateIDP.success.message")
                }));
                onUpdate(editingIDP.id);
            })
            .catch((error) => {
                handleIDPUpdateError(error);
            });
    };

    const handleIdentityProviderDisable = (event: any, data: CheckboxProps) => {
        handleFormSubmit(
            {
               isEnabled: data.checked
            }
        );
    };

    return (
        !isLoading
            ? (
                <>
                    <GeneralDetailsForm
                        name={ name }
                        editingIDP={ editingIDP }
                        description={ description }
                        onSubmit={ handleFormSubmit }
                        onUpdate={ onUpdate }
                        imageUrl={ imageUrl }
                        data-testid={ `${ testId }-form` }

                    />
                    <Divider hidden />
                    { !(IdentityProviderManagementConstants.DELETING_FORBIDDEN_IDPS.includes(name)) && (
                        <DangerZoneGroup sectionHeader={ t("console:develop.features.idp.dangerZoneGroup.header") }>
                            <DangerZone
                                actionTitle={ t("console:develop.features.idp.dangerZoneGroup.disableIDP.actionTitle") }
                                header={ t("console:develop.features.idp.dangerZoneGroup.disableIDP.header") }
                                subheader={ t("console:develop.features.idp.dangerZoneGroup.disableIDP.subheader") }
                                onActionClick={ undefined }
                                toggle={ {
                                    checked: isEnabled,
                                    onChange: handleIdentityProviderDisable
                                } }
                                data-testid={ `${ testId }-disable-idp-danger-zone` }
                            />
                            <DangerZone
                                actionTitle={ t("console:develop.features.idp.dangerZoneGroup.deleteIDP.actionTitle") }
                                header={ t("console:develop.features.idp.dangerZoneGroup.deleteIDP.header") }
                                subheader={ t("console:develop.features.idp.dangerZoneGroup.deleteIDP.subheader") }
                                onActionClick={ handleIdentityProviderDeleteAction }
                                data-testid={ `${ testId }-delete-idp-danger-zone` }
                            />
                        </DangerZoneGroup>
                    ) }
                    {
                        showDeleteConfirmationModal && (
                            <ConfirmationModal
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="warning"
                                open={ showDeleteConfirmationModal }
                                assertion={ name }
                                assertionHint={ (
                                    <p>
                                        <Trans
                                            i18nKey="console:develop.features.idp.confirmations.deleteIDP.assertionHint"
                                            tOptions={ { name: name } }
                                        >
                                            Please type
                                            <strong data-testid="idp-name-assertion">
                                                { name }
                                            </strong> to confirm.
                                        </Trans>
                                    </p>
                                ) }
                                assertionType="input"
                                primaryAction={ t("common:confirm") }
                                secondaryAction={ t("common:cancel") }
                                onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                                onPrimaryActionClick={
                                    (): void => handleIdentityProviderDelete()
                                }
                                data-testid={ `${ testId }-delete-idp-confirmation` }
                                closeOnDimmerClick={ false }
                            >
                                <ConfirmationModal.Header data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("console:develop.features.idp.confirmations.deleteIDP.header") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message attached warning
                                                           data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("console:develop.features.idp.confirmations.deleteIDP.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content data-testid={ `${ testId }-delete-idp-confirmation` }>
                                    { t("console:develop.features.idp.confirmations.deleteIDP.content") }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                </>
            )
            : <ContentLoader/>
    );
};

/**
 * Default proptypes for the IDP general settings component.
 */
GeneralSettings.defaultProps = {
    "data-testid": "idp-edit-general-settings"
};
