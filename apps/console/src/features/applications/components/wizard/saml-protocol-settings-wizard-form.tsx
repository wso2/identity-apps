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
import { Field, FormValue, Forms } from "@wso2is/forms";
import { ContentLoader, Hint, LinkButton, MessageWithIcon, URLInput } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState, ConfigReducerStateInterface } from "../../../core";
import { Grid } from "semantic-ui-react";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface SAMLProtocolSettingsWizardFormPropsInterface extends TestableComponentInterface {
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
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {SAMLProtocolSettingsWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SAMLProtocolSettingsWizardForm: FunctionComponent<SAMLProtocolSettingsWizardFormPropsInterface> = (
    props: SAMLProtocolSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        fields,
        hideFieldHints,
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ assertionConsumerUrls, setAssertionConsumerUrls ] = useState<string>("");
    const [ issuer, setIssuer ] = useState<string>("");
    const [ assertionConsumerURLFromTemplate, setAssertionConsumerURLFromTemplate ] = useState("");
    const [ issuerFromTemplate, setIssuerLFromTemplate ] = useState("");
    const [ showAssertionConsumerUrlError, setAssertionConsumerUrlError ] = useState<boolean>(false);
    const [ assertionConsumerURLsErrorLabel, setAssertionConsumerURLsErrorLabel ] = useState<ReactElement>(null);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    useEffect(() => {
        if (isEmpty(initialValues?.inboundProtocolConfiguration?.saml)) {
            const tempAssertionConsumerUrls = templateValues?.inboundProtocolConfiguration?.saml?.manualConfiguration
                .assertionConsumerUrls;
            const tempIssuer = templateValues?.inboundProtocolConfiguration?.saml?.manualConfiguration.issuer;

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
            setAssertionConsumerURLFromTemplate(templatedCallbacks[ 0 ]);
        }
        if (templatedIssuer) {
            setIssuerLFromTemplate(templatedIssuer);
        }
    }, [ templateValues ]);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @param {string} urls - Callback URLs.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>, urls?: string): any => {
        const config = {
            inboundProtocolConfiguration: {
                saml: {
                    manualConfiguration: { }
                }
            }
        };

        if (!fields || fields.includes("assertionConsumerURLs")) {
            config.inboundProtocolConfiguration.saml.manualConfiguration[ "assertionConsumerUrls" ] =
                urls ? urls.split(",") : assertionConsumerUrls.split(",");
        }

        if (!fields || fields.includes("issuer")) {
            config.inboundProtocolConfiguration.saml.manualConfiguration[ "issuer" ] = values.get("issuer") as string;
        }

        if (!fields || fields.includes("applicationQualifier")) {
            config.inboundProtocolConfiguration.saml.manualConfiguration[ "serviceProviderQualifier" ] =
                values.get("applicationQualifier");
        }

        return config;
    };

    /**
     * submitURL function.
     */
    let submitUrl: (callback: (url?: string) => void) => void;

    return (
        templateValues
            ? (
                <Forms
                    onSubmit={ (values: Map<string, FormValue>): void => {
                        submitUrl((url: string) => {
                            // Check whether assertionConsumer url is empty or not.
                            if (isEmpty(assertionConsumerUrls) && isEmpty(url)) {
                                setAssertionConsumerUrlError(true);
                            } else {
                                onSubmit(getFormValues(values, url));
                            }
                        });
                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        { (!fields || fields.includes("issuer")) && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
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
                                        value={ issuer }
                                        data-testid={ `${ testId }-issuer-input` }
                                    />
                                    { !hideFieldHints && (
                                        <Hint>
                                            { t("console:develop.features.applications.forms.inboundSAML.fields" +
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
                                            t("console:develop.features.applications.forms.inboundSAML" +
                                                ".fields.qualifier.label")
                                        }
                                        required={ false }
                                        requiredErrorMessage={
                                            t("console:develop.features.applications.forms.inboundSAML" +
                                                ".fields.qualifier.validations.empty")
                                        }
                                        type="text"
                                        placeholder={
                                            t("console:develop.features.applications.forms.inboundSAML" +
                                                ".fields.qualifier.placeholder")
                                        }
                                        value={
                                            initialValues?.inboundProtocolConfiguration
                                                .saml?.manualConfiguration?.serviceProviderQualifier
                                        }
                                        data-testid={ `${ testId }-application-qualifier-input` }
                                    />
                                    { !hideFieldHints && (
                                        <Hint>
                                            { t("console:develop.features.applications.forms.inboundSAML.fields" +
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
                                        setURLState={ setAssertionConsumerUrls }
                                        labelName={
                                            t("console:develop.features.applications.forms.inboundSAML" +
                                                ".fields.assertionURLs.label")
                                        }
                                        placeholder={
                                            t("console:develop.features.applications.forms.inboundSAML" +
                                                ".fields.assertionURLs.placeholder")
                                        }
                                        validationErrorMsg={
                                            t("console:develop.features.applications.forms." +
                                                "spaProtocolSettingsWizard.fields.callBackUrls.validations.invalid")
                                        }
                                        emptyErrorMessage={
                                            t("console:develop.features.applications.forms.inboundSAML" +
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
                                            !hideFieldHints && t("console:develop.features.applications" +
                                                ".forms.inboundSAML.fields.assertionURLs.hint")
                                        }
                                        addURLTooltip={ t("common:addURL") }
                                        duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                        data-testid={ `${ testId }-assertion-consumer-url-input` }
                                        getSubmit={ (submitFunction: (callback: (url?: string) => void) => void) => {
                                            submitUrl = submitFunction;
                                        } }
                                        showPredictions={ false }
                                        customLabel={ assertionConsumerURLsErrorLabel }
                                        popupHeaderPositive={ t("console:develop.features.URLInput.withLabel."
                                            + "positive.header") }
                                        popupHeaderNegative={ t("console:develop.features.URLInput.withLabel."
                                            + "negative.header") }
                                        popupContentPositive={ t("console:develop.features.URLInput.withLabel."
                                            + "positive.content", { productName: config.ui.productName }) }
                                        popupContentNegative={ t("console:develop.features.URLInput.withLabel."
                                            + "negative.content", { productName: config.ui.productName }) }
                                        popupDetailedContentPositive={ t("console:develop.features.URLInput."
                                            + "withLabel.positive.detailedContent.0") }
                                        popupDetailedContentNegative={ t("console:develop.features.URLInput."
                                            + "withLabel.negative.detailedContent.0") }
                                        insecureURLDescription={ t("console:common.validations.inSecureURL."
                                            + "description") }
                                        showLessContent={ t("common:showLess") }
                                        showMoreContent={ t("common:showMore") }
                                    />
                                    {
                                        (assertionConsumerURLFromTemplate) && (
                                            <MessageWithIcon
                                                type="info"
                                                content={
                                                    <>
                                                        {
                                                            <Trans
                                                                i18nKey={ "console:develop.features.applications." +
                                                                "forms.inboundSAML.fields.assertionURLs.info" }
                                                                tOptions={ { assertionURLFromTemplate:
                                                                    assertionConsumerURLFromTemplate } }
                                                            >
                                                                Don’t have an app? Try out a sample app
                                                                using
                                                                <strong>{ assertionConsumerURLFromTemplate }</strong>
                                                                as the assertion Response URL. (You can download and
                                                                run a sample at a later step.)
                                                            </Trans>
                                                        }
                                                        {
                                                            (assertionConsumerUrls === undefined ||
                                                                assertionConsumerUrls === "") && (
                                                                <LinkButton
                                                                    className={ "m-1 p-1 with-no-border orange" }
                                                                    onClick={ (e) => {
                                                                        e.preventDefault();
                                                                        setAssertionConsumerUrls(
                                                                            assertionConsumerURLFromTemplate);
                                                                        setIssuer(issuerFromTemplate);
                                                                    } }
                                                                    data-testid={ `${ testId }-add-now-button` }
                                                                >
                                                                    <span style={ { fontWeight: "bold" } }>
                                                                        Add Now
                                                                    </span>
                                                                </LinkButton>
                                                            )
                                                        }
                                                    </>
                                                }
                                            />
                                        )
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                    </Grid>
                </Forms>
            )
            : <ContentLoader/>
    );
};

/**
 * Default props for the saml protocol settings wizard form component.
 */
SAMLProtocolSettingsWizardForm.defaultProps = {
    "data-testid": "saml-protocol-settings-wizard-form",
    hideFieldHints: false
};
