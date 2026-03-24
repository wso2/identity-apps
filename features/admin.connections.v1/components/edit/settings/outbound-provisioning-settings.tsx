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
import { AuthenticatorAccordion } from "@wso2is/admin.core.v1/components/authenticator-accordion";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    PrimaryButton,
    SegmentedAccordionTitleActionInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AccordionTitleProps, Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { OutboundProvisioningGroups } from "./outbound-provisioning";
import {
    getOutboundProvisioningConnector,
    getOutboundProvisioningConnectorMetadata,
    updateOutboundProvisioningConnector
} from "../../../api/connections";
import { CommonAuthenticatorConstants } from "../../../constants/common-authenticator-constants";
import { AuthenticatorSettingsFormModes } from "../../../models/authenticators";
import {
    ConnectionInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaDataInterface,
    OutboundProvisioningConnectorMetaInterface,
    OutboundProvisioningConnectorWithMetaInterface,
    OutboundProvisioningConnectorsInterface
} from "../../../models/connection";
import {
    handleGetOutboundProvisioningConnectorMetadataError,
    handleUpdateOutboundProvisioningConnectorError
} from "../../../utils/connection-utils";
import { getOutboundProvisioningConnectorsMetaData } from "../../meta/connectors";
import {
    OutboundProvisioningConnectorCreateWizard
} from "../../wizards/outbound-provisioning-connector-create-wizard";
import { OutboundProvisioningConnectorFormFactory } from "../forms";

/**
 * Proptypes for the provisioning settings component.
 */
interface ProvisioningSettingsPropsInterface extends TestableComponentInterface,
    IdentifiableComponentInterface {
    /**
     * Currently editing idp.
     */
    identityProvider: ConnectionInterface;

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
 * Identity Provider provisioning settings component.
 *
 * @param props - Props injected to the component.
 * @returns Outbound provisioning settings component.
 */
export const OutboundProvisioningSettings: FunctionComponent<ProvisioningSettingsPropsInterface> = (
    props: ProvisioningSettingsPropsInterface
): ReactElement => {

    const {
        identityProvider,
        outboundConnectors,
        isLoading,
        onUpdate,
        isReadOnly,
        [ "data-testid" ]: testId = "idp-edit-outbound-provisioning-settings",
        [ "data-componentid" ]: componentId = "idp-edit-outbound-provisioning-settings"
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [
        availableConnectors,
        setAvailableConnectors
    ] = useState<OutboundProvisioningConnectorWithMetaInterface[]>([]);
    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>([]);
    const [ triggerConnectorFormSubmit, setTriggerConnectorFormSubmit ] = useState<boolean>(false);
    const [ triggerGroupsSave, setTriggerGroupsSave ] = useState<boolean>(false);

    /**
     * Handles the single Update button click — triggers both connector form submit and groups save.
     */
    const handleUpdate = (): void => {
        setTriggerConnectorFormSubmit((prev: boolean) => !prev);
        setTriggerGroupsSave((prev: boolean) => !prev);
    };

    /**
     * Fetch available connectors for the identity provider.
     */
    useEffect(() => {
        setAvailableConnectors([]);
        fetchConnectors()
            .then((response: OutboundProvisioningConnectorWithMetaInterface[]) => {
                setAvailableConnectors(response);
                // Auto-open accordion if only one connector exists.
                if (response?.length === 1) {
                    setAccordionActiveIndexes([ 0 ]);
                }
            });
    }, [ identityProvider ]);

    /**
     * Fetch data and metadata of a given connector id and return a promise.
     *
     * @param connectorId - ID of the connector.
     */
    const fetchConnector = (connectorId: string) => {
        return new Promise((resolve: (value: unknown) => void) => {
            getOutboundProvisioningConnector(identityProvider.id, connectorId)
                .then((data: OutboundProvisioningConnectorInterface) => {
                    getOutboundProvisioningConnectorMetadata(connectorId)
                        .then((meta: OutboundProvisioningConnectorMetaInterface) => {
                            resolve({
                                data: data,
                                id: connectorId,
                                localMeta: getOutboundProvisioningConnectorsMetaData()?.find(
                                    (meta: OutboundProvisioningConnectorMetaDataInterface) => {
                                        return meta.connectorId === connectorId;
                                    }
                                ),
                                meta: meta
                            });
                        })
                        .catch((error: AxiosError) => {
                            handleGetOutboundProvisioningConnectorMetadataError(error);
                        });
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: t("authenticationProvider:notifications." +
                                "getOutboundProvisioningConnector.error.description",
                            { description: error.response.data.description } ),
                            level: AlertLevels.ERROR,
                            message: t("authenticationProvider:notifications." +
                                "getOutboundProvisioningConnector.error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("authenticationProvider:notifications." +
                            "getOutboundProvisioningConnector.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:notifications." +
                            "getOutboundProvisioningConnector.genericError.message")
                    }));
                });
        });
    };

    /**
     * Asynchronous function to Loop through outbound provisioning connectors, fetch data and metadata and
     * return an array of available connectors.
     *
     * @returns An array of available connectors.
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
                    description: t("authenticationProvider:" +
                        "notifications.updateOutboundProvisioningConnector." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:" +
                        "notifications.updateOutboundProvisioningConnector." +
                        "success.message")
                }));

                onUpdate(identityProvider.id);
            })
            .catch((error: AxiosError) => {
                handleUpdateOutboundProvisioningConnectorError(error);
            });
    };

    const createAccordionActions = (
        _connector: OutboundProvisioningConnectorWithMetaInterface
    ): SegmentedAccordionTitleActionInterface[] => {
        return [];
    };

    /**
     * Handles accordion title click.
     *
     * @param e - Click event.
     * @param data - Clicked title.
     */
    const handleAccordionOnClick = (e: MouseEvent<HTMLDivElement>, data: AccordionTitleProps): void => {
        if (!data) {
            return;
        }

        const newIndexes: number[] = [ ...accordionActiveIndexes ];

        if (newIndexes.includes(data.accordionIndex)) {
            const removingIndex: number = newIndexes.indexOf(data.accordionIndex);

            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(data.accordionIndex);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    return (
        <EmphasizedSegment padded="very" data-componentid={ componentId }>
            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Heading as="h4">
                        { t("idp:forms.outboundProvisioningTitle") }
                    </Heading>
                </Grid.Column>
            </Grid.Row>

            {
                outboundConnectors.connectors.length > 0 ? (
                    (!isLoading)
                        ? (
                            <div className="default-provisioning-connector-section" style={ { marginTop: "1rem" } }>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column>
                                            {
                                                availableConnectors
                                                    // Filter the scim1 connector since it is deprecated.
                                                    .filter((
                                                        connector: OutboundProvisioningConnectorWithMetaInterface
                                                    ) => connector.id !==
                                                        CommonAuthenticatorConstants
                                                            .DEPRECATED_SCIM1_PROVISIONING_CONNECTOR_ID)
                                                    // Filter inactive connectors.
                                                    .filter((
                                                        connector: OutboundProvisioningConnectorWithMetaInterface
                                                    ) => connector.data?.isEnabled)
                                                    .map((
                                                        connector: OutboundProvisioningConnectorWithMetaInterface,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <AuthenticatorAccordion
                                                                key={ index }
                                                                globalActions={ [] }
                                                                authenticators={ [
                                                                    {
                                                                        actions: createAccordionActions(connector),
                                                                        content: (
                                                                            <OutboundProvisioningConnectorFormFactory
                                                                                mode={
                                                                                    AuthenticatorSettingsFormModes.EDIT
                                                                                }
                                                                                metadata={ connector.meta }
                                                                                initialValues={ connector.data }
                                                                                onSubmit={
                                                                                    handleConnectorConfigFormSubmit }
                                                                                type={ connector.meta?.name }
                                                                                enableSubmitButton={ false }
                                                                                triggerSubmit={
                                                                                    triggerConnectorFormSubmit }
                                                                                data-testid={ `${testId}-${
                                                                                    connector.meta?.name }-content` }
                                                                                data-componentid={ `${componentId}-${
                                                                                    connector.meta?.name }-content` }
                                                                                isReadOnly={ isReadOnly }
                                                                            />
                                                                        ),
                                                                        icon: {
                                                                            icon: connector?.localMeta?.icon,
                                                                            verticalAlign: "middle"
                                                                        },
                                                                        id: connector?.id,
                                                                        title: connector?.localMeta?.displayName
                                                                            ?? connector?.meta?.displayName,
                                                                        titleOptions: {
                                                                            flex: true
                                                                        }
                                                                    }
                                                                ] }
                                                                data-testid={ `${ testId }-accordion` }
                                                                data-componentid={ `${ componentId }-accordion` }
                                                                accordionActiveIndexes = { accordionActiveIndexes }
                                                                accordionIndex = { index }
                                                                handleAccordionOnClick={ handleAccordionOnClick }
                                                                accordionContentStyle={ {
                                                                    backgroundColor:
                                                                        "var(--oxygen-palette-common-white)"
                                                                } }
                                                            />
                                                        );
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
                            <Grid.Column mobile={ 16 } computer={ 12 }>
                                <Divider hidden />
                                <Segment>
                                    <EmptyPlaceholder
                                        title={ t("authenticationProvider:" +
                                                "placeHolders.emptyConnectorList." +
                                            "title") }
                                        subtitle={ [
                                            t("authenticationProvider:" +
                                                "placeHolders.emptyConnectorList." +
                                                "subtitles.0"),
                                            t("authenticationProvider:" +
                                                "placeHolders.emptyConnectorList." +
                                                "subtitles.1")
                                        ] }
                                        imageSize="tiny"
                                        action={ (
                                            <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                                                <PrimaryButton
                                                    onClick={ () => setShowWizard(true) }
                                                    data-testid={ `${ testId }-add-connector-button` }
                                                    data-componentid={ `${ componentId }-add-connector-button` }>
                                                    <Icon name="add"/>
                                                    { t("authenticationProvider:" +
                                                            "buttons.addConnector") }
                                                </PrimaryButton>
                                            </Show>
                                        ) }
                                        data-testid={ `${ testId }-empty-placeholder` }
                                        data-componentid={ `${ componentId }-empty-placeholder` }
                                    />
                                </Segment>
                                <Divider hidden />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
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
                        data-componentid={ `${ componentId }-connector-create-wizard` }
                    />
                )
            }
            {
                (!isLoading)
                    ? (
                        <OutboundProvisioningGroups
                            idpRoles={ identityProvider?.roles }
                            idpId={ identityProvider?.id }
                            data-componentid={ `${ componentId }-groups` }
                            isReadOnly={ isReadOnly }
                            onUpdate={ onUpdate }
                            hideUpdateButton={ true }
                            triggerSave={ triggerGroupsSave }
                        />
                    )
                    : <ContentLoader/>
            }
            { !isReadOnly && outboundConnectors.connectors.length > 0 && (
                <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                    <PrimaryButton
                        onClick={ handleUpdate }
                        data-componentid={ `${ componentId }-update-button` }
                    >
                        { t("common:update") }
                    </PrimaryButton>
                </Show>
            ) }
        </EmphasizedSegment>
    );
};
