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
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Divider, Grid } from "semantic-ui-react";

/**
 * Proptypes for the general settings wizard form component.
 */
interface GeneralSettingsWizardFormPropsInterface {
    initialValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * General settings wizard form component.
 *
 * @param {GeneralSettingsWizardFormPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const GeneralSettingsWizardForm: FunctionComponent<GeneralSettingsWizardFormPropsInterface> = (
    props: GeneralSettingsWizardFormPropsInterface
): JSX.Element => {

    const {
        initialValues,
        triggerSubmit,
        onSubmit
    } = props;

    // Check whether discoverableByEndUsers option is selected or not
    const [isDiscoverable, setIsDiscoverable] = useState(false);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: any): object => {
        return {
            accessUrl: values.get("accessUrl").toString(),
            advancedConfigurations: {
                discoverableByEndUsers: !!values.get("discoverableByEndUsers").includes("discoverableByEndUsers"),
            },
            description: values.get("description").toString(),
            imageUrl: values.get("imageUrl").toString(),
            name: values.get("name").toString(),
        };
    };

    return (
        <Forms
            onSubmit={ (values) => onSubmit(getFormValues(values)) }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="name"
                            label="Name"
                            required={ true }
                            requiredErrorMessage="Application name is required"
                            placeholder={ "Enter Application Name" }
                            value={ initialValues?.name }
                            type="text"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="description"
                            label="Description"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter a description for the application"
                            type="textarea"
                            value={ initialValues?.description }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="imageUrl"
                            label="Image URL"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Provide the image url for the application"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("The URL you entered is invalid");
                                }
                            } }
                            value={ initialValues?.imageUrl  }
                            type="text"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name="discoverableByEndUsers"
                                required={ false }
                                requiredErrorMessage=""
                                type="checkbox"
                                listen={
                                    (values) => {
                                        setIsDiscoverable(
                                            values.get("discoverableByEndUsers").includes("discoverableByEndUsers")
                                        );
                                    }
                                }
                                children={ [
                                    {
                                        label: "Discoverable application",
                                        value: "discoverableByEndUsers"
                                    }
                                ] }
                                value={
                                    initialValues?.advancedConfigurations?.discoverableByEndUsers
                                        ? [ "discoverableByEndUsers" ]
                                        : []
                                }
                            />
                            <Hint>
                                Applications flagged as discoverable are visible for end users.
                            </Hint>
                            <Divider hidden/>
                            <Field
                                name="accessUrl"
                                label="Access URL"
                                required={ isDiscoverable }
                                requiredErrorMessage={ "A valid access URL needs to be defined for an application " +
                                    "to be marked as discoverable" }
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.url(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push("The URL you entered is invalid");
                                    }
                                } }
                                placeholder="Enter access url for the application login page"
                                type="text"
                                value={ initialValues?.accessUrl }
                            />
                        </Grid.Column>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
