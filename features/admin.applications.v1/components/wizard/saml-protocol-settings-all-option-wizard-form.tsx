/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
import {
    ContentLoader,
    FilePicker,
    Hint,
    LinkButton,
    Message,
    PickerResult,
    URLInput,
    XMLFileStrategy
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Grid, Icon } from "semantic-ui-react";
import { commonConfig } from "../../../admin-extensions-v1";
import { AppState, ConfigReducerStateInterface, getCertificateIllustrations } from "../../../admin.core.v1";
import { SAMLConfigModes } from "../../models";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";

/**
 * Proptypes for the saml protocol all settings wizard form component.
 */
interface SAMLProtocolAllSettingsWizardFormPropsInterface extends TestableComponentInterface {
    /**
     * Set of fields to be displayed.
     */
    fields?: ("issuer" | "applicationQualifier" | "assertionConsumerURLs")[];
    /**
     * Flag to hide the hints.
     */
    hideFieldHints?: boolean;
    /**
     * Initial form values.
     */
    initialValues?: any;
    /**
     * Values from the template.
     */
    templateValues: any;
    /**
     * Trigger to invoke submit.
     */
    triggerSubmit: boolean;
    /**
     * On submit callback.
     * @param values - Form values.
     */
    onSubmit: (values: any) => void;
    /**
     * Maintain SAML configuration mode in parent Element.
     * @param mode - configuration mode
     */
    setSAMLConfigureMode?: (mode: string) => void;
    issuerRef?: any;
    metaUrlRef?: any;
    issuerError?: boolean;
    metaUrlError?: boolean;
    /**
     * Check whether the protocol form changed.
     * @param state - Protocol changed state
     */
    handleProtocolValueChange?: (state: boolean) => void;
}

/**
 * SAML protocol all settings wizard form component.
 *
 * @param props - Props injected to the component.
 *
 * @returns SAPML protocol all settings wizard form component.
 */
export const SAMLProtocolAllSettingsWizardForm: FunctionComponent<SAMLProtocolAllSettingsWizardFormPropsInterface> = (
    props: SAMLProtocolAllSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        fields,
        hideFieldHints,
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit,
        setSAMLConfigureMode,
        issuerRef,
        metaUrlRef,
        issuerError,
        metaUrlError,
        handleProtocolValueChange,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ assertionConsumerUrls, setAssertionConsumerUrls ] = useState<string>("");
    const [ issuer, setIssuer ] = useState<string>("");
    const [ assertionConsumerURLFromTemplate, setAssertionConsumerURLFromTemplate ] = useState("");
    const [ issuerFromTemplate, setIssuerLFromTemplate ] = useState("");
    const [ showAssertionConsumerUrlError, setAssertionConsumerUrlError ] = useState<boolean>(false);
    const [ assertionConsumerURLsErrorLabel, setAssertionConsumerURLsErrorLabel ] = useState<ReactElement>(null);
    const [ configureMode, setConfigureMode ] = useState<string>(undefined);
    const [ hasAssertionConsumerUrls, setHasAssertionConsumerUrls ] = useState<boolean>(false);

    // State related to file picker
    const [ xmlBase64String, setXmlBase64String ] = useState<string>();
    const [ selectedMetadataFile, setSelectedMetadataFile ] = useState<File>(null);
    const [ pastedMetadataContent, setPastedMetadataContent ] = useState<string>(null);
    const [ emptyFileError, setEmptyFileError ] = useState(false);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const isSAASDeployment: boolean = useSelector((state: AppState) => state?.config?.ui?.isSAASDeployment);

    useEffect(() => {
        setConfigureMode(SAMLConfigModes.MANUAL);
        if (isEmpty(initialValues?.inboundProtocolConfiguration?.saml)) {
            const tempAssertionConsumerUrls: string[] = templateValues?.
                inboundProtocolConfiguration?.saml?.manualConfiguration.assertionConsumerUrls;
            const tempIssuer: string = templateValues?.inboundProtocolConfiguration?.saml?.manualConfiguration.issuer;

            if (!isEmpty(tempAssertionConsumerUrls)) {
                setAssertionConsumerUrls(tempAssertionConsumerUrls.toString());
            } else {
                setAssertionConsumerUrls("");
            }
            if (!isEmpty(tempIssuer)) {
                setIssuer(tempIssuer.toString());
            } else {
                setIssuer("");
            }
        } else {
            setAssertionConsumerUrls(
                initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration
                    .assertionConsumerUrls?.toString()
            );
            setIssuer(initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration
                .issuer?.toString());
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
     * Update SAML config mode to the parent element.
     */
    useEffect(() => {
        if (configureMode) {
            setSAMLConfigureMode(configureMode);
        }
    }, [ configureMode ]);

    /**
     * Sets the mandatory status of the ACS URL component by reading
     * the template values. If the template has a ACS URL array defined,
     * makes the field optional.
     */
    useEffect(() => {

        if (!templateValues) {
            return;
        }

        const templatedCallbacks: string[] =
            templateValues?.inboundProtocolConfiguration?.saml?.templateConfiguration?.assertionConsumerUrls;
        const templatedIssuer: string =
            templateValues?.inboundProtocolConfiguration?.saml?.templateConfiguration?.issuer;

        if (templatedCallbacks && Array.isArray(templatedCallbacks) && templatedCallbacks.length > 0) {
            setAssertionConsumerURLFromTemplate(templatedCallbacks[0]);
        }
        if (templatedIssuer) {
            setIssuerLFromTemplate(templatedIssuer);
        }
    }, [ templateValues ]);

    /**
      * Update AssertionConsumerUrls based on the new value and previous
      * values available in assertionConsumerUrls variable.
      *
      * @param value - UrlState value of Assertion consumer url URLInput field.
      */
    const updateAssertionConsumerUrls = (value : string): void => {
        if (!hasAssertionConsumerUrls) {
            if (assertionConsumerUrls) {
                setAssertionConsumerUrls(assertionConsumerUrls);
                setHasAssertionConsumerUrls(true);
            } else {
                if (value){
                    setHasAssertionConsumerUrls(true);
                }
                setAssertionConsumerUrls(value);
            }
        } else {
            setAssertionConsumerUrls(value);
            if (!value) {
                setHasAssertionConsumerUrls(false);
            }
        }
    };

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @param urls - Callback URLs.
     * @returns Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>, urls?: string): any => {
        //TODO: [Fix Type] Type of the config object need to be defined throguh `onSubmit` prop.
        let config: any;

        if (configureMode === SAMLConfigModes.MANUAL) {
            config = {
                inboundProtocolConfiguration: {
                    saml: {
                        manualConfiguration: {}
                    }
                }
            };

            if (!fields || fields.includes("assertionConsumerURLs")) {
                config.inboundProtocolConfiguration.saml.manualConfiguration["assertionConsumerUrls"] =
                    urls ? urls.split(",") : assertionConsumerUrls.split(",");
            }

            if (!fields || fields.includes("issuer")) {
                config.inboundProtocolConfiguration.saml.manualConfiguration["issuer"] = values.get("issuer") as string;
            }

            if (!fields || fields.includes("applicationQualifier")) {
                config.inboundProtocolConfiguration.saml.manualConfiguration["serviceProviderQualifier"] =
                    values.get("applicationQualifier");
            }
        } else if (configureMode === SAMLConfigModes.META_URL) {
            config = {
                inboundProtocolConfiguration: {
                    saml: {
                        metadataURL: values.get("url")
                    }
                }
            };
        } else if (configureMode === SAMLConfigModes.META_FILE) {
            config = {
                inboundProtocolConfiguration: {
                    saml: {
                        // metadataFile: fileContent
                        metadataFile: xmlBase64String
                    }
                }
            };
        }

        return config;
    };

    /**
     * Render SAML mode selection section.
     */
    const resolveSAMLModeSelection = (): ReactElement => {
        return(
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <Button.Group
                        size="large"
                        labeled
                        basic
                    >
                        {
                            Object.values(SAMLConfigModes).map((mode: string, index: number) => {
                                return(
                                    <Button
                                        key={ index }
                                        active={ configureMode === mode }
                                        className="saml-config-mode-wizard-tab"
                                        content={
                                            ApplicationManagementUtils.resolveSAMLConfigModeDisplayName(
                                                mode as SAMLConfigModes
                                            )
                                        }
                                        onClick={ (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            event.preventDefault();
                                            setConfigureMode(mode);
                                            setHasAssertionConsumerUrls(false);
                                        } }
                                    />
                                );
                            })
                        }
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
        );
    };

    /**
     * Render SAML configuration section.
     */
    const resolveSAMLConfiguration = (): ReactElement => {

        if (configureMode == SAMLConfigModes.MANUAL) {
            return (
                <>
                    { (!fields || fields.includes("issuer")) && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    name="issuer"
                                    ref={ issuerRef }
                                    displayErrorOn="blur"
                                    label={
                                        t("applications:forms.inboundSAML" +
                                            ".fields.issuer.label")
                                    }
                                    required={ true }
                                    requiredErrorMessage={
                                        t("applications:forms.inboundSAML.fields" +
                                            ".issuer.validations.empty")
                                    }
                                    type="text"
                                    placeholder={
                                        t("applications:forms.inboundSAML.fields" +
                                            ".issuer.placeholder")
                                    }
                                    value={ issuer }
                                    validation={ (value: string, validation: Validation) => {
                                        if (issuerError) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("applications:forms.inboundSAML" +
                                                    ".fields.issuer.errorMessage"));
                                        } else {
                                            setIssuer(value);
                                        }
                                    } }
                                    data-testid={ `${testId}-issuer-input` }
                                />
                                { !hideFieldHints && (
                                    <Hint>
                                        { t("applications:forms.inboundSAML.fields" +
                                            ".issuer.hint") }
                                    </Hint>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                    ) }
                    { (!fields || fields.includes("applicationQualifier")) && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    name="applicationQualifier"
                                    label={
                                        t("applications:forms.inboundSAML" +
                                            ".fields.qualifier.label")
                                    }
                                    required={ false }
                                    requiredErrorMessage={
                                        t("applications:forms.inboundSAML" +
                                            ".fields.qualifier.validations.empty")
                                    }
                                    type="text"
                                    placeholder={
                                        t("applications:forms.inboundSAML" +
                                            ".fields.qualifier.placeholder")
                                    }
                                    value={
                                        initialValues?.inboundProtocolConfiguration
                                            .saml?.manualConfiguration?.serviceProviderQualifier
                                    }
                                    data-testid={ `${testId}-application-qualifier-input` }
                                />
                                { !hideFieldHints && (
                                    <Hint>
                                        { t("applications:forms.inboundSAML.fields" +
                                            ".qualifier.hint") }
                                    </Hint>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                    ) }
                    { (!fields || fields.includes("assertionConsumerURLs")) && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } className="field">
                                <URLInput
                                    urlState={ assertionConsumerUrls }
                                    setURLState={ updateAssertionConsumerUrls }
                                    labelName={
                                        t("applications:forms.inboundSAML" +
                                            ".fields.assertionURLs.label")
                                    }
                                    placeholder={
                                        t("applications:forms.inboundSAML" +
                                            ".fields.assertionURLs.placeholder")
                                    }
                                    validationErrorMsg={
                                        t("applications:forms." +
                                            "spaProtocolSettingsWizard.fields.callBackUrls.validations.invalid")
                                    }
                                    emptyErrorMessage={
                                        t("applications:forms.inboundSAML" +
                                            ".fields.assertionURLs.validations.empty")
                                    }
                                    validation={ (value: string) => {
                                        if (!(URLUtils.isURLValid(value, true) && (URLUtils.isHttpUrl(value) ||
                                            URLUtils.isHttpsUrl(value)))) {

                                            return false;
                                        }

                                        if (!URLUtils.isMobileDeepLink(value)) {
                                            return false;
                                        }

                                        setAssertionConsumerURLsErrorLabel(null);

                                        return true;
                                    } }
                                    computerWidth={ 10 }
                                    required={ true }
                                    showError={ showAssertionConsumerUrlError }
                                    setShowError={ setAssertionConsumerUrlError }
                                    hint={
                                        !hideFieldHints && t("applications:" +
                                            "forms.inboundSAML.fields.assertionURLs.hint")
                                    }
                                    addURLTooltip={ t("common:addURL") }
                                    duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                    data-testid={ `${testId}-assertion-consumer-url-input` }
                                    getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                                        submitUrl = submitFunction;
                                    } }
                                    showPredictions={ false }
                                    customLabel={ assertionConsumerURLsErrorLabel }
                                    popupHeaderPositive={ t("applications:URLInput.withLabel."
                                        + "positive.header") }
                                    popupHeaderNegative={ t("applications:URLInput.withLabel."
                                        + "negative.header") }
                                    popupContentPositive={ t("applications:URLInput.withLabel."
                                        + "positive.content", { productName: config.ui.productName }) }
                                    popupContentNegative={ t("applications:URLInput.withLabel."
                                        + "negative.content", { productName: config.ui.productName }) }
                                    popupDetailedContentPositive={ t("applications:URLInput."
                                        + "withLabel.positive.detailedContent.0") }
                                    popupDetailedContentNegative={ t("applications:URLInput."
                                        + "withLabel.negative.detailedContent.0") }
                                    insecureURLDescription={ t("console:common.validations.inSecureURL.description") }
                                    showLessContent={ t("common:showLess") }
                                    showMoreContent={ t("common:showMore") }
                                />
                                {
                                    (assertionConsumerURLFromTemplate) && isSAASDeployment && (
                                        <Message
                                            visible
                                            type="info"
                                            content={
                                                (<>
                                                    {
                                                        <Trans
                                                            i18nKey={ "applications:forms." +
                                                            "inboundSAML.fields.assertionURLs.info" }
                                                            tOptions={ {
                                                                assertionURLFromTemplate:
                                                                assertionConsumerURLFromTemplate
                                                            } }
                                                        >
                                                            Don’t have an app? Try out a sample app
                                                            using <strong>{ assertionConsumerURLFromTemplate }</strong>
                                                            as the assertion Response URL.
                                                            (You can download and run a sample
                                                            at a later step.)
                                                        </Trans>
                                                    }
                                                    {
                                                        (assertionConsumerUrls === undefined ||
                                                            assertionConsumerUrls === "") && (
                                                            <LinkButton
                                                                className={ "m-1 p-1 with-no-border orange" }
                                                                onClick={
                                                                    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        setAssertionConsumerUrls(
                                                                            assertionConsumerURLFromTemplate);
                                                                        setIssuer(issuerFromTemplate);
                                                                        setHasAssertionConsumerUrls(true);
                                                                    }
                                                                }
                                                                data-testid={ `${testId}-add-now-button` }
                                                            >
                                                                <span style={ { fontWeight: "bold" } }>Add Now</span>
                                                            </LinkButton>
                                                        )
                                                    }
                                                </>)
                                            }
                                        />
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>

                    ) }
                </>
            );


        } else if (configureMode === SAMLConfigModes.META_URL) {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Field
                            name="url"
                            ref={ metaUrlRef }
                            displayErrorOn="blur"
                            label={
                                t("applications:forms.inboundSAML.fields" +
                                    ".metaURL.label")
                            }
                            required={ true }
                            requiredErrorMessage={
                                t("applications:forms.inboundSAML.fields" +
                                    ".metaURL.validations.empty")
                            }
                            type="text"
                            placeholder={
                                t("applications:forms.inboundSAML.fields" +
                                    ".metaURL.placeholder")
                            }
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("applications:forms.inboundSAML" +
                                            ".fields.metaURL.validations.invalid")
                                    );
                                }

                                if (commonConfig?.blockLoopBackCalls && URLUtils.isLoopBackCall(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("idp:forms.common." +
                                            "internetResolvableErrorMessage")
                                    );
                                }

                                if (metaUrlError) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("applications:forms.inboundSAML" +
                                            ".fields.metaURL.errorMessage")
                                    );
                                }
                            } }
                            value={ initialValues?.inboundProtocolConfiguration?.saml?.metadataURL }
                            data-testid={ `${testId}-meta-url-input` }
                        />
                        { !hideFieldHints && (
                            <Hint>
                                { t("applications:forms.inboundSAML.fields.metaURL" +
                                    ".hint") }
                            </Hint>
                        ) }
                    </Grid.Column>
                </Grid.Row>
            );
        } else if (configureMode === SAMLConfigModes.META_FILE) {
            return (
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <FilePicker
                            key={ 1 }
                            fileStrategy={ XML_FILE_PROCESSING_STRATEGY }
                            file={ selectedMetadataFile }
                            pastedContent={ pastedMetadataContent }
                            onChange={ (result: PickerResult<any>) => {
                                setSelectedMetadataFile(result.file);
                                setPastedMetadataContent(result.pastedContent);
                                setXmlBase64String(result.serialized as string);
                            } }
                            uploadButtonText="Upload Metadata File"
                            dropzoneText="Drag and drop a XML file here."
                            data-testid={ `${testId}-form-wizard-saml-xml-config-file-picker` }
                            icon={ getCertificateIllustrations().uploadPlaceholder }
                            placeholderIcon={ <Icon name="file code" size="huge"/> }
                            normalizeStateOnRemoveOperations={ true }
                            emptyFileError={ emptyFileError }
                            hidePasteOption={ true }
                        />
                    </Grid.Column>
                </Grid.Row>
            );
        }
    };

    /**
     * submitURL function.
     */
    let submitUrl: (callback: (url?: string) => void) => void;

    return (
        configureMode
            ? (
                <Forms
                    onSubmit={ (values: Map<string, FormValue>): void => {
                        handleProtocolValueChange(true);
                        if (configureMode === SAMLConfigModes.MANUAL) {
                            submitUrl((url: string) => {
                                // Check whether assertionConsumer url is empty or not.
                                if (isEmpty(assertionConsumerUrls) && isEmpty(url)) {
                                    setAssertionConsumerUrlError(true);
                                } else {
                                    onSubmit(getFormValues(values, url));
                                }
                            });
                        } else {
                            if (configureMode === SAMLConfigModes.META_FILE && isEmpty(xmlBase64String)) {
                                setEmptyFileError(true);
                            } else {
                                onSubmit(getFormValues(values));
                            }
                        }

                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        { resolveSAMLModeSelection() }
                        { resolveSAMLConfiguration() }
                    </Grid>
                </Forms>
            )
            : <ContentLoader/>
    );
};

/**
 * Default props for the saml protocol all settings wizard form component.
 */
SAMLProtocolAllSettingsWizardForm.defaultProps = {
    "data-testid": "saml-protocol-settings-wizard-form",
    hideFieldHints: false
};

const XML_FILE_PROCESSING_STRATEGY: XMLFileStrategy = new XMLFileStrategy();
