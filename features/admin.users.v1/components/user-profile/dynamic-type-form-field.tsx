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

// import DateTimePicker from "@oxygen-ui/react/DateTimePicker";
import { ProfileConstants } from "@wso2is/core/constants";
import { ClaimDataType, IdentifiableComponentInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import { AutocompleteFieldAdapter, CheckboxFieldAdapter, FinalFormField, TextFieldAdapter } from "@wso2is/form";
import isEmpty from "lodash-es/isEmpty";
import React from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";

interface DynamicTypeFormFieldPropsInterface extends IdentifiableComponentInterface {
    /**
     * The key for the field.
     */
    key: number;
    /**
     * The schema of the profile.
     */
    schema: ProfileSchemaInterface;
    /**
     * The profile info.
     */
    profileInfo: Map<string, string>;
    /**
     * The read only status.
     */
    readOnly: boolean;
    required: boolean;
}

const DynamicTypeFormField = (props: DynamicTypeFormFieldPropsInterface) => {

    const {
        ["data-componentid"]: componentId,
        schema,
        key,
        profileInfo,
        readOnly,
        required
    } = props;

    const { t } = useTranslation();

    const fieldName: string = t("user:profile.fields." +
        schema.name.replace(".", "_"), { defaultValue: schema.displayName }
    );
    const claimType: string = schema.type.toLowerCase();
    const maxLength: number = schema.maxLength ?? ProfileConstants.CLAIM_VALUE_MAX_LENGTH;


    /**
     * Form validator to validate the value against the schema regex.
     * @param value - Input value.
     * @returns An error if the value is not valid else undefined.
     */
    const validateInput = async (
        value: string,
        schema: ProfileSchemaInterface,
        fieldName: string
    ):
        Promise<string | undefined> => {
        if (required && isEmpty(value) ) {
            return (
                t("user:profile.forms.generic.inputs.validations.empty", { fieldName })
            );
        }

        if (isEmpty(value)) {
            return undefined;
        }

        if (!RegExp(schema.regEx).test(value)) {
            return (
                t("users:forms.validation.formatError", { field: fieldName })
            );
        }

        return undefined;
    };

    // return (
    //     <DateTimePicker />
    // )

    if (claimType === ClaimDataType.STRING) {
        const options: string[] = schema["canonicalValues"] ?? [];

        // If the claim is a string and has canonical values, render a dropdown.
        if (options.length > 0) {
            return (
                <>
                    <FinalFormField
                        key={ key }
                        component={ AutocompleteFieldAdapter }
                        data-componentid={ componentId }
                        initialValue={ profileInfo.get(schema.name) }
                        value={ profileInfo.get(schema.name) }
                        ariaLabel={ fieldName }
                        name={ schema.name }
                        label={ fieldName }
                        placeholder={
                            t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                                { fieldName })
                        }
                        options={ options }
                        readOnly={ readOnly }
                        required={ required }
                        clearable={ !required }
                        displayEmpty={ true }
                        multipleValues={ false }
                    />
                    <Divider hidden/>
                </>
            );
        }

        return (
            <>
                <FinalFormField
                    key={ key }
                    component={ TextFieldAdapter }
                    data-componentid={ componentId }
                    initialValue={ profileInfo.get(schema.name) }
                    ariaLabel={ fieldName }
                    name={ schema.name }
                    type="text"
                    label={ fieldName }
                    placeholder={
                        t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName })
                    }
                    parse={ (value: string) => value }
                    validate={ (value: string) => validateInput(value, schema, fieldName) }
                    maxLength={ maxLength }
                    readOnly={ readOnly }
                    required={ required }
                />
                <Divider hidden/>
            </>
        );
    }

    if (claimType === ClaimDataType.DECIMAL ||
        claimType === ClaimDataType.INTEGER) {
        return (
            <>
                <FinalFormField
                    key={ key }
                    component={ TextFieldAdapter }
                    data-componentid={ componentId }
                    initialValue={ profileInfo.get(schema.name) }
                    ariaLabel={ fieldName }
                    name={ schema.name }
                    type="number"
                    label={ fieldName }
                    placeholder={
                        t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName })
                    }
                    parse={ (value: string) => value }
                    validate={ (value: string) => validateInput(value, schema, fieldName) }
                    maxLength={ maxLength }
                    readOnly={ readOnly }
                    required={ required }
                />
                <Divider hidden/>
            </>
        );
    }

    if (claimType === ClaimDataType.DATE_TIME) {
        return (
            <>
                <FinalFormField
                    key={ key }
                    component={ TextFieldAdapter }
                    data-componentid={ componentId }
                    initialValue={ profileInfo.get(schema.name) }
                    ariaLabel={ fieldName }
                    name={ schema.name }
                    type="date"
                    label={ fieldName }
                    placeholder={
                        t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName })
                    }
                    parse={ (value: string) => value }
                    validate={ (value: string) => validateInput(value, schema, fieldName) }
                    maxLength={ maxLength }
                    readOnly={ readOnly }
                    required={ required }
                />
                <Divider hidden/>
            </>
        );
    }

    if (claimType === ClaimDataType.BOOLEAN) {
        return (
            <>
                <FinalFormField
                    key={ key }
                    component={ CheckboxFieldAdapter }
                    data-componentid={ componentId }
                    initialValue={ profileInfo.get(schema.name) ?? false }
                    ariaLabel={ fieldName }
                    label={ fieldName }
                    name={ schema.name }
                    readOnly={ readOnly }
                    required={ required }
                />
                <Divider hidden/>
            </>
        );
    }

    // Fallback to text field for any other data types.
    return (
        <>
            <FinalFormField
                key={ key }
                component={ TextFieldAdapter }
                data-componentid={ componentId }
                initialValue={ profileInfo.get(schema.name) }
                ariaLabel={ fieldName }
                name={ schema.name }
                type="text"
                label={ fieldName }
                placeholder={
                    t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                        { fieldName })
                }
                parse={ (value: string) => value }
                validate={ (value: string) => validateInput(value, schema, fieldName) }
                maxLength={ maxLength }
                readOnly={ readOnly }
                required={ required }
            />
            <Divider hidden/>
        </>
    );
};

export default DynamicTypeFormField;
