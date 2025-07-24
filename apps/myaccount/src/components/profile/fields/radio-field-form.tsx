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

import { FinalForm, FinalFormField, FormRenderProps, RadioGroupFieldAdapter } from "@wso2is/form";
import { Button, Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { RadioFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

import "./field-form.scss";

interface RadioOptionItem {
    label: string;
    value: string;
}

const RadioFieldForm: FunctionComponent<RadioFieldFormPropsInterface> = ({
    fieldSchema: schema,
    initialValue,
    fieldLabel,
    isEditable,
    onEditClicked,
    onEditCancelClicked,
    isActive,
    isRequired,
    isUpdating,
    setIsProfileUpdating,
    handleSubmit,
    ["data-componentid"]: testId = "radio-field-form"
}: RadioFieldFormPropsInterface): ReactElement => {
    const { isMobileViewport } = useMediaContext();
    const { t } = useTranslation();

    let options: RadioOptionItem[] = schema.canonicalValues ?? [];

    if (!isRequired) {
        // Add an empty value option when the field is optional.
        options = [
            { label: t("myAccount:components.profile.forms.generic.radioGroup.optionNone"), value: "" },
            ...options
        ];
    }

    const selectedOption: RadioOptionItem = options.find((option: RadioOptionItem) => {
        return option.value === initialValue;
    });

    const validateField = (value: unknown): string | undefined => {
        // Validate the required field.
        if (isEmpty(value) && isRequired) {
            return (
                t("myAccount:components.profile.forms.generic.inputs.validations.empty", { fieldName: fieldLabel })
            );
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
                                            className="radio-group-field-form"
                                            onSubmit={ handleSubmit }
                                            data-componentid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                            data-testid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                        >
                                            <FinalFormField
                                                component={ RadioGroupFieldAdapter }
                                                initialValue={ initialValue }
                                                ariaLabel={ fieldLabel }
                                                name={ schema.name }
                                                options={ options }
                                                validate={ validateField }
                                                readOnly={ !isEditable || isUpdating }
                                                disabled={ !isEditable || isUpdating }
                                                required={ isRequired }
                                                FormControlProps={ {
                                                    fullWidth: true,
                                                    margin: "dense"
                                                } }
                                                data-componentid={
                                                    `${testId}-editing-section-${ schema.name.replace(".", "-") }-field`
                                                }
                                                data-testid={
                                                    `${testId}-editing-section-${ schema.name.replace(".", "-") }-field`
                                                }
                                            />
                                            <Grid.Row className="form-actions-wrapper">
                                                <Button
                                                    primary
                                                    type="submit"
                                                    data-testid={ `${testId}-schema-mobile-editing-section-${
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
                                            </Grid.Row>
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
                            { isEmpty(selectedOption) ? (
                                <EmptyValueField
                                    schema={ schema }
                                    fieldLabel={ fieldLabel }
                                />
                            ) : (
                                selectedOption?.label
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

export default RadioFieldForm;
