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

import { Field, Forms, Validation } from "@wso2is/forms";
import { Heading, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Divider, Grid } from "semantic-ui-react";
import {
    emptyOIDCConfig,
    MetadataPropertyInterface,
    OAuth2PKCEConfigurationInterface,
    OIDCDataInterface,
    OIDCMetadataInterface
} from "../../../models";
import { URLInputComponent } from "../components";

/**
 * Proptypes for the inbound OIDC form component.
 */
interface InboundOIDCFormPropsInterface {
    metadata: OIDCMetadataInterface;
    initialValues: OIDCDataInterface;
    onSubmit: (values: any) => void;
}

/**
 * Inbound OIDC protocol configurations form.
 *
 * @param {InboundOIDCFormPropsInterface} props
 * @return {JSX.Element}
 * @constructor
 */
export const InboundOIDCForm: FunctionComponent<InboundOIDCFormPropsInterface> = (
    props: InboundOIDCFormPropsInterface
): JSX.Element => {

    const {
        metadata,
        initialValues,
        onSubmit
    } = props;

    const [isEncryptionEnabled, setEncryptionEnable] = useState(false);
    const [callBackUrls, setCallBackUrls] = useState("");
    const [showURLError, setShowURLError] = useState(false);

    /**
     * Add regexp to multiple callbackUrls and update configs.
     *
     * @param {string} urls - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackUrlWithRegExp = (urls: string): string => {
        let callbackURL = urls.replace(/['"]+/g, "");
        if (callbackURL.split(",").length > 1) {
            callbackURL = "regexp=(" + callbackURL.split(",").join("|") + ")";
        }
        return callbackURL;
    };

    /**
     * Remove regexp from incoming data and show the callbackUrls.
     *
     * @param {string} url - Callback URLs.
     * @return {string} Prepared callback URL.
     */
    const buildCallBackURLWithSeparator = (url: string): string => {
        if (url.includes("regexp=(")) {
            url = url.replace("regexp=(", "");
            url = url.replace(")", "");
            url = url.split("|").join(",");
        }
        return url;
    };

    /**
     * Maps meta data grant types and configuration grant types.
     *
     * @param {string} grant - Grant type.
     * @return {any}
     */
    const makeGrantTypeReadable = (grant: string): any => {
        // TODO Remove this method and fix backend to provide consistent options
        if ("urn:ietf:params:oauth:grant-type:device_code" === grant) {
            // return { label: "Device Code", value: grant };
        } else if ("urn:ietf:params:oauth:grant-type:uma-ticket" === grant) {
            // return { label: "UMA Ticket ", value: grant };
        } else if ("account_switch" === grant) {
            // return { label: "Account Switch", value: grant };
        } else if ("urn:ietf:params:oauth:grant-type:jwt-bearer" === grant) {
            // return { label: "JWT Bearer", value: grant };
        } else if ("Code" === grant) {
            return { label: grant, value: "authorization_code" };
        } else if ("Refresh Token" === grant) {
            return { label: grant, value: "refresh_token" };
        } else if ("SAML2" === grant) {
            // return { label: grant, value: "urn:ietf:params:oauth:grant-type:saml2-bearer" };
        } else if ("Implicit" === grant) {
            // return { label: grant, value: "implicit" };
        } else if ("Password" === grant) {
            // return { label: grant, value: "password" };
        } else if ("Client Credential" === grant) {
            // return { label: grant, value: "client_credentials" };
        } else if ("IWA-NTLM" === grant) {
            // return { label: grant, value: "iwa:ntlm" };
        } else {
            // return { label: grant, value: grant };
        }
    };

    /**
     * Creates options for Radio & dropdown using MetadataPropertyInterface options.
     *
     * @param {MetadataPropertyInterface} metadataProp - Metadata.
     * @param {boolean} isLabel - Flag to determine if label.
     * @param {boolean} isGrant - Flag to determine if grant type.
     * @return {any[]}
     */
    const getAllowedList = (metadataProp: MetadataPropertyInterface, isLabel?: boolean, isGrant?: boolean): any[] => {
        const allowedList = [];
        if (metadata) {
            if (isGrant) {
                metadataProp.options.map((ele) => {
                    const addElement = makeGrantTypeReadable(ele);
                    if (addElement) {
                        allowedList.push(makeGrantTypeReadable(ele));
                    }
                });
            } else if (isLabel) {
                metadataProp.options.map((ele) => {
                    allowedList.push({ label: ele, value: ele });
                });
            } else {
                metadataProp.options.map((ele) => {
                    allowedList.push({ text: ele, value: ele });
                });
            }
        }
        return allowedList;
    };

    /**
     * Checks the PKCE options.
     *
     * @param {OAuth2PKCEConfigurationInterface} pckeConfig - PKCE config.
     * @return {string[]}
     */
    const findPKCE = (pckeConfig: OAuth2PKCEConfigurationInterface): string[] => {
        const selectedValues = [];
        if (pckeConfig.mandatory) {
            selectedValues.push("mandatory");
        }
        if (pckeConfig.supportPlainTransformAlgorithm) {
            selectedValues.push("supportPlainTransformAlgorithm");
        }
        return selectedValues;
    };

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        const formValues = {
            accessToken: {
                applicationAccessTokenExpiryInSeconds: Number(metadata.defaultApplicationAccessTokenExpiryTime),
                type: values.get("type"),
                userAccessTokenExpiryInSeconds: Number(values.get("userAccessTokenExpiryInSeconds")),
            },
            allowedOrigins: [],
            callbackURLs: [buildCallBackUrlWithRegExp(callBackUrls)],
            grantTypes: values.get("grant"),
            idToken: {
                audience: [values.get("audience")],
                encryption: {
                    algorithm: isEncryptionEnabled ?
                        values.get("algorithm") : metadata.idTokenEncryptionAlgorithm.defaultValue,
                    enabled: values.get("encryption").includes("enableEncryption"),
                    method: isEncryptionEnabled ?
                        values.get("method") : metadata.idTokenEncryptionMethod.defaultValue
                },
                expiryInSeconds: Number(values.get("idExpiryInSeconds"))
            },
            logout: {
                backChannelLogoutUrl: values.get("backChannelLogoutUrl"),
                frontChannelLogoutUrl: values.get("frontChannelLogoutUrl")
            },
            pkce: {
                mandatory: values.get("PKCE").includes("mandatory"),
                supportPlainTransformAlgorithm: !!values.get("PKCE").includes("supportPlainTransformAlgorithm")
            },
            publicClient: values.get("supportPublicClients").length > 1,
            refreshToken: {
                expiryInSeconds: parseInt(values.get("expiryInSeconds"), 10),
                renewRefreshToken: values.get("RefreshToken").length > 1
            },
            scopeValidators: values.get("scopeValidator"),
            validateRequestObjectSignature: values.get("enableRequestObjectSignatureValidation").length > 1
        };

        // If the app is newly created do not add `clientId` & `clientSecret`.
        if (!values.get("clientId") || !values.get("clientSecret")) {
            return formValues;
        }

        return {
            ...formValues,
            clientId: values.get("clientId"),
            clientSecret: values.get("clientSecret"),
        };
    };

    useEffect(
        () => {
            if (initialValues?.idToken?.encryption) {
                setEncryptionEnable(initialValues.idToken.encryption?.enabled);
            }
        }, [initialValues]
    );

    return (
        <>
            { metadata && (
                <Forms
                    onSubmit={ (values) => {
                        if (isEmpty(callBackUrls)) {
                            setShowURLError(true);
                        } else {
                            onSubmit(updateConfiguration(values));
                        }
                    } }
                >
                    <Grid>
                        {
                            initialValues.clientId && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Field
                                            name="clientId"
                                            label="Client ID"
                                            required={ false }
                                            requiredErrorMessage=""
                                            placeholder="Enter Client ID"
                                            type="text"
                                            value={ initialValues.clientId }
                                            readOnly
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            initialValues.clientSecret && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Field
                                            name="clientSecret"
                                            label="Client Secret"
                                            hidePassword="Hide secret"
                                            showPassword="Show secret"
                                            required={ false }
                                            requiredErrorMessage="this is needed"
                                            placeholder="Enter Client Secret"
                                            type="password"
                                            value={ initialValues.clientSecret }
                                            readOnly
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="grant"
                                    label="Allowed grant type"
                                    type="checkbox"
                                    required={ true }
                                    requiredErrorMessage="Select at least a  grant type"
                                    children={ getAllowedList(metadata.allowedGrantTypes, true, true) }
                                    value={ initialValues.grantTypes }
                                />
                                <Hint>This will determine how the application communicates with the token service</Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <URLInputComponent
                            urlState={ callBackUrls }
                            setURLState={ setCallBackUrls }
                            labelName={ "Callback URL" }
                            value={ buildCallBackURLWithSeparator(initialValues.callbackURLs?.toString()) }
                            placeholder={ "Enter callbackUrl" }
                            validationErrorMsg={ "Please add valid URL." }
                            validation={ (value: string) => {
                                if (FormValidation.url(value)) {
                                    return true;
                                }
                                return false;
                            } }
                            showError={ showURLError }
                            setShowError={ setShowURLError }
                            hint={ " After the authentication, we will only redirect to the above callback URLs " +
                            "and you can specify multiple URLs" }
                        />
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="allowedOrigins"
                                    label="Allowed Origins"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("This is not a valid URL");
                                        }
                                    } }
                                    required={ false }
                                    requiredErrorMessage="this is not needed"
                                    placeholder="Enter the Allowed Origins"
                                    type="text"
                                    value={ initialValues.allowedOrigins?.toString() }
                                />
                                <Hint>
                                    Certain origins can be whitelisted to allowed cross origin requests. Enter a list
                                    of URL separated by commas. E.g. https://app.example.com/js.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="supportPublicClients"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={ initialValues.publicClient ? [ "supportPublicClients" ] : [] }
                                    children={ [
                                        {
                                            label: "Public Client",
                                            value: "supportPublicClients"
                                        }
                                    ] }
                                />
                                <Hint>
                                    Allow the client to authenticate without a client secret.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>

                        { /* PKCE */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">PKCE</Heading>
                                <Hint>
                                    PKCE (RFC 7636) is an extension to the Authorization Code flow to prevent certain
                                    attacks and to be able to securely perform the OAuth exchange from public clients.
                                </Hint>
                                <Divider hidden />
                                <Field
                                    name="PKCE"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={ findPKCE(initialValues.pkce) }
                                    children={ [
                                        {
                                            label: "PKCE mandatory",
                                            value: "mandatory"
                                        },
                                        {
                                            label: "Support PKCE 'Plain' Transform Algorithm",
                                            value: "supportPlainTransformAlgorithm"
                                        },
                                    ] }
                                />
                            </Grid.Column>
                        </Grid.Row>

                        { /* Access Token */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Access Token</Heading>
                                <Hint>
                                    Configure the access token issuer, user access token expiry time, application access
                                    token expiry time etc.
                                </Hint>
                                <Divider hidden />
                                <Field
                                    label="Token type"
                                    name="type"
                                    default={ initialValues.accessToken ? initialValues.accessToken.type
                                        : metadata.accessTokenType.defaultValue }
                                    type="radio"
                                    children={ getAllowedList(metadata.accessTokenType, true) }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                <Field
                                    name="userAccessTokenExpiryInSeconds"
                                    label="User access token expiry time"
                                    required={ true }
                                    requiredErrorMessage="Please fill the user access token expiry time"
                                    value={ initialValues.accessToken ?
                                        initialValues.accessToken.userAccessTokenExpiryInSeconds.toString() :
                                        metadata.defaultUserAccessTokenExpiryTime }
                                    placeholder="Enter the user access token expiry time "
                                    type="number"
                                />
                                <Hint>Configure the user access token expiry time (in seconds).</Hint>
                            </Grid.Column>
                        </Grid.Row>
                        {/* TODO  Enable this option in future*/ }
                        {/*<Grid.Row columns={ 1 }>*/ }
                        {/*    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>*/ }
                        {/*        <Field*/ }
                        {/*            name="applicationAccessTokenExpiryInSeconds"*/ }
                        {/*            label="Application access token expiry time"*/ }
                        {/*            required={ true }*/ }
                        {/*            requiredErrorMessage="Please fill the application access token expiry time"*/ }
                        {/*            value={ initialValues.accessToken ?*/ }
                        {/*                initialValues.accessToken.
                        applicationAccessTokenExpiryInSeconds.toString() :*/ }
                        {/*                metadata.defaultApplicationAccessTokenExpiryTime }*/ }
                        {/*            placeholder="Enter the application access token expiry time "*/ }
                        {/*            type="number"*/ }
                        {/*        />*/ }
                        {/*        <Hint>Configure the application access token expiry time (in seconds).</Hint>*/ }
                        {/*    </Grid.Column>*/ }
                        {/*</Grid.Row>*/ }

                        { /* Refresh Token */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Refresh Token</Heading>
                                <Divider hidden />
                                <Field
                                    name="RefreshToken"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={ initialValues.refreshToken?.renewRefreshToken ? [ "refreshToken" ] : [] }
                                    children={ [
                                        {
                                            label: "Renew Refresh Token",
                                            value: "refreshToken"
                                        },
                                    ] }
                                />
                                <Hint>Issue a new refresh token per request when Refresh Token Grant is used.</Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                <Field
                                    name="expiryInSeconds"
                                    label="Refresh Token Expiry Time"
                                    required={ true }
                                    requiredErrorMessage="Please fill the refresh token expiry time"
                                    placeholder="Enter the refresh token expiry time"
                                    value={ initialValues.refreshToken ?
                                        initialValues.refreshToken.expiryInSeconds.toString() :
                                        metadata.defaultRefreshTokenExpiryTime }
                                    type="number"
                                />
                                <Hint>Configure the refresh token expiry time (in seconds).</Hint>
                            </Grid.Column>
                        </Grid.Row>

                        { /* ID Token */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">ID Token</Heading>
                                <Divider hidden />
                                <Field
                                    name="audience"
                                    label="Audience"
                                    required={ false }
                                    requiredErrorMessage="Please fill the audience"
                                    placeholder="Enter Audience"
                                    value={ initialValues.idToken?.audience.toString() }
                                    type="textarea"
                                />
                                <Hint>The recipients that the ID token is intended for.</Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="encryption"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    listen={
                                        (values) => {
                                            setEncryptionEnable(
                                                values.get("encryption").includes("enableEncryption") ?
                                                    true : false
                                            );
                                        }
                                    }
                                    value={ initialValues.idToken?.encryption.enabled ? [ "enableEncryption" ] : [] }
                                    children={ [
                                        {
                                            label: "Enable encryption",
                                            value: "enableEncryption"
                                        },
                                    ] }
                                />
                                <Hint>Enable ID token encryption.</Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="algorithm"
                                    label="Algorithm"
                                    required={ isEncryptionEnabled }
                                    requiredErrorMessage="this is needed"
                                    type="dropdown"
                                    default={ initialValues.idToken ? initialValues.idToken.encryption.algorithm :
                                        metadata.idTokenEncryptionAlgorithm.defaultValue }
                                    placeholder="Select Algorithm"
                                    children={ getAllowedList(metadata.idTokenEncryptionAlgorithm) }
                                    disabled={ !isEncryptionEnabled }
                                />
                                <Hint disabled={ !isEncryptionEnabled }>
                                    Choose encryption algorithm of ID token for the client.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="method"
                                    label="Encryption method"
                                    required={ isEncryptionEnabled }
                                    requiredErrorMessage="this is needed"
                                    type="dropdown"
                                    default={ initialValues.idToken ? initialValues.idToken.encryption.method :
                                        metadata.idTokenEncryptionMethod.defaultValue }
                                    placeholder="Select Method"
                                    children={ getAllowedList(metadata.idTokenEncryptionMethod) }
                                    disabled={ !isEncryptionEnabled }
                                />
                                <Hint disabled={ !isEncryptionEnabled }>
                                    Choose the method for the ID token encryption.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 }>
                                <Field
                                    name="idExpiryInSeconds"
                                    label="Id Token Expiry Time"
                                    required={ true }
                                    requiredErrorMessage="Please fill the ID token expiry time"
                                    placeholder="Enter the ID token expiry time"
                                    value={ initialValues.idToken ? initialValues.idToken.expiryInSeconds.toString() :
                                        metadata.defaultIdTokenExpiryTime }
                                    type="number"
                                />
                                <Hint>Configure the ID token expiry time (in seconds).</Hint>
                            </Grid.Column>
                        </Grid.Row>

                        { /* Logout */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Logout URLs</Heading>
                                <Divider hidden />
                                <Field
                                    name="backChannelLogoutUrl"
                                    label="Back Channel Logout Url"
                                    required={ false }
                                    requiredErrorMessage="Please fill the Back Channel Logout Url"
                                    placeholder="Enter the Back Channel Logout Url"
                                    type="text"
                                    value={ initialValues.logout?.backChannelLogoutUrl }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="frontChannelLogoutUrl"
                                    label="Front Channel Logout Url"
                                    required={ false }
                                    requiredErrorMessage="Please fill the Front Channel Logout Url"
                                    placeholder="Enter the Front Channel Logout Url"
                                    type="text"
                                    value={ initialValues.logout?.frontChannelLogoutUrl }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="enableRequestObjectSignatureValidation"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={ initialValues.validateRequestObjectSignature ?
                                        [ "EnableRequestObjectSignatureValidation" ] : [] }
                                    children={ [
                                        {
                                            label: "Enable Request Object Signature Validation",
                                            value: "EnableRequestObjectSignatureValidation"
                                        }
                                    ] }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        { /* Scope Validators */ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider />
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Scope validators</Heading>
                                <Divider hidden />
                                <Field
                                    name="scopeValidator"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={ initialValues.scopeValidators }
                                    children={ getAllowedList(metadata.scopeValidators, true) }
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
            )
            }
        </>
    );
};

/**
 * Default props for the Inbound OIDC form component.
 */
InboundOIDCForm.defaultProps = {
    initialValues: emptyOIDCConfig
};
