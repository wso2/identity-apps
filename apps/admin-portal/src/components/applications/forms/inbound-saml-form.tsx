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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Divider, Grid } from "semantic-ui-react";
import {
    LogoutMethods,
    MetadataPropertyInterface,
    SAML2ServiceProviderInterface,
    SAMLAttributeProfileInterface,
    SAMLMetaDataInterface
} from "../../../models";
import { Heading, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { URLInputComponent } from "../components";
import { isEmpty } from "lodash";

interface InboundSAMLFormPropsInterface {
    initialValues: SAML2ServiceProviderInterface;
    metadata: SAMLMetaDataInterface;
    onSubmit: (values: any) => void;
}

/**
 * Inbound SAML configurations.
 *
 * @param props InboundSAMLFormPropsInterface
 */
export const InboundSAMLForm: FunctionComponent<InboundSAMLFormPropsInterface> = (
    props
): ReactElement => {

    const {
        initialValues,
        metadata,
        onSubmit
    } = props;

    // creates dropdown options
    const getAllowedOptions = (metadataProp: MetadataPropertyInterface, isLabel?: boolean) => {
        const allowedOptions = [];
        if (metadata) {
            if (isLabel) {
                metadataProp.options.map((ele) => {
                    allowedOptions.push({ label: ele, value: ele });
                });
            } else {
                metadataProp.options.map((ele) => {
                    allowedOptions.push({ text: ele, value: ele, key: metadataProp.options.indexOf(ele) });
                });
            }
        }
        return allowedOptions;
    };

    const createDefaultAssertionConsumerUrl = () => {
        const allowedOptions = [];
        if (!isEmpty(assertionConsumerUrls)) {
            const assertionUrlArray = assertionConsumerUrls.split(",");
            assertionUrlArray.map((url) => {
                allowedOptions.push({ text: url, value: url, key: assertionUrlArray.indexOf(url) });
            })
        }
        return allowedOptions;
    };

    // State to manage the URLS
    const [assertionConsumerUrls, setAssertionConsumerUrls] = useState("");
    const [audiences, setAudiences] = useState("");
    const [recipients, setRecipients] = useState("");
    const [returnToURLS, setReturnToURLS] = useState("");

    const [showAssertionConsumerUrlError, setAssertionConsumerUrlError] = useState(false);
    const [showAudienceError, setAudienceError] = useState(false);
    const [showRecipientsError, setRecipientsError] = useState(false);
    const [returnToURLSError, setReturnToURLSError] = useState(false);

    // State to enable profiles
    const [isSingleLogoutProfileEnabled, setIsSingleLogoutProfileEnabled] = useState(false);
    const [isIdpInitiatedSingleLogoutEnabled, setIsIdpInitiatedSingleLogoutEnabled] = useState(false);
    const [isAttributeProfileEnabled, setIsAttributeProfileEnabled] = useState(false);
    const [isResponseSigningEnabled, setIsResponseSigningEnabled] = useState(false);
    const [isRequestSignatureValidationEnabled, setIsRequestSignatureValidationEnabled] = useState(false);
    const [isAssertionEncryptionEnabled, setAssertionEncryptionEnabled] = useState(false);

    const updateConfiguration = (values) => {

        return {
            manualConfiguration: {
                issuer: values.get("issuer"),
                assertionConsumerUrls: assertionConsumerUrls.split(","),
                serviceProviderQualifier: values.get("applicationQualifier"),
                defaultAssertionConsumerUrl: values.get("defaultAssertionConsumerUrl"),
                idpEntityIdAlias: values.get("idpEntityIdAlias"),
                singleSignOnProfile: {
                    bindings: values.get("bindings"),
                    enableSignatureValidationForArtifactBinding:
                        values.get("signatureValidationForArtifactBinding")
                            .includes("enableSignatureValidationForArtifactBinding"),
                    attributeConsumingServiceIndex: values.get("attributeConsumingServiceIndex"),
                    enableIdpInitiatedSingleSignOn: values.get("idPInitiatedSSO").includes("enableIdPInitiatedSSO"),
                    assertion: {
                        nameIdFormat: values.get("nameIdFormat"),
                        audiences: audiences.split(","),
                        recipients: recipients.split(","),
                        digestAlgorithm: values.get("digestAlgorithm"),
                        encryption: {
                            enabled: values.get("assertionEncryption").includes("enableAssertionEncryption"),
                            assertionEncryptionAlgorithm: values.get("assertionEncryptionAlgorithm"),
                            keyEncryptionAlgorithm: values.get("keyEncryptionAlgorithm")
                        }
                    }
                },
                attributeProfile: {
                    enabled: values.get("attributeProfile").includes("enabled"),
                    alwaysIncludeAttributesInResponse: values.get("includeAttributesInResponse")
                        .includes("alwaysIncludeAttributesInResponse")
                },
                singleLogoutProfile: {
                    enabled: values.get("singleLogoutProfile").includes("enabled"),
                    logoutResponseUrl: values.get("singleLogoutResponseUrl"),
                    logoutMethod: values.get("logoutMethod"),
                    idpInitiatedSingleLogout: {
                        enabled: values.get("idpInitiatedSingleLogout").includes("enabled"),
                        returnToUrls: returnToURLS.split(",")
                    }
                },
                requestValidation: {
                    enableSignatureValidation: values.get("requestSignatureValidation")
                        .includes("enableSignatureValidation"),
                    signatureValidationCertAlias: values.get("signatureValidationCertAlias")
                },
                responseSigning: {
                    enabled: values.get("responseSigning").includes("enabled"),
                    signingAlgorithm: values.get("signingAlgorithm")
                },
                enableAssertionQueryProfile: values.get("assertionQueryProfile").includes("enableAssertionQueryProfile")
            }
        }
    };

    useEffect(
        () => {
            if (initialValues) {
                setIsSingleLogoutProfileEnabled(initialValues?.singleLogoutProfile.enabled);
                setIsIdpInitiatedSingleLogoutEnabled(initialValues?.singleLogoutProfile.idpInitiatedSingleLogout.enabled);
                setIsAttributeProfileEnabled(initialValues?.attributeProfile.enabled);
                setIsRequestSignatureValidationEnabled(initialValues?.requestValidation.enableSignatureValidation);
                setIsResponseSigningEnabled(initialValues?.responseSigning.enabled);
                setAssertionEncryptionEnabled(initialValues?.singleSignOnProfile.assertion.encryption.enabled)
            }
        }, [initialValues]
    );

    return (
        metadata ?
            (
                <Forms
                    onSubmit={ (values) => {
                        if (isEmpty(assertionConsumerUrls)) {
                            setAssertionConsumerUrlError(true);
                        } else {
                            onSubmit(updateConfiguration(values));
                        }
                    } }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="issuer"
                                    label="Issuer"
                                    required={ true }
                                    requiredErrorMessage="Please provide the issuer"
                                    type="text"
                                    placeholder={ "Enter the issuer name" }
                                    value={ initialValues?.issuer }
                                    readOnly={ !isEmpty(initialValues?.issuer) }
                                />
                                <Hint>
                                    This specifies the issuer. This is the "saml:Issuer" element that contains
                                    the unique identifier of the Application. This is also the issuer value
                                    specified in the SAML Authentication Request issued by the Application.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="applicationQualifier"
                                    label="Application Qualifier"
                                    required={ false }
                                    requiredErrorMessage="This is needed"
                                    type="text"
                                    placeholder={ "Enter the application qualifier" }
                                    value={ initialValues?.serviceProviderQualifier }
                                />
                                <Hint>
                                    This value is needed only if you have to configure multiple SAML SSO
                                    inbound authentication configurations for the same Issuer value. Qualifier
                                    that is defined here will be appended to the issuer internally to
                                    identify a application uniquely at runtime.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <URLInputComponent
                            urlState={ assertionConsumerUrls }
                            setURLState={ setAssertionConsumerUrls }
                            labelName={ "Assertion Consumer URLs" }
                            value={ initialValues?.assertionConsumerUrls.toString() }
                            placeholder={ "Enter url " }
                            validationErrorMsg={ "Please add valid URL" }
                            validation={ (value: string) => {
                                if (FormValidation.url(value)) {
                                    return true;
                                }
                                return false;
                            } }
                            required={ true }
                            showError={ showAssertionConsumerUrlError }
                            setShowError={ setAssertionConsumerUrlError }
                            hint={ "This specifies the assertion Consumer URLs that the browser " +
                            "should be redirected to after the authentication is successful. " +
                            "This is the Assertion Consumer Service (ACS) URL of the Application." }
                        />
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Default Assertion consumer Url"
                                    name="defaultAssertionConsumerUrl"
                                    type="dropdown"
                                    required={ true }
                                    requiredErrorMessage="This is needed"
                                    default={
                                        !isEmpty(assertionConsumerUrls) &&
                                        assertionConsumerUrls.split(",").slice(-1)[0]
                                    }
                                    children={ createDefaultAssertionConsumerUrl() }
                                />
                                <Hint>
                                    As there can be multiple assertion consumer URLs, you must define a
                                    Default Assertion Consumer URL in case you are unable to retrieve
                                    it from the authentication request.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Idp EntityId Alias"
                                    name="idpEntityIdAlias"
                                    placeholder={ "Enter alias" }
                                    type="text"
                                    required={ false }
                                    requiredErrorMessage="This is needed"
                                    value={ initialValues?.idpEntityIdAlias }
                                />
                                <Hint>
                                    This value can override identity provider entity Id that is specified under
                                    SAML SSO inbound authentication configuration of the resident identity provider.
                                    The Identity Provider Entity Id is used as the issuer of
                                    the SAML response that is generated.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>

                        {/*Request Validation*/ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider/>
                                <Divider hidden/>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Request Validation</Heading>
                                <Divider hidden/>
                                <Field
                                    name="requestSignatureValidation"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    listen={
                                        (values) => {
                                            setIsRequestSignatureValidationEnabled(
                                                values.get("requestSignatureValidation")
                                                    .includes("enableSignatureValidation")
                                            )
                                        }
                                    }
                                    value={
                                        initialValues?.requestValidation.enableSignatureValidation ?
                                            ["enableSignatureValidation"] : []
                                    }
                                    children={ [
                                        {
                                            label: "Enable Request Signature Validation",
                                            value: "enableSignatureValidation"
                                        },
                                    ] }
                                />
                                <Hint>
                                    This specifies whether the identity provider must validate the signature of
                                    the SAML2 authentication request and the SAML2 logout request
                                    that are sent by the application.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Request Validation Certificate Alias"
                                    name="signatureValidationCertAlias"
                                    type="dropdown"
                                    required={ false }
                                    disabled={ !isRequestSignatureValidationEnabled }
                                    value={ initialValues?.requestValidation.signatureValidationCertAlias }
                                    requiredErrorMessage="This is needed"
                                    default={ metadata?.certificateAlias.defaultValue }
                                    children={ getAllowedOptions(metadata?.certificateAlias) }
                                />
                                <Hint disabled={ !isRequestSignatureValidationEnabled }>
                                    If application certificate is provided then it will be used and above selected
                                    certificate will be ignored.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>

                        {/*Response/Assertion Signing*/ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider/>
                                <Divider hidden/>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Assertion/Response Signing</Heading>
                                <Divider hidden/>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Field
                                        label="Digest Algorithm"
                                        name="digestAlgorithm"
                                        type="dropdown"
                                        required={ false }
                                        requiredErrorMessage="This is needed"
                                        default={ metadata?.responseDigestAlgorithm.defaultValue }
                                        value={ initialValues?.singleSignOnProfile.assertion.digestAlgorithm }
                                        children={ getAllowedOptions(metadata?.responseDigestAlgorithm) }

                                    />
                                </Grid.Column>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Signing Algorithm"
                                    name="signingAlgorithm"
                                    type="dropdown"
                                    required={ false }
                                    value={ initialValues?.responseSigning.signingAlgorithm }
                                    requiredErrorMessage="This is needed"
                                    default={ metadata?.responseSigningAlgorithm.defaultValue }
                                    children={ getAllowedOptions(metadata?.responseSigningAlgorithm) }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="responseSigning"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={ initialValues?.responseSigning.enabled ? ["enabled"] : [] }
                                    children={ [
                                        {
                                            label: "Sign SAML Responses",
                                            value: "enabled"
                                        },
                                    ] }
                                />
                                <Hint>Sign the SAML2 Responses returned after the authentication process.</Hint>
                            </Grid.Column>
                        </Grid.Row>

                        {/*Single SignOn Profile*/ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider/>
                                <Divider hidden/>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Single SignOn Profile</Heading>
                                <Divider hidden/>
                                <Field
                                    label="Bindings"
                                    name="bindings"
                                    type="checkbox"
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    default={ ["HTTP_POST", "HTTP_REDIRECT"] }
                                    children={ [
                                        { label: "HTTP Post", value: "HTTP_POST" },
                                        { label: "HTTP Redirect", value: "HTTP_REDIRECT" },
                                        { label: "Artifact", value: "ARTIFACT" },
                                    ] }
                                    value={ initialValues?.singleSignOnProfile?.bindings }
                                />
                                <Hint>
                                    The mechanisms to transport SAML messages.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    name="signatureValidationForArtifactBinding"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={
                                        initialValues?.singleSignOnProfile
                                            .enableSignatureValidationForArtifactBinding ?
                                            ["enableSignatureValidationForArtifactBinding"] : [] }
                                    children={ [
                                        {
                                            label: "Enable Signature Validation For ArtifactBinding",
                                            value: "enableSignatureValidationForArtifactBinding"
                                        },
                                    ] }
                                />
                                <Hint>
                                    Artifact resolve request's signature will be validated against
                                    the Application certificate.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="idPInitiatedSSO"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={
                                        initialValues?.singleSignOnProfile.enableIdpInitiatedSingleSignOn ?
                                            ["enableIdPInitiatedSSO"] : []
                                    }
                                    children={ [
                                        {
                                            label: "Enable IdP Initiated SSO",
                                            value: "enableIdPInitiatedSSO"
                                        },
                                    ] }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h6">Assertion</Heading>
                                <Divider hidden/>
                                <Field
                                    label="NameID format"
                                    name="nameIdFormat"
                                    placeholder={ "Enter name Id format" }
                                    type="text"
                                    defult={ metadata?.certificateAlias }
                                    required={ false }
                                    requiredErrorMessage="This is needed"
                                    value={ initialValues?.singleSignOnProfile.assertion.nameIdFormat }
                                />
                                <Hint>
                                    This defines the name identifier formats that are supported by
                                    the identity provider. Name identifiers are used to provide information
                                    regarding a user.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <URLInputComponent
                            urlState={ audiences }
                            setURLState={ setAudiences }
                            labelName={ "Audience" }
                            value={ initialValues?.singleSignOnProfile.assertion.audiences.toString() }
                            placeholder={ "Enter audience " }
                            validationErrorMsg={ "Please add valid URL" }
                            validation={ (value: string) => {
                                if (FormValidation.url(value)) {
                                    return true;
                                }
                                return false;
                            } }
                            showError={ showAudienceError }
                            setShowError={ setAudienceError }
                            hint={ "Restrict the audience." }
                        />
                        <URLInputComponent
                            urlState={ recipients }
                            setURLState={ setRecipients }
                            labelName={ "Recipients" }
                            value={ initialValues?.singleSignOnProfile.assertion.recipients.toString() }
                            placeholder={ "Enter recipients" }
                            validationErrorMsg={ "Please add valid URL" }
                            validation={ (value: string) => {
                                if (FormValidation.url(value)) {
                                    return true;
                                }
                                return false;
                            } }
                            showError={ showRecipientsError }
                            setShowError={ setRecipientsError }
                            hint={ "Validate the recipients of the response." }
                        />
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Heading as="h6">Encryption</Heading>
                                <Divider hidden/>
                                <Field
                                    name="assertionEncryption"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    value={
                                        initialValues?.singleSignOnProfile.assertion.encryption.enabled ?
                                            ["enableAssertionEncryption"] : []
                                    }
                                    type="checkbox"
                                    listen={
                                        (values) => {
                                            setAssertionEncryptionEnabled(
                                                values.get("assertionEncryption").includes("enableAssertionEncryption"),
                                            )
                                        }
                                    }
                                    children={ [
                                        {
                                            label: "Enable",
                                            value: "enableAssertionEncryption"
                                        },
                                    ] }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Assertion Encryption Algorithm"
                                    name="assertionEncryptionAlgorithm"
                                    type="dropdown"
                                    required={ false }
                                    requiredErrorMessage="This is needed"
                                    disabled={ !isAssertionEncryptionEnabled }
                                    default={ metadata?.assertionEncryptionAlgorithm.defaultValue }
                                    value={
                                        initialValues?.singleSignOnProfile.assertion.encryption
                                            .assertionEncryptionAlgorithm
                                    }
                                    children={ getAllowedOptions(metadata?.assertionEncryptionAlgorithm) }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Key Encryption Algorithm"
                                    name="keyEncryptionAlgorithm"
                                    type="dropdown"
                                    required={ false }
                                    disabled={ !isAssertionEncryptionEnabled }
                                    requiredErrorMessage="This is needed"
                                    default={ metadata?.keyEncryptionAlgorithm.defaultValue }
                                    value={
                                        initialValues?.singleSignOnProfile.assertion.encryption
                                            .keyEncryptionAlgorithm
                                    }
                                    children={ getAllowedOptions(metadata?.keyEncryptionAlgorithm) }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider/>
                                <Divider hidden/>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Attribute Profile</Heading>
                                <Divider hidden/>
                                <Field
                                    name="attributeProfile"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={
                                        initialValues?.attributeProfile.enabled ?
                                            ["enabled"] : []
                                    }
                                    listen={
                                        (values) => {
                                            setIsAttributeProfileEnabled(
                                                values.get("attributeProfile").includes("enabled")
                                            );
                                        }
                                    }
                                    children={ [
                                        {
                                            label: "Enable",
                                            value: "enabled"
                                        }
                                    ] }
                                />
                                <Hint>
                                    The Identity Server provides support for a basic attribute profile where
                                    the identity provider can include the user’s attributes in the SAML Assertions
                                    as part of the attribute statement.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="includeAttributesInResponse"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    disabled={ !isAttributeProfileEnabled }
                                    value={
                                        initialValues?.attributeProfile.alwaysIncludeAttributesInResponse ?
                                            ["alwaysIncludeAttributesInResponse"] : []
                                    }
                                    children={ [
                                        {
                                            label: "Always Include Attributes in Response",
                                            value: "alwaysIncludeAttributesInResponse"
                                        },
                                    ] }
                                />
                                <Hint disabled={ !isAttributeProfileEnabled }>
                                    Once you select the checkbox to Include Attributes in the Response Always ,
                                    the identity provider always includes the attribute values related to
                                    the selected claims in the SAML attribute statement.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Attribute Consuming ServiceIndex"
                                    name="attributeConsumingServiceIndex"
                                    placeholder={ "Enter attribute consuming serviceIndex" }
                                    type="text"
                                    required={ false }
                                    disabled={ !isAttributeProfileEnabled }
                                    requiredErrorMessage="This is needed"
                                    value={ initialValues?.singleSignOnProfile.attributeConsumingServiceIndex }
                                />
                                <Hint>
                                    This is an optional field if not provided a value will be generated automatically.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>

                        {/*Single Logout Profile*/ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider/>
                                <Divider hidden/>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">Single Logout Profile</Heading>
                                <Divider hidden/>
                                <Field
                                    name="singleLogoutProfile"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    value={
                                        initialValues?.singleLogoutProfile.enabled ?
                                            ["enabled"] : []
                                    }
                                    listen={
                                        (values) => {
                                            setIsSingleLogoutProfileEnabled(
                                                values.get("singleLogoutProfile").includes("enabled")
                                            );
                                        }
                                    }
                                    children={ [
                                        {
                                            label: "Enable",
                                            value: "enabled"
                                        },
                                    ] }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Logout method"
                                    name="logoutMethod"
                                    type="dropdown"
                                    required={ false }
                                    value={ initialValues?.singleLogoutProfile.logoutMethod }
                                    requiredErrorMessage="This is needed"
                                    default={ LogoutMethods.BACK_CHANNEL }
                                    disabled={ !isSingleLogoutProfileEnabled }
                                    children={ [
                                        {
                                            text: "BACK CHANNEL",
                                            value: LogoutMethods.BACK_CHANNEL,
                                            key: 1
                                        },
                                        {
                                            text: "FRONT CHANNEL HTTP REDIRECT",
                                            value: LogoutMethods.FRONT_CHANNEL_HTTP_REDIRECT,
                                            key: 2
                                        },
                                        {
                                            text: "FRONT CHANNEL HTTP POST",
                                            value: LogoutMethods.FRONT_CHANNEL_HTTP_POST,
                                            key: 3
                                        },
                                    ]
                                    }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="singleLogoutResponseUrl"
                                    label="Single Logout Response Url"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("This is not a valid URL");
                                        }
                                    } }
                                    required={ false }
                                    requiredErrorMessage="this is not needed"
                                    placeholder="Enter single logout response url"
                                    disabled={ !isSingleLogoutProfileEnabled }
                                    type="text"
                                    value={ initialValues?.singleLogoutProfile.logoutResponseUrl }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="singleLogoutRequestUrl"
                                    label="Single Logout Request Url"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("This is not a valid URL");
                                        }
                                    } }
                                    required={ false }
                                    requiredErrorMessage="this is not needed"
                                    placeholder="Enter single logout request url"
                                    disabled={ !isSingleLogoutProfileEnabled }
                                    type="text"
                                    value={ initialValues?.singleLogoutProfile.logoutRequestUrl }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h6" disabled={ !isSingleLogoutProfileEnabled }>
                                    Idp Initiated SingleLogout
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    name="idpInitiatedSingleLogout"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    type="checkbox"
                                    disabled={ !isSingleLogoutProfileEnabled }
                                    value={
                                        initialValues?.singleLogoutProfile.idpInitiatedSingleLogout.enabled ?
                                            ["enabled"] : []
                                    }
                                    listen={
                                        (values) => {
                                            setIsIdpInitiatedSingleLogoutEnabled(
                                                values.get("idpInitiatedSingleLogout").includes("enabled")
                                            );
                                        }
                                    }
                                    children={ [
                                        {
                                            label: "Enable",
                                            value: "enabled"
                                        },
                                    ] }
                                />
                                <Hint disabled={ !isSingleLogoutProfileEnabled }>
                                    When this is enabled, the service provider is not required to send
                                    the SAML request.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <URLInputComponent
                            urlState={ returnToURLS }
                            setURLState={ setReturnToURLS }
                            labelName={ "Return to URLS" }
                            value={
                                initialValues?.singleLogoutProfile.idpInitiatedSingleLogout.returnToUrls.toString()
                            }
                            placeholder={ "Enter url" }
                            validationErrorMsg={ "Please add valid URL" }
                            validation={ (value: string) => {
                                if (FormValidation.url(value)) {
                                    return true;
                                }
                                return false;
                            } }
                            showError={ returnToURLSError }
                            setShowError={ setReturnToURLSError }
                            disabled={ !isIdpInitiatedSingleLogoutEnabled || !isSingleLogoutProfileEnabled }
                        />

                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Divider/>
                            <Divider hidden/>
                        </Grid.Column>

                        {/* Assertion Query/Request Profile */ }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Heading as="h5">Assertion Query/Request Profile</Heading>
                                <Divider hidden/>
                                <Field
                                    name="assertionQueryProfile"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage="this is needed"
                                    value={
                                        initialValues?.enableAssertionQueryProfile ?
                                            ["enableAssertionQueryProfile"] : []
                                    }
                                    type="checkbox"
                                    children={ [
                                        {
                                            label: "Enable Assertion QueryProfile",
                                            value: "enableAssertionQueryProfile"
                                        },
                                    ] }
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
            : null
    );
};
