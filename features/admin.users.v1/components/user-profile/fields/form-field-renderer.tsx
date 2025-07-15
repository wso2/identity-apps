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

import { SCIMConfigs as SCIMExtensionConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { ProfileConstants } from "@wso2is/core/constants";
import {
    ClaimInputFormat,
    IdentifiableComponentInterface,
    ProfileSchemaInterface,
    SharedProfileValueResolvingMethod
} from "@wso2is/core/models";
import { CheckboxFieldAdapter, FinalFormField, SwitchFieldAdapter } from "@wso2is/form/src";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import CheckBoxGroupFormField from "./check-box-group-form-field";
import CountryField from "./country-field";
import DropdownFormField from "./dropdown-form-field";
import LocaleField from "./locale-field";
import MultiValuedEmailField from "./multi-valued-email-field";
import MultiValuedMobileField from "./multi-valued-mobile-field";
import MultiValuedTextField from "./multi-valued-text-field";
import RadioGroupFormField from "./radio-group-form-field";
import SingleValuedEmailMobileField from "./single-valued-email-mobile-field";
import TextFormField from "./text-form-field";

interface ProfileFormFieldRendererPropsInterface extends IdentifiableComponentInterface {
    schema: ProfileSchemaInterface;
    flattenedProfileSchema: ProfileSchemaInterface[];
    initialValues: Record<string, unknown>;
    isEmailVerificationEnabled: boolean;
    isMobileVerificationEnabled: boolean;
    isUpdating: boolean;
    isReadOnlyMode: boolean;
    isUserManagedByParentOrg: boolean;
    setIsUpdating: (isUpdating: boolean) => void;
    onUserUpdated: (userId: string) => void;
}

const ProfileFormFieldRenderer: FunctionComponent<ProfileFormFieldRendererPropsInterface> = ({
    schema,
    flattenedProfileSchema,
    initialValues,
    isEmailVerificationEnabled,
    isMobileVerificationEnabled,
    isUpdating,
    setIsUpdating,
    onUserUpdated,
    isReadOnlyMode,
    isUserManagedByParentOrg,
    ["data-componentid"]: componentId = "profile-form-field-renderer"
}: ProfileFormFieldRendererPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const fieldLabel: string = t("user:profile.fields." + schema.name.replace(".", "_"), {
        defaultValue: schema.displayName
    });
    const fieldComponentId: string = `${ componentId }-${ schema.name }-input`;
    // Replace dots with __DOT__ to avoid issues with dot separated field names.
    const convertedSchemaId: string = schema.schemaId.replace(/\./g, "__DOT__");

    const sharedProfileValueResolvingMethod: string = schema?.sharedProfileValueResolvingMethod;
    const mutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;
    const requiredValue: boolean = schema?.profiles?.console?.required ?? schema.required;

    const isReadOnly: boolean =
        (isUserManagedByParentOrg &&
            sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN) ||
        isReadOnlyMode ||
        mutabilityValue === ProfileConstants.READONLY_SCHEMA ||
        schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME");

    const isRequired: boolean = (
        !(isUserManagedByParentOrg &&
            sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)) &&
        requiredValue;

    const maxLength: number = schema.maxLength ?? ProfileConstants.CLAIM_VALUE_MAX_LENGTH;

    const genericValidator = (value: unknown): string | undefined => {
        // Validate the required field.
        if (isEmpty(value) && isRequired) {
            return (
                t("user:profile.forms.generic.inputs.validations.empty", { fieldName: fieldLabel })
            );
        }

        // Validate the format of the value against the regex pattern.
        if (!isEmpty(value) && !RegExp(schema.regEx).test(value as string)) {
            return (
                t("users:forms.validation.formatError", { field: fieldLabel })
            );
        }

        return undefined;
    };

    if (schema.schemaUri === SCIMExtensionConfigs.scimSystemSchema.emailAddresses) {
        const primarySchema: ProfileSchemaInterface = flattenedProfileSchema.find(
            (profileSchema: ProfileSchemaInterface) => {
                return profileSchema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS");
            }
        );
        const emailsField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS");
        const emailAddressesField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES");
        const verifiedEmailAddressesField: string = ProfileConstants
            .SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES");

        const pendingEmails: string[] = (initialValues[schema.schemaId]["pendingEmails"] as { value: string }[])
            ?.map((email: { value: string }) => email.value) ?? [];

        return (
            <MultiValuedEmailField
                userId={ initialValues["id"] as string }
                schema={ schema }
                primaryEmailSchema={ primarySchema }
                primaryEmailAddress={ initialValues[emailsField] as string }
                fieldLabel={ fieldLabel }
                emailAddressesList={ initialValues[schema.schemaId][emailAddressesField] as string[] }
                verifiedEmailAddresses={ initialValues[schema.schemaId][verifiedEmailAddressesField] as string[] }
                verificationPendingEmailAddresses={ pendingEmails }
                isVerificationEnabled={ isEmailVerificationEnabled }
                isUpdating={ isUpdating }
                isReadOnly={ isReadOnly }
                maxValueLimit={ ProfileConstants.MAX_EMAIL_ADDRESSES_ALLOWED }
                setIsUpdating={ setIsUpdating }
                onUserUpdated={ onUserUpdated }
                data-componentid={ componentId }
            />
        );
    }

    if (schema.schemaUri === SCIMExtensionConfigs.scimSystemSchema.mobileNumbers) {
        const primarySchema: ProfileSchemaInterface = flattenedProfileSchema.find(
            (profileSchema: ProfileSchemaInterface) => {
                return profileSchema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE");
            }
        );

        const mobileField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE");
        const mobileNumbersField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS");
        const verifiedMobileNumbersField: string = ProfileConstants
            .SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS");

        const pendingMobile: string = (initialValues[schema.schemaId]["pendingMobileNumber"] as string) ?? "";

        return (
            <MultiValuedMobileField
                schema={ schema }
                primarySchema={ primarySchema }
                primaryMobileNumber={ initialValues[mobileField] as string }
                fieldLabel={ fieldLabel }
                mobileNumbersList={ initialValues[schema.schemaId][mobileNumbersField] as string[] }
                verifiedMobileNumbers={ initialValues[schema.schemaId][verifiedMobileNumbersField] as string[] }
                verificationPendingMobileNumber={ pendingMobile }
                isVerificationEnabled={ isMobileVerificationEnabled }
                isUpdating={ isUpdating }
                isReadOnly={ isReadOnly }
                maxValueLimit={ ProfileConstants.MAX_MOBILE_NUMBERS_ALLOWED }
                data-componentid={ componentId }
            />
        );
    }

    if (schema.schemaUri === SCIMExtensionConfigs.scimUserSchema.emails) {
        const emailField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS");
        const pendingEmail: string = (
            initialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]["pendingEmails"] as { value: string }[])
            ?.find((email: { value: string }) => !isEmpty(email.value))?.value ?? "";

        return (
            <SingleValuedEmailMobileField
                schema={ schema }
                fieldName={ `${emailField}.primary` }
                fieldLabel={ fieldLabel }
                initialValue={ initialValues[emailField] as string }
                pendingValue={ pendingEmail }
                isVerificationEnabled={ isEmailVerificationEnabled }
                isUpdating={ isUpdating }
                isReadOnly={ isReadOnly }
                isRequired={ isRequired }
                validator={ genericValidator }
                data-componentid={ componentId }
            />
        );
    }

    if (schema.schemaUri === SCIMExtensionConfigs.scimUserSchema.phoneNumbersMobile) {
        const mobileField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE");
        const pendingMobile: string = (
            initialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]["pendingMobileNumber"] as string) ?? "";

        return (
            <SingleValuedEmailMobileField
                schema={ schema }
                fieldName={ schema.name }
                fieldLabel={ fieldLabel }
                initialValue={ initialValues[mobileField] as string }
                pendingValue={ pendingMobile }
                isVerificationEnabled={ isMobileVerificationEnabled }
                isUpdating={ isUpdating }
                isReadOnly={ isReadOnly }
                isRequired={ isRequired }
                validator={ genericValidator }
                data-componentid={ componentId }
            />
        );
    }

    if (schema.schemaUri === SCIMExtensionConfigs.scimSystemSchema.country) {
        return (
            <CountryField
                schema={ schema }
                fieldLabel={ fieldLabel }
                fieldName={ `${convertedSchemaId}.${schema.name}` }
                initialValue={ initialValues[convertedSchemaId][schema.name] as string }
                isUpdating={ isUpdating }
                isReadOnly={ isReadOnly }
                isRequired={ isRequired }
                validator={ genericValidator }
                data-componentid={ componentId }
            />
        );
    }

    if (schema.name === "locale") {
        return (
            <LocaleField
                schema={ schema }
                fieldLabel={ fieldLabel }
                fieldName={ schema.name }
                initialValue={ initialValues[schema.name] as string }
                isUpdating={ isUpdating }
                isReadOnly={ isReadOnly }
                isRequired={ isRequired }
                validator={ genericValidator }
                data-componentid={ componentId }
            />
        );
    }

    if (schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB")) {
        return (
            <TextFormField
                fieldName={ `${convertedSchemaId}.${schema.name}` }
                fieldLabel={ fieldLabel }
                initialValue={ initialValues[convertedSchemaId][schema.name] as string }
                validator={ genericValidator }
                placeholder="YYYY-MM-DD"
                maxLength={ maxLength }
                isReadOnly={ isReadOnly }
                isRequired={ isRequired }
                isUpdating={ isUpdating }
                data-componentid={ fieldComponentId }
            />
        );
    }

    const inputType: ClaimInputFormat = schema.inputFormat?.inputType ?? ClaimInputFormat.TEXT_INPUT;
    const isMultiValued: boolean = schema.multiValued;
    let initialValue: unknown = initialValues[schema.name];
    let fieldName: string = schema.name;

    if (schema.extended) {
        initialValue = initialValues[convertedSchemaId][schema.name];
        fieldName = `${convertedSchemaId}.${schema.name}`;
    }

    if (isMultiValued) {
        switch (inputType) {
            case ClaimInputFormat.CHECKBOX_GROUP:
                return (
                    <CheckBoxGroupFormField
                        schema={ schema }
                        fieldLabel={ fieldLabel }
                        fieldName={ fieldName }
                        initialValue={ initialValue as string[] }
                        isUpdating={ isUpdating }
                        isReadOnly={ isReadOnly }
                        isRequired={ isRequired }
                        data-componentid={ fieldComponentId }
                    />
                );

            case ClaimInputFormat.MULTI_SELECT_DROPDOWN:
                return (
                    <DropdownFormField
                        schema={ schema }
                        fieldLabel={ fieldLabel }
                        fieldName={ fieldName }
                        initialValue={ initialValue as string[] }
                        isUpdating={ isUpdating }
                        isReadOnly={ isReadOnly }
                        isRequired={ isRequired }
                        data-componentid={ fieldComponentId }
                        isMultiSelect
                    />
                );

            case ClaimInputFormat.TEXT_INPUT:
                return (
                    <MultiValuedTextField
                        schema={ schema }
                        fieldName={ fieldName }
                        fieldLabel={ fieldLabel }
                        initialValue={ initialValue as string[] }
                        isReadOnly={ isReadOnly }
                        isRequired={ isRequired }
                        isUpdating={ isUpdating }
                        maxValueLimit={ ProfileConstants.MAX_MULTI_VALUES_ALLOWED }
                        data-componentid={ fieldComponentId }
                    />
                );

            case ClaimInputFormat.NUMBER_INPUT:
                return (
                    <MultiValuedTextField
                        schema={ schema }
                        fieldName={ fieldName }
                        fieldLabel={ fieldLabel }
                        type="number"
                        initialValue={ initialValue as string[] }
                        isReadOnly={ isReadOnly }
                        isRequired={ isRequired }
                        isUpdating={ isUpdating }
                        maxValueLimit={ ProfileConstants.MAX_MULTI_VALUES_ALLOWED }
                        data-componentid={ fieldComponentId }
                    />
                );
        }
    }

    switch (inputType) {
        case ClaimInputFormat.NUMBER_INPUT:
            return (
                <TextFormField
                    fieldName={ fieldName }
                    fieldLabel={ fieldLabel }
                    type="number"
                    initialValue={ initialValue as string }
                    validator={ genericValidator }
                    maxLength={ maxLength }
                    isReadOnly={ isReadOnly }
                    isRequired={ isRequired }
                    isUpdating={ isUpdating }
                    data-componentid={ fieldComponentId }
                />
            );

        case ClaimInputFormat.CHECKBOX:
            return (
                <FinalFormField
                    component={ CheckboxFieldAdapter }
                    initialValue={ initialValue ?? false }
                    ariaLabel={ fieldLabel }
                    label={ fieldLabel }
                    name={ fieldName }
                    readOnly={ isReadOnly || isUpdating }
                    disabled={ isReadOnly || isUpdating }
                    required={ isRequired }
                    data-componentid={ fieldComponentId }
                />
            );

        case ClaimInputFormat.TOGGLE:
            return (
                <FinalFormField
                    component={ SwitchFieldAdapter }
                    initialValue={ initialValue ?? false }
                    ariaLabel={ fieldLabel }
                    label={ fieldLabel }
                    name={ fieldName }
                    readOnly={ isReadOnly || isUpdating }
                    disabled={ isReadOnly || isUpdating }
                    required={ isRequired }
                    data-componentid={ fieldComponentId }
                />
            );

        case ClaimInputFormat.DROPDOWN:
            return (
                <DropdownFormField
                    schema={ schema }
                    fieldLabel={ fieldLabel }
                    fieldName={ fieldName }
                    initialValue={ initialValue as string }
                    isUpdating={ isUpdating }
                    isReadOnly={ isReadOnly }
                    isRequired={ isRequired }
                    data-componentid={ fieldComponentId }
                />
            );

        case ClaimInputFormat.RADIO_GROUP:
            return (
                <RadioGroupFormField
                    schema={ schema }
                    fieldLabel={ fieldLabel }
                    fieldName={ fieldName }
                    initialValue={ initialValue as string }
                    isUpdating={ isUpdating }
                    isReadOnly={ isReadOnly }
                    isRequired={ isRequired }
                    validator={ genericValidator }
                    data-componentid={ fieldComponentId }
                />
            );

        default:
            return (
                <TextFormField
                    fieldName={ fieldName }
                    fieldLabel={ fieldLabel }
                    initialValue={ initialValue as string }
                    validator={ genericValidator }
                    maxLength={ maxLength }
                    isReadOnly={ isReadOnly }
                    isRequired={ isRequired }
                    isUpdating={ isUpdating }
                    data-componentid={ fieldComponentId }
                />
            );
    }
};

export default ProfileFormFieldRenderer;
