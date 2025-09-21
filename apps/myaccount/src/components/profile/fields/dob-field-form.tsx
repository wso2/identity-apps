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

import { ClaimInputFormat } from "@wso2is/core/models";
import { Validation } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import DatePickerFieldForm from "./date-picker-field-form";
import TextFieldForm from "./text-field-form";
import { TextFieldFormPropsInterface } from "../../../models/profile-ui";

const DOBFieldForm: FunctionComponent<TextFieldFormPropsInterface> = ({
    fieldSchema: schema,
    initialValue,
    fieldLabel,
    isEditable,
    onEditClicked,
    onEditCancelClicked,
    isActive,
    isRequired,
    setIsProfileUpdating,
    handleSubmit,
    isLoading,
    isUpdating,
    ["data-componentid"]: componentId
}: TextFieldFormPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const placeholderText: string = `${t("myAccount:components.profile.forms.generic.inputs.placeholder",
        { fieldName: fieldLabel.toLocaleLowerCase() })} in the format YYYY-MM-DD`;

    // If the input type is a date picker, and the initial value is a valid date, render the date picker field form.
    if (schema.inputFormat?.inputType === ClaimInputFormat.DATE_PICKER) {
        // Strictly parse the initial value to avoid invalid date formats.
        const formattedInitialValue: moment.Moment = moment(initialValue as string, "YYYY-MM-DD", true);

        if (isEmpty(initialValue) || formattedInitialValue.isValid()) {
            /**
             * Validates the field value.
             * - If the field is required, it should not be empty.
             * - The value should match the regex pattern defined in the schema.
             * - The date should not be a future date.
             *
             * @param value - Field value to be validated.
             */
            const validateField = (value: string): string | undefined => {
                if (isEmpty(value) && isRequired) {
                    return t("myAccount:components.profile.forms.generic.inputs.validations.empty",
                        { fieldName: fieldLabel });
                }

                if (isEmpty(value)) {
                    return undefined;
                }

                if (!RegExp(schema.regEx).test(value)) {
                    return t(
                        "myAccount:components.profile.forms.dateChangeForm.inputs.date.validations.invalidFormat", {
                            fieldName: fieldLabel
                        });
                }

                if (moment().isBefore(value)) {
                    return t(
                        "myAccount:components.profile.forms.dateChangeForm.inputs.date.validations.futureDateError", {
                            field: fieldLabel
                        });
                }
            };

            return (
                <DatePickerFieldForm
                    fieldSchema={ schema }
                    initialValue={ initialValue as string }
                    fieldLabel={ fieldLabel }
                    isActive={ isActive }
                    isEditable={ isEditable }
                    onEditClicked={ onEditClicked }
                    onEditCancelClicked={ onEditCancelClicked }
                    isRequired={ isRequired }
                    setIsProfileUpdating={ setIsProfileUpdating }
                    isLoading={ isLoading }
                    isUpdating={ isUpdating }
                    data-componentid={ componentId }
                    handleSubmit={ handleSubmit }
                    onValidate={ validateField }
                />
            );
        }
    }

    /**
     * Validates the field value against the schema.
     *
     * @param value - Field value to be validated.
     * @param validation - Field validation object to be updated with error messages.
     */
    const validateField = (value: string, validation: Validation): void => {
        if (!RegExp(schema.regEx).test(value)) {
            validation.isValid = false;
            validation.errorMessages.push(
                t("myAccount:components.profile.forms.dateChangeForm.inputs.date.validations.invalidFormat", {
                    fieldName: fieldLabel
                })
            );

            return;
        }

        if (!moment(value, "YYYY-MM-DD", true).isValid()) {
            validation.isValid = false;
            validation.errorMessages.push(
                t("myAccount:components.profile.forms.dateChangeForm.inputs.date.validations.invalidFormat", {
                    fieldName: fieldLabel
                })
            );

            return;
        }

        if (moment().isBefore(value)) {
            validation.isValid = false;
            validation.errorMessages.push(
                t("myAccount:components.profile.forms.dateChangeForm.inputs.date.validations.futureDateError", {
                    field: fieldLabel
                })
            );

            return;
        }
    };

    return (
        <TextFieldForm
            fieldSchema={ schema }
            initialValue={ initialValue }
            fieldLabel={ fieldLabel }
            isActive={ isActive }
            isEditable={ isEditable }
            onEditClicked={ onEditClicked }
            onEditCancelClicked={ onEditCancelClicked }
            isRequired={ isRequired }
            setIsProfileUpdating={ setIsProfileUpdating }
            isLoading={ isLoading }
            isUpdating={ isUpdating }
            data-componentid={ componentId }
            handleSubmit={ handleSubmit }
            onValidate={ validateField }
            placeholderText={ placeholderText }
        />
    );
};

export default DOBFieldForm;
