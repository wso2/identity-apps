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

import _ from "lodash";
import { Field, Forms, Validation } from "@wso2is/forms";
import { Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, useState, useEffect } from "react";
import { Button, Divider, Grid } from "semantic-ui-react";
import { IdentityProviderAdvanceInterface} from "../../../models";
import { FormValidation } from "@wso2is/validation";

/**
 *  Advance Configurations for the Application.
 */
interface AdvanceConfigurationsFormPropsInterface extends IdentityProviderAdvanceInterface {
    config: IdentityProviderAdvanceInterface;
    onSubmit: (values: any) => void;
}

/**
 * Advance configurations form component.
 *
 * @param {AdvanceConfigurationsFormPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const AdvanceConfigurationsForm: FunctionComponent<AdvanceConfigurationsFormPropsInterface> = (
    props: AdvanceConfigurationsFormPropsInterface
): JSX.Element => {

    const {
        config,
        onSubmit
    } = props;

    const [isPEMSelected, setPEMSelected] = useState<boolean>(false);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
            homeRealmIdentifier: values.get("homeRealmIdentifier"),
            isFederationHub: !!values.get("federationHub")?.includes("federationHub"),
        };
    };

    useEffect(() => {
        setPEMSelected(config?.certificate && config?.certificate.certificates
            && config?.certificate?.certificates.length > 0);
    }, []);

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="federationHub"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ config?.isFederationHub ? ["federationHub"] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "Federation Hub",
                                    value: "federationHub"
                                }
                            ] }
                        />
                        <Hint>
                            Check if this points to a federation hub identity provider.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="homeRealmIdentifier"
                            label="Home Realm Identifier"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={ name }
                            type="text"
                            value={ config.homeRealmIdentifier }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="alias"
                            label="Alias"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={ name }
                            type="text"
                            value={ config.alias }
                        />
                        <Hint>
                            If the resident identity provider is known by an alias at the federated identity provider
                            specify it
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Heading as="h5">Certificate</Heading>
                        <Divider hidden/>
                        <Field
                            label="Certificate type"
                            name="type"
                            default={ config?.certificate && config?.certificate.certificates
                            && config?.certificate?.certificates.length > 0 ? "PEM" : "JWKS" }
                            listen={
                                (values) => {
                                    setPEMSelected(values.get("type") === "PEM" ? true : false);
                                }
                            }
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
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        {
                            isPEMSelected ?
                                (
                                    <Field
                                        name="value"
                                        label="Value"
                                        required={ false }
                                        requiredErrorMessage="Certificate value is required"
                                        placeholder={ "Value should be the certificate in PEM format." }
                                        type="textarea"
                                        value={ config?.certificate && config?.certificate.certificates
                                        && config?.certificate?.certificates.length > 0 &&
                                        _.first(config.certificate?.certificates) }
                                    />
                                ) : (
                                    <Field
                                        name="value"
                                        label="Value"
                                        required={ false }
                                        requiredErrorMessage="Certificate value is required"
                                        placeholder={ "Value should be jwks URL." }
                                        type="text"
                                        validation={ (value: string, validation: Validation) => {
                                            if (!FormValidation.url(value)) {
                                                validation.isValid = false;
                                                validation.errorMessages.push("This is not a valid URL");
                                            }
                                        } }
                                        value={ config?.certificate && config?.certificate?.jwksUri }
                                    />
                                )
                        }
                        <Hint>
                            If the type is JWKS, value should be a jwks URL. If the type is PEM, value should be the
                            certificate in PEM format.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Button primary type="submit" size="small" className="form-button">
                            Update
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
