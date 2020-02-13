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
import { Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { Button, Divider, Grid } from "semantic-ui-react";
import { AdvancedConfigurationsInterface } from "../../../models";

/**
 *  Advance Configurations for the Application.
 */
interface AdvanceConfigurationsFormPropsInterface extends AdvancedConfigurationsInterface {
    config: AdvancedConfigurationsInterface;
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

    const {
        certificate,
        enableAuthorization,
        returnAuthenticatedIdpList,
        saas,
        skipConsent
    } = config;

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
            advancedConfigurations: {
                certificate: {
                    type: values.get("type"),
                    value: values.get("value"),
                },
                enableAuthorization: !!values.get("enableAuthorization")?.includes("enableAuthorization"),
                returnAuthenticatedIdpList: !!values.get("returnAuthenticatedIdpList")?.includes("returnAuthenticatedIdpList"),
                saas: !!values.get("saas")?.includes("saas"),
                skipConsent: !!values.get("skipConsent")?.includes("skipConsent"),
            }
        };
    };

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="saas"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ saas ? [ "saas" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "SaaS",
                                    value: "saas"
                                }
                            ] }
                        />
                        <Hint>
                            Applications are by default restricted for usage by users of the service provider's tenant.
                            If this application is SaaS enabled it is opened up for all the users of all the tenants.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="skipConsent"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ skipConsent ? [ "skipConsent" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "Skip Consent",
                                    value: "skipConsent"
                                }
                            ] }
                        />
                        <Hint>
                            User consent will be skipped during login flows.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="returnAuthenticatedIdpList"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ returnAuthenticatedIdpList ? [ "returnAuthenticatedIdpList" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "Return Authenticated Idp List",
                                    value: "returnAuthenticatedIdpList"
                                }
                            ] }
                        />
                        <Hint>
                            The list of authenticated identity providers will be returned in the authentication
                            response.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="enableAuthorization"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ enableAuthorization ? [ "enableAuthorization" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "Enable Authorization",
                                    value: "enableAuthorization"
                                }
                            ] }
                        />
                        <Hint>
                            Decides whether authorization policies needs to be engaged during authentication
                            flows.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Heading as="h5">Certificate</Heading>
                        <Divider hidden />
                        <Field
                            label="Certificate type"
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
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
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
