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

import { Hint, SelectionCard } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { InboundProtocolLogos } from "../../../configs";
import { Heading } from "@wso2is/react-components";
import { AuthProtocolMetaListItemInterface } from "../../../models";

/**
 * Proptypes for the protocol selection wizard form component.
 */
interface ProtocolSelectionWizardFormPropsInterface {
    initialValues: AuthProtocolMetaListItemInterface;
    protocols: AuthProtocolMetaListItemInterface[];
    triggerSubmit: boolean;
    onSubmit: (values: AuthProtocolMetaListItemInterface) => void;
}

/**
 * General settings wizard form component.
 *
 * @param {ProtocolSelectionWizardFormPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ProtocolSelectionWizardForm: FunctionComponent<ProtocolSelectionWizardFormPropsInterface> = (
    props: ProtocolSelectionWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit,
        protocols
    } = props;

    const [ selectedInboundProtocol, setSelectedInboundProtocol ] = useState<AuthProtocolMetaListItemInterface>(protocols[0]);

    /**
     * Called when the supplied list of protocols changes.
     */
    useEffect(() => {
        if (!protocols) {
            return;
        }

        if (initialValues) {
            setSelectedInboundProtocol(initialValues);
            return;
        }

        setSelectedInboundProtocol(protocols[0]);
    }, [ protocols ]);

    /**
     * Called when submit is triggered.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        onSubmit(selectedInboundProtocol);
    }, [ triggerSubmit ]);

    /**
     * Handles inbound protocol selection.
     *
     * @param {AuthProtocolMetaListItemInterface} protocol - Selected protocol.
     */
    const handleInboundProtocolSelection = (protocol: AuthProtocolMetaListItemInterface): void => {
        setSelectedInboundProtocol(protocol);
    };

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <Heading as="h4">Inbound protocol</Heading>
                    <Hint icon={ null }>Select one of the following inbound protocols</Hint>
                    {
                        (protocols && protocols instanceof Array && protocols.length > 0)
                            ? protocols.map((protocol, index) => (
                                <SelectionCard
                                    inline
                                    id={ protocol.name }
                                    key={ index }
                                    header={ protocol.displayName }
                                    image={ InboundProtocolLogos[ protocol.logo ] }
                                    onClick={ (): void => handleInboundProtocolSelection(protocol) }
                                    selected={ selectedInboundProtocol?.id === protocol.id }
                                />
                            ))
                            : null

                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
