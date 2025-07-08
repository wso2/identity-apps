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

import { LabelValue } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { DropdownFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

const DropdownFieldForm: FunctionComponent<DropdownFieldFormPropsInterface> = ({
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
    ["data-componentid"]: testId = "dropdown-field-form"
}: DropdownFieldFormPropsInterface): ReactElement => {
    const { isMobileViewport } = useMediaContext();
    const { t } = useTranslation();

    const options: {
        key: string;
        text: string;
        value: string;
    }[] = schema.canonicalValues.map(({ label, value }: LabelValue) => {
        return {
            key: value,
            text: label,
            value: value
        };
    });

    const selectedOption: {
        text: string;
        value: string;
    } = options.find((option: { text: string; value: string }) => {
        return option.value === initialValue;
    });

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
                                                label=""
                                                name={ schema.name }
                                                data-testid={ `${testId}-${schema.name.replace(
                                                    ".", "-")}-select-field` }
                                                data-componentid={ `${testId}-${schema.name.replace(
                                                    ".",
                                                    "-"
                                                )}-select-field` }
                                                placeholder={ t(
                                                    "myAccount:components.profile.forms.generic.inputs.placeholder",
                                                    { fieldName: fieldLabel.toLowerCase() }
                                                ) }
                                                required={ isRequired }
                                                requiredErrorMessage={ t(
                                                    "myAccount:components.profile.forms.generic.inputs." +
                                                        "validations.empty",
                                                    { fieldLabel }
                                                ) }
                                                type="dropdown"
                                                value={ initialValue }
                                                children={ options }
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={ 6 }>
                                            <div className="text-field-actions">
                                                <Field
                                                    size="small"
                                                    type="submit"
                                                    className="m-0"
                                                    value={ t("common:save").toString() }
                                                    data-testid={ `${testId}-schema-mobile-editing-section-${
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
                                                    data-testid={ `${testId}-schema-mobile-editing-section-${
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
                            { isEmpty(selectedOption) ? (
                                <EmptyValueField
                                    schema={ schema }
                                    fieldLabel={ fieldLabel }
                                />
                            ) : (
                                selectedOption?.text
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
