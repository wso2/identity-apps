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

import { ProfileConstants } from "@wso2is/core/constants";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { ProfileSchemaInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Popup, useMediaContext } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import { SCIMConfigs as SCIMExtensionConfigs } from "../../../extensions/configs/scim";
import { TextFieldFormPropsInterface } from "../../../models/profile-ui";
import { EditSection } from "../../shared/edit-section";

const TextFieldForm: FunctionComponent<TextFieldFormPropsInterface> = ({
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
    onValidate,
    placeholderText,
    ["data-componentid"]: testId = "text-field-form",
    ...fieldProps
}: TextFieldFormPropsInterface): ReactElement => {
    const { isMobileViewport } = useMediaContext();
    const { t } = useTranslation();

    const usernameClaim: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME");

    /**
     * Resolves the current schema value to the form value.
     * @returns schema form value
     */
    const resolveProfileInfoSchemaValue = (schema: ProfileSchemaInterface): string => {
        /**
         * Remove the user-store-name prefix from the userName
         * Match case applies only for secondary user-store.
         *
         * Transforms the value: -
         * USER-STORE/userNameString to userNameString
         */
        if (schema.name === usernameClaim) {
            return getUserNameWithoutDomain(initialValue);
        }

        /**
         * Type check to avoid rendering issues.
         */
        if (typeof initialValue === "object") {
            return "";
        }

        return initialValue;
    };

    const validateField = (value: string, validation: Validation): void => {
        if (onValidate) {
            onValidate(value, validation);
        } else if (!RegExp(schema.regEx).test(value)) {
            validation.isValid = false;
            validation.errorMessages.push(
                t("myAccount:components.profile.forms.generic.inputs.validations.invalidFormat", {
                    fieldName: fieldLabel
                })
            );
        }
    };

    const onFormSubmit = (values: Map<string, FormValue>): void => {
        setIsProfileUpdating(true);

        let modifiedSchemaName: string = schema.name;

        // Special handling for Address Schemas.
        // Need to be submitted as addresses: { type: "home", formatted: value }
        // Refer to https://github.com/wso2/identity-apps/pull/2077
        if (
            [
                SCIMExtensionConfigs.scimUserSchema.addressesHome,
                SCIMExtensionConfigs.scimUserSchema.addressesWork
            ].some(
                (address: string) => !isEmpty(address) && address === schema.schemaUri
            )
        ) {
            const schemaNames: string[] = schema.name.split(".");

            modifiedSchemaName = `${schemaNames[0]}#${schemaNames[1]}.formatted`;

        // Special handling for Email Schemas.
        // Need to be submitted as emails: { type: "work", value: value }
        } else if (
            [
                SCIMExtensionConfigs.scimUserSchema.emailsWork,
                SCIMExtensionConfigs.scimUserSchema.emailsOther
            ].some(
                (email: string) => !isEmpty(email) && email === schema.schemaUri
            )
        ) {
            const schemaNames: string[] = schema.name.split(".");

            modifiedSchemaName = `${schemaNames[0]}#${schemaNames[1]}.value`;

        // Special handling for Phone Number Schemas.
        // Need to be submitted as phoneNumbers: { type: "work", value: value }
        } else if (
            [
                SCIMExtensionConfigs.scimUserSchema.phoneNumbersMobile,
                SCIMExtensionConfigs.scimUserSchema.phoneNumbersWork,
                SCIMExtensionConfigs.scimUserSchema.phoneNumbersOther,
                SCIMExtensionConfigs.scimUserSchema.phoneNumbersHome,
                SCIMExtensionConfigs.scimUserSchema.phoneNumbersFax,
                SCIMExtensionConfigs.scimUserSchema.phoneNumbersPager
            ].some(
                (phone: string) => !isEmpty(phone) && phone === schema.schemaUri
            )
        ) {
            const schemaNames: string[] = schema.name.split(".");

            modifiedSchemaName = `${schemaNames[0]}#${schemaNames[1]}.value`;
        }

        handleSubmit(modifiedSchemaName, values.get(schema.name));
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
                                                data-testid={ `${testId}-${schema.name.replace(".", "-")}-text-field` }
                                                data-componentid={ `${testId}-${schema.name.replace(
                                                    ".",
                                                    "-"
                                                )}-text-field` }
                                                placeholder={ placeholderText || t(
                                                    "myAccount:components.profile.forms.generic.inputs.placeholder",
                                                    { fieldName: fieldLabel.toLowerCase() }
                                                ) }
                                                required={ isRequired }
                                                requiredErrorMessage={ t(
                                                    "myAccount:components.profile.forms.generic.inputs." +
                                                        "validations.empty",
                                                    { fieldName: fieldLabel }
                                                ) }
                                                type="text"
                                                validation={ validateField }
                                                value={ resolveProfileInfoSchemaValue(schema) }
                                                maxLength={
                                                    schema.maxLength
                                                        ? schema.maxLength
                                                        : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                                                }
                                                { ...fieldProps }
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
                            { isEmpty(initialValue) ? (
                                <EmptyValueField
                                    schema={ schema }
                                    fieldLabel={ fieldLabel }
                                    placeholderText={ placeholderText }
                                />
                            ) : (
                                resolveProfileInfoSchemaValue(schema)
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

export default TextFieldForm;
