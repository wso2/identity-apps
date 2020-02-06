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
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import { getOIDCData, getOIDCMetadata, updateOIDCData } from "../../api/application";
import {
    MetadataPropertyInterface,
    OAuth2PKCEConfigurationInterface,
    OIDCDataInterface,
    OIDCMetadataInterface
} from "../../models";

interface OIDCFormProps {
    cancelView?: any;
    appId: string;
}

/**
 * OIDC protocol configurations.
 *
 * @param props OIDCFormProps
 */
export const OIDCForm: FunctionComponent<OIDCFormProps> = (props): JSX.Element => {

    const {
        cancelView,
        appId
    } = props;

    const [metadata, setMetadata] = useState<OIDCMetadataInterface>();

    const [inboundData, setInboundData] = useState<OIDCDataInterface>();

    const getMetadata = () => {
        getOIDCMetadata()
            .then((response) => {
                setMetadata(response);
            })
            .catch((error) => {
                // TODO add notifications
            });
    };

    const getInboundData = (id: string) => {
        getOIDCData(id)
            .then((response) => {
                setInboundData(response);
            })
            .catch((error) => {
                // TODO add notifications
            });
    };

    const updateInboundData = (id: string, data: object) => {
        updateOIDCData(id, data)
            .then((response) => {
            })
            .catch((error) => {
                // TODO add notifications
            });
    };

    // Add regexp to multiple callbackUrls and update configs
    const buildCallBackUrl = (urls: string): string => {
        let callbackURL = urls.replace(/['"]+/g, "");
        if (callbackURL.split(",").length > 1) {
            callbackURL = "regexp=(" + callbackURL + ")";
        }
        return callbackURL;
    };

    // Remove regexp from incoming data and show the callbackUrls.
    const buildFormCallBackURL = (url: string): string => {
        if (url.includes("regexp=(")) {
            url = url.replace("regexp=(", "");
            url = url.replace(")", "");
        }
        return url;
    }

    // Maps meta data grant types and configuration grant types
    const makeGrantTypeReadable = (grant: string) => {
        if ("urn:ietf:params:oauth:grant-type:device_code" === grant) {
            return { label: "Device Code", value: grant };
        } else if ("urn:ietf:params:oauth:grant-type:uma-ticket" === grant) {
            return { label: "UMA Ticket ", value: grant };
        } else if ("account_switch" === grant) {
            return { label: "Account Switch", value: grant };
        } else if ("urn:ietf:params:oauth:grant-type:jwt-bearer" === grant) {
            return { label: "JWT Bearer", value: grant };
        } else if ("Code" === grant) {
            return { label: grant, value: "authorization_code" };
        } else if ("Refresh Token" === grant) {
            return { label: grant, value: "refresh_token" };
        } else if ("SAML2" === grant) {
            return { label: grant, value: "urn:ietf:params:oauth:grant-type:saml2-bearer" };
        } else if ("Implicit" === grant) {
            return { label: grant, value: "implicit" };
        } else if ("Password" === grant) {
            return { label: grant, value: "password" };
        } else if ("Client Credential" === grant) {
            return { label: grant, value: "client_credentials" };
        } else if ("IWA-NTLM" === grant) {
            return { label: grant, value: "iwa:ntlm" };
        } else {
            return { label: grant, value: grant };
        }
    };

    // Creates options for Radio & dropdown using MetadataPropertyInterface options
    const getAllowedList = (metadataProp: MetadataPropertyInterface, isLabel?: boolean, isGrant?: boolean) => {
        const allowedList = [];
        if (metadata) {
            if (isGrant) {
                metadataProp.options.map((ele) => {
                    allowedList.push(makeGrantTypeReadable(ele));
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

    // Checks the PKCE options.
    const findPKCE = (pckeConfig: OAuth2PKCEConfigurationInterface): string[] => {
        const selectedValues = []
        if (pckeConfig.mandatory) {
            selectedValues.push("mandatory");
        }
        if (pckeConfig.supportPlainTransformAlgorithm) {
            selectedValues.push("supportPlainTransformAlgorithm");
        }
        return selectedValues;
    };

    useEffect(() => {
        getMetadata();
        getInboundData(appId);
    }, []);

    const handleSubmit = (values) => {
        updateInboundData(appId, updateConfiguration(values));
        cancelView();
    };

    // Maps submitted values to OIDC protocol data.
    const updateConfiguration = (values) => {

        return {
            accessToken: {
                applicationAccessTokenExpiryInSeconds: Number(values.get("applicationAccessTokenExpiryInSeconds")),
                type: values.get("type"),
                userAccessTokenExpiryInSeconds: Number(values.get("userAccessTokenExpiryInSeconds")),
            },
            allowedOrigins: [],  // TODO check this availability
            callbackURLs: [values.get("callbackURL")],
            clientId: inboundData.clientId,
            clientSecret: inboundData.clientSecret,
            grantTypes: values.get("grant"),
            idToken: {
                audience: [values.get("audience")],
                encryption: {
                    algorithm: values.get("algorithm"),
                    enabled: (values.get("encryption").length > 1 ? true : false),
                    method: values.get("method")
                },
                expiryInSeconds: Number(values.get("idExpiryInSeconds"))
            },
            logout: {
                backChannelLogoutUrl: values.get("backChannelLogoutUrl"),
                frontChannelLogoutUrl: values.get("frontChannelLogoutUrl")
            },
            pkce: {
                mandatory: (values.get("PKCE").includes("mandatory") ? true : false),

                supportPlainTransformAlgorithm:
                    (values.get("PKCE").includes("supportPlainTransformAlgorithm") ? true : false)
            },
            publicClient: (values.get("supportPublicClients").length > 1 ? true : false),
            refreshToken: {
                expiryInSeconds: Number(values.get("expiryInSeconds")),
                renewRefreshToken: values.get("RefreshToken").length > 1 ? true : false
            },
            scopeValidators: values.get("scopeValidator"),
            state: inboundData.state,
            validateRequestObjectSignature:
                values.get("enableRequestObjectSignatureValidation").length > 1 ? true : false
        };
    }

    return (
        <>
            { metadata && inboundData ?
                (
                    <Forms
                        onSubmit={ (values) => {
                            const newValues = new Map(values)
                            newValues.set("callbackURL", buildCallBackUrl(values.get("callbackURL").toString()))
                            handleSubmit(newValues);
                        } }
                    >
                        <Grid className={ "protocolForm" }>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 } className="protocolColumn">
                                    <Field
                                        name="Client ID"
                                        label="clientID"
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        placeholder="Enter Client ID"
                                        type="text"
                                        value={ inboundData.clientId }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 } className="protocolColumn">
                                    <Field
                                        name="Client Secret"
                                        label="clientSecret"
                                        hidePassword="Hide password"
                                        showPassword="Show password"
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        placeholder="Enter Client ID"
                                        type="password"
                                        value={ inboundData.clientSecret }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 } className="protocolColumn">
                                    <Field
                                        label="Allowed Grant Types"
                                        name="grant"
                                        type="checkbox"
                                        required={ true }
                                        requiredErrorMessage="select at least a  grant type"
                                        children={ getAllowedList(metadata.allowedGrantTypes, true, true) }
                                        value={ inboundData.grantTypes }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Field
                                        name="callbackURL"
                                        label="CallbackURL"
                                        required={ true }
                                        requiredErrorMessage="this is needed"
                                        placeholder="Enter the CallbackURL"
                                        type="text"
                                        value={ buildFormCallBackURL(inboundData.callbackURLs.toString()) }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className={ "protocolRow" }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
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
                                        value={ inboundData.allowedOrigins.toString() }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Field
                                        name="supportPublicClients"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        type="checkbox"
                                        value={ inboundData.publicClient ? ["supportPublicClients"] : [] }
                                        children={ [
                                            {
                                                label: "Support Public Clients",
                                                value: "supportPublicClients"
                                            }
                                        ] }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Header as="h5" className="sub-heading">PKCE</Header>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Field
                                        name="PKCE"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        type="checkbox"
                                        value={ findPKCE(inboundData.pkce) }
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
                            <Header as="h5" className="sub-heading">Access Token</Header>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 9 } className="protocolColumn">
                                    <Field
                                        label="Type"
                                        name="type"
                                        default={ inboundData.accessToken ? inboundData.accessToken.type
                                            : metadata.accessTokenType.defaultValue }
                                        type="radio"
                                        children={ getAllowedList(metadata.accessTokenType, true) }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 } className="protocolColumn">
                                    <Field
                                        name="userAccessTokenExpiryInSeconds"
                                        label="User Access Token Expiry Time"
                                        required={ true }
                                        requiredErrorMessage="Please fill the user access token expiry time"
                                        value={ inboundData.accessToken ?
                                            inboundData.accessToken.userAccessTokenExpiryInSeconds.toString() :
                                            metadata.defaultUserAccessTokenExpiryTime }
                                        placeholder="Enter the user access token expiry time "
                                        type="number"
                                    />
                                </Grid.Column>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 } className="protocolColumn">
                                    <Field
                                        name="applicationAccessTokenExpiryInSeconds"
                                        label="User Access Token Expiry Time"
                                        required={ true }
                                        requiredErrorMessage="Please fill the access token expiry time"
                                        placeholder="Enter the access token expiry time"
                                        value={ inboundData.accessToken ?
                                            inboundData.accessToken.applicationAccessTokenExpiryInSeconds.toString() :
                                            metadata.defaultApplicationAccessTokenExpiryTime }
                                        type="number"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Header as="h5" className="sub-heading">Refresh Token</Header>
                            <Grid.Row columns={ 2 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 } className="protocolColumn">
                                    <Field
                                        name="RefreshToken"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        type="checkbox"
                                        value={ inboundData.refreshToken.renewRefreshToken ? ["refreshToken"] : [] }
                                        children={ [
                                            {
                                                label: "Renew Refresh Token",
                                                value: "refreshToken"
                                            },
                                        ] }
                                    />
                                </Grid.Column>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 } className="protocolColumn">
                                    <Field
                                        name="expiryInSeconds"
                                        label="Refresh Token Expiry Time"
                                        required={ true }
                                        requiredErrorMessage="Please fill the refresh token expiry time"
                                        placeholder="Enter the refresh token expiry time"
                                        value={ inboundData.refreshToken ?
                                            inboundData.refreshToken.expiryInSeconds.toString() :
                                            metadata.defaultRefreshTokenExpiryTime }
                                        type="number"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Header as="h5" className="sub-heading">ID Token</Header>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 } className="protocolColumn">
                                    <Field
                                        name="audience"
                                        label="Audience"
                                        required={ false }
                                        requiredErrorMessage="Please fill the audience"
                                        placeholder="Enter Audience"
                                        value={ inboundData.idToken.audience.toString() }
                                        type="textarea"
                                    />
                                    <Field
                                        name="encryption"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        type="checkbox"
                                        value={ inboundData.idToken.encryption.enabled ? ["enableEncryption"] : [] }
                                        children={ [
                                            {
                                                label: "Enable",
                                                value: "enableEncryption"
                                            },
                                        ] }
                                    />
                                    <Field
                                        name="algorithm"
                                        label="Algorithm"
                                        required={ true }
                                        requiredErrorMessage="this is needed"
                                        type="dropdown"
                                        default={ inboundData.idToken ? inboundData.idToken.encryption.algorithm :
                                            metadata.idTokenEncryptionAlgorithm.defaultValue }
                                        placeholder="Select Algorithm"
                                        children={ getAllowedList(metadata.idTokenEncryptionAlgorithm) }
                                    />
                                    <Field
                                        name="method"
                                        label="Method"
                                        required={ true }
                                        requiredErrorMessage="this is needed"
                                        type="dropdown"
                                        default={ inboundData.idToken ? inboundData.idToken.encryption.method :
                                            metadata.idTokenEncryptionMethod.defaultValue }
                                        placeholder="Select Method"
                                        children={ getAllowedList(metadata.idTokenEncryptionMethod) }
                                    />
                                </Grid.Column>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 5 } className="protocolColumn">
                                    <Field
                                        name="idExpiryInSeconds"
                                        label="Id Token Expiry Time"
                                        required={ true }
                                        requiredErrorMessage="Please fill the ID token expiry time"
                                        placeholder="Enter the ID token expiry time"
                                        value={ inboundData.idToken ? inboundData.idToken.expiryInSeconds.toString() :
                                            metadata.defaultIdTokenExpiryTime }
                                        type="number"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Header as="h5" className="sub-heading">Logout</Header>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Field
                                        name="backChannelLogoutUrl"
                                        label="Back Channel Logout Url"
                                        required={ false }
                                        requiredErrorMessage="Please fill the Back Channel Logout Url"
                                        placeholder="Enter the Back Channel Logout Url"
                                        type="text"
                                        value={ inboundData.logout.backChannelLogoutUrl }
                                    />
                                    <Field
                                        name="frontChannelLogoutUrl"
                                        label="Front Channel Logout Url"
                                        required={ false }
                                        requiredErrorMessage="Please fill the Front Channel Logout Url"
                                        placeholder="Enter the Front Channel Logout Url"
                                        type="text"
                                        value={ inboundData.logout.frontChannelLogoutUrl }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Field
                                        name="enableRequestObjectSignatureValidation"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        type="checkbox"
                                        value={ inboundData.validateRequestObjectSignature ?
                                            ["EnableRequestObjectSignatureValidation"] : [] }
                                        children={ [
                                            {
                                                label: "Enable Request Object Signature Validation",
                                                value: "EnableRequestObjectSignatureValidation"
                                            }
                                        ] }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Header as="h5" className="sub-heading">Scope Validators</Header>
                            <Grid.Row columns={ 1 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 } className="protocolColumn">
                                    <Field
                                        name="scopeValidator"
                                        label=""
                                        required={ false }
                                        requiredErrorMessage="this is needed"
                                        type="checkbox"
                                        value={ inboundData.scopeValidators }
                                        children={ getAllowedList(metadata.scopeValidators, true) }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 } className="protocolRow">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }/>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 6 } className="protocolColumn">
                                    <Button primary type="submit" size="small" className="form-button">
                                        submit
                                    </Button>
                                    <Button
                                        className="link-button form-button"
                                        onClick={ cancelView }
                                        size="small"
                                    >
                                        cancel
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Forms>
                ) :
                (
                    <Grid>
                        <Grid.Row columns={ 2 } className="protocolRow">
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }/>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 6 } className="protocolColumn">
                                <Button
                                    className="link-button form-button"
                                    onClick={ cancelView }
                                    size="small"
                                >
                                    cancel
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
        </>
    );
};
