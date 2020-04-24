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
import { ConfirmationModal, ContentLoader, PrimaryButton } from "@wso2is/react-components";
import React, { FormEvent, FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CheckboxProps, Grid, Icon } from "semantic-ui-react";
import {
    getFederatedAuthenticatorDetails,
    getFederatedAuthenticatorMeta, getIdentityProviderTemplateList,
    updateFederatedAuthenticator
} from "../../../api";
import { IdPCapabilityIcons } from "../../../configs";
import {
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorListResponseInterface, FederatedAuthenticatorWithMetaInterface,
    IdentityProviderTemplateListItemInterface, IdentityProviderTemplateListItemResponseInterface,
    IdentityProviderTemplateListResponseInterface, SupportedServices, SupportedServicesInterface
} from "../../../models";
import { AuthenticatorAccordion } from "../../shared";
import { AuthenticatorFormFactory } from "../forms";
import { FederatedAuthenticators } from "../meta/authenticators";
import { AuthenticatorCreateWizard } from "../wizards/authenticator-create-wizard";

/**
 * Proptypes for the identity providers settings component.
 */
interface IdentityProviderSettingsPropsInterface {
    /**
     * Currently editing idp id.
     */
    idpId: string;

    /**
     * Currently editing idp name.
     */
    idpName: string;

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
        idpName,
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
    const [availableAuthenticators, setAvailableAuthenticators] =
        useState<FederatedAuthenticatorWithMetaInterface[]>([]);
    const [ availableTemplates, setAvailableTemplates ] =
        useState<IdentityProviderTemplateListItemInterface[]>(undefined);
    const [ showAddAuthenticatorWizard, setShowAddAuthenticatorWizard ] = useState<boolean>(false);
    const [ isTemplatesLoading, setIsTemplatesLoading ] = useState<boolean>(false);

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
        const authenticators: FederatedAuthenticatorWithMetaInterface[] = [];
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

    /**
     * Handles Authenticator delete button on click action.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e - Click event.
     * @param {string} id - Id of the authenticator.
     */
    const handleAuthenticatorDeleteOnClick = (e: MouseEvent<HTMLDivElement>, id: string): void => {
        if (!id) {
            return;
        }

        const deletingAuthenticator = availableAuthenticators
            .find((authenticator) => authenticator.id === id);

        if (!deletingAuthenticator) {
            return;
        }

        setDeletingAuthenticator(deletingAuthenticator.data);
        setShowDeleteConfirmationModal(true);
    };

     /**
     * Handles add new authenticator action.
     */
    const handleAddAuthenticator = () => {
        setIsTemplatesLoading(true);
        setShowAddAuthenticatorWizard(false);

        // Load available templates from the server
        getIdentityProviderTemplateList()
            .then((response: IdentityProviderTemplateListResponseInterface) => {
                if (!response?.totalResults) {
                    return;
                }
                // sort templateList based on display Order
                response?.templates.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);

                const availableTemplates: IdentityProviderTemplateListItemInterface[] = interpretAvailableTemplates(
                    response?.templates);

                setAvailableTemplates(availableTemplates);
                setShowAddAuthenticatorWizard(true);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Identity provider Template List Fetch Error"
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: "An error occurred while retrieving identity provider template list",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            })
            .finally(() => {
                setIsTemplatesLoading(false);
            });
    };

    /**
     * Interpret available templates from the response templates.
     *
     * @param templates List of response templates.
     * @return List of templates.
     */
    const interpretAvailableTemplates = (templates: IdentityProviderTemplateListItemResponseInterface[]):
        IdentityProviderTemplateListItemInterface[] => {
        return templates?.map(eachTemplate => {
            if (eachTemplate.services[0] === "") {
                return {
                    ...eachTemplate,
                    services: []
                };
            } else {
                return {
                    ...eachTemplate,
                    services: buildSupportedServices(eachTemplate?.services)
                };
            }
        });
    };

    /**
     * Build supported services from the given service identifiers.
     *
     * @param serviceIdentifiers Set of service identifiers.
     */
    const buildSupportedServices = (serviceIdentifiers: string[]): SupportedServicesInterface[] => {
        return serviceIdentifiers?.map((serviceIdentifier: string): SupportedServicesInterface => {
            switch (serviceIdentifier) {
                case SupportedServices.AUTHENTICATION:
                    return {
                        displayName: "Authentication Service",
                        logo: IdPCapabilityIcons[SupportedServices.AUTHENTICATION],
                        name: SupportedServices.AUTHENTICATION
                    };
                case SupportedServices.PROVISIONING:
                    return {
                        displayName: "Provisioning Service",
                        logo: IdPCapabilityIcons[SupportedServices.PROVISIONING],
                        name: SupportedServices.PROVISIONING
                    }
            }
        });
    };

    return (
        (!isLoading)
            ? (
                <div className="authentication-section">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 16 } textAlign="right">
                                <PrimaryButton onClick={ handleAddAuthenticator } loading={ isTemplatesLoading }>
                                    <Icon name="add"/>New Authenticator
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <AuthenticatorAccordion
                                    globalActions={ [
                                        {
                                            icon: "trash alternate",
                                            onClick: handleAuthenticatorDeleteOnClick,
                                            type: "icon"
                                        }
                                    ] }
                                    authenticators={
                                        availableAuthenticators.map((authenticator) => {
                                            return {
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
                                                            (fedAuth.authenticatorId === authenticator.id))).icon
                                                },
                                                id: authenticator?.id,
                                                title: authenticator.meta?.displayName
                                            }
                                        })
                                    }
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
                    {
                         showAddAuthenticatorWizard && (
                             <AuthenticatorCreateWizard
                                 title={ "Add New Authenticator" }
                                 subTitle={ "Add new authenticator to the identity provider: " + idpName }
                                 closeWizard={ () => {
                                     setShowAddAuthenticatorWizard(false);
                                     onUpdate(idpId)
                                 } }
                                 availableTemplates={ availableTemplates }
                                 idpId={ idpId }
                             />
                         )
                    }
                </div>
            )
            : <ContentLoader/>
    );
};
