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

import { Heading, Hint, SelectionCard } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Card, Dimmer, Header, Loader } from "semantic-ui-react";
import { getAvailableInboundProtocols, getInboundProtocolConfig } from "../../api";
import { InboundProtocolLogos } from "../../configs";
import {
    AdvancedConfigurationsInterface,
    AuthProtocolMetadataInterface,
    InboundProtocolListItemInterface
} from "../../models";
import { AdvanceConfigurations } from "./advanced-configurations";
import { OIDCForm } from "./inbound-form-oidc";
import { InboundProtocolsMeta } from "./meta";
import { SettingsSection } from "./settings-section-application-variation";

interface ApplicationSettingsProps {
    appId: string;
    advancedConfigurations: AdvancedConfigurationsInterface;
    inboundProtocols: InboundProtocolListItemInterface[];
}

/**
 * Contains the inbound protocols and advance settings of the application.
 *
 * @param props ApplicationSettingsProps.
 */
export const ApplicationSettings: FunctionComponent<ApplicationSettingsProps> = (props): JSX.Element => {

    const {
        appId,
        advancedConfigurations,
        inboundProtocols
    } = props;

    const [ availableInboundProtocols, setAvailableInboundProtocols ] = useState<AuthProtocolMetadataInterface[]>([]);
    const [ selectedInboundProtocol, setSelectedInboundProtocol ] = useState<AuthProtocolMetadataInterface>(null);
    const [ isProfileInfoRequestLoading, setProfileInfoRequestLoadingStatus ] = useState<boolean>(false);

    // Save the currently selected protocol
    const [enableProtocol, setProtocol] = useState({
        protocols: {
            OIDC: true,
        }
    });

    useEffect(() => {
        setProfileInfoRequestLoadingStatus(true);

        getAvailableInboundProtocols(false)
            .then((response) => {
                setAvailableInboundProtocols(_.unionBy<AuthProtocolMetadataInterface>(InboundProtocolsMeta, response, "name"));
            })
            .catch((error) => {
            })
            .finally(() => {
                setProfileInfoRequestLoadingStatus(false);
            });
    }, []);

    useEffect(() => {
        if (availableInboundProtocols
            && availableInboundProtocols instanceof Array
            && availableInboundProtocols.length > 0) {
            setSelectedInboundProtocol(availableInboundProtocols[0]);
        }
    }, [ availableInboundProtocols ]);

    useEffect(() => {

        const endpoint = getInboundProtocolConfigEndpoint();

        getInboundProtocolConfig(endpoint)
            .then((response) => {
            })
            .catch((error) => {
            });
    }, [ selectedInboundProtocol ]);

    // To switch between multiple inbound protocols forms
    const toggleHandler = (id) => {
        const oldProtocol = { ...enableProtocol.protocols };
        for (const key in oldProtocol) {
            // tslint:disable-next-line:prefer-conditional-expression
            if (key === id) {
                oldProtocol[key] = true;
            } else {
                oldProtocol[key] = false;
            }
        }
        setProtocol(
            { protocols: oldProtocol }
        );
    };

    const protocolStatus = (id): boolean => {
        const oldProtocol = { ...enableProtocol.protocols };
        return (oldProtocol[id] !== null) ? oldProtocol[id] : false;
    };

    const [editOIDCForm, setEditOIDCForm] = useState({
        OIDCview: false
    });

    const renderODIC = (): void => {
        setEditOIDCForm(
            { OIDCview: true }
        );
    };

    const closeOIDC = () => {
        setEditOIDCForm(
            { OIDCview: false }
        );
    };

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

    const handleInboundProtocolSelection = (e, { id }) => {
        // Return if the already selected protocol is clicked again.
        if (selectedInboundProtocol.name === id) {
            return;
        }

        setSelectedInboundProtocol([ ...availableInboundProtocols ].find((protocol) => protocol.name === id));
    };

    return (
        <>
            <div className="protocol-settings-section">
                <Heading as="h4">Protocol settings</Heading>
                <Heading as="h5">Inbound Protocol</Heading>
                <Hint icon="info circle">Please select one of the following inbound protocols.</Hint>
                {
                    (availableInboundProtocols
                        && availableInboundProtocols.length
                        && availableInboundProtocols.length > 0)
                        ? availableInboundProtocols.map((protocol, index) => (
                            <SelectionCard
                                inline
                                selected={
                                    selectedInboundProtocol && selectedInboundProtocol.name
                                        ? protocol.name === selectedInboundProtocol.name
                                        : false
                                }
                                id={ protocol.name }
                                key={ index }
                                header={ protocol.displayName }
                                image={ InboundProtocolLogos[protocol.logo] }
                                onClick={ handleInboundProtocolSelection }
                            />
                        ))
                        : null
                }
                <Heading as="h5">Configure Inbound Protocol</Heading>

            </div>
            <Card fluid padded="very">
                <Card.Content>
                    <Header as="h3" className={ " " }>Protocol settings</Header>
                </Card.Content>
                <Card.Content>
                    <SettingsSection
                        header="OAuth /OpenId"
                        description="set OIDC settings"
                        primaryAction="update"
                        onPrimaryActionClick={ renderODIC }
                        showActionBar={ !editOIDCForm.OIDCview }
                        onToggle={ () => toggleHandler("OIDC") }
                        toggle={ true }
                        toggleValue={ protocolStatus("OIDC") }
                    >
                        { editOIDCForm.OIDCview && <OIDCForm appId={ appId } cancelView={ closeOIDC }/> }
                    </SettingsSection>
                </Card.Content>
            </Card>
            <AdvanceConfigurations
                appId={ appId }
                certificate={ advancedConfigurations.certificate }
                returnAuthenticatedIdpList={ advancedConfigurations.returnAuthenticatedIdpList }
                discoverableByEndUsers={ advancedConfigurations.discoverableByEndUsers }
                enableAuthorization={ advancedConfigurations.enableAuthorization }
                saas={ advancedConfigurations.saas }
                skipConsent={ advancedConfigurations.skipConsent }
            />
        </>
    );
};
