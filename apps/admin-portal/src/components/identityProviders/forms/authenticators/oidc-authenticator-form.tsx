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

import {Field, Forms} from "@wso2is/forms";
import React, {FunctionComponent, ReactElement, useEffect, useState} from "react";
import {Button, Grid} from "semantic-ui-react";
import {AuthenticatorFormPropsInterface} from "../../../../models";

/**
 * Inbound OIDC protocol configurations form.
 *
 * @return { ReactElement }
 * @constructor
 */
export const OIDCAuthenticatorForm: FunctionComponent<AuthenticatorFormPropsInterface> = (
    props
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit
    } = props;

    const { properties } = metadata;
    const [ IsUserIdInClaims, setIsUserIdInClaims ] = useState<boolean>(false);
    const [ IsBasicAuthEnabled, setIsBasicAuthEnabled ] = useState<boolean>(false);

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        const formValues = {
            properties: [
                {
                    key: "OAuth2AuthzEPUrl",
                    value: values.get("OAuth2AuthzEPUrl")
                },
                {
                    key: "OAuth2TokenEPUrl",
                    value: values.get("OAuth2TokenEPUrl")
                },
                {
                    key: "callbackUrl",
                    value: values.get("callbackUrl")
                },
                {
                    key: "UserInfoUrl",
                    value: values.get("UserInfoUrl")
                },
                {
                    key: "IsUserIdInClaims",
                    value: values.get("IsUserIdInClaims")?.includes("IsUserIdInClaims")
                },
                {
                    key: "commonAuthQueryParams",
                    value: values.get("commonAuthQueryParams")
                },
                {
                    key: "IsBasicAuthEnabled",
                    value: values.get("IsBasicAuthEnabled")?.includes("IsBasicAuthEnabled")
                },
            ],
        };

        return {
            ...formValues,
            authenticatorId: initialValues.authenticatorId,
            isEnabled: initialValues.isEnabled,
            isDefault: initialValues.isDefault,
        };
    };

    useEffect(
        () => {
            setIsUserIdInClaims(initialValues?.properties
                ?.find(property => property.key === "IsUserIdInClaims")?.value === "true");
            setIsBasicAuthEnabled(initialValues?.properties
                ?.find(property => property.key === "IsBasicAuthEnabled")?.value === "true");
        }, [initialValues]
    );

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(updateConfiguration(values));
            } }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="ClientId"
                            label="Client ID"
                            required={ true }
                            requiredErrorMessage=""
                            placeholder="Enter OAuth2/OpenID Connect client identifier value"
                            type="text"
                            value={ initialValues?.properties
                                ?.find(property => property.key === "ClientId")?.value }
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="ClientSecret"
                            label="Client Secret"
                            hidePassword="Hide secret"
                            showPassword="Show secret"
                            required={ true }
                            requiredErrorMessage="this is needed"
                            placeholder="Enter OAuth2/OpenID Connect client secret value"
                            type="password"
                            value={ initialValues?.properties
                                ?.find(property => property.key === "ClientSecret")?.value }
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="OAuth2AuthzEPUrl"
                            label="Authorization Endpoint URL"
                            required={ true }
                            requiredErrorMessage="Please fill the Authorization Endpoint URL"
                            placeholder="Enter OAuth2/OpenID Connect authorization endpoint URL value"
                            type="text"
                            value={ initialValues?.properties
                                ?.find(property => property.key === "OAuth2AuthzEPUrl")?.value }
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="OAuth2TokenEPUrl"
                            label="Token Endpoint URL"
                            required={ true }
                            requiredErrorMessage="Please fill the Token Endpoint URL"
                            placeholder="Enter OAuth2/OpenID Connect token endpoint URL value"
                            type="text"
                            value={ initialValues?.properties
                                ?.find(property => property.key === "OAuth2TokenEPUrl")?.value }
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="callbackUrl"
                            label="Callback Url"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter value corresponding to callback url"
                            type="text"
                            value={ initialValues?.properties
                                ?.find(property => property.key === "callbackUrl")?.value }
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="UserInfoUrl"
                            label="Userinfo Endpoint URL"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter value corresponding to userinfo endpoint url"
                            type="text"
                            value={ initialValues?.properties
                                ?.find(property => property.key === "UserInfoUrl")?.value }
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="IsUserIdInClaims"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: "OpenID Connect User ID Location",
                                    value: "IsUserIdInClaims"
                                }
                            ] }
                            value={ IsUserIdInClaims ? [ "IsUserIdInClaims" ] : [] }
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="commonAuthQueryParams"
                            label="Additional Query ParametersL"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Additional query parameters. e.g: paramName1=value1"
                            type="text"
                            value={ initialValues?.properties
                                ?.find(property => property.key === "commonAuthQueryParams")?.value }
                        />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="IsBasicAuthEnabled"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: "Enable HTTP basic auth for client authentication",
                                    value: "IsBasicAuthEnabled"
                                }
                            ] }
                            value={ IsBasicAuthEnabled ? [ "IsBasicAuthEnabled" ] : [] }
                        />
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
