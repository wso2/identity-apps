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
import { ConfirmationModal, ContentLoader, EmptyPlaceholder, PrimaryButton } from "@wso2is/react-components";
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    getOutboundProvisioningConnector,
    getOutboundProvisioningConnectorMetadata,
    updateOutboundProvisioningConnector
} from "../../../api";
import {
    IdentityProviderInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorListItemInterface,
    OutboundProvisioningConnectorsInterface,
    OutboundProvisioningConnectorWithMetaInterface
} from "../../../models";
import { CheckboxProps, Grid, Icon, Segment } from "semantic-ui-react";
import { OutboundProvisioningConnectorFormFactory } from "../forms";
import { AuthenticatorAccordion } from "../../shared";
import { EmptyPlaceholderIllustrations } from "../../../configs";
import { OutboundProvisioningConnectorCreateWizard } from "../wizards";

/**
 * Proptypes for the provisioning settings component.
 */
interface ProvisioningSettingsPropsInterface {
    /**
     * Currently editing idp.
     */
    identityProvider: IdentityProviderInterface;

    /**
     * Outbound connector details of the IDP
     */
    outboundConnectors: OutboundProvisioningConnectorsInterface;
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
 *  Identity Provider provisioning settings component.
 *
 * @param { ProvisioningSettingsPropsInterface } props - Props injected to the component.
 * @return { ReactElement }
 */
export const OutboundProvisioningSettings: FunctionComponent<ProvisioningSettingsPropsInterface> = (
    props: ProvisioningSettingsPropsInterface
): ReactElement => {

    const {
        identityProvider,
        outboundConnectors,
        isLoading,
        onUpdate
    } = props;

    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [
        availableConnectors,
        setAvailableConnectors
    ] = useState<OutboundProvisioningConnectorWithMetaInterface[]>([]);
    const [
        deletingConnector,
        setDeletingConnector
    ] = useState<OutboundProvisioningConnectorListItemInterface>(undefined);

    /**
     * Fetch available connectors for the identity provider.
     */
    useEffect(() => {
        setAvailableConnectors([]);
        fetchConnectors()
            .then((res) => {
                setAvailableConnectors(res);
            })
    }, [ props ]);

    /**
     * Fetch data and metadata of a given connector id and return a promise.
     *
     * @param id of the connector.
     */
    const fetchConnector = (connectorId: string) => {
        return new Promise(resolve => {
            getOutboundProvisioningConnector(identityProvider.id, connectorId)
                .then(data => {
                    getOutboundProvisioningConnectorMetadata(connectorId)
                        .then(meta => {
                            resolve({
                                data: data,
                                id: connectorId,
                                meta: meta
                            })
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
                                description: "An error occurred retrieving the outbound provisioning connector metadata.",
                                level: AlertLevels.ERROR,
                                message: "Retrieval error"
                            }));
                        });
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
                        description: "An error occurred retrieving the outbound provisioning connector details.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });
        });
    };

    /**
     * Asynchronous function to Loop through outbound provisioning connectors, fetch data and metadata and
     * return an array of available connectors.
     */
    async function fetchConnectors() {
        const connectors: OutboundProvisioningConnectorWithMetaInterface[] = [];
        for (const connector of outboundConnectors.connectors) {
            connectors.push(await fetchConnector(connector.connectorId));
        }
        return connectors;
    }

    /**
     * Handles the connector config form submit action.
     *
     * @param values - Form values.
     */
    const handleConnectorConfigFormSubmit = (values: OutboundProvisioningConnectorInterface): void => {
        updateOutboundProvisioningConnector(identityProvider.id, values)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the outbound provisioning connector.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(identityProvider.id);
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
                    description: "An error occurred while updating the outbound provisioning connector.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    /**
     * Handles the outbound provisioning connector deletion.
     */
    const handleDeleteConnector = (deletingConnector: OutboundProvisioningConnectorListItemInterface) => {
        // TODO: Enable when api supports PUT operation.
        // let idp: IdentityProviderInterface = { ...identityProvider };
        // const connectorList = idp.provisioning.outboundConnectors.connectors;
        // if (deletingConnector.connectorId == idp.provisioning.outboundConnectors.defaultConnectorId) {
        //     idp.provisioning.outboundConnectors.defaultConnectorId = ""
        // }
        //
        // if (connectorList.includes(deletingConnector)) {
        //     connectorList.splice(connectorList.indexOf(deletingConnector));
        //     idp = {
        //         ...idp,
        //         provisioning: {
        //             outboundConnectors: {
        //                 ...outboundConnectors,
        //                 connectors: connectorList
        //             }
        //         }
        //     };
        //     updateIdentityProviderDetails(idp)
        //         .then(() => {
        //             dispatch(addAlert({
        //                 description: "Successfully updated the Identity Provider.",
        //                 level: AlertLevels.SUCCESS,
        //                 message: "Update successful"
        //             }));
        //
        //             onUpdate(identityProvider.id);
        //         })
        //         .catch((error) => {
        //             if (error.response && error.response.data && error.response.data.description) {
        //                 dispatch(addAlert({
        //                     description: error.response.data.description,
        //                     level: AlertLevels.ERROR,
        //                     message: "Update error"
        //                 }));
        //
        //                 return;
        //             }
        //
        //             dispatch(addAlert({
        //                 description: "An error occurred while updating the identity provider.",
        //                 level: AlertLevels.ERROR,
        //                 message: "Update error"
        //             }));
        //         });
        // }
    };

    /**
     * Handles default connector change event.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     * @param {string} id - Id of the connector.
     */
    const handleDefaultConnectorChange = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string): void => {
        const connector = availableConnectors.find(connector => (connector.id === id)).data;
        connector.isDefault = data.checked;
        handleConnectorConfigFormSubmit(connector);
    };

    /**
     * Handles connector enable toggle.
     *
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {CheckboxProps} data - Checkbox data.
     * @param {string} id - Id of the connector.
     */
    const handleConnectorEnableToggle = (e: FormEvent<HTMLInputElement>, data: CheckboxProps, id: string): void => {
        const connector = availableConnectors.find(connector => (connector.id === id)).data;
        // Validation
        if (connector.isDefault && !data.checked) {
            dispatch(addAlert({
                description: "You cannot disable the default outbound provisioning connector.",
                level: AlertLevels.WARNING,
                message: "Data validation error"
            }));
            onUpdate(identityProvider.id);
        } else {
            connector.isEnabled = data.checked;
            handleConnectorConfigFormSubmit(connector);
        }
    };

    return (
        <>
            {
                outboundConnectors.connectors.length > 0 ? (
                (!isLoading)
                    ? (
                        <div className="default-provisioning-connector-section">
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column>
                                        <PrimaryButton floated="right" onClick={ () => setShowWizard(true) }>
                                            <Icon name="add"/>
                                            New Connector
                                        </PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <AuthenticatorAccordion
                                            globalActions={ [
                                                // TODO: Enable when api supports PUT operation.
                                                // {
                                                //     icon: 'trash alternate',
                                                //     onClick: (e, id: string): void => {
                                                //         setShowDeleteConfirmationModal(true);
                                                //         setDeletingConnector(connector);
                                                //     },
                                                //     type: 'icon',
                                                // },
                                            ] }
                                            authenticators={
                                                availableConnectors.map((connector) => {
                                                    return {
                                                        actions: [
                                                            {
                                                                defaultChecked: connector.data?.isDefault,
                                                                label: "Make default",
                                                                onChange: handleDefaultConnectorChange,
                                                                type: "checkbox",
                                                            },
                                                            {
                                                                defaultChecked: connector?.data?.isEnabled,
                                                                label: "Enabled",
                                                                onChange: handleConnectorEnableToggle,
                                                                type: "toggle",
                                                            },
                                                        ],
                                                        content: (
                                                            <OutboundProvisioningConnectorFormFactory
                                                                metadata={ connector.meta }
                                                                initialValues={ connector.data }
                                                                onSubmit={ handleConnectorConfigFormSubmit }
                                                                type={ connector.meta?.name }
                                                            />
                                                        ),
                                                        id: connector?.id,
                                                        title: connector?.meta?.displayName,
                                                    }
                                                })
                                            }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    )
                    : <ContentLoader/>
                ) : (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 8 }>
                                <Segment>
                                    <EmptyPlaceholder
                                        title="No outbound provisioning connectors"
                                        image={ EmptyPlaceholderIllustrations.emptyList }
                                        subtitle={ [ "This IDP has no outbound provisioning connectors configured",
                                            "Add a connect to view it here." ] }
                                        imageSize="tiny"
                                        action={ (
                                            <PrimaryButton onClick={ () => setShowWizard(true) }>
                                                <Icon name="add"/>
                                                New Connector
                                            </PrimaryButton>
                                        ) }
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
            {
                deletingConnector && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingConnector?.name }
                        assertionHint={ (
                            <p>Please type <strong>{ deletingConnector?.name }</strong> to confirm.</p>
                        ) }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={
                            (): void => handleDeleteConnector(deletingConnector)
                        }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the connector.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this outbound provisioning connector, you will not be able to get it back.
                            Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showWizard && (
                    <OutboundProvisioningConnectorCreateWizard
                        closeWizard={ () => setShowWizard(false) }
                        updateIdentityProvider={ onUpdate }
                        identityProvider={ identityProvider }
                        onUpdate={ onUpdate }
                    />
                )
            }
         </>
    );
};
