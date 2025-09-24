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

import { DatePickerFieldAdapter, FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import { Button, Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { DatePickerFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

/**
 * Date picker field form component for My Account profile.
 * If the initial value is not a valid date, it will fallback to a text field.
 */
const DatePickerFieldForm: FunctionComponent<DatePickerFieldFormPropsInterface> = ({
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
    isUpdating,
    onValidate,
    ["data-componentid"]: testId = "date-picker-field-form"
}: DatePickerFieldFormPropsInterface): ReactElement => {
    const { isMobileViewport } = useMediaContext();
    const { t } = useTranslation();

    const formattedInitialValue: moment.Moment = moment(initialValue as string, "YYYY-MM-DD", true);
    const placeholderText: string = t("myAccount:components.profile.forms.generic.inputs.placeholder",
        { fieldName: fieldLabel.toLowerCase() });

    /**
     * Validates the field value against the schema.
     *
     * @param value - Field value to be validated.
     */
    const validateField = (value: unknown): string | undefined => {
        // If a custom validation function is provided, use it.
        if (onValidate) {
            return onValidate(value as string);
        }

        // Validate the required field.
        if (isEmpty(value) && isRequired) {
            return (
                t("myAccount:components.profile.forms.generic.inputs.validations.empty", { fieldName: fieldLabel })
            );
        }

        // Validate the regex pattern if it exists.
        if (!RegExp(schema.regEx).test(value as string)) {
            return (t("myAccount:components.profile.forms.generic.inputs.validations.invalidFormat", {
                fieldName: fieldLabel
            }));
        }

        return undefined;
    };

    const onFormSubmit = (values: Record<string, string>): void => {
        setIsProfileUpdating(true);

        handleSubmit(schema.name, values[schema.name]);
    };

    if (isActive) {
        return (
            <EditSection data-testid={ "profile-schema-editing-section" }>
                <Grid>
                    <Grid.Row columns={ 2 } verticalAlign="middle">
                        <Grid.Column width={ 4 }>{ fieldLabel }</Grid.Column>
                        <Grid.Column width={ 12 }>
                            <FinalForm
                                onSubmit={ onFormSubmit }
                                render={ ({ handleSubmit }: FormRenderProps) => {
                                    return (
                                        <form
                                            onSubmit={ handleSubmit }
                                            className="date-picker-field-form"
                                            data-componentid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                            data-testid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                        >
                                            <Grid verticalAlign="middle">
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 10 }>
                                                        { (isEmpty(initialValue) || formattedInitialValue.isValid())
                                                            ? (
                                                                <FinalFormField
                                                                    component={ DatePickerFieldAdapter }
                                                                    initialValue={ initialValue }
                                                                    isClearable={ !isRequired }
                                                                    ariaLabel={ fieldLabel }
                                                                    name={ schema.name }
                                                                    validate={ validateField }
                                                                    placeholder={ placeholderText }
                                                                    readOnly={ !isEditable || isUpdating }
                                                                    disableClearable={ isRequired }
                                                                    data-componentid={
                                                                        `${testId}-${schema.name.replace(".", "-")
                                                                        }-date-picker-field` }
                                                                />
                                                            ) : (
                                                                <FinalFormField
                                                                    component={ TextFieldAdapter }
                                                                    initialValue={ initialValue }
                                                                    isClearable={ !isRequired }
                                                                    ariaLabel={ fieldLabel }
                                                                    name={ schema.name }
                                                                    validate={ validateField }
                                                                    placeholder={ placeholderText }
                                                                    readOnly={ !isEditable || isUpdating }
                                                                    disableClearable={ isRequired }
                                                                    data-testid={
                                                                        `${testId}-${schema.name.replace(".", "-")
                                                                        }-text-field` }
                                                                    data-componentid={
                                                                        `${testId}-${schema.name.replace(".", "-")
                                                                        }-text-field` }
                                                                />
                                                            )
                                                        }
                                                    </Grid.Column>

                                                    <Grid.Column width={ 6 }>
                                                        <div className="form-actions-wrapper">
                                                            <Button
                                                                primary
                                                                type="submit"
                                                                data-testid={
                                                                    `${testId}-schema-mobile-editing-section-${
                                                                        schema.name.replace(
                                                                            ".",
                                                                            "-"
                                                                        )}-save-button` }
                                                            >
                                                                { t("common:save") }
                                                            </Button>
                                                            <Button
                                                                onClick={ onEditCancelClicked }
                                                                data-testid={
                                                                    `${testId}-schema-mobile-editing-section-${
                                                                        schema.name.replace(".", "-")
                                                                    }-cancel-button`
                                                                }
                                                            >
                                                                { t("common:cancel") }
                                                            </Button>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </form>
                                    );
                                } }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection>
        );
    }

    return (
        <Grid padded={ true }>
            <Grid.Row columns={ 3 }>
                <Grid.Column mobile={ 6 } computer={ 4 } className="first-column">
                    <List.Content className="vertical-align-center">{ fieldLabel }</List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 8 } computer={ 10 }>
                    <List.Content>
                        <List.Description className="with-max-length">
                            { isEmpty(initialValue) ? (
                                <EmptyValueField
                                    schema={ schema }
                                    fieldLabel={ fieldLabel }
                                    placeholderText={ placeholderText }
                                    onEditClicked={ onEditClicked }
                                />
                            ) : (
                                formattedInitialValue.isValid()
                                    ? formattedInitialValue.format("YYYY-MM-DD")
                                    : initialValue
                            ) }
                        </List.Description>
                    </List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 2 } className={ `${!isMobileViewport ? "last-column" : ""}` }>
                    <List.Content floated="right" className="vertical-align-center">
                        { isEditable && (
                            <Popup
                                trigger={
                                    (<Icon
                                        link={ true }
                                        className="list-icon"
                                        size="small"
                                        color="grey"
                                        tabIndex={ 0 }
                                        onKeyPress={ (e: React.KeyboardEvent<HTMLElement>) => {
                                            if (e.key === "Enter") {
                                                onEditClicked();
                                            }
                                        } }
                                        onClick={ onEditClicked }
                                        name="pencil alternate"
                                        data-testid={ `profile-schema-mobile-editing-section-${schema.name.replace(
                                            ".",
                                            "-"
                                        )}-edit-button` }
                                    />)
                                }
                                position="top center"
                                content={ t("common:edit") }
                                inverted={ true }
                            />
                        ) }
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default DatePickerFieldForm;
