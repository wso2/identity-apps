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
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Grid } from "semantic-ui-react";
import { FormValidation } from "@wso2is/validation";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface PassiveStsSettingsWizardFormPropsInterface {
    initialValues: any;
    templateValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {PassiveStsSettingsWizardFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const PassiveStsProtocolSettingsWizardForm: FunctionComponent<PassiveStsSettingsWizardFormPropsInterface> = (
    props: PassiveStsSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit
    } = props;

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>): any => {
        return {
            inboundProtocolConfiguration: {
                passiveSts: {
                    realm: values.get("realm"),
                    replyTo: values.get("replyTo")
                }
            }
        };
    };

    return (templateValues &&
        <Forms
            onSubmit={ (values: Map<string, FormValue>): void => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="realm"
                            label="Realm"
                            required={ true }
                            requiredErrorMessage="Enter the realm."
                            placeholder="Enter realm."
                            type="text"
                            value={ initialValues?.realm || templateValues?.realm }
                        />
                        <Hint>Enter realm identifier for passive sts</Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="replyTo"
                            label="Reply URL"
                            required={ true }
                            requiredErrorMessage="Enter the reply url."
                            placeholder="Enter url."
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("This is not a valid URL");
                                }
                            } }
                            type="text"
                            value={ initialValues?.replyTo || templateValues?.replyTo }
                        />
                        <Hint>Enter RP endpoint URL that handles the response.</Hint>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
