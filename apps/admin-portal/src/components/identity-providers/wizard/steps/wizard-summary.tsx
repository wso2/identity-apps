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

import { AppAvatar, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { Divider, Grid } from "semantic-ui-react";
import { FederatedAuthenticatorMetaInterface, IdentityProviderInterface } from "../../../../models";

/**
 * Proptypes for the wizard summary component.
 */
interface WizardSummaryProps {
    authenticatorMetadata: FederatedAuthenticatorMetaInterface;
    identityProvider: IdentityProviderInterface;
    triggerSubmit: boolean;
    onSubmit: (identityProvider: IdentityProviderInterface) => void;
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
        authenticatorMetadata,
        identityProvider,
        triggerSubmit,
        onSubmit
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

    const authenticatorSummary = identityProvider?.federatedAuthenticators?.authenticators[0];

    const getAuthenticatorProperties = () => {
        return authenticatorSummary?.properties.map((eachProp) => {
            const propertyMetadata = authenticatorMetadata?.properties?.find(eachPropMetadata =>
                eachProp.key === eachPropMetadata.key);
            if (eachProp.value !== undefined || !propertyMetadata.isConfidential) {
                return (
                    <Grid.Row className="summary-field" columns={ 2 } key={ eachProp?.key }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">{propertyMetadata?.displayName}</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">{
                                eachProp?.value.toString() === "" ? " - " : eachProp?.value
                            }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
        });
    };

    const getGeneralDetailsComponent = () => {
        return (
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
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

    const getAuthenticatorComponent = () => {
        return <>
            <Divider horizontal>Authenticator details</Divider>

            {
                authenticatorSummary && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Name</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">{authenticatorSummary?.name}</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                authenticatorSummary?.properties && getAuthenticatorProperties()
            }
        </>;
    };

    const isAuthenticatorStepAvailable = () => {
        return identityProvider?.federatedAuthenticators?.defaultAuthenticatorId;
    };

    return (
        <Grid className="wizard-summary">
            { getGeneralDetailsComponent() }
            { isAuthenticatorStepAvailable() ? getAuthenticatorComponent() : null }
        </Grid>
    );
};
