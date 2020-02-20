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
import React, { FunctionComponent, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import { ApplicationInterface } from "../../../models";
import { FormValidation } from "@wso2is/validation";

/**
 * Proptypes for the applications general details form component.
 */
interface GeneralDetailsFormPopsInterface {
    /**
     * Application access URL.
     */
    accessUrl?: string;
    /**
     * Currently editing application id.
     */
    appId?: string;
    /**
     * Application description.
     */
    description?: string;
    /**
     * Is the application discoverable.
     */
    discoverability?: boolean;
    /**
     * Application logo URL.
     */
    imageUrl?: string;
    /**
     * Name of the application.
     */
    name: string;
    /**
     * On submit callback.
     */
    onSubmit: (values: any) => void;
}

/**
 * Form to edit general details of the application.
 *
 * @param props GeneralDetailsFormPopsInterface.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (props): JSX.Element => {

    const {
        appId,
        name,
        description,
        discoverability,
        imageUrl,
        accessUrl,
        onSubmit
    } = props;

    const [ isDiscoverable, setDiscoverability ] = useState<boolean>(discoverability);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfigurations = (values: Map<string, FormValue>): ApplicationInterface => {
        return  {
            accessUrl: values.get("accessUrl").toString(),
            advancedConfigurations: {
                discoverableByEndUsers: !!values.get("discoverableByEndUsers").includes("discoverable"),
            },
            description: values.get("description").toString(),
            id: appId,
            imageUrl: values.get("imageUrl").toString(),
            name: values.get("name").toString(),
        };
    };

    /**
     * Handles form value change.
     *
     * @param {boolean} isPure - Is the form pure.
     * @param {Map<string, FormValue>} values - Form values
     */
    const handleFormValuesOnChange = (isPure: boolean, values: Map<string, FormValue>) => {
        // Set the discoverability based on the checkbox toggle.
        if (values.get("discoverableByEndUsers").includes("discoverable") !== isDiscoverable) {
            setDiscoverability(!!values.get("discoverableByEndUsers").includes("discoverable"));
        }
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(updateConfigurations(values))
            } }
            onChange={ handleFormValuesOnChange }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="name"
                            label="Application Name"
                            required={ true }
                            requiredErrorMessage="Application name is required"
                            placeholder={ name }
                            type="text"
                            value={ name }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="description"
                            label="Description"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter a description for the application"
                            type="textarea"
                            value={ description }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="imageUrl"
                            label="Application Image"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Enter a image url for the application"
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("This is not a valid URL");
                                }
                            } }
                            value={ imageUrl }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="discoverableByEndUsers"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: "Discoverable application",
                                    value: "discoverable"
                                }
                            ] }
                            value={ isDiscoverable ? [ "discoverable" ] : [] }
                        />
                        <Field
                            name="accessUrl"
                            label="Access URL"
                            required={ isDiscoverable }
                            requiredErrorMessage={ "A valid access URL needs to be defined for" +
                            " an application to be marked as discoverable" }
                            placeholder="Enter access url for the application login page"
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push("This is not a valid URL");
                                }
                            } }
                            value={ accessUrl }
                        />
                        <Hint>
                            Applications flagged as discoverable are visible for end users.
                        </Hint>
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
