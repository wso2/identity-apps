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
import React, { FunctionComponent, useRef } from "react";
import { Button, Grid } from "semantic-ui-react";
import { ApplicationBasicWizard } from "../../../models";

interface GeneralSettingsProps {
    applicationData: ApplicationBasicWizard;
    setApplicationData: any;
    triggerSubmit: boolean;
    next: any;
    cancel: any;
    loadTemplate: any;
    onSubmit: (values: any) => void;
}

/**
 * General settings in the application wizard.
 *
 * @param props GeneralSettingsProps.
 */
export const WizardGeneralSettings: FunctionComponent<GeneralSettingsProps> = (props): JSX.Element => {

    const {
        applicationData,
        setApplicationData,
        next,
        cancel,
        loadTemplate,
        triggerSubmit,
        onSubmit
    } = props;

    const form = useRef(null);

    const handleSubmit = (values) => {
        const submit: ApplicationBasicWizard = {
            accessUrl: values.get("accessUrl").toString(),
            description: values.get("description").toString(),
            discoverableByEndUsers:
                (values.get("advanceConfiguration").includes("discoverableByEndUsers") ? true : false),
            imageUrl: values.get("imageUrl").toString(),
            name: values.get("name").toString(),
        };
        setApplicationData(submit);
        loadTemplate();
        next();
    };

    return (
        <Forms
            // ref={ form }
            onSubmit={ (values) => {
                handleSubmit(values);
            } }
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
                            value={ applicationData && applicationData.name }
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
                            value={ applicationData && applicationData.description }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="imageUrl"
                            label="ImageUrl"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Provide the image url for the application"
                            value={ applicationData && applicationData.imageUrl }
                            type="text"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name="advanceConfiguration"
                                required={ false }
                                requiredErrorMessage=""
                                type="checkbox"
                                children={ [
                                    {
                                        label: "Discoverable application",
                                        value: "discoverableByEndUsers"
                                    }
                                ] }
                                value={ applicationData?.discoverableByEndUsers ? [ "discoverableByEndUsers" ] : [] }
                            />
                            <Field
                                name="accessUrl"
                                label="Access URL"
                                required={ false }
                                requiredErrorMessage={ "A valid access URL needs to be defined for an application " +
                                "to be marked as discoverable" }
                                placeholder="Enter access url for the application login page"
                                type="text"
                                value={ applicationData?.accessUrl }
                            />
                            <Hint>
                                Applications flagged as discoverable are visible for end users.
                            </Hint>
                        </Grid.Column>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 }>
                        <Button onClick={ cancel } size="small" className="form-button">
                            Back
                        </Button>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }/>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 3 }>
                        <Button primary type="submit" size="small" className="form-button">
                            Next
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};
