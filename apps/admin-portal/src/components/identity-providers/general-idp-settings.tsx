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
import { useDispatch, useSelector } from "react-redux";
import { deleteIdentityProvider, updateIdentityProviderDetails } from "../../api";
import { ConfigReducerStateInterface, IdentityProviderInterface } from "../../models";
import { GeneralDetailsForm } from "./forms";
import { AppState } from "../../store";

/**
 * Proptypes for the identity provider general details component.
 */
interface GeneralIdentityProviderSettingsInterface {
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
 * @param {GeneralIdentityProviderSettingsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const GeneralIdentityProviderSettings: FunctionComponent<GeneralIdentityProviderSettingsInterface> = (
    props: GeneralIdentityProviderSettingsInterface
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

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    /**
     * Deletes an identity provider.
     */
    const handleIdentityProviderDelete = (): void => {
        deleteIdentityProvider(idpId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully deleted the identity provider",
                    level: AlertLevels.SUCCESS,
                    message: "Delete successful"
                }));

                onDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Identity Provider Delete Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while deleting the identity provider",
                    level: AlertLevels.ERROR,
                    message: "Identity Provider Delete Error"
                }));
            });
    };

    /**
     * Handles form submit action.
     *
     * @param {IdentityProviderInterface} updatedDetails - Form values.
     */
    const handleFormSubmit = (updatedDetails: IdentityProviderInterface): void => {
        updateIdentityProviderDetails(updatedDetails)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the identity provider",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(idpId);
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
                    description: "An error occurred while updating the identity provider",
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
                        idpId={ idpId }
                        description={ description }
                        isEnabled={ isEnabled }
                        onSubmit={ handleFormSubmit }
                        imageUrl={ imageUrl }
                    />
                    { !(config.deployment.doNotDeleteIdentityProviders.includes(name)) && (
                        <DangerZoneGroup sectionHeader="Danger Zone">
                            <DangerZone
                                actionTitle="Delete identity provider"
                                header="Delete the identity provider"
                                subheader="This action is irreversible. Please proceed with caution."
                                onActionClick={ handleIdentityProviderDelete }
                            />
                        </DangerZoneGroup>
                    ) }
                </>
            )
            : <ContentLoader/>
    );
};
