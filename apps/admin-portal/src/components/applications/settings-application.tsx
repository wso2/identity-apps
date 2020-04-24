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

import { AlertLevels, CRUDPermissionsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmptyPlaceholder, GenericIconProps, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Icon } from "semantic-ui-react";
import { InboundFormFactory } from "./forms";
import { getAuthProtocolMetadata, regenerateClientSecret, updateAuthProtocolConfig } from "../../api";
import { EmptyPlaceholderIllustrations, InboundProtocolLogos } from "../../configs";
import {
    AuthProtocolMetaListItemInterface,
    InboundProtocolListItemInterface,
    SupportedAuthProtocolMetaTypes,
    SupportedAuthProtocolTypes
} from "../../models";
import { AppState } from "../../store";
import { setAuthProtocolMeta } from "../../store/actions";
import { AuthenticatorAccordion } from "../shared";
import { ApplicationProtocolAddWizard } from "./wizard/application-add-protocol-wizard";

/**
 * Proptypes for the applications settings component.
 */
interface ApplicationSettingsPropsInterface {
    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Currently editing application name.
     */
    appName: string;
    /**
     * Currently configured inbound protocols.
     */
    inboundProtocols: InboundProtocolListItemInterface[];
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Show protocol selection option.
     */
    showProtocolSelection: boolean;
    /**
     * Selected protocol configurations.
     */
    selectedInboundProtocolConfig: any;
    /**
     *  Selected inbound protocol.
     */
    selectedInboundProtocol: AuthProtocolMetaListItemInterface;
    /**
     *  All the selected inbound protocol.
     */
    allSelectedInboundProtocol: AuthProtocolMetaListItemInterface[];
    /**
     *  Change selected inbound protocol
     */
    setSelectedInboundProtocol: (protocol: AuthProtocolMetaListItemInterface) => void;
    /**
     *  Is inbound protocol config request is still loading.
     */
    isInboundProtocolConfigRequestLoading: boolean;
    /**
     * CRUD permissions,
     */
    permissions?: CRUDPermissionsInterface;
}

/**
 *  Inbound protocols and advance settings component.
 *
 * @param {ApplicationSettingsPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ApplicationSettings: FunctionComponent<ApplicationSettingsPropsInterface> = (
    props: ApplicationSettingsPropsInterface
): ReactElement => {

    const {
        appId,
        appName,
        inboundProtocols,
        isLoading,
        onUpdate,
        selectedInboundProtocol,
        selectedInboundProtocolConfig,
        allSelectedInboundProtocol,
    } = props;

    const dispatch = useDispatch();

    const availableInboundProtocols = useSelector((state: AppState) => state.application.meta.inboundProtocols);
    const authProtocolMeta = useSelector((state: AppState) => state.application.meta.protocolMeta);
    const [showWizard, setShowWizard] = useState<boolean>(false);

    /**
     * Handles the inbound config form submit action.
     *
     * @param values - Form values.
     */
    const handleInboundConfigFormSubmit = (values: any): void => {
        updateAuthProtocolConfig(appId, values, selectedInboundProtocol.id as SupportedAuthProtocolTypes)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully updated the inbound protocol configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
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
                    description: "An error occurred while updating inbound protocol configurations.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    /**
     *  Regenerate application.
     */
    const handleApplicationRegenerate = (): void => {
        regenerateClientSecret(appId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully regenerated the application",
                    level: AlertLevels.SUCCESS,
                    message: "Regenerate successful"
                }));
                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Regenerate Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while regenerating the application",
                    level: AlertLevels.ERROR,
                    message: "Application Regenerate Error"
                }));
            });
    };

    /**
     * Filter the available protocol names.
     */
    const getSelectedProtocols = (): string[] => {
        const protocols: string[] = [];
        allSelectedInboundProtocol.map((selectedProtocol) => {
            protocols.push(selectedProtocol.id)
        });
        return protocols;
    };

    /**
     * Check if the protocol is selected or not.
     * @param protocolName Protocol name to be checked.
     */
    const checkSelectedProtocol = (protocolName: string): boolean => {
        let selected = false;
        allSelectedInboundProtocol.map((selectedProtocol) => {
            if (selectedProtocol.id === protocolName) {
                selected = true
            }
        });
        return selected;
    };

    /**
     * Resolves the corresponding protocol config form when a
     * protocol is selected.
     * @return {React.ReactElement}
     */
    const resolveInboundProtocolSettingsForm = (): ReactElement => {
        return (
            <AuthenticatorAccordion
                globalActions={ [] }
                authenticators={ [
                    {
                        actions: [],
                        hidden: !checkSelectedProtocol(SupportedAuthProtocolTypes.OIDC),
                        icon: { icon: InboundProtocolLogos.oidc, size: "micro" } as GenericIconProps,
                        content: (
                            <InboundFormFactory
                                metadata={ authProtocolMeta[SupportedAuthProtocolTypes.OIDC] }
                                initialValues={
                                    selectedInboundProtocolConfig
                                    && Object.prototype.hasOwnProperty.call(selectedInboundProtocolConfig,
                                        SupportedAuthProtocolTypes.OIDC)
                                        ? selectedInboundProtocolConfig[SupportedAuthProtocolTypes.OIDC]
                                        : undefined
                                }
                                onSubmit={ handleInboundConfigFormSubmit }
                                type={ SupportedAuthProtocolTypes.OIDC }
                                handleApplicationRegenerate={ handleApplicationRegenerate }
                            />
                        ),
                        id: SupportedAuthProtocolTypes.OIDC,
                        title: "OIDC",
                    },
                    {
                        actions: [],
                        icon: { icon: InboundProtocolLogos.saml, size: "micro" } as GenericIconProps,
                        hidden: !(checkSelectedProtocol(SupportedAuthProtocolTypes.SAML)),
                        content: (
                            <InboundFormFactory
                                metadata={ authProtocolMeta[SupportedAuthProtocolTypes.SAML] }
                                initialValues={
                                    selectedInboundProtocolConfig
                                    && Object.prototype.hasOwnProperty.call(selectedInboundProtocolConfig,
                                        SupportedAuthProtocolTypes.SAML)
                                        ? selectedInboundProtocolConfig[SupportedAuthProtocolTypes.SAML]
                                        : undefined
                                }
                                onSubmit={ handleInboundConfigFormSubmit }
                                type={ SupportedAuthProtocolTypes.SAML }
                            />
                        ),
                        id: SupportedAuthProtocolTypes.SAML,
                        title: "SAML"
                    },
                    {
                        actions: [],
                        icon: { icon: InboundProtocolLogos.wsFed, size: "micro" } as GenericIconProps,
                        hidden: !(checkSelectedProtocol(SupportedAuthProtocolTypes.WS_FEDERATION)),
                        content: (
                            <InboundFormFactory
                                initialValues={
                                    selectedInboundProtocolConfig
                                    && Object.prototype.hasOwnProperty.call(selectedInboundProtocolConfig,
                                        SupportedAuthProtocolTypes.WS_FEDERATION)
                                        ? selectedInboundProtocolConfig[SupportedAuthProtocolTypes.WS_FEDERATION]
                                        : undefined
                                }
                                onSubmit={ handleInboundConfigFormSubmit }
                                type={ SupportedAuthProtocolTypes.WS_FEDERATION }
                            />
                        ),
                        id: SupportedAuthProtocolTypes.WS_FEDERATION,
                        title: "Passive STS",
                    },
                    {
                        actions: [],
                        icon: { icon: InboundProtocolLogos.wsTrust, size: "micro" } as GenericIconProps,
                        hidden: !(checkSelectedProtocol(SupportedAuthProtocolTypes.WS_TRUST)),
                        content: (
                            <InboundFormFactory
                                metadata={ authProtocolMeta[SupportedAuthProtocolTypes.WS_TRUST] }
                                initialValues={
                                    selectedInboundProtocolConfig
                                    && Object.prototype.hasOwnProperty.call(selectedInboundProtocolConfig,
                                        SupportedAuthProtocolTypes.WS_TRUST)
                                        ? selectedInboundProtocolConfig[SupportedAuthProtocolTypes.WS_TRUST]
                                        : undefined
                                }
                                onSubmit={ handleInboundConfigFormSubmit }
                                type={ SupportedAuthProtocolTypes.WS_TRUST }
                            />
                        ),
                        id: SupportedAuthProtocolTypes.WS_TRUST,
                        title: "WS Trust",
                    }
                ] }
            />
        )
    };

    /**
     * Use effect hook to be run when an inbound protocol is selected.
     */
    useEffect(() => {

        // Checks if the `inboundProtocols` is undefined. Terminate the rest of the operations.
        // If this check isn't done, fast navigation to the settings tab will potentially
        // break the UI.
        if (!inboundProtocols) {
            return;
        }

        if (!selectedInboundProtocol) {
            return;
        }

        allSelectedInboundProtocol.map((selected) => {
            const selectedProtocol = selected.name as SupportedAuthProtocolMetaTypes;

            if (!Object.values(SupportedAuthProtocolMetaTypes).includes(
                selected.name as SupportedAuthProtocolMetaTypes)) {
                return;
            }

                // Check if the metadata for the selected auth protocol is available in redux store.
            // If not, fetch the metadata related to the selected auth protocol.
            else if (!Object.prototype.hasOwnProperty.call(authProtocolMeta, selectedProtocol)) {
                getAuthProtocolMetadata(selectedProtocol)
                    .then((response) => {
                        dispatch(setAuthProtocolMeta(selectedProtocol, response));
                    })
                    .catch((error) => {
                        if (error.response && error.response.data && error.response.data.description) {
                            dispatch(addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: "Retrieval error"
                            }));

                            return;
                        }

                        dispatch(addAlert({
                            description: "An error occurred retrieving the protocol metadata.",
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));
                    });
            }
        })

    }, [selectedInboundProtocol, allSelectedInboundProtocol]);

    const alreadySelectedProtocols: string[] = getSelectedProtocols();

    return (
        !isLoading
            ? (
                <Grid>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            { alreadySelectedProtocols.length > 0 ?
                                <Button
                                    floated="right"
                                    primary
                                    onClick={ () => setShowWizard(true) }
                                >
                                    <Icon name="add"/>New Protocol
                                </Button> :
                                <EmptyPlaceholder
                                    action={ (
                                        <PrimaryButton
                                            onClick={ () => setShowWizard(true) }
                                        >
                                            <Icon name="add"/>New Protocol
                                        </PrimaryButton>
                                    ) }
                                    image={ EmptyPlaceholderIllustrations.newList }
                                    imageSize="tiny"
                                    title={ "Add a protocol" }
                                    subtitle={ [
                                        "There are currently no protocols available.",
                                        "You can add protocol easily by using the",
                                        "predefined templates."
                                    ] }
                                />

                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            { selectedInboundProtocol && resolveInboundProtocolSettingsForm() }
                        </Grid.Column>
                    </Grid.Row>
                    {
                        showWizard && (
                            <ApplicationProtocolAddWizard
                                title={ "Add New Protocol" }
                                subTitle={ "Add new protocol to " + appName + " application " }
                                closeWizard={ (): void => setShowWizard(false) }
                                addProtocol={ true }
                                selectedProtocols={ alreadySelectedProtocols }
                                onUpdate={ onUpdate }
                                appId={ appId }
                            />
                        )
                    }
                </Grid>
            )
            : <ContentLoader/>
    );
};
