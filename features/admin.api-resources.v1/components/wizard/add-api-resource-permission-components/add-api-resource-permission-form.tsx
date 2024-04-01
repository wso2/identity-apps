/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../../admin-core-v1";
import { getAPIResourcePermissions } from "../../../api";
import { APIResourcesConstants } from "../../../constants";
import { APIResourcePermissionInterface } from "../../../models";

/**
 * Prop-types for the API resources page component.
 */
interface AddAPIResourceBasicInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * trigger submission
     */
    triggerAddPermission: boolean;
    /**
     * Current permission validation loading status.
     */
    permissionValidationLoading: boolean;
    /**
     * Add permission to the list
     */
    addPermission: (permission: APIResourcePermissionInterface) => void;
    /**
     * Set is submitting
     */
    setIsSubmitting: (isSubmitting: boolean) => void;
    /**
     * Set current permission validation loading status.
     */
    setPermissionValidationLoading: (loading: boolean) => void;
}

const FORM_ID: string = "apiResource-general-details";

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const AddAPIResourcePermissionForm: FunctionComponent<AddAPIResourceBasicInterface> = (
    props: AddAPIResourceBasicInterface
): ReactElement => {

    const {
        permissionValidationLoading,
        triggerAddPermission,
        addPermission,
        setIsSubmitting,
        setPermissionValidationLoading,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const submitAddPermission = (values: Map<string, FormValue>): void => {
        const permission: APIResourcePermissionInterface = {
            description: values.get("description").toString(),
            displayName: values.get("displayName").toString(),
            name: values.get("identifier").toString()
        };

        setIsSubmitting(true);

        addPermission(permission);
    };

    return (
        <Forms
            data-componentid={ `${componentId}-form` }
            onSubmit={ submitAddPermission }
            id={ FORM_ID }
            submitState={ triggerAddPermission }
            uncontrolledForm={ false }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field
                            type="text"
                            name="identifier"
                            label={ t("apiResources:tabs.scopes.form.fields.scope.label") }
                            placeholder={ t("apiResources:tabs.scopes.form.fields." +
                                "scope.placeholder") }
                            required={ true }
                            tabIndex={ 1 }
                            requiredErrorMessage={ t("apiResources:wizard.addApiResource.steps." +
                                "scopes.form.fields.permission.emptyValidate") }
                            validation={ async (value: string, validation: Validation) => {

                                setPermissionValidationLoading(true);

                                if (value) {
                                    if (!APIResourcesConstants.checkValidPermissionIdentifier(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(t("apiResources:wizard." +
                                            "addApiResource.steps.scopes.form.fields.permission.invalid"));
                                    } else {
                                        const filter: string = "name eq " + value;

                                        const response: APIResourcePermissionInterface[] =
                                            await getAPIResourcePermissions(filter);

                                        if (response?.length > 0) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(t("apiResources:wizard." +
                                            "addApiResource.steps.scopes.form.fields.permission.uniqueValidate"));
                                        }
                                    }

                                    setPermissionValidationLoading(false);
                                }
                            } }
                            data-testid={ `${componentId}-identifier` }
                            loading={ permissionValidationLoading }
                        />
                        <Hint>
                            <Trans
                                i18nKey= { "apiResources:wizard.addApiResource.steps." +
                                    "scopes.form.fields.scope.hint" }>
                                A unique value that acts as the scope when requesting an access token.&nbsp;
                                <b>Note that the scope cannot be modified once created.</b>
                            </Trans>
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field
                            type="text"
                            name="displayName"
                            label={ t("extensions:develop.apiResource.tabs.permissions.form.fields.displayName.label") }
                            placeholder={ t("extensions:develop.apiResource.tabs.permissions.form.fields." +
                                "displayName.placeholder") }
                            required={ true }
                            tabIndex={ 2 }
                            requiredErrorMessage={ t("extensions:develop.apiResource.tabs.permissions.form.fields." +
                                "displayName.emptyValidate") }
                            data-testid={ `${componentId}-displayName` }
                        />
                        <Hint>
                            { t("extensions:develop.apiResource.wizard.addApiResource.steps." +
                                "permissions.form.fields.displayName.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field
                            type="text"
                            name="description"
                            label={ t("apiResources:tabs.scopes.form.fields.description.label") }
                            placeholder={ t("apiResources:tabs.scopes.form.fields." +
                                "description.placeholder") }
                            tabIndex={ 3 }
                            data-testid={ `${componentId}-description` }
                        />
                        <Hint>
                            { t("apiResources:wizard.addApiResource.steps." +
                                "scopes.form.fields.description.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the component.
 */
AddAPIResourcePermissionForm.defaultProps = {
    "data-componentid": "add-api-resource-permission-form"
};
