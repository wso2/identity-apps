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
import { Field, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider, Grid, Icon } from "semantic-ui-react";
import { AppConstants } from "../../../core/constants";

/**
 * Proptypes for the general settings wizard form component.
 */
interface GeneralSettingsWizardFormPropsInterface extends TestableComponentInterface {
    initialValues: any;
    triggerSubmit: boolean;
    templateValues: any;
    onSubmit: (values: any) => void;
}

/**
 * General settings wizard form component.
 *
 * @param {GeneralSettingsWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const GeneralSettingsWizardForm: FunctionComponent<GeneralSettingsWizardFormPropsInterface> = (
    props: GeneralSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    // Check whether discoverableByEndUsers option is selected or not
    const [ isDiscoverable, setIsDiscoverable ] = useState(false);

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {Record<string, unknown>} Prepared values.
     */
    const getFormValues = (values: any): Record<string, unknown> => {
        return {
            accessUrl: values.get("accessUrl").toString(),
            advancedConfigurations: {
                discoverableByEndUsers: !!values.get("discoverableByEndUsers").includes("discoverableByEndUsers")
            },
            description: values.get("description").toString(),
            imageUrl: values.get("imageUrl").toString(),
            name: values.get("name").toString()
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
                            label={ t("console:develop.features.applications.forms.generalDetails.fields.name.label") }
                            required={ true }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.generalDetails.fields.name" +
                                    ".validations.empty")
                            }
                            placeholder={
                                t("console:develop.features.applications.forms.generalDetails.fields.name.placeholder")
                            }
                            value={ initialValues?.name }
                            type="text"
                            data-testid={ `${ testId }-application-name-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="description"
                            label={
                                t("console:develop.features.applications.forms.generalDetails.fields.description" +
                                    ".label")
                            }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("console:develop.features.applications.forms.generalDetails.fields.description" +
                                    ".placeholder")
                            }
                            type="textarea"
                            value={ initialValues ? initialValues?.description : templateValues?.description }
                            data-testid={ `${ testId }-application-description-textarea` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="imageUrl"
                            label={
                                t("console:develop.features.applications.forms.generalDetails.fields.imageUrl.label")
                            }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("console:develop.features.applications.forms.generalDetails.fields.imageUrl" +
                                    ".placeholder")
                            }
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("console:develop.features.applications.forms.generalDetails.fields" +
                                            ".imageUrl.validations.invalid")
                                    );
                                }
                            } }
                            value={ initialValues ? initialValues?.imageUrl : templateValues?.imageUrl }
                            type="text"
                            data-testid={ `${ testId }-application-image-url-input` }
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
                                        label: t("console:develop.features.applications.forms.generalDetails.fields" +
                                            ".discoverable.label"),
                                        value: "discoverableByEndUsers"
                                    }
                                ] }
                                value={
                                    initialValues ?
                                        initialValues?.advancedConfigurations?.discoverableByEndUsers
                                            ? [ "discoverableByEndUsers" ] : []
                                        : templateValues?.advancedConfigurations?.discoverableByEndUsers
                                            ? [ "discoverableByEndUsers" ] : []
                                }
                                data-testid={ `${ testId }-application-discoverable-checkbox` }
                            />
                            <Hint compact>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.applications.forms.generalDetails." +
                                        "fields.discoverable.hint"
                                    }
                                >
                                    If an application is flagged as discoverable, it will be visible to end users in
                                    <a
                                        href={ AppConstants.getMyAccountPath() }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link external"
                                    >
                                        My Account
                                    </a>
                                    <Icon className="ml-1 link primary" name="external"></Icon>
                                </Trans>
                            </Hint>
                            <Divider hidden/>
                            <Field
                                name="accessUrl"
                                label={
                                    t("console:develop.features.applications.forms.generalDetails.fields" +
                                        ".accessUrl.label")
                                }
                                required={ isDiscoverable }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.generalDetails.fields.accessUrl" +
                                        ".validations.empty")
                                }
                                placeholder={
                                    t("console:develop.features.applications.forms.generalDetails.fields.accessUrl" +
                                        ".placeholder")
                                }
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.url(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("console:develop.features.applications.forms.generalDetails.fields" +
                                                ".accessUrl.validations.invalid")
                                        );
                                    }
                                } }
                                type="text"
                                value={ initialValues ? initialValues?.accessUrl : templateValues?.accessUrl }
                                data-testid={ `${ testId }-application-access-url-input` }
                            />
                            <Hint compact>
                                {
                                    t("console:develop.features.applications.forms.generalDetails.fields" +
                                    ".accessUrl.hint")
                                }
                            </Hint>
                        </Grid.Column>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the application general settings wizard form component.
 */
GeneralSettingsWizardForm.defaultProps = {
    "data-testid": "application-general-settings-wizard-form"
};
