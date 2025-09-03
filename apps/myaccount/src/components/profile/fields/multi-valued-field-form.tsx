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
import MultiValuedTextField from "@wso2is/common.users.v1/components/multi-valued-text-field";
import { ProfileConstants } from "@wso2is/core/constants";
import { FinalForm, FormRenderProps } from "@wso2is/form";
import { Button, Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { MultiValueFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

import "./field-form.scss";

const MultiValueFieldForm = <T extends string | number>({
    fieldSchema: schema,
    fieldLabel,
    initialValue,
    isEditable,
    isActive,
    isRequired,
    isLoading,
    onEditClicked,
    onEditCancelClicked,
    setIsProfileUpdating,
    type = "text",
    handleSubmit,
    ["data-componentid"]: testId = "multi-value-field-form"
}: MultiValueFieldFormPropsInterface<T>): ReactElement => {
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();

    const onFormSubmit = (values: Record<string, unknown>): void => {
        setIsProfileUpdating(true);

        const valueList: T[] = Array.from(values[schema.name] as T[] ?? []);

        handleSubmit(schema.name, valueList as string[]);
    };

    const renderInactiveFieldContent = (): ReactElement => {
        return (
            <Select
                className="multi-attribute-dropdown"
                value={ initialValue[0] }
                disableUnderline
                variant="standard"
                data-componentid={ `${testId}-${schema.name.replace(".", "-")}-readonly-dropdown` }
            >
                { initialValue.map((value: T, index: number) => (
                    <MenuItem key={ index } value={ value } className="read-only-menu-item">
                        <div className="dropdown-row">
                            <Typography
                                className="dropdown-label"
                                data-componentid={ `${testId}-readonly-section-${schema.name.replace(
                                    ".",
                                    "-"
                                )}-value-${index}` }
                            >
                                { String(value) }
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
                <Grid className="multi-valued-field-form">
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 4 }>{ fieldLabel }</Grid.Column>
                        <Grid.Column width={ 12 }>
                            <FinalForm
                                onSubmit={ onFormSubmit }
                                render={ ({ handleSubmit, values }: FormRenderProps) => {
                                    const currentValueList: T[] = Array.from(values[schema.name] as T[] ?? []);

                                    return (
                                        <form
                                            id="user-profile-form"
                                            onSubmit={ handleSubmit }
                                            className="user-profile-form"
                                            data-componentid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                            data-testid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-form` }
                                        >
                                            <MultiValuedTextField
                                                schema={ schema }
                                                fieldName={ schema.name }
                                                fieldLabel={ fieldLabel }
                                                showLabel={ false }
                                                margin="none"
                                                type={ type }
                                                initialValue={ initialValue as string[] }
                                                isReadOnly={ isLoading || currentValueList
                                                    ?.length === ProfileConstants.MAX_EMAIL_ADDRESSES_ALLOWED }
                                                isRequired={ isRequired }
                                                isUpdating={ false }
                                                maxValueLimit={ ProfileConstants.MAX_MULTI_VALUES_ALLOWED }
                                                placeholder={
                                                    t("myAccount:components.profile.forms.generic.inputs.placeholder",
                                                        { fieldName: fieldLabel.toLowerCase() }) }
                                                data-componentid={
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
                            { isEmpty(initialValue) ? (
                                <EmptyValueField schema={ schema } fieldLabel={ fieldLabel } />
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

export default MultiValueFieldForm;
