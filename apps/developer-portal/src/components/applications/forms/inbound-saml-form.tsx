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
import { Field, Forms, Validation } from "@wso2is/forms";
import { CopyInputField, Heading, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Divider, Form, Grid } from "semantic-ui-react";
import {
    LogoutMethods,
    MetadataPropertyInterface,
    SAML2ServiceProviderInterface,
    SAMLMetaDataInterface
} from "../../../models";
import { URLInputComponent } from "../components";

interface InboundSAMLFormPropsInterface extends TestableComponentInterface {
    initialValues: SAML2ServiceProviderInterface;
    metadata: SAMLMetaDataInterface;
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Inbound SAML configurations.
 *
 * @param {InboundSAMLFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundSAMLForm: FunctionComponent<InboundSAMLFormPropsInterface> = (
    props: InboundSAMLFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        metadata,
        onSubmit,
        readOnly,
        [ "data-testid" ]: testId
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
                    allowedOptions.push({ key: metadataProp.options.indexOf(ele), text: ele, value: ele });
                });
            }
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
    const [isRequestSignatureValidationEnabled, setIsRequestSignatureValidationEnabled] = useState(false);
    const [isAssertionEncryptionEnabled, setAssertionEncryptionEnabled] = useState(false);

    const createDefaultAssertionConsumerUrl = () => {
        const allowedOptions = [];
        if (!isEmpty(assertionConsumerUrls)) {
            const assertionUrlArray = assertionConsumerUrls.split(",");
            assertionUrlArray.map((url) => {
                allowedOptions.push({ key: assertionUrlArray.indexOf(url), text: url, value: url });
            })
        }
        return allowedOptions;
    };

    const updateConfiguration = (values) => {

        return {
            manualConfiguration: {
                assertionConsumerUrls: assertionConsumerUrls.split(","),
                attributeProfile: {
                    alwaysIncludeAttributesInResponse: values.get("includeAttributesInResponse")
                        .includes("alwaysIncludeAttributesInResponse"),
                    enabled: values.get("attributeProfile").includes("enabled")
                },
                defaultAssertionConsumerUrl: values.get("defaultAssertionConsumerUrl"),
                enableAssertionQueryProfile:
                    values.get("assertionQueryProfile").includes("enableAssertionQueryProfile"),
                idpEntityIdAlias: values.get("idpEntityIdAlias"),
                issuer: values.get("issuer") || initialValues?.issuer,
                requestValidation: {
                    enableSignatureValidation: values.get("requestSignatureValidation")
                        .includes("enableSignatureValidation"),
                    signatureValidationCertAlias: values.get("signatureValidationCertAlias")
                },
                responseSigning: {
                    enabled: values.get("responseSigning").includes("enabled"),
                    signingAlgorithm: values.get("signingAlgorithm")
                },
                serviceProviderQualifier: values.get("applicationQualifier"),
                singleLogoutProfile: {
                    enabled: values.get("singleLogoutProfile").includes("enabled"),
                    idpInitiatedSingleLogout: {
                        enabled: values.get("idpInitiatedSingleLogout").includes("enabled"),
                        returnToUrls: returnToURLS ? returnToURLS.split(",") : []
                    },
                    logoutMethod: values.get("logoutMethod"),
                    logoutResponseUrl: values.get("singleLogoutResponseUrl")
                },
                singleSignOnProfile: {
                    assertion: {
                        audiences: audiences ? audiences.split(",") : [],
                        digestAlgorithm: values.get("digestAlgorithm"),
                        encryption: {
                            assertionEncryptionAlgorithm: values.get("assertionEncryptionAlgorithm"),
                            enabled: values.get("assertionEncryption").includes("enableAssertionEncryption"),
                            keyEncryptionAlgorithm: values.get("keyEncryptionAlgorithm")
                        },
                        nameIdFormat: values.get("nameIdFormat"),
                        recipients: recipients ? recipients.split(",") : []
                    },
                    attributeConsumingServiceIndex: values.get("attributeConsumingServiceIndex"),
                    bindings: values.get("bindings"),
                    enableIdpInitiatedSingleSignOn: values.get("idPInitiatedSSO").includes("enableIdPInitiatedSSO"),
                    enableSignatureValidationForArtifactBinding:
                        values.get("signatureValidationForArtifactBinding")
                            .includes("enableSignatureValidationForArtifactBinding")
                }
            }
        }
    };

    useEffect(
        () => {
            if (initialValues) {
                setIsSingleLogoutProfileEnabled(initialValues?.singleLogoutProfile.enabled);
                setIsIdpInitiatedSingleLogoutEnabled(
                    initialValues?.singleLogoutProfile.idpInitiatedSingleLogout.enabled);
                setIsAttributeProfileEnabled(initialValues?.attributeProfile.enabled);
                setIsRequestSignatureValidationEnabled(initialValues?.requestValidation.enableSignatureValidation);
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
                                {
                                    initialValues?.issuer ?
                                        <Form.Field>
                                            <div className={ "required field" }>
                                                <label>Issuer</label>
                                            </div>
                                            <CopyInputField value={ initialValues?.issuer }/>
                                        </Form.Field> :
                                        <Field
                                            name="issuer"
                                            label="Issuer"
                                            required={ true }
                                            requiredErrorMessage="Please provide the issuer"
                                            type="text"
                                            placeholder={ "Enter the issuer name" }
                                            value={ initialValues?.issuer }
                                            readOnly={ readOnly }
                                            data-testid={ `${ testId }-issuer-input` }
                                        />
                                }
                                <Hint>
                                    This specifies the issuer. This is the &quot;saml:Issuer&quot; element that contains
                                    the unique identifier of the Application. This is also the issuer value
                                    specified in the SAML Authentication Request issued by the Application.
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="applicationQualifier"
                                    label="Application qualifier"
                                    required={ false }
                                    requiredErrorMessage="This is needed"
                                    type="text"
                                    placeholder={ "Enter the application qualifier" }
                                    value={ initialValues?.serviceProviderQualifier }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-application-qualifier-input` }
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
                            labelName={ "Assertion consumer URLs" }
                            value={ initialValues?.assertionConsumerUrls.toString() }
                            placeholder={ "Enter URL " }
                            validationErrorMsg={ "Please add valid URL" }
                            validation={ (value: string) => {
                                return FormValidation.url(value);
                            } }
                            required={ true }
                            showError={ showAssertionConsumerUrlError }
                            setShowError={ setAssertionConsumerUrlError }
                            hint={ "This specifies the assertion Consumer URLs that the browser " +
                            "should be redirected to after the authentication is successful. " +
                            "This is the Assertion Consumer Service (ACS) URL of the Application." }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-assertion-consumer-url-input` }
                        />
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Default assertion consumer URL"
                                    name="defaultAssertionConsumerUrl"
                                    type="dropdown"
                                    required={ true }
                                    requiredErrorMessage="This is needed"
                                    default={
                                        !isEmpty(assertionConsumerUrls) &&
                                        assertionConsumerUrls.split(",").slice(-1)[0]
                                    }
                                    children={ createDefaultAssertionConsumerUrl() }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-default-assertion-consumer-url-input` }
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
                                    label="Idp entityId alias"
                                    name="idpEntityIdAlias"
                                    placeholder={ "Enter alias" }
                                    type="text"
                                    required={ false }
                                    requiredErrorMessage="This is needed"
                                    value={ initialValues?.idpEntityIdAlias }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-idp-entity-id-alias-input` }
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
                                            label: "Enable request signature validation",
                                            value: "enableSignatureValidation"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-request-signature-validation-checkbox` }
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
                                    label="Request validation certificate alias"
                                    name="signatureValidationCertAlias"
                                    type="dropdown"
                                    required={ false }
                                    disabled={ !isRequestSignatureValidationEnabled }
                                    value={ initialValues?.requestValidation.signatureValidationCertAlias }
                                    requiredErrorMessage="This is needed"
                                    default={ metadata?.certificateAlias.defaultValue }
                                    children={ getAllowedOptions(metadata?.certificateAlias) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-request-validation-certificate-alias-dropdown` }
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
                                        label="Digest algorithm"
                                        name="digestAlgorithm"
                                        type="dropdown"
                                        required={ false }
                                        requiredErrorMessage="This is needed"
                                        default={ metadata?.responseDigestAlgorithm.defaultValue }
                                        value={ initialValues?.singleSignOnProfile.assertion.digestAlgorithm }
                                        children={ getAllowedOptions(metadata?.responseDigestAlgorithm) }
                                        readOnly={ readOnly }
                                        data-testid={ `${ testId }-digest-algorithm-dropdown` }
                                    />
                                </Grid.Column>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Signing algorithm"
                                    name="signingAlgorithm"
                                    type="dropdown"
                                    required={ false }
                                    value={ initialValues?.responseSigning.signingAlgorithm }
                                    requiredErrorMessage="This is needed"
                                    default={ metadata?.responseSigningAlgorithm.defaultValue }
                                    children={ getAllowedOptions(metadata?.responseSigningAlgorithm) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-signing-algorithm-dropdown` }
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
                                            label: "Sign SAML responses",
                                            value: "enabled"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-response-signing-checkbox` }
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
                                        { label: "Artifact", value: "ARTIFACT" }
                                    ] }
                                    value={ initialValues?.singleSignOnProfile?.bindings }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-bindings-checkbox-group` }
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
                                            label: "Enable signature validation for artifact binding",
                                            value: "enableSignatureValidationForArtifactBinding"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-artifact-binding-signature-validation-checkbox` }
                                />
                                <Hint>
                                    Artifact resolve request&apos;s signature will be validated against
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
                                            label: "Enable idP initiated SSO",
                                            value: "enableIdPInitiatedSSO"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-idp-initiated-sso-checkbox` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h6">Assertion</Heading>
                                <Divider hidden/>
                                <Field
                                    label="Name ID format"
                                    name="nameIdFormat"
                                    placeholder={ "Enter name ID format" }
                                    type="text"
                                    default={ metadata?.certificateAlias }
                                    required={ false }
                                    requiredErrorMessage="This is needed"
                                    value={ initialValues?.singleSignOnProfile.assertion.nameIdFormat }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-name-id-format-input` }
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
                                return FormValidation.url(value);
                            } }
                            showError={ showAudienceError }
                            setShowError={ setAudienceError }
                            hint={ "Restrict the audience." }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-audience-url-input` }
                        />
                        <URLInputComponent
                            urlState={ recipients }
                            setURLState={ setRecipients }
                            labelName={ "Recipients" }
                            value={ initialValues?.singleSignOnProfile.assertion.recipients.toString() }
                            placeholder={ "Enter recipients" }
                            validationErrorMsg={ "Please add valid URL" }
                            validation={ (value: string) => {
                                return FormValidation.url(value);
                            } }
                            showError={ showRecipientsError }
                            setShowError={ setRecipientsError }
                            hint={ "Validate the recipients of the response." }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-recipients-url-input` }
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
                                                values.get("assertionEncryption").includes("enableAssertionEncryption")
                                            )
                                        }
                                    }
                                    children={ [
                                        {
                                            label: "Enable",
                                            value: "enableAssertionEncryption"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-assertion-encryption-checkbox` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Assertion encryption algorithm"
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
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-assertion-encryption-algorithm-dropdown` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label="Key encryption algorithm"
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
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-key-encryption-algorithm-dropdown` }
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
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-attribute-profile-checkbox` }
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
                                            label: "Always include attributes in response",
                                            value: "alwaysIncludeAttributesInResponse"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-include-attribute-in-response-checkbox` }
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
                                    label="Attribute consuming service index"
                                    name="attributeConsumingServiceIndex"
                                    placeholder={ "Enter attribute consuming service index" }
                                    type="text"
                                    required={ false }
                                    disabled={ !isAttributeProfileEnabled }
                                    requiredErrorMessage="This is needed"
                                    value={ initialValues?.singleSignOnProfile.attributeConsumingServiceIndex }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-attribute-consuming-service-index-input` }
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
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-single-logout-profile-checkbox` }
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
                                            key: 1,
                                            text: "BACK CHANNEL",
                                            value: LogoutMethods.BACK_CHANNEL
                                        },
                                        {
                                            key: 2,
                                            text: "FRONT CHANNEL HTTP REDIRECT",
                                            value: LogoutMethods.FRONT_CHANNEL_HTTP_REDIRECT
                                        },
                                        {
                                            key: 3,
                                            text: "FRONT CHANNEL HTTP POST",
                                            value: LogoutMethods.FRONT_CHANNEL_HTTP_POST
                                        }
                                    ]
                                    }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-logout-method-dropdown` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="singleLogoutResponseUrl"
                                    label="Single logout response URL"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("This is not a valid URL");
                                        }
                                    } }
                                    required={ false }
                                    requiredErrorMessage="this is not needed"
                                    placeholder="Enter single logout response URL"
                                    disabled={ !isSingleLogoutProfileEnabled }
                                    type="text"
                                    value={ initialValues?.singleLogoutProfile.logoutResponseUrl }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-single-logout-response-url-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="singleLogoutRequestUrl"
                                    label="Single logout request URL"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("This is not a valid URL");
                                        }
                                    } }
                                    required={ false }
                                    requiredErrorMessage="this is not needed"
                                    placeholder="Enter single logout request URL"
                                    disabled={ !isSingleLogoutProfileEnabled }
                                    type="text"
                                    value={ initialValues?.singleLogoutProfile.logoutRequestUrl }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-single-logout-request-url-input` }
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
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-idp-initiated-single-logout-checkbox` }
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
                            labelName={ "Return to URLs" }
                            value={
                                initialValues?.singleLogoutProfile.idpInitiatedSingleLogout.returnToUrls.toString()
                            }
                            placeholder={ "Enter url" }
                            validationErrorMsg={ "Please add valid URL" }
                            validation={ (value: string) => {
                                return FormValidation.url(value);
                            } }
                            showError={ returnToURLSError }
                            setShowError={ setReturnToURLSError }
                            disabled={ !isIdpInitiatedSingleLogoutEnabled || !isSingleLogoutProfileEnabled }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-return-to-urls-input` }
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
                                            label: "Enable assertion query profile",
                                            value: "enableAssertionQueryProfile"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-assertion-query-profile-checkbox` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        {
                            !readOnly && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Button
                                            primary
                                            type="submit"
                                            size="small"
                                            className="form-button"
                                            data-testid={ `${ testId }-submit-button` }
                                        >
                                            Update
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                    </Grid>
                </Forms>
            )
            : null
    );
};

/**
 * Default props for the inbound SAML form component.
 */
InboundSAMLForm.defaultProps = {
    "data-testid": "inbound-saml-form"
};
