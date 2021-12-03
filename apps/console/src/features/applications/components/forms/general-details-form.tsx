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
import { Field, Form } from "@wso2is/form";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState, UIConfigInterface } from "../../../core";
import { ApplicationManagementConstants } from "../../constants";

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
     * Set of hidden fields.
     */
    hiddenFields?: string[];
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
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Proptypes for the applications general details form error messages.
 */
export interface GeneralDetailsFormErrorValidationsInterface {
    /**
     *  Error message for the Application access URL.
     */
    accessUrl?: string;
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
        hiddenFields,
        imageUrl,
        accessUrl,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);

    const [ isDiscoverable, setDiscoverability ] = useState<boolean>(discoverability);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfigurations = (values) => {
        onSubmit({
            accessUrl: values.accessUrl?.toString(),
            advancedConfigurations: {
                discoverableByEndUsers: values.discoverableByEndUsers
            },
            description: values.description?.toString().trim(),
            id: appId,
            name: values.name?.toString(),
            ...!hiddenFields?.includes("imageUrl") && { imageUrl: values.imageUrl.toString() }
        });
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     *
     * @return {GeneralDetailsFormErrorValidationsInterface}
     */
    const validateForm = (values):
        GeneralDetailsFormErrorValidationsInterface => {

        const errors: GeneralDetailsFormErrorValidationsInterface = {
            accessUrl: undefined
        };

        if (isDiscoverable && !values.accessUrl) {
            errors.accessUrl = t("console:develop.features.applications.forms.generalDetails.fields.accessUrl" +
                ".validations.empty");
        }

        return errors;
    };

    /**
     * Application Name validation.
     *
     * @param {string} name - Application Name.
     * @return {string | void}
     */
    const validateName = (name: string): string | void => {

        const isValid: boolean = name && !!name.match(
            ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_PATTERN
        );

        if (!isValid) {
            return "Please enter a valid input.";
        }
    };

    /**
     * Application Description validation.
     *
     * @param {string} description - Application Description.
     * @return {string | void}
     */
    const validateDescription = (description: string): string | void => {

        const isValid: boolean = description && !!description.match(
            ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_DESCRIPTION_PATTERN
        );

        if (!isValid) {
            return "Please enter a valid input.";
        }
    };

    return (
        <Form
            uncontrolledForm={ false }
            onSubmit={ (values) => {
                updateConfigurations(values);
            } }
            initialValues={ {
                accessUrl: accessUrl,
                description: description,
                name: name
            } }
            validate={ validateForm }
        >
            { !UIConfig.systemAppsIdentifiers.includes(name) && (
                <Field.Input
                    ariaLabel="Application name"
                    inputType="name"
                    name="name"
                    label={
                        t("console:develop.features.applications.forms.generalDetails.fields.name" +
                            ".label")
                    }
                    required={ true }
                    placeholder={
                        t("console:develop.features.applications.forms.generalDetails.fields.name" +
                            ".placeholder")
                    }
                    value={ name }
                    readOnly={ readOnly }
                    validation ={ (value) => validateName(value.toString().trim()) }
                    maxLength={ ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH }
                    minLength={ 3 }
                    data-testid={ `${ testId }-application-name-input` }
                    width={ 16 }
                />
            ) }
            <Field.Textarea
                ariaLabel="Application description"
                name="description"
                label={
                    t("console:develop.features.applications.forms.generalDetails.fields.description" +
                        ".label")
                }
                required={ false }
                placeholder={
                    t("console:develop.features.applications.forms.generalDetails.fields.description" +
                        ".placeholder")
                }
                value={ description }
                readOnly={ readOnly }
                validation ={ (value) => validateDescription(value.toString().trim()) }
                maxLength={ 300 }
                minLength={ 3 }
                data-testid={ `${ testId }-application-description-textarea` }
                hint={ t("console:develop.features.applications.forms.generalDetails.fields.description." +
                    "description") }
                width={ 16 }
            />
            {
                <Field.Input
                    ariaLabel="Application image URL"
                    inputType="url"
                    name="imageUrl"
                    label={
                        t("console:develop.features.applications.forms.generalDetails" +
                            ".fields.imageUrl.label")
                    }
                    required={ false }
                    placeholder={
                        t("console:develop.features.applications.forms.generalDetails" +
                            ".fields.imageUrl.placeholder")
                    }
                    value={ imageUrl }
                    readOnly={ readOnly }
                    data-testid={ `${ testId }-application-image-url-input` }
                    maxLength={ 200 }
                    minLength={ 3 }
                    hint={
                        t("console:develop.features.applications.forms.generalDetails" +
                            ".fields.imageUrl.hint")
                    }
                    width={ 16 }
                    hidden={ hiddenFields?.includes("imageUrl") }
                />
            }
            <Field.Checkbox
                ariaLabel="Make application discoverable by end users"
                name="discoverableByEndUsers"
                required={ false }
                label={ t("console:develop.features.applications.forms.generalDetails.fields" +
                            ".discoverable.label") }
                initialValue={ isDiscoverable }
                readOnly={ readOnly }
                data-testid={ `${ testId }-application-discoverable-checkbox` }
                listen={ (value) => setDiscoverability(value) }
                hint={ (
                    <Trans
                        i18nKey={
                            "console:develop.features.applications.forms.generalDetails.fields." +
                            "discoverable.hint"
                        }
                        tOptions={ { myAccount: "My Account" } }
                    >
                        Please type
                        <strong data-testid="application-name-assertion">
                            My Account
                        </strong>
                    </Trans>
                ) }
                width={ 16 }
            />
            <Field.Input
                ariaLabel="Application access URL"
                inputType="url"
                name="accessUrl"
                label={
                    t("console:develop.features.applications.forms.generalDetails.fields.accessUrl.label")
                }
                required={ isDiscoverable }
                placeholder={
                    t("console:develop.features.applications.forms.generalDetails.fields.accessUrl" +
                        ".placeholder")
                }
                value={ accessUrl }
                readOnly={ readOnly }
                maxLength={ 200 }
                minLength={ 3 }
                data-testid={ `${ testId }-application-access-url-input` }
                hint={ t("console:develop.features.applications.forms.generalDetails.fields.accessUrl.hint") }
                width={ 16 }
            />
            <Field.Button
                size="small"
                buttonType="primary_btn"
                ariaLabel="Update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={ readOnly }
            />
        </Form>
    );
};

/**
 * Default props for the applications general settings form.
 */
GeneralDetailsForm.defaultProps = {
    "data-testid": "application-general-settings-form"
};
