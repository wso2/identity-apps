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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { CheckboxProps } from "semantic-ui-react";
import { deleteIdentityProvider, updateIdentityProviderDetails } from "../../../api";
import { ConfigReducerStateInterface, IdentityProviderInterface } from "../../../models";
import { AppState } from "../../../store";
import { GeneralDetailsForm } from "../forms";
import { handleIDPDeleteError, handleIDPUpdateError } from "../utils";

/**
 * Proptypes for the identity provider general details component.
 */
interface GeneralSettingsInterface {
    /**
     * Currently editing idp id.
     */
    idpId?: string;
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
        idpId,
        name,
        description,
        isEnabled,
        imageUrl,
        isLoading,
        onDelete,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    /**
     * Deletes an identity provider.
     */
    const handleIdentityProviderDelete = (): void => {
        deleteIdentityProvider(idpId)
            .then(() => {
                dispatch(addAlert({
                    description: t("devPortal:components.idp.notifications.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.idp.notifications.success.message")
                }));

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
        updateIdentityProviderDetails({ id: idpId, ...updatedDetails })
            .then(() => {
                dispatch(addAlert({
                    description: t("devPortal:components.idp.notifications.updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.idp.notifications.updateIDP.success.message")
                }));
                onUpdate(idpId);
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
                        idpId={ idpId }
                        description={ description }
                        onSubmit={ handleFormSubmit }
                        imageUrl={ imageUrl }
                    />
                    { !(config.ui.doNotDeleteIdentityProviders.includes(name)) && (
                        <DangerZoneGroup sectionHeader={ t("devPortal:components.idp.dangerZoneGroup.header") }>
                            <DangerZone
                                actionTitle={ t("devPortal:components.idp.dangerZoneGroup.disableIDP.actionTitle") }
                                header={ t("devPortal:components.idp.dangerZoneGroup.disableIDP.header") }
                                subheader={ t("devPortal:components.idp.dangerZoneGroup.disableIDP.subheader") }
                                onActionClick={ undefined }
                                toggle={ {
                                    checked: isEnabled,
                                    onChange: handleIdentityProviderDisable
                                } }
                            />
                            <DangerZone
                                actionTitle={ t("devPortal:components.idp.dangerZoneGroup.deleteIDP.actionTitle") }
                                header={ t("devPortal:components.idp.dangerZoneGroup.deleteIDP.header") }
                                subheader={ t("devPortal:components.idp.dangerZoneGroup.deleteIDP.subheader") }
                                onActionClick={ handleIdentityProviderDelete }
                            />
                        </DangerZoneGroup>
                    ) }
                </>
            )
            : <ContentLoader/>
    );
};
