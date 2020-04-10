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

import {
    IdentityProviderInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../../../models";
import React, { FunctionComponent, ReactElement } from "react";
import { OutboundProvisioningConnectorFormFactory } from "../../forms/factories";

/**
 * Proptypes for the outbound provisioning settings wizard form component.
 */
interface OutboundProvisioningSettingsWizardFormPropsInterface {
    metadata: OutboundProvisioningConnectorMetaInterface;
    initialValues: IdentityProviderInterface;
    onSubmit: (values: IdentityProviderInterface) => void;
    triggerSubmit: boolean;
}

/**
 * Outbound provisioning settings wizard form component.
 *
 * @param {OutboundProvisioningSettingsWizardFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const OutboundProvisioningSettings: FunctionComponent<OutboundProvisioningSettingsWizardFormPropsInterface> = (
    props
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        triggerSubmit
    } = props;

    const handleSubmit = (outboundProvisioningConnector: OutboundProvisioningConnectorInterface) => {
        onSubmit({
            ...initialValues,
            provisioning: {
                ...initialValues?.provisioning,
                outboundConnectors: {
                    connectors: [{
                        ...outboundProvisioningConnector,
                        isDefault: true
                    }],
                    defaultConnectorId: outboundProvisioningConnector?.connectorId
                }
            }
        });
    };

    const defaultOutboundProvisioningConnector = initialValues?.provisioning?.outboundConnectors?.connectors.find(
        connector => connector.connectorId === initialValues?.provisioning?.outboundConnectors.defaultConnectorId);
    return (
        <OutboundProvisioningConnectorFormFactory
            metadata={ metadata }
            initialValues={ defaultOutboundProvisioningConnector }
            onSubmit={ handleSubmit }
            triggerSubmit={ triggerSubmit }
            enableSubmitButton={ false }
        />
    );
};
