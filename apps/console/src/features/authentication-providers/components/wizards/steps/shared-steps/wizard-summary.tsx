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

import { TestableComponentInterface } from "@wso2is/core/models";
import { AppAvatar, Heading } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { Divider, Grid } from "semantic-ui-react";
import {
    FederatedAuthenticatorMetaInterface,
    IdentityProviderInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../../../models";
import { getPropertyMetadata } from "../../../utils";

/**
 * Proptypes for the wizard summary component.
 */
interface WizardSummaryProps extends TestableComponentInterface {
    provisioningConnectorMetadata: OutboundProvisioningConnectorMetaInterface;
    authenticatorMetadata: FederatedAuthenticatorMetaInterface;
    identityProvider: IdentityProviderInterface;
    triggerSubmit: boolean;
    onSubmit: (identityProvider: IdentityProviderInterface) => void;
    isAddAuthenticatorWizard?: boolean;
}

/**
 * Wizard summary form component.
 *
 * @param {WizardSummaryProps} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const WizardSummary: FunctionComponent<WizardSummaryProps> = (
    props: WizardSummaryProps
): ReactElement => {

    const {
        provisioningConnectorMetadata,
        authenticatorMetadata,
        identityProvider,
        triggerSubmit,
        onSubmit,
        isAddAuthenticatorWizard,
        [ "data-testid" ]: testId
    } = props;

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }
        onSubmit(identityProvider);
    }, [triggerSubmit]);

    const authenticatorSummary = identityProvider?.federatedAuthenticators?.authenticators?.find(
        authenticator => authenticator.authenticatorId === identityProvider?.federatedAuthenticators?.
            defaultAuthenticatorId);

    const provisioningSummary = identityProvider?.provisioning?.outboundConnectors?.connectors?.find(connector =>
        connector.connectorId === identityProvider?.provisioning?.outboundConnectors?.defaultConnectorId);

    const getPropertySummary = (properties: any[], metaProperties: any[]) => {

        const sortedProperties = properties?.sort((a, b) => {
            const firstOrder = metaProperties?.find(eachPropMetadata =>
                a.key === eachPropMetadata.key)?.displayOrder;
            const secondOrder = metaProperties?.find(eachPropMetadata =>
                b.key === eachPropMetadata.key)?.displayOrder;
            return firstOrder - secondOrder;
        });

        return sortedProperties?.map((eachProp) => {
            const propertyMetadata = getPropertyMetadata(eachProp?.key, metaProperties);
            if (eachProp.value !== undefined && !_.isEmpty(eachProp?.value.toString()) &&
                !propertyMetadata?.isConfidential) {
                return (
                    <Grid.Row className="summary-field" columns={ 2 } key={ eachProp?.key }
                              data-testid={ `${ testId }-${ eachProp?.key }` }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">{ propertyMetadata?.displayName ?? eachProp?.key }</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url" data-testid={ `${ testId }-${ eachProp?.key }` }>
                                { eachProp?.value.toString() }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        });
    };

    const getGeneralDetailsComponent = () => {
        return (
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details" data-testid={ testId }>
                        <AppAvatar
                            name={ identityProvider?.name }
                            image={ identityProvider?.image }
                            size="tiny"
                        />
                        {identityProvider?.name && (
                            <Heading size="small" className="name">{ identityProvider.name }</Heading>
                        )}
                        {identityProvider?.description && (
                            <div className="description">{ identityProvider.description }</div>
                        )}
                    </div>
                </Grid.Column>
            </Grid.Row>
        );
    };

    function getNameComponent(key: string, value: string) {
        return <Grid.Row className="summary-field" columns={ 2 }>
            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                <div className="label">{ key }</div>
            </Grid.Column>
            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                <div className="value url">{ value }</div>
            </Grid.Column>
        </Grid.Row>;
    }

    const getAuthenticatorSettingsComponent = () => {
        return <>
            <Divider horizontal>Authenticator Settings</Divider>

            { authenticatorSummary && getNameComponent("Authenticator", authenticatorMetadata?.name) }

            {
                authenticatorSummary?.properties && getPropertySummary(authenticatorSummary?.properties,
                    authenticatorMetadata?.properties)
            }
        </>;
    };

    const getProvisioningSettingsComponent = () => {
        return <>
            <Divider horizontal>Provisioning Settings</Divider>

            { provisioningSummary && getNameComponent("Connector", provisioningConnectorMetadata?.displayName) }

            {
                provisioningSummary?.properties && getPropertySummary(provisioningSummary?.properties,
                    provisioningConnectorMetadata?.properties)
            }
        </>;
    };

    const isAuthenticatorSettingsStepAvailable = () => {
        return identityProvider?.federatedAuthenticators?.defaultAuthenticatorId;
    };

    const isProvisioningSettingsStepAvailable = () => {
        return isAddAuthenticatorWizard ? false :
            identityProvider?.provisioning?.outboundConnectors?.defaultConnectorId;
    };

    return (
        identityProvider ?
            <Grid className="wizard-summary" data-testid={ testId }>
                { !isAddAuthenticatorWizard && getGeneralDetailsComponent() }

                { authenticatorMetadata
                    && isAuthenticatorSettingsStepAvailable() && getAuthenticatorSettingsComponent() }

                { isProvisioningSettingsStepAvailable() && getProvisioningSettingsComponent() }
            </Grid>
            : null
    );
};
