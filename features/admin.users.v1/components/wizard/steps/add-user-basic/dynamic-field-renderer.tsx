/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { ProfileConstants } from "@wso2is/core/constants";
import {
    ClaimInputFormat,
    IdentifiableComponentInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { CheckboxFieldAdapter, FinalFormField, SwitchFieldAdapter } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import CheckBoxGroupFormField from "../../../user-profile/fields/check-box-group-form-field";
import CountryField from "../../../user-profile/fields/country-field";
import DropdownFormField from "../../../user-profile/fields/dropdown-form-field";
import LocaleField from "../../../user-profile/fields/locale-field";
import MultiValuedTextField from "../../../user-profile/fields/multi-valued-text-field";
import RadioGroupFormField from "../../../user-profile/fields/radio-group-form-field";
import TextFormField from "../../../user-profile/fields/text-form-field";

/**
 * User add wizard form field renderer component props interface.
 */
interface DynamicFieldRendererPropsInterface extends IdentifiableComponentInterface {
    /**
     * Attribute schema.
     */
    schema: ProfileSchemaInterface;
    /**
     * Flattened initial values.
     */
    initialValues: Map<string, string>;
    /**
     * Whether the user profile is being updated.
     */
    isUpdating: boolean;
}

/**
 * User add wizard form field renderer component.
 * Renders the appropriate form field for a given SCIM profile schema entry.
 *
 * This component inspects the provided `schema` and renders one of several
 * specialized field components (e.g., country, locale, date of birth,
 * multi-valued text, dropdowns, checkboxes, toggles, etc.).
 * Email and Mobile number fields are not handled by this component.
 */
const DynamicFieldRenderer: FunctionComponent<DynamicFieldRendererPropsInterface> = ({
    schema,
    initialValues,
    isUpdating,
    ["data-componentid"]: componentId = "profile-form-field-renderer"
}: DynamicFieldRendererPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const fieldLabel: string = t("user:profile.fields." + schema.name.replace(".", "_"), {
        defaultValue: schema.displayName
    });
    const fieldComponentId: string = `${ componentId }-${ schema.name }`;
    // Replace dots with __DOT__ to avoid issues with dot separated field names.
    const encodedSchemaId: string = schema.schemaId.replace(/\./g, "__DOT__");

    const isRequired: boolean = true;

    const maxLength: number = schema.maxLength ?? ProfileConstants.CLAIM_VALUE_MAX_LENGTH;

    const genericValidator = (value: unknown): string | undefined => {
        // Validate the required field.
        if (isEmpty(value) && isRequired) {
            return (
                t("user:profile.forms.generic.inputs.validations.required", { fieldName: fieldLabel })
            );
        }

        // Validate the format of the value against the regex pattern.
        if (!isEmpty(value) && !RegExp(schema.regEx).test(value as string)) {
            return (
                t("users:forms.validation.formatError", { field: fieldLabel })
            );
        }

        return undefined;
    };

    /**
     * Render country field. Specially handled to load and render country list.
     */
    if (schema.schemaUri === ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA_ATTRIBUTES.country) {
        return (
            <CountryField
                fieldLabel={ fieldLabel }
                fieldName={ `${encodedSchemaId}.${schema.name}` }
                initialValue={ initialValues.get(schema.name) }
                isUpdating={ isUpdating }
                isRequired={ isRequired }
                validator={ genericValidator }
                validateFields={ [] }
                data-componentid={ fieldComponentId }
            />
        );
    }

    /**
     * Render locale field. Specially handled to load and render locale list.
     */
    if (schema.name === "locale") {
        return (
            <LocaleField
                fieldLabel={ fieldLabel }
                fieldName={ schema.name }
                initialValue={ initialValues.get(schema.name) }
                isUpdating={ isUpdating }
                isRequired={ isRequired }
                validator={ genericValidator }
                validateFields={ [] }
                data-componentid={ fieldComponentId }
            />
        );
    }

    /**
     * Render date of birth field. Specially handled to use special validator.
     */
    if (schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB")) {
        return (
            <TextFormField
                fieldName={ `${encodedSchemaId}.${schema.name}` }
                fieldLabel={ fieldLabel }
                initialValue={ initialValues.get(schema.name) }
                validator={ genericValidator }
                validateFields={ [] }
                placeholder="YYYY-MM-DD"
                maxLength={ maxLength }
                isRequired={ isRequired }
                isUpdating={ isUpdating }
                data-componentid={ fieldComponentId }
            />
        );
    }

    const inputType: ClaimInputFormat = schema.inputFormat?.inputType ?? ClaimInputFormat.TEXT_INPUT;
    const isMultiValued: boolean = schema.multiValued;
    let fieldName: string = schema.name;
    let initialValue: unknown = initialValues.get(schema.name);

    if (isMultiValued) {
        // For multi-valued attributes, values are comma separated.
        // Prepare the initial value as an array.
        initialValue = (initialValues.get(schema.name) as string)?.split(",");
    }

    /**
     * For extended SCIM schemas, the field name is prefixed with the schema ID.
     * Ex: "urn:scim:wso2:schema.country"
     */
    if (schema.extended) {
        fieldName = `${encodedSchemaId}.${schema.name}`;
    }

    if (isMultiValued) {
        switch (inputType) {
            case ClaimInputFormat.CHECKBOX_GROUP:
                return (
                    <CheckBoxGroupFormField
                        schema={ schema }
                        fieldLabel={ fieldLabel }
                        fieldName={ fieldName }
                        initialValue={ initialValue as string[] }
                        isUpdating={ isUpdating }
                        isRequired={ isRequired }
                        validateFields={ [] }
                        data-componentid={ fieldComponentId }
                    />
                );

            case ClaimInputFormat.MULTI_SELECT_DROPDOWN:
                return (
                    <DropdownFormField
                        schema={ schema }
                        fieldLabel={ fieldLabel }
                        fieldName={ fieldName }
                        initialValue={ initialValue as string[] }
                        isUpdating={ isUpdating }
                        isRequired={ isRequired }
                        validateFields={ [] }
                        data-componentid={ fieldComponentId }
                        isMultiSelect
                    />
                );

            case ClaimInputFormat.NUMBER_INPUT:
                return (
                    <MultiValuedTextField
                        schema={ schema }
                        fieldName={ fieldName }
                        fieldLabel={ fieldLabel }
                        initialValue={ initialValue as string[] }
                        type="number"
                        isRequired={ isRequired }
                        isUpdating={ isUpdating }
                        maxValueLimit={ ProfileConstants.MAX_MULTI_VALUES_ALLOWED }
                        data-componentid={ fieldComponentId }
                    />
                );

            case ClaimInputFormat.TEXT_INPUT:
            default:
                return (
                    <MultiValuedTextField
                        schema={ schema }
                        fieldName={ fieldName }
                        fieldLabel={ fieldLabel }
                        initialValue={ initialValue as string[] }
                        isRequired={ isRequired }
                        isUpdating={ isUpdating }
                        maxValueLimit={ ProfileConstants.MAX_MULTI_VALUES_ALLOWED }
                        data-componentid={ fieldComponentId }
                    />
                );
        }
    }

    switch (inputType) {
        case ClaimInputFormat.NUMBER_INPUT:
            return (
                <TextFormField
                    fieldName={ fieldName }
                    fieldLabel={ fieldLabel }
                    initialValue={ initialValue as string }
                    type="number"
                    validator={ genericValidator }
                    maxLength={ maxLength }
                    isRequired={ isRequired }
                    isUpdating={ isUpdating }
                    data-componentid={ fieldComponentId }
                />
            );

        case ClaimInputFormat.CHECKBOX:
            return (
                <FinalFormField
                    component={ CheckboxFieldAdapter }
                    ariaLabel={ fieldLabel }
                    label={ fieldLabel }
                    name={ fieldName }
                    initialValue={ initialValue ?? false }
                    readOnly={ isUpdating }
                    disabled={ isUpdating }
                    data-componentid={ fieldComponentId }
                />
            );

        case ClaimInputFormat.TOGGLE:
            return (
                <FinalFormField
                    component={ SwitchFieldAdapter }
                    ariaLabel={ fieldLabel }
                    label={ fieldLabel }
                    name={ fieldName }
                    initialValue={ initialValue ?? false }
                    readOnly={ isUpdating }
                    disabled={ isUpdating }
                    data-componentid={ fieldComponentId }
                />
            );

        case ClaimInputFormat.DROPDOWN:
            return (
                <DropdownFormField
                    schema={ schema }
                    fieldLabel={ fieldLabel }
                    fieldName={ fieldName }
                    initialValue={ initialValue as string }
                    isUpdating={ isUpdating }
                    isRequired={ isRequired }
                    data-componentid={ fieldComponentId }
                />
            );

        case ClaimInputFormat.RADIO_GROUP:
            return (
                <RadioGroupFormField
                    schema={ schema }
                    fieldLabel={ fieldLabel }
                    fieldName={ fieldName }
                    initialValue={ initialValue as string }
                    isUpdating={ isUpdating }
                    isRequired={ isRequired }
                    validator={ genericValidator }
                    data-componentid={ fieldComponentId }
                />
            );

        default:
            return (
                <TextFormField
                    fieldName={ fieldName }
                    fieldLabel={ fieldLabel }
                    initialValue={ initialValue as string }
                    validator={ genericValidator }
                    maxLength={ maxLength }
                    isRequired={ isRequired }
                    isUpdating={ isUpdating }
                    validateFields={ [] }
                    data-componentid={ fieldComponentId }
                />
            );
    }
};

export default DynamicFieldRenderer;
