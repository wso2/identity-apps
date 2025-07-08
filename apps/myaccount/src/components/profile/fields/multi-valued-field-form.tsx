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

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import IconButton from "@oxygen-ui/react/IconButton";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Paper from "@oxygen-ui/react/Paper";
import Select from "@oxygen-ui/react/Select";
import Typography from "@oxygen-ui/react/Typography";
import { ProfileConstants } from "@wso2is/core/constants";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Button, Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { MultiValueFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

const MultiValueFieldForm = <T extends string | number>({
    fieldSchema: schema,
    fieldLabel,
    type,
    initialValue,
    isEditable,
    isActive,
    isRequired,
    isLoading,
    onEditClicked,
    onEditCancelClicked,
    setIsProfileUpdating,
    handleSubmit,
    ["data-componentid"]: testId = "multi-value-field-form"
}: MultiValueFieldFormPropsInterface<T>): ReactElement => {
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();

    const [ valueList, setValueList ] = useState<T[]>(initialValue);

    useEffect(() => {
        setValueList(initialValue);
    }, [ isActive ]);


    const handleAddValue = (value: T): void => {
        if (!valueList.includes(value)) {
            setValueList((valueList: T[]) => [ ...valueList, value ]);
        }
    };

    const handleRemoveValue = (value: T): void => {
        const updatedValueList: T[] = valueList.filter((v: T) => v !== value);

        setValueList(updatedValueList);
    };

    const validateField = (value: string, validation: Validation): void => {
        if (!RegExp(schema.regEx).test(value)) {
            validation.isValid = false;
            validation.errorMessages.push(
                t("myAccount:components.profile.forms.generic.inputs.validations.invalidFormat", {
                    fieldName: fieldLabel
                })
            );
        }
    };

    const onFormSubmit = (): void => {
        setIsProfileUpdating(true);

        handleSubmit(schema.name, valueList as FormValue);
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
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 4 }>{ fieldLabel }</Grid.Column>
                        <Grid.Column width={ 12 }>
                            <Forms
                                onSubmit={ (values: Map<string, FormValue>) =>
                                    handleAddValue(values.get(schema.name) as T) }
                            >
                                <Grid verticalAlign="middle" textAlign="right">
                                    <Grid.Row className="p-0">
                                        <Field
                                            action={ { icon: "plus", type: "submit" } }
                                            disabled={ isLoading || valueList?.length === ProfileConstants
                                                .MAX_EMAIL_ADDRESSES_ALLOWED }
                                            className="multi-input-box"
                                            autoFocus={ true }
                                            label=""
                                            name={ schema.name }
                                            placeholder={
                                                t("myAccount:components.profile.forms.generic.inputs.placeholder",
                                                    { fieldName: fieldLabel.toLowerCase() }) }
                                            required={ isRequired }
                                            requiredErrorMessage={
                                                t("myAccount:components.profile.forms.generic.inputs.validations.empty",
                                                    { fieldName: fieldLabel }) }
                                            type={ type || "text" }
                                            validation={ validateField }
                                            maxLength={ ProfileConstants.CLAIM_VALUE_MAX_LENGTH }
                                            data-componentid={
                                                `${testId}-editing-section-${ schema.name.replace(".", "-") }-field`
                                            }
                                        />
                                    </Grid.Row>

                                    <Grid.Row>
                                        <TableContainer
                                            component={ Paper }
                                            elevation={ 0 }
                                            data-componentid={
                                                `${testId}-editing-section-${schema.name.replace(".", "-")}-accordion`
                                            }
                                        >
                                            <Table
                                                className="multi-value-table"
                                                size="small"
                                                aria-label="multi-attribute value table"
                                            >
                                                <TableBody>
                                                    { valueList?.map(
                                                        (value: T, index: number) => (
                                                            <TableRow
                                                                key={ index }
                                                                className="multi-value-table-data-row"
                                                            >
                                                                <TableCell align="left">
                                                                    <div className="table-c1">
                                                                        <Typography
                                                                            className="c1-value"
                                                                            data-componentid={
                                                                                `${testId}-editing-section-${
                                                                                    schema.name.replace(".", "-")
                                                                                }-value-${index}`
                                                                            }
                                                                        >
                                                                            { String(value) }
                                                                        </Typography>
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell align="right">
                                                                    <div className="table-c2">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={ () => {
                                                                                handleRemoveValue(value);
                                                                            } }
                                                                            disabled={ isRequired &&
                                                                                valueList?.length === 1 }
                                                                            data-componentid={
                                                                                `${testId}-editing-section-${
                                                                                    schema.name.replace(".", "-")
                                                                                }-delete-button-${index}`
                                                                            }
                                                                        >
                                                                            <Popup
                                                                                size="tiny"
                                                                                trigger={
                                                                                    (
                                                                                        <Icon name="trash alternate" />
                                                                                    )
                                                                                }
                                                                                header={ t("common:delete") }
                                                                                inverted
                                                                            />
                                                                        </IconButton>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    ) }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid.Row>

                                    <Grid.Row>
                                        <div className="text-field-actions">
                                            <Button
                                                primary
                                                onClick={ onFormSubmit }
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
                                        </div>
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
