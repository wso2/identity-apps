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

import { Field, Forms } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { URLInputComponent } from "../components";
import { isEmpty } from "lodash";
import { FormValue } from "@wso2is/forms";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface SAMLProtocolSettingsWizardFormPropsInterface {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {SAMLProtocolSettingsWizardFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const SAMLProtocolSettingsWizardForm: FunctionComponent<SAMLProtocolSettingsWizardFormPropsInterface> = (
    props: SAMLProtocolSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit
    } = props;

    const [ assertionConsumerUrls, setAssertionConsumerUrls ] = useState("");
    const [ showAssertionConsumerUrlError, setAssertionConsumerUrlError ] = useState(false);

    useEffect(() => {
        setAssertionConsumerUrls("");
    }, []);

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
                        issuer: values.get("issuer") as string,
                        assertionConsumerUrls: (assertionConsumerUrls.split(","))
                    }
                }
            }
        };
    };

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>): void => {
                // check whether assertionConsumer url is empty or not
                if (isEmpty(assertionConsumerUrls)) {
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
                <URLInputComponent
                    urlState={ assertionConsumerUrls }
                    setURLState={ setAssertionConsumerUrls }
                    labelName={ "Assertion Consumer URLs" }
                    value={
                        initialValues?.inboundProtocolConfiguration?.saml?.manualConfiguration.assertionConsumerUrls?.
                        toString()
                    }
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
            </Grid>
        </Forms>
    );
};
