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
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorListResponseInterface,
    FederatedAuthenticatorMetaInterface,
    SupportedAuthenticators
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
    const [authenticatorMeta, setAuthenticatorMeta] = useState<FederatedAuthenticatorMetaInterface>({
        authenticatorId: "",
        displayName: "",
        name: SupportedAuthenticators.NONE,
        properties: []
    });
    const [authenticatorDetails, setAuthenticatorDetails] = useState<FederatedAuthenticatorListItemInterface>({
        authenticatorId: "",
        isDefault: false,
        isEnabled: false,
        name: "",
        properties: []
    });

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

                onUpdate(idpId);
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

    useEffect(() => {
        if (federatedAuthenticators.defaultAuthenticatorId) {
            getFederatedAuthenticatorDetails(idpId, federatedAuthenticators.defaultAuthenticatorId)
                .then(response => {
                    setAuthenticatorDetails(response);
                })
                .catch(error => {
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
                });

            getFederatedAuthenticatorMeta(federatedAuthenticators.defaultAuthenticatorId)
                .then(response => {
                    setAuthenticatorMeta(response);
                })
                .catch(error => {
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
                });
        }
    }, [props]);

    /**
     * Handles default authenticator change event.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     * @param {string} id - Id of the authenticator.
     */
    const handleDefaultAuthenticatorChange = (
        e: FormEvent<HTMLInputElement>,
        data: CheckboxProps,
        id: string): void => {

        // Implement necessary logic here.
    };

    /**
     * Handles authenticator enable toggle.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     * @param {string} id - Id of the authenticator.
     */
    const handleAuthenticatorEnableToggle = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string): void => {
        // Implement necessary logic here.
    };

    /**
     * Handles Authenticator delete action.
     *
     * @param {string} id - Id of the authenticator.
     */
    const handleAuthenticatorDelete = (id: string): void => {
        // Implement deletion logic here.
    };

    return (
        (!isLoading)
            ? (
                <div className="authentication-section">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 16 } textAlign="right">
                                <PrimaryButton>
                                    <Icon name="add"/>Add Authenticator
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <AuthenticatorAccordion
                                    actions={ [
                                        {
                                            defaultChecked: true,
                                            label: "Make default",
                                            onChange: handleDefaultAuthenticatorChange,
                                            type: "checkbox"
                                        },
                                        {
                                            defaultChecked: true,
                                            label: "Enabled",
                                            onChange: handleAuthenticatorEnableToggle,
                                            type: "toggle"
                                        },
                                        {
                                            icon: "trash alternate",
                                            onClick: (e: MouseEvent<HTMLDivElement>, id: string): void => {
                                                setShowDeleteConfirmationModal(true);
                                                setDeletingAuthenticator(
                                                    federatedAuthenticators.authenticators
                                                        .find((authenticator) => authenticator.authenticatorId === id)
                                                );
                                            },
                                            type: "icon"
                                        }
                                    ] }
                                    authenticators={ [
                                        {
                                            content: federatedAuthenticators.defaultAuthenticatorId && (
                                                <AuthenticatorFormFactory
                                                    metadata={ authenticatorMeta }
                                                    initialValues={ authenticatorDetails }
                                                    onSubmit={ handleInboundConfigFormSubmit }
                                                    type={ authenticatorMeta?.name }
                                                />
                                            ),
                                            id: authenticatorDetails?.authenticatorId,
                                            title: authenticatorDetails?.name
                                        }
                                    ] }
                                />
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
