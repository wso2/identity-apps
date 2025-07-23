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

import { CommonUtils } from "@wso2is/core/utils";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItemProps, Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { CountryFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

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
    ["data-componentid"]: componentId = "country-field-form"
}: CountryFieldFormPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();

    const countryList: DropdownItemProps[] = useMemo(() => {
        return CommonUtils.getCountryList();
    }, []);

    const onFormSubmit = (values: Map<string, FormValue>): void => {
        setIsProfileUpdating(true);

        handleSubmit(schema.name, values.get(schema.name));
    };

    if (isActive) {
        return (
            <EditSection data-testid={ "profile-schema-editing-section" }>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 4 }>{ fieldLabel }</Grid.Column>
                        <Grid.Column width={ 12 }>
                            <Forms onSubmit={ onFormSubmit }>
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
                            </Forms>
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
