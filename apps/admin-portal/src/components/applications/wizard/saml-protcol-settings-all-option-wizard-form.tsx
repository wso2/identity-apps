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

import { Field, Forms, FormValue, Validation } from "@wso2is/forms";
import { ContentLoader, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { URLInputComponent } from "../components";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface SAMLProtocolAllSettingsWizardFormPropsInterface {
    initialValues: any;
    templateValues?: any;
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
 * @return {ReactElement}
 */
export const SAMLProtocolAllSettingsWizardForm: FunctionComponent<SAMLProtocolAllSettingsWizardFormPropsInterface> = (
    props: SAMLProtocolAllSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit
    } = props;

    const [assertionConsumerUrls, setAssertionConsumerUrls] = useState("");
    const [showAssertionConsumerUrlError, setAssertionConsumerUrlError] = useState(false);
    const [configureMode, setConfigureMode] = useState<string>(undefined);

    useEffect(() => {
        if (_.isEmpty(initialValues?.inboundProtocolConfiguration?.saml)) {
            setConfigureMode(SAMLConfigModes.MANUAL);
        } else {
            if (!_.isEmpty(initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration)) {
                const initialAssertionConsumerUrls =
                    initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration.assertionConsumerUrls;
                setAssertionConsumerUrls(initialAssertionConsumerUrls.toString());
                setConfigureMode(SAMLConfigModes.MANUAL);
            } else if (!_.isEmpty(initialValues?.inboundProtocolConfiguration?.saml?.metadataURL)) {
                setConfigureMode(SAMLConfigModes.META_URL);
            }
        }
    }, [initialValues]);

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
                            issuer: values.get("issuer") as string,
                            assertionConsumerUrls: (assertionConsumerUrls.split(","))
                        }
                    }
                }
            }
        } else if (configureMode === SAMLConfigModes.META_URL) {
            result = {
                inboundProtocolConfiguration: {
                    saml: {
                        metadataURL: values.get("url")
                    }
                }
            }
        }

        return result;
    };

    return (configureMode ?
            <Forms
                onSubmit={ (values: Map<string, FormValue>): void => {
                    // check whether assertionConsumer url is empty or not
                    if (configureMode === SAMLConfigModes.MANUAL && _.isEmpty(assertionConsumerUrls)) {
                        setAssertionConsumerUrlError(true);
                    } else {
                        onSubmit(getFormValues(values));
                    }
                } }
                submitState={ triggerSubmit }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                label="Mode"
                                name="mode"
                                default={ configureMode }
                                type="radio"
                                children={
                                    [
                                        {
                                            label: "Manual Configuration",
                                            value: SAMLConfigModes.MANUAL
                                        },
                                        {
                                            label: "Metadata URL",
                                            value: SAMLConfigModes.META_URL
                                        }
                                    ]
                                }
                                listen={
                                    (values) => {
                                        setConfigureMode(values.get("mode") as string)
                                    }
                                }
                            />
                            <Hint>
                                { "Select the mode to configure saml." }
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                    { (configureMode === SAMLConfigModes.MANUAL) &&
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name="issuer"
                                label="Issuer"
                                required={ true }
                                requiredErrorMessage="Please provide the issuer"
                                type="text"
                                placeholder={ "Enter the issuer name" }
                                value={ initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration?.issuer }
                                readOnly={ initialValues?.saml?.issuer }
                            />
                            <Hint>
                                { `This specifies the issuer. This is the "saml:Issuer" element that contains
                            the unique identifier of the Application. This is also the issuer value
                            specified in the SAML Authentication Request issued by the Application. ` }
                            </Hint>
                        </Grid.Column>
                    </Grid.Row>
                    }
                    { (configureMode === SAMLConfigModes.MANUAL) &&
                    < URLInputComponent
                        urlState={ assertionConsumerUrls }
                        setURLState={ setAssertionConsumerUrls }
                        labelName={ "Assertion consumer URLs" }
                        placeholder={ "Enter url " }
                        validationErrorMsg={ "Please add valid URL" }
                        validation={ (value: string): boolean => {
                            return FormValidation.url(value);
                        } }
                        required={ true }
                        showError={ showAssertionConsumerUrlError }
                        setShowError={ setAssertionConsumerUrlError }
                        hint={ "This specifies the assertion Consumer URLs that the browser " +
                        "should be redirected to after the authentication is successful. " +
                        "This is the Assertion Consumer Service (ACS) URL of the Application" }
                    />
                    }
                    {
                        (configureMode === SAMLConfigModes.META_URL) &&
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="url"
                                    label="Meta URL"
                                    required={ true }
                                    requiredErrorMessage="Please provide the meta file url"
                                    type="text"
                                    placeholder={ "Enter the meta file url" }
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push("This is not a valid URL");
                                        }
                                    } }
                                    value={ initialValues?.inboundProtocolConfiguration?.saml?.metadataURL }
                                />
                                <Hint>
                                    { "URL for the meta file" }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    }
                </Grid>
            </Forms> : <ContentLoader/>
    );
};
