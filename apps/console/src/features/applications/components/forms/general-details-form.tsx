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
import { FormValue } from "@wso2is/forms";
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
                discoverableByEndUsers: !!values.discoverableByEndUsers?.includes("discoverable")
            },
            description: values.description?.toString(),
            id: appId,
            name: values.name?.toString(),
            ...!hiddenFields?.includes("imageUrl") && { imageUrl: values.get("imageUrl")?.toString() }
        });
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
        <Form
            onSubmit={ (values, form) => {
                updateConfigurations(values);
            } }
        >
            { !UIConfig.systemAppsIdentifiers.includes(name) && (
                <Field
                    ariaLabel="Application name"
                    fieldType="resourceName"
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
                    type="text"
                    readOnly={ readOnly }
                    maxLength={ ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH }
                    data-testid={ `${ testId }-application-name-input` }
                    width={ 16 }
                />
            ) }
            <Field
                ariaLabel="Application description"
                fieldType="name"
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
                type="textarea"
                value={ description }
                readOnly={ readOnly }
                data-testid={ `${ testId }-application-description-textarea` }
                hint={ t("console:develop.features.applications.forms.generalDetails.fields.description." +
                    "description") }
                width={ 16 }
            />
            {
                <Field
                    ariaLabel="Application image URL"
                    fieldType="url"
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
                    type="text"
                    value={ imageUrl }
                    readOnly={ readOnly }
                    data-testid={ `${ testId }-application-image-url-input` }
                    hint={
                        t("console:develop.features.applications.forms.generalDetails" +
                            ".fields.imageUrl.hint")
                    }
                    width={ 16 }
                />
            }
            <Field
                ariaLabel="Make application discoverable by end users"
                fieldType="checkbox"
                name="discoverableByEndUsers"
                required={ false }
                type="checkbox"
                label={ t("console:develop.features.applications.forms.generalDetails.fields" +
                            ".discoverable.label") }
                value={ isDiscoverable ? [ "discoverable" ] : [] }
                readOnly={ readOnly }
                data-testid={ `${ testId }-application-discoverable-checkbox` }
                hint={
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
                }
                width={ 16 }
            />
            <Field
                ariaLabel="Application access URL"
                fieldType="url"
                name="accessUrl"
                label={
                    t("console:develop.features.applications.forms.generalDetails.fields.accessUrl.label")
                }
                required={ isDiscoverable }
                placeholder={
                    t("console:develop.features.applications.forms.generalDetails.fields.accessUrl" +
                        ".placeholder")
                }
                type="text"
                value={ accessUrl }
                readOnly={ readOnly }
                data-testid={ `${ testId }-application-access-url-input` }
                hint={ t("console:develop.features.applications.forms.generalDetails.fields.accessUrl.hint") }
                width={ 16 }
            />
            {
                !readOnly && (
                    <Field
                        size="small"
                        fieldType="primary-btn"
                        ariaLabel="Update button"
                        name="update-button"
                        type="button"
                        data-testid={ `${ testId }-submit-button` }
                        disabled={ false }
                        label="Update"
                    />
                )
            }
        </Form>
    );
};

/**
 * Default props for the applications general settings form.
 */
GeneralDetailsForm.defaultProps = {
    "data-testid": "application-general-settings-form"
};
