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

import { Field, Forms } from "@wso2is/forms";
import React, { FunctionComponent } from "react";
import { Button, Card, Grid, Header } from "semantic-ui-react";
import { updateAdvanceConfigurations } from "../../api/application";
import { AdvancedConfigurationsInterface } from "../../models";

/**
 *  Advance Configurations for the Application.
 *
 * @param props Advance configuration model.
 */
interface AdvanceConfigurationExtentedInterface extends AdvancedConfigurationsInterface {
    appId?: string;
}

export const AdvanceConfigurations: FunctionComponent<AdvanceConfigurationExtentedInterface> = (props): JSX.Element => {

    const {
        saas,
        discoverableByEndUsers,
        certificate,
        skipConsent, // TODO  add consent for logout
        returnAuthenticatedIdpList,
        enableAuthorization,
        appId
    } = props;

    const findSelectedConfiguration = (): string[] => {
        const selectedValues = [];
        if (saas) {
            selectedValues.push("saas");
        } else if (discoverableByEndUsers) {
            selectedValues.push("discoverableByEndUsers");
        } else if (skipConsent) {
            selectedValues.push("skipConsent");
        } else if (returnAuthenticatedIdpList) {
            selectedValues.push("returnAuthenticatedIdpList");
        } else if (enableAuthorization) {
            selectedValues.push("enableAuthorization");
        }
        return selectedValues;
    };

    const handleSubmit = (values) => {
        updateAdvanceConfigurations(appId, updateConfiguration(values));
    };

    const updateConfiguration = (values) => {

        return {
            advancedConfigurations: {
                certificate: {
                    type: values.get("type"),
                    value: values.get("value"),
                },
                discoverableByEndUsers:
                    (values.get("advanceConfiguration").includes("discoverableByEndUsers") ? true : false),
                enableAuthorization:
                    (values.get("advanceConfiguration").includes("enableAuthorization") ? true : false),
                returnAuthenticatedIdpList:
                    (values.get("advanceConfiguration").includes("returnAuthenticatedIdpList") ? true : false),
                saas: (values.get("advanceConfiguration").includes("saas") ? true : false),
                skipConsent: (values.get("advanceConfiguration").includes("skipConsent") ? true : false)
            }
        };
    };

    return (
        <>
            <Card className="connection-card" fluid padded="very">
                <Card.Content>
                    <Header as="h3" className={ " " }>Advance Configurations</Header>
                </Card.Content>
                <Card.Content>
                    <Forms onSubmit={ (values) => handleSubmit(values) }>
                        <Grid className=" ">
                            <Grid.Row columns={ 1 } className="">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="">
                                    <Field
                                        name="advanceConfiguration"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        value={ findSelectedConfiguration() }
                                        type="checkbox"
                                        children={ [
                                            {
                                                label: "SaaS",
                                                value: "saas"
                                            },
                                            {
                                                label: "Discoverable By EndUsers",
                                                value: "discoverableByEndUsers"
                                            },
                                            {
                                                label: "Skip Consent",
                                                value: "skipConsent"
                                            },
                                            {
                                                label: "Return Authenticated Idp List",
                                                value: "returnAuthenticatedIdpList"
                                            },
                                            {
                                                label: "Enable Authorization",
                                                value: "enableAuthorization"
                                            }
                                        ] }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Header as="h5">Certificate</Header>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 } className="protocolColumn">
                                    <Field
                                        label="Type"
                                        name="type"
                                        default={ certificate ? certificate.type : "JWKS" }
                                        type="radio"
                                        children={ [
                                            {
                                                label: "JWKS",
                                                value: "JWKS"
                                            },
                                            {
                                                label: "PEM",
                                                value: "PEM"
                                            }
                                        ]
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Field
                                        name="value"
                                        label="Value"
                                        required={ false }
                                        requiredErrorMessage="Certificate value is required"
                                        placeholder={ "If type is JWKS, value should be jwks URL. " +
                                        "If type is PEM, value should be the certificate in PEM format." }
                                        type="text"
                                        value={ certificate && certificate.value }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Button primary type="submit" size="small" className="form-button">
                                        Update
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Forms>
                </Card.Content>
            </Card>
        </>
    );
};
