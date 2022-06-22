/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { ContentLoader, FilePicker, Hint, XMLFileStrategy } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Icon } from "semantic-ui-react";
import { commonConfig } from "../../../../extensions";
import { getCertificateIllustrations } from "../../../core";
import { SAMLConfigModes } from "../../models";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface SAMLProtocolCreationWizardFormPropsInterface extends TestableComponentInterface {
    initialValues: any;
    creationOption: SAMLConfigModes;
    onSubmit: (values: any) => void;
    /**
     * Specifies whether API calls are pending.
     */
    isLoading?: boolean;
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {SAMLProtocolCreationWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundSAMLCreationForm: FunctionComponent<SAMLProtocolCreationWizardFormPropsInterface> = (
    props: SAMLProtocolCreationWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        creationOption,
        onSubmit,
        isLoading,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ configureMode, setConfigureMode ] = useState<string>(undefined);

    // State related to file picker
    const [ xmlBase64String, setXmlBase64String ] = useState<string>();
    const [ selectedMetadataFile, setSelectedMetadataFile ] = useState<File>(null);
    const [ pastedMetadataContent, setPastedMetadataContent ] = useState<string>(null);
    const [ emptyFileError, setEmptyFileError ] = useState(false);

    useEffect(() => {
        if (isEmpty(initialValues?.inboundProtocolConfiguration?.saml)) {
            setConfigureMode(SAMLConfigModes.META_URL);
        } else {
            if (!isEmpty(initialValues?.inboundProtocolConfiguration?.saml?.metadataURL)) {
                setConfigureMode(SAMLConfigModes.META_URL);
            } else if (!isEmpty(initialValues?.inboundProtocolConfiguration?.saml?.metadataFile)) {
                setConfigureMode(SAMLConfigModes.META_FILE);
                setSelectedMetadataFile(initialValues?.inboundProtocolConfiguration?.saml?.file);
                setPastedMetadataContent(initialValues?.inboundProtocolConfiguration?.saml?.pasteValue);
                setXmlBase64String(initialValues?.inboundProtocolConfiguration?.saml?.metadataFile);
            }
        }
    }, [ initialValues ]);

    /**
     * Reset empty file error.
     */
    useEffect(() => {
        if (xmlBase64String && emptyFileError) {
            setEmptyFileError(false);
        }
    }, [ xmlBase64String ]);

    /**
     * Watch metaFile selected or not.
     */
    useEffect(() => {
        setConfigureMode(creationOption);
    }, [ creationOption ]);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>): any => {

        let result = {};

        if (configureMode === SAMLConfigModes.META_URL) {
            result = {
                inbound: {
                    metadataURL: values.get("url")
                }
            };
        } else if (configureMode === SAMLConfigModes.META_FILE) {
            result = {
                inbound: {
                    metadataFile: xmlBase64String
                }
            };
        }

        return result;
    };

    return (
        configureMode
            ? (
                <Forms
                    onSubmit={ (values: Map<string, FormValue>): void => {
                        // check whether assertionConsumer url is empty or not
                        if (configureMode === SAMLConfigModes.META_FILE && isEmpty(xmlBase64String)) {
                            setEmptyFileError(true);
                        } else {
                            onSubmit(getFormValues(values));
                        }
                    } }
                >
                    <Grid>
                        {
                            (SAMLConfigModes.META_URL === configureMode) && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                        <Field
                                            name="url"
                                            displayErrorOn="blur"
                                            label={
                                                t("console:develop.features.applications.forms.inboundSAML.fields" +
                                            ".metaURL.label")
                                            }
                                            required={ true }
                                            requiredErrorMessage={
                                                t("console:develop.features.applications.forms.inboundSAML.fields" +
                                            ".metaURL.validations.empty")
                                            }
                                            type="text"
                                            placeholder={
                                                t("console:develop.features.applications.forms.inboundSAML.fields" +
                                            ".metaURL.placeholder")
                                            }
                                            validation={ (value: string, validation: Validation) => {

                                                if (!FormValidation.url(value)) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push(
                                                        t("console:develop.features.applications.forms.inboundSAML" +
                                                    ".fields.metaURL.validations.invalid")
                                                    );
                                                }

                                                if (commonConfig?.blockLoopBackCalls
                                                    && URLUtils.isLoopBackCall(value)) {

                                                    validation.isValid = false;
                                                    validation.errorMessages.push(
                                                        t("console:develop.features.idp.forms.common." +
                                                    "internetResolvableErrorMessage")
                                                    );
                                                }
                                            } }
                                            value={ initialValues?.inboundProtocolConfiguration?.saml?.metadataURL }
                                            data-testid={ `${ testId }-meta-url-input` }
                                        />
                                        <Hint>
                                            {
                                                t("console:develop.features.applications.forms" +
                                                    ".inboundSAML.fields.metaURL.hint")
                                            }
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        {
                            (SAMLConfigModes.META_FILE === configureMode) && (
                                <Grid.Row columns={ 1 } mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                        <FilePicker
                                            key={ 1 }
                                            fileStrategy={ XML_FILE_PROCESSING_STRATEGY }
                                            file={ selectedMetadataFile }
                                            pastedContent={ pastedMetadataContent }
                                            onChange={ (result) => {
                                                setSelectedMetadataFile(result.file);
                                                setPastedMetadataContent(result.pastedContent);
                                                setXmlBase64String(result.serialized as string);
                                            } }
                                            uploadButtonText="Upload Metadata File"
                                            dropzoneText="Drag and drop a XML file here."
                                            data-testid={ `${ testId }-form-wizard-saml-xml-config-file-picker` }
                                            icon={ getCertificateIllustrations().uploadPlaceholder }
                                            placeholderIcon={ <Icon name="file code" size="huge"/> }
                                            normalizeStateOnRemoveOperations={ true }
                                            emptyFileError={ emptyFileError }
                                            hidePasteOption={ true }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Divider hidden/>
                                <Button
                                    primary
                                    type="submit"
                                    size="small"
                                    loading={ isLoading }
                                    disabled={ isLoading }
                                    className="form-button"
                                    data-testid={ `${testId}-submit-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            )
            : <ContentLoader/>
    );
};

/**
 * Default props for the all saml protocol settings wizard form component.
 */
InboundSAMLCreationForm.defaultProps = {
    "data-testid": "saml-protocol-all-settings-wizard-form"
};

const XML_FILE_PROCESSING_STRATEGY = new XMLFileStrategy();
