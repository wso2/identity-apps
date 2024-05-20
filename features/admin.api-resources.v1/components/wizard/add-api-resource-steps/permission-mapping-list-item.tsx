/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { ExtendedFeatureConfigInterface } from "@wso2is/admin.extensions.v1/configs/models";
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { getAPIResourcePermissions } from "../../../api";
import { APIResourcesConstants } from "../../../constants";
import { APIResourcePermissionInterface, PermissionMappingInterface } from "../../../models";

/**
 * Prop-types for the API resources page component.
 */
interface PermissionMappingListItemInterface extends SBACInterface<ExtendedFeatureConfigInterface>,
    IdentifiableComponentInterface, PermissionMappingInterface {
    /**
     * Trigger add permission form submit action.
     */
    triggerAddPermission: boolean;
    /**
     * Permission value loading status.
     */
    isPermissionValidationLoading: boolean;
    /**
     * Set the trigger add permission form submit action.
     */
    setAddPermission: () => void;
    /**
     * Set the latest permission form values.
     */
    setLatestPermissionFormValues: (formValue: Map<string, FormValue>) => void;
    /**
     * Set the permission value loading status.
     */
    setPermissionValidationLoading: (status: boolean) => void;
}

const FORM_ID: string = "apiResource-general-details";

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const PermissionMappingListItem: FunctionComponent<PermissionMappingListItemInterface> = (
    props: PermissionMappingListItemInterface
): ReactElement => {

    const {
        isPermissionValidationLoading,
        addedPermissions,
        triggerAddPermission,
        setAddPermission,
        updatePermissions,
        setLatestPermissionFormValues,
        setPermissionValidationLoading,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ resetForm, setResetForm ] = useTrigger();

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const submitNewPermission = (values: Map<string, FormValue>): void => {
        const permission: APIResourcePermissionInterface = {
            description: values.get("description").toString(),
            displayName: values.get("displayName").toString(),
            name: values.get("identifier").toString()
        };

        // Update the permissions map
        updatePermissions(permission, "set");
        setLatestPermissionFormValues(undefined);

        // reset the form
        setResetForm();
    };

    return (
        <Forms
            data-testid={ `${componentId}-form` }
            onSubmit={ submitNewPermission }
            id={ FORM_ID }
            submitState={ triggerAddPermission }
            uncontrolledForm={ false }
            resetState  = { resetForm }
            onChange= { (isPure: boolean, values: Map<string, FormValue>) => setLatestPermissionFormValues(values) }
        >
            <Grid>
                <Grid.Row columns={ 2 } padded="vertically">
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="identifier"
                            label={ t("extensions:develop.apiResource.wizard.addApiResource.steps.permissions.form." +
                                "fields.permission.label") }
                            placeholder={ t("extensions:develop.apiResource.wizard.addApiResource.steps.permissions." +
                                "form.fields.permission.placeholder") }
                            requiredErrorMessage={ t("extensions:develop.apiResource.wizard.addApiResource.steps." +
                                "permissions.form.fields.permission.emptyValidate") }
                            loading={ isPermissionValidationLoading }
                            validation={ async (value: string, validation: Validation) => {

                                setPermissionValidationLoading(true);

                                if (value) {
                                    if (!APIResourcesConstants.checkValidPermissionIdentifier(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(t("extensions:develop.apiResource.wizard." +
                                            "addApiResource.steps.permissions.form.fields.permission.invalid"));
                                    } else if (addedPermissions.has(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(t("extensions:develop.apiResource.wizard." +
                                        "addApiResource.steps.permissions.form.fields.permission.uniqueValidate"));
                                    } else {

                                        const filter: string = "name eq " + value;

                                        const response: APIResourcePermissionInterface[] =
                                            await getAPIResourcePermissions(filter);

                                        if (response?.length > 0) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(t("extensions:develop.apiResource.wizard." +
                                            "addApiResource.steps.permissions.form.fields.permission.uniqueValidate"));
                                        }
                                    }

                                    setPermissionValidationLoading(false);
                                }
                            } }
                            required={ true }
                            tabIndex={ 1 }
                            data-testid={ `${componentId}-identifier` }
                        />
                        <Hint>
                            <Trans
                                i18nKey= { "extensions:develop.apiResource.wizard.addApiResource.steps." +
                                    "permissions.form.fields.permission.hint" }>
                                A unique value that acts as the scope when requesting an access token.
                                <b>Note that the permission cannot be modified once created.</b>
                            </Trans>
                        </Hint>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            type="text"
                            name="displayName"
                            label={ t("extensions:develop.apiResource.wizard.addApiResource.steps.permissions.form." +
                                "fields.displayName.label") }
                            placeholder={ t("extensions:develop.apiResource.wizard.addApiResource.steps.permissions." +
                                "form.fields.displayName.placeholder") }
                            requiredErrorMessage={ t("extensions:develop.apiResource.wizard.addApiResource.steps." +
                                "permissions.form.fields.displayName.emptyValidate") }
                            required={ true }
                            tabIndex={ 2 }
                            data-testid={ `${componentId}-displayName` }
                        />
                        <Hint>
                            { t("extensions:develop.apiResource.wizard.addApiResource.steps." +
                                "permissions.form.fields.displayName.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 } className="pt-0 pb-0">
                    <Grid.Column width={ 16 }>
                        <Field
                            type="text"
                            name="description"
                            label={ t("extensions:develop.apiResource.wizard.addApiResource.steps.permissions.form." +
                                "fields.description.label") }
                            placeholder={ t("extensions:develop.apiResource.wizard.addApiResource.steps.permissions." +
                                "form.fields.description.placeholder") }
                            tabIndex={ 3 }
                            data-testid={ `${componentId}-description` }
                        />
                        <Hint>
                            { t("extensions:develop.apiResource.wizard.addApiResource.steps." +
                                "permissions.form.fields.description.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 } textAlign="right">
                        <Field
                            type="button"
                            form={ FORM_ID }
                            size="small"
                            tabIndex={ 4 }
                            buttonType="primary_btn"
                            name="submit-button"
                            icon="add"
                            value={ t("extensions:develop.apiResource.wizard.addApiResource.steps.permissions.form." +
                                "button") }
                            loading={ isPermissionValidationLoading }
                            data-testid={ `${componentId}-add-permission-btn` }
                            onClick={ setAddPermission } />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the component.
 */
PermissionMappingListItem.defaultProps = {
    "data-componentid": "permission-mapping-list-item"
};
