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
import { ContentLoader, Heading, Hint, SelectionCard } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, SyntheticEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import {
    getAuthProtocolMetadata,
    getAvailableInboundProtocols,
    getInboundProtocolConfig,
    updateAdvanceConfigurations, updateAuthProtocolConfig
} from "../../api";
import { InboundProtocolLogos } from "../../configs";
import {
    AdvancedConfigurationsInterface,
    AuthProtocolMetaListItemInterface,
    InboundProtocolListItemInterface,
    SupportedAuthProtocolMetaTypes,
    SupportedAuthProtocolTypes
} from "../../models";
import { AppState } from "../../store";
import { setAuthProtocolMeta, setAvailableInboundAuthProtocolMeta } from "../../store/actions";
import { AdvanceConfigurationsForm, InboundFormFactory } from "./forms";
import { InboundProtocolsMeta } from "./meta";

/**
 * Proptypes for the applications settings component.
 */
interface ApplicationSettingsPropsInterface {
    appId: string;
    inboundProtocols: InboundProtocolListItemInterface[];
    isLoading?: boolean;
}

/**
 *  Inbound protocols and advance settings component.
 *
 * @param {ApplicationSettingsPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const ApplicationSettings: FunctionComponent<ApplicationSettingsPropsInterface> = (
    props: ApplicationSettingsPropsInterface
): JSX.Element => {

    const {
        appId,
        inboundProtocols,
        isLoading
    } = props;

    const dispatch = useDispatch();

    const availableInboundProtocols = useSelector((state: AppState) => state.application.meta.inboundProtocols);
    const authProtocolMeta = useSelector((state: AppState) => state.application.meta.protocolMeta);

    const [ selectedInboundProtocol, setSelectedInboundProtocol ] = useState<AuthProtocolMetaListItemInterface>(null);
    const [ selectedInboundProtocolConfig, setSelectedInboundProtocolConfig ] = useState<any>(undefined);
    const [ isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading ] = useState<boolean>(false);

    /**
     * Use effect hook to be run on component init.
     */
    useEffect(() => {

        // Checks if the `inboundProtocols` is undefined. Terminate the rest of the operations.
        // If this check isn't done, fast navigation to the settings tab will potentially
        // break the UI.
        if (!inboundProtocols) {
            return;
        }

        if (!_.isEmpty(availableInboundProtocols)) {
            setDefaultInboundProtocol();
            return;
        }

        setInboundProtocolsRequestLoading(true);

        getAvailableInboundProtocols(false)
            .then((response) => {
                // Filter meta based on the available protocols.
                const filteredMeta = _.intersectionBy(InboundProtocolsMeta, response, "name");

                dispatch(
                    setAvailableInboundAuthProtocolMeta(_.unionBy<AuthProtocolMetaListItemInterface>(filteredMeta,
                        response, "name"))
                );
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred retrieving the available inbound protocols.",
                    level: AlertLevels.ERROR,
                    message: "Retrieval error"
                }));
            })
            .finally(() => {
                setInboundProtocolsRequestLoading(false);
            });
    }, []);

    /**
     * Use effect hook to be run to set the default inbound protocol
     * when the supported inbound protocols are available.
     */
    useEffect(() => {
        setDefaultInboundProtocol();
    }, [ availableInboundProtocols ]);

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

        const selectedProtocol = selectedInboundProtocol.name as SupportedAuthProtocolMetaTypes;

        // Check if the metadata for the selected auth protocol is available in redux store.
        // If not, fetch the metadata related to the selected auth protocol.
        if (!authProtocolMeta.hasOwnProperty(selectedProtocol)) {
            getAuthProtocolMetadata(selectedProtocol)
                .then((response) => {
                    dispatch(setAuthProtocolMeta(selectedProtocol, response));
                })
                .catch((error) => {
                    dispatch(addAlert({
                        description: "An error occurred retrieving the protocol metadata.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });
        }

        // Check if the selected protocol is configured. If not refrain from making
        // the API request to get the configured data.
        if (!inboundProtocols.find((protocol) => protocol.type === selectedInboundProtocol.type)) {
            return;
        }

        getInboundProtocolConfig(getInboundProtocolConfigEndpoint())
            .then((response) => {
                setSelectedInboundProtocolConfig({
                    ...selectedInboundProtocolConfig,
                    [ selectedProtocol ]: response
                });
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred retrieving the protocol configurations.",
                    level: AlertLevels.ERROR,
                    message: "Retrieval error"
                }));
            });
    }, [ selectedInboundProtocol ]);

    /**
     * Sets the default inbound protocol. Currently defaults to the first
     * element of the available protocols array.
     */
    const setDefaultInboundProtocol = (): void => {
        if (availableInboundProtocols
            && availableInboundProtocols instanceof Array
            && availableInboundProtocols.length > 0) {

            setSelectedInboundProtocol(availableInboundProtocols[ 0 ]);
        }
    };

    /**
     * Finds the endpoint for retrieving the protocol config.
     * @return {string} Endpoint to get the config.
     */
    const getInboundProtocolConfigEndpoint = (): string => {
        for (const available of availableInboundProtocols) {
            for (const configured of inboundProtocols) {
                if (available.type === configured.type) {
                    if (selectedInboundProtocol.type === configured.type) {
                        return configured.self;
                    }
                }
            }
        }

        return null;
    };

    /**
     * Handles the inbound protocol selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Identifier.
     */
    const handleInboundProtocolSelection = (e: SyntheticEvent, { id }: { id: string }): void => {
        // Return if the already selected protocol is clicked again.
        if (selectedInboundProtocol.name === id) {
            return;
        }

        setSelectedInboundProtocol([ ...availableInboundProtocols ].find((protocol) => protocol.name === id));
    };

    /**
     * Resolves the corresponding protocol config form when a
     * protocol is selected.
     * @return {JSX.Element}
     */
    const resolveInboundProtocolSettingsForm = (): JSX.Element => {
        switch (selectedInboundProtocol.id as SupportedAuthProtocolTypes) {
            case SupportedAuthProtocolTypes.OIDC:
                return (
                    <InboundFormFactory
                        metadata={ authProtocolMeta[ selectedInboundProtocol.name ] }
                        initialValues={
                            selectedInboundProtocolConfig
                            && selectedInboundProtocolConfig.hasOwnProperty(selectedInboundProtocol.name)
                                ? selectedInboundProtocolConfig[ selectedInboundProtocol.name ]
                                : undefined
                        }
                        onSubmit={ handleInboundConfigFormSubmit }
                        type={ SupportedAuthProtocolTypes.OIDC }
                    />
                );
            default:
                return null;
        }
    };

    /**
     * Handles the inbound config form submit action.
     *
     * @param values - Form values.
     */
    const handleInboundConfigFormSubmit = (values: any): void => {
        updateAuthProtocolConfig(appId, values, selectedInboundProtocol.id as SupportedAuthProtocolTypes)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully updated the inbound protocol configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: "An error occurred while updating inbound protocol configurations.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    };

    return (
        <>
            {
                (!isLoading && !isInboundProtocolsRequestLoading)
                    ? (
                        <>
                            <div className="inbound-protocols-section">
                                <Heading as="h4">Inbound protocol</Heading>
                                <Hint icon="info circle">Please select one of the following inbound protocols.</Hint>
                                {
                                    (availableInboundProtocols
                                        && availableInboundProtocols instanceof Array
                                        && availableInboundProtocols.length > 0)
                                        ? availableInboundProtocols.map((protocol, index) => (
                                            protocol.enabled && (
                                                <SelectionCard
                                                    inline
                                                    disabled={ protocol.enabled }
                                                    selected={
                                                        selectedInboundProtocol && selectedInboundProtocol.name
                                                            ? protocol.name === selectedInboundProtocol.name
                                                            : false
                                                    }
                                                    id={ protocol.name }
                                                    key={ index }
                                                    header={ protocol.displayName }
                                                    image={ InboundProtocolLogos[ protocol.logo ] }
                                                    onClick={ handleInboundProtocolSelection }
                                                />
                                            )
                                        ))
                                        : null
                                }
                                <Divider hidden/>
                                <div className="protocol-settings-section">
                                    { selectedInboundProtocol && resolveInboundProtocolSettingsForm() }
                                </div>
                            </div>
                        </>
                    )
                    : <ContentLoader />
            }
        </>
    );
};
