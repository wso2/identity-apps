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

import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import Typography from "@oxygen-ui/react/Typography";
import { LabelValue } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, SelectFieldAdapter } from "@wso2is/form";
import { Button, Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { DropdownFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

/**
 * Interface for the dropdown option item.
 */
interface DropdownOptionItem {
    label: string;
    value: string;
}

/**
 * User profile dropdown field form component.
 */
const DropdownFieldForm: FunctionComponent<DropdownFieldFormPropsInterface> = ({
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
    isMultiSelect = false,
    ["data-componentid"]: testId = "dropdown-field-form"
}: DropdownFieldFormPropsInterface): ReactElement => {
    const { isMobileViewport } = useMediaContext();
    const { t } = useTranslation();

    const options: DropdownOptionItem[] = schema.canonicalValues ?? [];

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

    const renderInactiveFieldContent = (): ReactElement => {
        if (!isMultiSelect) {
            const selectedOption: DropdownOptionItem = options.find((option: DropdownOptionItem) => {
                return option.value === (initialValue as string);
            });

            return <>{ selectedOption?.label ?? "" }</>;
        }

        const selectedOptions: DropdownOptionItem[] = options.filter((option: DropdownOptionItem) => {
            return (initialValue as string[]).includes(option.value);
        });

        return (
            <Select
                className="multi-attribute-dropdown"
                value={ selectedOptions[0].value }
                disableUnderline
                variant="standard"
                data-componentid={ `${testId}-${schema.name.replace(".", "-")}-readonly-dropdown` }
            >
                { selectedOptions.map(({ label, value }: DropdownOptionItem, index: number) => (
                    <MenuItem key={ index } value={ value } className="read-only-menu-item">
                        <div className="dropdown-row">
                            <Typography
                                className="dropdown-label"
                                data-componentid={ `${testId}-readonly-section-${schema.name.replace(
                                    ".",
                                    "-"
                                )}-value-${index}` }
                            >
                                { label }
                            </Typography>
                        </div>
                    </MenuItem>
                )) }
            </Select>
        );
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
                                            className="dropdown-field-form"
                                            data-componentid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                            data-testid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                        >
                                            <Grid verticalAlign="middle">
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 10 }>
                                                        <FinalFormField
                                                            component={ SelectFieldAdapter }
                                                            initialValue={ initialValue }
                                                            isClearable={ !isRequired }
                                                            ariaLabel={ fieldLabel }
                                                            name={ schema.name }
                                                            validate={ validateField }
                                                            placeholder={ t(
                                                                "myAccount:components.profile.forms.generic" +
                                                                ".dropdown.placeholder", {
                                                                    fieldName: fieldLabel.toLowerCase()
                                                                }
                                                            ) }
                                                            options={ options?.map(({ label, value }: LabelValue) => {
                                                                return {
                                                                    text: label,
                                                                    value
                                                                };
                                                            }) }
                                                            multiple={ isMultiSelect }
                                                            readOnly={ !isEditable || isUpdating }
                                                            disableClearable={ isRequired }
                                                            data-testid={
                                                                `${testId}-${
                                                                    schema.name.replace(".", "-")}-select-field` }
                                                            data-componentid={
                                                                `${testId}-${
                                                                    schema.name.replace(".", "-")}-select-field` }
                                                        />
                                                    </Grid.Column>
                                                    <Grid.Column
                                                        width={ 6 }
                                                    >
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
                                    placeholderText={ t(
                                        "myAccount:components.profile.forms.generic.dropdown.placeholder",
                                        { fieldName: fieldLabel.toLowerCase() }
                                    ) }
                                />
                            ) : (
                                renderInactiveFieldContent()
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

export default DropdownFieldForm;
