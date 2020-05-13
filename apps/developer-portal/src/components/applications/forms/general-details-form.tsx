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
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { ApplicationInterface } from "../../../models";

/**
 * Proptypes for the applications general details form component.
 */
interface GeneralDetailsFormPopsInterface extends TestableComponentInterface {
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
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Form to edit general details of the application.
 *
 * @param {GeneralDetailsFormPopsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (
    props: GeneralDetailsFormPopsInterface
): ReactElement => {

    const {
        appId,
        name,
        description,
        discoverability,
        imageUrl,
        accessUrl,
        onSubmit,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

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
                discoverableByEndUsers: !!values.get("discoverableByEndUsers").includes("discoverable")
            },
            description: values.get("description").toString(),
            id: appId,
            imageUrl: values.get("imageUrl").toString(),
            name: values.get("name").toString()
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
            onSubmit={ (values): void => {
                onSubmit(updateConfigurations(values))
            } }
            onChange={ handleFormValuesOnChange }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="name"
                            label={ t("devPortal:components.applications.forms.generalDetails.fields.name.label") }
                            required={ true }
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.generalDetails.fields.name" +
                                    ".validations.empty")
                            }
                            placeholder={
                                t("devPortal:components.applications.forms.generalDetails.fields.name.placeholder")
                            }
                            type="text"
                            value={ name }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-name-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="description"
                            label={
                                t("devPortal:components.applications.forms.generalDetails.fields.description" +
                                    ".label")
                            }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("devPortal:components.applications.forms.generalDetails.fields.description" +
                                    ".placeholder")
                            }
                            type="textarea"
                            value={ description }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-description-textarea` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="imageUrl"
                            label={
                                t("devPortal:components.applications.forms.generalDetails.fields.imageUrl.label")
                            }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("devPortal:components.applications.forms.generalDetails.fields.imageUrl" +
                                    ".placeholder")
                            }
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("devPortal:components.applications.forms.generalDetails.fields" +
                                            ".imageUrl.validations.invalid")
                                    );
                                }
                            } }
                            value={ imageUrl }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-image-url-input` }
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
                                    label: t("devPortal:components.applications.forms.generalDetails.fields" +
                                        ".discoverable.label"),
                                    value: "discoverable"
                                }
                            ] }
                            value={ isDiscoverable ? [ "discoverable" ] : [] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-discoverable-checkbox` }
                        />
                        <Field
                            name="accessUrl"
                            label={
                                t("devPortal:components.applications.forms.generalDetails.fields.accessUrl.label")
                            }
                            required={ isDiscoverable }
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.generalDetails.fields.accessUrl" +
                                    ".validations.empty")
                            }
                            placeholder={
                                t("devPortal:components.applications.forms.generalDetails.fields.accessUrl" +
                                    ".placeholder")
                            }
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("devPortal:components.applications.forms.generalDetails.fields" +
                                            ".accessUrl.validations.invalid")
                                    );
                                }
                            } }
                            value={ accessUrl }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-access-url-input` }
                        />
                        <Hint>
                            { t("devPortal:components.applications.forms.generalDetails.fields.accessUrl.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                {
                    !readOnly && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button
                                    primary
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    data-testid={ `${ testId }-submit-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the applications general settings form.
 */
GeneralDetailsForm.defaultProps = {
    "data-testid": "application-general-settings-form"
};
