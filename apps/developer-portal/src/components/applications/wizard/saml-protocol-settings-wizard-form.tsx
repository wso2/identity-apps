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
import { Field, FormValue, Forms } from "@wso2is/forms";
import { ContentLoader, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { URLInputComponent } from "../../shared";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface SAMLProtocolSettingsWizardFormPropsInterface extends TestableComponentInterface {
    initialValues: any;
    templateValues: any;
    triggerSubmit: boolean;
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
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [assertionConsumerUrls, setAssertionConsumerUrls] = useState("");
    const [showAssertionConsumerUrlError, setAssertionConsumerUrlError] = useState(false);

    useEffect(() => {
        if (_.isEmpty(initialValues?.inboundProtocolConfiguration?.saml)) {
            const tempAssertionConsumerUrls = templateValues?.inboundProtocolConfiguration?.saml?.manualConfiguration
                .assertionConsumerUrls;
            if (!_.isEmpty(tempAssertionConsumerUrls)) {
                setAssertionConsumerUrls(tempAssertionConsumerUrls.toString())
            } else {
                setAssertionConsumerUrls("")
            }
        } else {
            setAssertionConsumerUrls(
                initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration
                    .assertionConsumerUrls?.toString()
            )
        }
    }, [initialValues]);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>): any => {
        return {
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
    };

    return (templateValues
            ?
            <Forms
                onSubmit={ (values: Map<string, FormValue>): void => {
                    // check whether assertionConsumer url is empty or not
                    if (_.isEmpty(assertionConsumerUrls)) {
                        setAssertionConsumerUrlError(true);
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
                                value={
                                    initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration?.issuer
                                }
                                data-testid={ `${ testId }-issuer-input` }
                            />
                            <Hint>
                                { t("devPortal:components.applications.forms.inboundSAML.fields.issuer.hint") }
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
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
                                value={
                                    initialValues?.inboundProtocolConfiguration
                                        .saml?.manualConfiguration?.serviceProviderQualifier
                                }
                                data-testid={ `${ testId }-application-qualifier-input` }
                            />
                            <Hint>
                                { t("devPortal:components.applications.forms.inboundSAML.fields.qualifier.hint") }
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                    <URLInputComponent
                        urlState={ assertionConsumerUrls }
                        setURLState={ setAssertionConsumerUrls }
                        labelName={
                            t("devPortal:components.applications.forms.inboundSAML.fields.assertionURLs.label")
                        }
                        placeholder={
                            t("devPortal:components.applications.forms.inboundSAML.fields.assertionURLs" +
                                ".placeholder")
                        }
                        validationErrorMsg={
                            t("devPortal:components.applications.forms.inboundSAML.fields.assertionURLs" +
                                ".validations.invalid")
                        }
                        validation={ (value: string): boolean => {
                            return FormValidation.url(value);
                        } }
                        computerWidth={ 10 }
                        required={ true }
                        showError={ showAssertionConsumerUrlError }
                        setShowError={ setAssertionConsumerUrlError }
                        hint={
                            t("devPortal:components.applications.forms.inboundSAML.fields.assertionURLs.hint")
                        }
                        data-testid={ `${ testId }-assertion-consumer-url-input` }
                    />
                </Grid>
            </Forms>
            : <ContentLoader/>
    );
};

/**
 * Default props for the saml protocol settings wizard form component.
 */
SAMLProtocolSettingsWizardForm.defaultProps = {
    "data-testid": "saml-protocol-settings-wizard-form"
};
