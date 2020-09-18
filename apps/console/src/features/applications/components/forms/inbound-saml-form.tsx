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
import { URLUtils } from "@wso2is/core/utils";
import { Field, Forms, Validation } from "@wso2is/forms";
import { CopyInputField, Heading, Hint, URLInput } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Form, Grid, Label } from "semantic-ui-react";
import {
    LogoutMethods,
    MetadataPropertyInterface,
    SAML2ServiceProviderInterface,
    SAMLMetaDataInterface
} from "../../models";

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

    const { t } = useTranslation();

    const [ assertionConsumerURLsErrorLabel, setAssertionConsumerURLsErrorLabel ] = useState<ReactElement>(null);
    const [ audiencesErrorLabel, setAudiencesErrorLabel ] = useState<ReactElement>(null);
    const [ recipientsErrorLabel, setRecipientsErrorLabel ] = useState<ReactElement>(null);
    const [ returnToURLsErrorLabel, setReturnToURLsErrorLabel ] = useState<ReactElement>(null);

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
                                    initialValues?.issuer
                                        ? (
                                            <Form.Field>
                                                <div className={ "required field" }>
                                                    <label>
                                                        { t("devPortal:components.applications.forms.inboundSAML" +
                                                            ".fields.issuer.label") }
                                                    </label>
                                                </div>
                                                <CopyInputField value={ initialValues?.issuer }/>
                                            </Form.Field>
                                        )
                                        : (
                                            <Field
                                                name="issuer"
                                                label={
                                                    t("devPortal:components.applications.forms.inboundSAML" +
                                                        ".fields.issuer.label")
                                                }
                                                required={ true }
                                                requiredErrorMessage={
                                                    t("devPortal:components.applications.forms.inboundSAML.fields" +
                                                        ".issuer.validations.empty")
                                                }
                                                type="text"
                                                placeholder={
                                                    t("devPortal:components.applications.forms.inboundSAML.fields" +
                                                        ".issuer.placeholder")
                                                }
                                                value={ initialValues?.issuer }
                                                readOnly={ readOnly }
                                                data-testid={ `${ testId }-issuer-input` }
                                            />
                                        )
                                }
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.fields.issuer.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="applicationQualifier"
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.fields.qualifier" +
                                            ".label")
                                    }
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.fields.qualifier" +
                                            ".validations.empty")
                                    }
                                    type="text"
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundSAML.fields.qualifier" +
                                            ".placeholder")
                                    }
                                    value={ initialValues?.serviceProviderQualifier }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-application-qualifier-input` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.fields.qualifier." +
                                        "hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <URLInput
                            urlState={ assertionConsumerUrls }
                            setURLState={ setAssertionConsumerUrls }
                            labelName={
                                t("devPortal:components.applications.forms.inboundSAML.fields.assertionURLs.label")
                            }
                            value={ initialValues?.assertionConsumerUrls.toString() }
                            placeholder={
                                t("devPortal:components.applications.forms.inboundSAML.fields.assertionURLs" +
                                    ".placeholder")
                            }
                            validationErrorMsg={
                                t("devPortal:components.applications.forms.inboundSAML.fields.assertionURLs" +
                                    ".validations.invalid")
                            }
                            validation={ (value: string) => {

                                let label: ReactElement = null;

                                if (URLUtils.isHttpUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.inSecureURL.description") }
                                        </Label>
                                    );
                                }

                                if (!URLUtils.isHttpUrl(value) && !URLUtils.isHttpsUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.unrecognizedURL.description") }
                                        </Label>
                                    );
                                }

                                setAssertionConsumerURLsErrorLabel(label);

                                return true;
                            } }
                            required={ true }
                            showError={ showAssertionConsumerUrlError }
                            setShowError={ setAssertionConsumerUrlError }
                            hint={
                                t("devPortal:components.applications.forms.inboundSAML.fields.assertionURLs.hint")
                            }
                            readOnly={ readOnly }
                            addURLTooltip={ t("common:addURL") }
                            duplicateURLErrorMessage={ t("common:duplicateURLError") }
                            data-testid={ `${ testId }-assertion-consumer-url-input` }
                            showPredictions={ false }
                            customLabel={ assertionConsumerURLsErrorLabel }
                        />
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.fields" +
                                            ".defaultAssertionURL.label")
                                    }
                                    name="defaultAssertionConsumerUrl"
                                    type="dropdown"
                                    required={ true }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.fields" +
                                            ".defaultAssertionURL.validations.empty")
                                    }
                                    default={
                                        !isEmpty(assertionConsumerUrls) &&
                                        assertionConsumerUrls.split(",").slice(-1)[0]
                                    }
                                    children={ createDefaultAssertionConsumerUrl() }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-default-assertion-consumer-url-input` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.fields" +
                                        ".defaultAssertionURL.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.fields" +
                                            ".idpEntityIdAlias.label")
                                    }
                                    name="idpEntityIdAlias"
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundSAML.fields" +
                                            ".idpEntityIdAlias.placeholder")
                                    }
                                    type="text"
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.fields" +
                                            ".idpEntityIdAlias.validations.empty")
                                    }
                                    value={ initialValues?.idpEntityIdAlias }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-idp-entity-id-alias-input` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.fields" +
                                        ".idpEntityIdAlias.hint") }
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
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".requestValidation.heading") }
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    name="requestSignatureValidation"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".requestValidation.fields.signatureValidation.validations.empty")
                                    }
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
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.requestValidation.fields.signatureValidation.label"),
                                            value: "enableSignatureValidation"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-request-signature-validation-checkbox` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".requestValidation.fields.signatureValidation.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".requestValidation.fields.signatureValidationCertAlias.label")
                                    }
                                    name="signatureValidationCertAlias"
                                    type="dropdown"
                                    required={ false }
                                    disabled={ !isRequestSignatureValidationEnabled }
                                    value={ initialValues?.requestValidation.signatureValidationCertAlias }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".requestValidation.fields.signatureValidationCertAlias.validations.empty")
                                    }
                                    default={ metadata?.certificateAlias.defaultValue }
                                    children={ getAllowedOptions(metadata?.certificateAlias) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-request-validation-certificate-alias-dropdown` }
                                />
                                <Hint disabled={ !isRequestSignatureValidationEnabled }>
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".requestValidation.fields.signatureValidationCertAlias.hint") }
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
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".responseSigning.heading") }
                                </Heading>
                                <Divider hidden/>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Field
                                        label={
                                            t("devPortal:components.applications.forms.inboundSAML.sections" +
                                                ".responseSigning.fields.digestAlgorithm.label")
                                        }
                                        name="digestAlgorithm"
                                        type="dropdown"
                                        required={ false }
                                        requiredErrorMessage={
                                            t("devPortal:components.applications.forms.inboundSAML.sections" +
                                                ".responseSigning.fields.digestAlgorithm.validations.empty")
                                        }
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
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".responseSigning.fields.signingAlgorithm.label")
                                    }
                                    name="signingAlgorithm"
                                    type="dropdown"
                                    required={ false }
                                    value={ initialValues?.responseSigning.signingAlgorithm }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".responseSigning.fields.signingAlgorithm.validations.empty")
                                    }
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
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.responseSigning.fields.responseSigning.label"),
                                            value: "enabled"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-response-signing-checkbox` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".responseSigning.fields.responseSigning.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>

                        {/*Single SignOn Profile*/ }
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Divider/>
                                <Divider hidden/>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".ssoProfile.heading") }
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".ssoProfile.fields.bindings.label")
                                    }
                                    name="bindings"
                                    type="checkbox"
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".ssoProfile.fields.bindings.validations.empty")
                                    }
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
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".ssoProfile.fields.bindings.hint") }
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
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.ssoProfile.fields.artifactBinding.label"),
                                            value: "enableSignatureValidationForArtifactBinding"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-artifact-binding-signature-validation-checkbox` }
                                />
                                <Hint>
                                   { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                           ".ssoProfile.fields.artifactBinding.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="idPInitiatedSSO"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".ssoProfile.fields.idpInitiatedSSO.validations.empty")
                                    }
                                    type="checkbox"
                                    value={
                                        initialValues?.singleSignOnProfile.enableIdpInitiatedSingleSignOn ?
                                            ["enableIdPInitiatedSSO"] : []
                                    }
                                    children={ [
                                        {
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.ssoProfile.fields.idpInitiatedSSO.label"),
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
                                <Heading as="h6">
                                    { t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                        ".heading") }
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".assertion.fields.nameIdFormat.label")
                                    }
                                    name="nameIdFormat"
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".assertion.fields.nameIdFormat.placeholder")
                                    }
                                    type="text"
                                    default={ metadata?.certificateAlias }
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".assertion.fields.nameIdFormat.validations.empty")
                                    }
                                    value={ initialValues?.singleSignOnProfile.assertion.nameIdFormat }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-name-id-format-input` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                        ".fields.nameIdFormat.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <URLInput
                            urlState={ audiences }
                            setURLState={ setAudiences }
                            labelName={
                                t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                    ".fields.audience.label")
                            }
                            value={ initialValues?.singleSignOnProfile.assertion.audiences.toString() }
                            placeholder={
                                t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                    ".fields.audience.placeholder")
                            }
                            validationErrorMsg={
                                t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                    ".fields.audience.validations.invalid")
                            }
                            validation={ (value: string) => {

                                let label: ReactElement = null;

                                if (URLUtils.isHttpUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.inSecureURL.description") }
                                        </Label>
                                    );
                                }

                                if (!URLUtils.isHttpUrl(value) && !URLUtils.isHttpsUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.unrecognizedURL.description") }
                                        </Label>
                                    );
                                }

                                setAudiencesErrorLabel(label);

                                return true;
                            } }
                            showError={ showAudienceError }
                            setShowError={ setAudienceError }
                            hint={
                                t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                    ".fields.audience.hint")
                            }
                            readOnly={ readOnly }
                            addURLTooltip={ t("common:addURL") }
                            duplicateURLErrorMessage={ t("common:duplicateURLError") }
                            data-testid={ `${ testId }-audience-url-input` }
                            showPredictions={ false }
                            customLabel={ audiencesErrorLabel }
                        />
                        <URLInput
                            urlState={ recipients }
                            setURLState={ setRecipients }
                            labelName={
                                t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                    ".fields.recipients.label")
                            }
                            value={ initialValues?.singleSignOnProfile.assertion.recipients.toString() }
                            placeholder={
                                t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                    ".fields.recipients.placeholder")
                            }
                            validationErrorMsg={
                                t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                    ".fields.recipients.validations.invalid")
                            }
                            validation={ (value: string) => {

                                let label: ReactElement = null;

                                if (URLUtils.isHttpUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.inSecureURL.description") }
                                        </Label>
                                    );
                                }

                                if (!URLUtils.isHttpUrl(value) && !URLUtils.isHttpsUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.unrecognizedURL.description") }
                                        </Label>
                                    );
                                }

                                setRecipientsErrorLabel(label);

                                return true;
                            } }
                            showError={ showRecipientsError }
                            setShowError={ setRecipientsError }
                            hint={
                                t("devPortal:components.applications.forms.inboundSAML.sections.assertion" +
                                    ".fields.recipients.hint")
                            }
                            readOnly={ readOnly }
                            addURLTooltip={ t("common:addURL") }
                            duplicateURLErrorMessage={ t("common:duplicateURLError") }
                            data-testid={ `${ testId }-recipients-url-input` }
                            showPredictions={ false }
                            customLabel={ recipientsErrorLabel }
                        />
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Heading as="h6">
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".encryption.heading") }
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    name="assertionEncryption"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".encryption.fields.assertionEncryption.validations.empty")
                                    }
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
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.encryption.fields.assertionEncryption.label"),
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
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".encryption.fields.assertionEncryptionAlgorithm.label")
                                    }
                                    name="assertionEncryptionAlgorithm"
                                    type="dropdown"
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".encryption.fields.assertionEncryptionAlgorithm.validations.empty")
                                    }
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
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".encryption.fields.keyEncryptionAlgorithm.label")
                                    }
                                    name="keyEncryptionAlgorithm"
                                    type="dropdown"
                                    required={ false }
                                    disabled={ !isAssertionEncryptionEnabled }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".encryption.fields.keyEncryptionAlgorithm.validations.empty")
                                    }
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
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".attributeProfile.heading") }
                                </Heading>
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
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.attributeProfile.fields.enable.label"),
                                            value: "enabled"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-attribute-profile-checkbox` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".attributeProfile.fields.enable.hint") }
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
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.attributeProfile.fields.includeAttributesInResponse.label"),
                                            value: "alwaysIncludeAttributesInResponse"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-include-attribute-in-response-checkbox` }
                                />
                                <Hint disabled={ !isAttributeProfileEnabled }>
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".attributeProfile.fields.includeAttributesInResponse.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".attributeProfile.fields.serviceIndex.label")
                                    }
                                    name="attributeConsumingServiceIndex"
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".attributeProfile.fields.serviceIndex.placeholder")
                                    }
                                    type="text"
                                    required={ false }
                                    disabled={ !isAttributeProfileEnabled }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".attributeProfile.fields.serviceIndex.validations.empty")
                                    }
                                    value={ initialValues?.singleSignOnProfile.attributeConsumingServiceIndex }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-attribute-consuming-service-index-input` }
                                />
                                <Hint>
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".attributeProfile.fields.serviceIndex.hint ") }
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
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".sloProfile.heading") }
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    name="singleLogoutProfile"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.enable.validations.empty")
                                    }
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
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.sloProfile.heading"),
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
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.logoutMethod.label")
                                    }
                                    name="logoutMethod"
                                    type="dropdown"
                                    required={ false }
                                    value={ initialValues?.singleLogoutProfile.logoutMethod }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.logoutMethod.validations.empty")
                                    }
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
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.responseURL.label")
                                    }
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("devPortal:components.applications.forms.inboundSAML" +
                                                    ".sections.sloProfile.fields.responseURL.validations.invalid")
                                            );
                                        }
                                    } }
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.responseURL.validations.empty")
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.responseURL.placeholder")
                                    }
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
                                    label={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.requestURL.label")
                                    }
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("devPortal:components.applications.forms.inboundSAML" +
                                                    ".sections.sloProfile.fields.requestURL.validations.invalid")
                                            );
                                        }
                                    } }
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.requestURL.validations.empty")
                                    }
                                    placeholder={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".sloProfile.fields.requestURL.placeholder")
                                    }
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
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".idpInitiatedSLO.heading") }
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    name="idpInitiatedSingleLogout"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".idpInitiatedSLO.fields.enable.validations.empty")
                                    }
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
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.idpInitiatedSLO.fields.enable.label"),
                                            value: "enabled"
                                        }
                                    ] }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-idp-initiated-single-logout-checkbox` }
                                />
                                <Hint disabled={ !isSingleLogoutProfileEnabled }>
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".idpInitiatedSLO.fields.enable.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <URLInput
                            urlState={ returnToURLS }
                            setURLState={ setReturnToURLS }
                            labelName={
                                t("devPortal:components.applications.forms.inboundSAML.sections" +
                                    ".idpInitiatedSLO.fields.returnToURLs.label")
                            }
                            value={
                                initialValues?.singleLogoutProfile.idpInitiatedSingleLogout.returnToUrls.toString()
                            }
                            placeholder={
                                t("devPortal:components.applications.forms.inboundSAML.sections" +
                                    ".idpInitiatedSLO.fields.returnToURLs.placeholder")
                            }
                            validationErrorMsg={
                                t("devPortal:components.applications.forms.inboundSAML.sections" +
                                    ".idpInitiatedSLO.fields.returnToURLs.validations.invalid")
                            }
                            validation={ (value: string) => {

                                let label: ReactElement = null;

                                if (URLUtils.isHttpUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.inSecureURL.description") }
                                        </Label>
                                    );
                                }

                                if (!URLUtils.isHttpUrl(value) && !URLUtils.isHttpsUrl(value)) {
                                    label = (
                                        <Label basic color="orange" className="mt-2">
                                            { t("console:common.validations.unrecognizedURL.description") }
                                        </Label>
                                    );
                                }

                                setReturnToURLsErrorLabel(label);

                                return true;
                            } }
                            showError={ returnToURLSError }
                            setShowError={ setReturnToURLSError }
                            disabled={ !isIdpInitiatedSingleLogoutEnabled || !isSingleLogoutProfileEnabled }
                            readOnly={ readOnly }
                            addURLTooltip={ t("common:addURL") }
                            duplicateURLErrorMessage={ t("common:duplicateURLError") }
                            data-testid={ `${ testId }-return-to-urls-input` }
                            showPredictions={ false }
                            customLabel={ returnToURLsErrorLabel }
                        />

                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Divider/>
                            <Divider hidden/>
                        </Grid.Column>

                        {/* Assertion Query/Request Profile */ }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Heading as="h5">
                                    { t("devPortal:components.applications.forms.inboundSAML.sections" +
                                        ".requestProfile.heading") }
                                </Heading>
                                <Divider hidden/>
                                <Field
                                    name="assertionQueryProfile"
                                    label=""
                                    required={ false }
                                    requiredErrorMessage={
                                        t("devPortal:components.applications.forms.inboundSAML.sections" +
                                            ".requestProfile.fields.enable.validations.empty")
                                    }
                                    value={
                                        initialValues?.enableAssertionQueryProfile ?
                                            ["enableAssertionQueryProfile"] : []
                                    }
                                    type="checkbox"
                                    children={ [
                                        {
                                            label: t("devPortal:components.applications.forms.inboundSAML" +
                                                ".sections.requestProfile.fields.enable.label"),
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
                                            { t("common:update")}
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
