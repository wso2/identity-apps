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

import { CheckboxProps, Grid, Icon } from "semantic-ui-react";
import { ConfirmationModal, ContentLoader, PrimaryButton } from "@wso2is/react-components";
import {
    FederatedAuthenticatorInterface,
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorListResponseInterface
} from "../../../models";
import {
    getFederatedAuthenticatorDetails,
    getFederatedAuthenticatorMeta,
    updateFederatedAuthenticator
} from "../../../api";
import React, { FormEvent, FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { AuthenticatorAccordion } from "../../shared";
import { AuthenticatorFormFactory } from "../forms";
import { FederatedAuthenticators } from "../meta/authenticators";
import { useDispatch } from "react-redux";

/**
 * Proptypes for the identity providers settings component.
 */
interface IdentityProviderSettingsPropsInterface {
    /**
     * Currently editing idp id.
     */
    idpId: string;

    /**
     * federatedAuthenticators of the IDP
     */
    federatedAuthenticators: FederatedAuthenticatorListResponseInterface;
    /**
     * Is the idp info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 *  Identity Provider and advance settings component.
 *
 * @param {IdentityProviderSettingsPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticatorSettings: FunctionComponent<IdentityProviderSettingsPropsInterface> = (
    props: IdentityProviderSettingsPropsInterface
): ReactElement => {

    const {
        idpId,
        federatedAuthenticators,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [
        deletingAuthenticator,
        setDeletingAuthenticator
    ] = useState<FederatedAuthenticatorListItemInterface>(undefined);
    const [availableAuthenticators, setAvailableAuthenticators] = useState<FederatedAuthenticatorInterface[]>([]);

    /**
     * Handles the inbound config form submit action.
     *
     * @param values - Form values.
     */
    const handleInboundConfigFormSubmit = (values: any): void => {
        updateFederatedAuthenticator(idpId, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the federated authenticator.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));
                onUpdate(idpId)
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the federated authenticator.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    const handleAuthenticatorAPICallError = (error) => {
        if (error.response && error.response.data && error.response.data.description) {
            dispatch(addAlert({
                description: error.response.data.description,
                level: AlertLevels.ERROR,
                message: "Retrieval error"
            }));

            return;
        }

        dispatch(addAlert({
            description: "An error occurred retrieving the federated authenticator details.",
            level: AlertLevels.ERROR,
            message: "Retrieval error"
        }));
    };

    const handleMetadataAPICallError = (error) => {
        if (error.response && error.response.data && error.response.data.description) {
            dispatch(addAlert({
                description: error.response.data.description,
                level: AlertLevels.ERROR,
                message: "Retrieval error"
            }));

            return;
        }

        dispatch(addAlert({
            description: "An error occurred retrieving the federated authenticator metadata.",
            level: AlertLevels.ERROR,
            message: "Retrieval error"
        }));
    };

    /**
     * Fetch data and metadata of a given authenticatorId and return a promise.
     *
     * @param authenticatorId ID of the authenticator.
     */
    const fetchAuthenticator = (authenticatorId: string) => {
        return new Promise(resolve => {
            getFederatedAuthenticatorDetails(idpId, authenticatorId)
                .then(data => {
                    getFederatedAuthenticatorMeta(authenticatorId)
                        .then(meta => {
                            resolve({
                                data: data,
                                id: authenticatorId,
                                meta: meta
                            })
                        })
                        .catch(error => {
                            handleMetadataAPICallError(error)
                        });
                })
                .catch(error => {
                    handleAuthenticatorAPICallError(error);
                });
        });
    };

    /**
     * Asynchronous function to Loop through federated authenticators, fetch data and metadata and
     * return an array of available authenticators.
     */
    async function fetchAuthenticators() {
        const authenticators: FederatedAuthenticatorInterface[] = [];
        for (const authenticator of federatedAuthenticators.authenticators) {
            authenticators.push(await fetchAuthenticator(authenticator.authenticatorId));
        }
        return authenticators;
    }

    useEffect(() => {
        setAvailableAuthenticators([]);
        fetchAuthenticators()
            .then((res) => {
                setAvailableAuthenticators(res);
            })
    }, [props]);

    /**
     * Handles default authenticator change event.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     * @param {string} id - Id of the authenticator.
     */
    const handleDefaultAuthenticatorChange = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string):
        void => {
        const authenticator = availableAuthenticators.find(authenticator => (authenticator.id === id)).data;
        authenticator.isDefault = data.checked;
        handleInboundConfigFormSubmit(authenticator);
    };

    /**
     * Handles authenticator enable toggle.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     * @param {string} id - Id of the authenticator.
     */
    const handleAuthenticatorEnableToggle = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string): void => {
        const authenticator = availableAuthenticators.find(authenticator => (authenticator.id === id)).data;
        // Validation
        if (authenticator.isDefault && !data.checked) {
            dispatch(addAlert({
                description: "You cannot disable the default authenticator.",
                level: AlertLevels.WARNING,
                message: "Data validation error"
            }));
            onUpdate(idpId);
        } else {
            authenticator.isEnabled = data.checked;
            handleInboundConfigFormSubmit(authenticator);
        }
    };

    /**
     * Handles Authenticator delete action.
     *
     * @param {string} id - Id of the authenticator.
     */
    const handleAuthenticatorDelete = (id: string): void => {
        // TODO: Implement deletion logic here.
    };

    const handleAddAuthenticator = () => {
        // TODO: Implement method
        console.log("Add authenticator...")
    };

    return (
        (!isLoading)
            ? (
                <div className="authentication-section">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 16 } textAlign="right">
                                <PrimaryButton onClick={ handleAddAuthenticator }>
                                    <Icon name="add"/>Add Authenticator
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                { availableAuthenticators.map((authenticator) => {
                                    return (
                                        <AuthenticatorAccordion
                                            key={ authenticator.id }
                                            globalActions={ [
                                                {
                                                    icon: "trash alternate",
                                                    onClick: (e: MouseEvent<HTMLDivElement>, id: string): void => {
                                                        setShowDeleteConfirmationModal(true);
                                                        setDeletingAuthenticator(authenticator.data);
                                                    },
                                                    type: "icon"
                                                }
                                            ] }
                                            authenticators={ [
                                                {
                                                    actions: [
                                                        {
                                                            defaultChecked: authenticator.data?.isDefault,
                                                            disabled: (authenticator.data?.isDefault ||
                                                                !authenticator.data?.isEnabled),
                                                            label: (authenticator.data?.isDefault ?
                                                                "Default" : "Make default"),
                                                            onChange: handleDefaultAuthenticatorChange,
                                                            type: "checkbox"
                                                        },
                                                        {
                                                            defaultChecked: authenticator.data?.isEnabled,
                                                            label: (authenticator.data?.isEnabled ?
                                                                "Enabled" : "Disabled"),
                                                            onChange: handleAuthenticatorEnableToggle,
                                                            type: "toggle"
                                                        }
                                                    ],
                                                    content: authenticator && (
                                                        <AuthenticatorFormFactory
                                                            metadata={ authenticator.meta }
                                                            initialValues={ authenticator.data }
                                                            onSubmit={ handleInboundConfigFormSubmit }
                                                            type={ authenticator.meta?.name }
                                                        />
                                                    ),
                                                    icon: {
                                                        icon: authenticator.id &&
                                                            (FederatedAuthenticators.find((fedAuth) =>
                                                                (fedAuth.authenticatorId === authenticator.id ))).icon
                                                    },
                                                    id: authenticator?.id,
													title: authenticator.meta?.displayName
                                                }
                                            ] }
                                        />
                                    )
                                })}

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    {
                        deletingAuthenticator && (
                            <ConfirmationModal
                                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                type="warning"
                                open={ showDeleteConfirmationModal }
                                assertion={ deletingAuthenticator?.name }
                                assertionHint={ (
                                    <p>Please type <strong>{ deletingAuthenticator?.name }</strong> to confirm.</p>
                                ) }
                                assertionType="input"
                                primaryAction="Confirm"
                                secondaryAction="Cancel"
                                onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                                onPrimaryActionClick={
                                    (): void => handleAuthenticatorDelete(deletingAuthenticator.authenticatorId)
                                }
                            >
                                <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                                <ConfirmationModal.Message attached warning>
                                    This action is irreversible and will permanently delete the authenticator.
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content>
                                    If you delete this authenticator, you will not be able to get it back. All the
                                    applications depending on this also might stop working. Please proceed with caution.
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        )
                    }
                </div>
            )
            : <ContentLoader/>
    );
};
