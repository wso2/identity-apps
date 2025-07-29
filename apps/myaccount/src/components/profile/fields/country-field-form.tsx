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

import CountryFlag from "@oxygen-ui/react/CountryFlag";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { CommonUtils } from "@wso2is/core/utils";
import { FinalForm, FinalFormField, FormRenderProps, SelectFieldAdapter } from "@wso2is/form";
import { Button, Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItemProps, Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { CountryFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

/**
 * Country list item interface.
 */
interface CountryListItemInterface {
    flag: string;
    key: number;
    text: string;
    value: string;
};

const CountryFieldForm: FunctionComponent<CountryFieldFormPropsInterface> = ({
    fieldSchema: schema,
    initialValue,
    fieldLabel,
    isRequired,
    isActive,
    isEditable,
    onEditClicked,
    onEditCancelClicked,
    setIsProfileUpdating,
    handleSubmit,
    isUpdating,
    ["data-componentid"]: componentId = "country-field-form"
}: CountryFieldFormPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();

    const countryList: DropdownItemProps[] = useMemo(() => {
        return CommonUtils.getCountryList();
    }, []);

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

    /**
     * Returns the options for the dropdown.
     */
    const getCountryOptions = (): {text: ReactNode, value: string}[] => {
        return countryList?.map(
            ({ key, flag, text: countryName, value }: CountryListItemInterface) => {
                return {
                    text: (
                        <ListItem
                            key={ key }
                            className="p-0"
                            data-componentid={ `${componentId}-profile-form-country-dropdown-${value}` }
                        >
                            <ListItemIcon>
                                <CountryFlag countryCode={ flag as string } />
                            </ListItemIcon>
                            <ListItemText>{ countryName }</ListItemText>
                        </ListItem>
                    ),
                    value
                };
            });
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
                                                `${componentId}-editing-section-${
                                                    schema.name.replace(".", "-") }-form` }
                                            data-testid={
                                                `${componentId}-editing-section-${
                                                    schema.name.replace(".", "-") }-form` }
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
                                                            placeholder={ t("myAccount:components.profile.forms." +
                                                                "countryChangeForm.inputs.country.placeholder") }
                                                            options={ getCountryOptions() }
                                                            readOnly={ !isEditable || isUpdating }
                                                            disableClearable={ isRequired }
                                                            data-testid={
                                                                `${componentId}-${
                                                                    schema.name.replace(".", "-")}-select-field` }
                                                            data-componentid={
                                                                `${componentId}-${
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
                                                                    `${componentId}-schema-mobile-editing-section-${
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
                                                                    `${componentId}-schema-mobile-editing-section-${
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
                            { /* <Forms onSubmit={ onFormSubmit }>
                                <Grid verticalAlign="middle" textAlign="right">
                                    <Grid.Row columns={ 2 } className="p-0">
                                        <Grid.Column width={ 10 }>
                                            <Field
                                                autoFocus={ true }
                                                label=""
                                                name={ schema.name }
                                                placeholder={ t(
                                                    "myAccount:components.profile.forms.countryChangeForm." +
                                                    "inputs.country.placeholder"
                                                ) }
                                                required={ isRequired }
                                                requiredErrorMessage={ t(
                                                    "myAccount:components.profile.forms.generic.inputs." +
                                                        "validations.empty",
                                                    { fieldLabel }
                                                ) }
                                                type="dropdown"
                                                children={
                                                    countryList?.map((list: DropdownItemProps) => ({
                                                        "data-testid": `${componentId}-${list.value as string}`,
                                                        flag: list.flag,
                                                        key: list.key as string,
                                                        text: list.text as string,
                                                        value: list.value as string
                                                    })) ?? []
                                                }
                                                value={ initialValue }
                                                disabled={ false }
                                                clearable={ !isRequired }
                                                search
                                                selection
                                                fluid
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={ 6 }>
                                            <div className="text-field-actions">
                                                <Field
                                                    size="small"
                                                    type="submit"
                                                    className="m-0"
                                                    value={ t("common:save").toString() }
                                                    data-testid={ `${componentId}-schema-mobile-editing-section-${
                                                        schema.name.replace(
                                                            ".",
                                                            "-"
                                                        )}-save-button` }
                                                />
                                                <Field
                                                    className="link-button"
                                                    onClick={ onEditCancelClicked }
                                                    size="small"
                                                    type="button"
                                                    value={ t("common:cancel").toString() }
                                                    data-testid={ `${componentId}-schema-mobile-editing-section-${
                                                        schema.name.replace(
                                                            ".",
                                                            "-"
                                                        )}-cancel-button` }
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Forms> */ }
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
                                        "myAccount:components.profile.forms.countryChangeForm." +
                                        "inputs.country.placeholder"
                                    ) }
                                />
                            ) : (
                                initialValue
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

export default CountryFieldForm;
