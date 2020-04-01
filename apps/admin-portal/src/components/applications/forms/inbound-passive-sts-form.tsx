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

import { Field, Forms, Validation } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { Button, Grid } from "semantic-ui-react";
import { PassiveStsConfigurationInterface } from "../../../models";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";

/**
 * Proptypes for the inbound Passive Sts form component.
 */
interface InboundPassiveStsFormPropsInterface {
    initialValues: PassiveStsConfigurationInterface;
    onSubmit: (values: any) => void;
}

/**
 * Inbound Passive Sts protocol configurations form.
 *
 * @param {InboundPassiveStsFormPropsInterface} props
 * @return {ReactElement}
 */
export const InboundPassiveStsForm: FunctionComponent<InboundPassiveStsFormPropsInterface> = (
    props: InboundPassiveStsFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit
    } = props;

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {

        return {
            realm: values.get("realm"),
            replyTo: values.get("replyTo")
        }
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(updateConfiguration(values));
            } }
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
                            value={ initialValues?.realm }
                            readOnly
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
                            placeholder="Enter url"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("This is not a valid URL");
                                }
                            } }
                            type="text"
                            value={ initialValues?.replyTo }
                        />
                        <Hint>Enter RP endpoint URL that handles the response.</Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Button primary type="submit" size="small" className="form-button">
                            Update
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
