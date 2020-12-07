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
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { ContentLoader, FileUpload, Hint, URLInput } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Label } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../core";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface SAMLProtocolAllSettingsWizardFormPropsInterface extends TestableComponentInterface {
    initialValues: any;
    updateSelectedSAMLMetaFile: (selected: boolean) => void;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

enum SAMLConfigModes {
    MANUAL = "manualConfiguration",
    META_URL = "metadataURL",
    META_FILE = "metadataFile"
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {SAMLProtocolAllSettingsWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SAMLProtocolAllSettingsWizardForm: FunctionComponent<SAMLProtocolAllSettingsWizardFormPropsInterface> = (
    props: SAMLProtocolAllSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        updateSelectedSAMLMetaFile,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [assertionConsumerUrls, setAssertionConsumerUrls] = useState("");
    const [showAssertionConsumerUrlError, setAssertionConsumerUrlError] = useState(false);
    const [configureMode, setConfigureMode] = useState<string>(undefined);

    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState<File>(null);
    const [fileContent, setFileContent] = useState("");
    const [filePasteContent, setFilePasteContent] = useState("");
    const [emptyFileError, setEmptyFileError] = useState(false);
    const [ assertionURLsErrorLabel, setAssertionURLsErrorLabel ] = useState<ReactElement>(null);

    useEffect(() => {
        if (_.isEmpty(initialValues?.inboundProtocolConfiguration?.saml)) {
            setConfigureMode(SAMLConfigModes.MANUAL);
        } else {
            if (!_.isEmpty(initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration)) {
                setConfigureMode(SAMLConfigModes.MANUAL);
            } else if (!_.isEmpty(initialValues?.inboundProtocolConfiguration?.saml?.metadataURL)) {
                setConfigureMode(SAMLConfigModes.META_URL);
            } else if (!_.isEmpty(initialValues?.inboundProtocolConfiguration?.saml?.metadataFile)) {
                setConfigureMode(SAMLConfigModes.META_FILE);
                setFile(initialValues?.inboundProtocolConfiguration?.saml?.file);
                setFileName(initialValues?.inboundProtocolConfiguration?.saml?.fileName);
                setFilePasteContent(initialValues?.inboundProtocolConfiguration?.saml?.pasteValue);
                setFileContent(initialValues?.inboundProtocolConfiguration?.saml?.metadataFile);
            }
        }
    }, [initialValues]);

    /**
     * Reset empty file error.
     */
    useEffect(() => {
        if (file && emptyFileError) {
            setEmptyFileError(false);
        }
    }, [fileContent]);

    /**
     * Watch metaFile selected or not.
     */
    useEffect(() => {
        if (configureMode === SAMLConfigModes.META_FILE) {
            updateSelectedSAMLMetaFile(true);
            return;
        }
        updateSelectedSAMLMetaFile(false);
    }, [configureMode]);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>): any => {

        let result = {};
        if (configureMode === SAMLConfigModes.MANUAL) {
            result = {
                inboundProtocolConfiguration: {
                    saml: {
                        manualConfiguration: {
                            assertionConsumerUrls: (assertionConsumerUrls.split(",")),
                            issuer: values.get("issuer") as string,
                            serviceProviderQualifier: values.get("applicationQualifier")
                        }
                    }
                }
            };
        } else if (configureMode === SAMLConfigModes.META_URL) {
            result = {
                inboundProtocolConfiguration: {
                    saml: {
                        metadataURL: values.get("url")
                    }
                }
            };
        } else if (configureMode === SAMLConfigModes.META_FILE) {
            result = {
                inboundProtocolConfiguration: {
                    saml: {
                        file: file,
                        fileName: fileName,
                        metadataFile: fileContent,
                        pasteValue: filePasteContent
                    }
                }
            };
        }
        return result;
    };

    return (configureMode
            ?
            <Forms
                onSubmit={ (values: Map<string, FormValue>): void => {
                    // check whether assertionConsumer url is empty or not
                    if (configureMode === SAMLConfigModes.MANUAL && _.isEmpty(assertionConsumerUrls)) {
                        setAssertionConsumerUrlError(true);
                    } else if (configureMode === SAMLConfigModes.META_FILE && _.isEmpty(fileContent)) {
                        setEmptyFileError(true);
                    } else {
                        onSubmit(getFormValues(values));
                    }
                } }
                submitState={ triggerSubmit }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <Field
                                label={
                                    t("console:develop.features.applications.forms.inboundSAML.fields.mode.label")
                                }
                                name="mode"
                                default={ configureMode }
                                type="radio"
                                children={
                                    [
                                        {
                                            label: t("console:develop.features.applications.forms.inboundSAML" +
                                                ".fields.mode.children.manualConfig.label"),
                                            value: SAMLConfigModes.MANUAL
                                        },
                                        {
                                            label: t("console:develop.features.applications.forms.inboundSAML" +
                                                ".fields.mode.children.metadataURL.label"),
                                            value: SAMLConfigModes.META_URL
                                        },
                                        {
                                            label: t("console:develop.features.applications.forms.inboundSAML" +
                                                ".fields.mode.children.metadataFile.label"),
                                            value: SAMLConfigModes.META_FILE
                                        }
                                    ]
                                }
                                listen={
                                    (values) => {
                                        setConfigureMode(values.get("mode") as string);
                                    }
                                }
                                data-testid={ `${ testId }-mode-radio-group` }
                            />
                            <Hint>
                                { t("console:develop.features.applications.forms.inboundSAML.fields.mode.hint") }
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                    {
                        (SAMLConfigModes.MANUAL === configureMode) &&
                        (
                            <>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                        <Field
                                            name="issuer"
                                            label={
                                                t("console:develop.features.applications.forms.inboundSAML" +
                                                    ".fields.issuer.label")
                                            }
                                            required={ true }
                                            requiredErrorMessage={
                                                t("console:develop.features.applications.forms.inboundSAML.fields" +
                                                    ".issuer.validations.empty")
                                            }
                                            type="text"
                                            placeholder={
                                                t("console:develop.features.applications.forms.inboundSAML.fields" +
                                                    ".issuer.placeholder")
                                            }
                                            value={ initialValues?.inboundProtocolConfiguration
                                                .saml?.manualConfiguration?.issuer }
                                            data-testid={ `${ testId }-issuer-input` }
                                        />
                                        <Hint>
                                            { t("console:develop.features.applications.forms.inboundSAML.fields" +
                                                ".issuer.hint") }
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                        <Field
                                            name="applicationQualifier"
                                            label={
                                                t("console:develop.features.applications.forms.inboundSAML" +
                                                    ".fields.qualifier.label")
                                            }
                                            required={ false }
                                            requiredErrorMessage={
                                                t("console:develop.features.applications.forms.inboundSAML.fields" +
                                                    ".qualifier.validations.empty")
                                            }
                                            type="text"
                                            placeholder={
                                                t("console:develop.features.applications.forms.inboundSAML.fields" +
                                                    ".qualifier.placeholder")
                                            }
                                            value={
                                                initialValues?.inboundProtocolConfiguration
                                                    .saml?.manualConfiguration?.serviceProviderQualifier
                                            }
                                            data-testid={ `${ testId }-application-qualifier-input` }
                                        />
                                        <Hint>
                                            { t("console:develop.features.applications.forms.inboundSAML.fields" +
                                                ".qualifier.hint") }
                                        </Hint>
                                    </Grid.Column>
                                </Grid.Row>
                                <URLInput
                                    urlState={ assertionConsumerUrls }
                                    setURLState={ setAssertionConsumerUrls }
                                    value={
                                        initialValues?.inboundProtocolConfiguration
                                            .saml?.manualConfiguration?.assertionConsumerUrls.toString()
                                    }
                                    labelName={
                                        t("console:develop.features.applications.forms.inboundSAML.fields" +
                                            ".assertionURLs.label")
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundSAML.fields" +
                                            ".assertionURLs.placeholder")
                                    }
                                    validationErrorMsg={
                                        t("console:develop.features.applications.forms.inboundSAML.fields" +
                                            ".assertionURLs.validations.invalid")
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

                                        if (!URLUtils.isHttpsOrHttpUrl(value)) {
                                            label = (
                                                <Label basic color="orange" className="mt-2">
                                                    { t("console:common.validations.unrecognizedURL.description") }
                                                </Label>
                                            );
                                        }

                                        if (!URLUtils.isMobileDeepLink(value)) {
                                            return false;
                                        }

                                        setAssertionURLsErrorLabel(label);

                                        return true;
                                    } }
                                    required={ true }
                                    computerWidth={ 10 }
                                    showError={ showAssertionConsumerUrlError }
                                    setShowError={ setAssertionConsumerUrlError }
                                    hint={
                                        t("console:develop.features.applications.forms.inboundSAML.fields" +
                                            ".assertionURLs.hint")
                                    }
                                    addURLTooltip={ t("common:addURL") }
                                    duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                    data-testid={ `${ testId }-assertion-consumer-url-input` }
                                    showPredictions={ false }
                                    customLabel={ assertionURLsErrorLabel }
                                />
                            </>
                        )
                    }
                    {
                        (SAMLConfigModes.META_URL === configureMode) &&
                        (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                    <Field
                                        name="url"
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
                                        } }
                                        value={ initialValues?.inboundProtocolConfiguration?.saml?.metadataURL }
                                        data-testid={ `${ testId }-meta-url-input` }
                                    />
                                    <Hint>
                                        { t("console:develop.features.applications.forms.inboundSAML.fields.metaURL" +
                                            ".hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                </Grid>
                {
                    (SAMLConfigModes.META_FILE === configureMode) &&
                    (
                        <FileUpload
                            encode={ true }
                            dropzoneIcon={ getEmptyPlaceholderIllustrations().fileUpload }
                            updateFile={ setFile }
                            updateContent={ setFileContent }
                            updatePasteContent={ setFilePasteContent }
                            updateFileName={ setFileName }
                            initialName={ fileName }
                            initialFile={ file }
                            initialPasteValue={ filePasteContent }
                            initialContent={ fileContent }
                            triggerEmptyFileError={ emptyFileError }
                            data-testid={ `${ testId }-meta-file-upload` }
                        />
                    )
                }
            </Forms>
            : <ContentLoader/>
    );
};

/**
 * Default props for the all saml protocol settings wizard form component.
 */
SAMLProtocolAllSettingsWizardForm.defaultProps = {
    "data-testid": "saml-protocol-all-settings-wizard-form"
};
