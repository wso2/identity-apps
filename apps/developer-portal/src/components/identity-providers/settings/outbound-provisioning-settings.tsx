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
import { ConfirmationModal, ContentLoader, EmptyPlaceholder, Heading, PrimaryButton } from "@wso2is/react-components";
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { CheckboxProps, Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { OutboundProvisioningRoles } from "./outbound-provisioning";
import {
    getOutboundProvisioningConnector,
    getOutboundProvisioningConnectorMetadata,
    updateOutboundProvisioningConnector,
    updateOutboundProvisioningConnectors
} from "../../../api";
import { EmptyPlaceholderIllustrations } from "../../../configs";
import {
    IdentityProviderInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorWithMetaInterface,
    OutboundProvisioningConnectorsInterface
} from "../../../models";
import { AuthenticatorAccordion } from "../../shared";
import { OutboundProvisioningConnectorFormFactory } from "../forms";
import {
    handleGetOutboundProvisioningConnectorMetadataError,
    handleUpdateOutboundProvisioningConnectorError
} from "../utils";
import { OutboundProvisioningConnectorCreateWizard } from "../wizards";

/**
 * Proptypes for the provisioning settings component.
 */
interface ProvisioningSettingsPropsInterface extends TestableComponentInterface {
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
 * Identity Provider provisioning settings component.
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
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [
        availableConnectors,
        setAvailableConnectors
    ] = useState<OutboundProvisioningConnectorWithMetaInterface[]>([]);
    const [
        deletingConnector,
        setDeletingConnector
    ] = useState<OutboundProvisioningConnectorWithMetaInterface>(undefined);

    /**
     * Fetch available connectors for the identity provider.
     */
    useEffect(() => {
        setAvailableConnectors([]);
        fetchConnectors()
            .then((res) => {
                setAvailableConnectors(res);
            })
    }, [ identityProvider ]);

    /**
     * Fetch data and metadata of a given connector id and return a promise.
     *
     * @param connectorId ID of the connector.
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
                            handleGetOutboundProvisioningConnectorMetadataError(error);
                        });
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: t("devPortal:components.idp.notifications." +
                                "getOutboundProvisioningConnector.error.description",
                                { description: error.response.data.description } ),
                            level: AlertLevels.ERROR,
                            message: t("devPortal:components.idp.notifications." +
                                "getOutboundProvisioningConnector.error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("devPortal:components.idp.notifications." +
                            "getOutboundProvisioningConnector.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.idp.notifications." +
                            "getOutboundProvisioningConnector.genericError.message")
                    }));
                });
        });
    };

    /**
     * Asynchronous function to Loop through outbound provisioning connectors, fetch data and metadata and
     * return an array of available connectors.
     *
     * @return {OutboundProvisioningConnectorWithMetaInterface[]}
     */
    async function fetchConnectors() {
        const connectors: OutboundProvisioningConnectorWithMetaInterface[] = [];
        for (const connector of identityProvider.provisioning.outboundConnectors.connectors) {
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
                    description: t("devPortal:components.idp.notifications.updateOutboundProvisioningConnector." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.idp.notifications.updateOutboundProvisioningConnector." +
                        "success.message")
                }));

                onUpdate(identityProvider.id);
            })
            .catch((error) => {
                handleUpdateOutboundProvisioningConnectorError(error);
            });
    };

    /**
     * Handles the outbound provisioning connector deletion.
     */
    const handleDeleteConnector = (deletingConnector: OutboundProvisioningConnectorWithMetaInterface) => {

        const connectorList = [];

        availableConnectors.map((connector) => {
            if (connector.id !== deletingConnector.id) {
                connectorList.push(connector.data);
            }
        });

        const data = {
            connectors: connectorList,
            defaultConnectorId: identityProvider.provisioning.outboundConnectors.defaultConnectorId
        };

        updateOutboundProvisioningConnectors(data, identityProvider.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("devPortal:components.idp.notifications.updateOutboundProvisioningConnectors" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.idp.notifications.updateOutboundProvisioningConnectors" +
                        ".success.message")
                }));

                onUpdate(identityProvider.id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.idp.notifications.updateOutboundProvisioningConnectors" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.idp.notifications.updateOutboundProvisioningConnectors" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.idp.notifications.updateOutboundProvisioningConnectors" +
                        ".genericError.message")
                }));
            });

        setDeletingConnector(undefined);
        setShowDeleteConfirmationModal(false);
    };

    /**
     * Handles connector delete button on click action.
     *
     * @param {React.MouseEvent<HTMLDivElement>} e - Click event.
     * @param {string} id - Id of the connector.
     */
    const handleAuthenticatorDeleteOnClick = (e: React.MouseEvent<HTMLDivElement>, id: string): void => {
        if (!id) {
            return;
        }

        if (id == identityProvider.provisioning.outboundConnectors.defaultConnectorId) {
            dispatch(addAlert({
                description: t("devPortal:components.idp.notifications.deleteDefaultConnector" +
                    ".error.description"),
                level: AlertLevels.WARNING,
                message: t("devPortal:components.idp.notifications.deleteDefaultConnector" +
                    ".error.message")
            }));
            return;
        }

        const deletingConnector = availableConnectors.find((connector) => connector.id == id);

        if (!deletingConnector) {
            return;
        }

        setDeletingConnector(deletingConnector);
        setShowDeleteConfirmationModal(true);
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
                description: t("devPortal:components.idp.notifications.disableOutboundProvisioningConnector." +
                    "error.description"),
                level: AlertLevels.WARNING,
                message: t("devPortal:components.idp.notifications.disableOutboundProvisioningConnector." +
                    "error.message")
            }));
            onUpdate(identityProvider.id);
        } else {
            connector.isEnabled = data.checked;
            handleConnectorConfigFormSubmit(connector);
        }
    };

    return (
        <>
            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Heading as="h5">OutBound Provisioning Connectors</Heading>
                </Grid.Column>
            </Grid.Row>

            {
                outboundConnectors.connectors.length > 0 ? (
                (!isLoading)
                    ? (
                        <div className="default-provisioning-connector-section">
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column>
                                        <PrimaryButton
                                            floated="right"
                                            onClick={ () => setShowWizard(true) }
                                            data-testid={ `${ testId }-add-connector-button` }
                                        >
                                            <Icon name="add"/>
                                            { t("devPortal:components.idp.buttons.addConnector") }
                                        </PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        {
                                            availableConnectors.map((connector, index) => {
                                                return (
                                                    <AuthenticatorAccordion
                                                        key={ index }
                                                        globalActions = {
                                                            [
                                                                {
                                                                    icon: "trash alternate",
                                                                    onClick: handleAuthenticatorDeleteOnClick,
                                                                    type: "icon"
                                                                }
                                                            ]
                                                        }
                                                        authenticators={
                                                            [
                                                                {
                                                                    actions: [
                                                                        {
                                                                            defaultChecked: connector.data?.isDefault,
                                                                            label: t("devPortal:components.idp." +
                                                                                "forms.outboundConnectorAccordion." +
                                                                                "default"),
                                                                            onChange: handleDefaultConnectorChange,
                                                                            type: "checkbox"
                                                                        },
                                                                        {
                                                                            defaultChecked: connector?.data?.isEnabled,
                                                                            label: t("devPortal:components.idp." +
                                                                                "forms.outboundConnectorAccordion." +
                                                                                "enable"),
                                                                            onChange: handleConnectorEnableToggle,
                                                                            type: "toggle"
                                                                        }
                                                                    ],
                                                                    content: (
                                                                        <OutboundProvisioningConnectorFormFactory
                                                                            metadata={ connector.meta }
                                                                            initialValues={ connector.data }
                                                                            onSubmit={ handleConnectorConfigFormSubmit }
                                                                            type={ connector.meta?.name }
                                                                            data-testid={ `${testId}-${
                                                                                connector.meta?.name}-content` }
                                                                        />
                                                                    ),
                                                                    id: connector?.id,
                                                                    title: connector?.meta?.displayName
                                                                }
                                                            ]
                                                        }
                                                        data-testid={ `${testId}-accordion` }
                                                    />
                                                )
                                            })
                                        }
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
                                <Divider hidden />
                                <Segment>
                                    <EmptyPlaceholder
                                        title={ t("devPortal:components.idp.placeHolders.emptyConnectorList." +
                                            "title") }
                                        image={ EmptyPlaceholderIllustrations.emptyList }
                                        subtitle={ [
                                            t("devPortal:components.idp.placeHolders.emptyConnectorList." +
                                                "subtitles.0"),
                                            t("devPortal:components.idp.placeHolders.emptyConnectorList." +
                                                "subtitles.1")
                                        ] }
                                        imageSize="tiny"
                                        action={ (
                                            <PrimaryButton onClick={ () => setShowWizard(true) }
                                                           data-testid={ `${ testId }-add-connector-button` }>
                                                <Icon name="add"/>
                                                { t("devPortal:components.idp.buttons.addConnector") }
                                            </PrimaryButton>
                                        ) }
                                        data-testid={ `${ testId }-empty-placeholder` }
                                    />
                                </Segment>
                                <Divider hidden />
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
                        assertion={ deletingConnector?.meta.name }
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey="devPortal:components.idp.confirmations.deleteConnector.assertionHint"
                                    tOptions={ { name: deletingConnector?.meta.name } }
                                >
                                    Please type <strong>{ deletingConnector?.meta.name }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={
                            (): void => handleDeleteConnector(deletingConnector)
                        }
                        data-testid={ `${ testId }-authenticator-delete-confirmation` }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-authenticator-delete-confirmation` }>
                            { t("devPortal:components.idp.confirmations.deleteConnector.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning
                                                   data-testid={ `${ testId }-authenticator-delete-confirmation` }>
                            { t("devPortal:components.idp.confirmations.deleteConnector.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-authenticator-delete-confirmation` }>
                            { t("devPortal:components.idp.confirmations.deleteConnector.content") }
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
                        data-testid={ `${ testId }-connector-create-wizard` }
                    />
                )
            }

            {
                identityProvider?.roles &&
                (!isLoading) ? (
                    <>
                        <Divider/>
                        <Divider hidden/>
                        <OutboundProvisioningRoles
                            idpRoles={ identityProvider?.roles }
                            idpId={ identityProvider?.id }
                            data-testid={ `${ testId }-roles` }
                        />
                    </>
                ) : <ContentLoader/>
            }
         </>
    );
};

/**
 * Default proptypes for the IDP outbound provisioning settings component.
 */
OutboundProvisioningSettings.defaultProps = {
    "data-testid": "idp-edit-outbound-provisioning-settings"
};
