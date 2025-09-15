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
import { ClaimInputFormat, PatchOperationRequest } from "@wso2is/core/models";
import { FormValue } from "@wso2is/forms";
import React, { Dispatch, FunctionComponent, ReactElement } from "react";
import { useDispatch } from "react-redux";
import CheckboxFieldForm from "./checkbox-field-form";
import CheckboxGroupFieldForm from "./checkbox-group-field-form";
import CountryFieldForm from "./country-field-form";
import DOBFieldForm from "./dob-field-form";
import DropdownFieldForm from "./dropdown-field-form";
import LocaleFieldForm from "./locale-field-form";
import MultiEmailFieldForm from "./multi-email-field-form";
import MultiMobileFieldForm from "./multi-mobile-field-form";
import MultiValueFieldForm from "./multi-valued-field-form";
import RadioFieldForm from "./radio-field-form";
import SingleEmailFieldForm from "./single-email-field-form";
import SingleMobileFieldForm from "./single-mobile-field-form";
import SwitchFieldForm from "./switch-field-form";
import TextFieldForm from "./text-field-form";
import { SCIMConfigs as SCIMExtensionConfigs } from "../../../extensions/configs/scim";
import { ProfilePatchOperationValue } from "../../../models/profile";
import { ProfileFieldFormRendererPropsInterface } from "../../../models/profile-ui";
import { setActiveForm } from "../../../store/actions";

const ProfileFieldFormRenderer: FunctionComponent<
    ProfileFieldFormRendererPropsInterface<string | number | boolean | string[]>
> = (
    {
        fieldSchema,
        flattenedProfileSchema,
        fieldLabel,
        isActive,
        formId,
        initialValue,
        flattenedProfileData,
        isEditable,
        isRequired,
        setIsProfileUpdating,
        isLoading,
        isUpdating,
        triggerUpdate,
        isEmailVerificationEnabled,
        isMobileVerificationEnabled,
        [ "data-componentid" ]: componentId
    }: ProfileFieldFormRendererPropsInterface<string | number | boolean | string[]>
): ReactElement => {

    const { multiValued: isMultiValuedSchema, extended: isExtendedSchema } = fieldSchema;

    const dispatch: Dispatch<any> = useDispatch();

    const onEditClicked = (): void => {
        dispatch(setActiveForm(formId));
    };

    const onEditCancelClicked = (): void => {
        dispatch(setActiveForm(null));
    };

    const handleSubmit = (schemaName: string, value: FormValue): void => {
        // Attribute name could be as follows:
        // "organizaion" -> simple attribute
        // "name.givenName" -> complex attribute {name: {givenName: "John"}}
        // "addresses#home.streetAddress" ->
        // multi-valued, complex attribute {addresses: [{type: "home", streetAddress: "123 Main St"}] }

        // Split to check for sub attributes.
        // Ex: addresses#home.streetAddress -> ["addresses#home", "streetAddress"]
        const attributeNames: string[] = schemaName.split(".");

        // Split to check for canonical type.
        // Ex: addresses#home -> ["addresses", "home"]
        const parentAttributeName: string = attributeNames[0];
        const schemaNamesCanonicalTypes: string[] = parentAttributeName.split("#");

        const isCanonical: boolean = schemaNamesCanonicalTypes.length > 1;
        let tempPatchValue: Record<string, unknown> = null;

        attributeNames.reverse();

        for (const schemaName of attributeNames) {
            if (schemaName === parentAttributeName && isCanonical) {
                // Builds complex multi-valued scenario
                // {addresses: [ {type: "home", streetAddress: "123 Main St"} ] }
                tempPatchValue = {
                    [schemaNamesCanonicalTypes[0]]: [ { ...tempPatchValue, type: schemaNamesCanonicalTypes[1] } ]
                };
            } else {
                tempPatchValue = { [schemaName]: tempPatchValue ?? value ?? "" };
            }
        }

        if (fieldSchema.extended) {
            tempPatchValue = {
                [fieldSchema.schemaId]: tempPatchValue
            };
        }

        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [
                {
                    op: isCanonical ? "add" : "replace",
                    value: tempPatchValue as ProfilePatchOperationValue
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        triggerUpdate(data);
    };

    // Render country dropdown.
    if (fieldSchema.schemaUri === SCIMExtensionConfigs.scimSystemSchema.country) {
        return (
            <CountryFieldForm
                fieldSchema={ fieldSchema }
                initialValue={ initialValue as string }
                fieldLabel={ fieldLabel }
                isRequired={ isRequired }
                isEditable={ isEditable }
                isActive={ isActive }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                handleSubmit={ handleSubmit }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                data-componentid={ componentId }
            />
        );
    }

    // Render locale dropdown.
    if (fieldSchema.name === "locale") {
        return (
            <LocaleFieldForm
                fieldSchema={ fieldSchema }
                initialValue={ initialValue as string }
                fieldLabel={ fieldLabel }
                isRequired={ isRequired }
                isEditable={ isEditable }
                isActive={ isActive }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                handleSubmit={ handleSubmit }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                data-componentid={ componentId }
            />
        );
    }

    // Render single valued email address field.
    if (
        [
            SCIMExtensionConfigs.scimUserSchema.emails,
            SCIMExtensionConfigs.scimUserSchema.emailsHome
        ].includes(fieldSchema.schemaUri)
    ) {
        // Extract the pending email address.
        // { "urn:scim:wso2:schema": { pendingEmails: [value: <email_address>] } }
        const pendingEmailAddress: string = (flattenedProfileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][
            ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PENDING_EMAILS")
        ] as string[])?.[0]?.["value"];

        return (
            <SingleEmailFieldForm
                fieldSchema={ fieldSchema }
                initialValue={ initialValue as string }
                pendingEmailAddress={ pendingEmailAddress }
                fieldLabel={ fieldLabel }
                isActive={ isActive }
                isEditable={ isEditable }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                isRequired={ isRequired }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                data-componentid={ componentId }
                isVerificationEnabled={ isEmailVerificationEnabled }
                triggerUpdate={ triggerUpdate }
            />
        );
    }

    // Render and handle email addresses in a different manner.
    if (fieldSchema.schemaUri === SCIMExtensionConfigs.scimSystemSchema.emailAddresses) {
        const verifiedEmailAddresses: string[] =
            flattenedProfileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][
                ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES")];
        const primaryEmailAddress: string = flattenedProfileData[
            ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")] as string;
        // Extract the pending email address.
        // { "urn:scim:wso2:schema": { pendingEmails: [value: <email_address>] } }
        const pendingEmailAddress: string = (flattenedProfileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][
            ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PENDING_EMAILS")
        ] as string[])?.[0]?.["value"];

        return (
            <MultiEmailFieldForm
                fieldSchema={ fieldSchema }
                initialValue={ initialValue as string[] }
                verifiedEmailAddresses={ verifiedEmailAddresses }
                primaryEmailAddress={ primaryEmailAddress }
                pendingEmailAddress={ pendingEmailAddress }
                fieldLabel={ fieldLabel }
                isActive={ isActive }
                isEditable={ isEditable }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                isRequired={ isRequired }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                data-componentid={ componentId }
                isVerificationEnabled={ isEmailVerificationEnabled }
                triggerUpdate={ triggerUpdate }
            />
        );
    }

    // Render single valued mobile number field.
    if (fieldSchema.schemaUri === SCIMExtensionConfigs.scimUserSchema.phoneNumbersMobile) {
        return (
            <SingleMobileFieldForm
                fieldSchema={ fieldSchema }
                initialValue={ initialValue as string }
                fieldLabel={ fieldLabel }
                isActive={ isActive }
                isEditable={ isEditable }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                isRequired={ isRequired }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                data-componentid={ componentId }
                isVerificationEnabled={ isMobileVerificationEnabled }
                triggerUpdate={ triggerUpdate }
            />
        );
    }

    // Render and handle phone numbers in a different manner.
    if (fieldSchema.schemaUri === SCIMExtensionConfigs.scimSystemSchema.mobileNumbers) {
        const verifiedMobileNumbers: string[] =
            flattenedProfileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][
                ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS")];
        const primaryMobile: string = flattenedProfileData[
            ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE")] as string;

        return (
            <MultiMobileFieldForm
                fieldSchema={ fieldSchema }
                flattenedProfileSchema={ flattenedProfileSchema }
                initialValue={ initialValue as string[] }
                primaryMobileNumber={ primaryMobile }
                verifiedMobileNumbers={ verifiedMobileNumbers }
                fieldLabel={ fieldLabel }
                isActive={ isActive }
                isEditable={ isEditable }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                isRequired={ isRequired }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                data-componentid={ componentId }
                isVerificationEnabled={ isMobileVerificationEnabled }
                triggerUpdate={ triggerUpdate }
            />
        );
    }

    if (fieldSchema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("DOB")) {
        return (
            <DOBFieldForm
                fieldSchema={ fieldSchema }
                initialValue={ initialValue as string }
                fieldLabel={ fieldLabel }
                isActive={ isActive }
                isEditable={ isEditable }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                isRequired={ isRequired }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                data-componentid={ componentId }
                handleSubmit={ handleSubmit }
            />
        );
    }

    const inputType: ClaimInputFormat = fieldSchema.inputFormat?.inputType ?? ClaimInputFormat.TEXT_INPUT;

    if (isMultiValuedSchema && isExtendedSchema) {
        const valueList: string[] = (initialValue ?? []) as string[];

        switch (inputType) {
            case ClaimInputFormat.MULTI_SELECT_DROPDOWN:
                return (
                    <DropdownFieldForm
                        fieldSchema={ fieldSchema }
                        initialValue={ valueList }
                        fieldLabel={ fieldLabel }
                        isActive={ isActive }
                        isEditable={ isEditable }
                        onEditClicked={ onEditClicked }
                        onEditCancelClicked={ onEditCancelClicked }
                        isRequired={ isRequired }
                        setIsProfileUpdating={ setIsProfileUpdating }
                        isLoading={ isLoading }
                        isUpdating={ isUpdating }
                        data-componentid={ componentId }
                        handleSubmit={ handleSubmit }
                        isMultiSelect
                    />
                );

            case ClaimInputFormat.CHECKBOX_GROUP:
                return (
                    <CheckboxGroupFieldForm
                        fieldSchema={ fieldSchema }
                        initialValue={ valueList }
                        fieldLabel={ fieldLabel }
                        isActive={ isActive }
                        isEditable={ isEditable }
                        onEditClicked={ onEditClicked }
                        onEditCancelClicked={ onEditCancelClicked }
                        isRequired={ isRequired }
                        setIsProfileUpdating={ setIsProfileUpdating }
                        isLoading={ isLoading }
                        isUpdating={ isUpdating }
                        data-componentid={ componentId }
                        handleSubmit={ handleSubmit }
                    />
                );

            case ClaimInputFormat.NUMBER_INPUT: {
                const _valueList: number[] = valueList.map((value: string) => Number(value));

                return (
                    <MultiValueFieldForm<number>
                        fieldSchema={ fieldSchema }
                        initialValue={ _valueList }
                        fieldLabel={ fieldLabel }
                        isActive={ isActive }
                        isEditable={ isEditable }
                        onEditClicked={ onEditClicked }
                        onEditCancelClicked={ onEditCancelClicked }
                        isRequired={ isRequired }
                        setIsProfileUpdating={ setIsProfileUpdating }
                        isLoading={ isLoading }
                        isUpdating={ isUpdating }
                        data-componentid={ componentId }
                        handleSubmit={ handleSubmit }
                        type="number"
                    />
                );
            }

            default:
                return (
                    <MultiValueFieldForm<string>
                        fieldSchema={ fieldSchema }
                        initialValue={ valueList }
                        fieldLabel={ fieldLabel }
                        isActive={ isActive }
                        isEditable={ isEditable }
                        onEditClicked={ onEditClicked }
                        onEditCancelClicked={ onEditCancelClicked }
                        isRequired={ isRequired }
                        setIsProfileUpdating={ setIsProfileUpdating }
                        isLoading={ isLoading }
                        isUpdating={ isUpdating }
                        data-componentid={ componentId }
                        handleSubmit={ handleSubmit }
                    />
                );
        }
    }

    switch (inputType) {
        case ClaimInputFormat.CHECKBOX:
            return (
                <CheckboxFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue as boolean }
                    fieldLabel={ fieldLabel }
                    isEditable={ isEditable }
                    setIsProfileUpdating={ setIsProfileUpdating }
                    isLoading={ isLoading }
                    isUpdating={ isUpdating }
                    data-componentid={ componentId }
                    handleSubmit={ handleSubmit }
                />
            );

        case ClaimInputFormat.TOGGLE:
            return (
                <SwitchFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue as boolean }
                    fieldLabel={ fieldLabel }
                    isEditable={ isEditable }
                    setIsProfileUpdating={ setIsProfileUpdating }
                    isLoading={ isLoading }
                    isUpdating={ isUpdating }
                    data-componentid={ componentId }
                    handleSubmit={ handleSubmit }
                />
            );

        case ClaimInputFormat.DROPDOWN:
            return (
                <DropdownFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue as string }
                    fieldLabel={ fieldLabel }
                    isActive={ isActive }
                    isEditable={ isEditable }
                    onEditClicked={ onEditClicked }
                    onEditCancelClicked={ onEditCancelClicked }
                    isRequired={ isRequired }
                    setIsProfileUpdating={ setIsProfileUpdating }
                    isLoading={ isLoading }
                    isUpdating={ isUpdating }
                    data-componentid={ componentId }
                    handleSubmit={ handleSubmit }
                />
            );

        case ClaimInputFormat.RADIO_GROUP:
            return (
                <RadioFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue as string }
                    fieldLabel={ fieldLabel }
                    isActive={ isActive }
                    isEditable={ isEditable }
                    onEditClicked={ onEditClicked }
                    onEditCancelClicked={ onEditCancelClicked }
                    isRequired={ isRequired }
                    setIsProfileUpdating={ setIsProfileUpdating }
                    isLoading={ isLoading }
                    isUpdating={ isUpdating }
                    data-componentid={ componentId }
                    handleSubmit={ handleSubmit }
                />
            );

        case ClaimInputFormat.NUMBER_INPUT:
            return (
                <TextFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue as string }
                    fieldLabel={ fieldLabel }
                    isActive={ isActive }
                    isEditable={ isEditable }
                    onEditClicked={ onEditClicked }
                    onEditCancelClicked={ onEditCancelClicked }
                    isRequired={ isRequired }
                    setIsProfileUpdating={ setIsProfileUpdating }
                    isLoading={ isLoading }
                    isUpdating={ isUpdating }
                    data-componentid={ componentId }
                    handleSubmit={ handleSubmit }
                    type="number"
                />
            );

        // As of now text field will be rendered for dates as well.
        case ClaimInputFormat.DATE_PICKER:
        case ClaimInputFormat.TEXT_INPUT:
        default:
            return (
                <TextFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue as string }
                    fieldLabel={ fieldLabel }
                    isActive={ isActive }
                    isEditable={ isEditable }
                    onEditClicked={ onEditClicked }
                    onEditCancelClicked={ onEditCancelClicked }
                    isRequired={ isRequired }
                    setIsProfileUpdating={ setIsProfileUpdating }
                    isLoading={ isLoading }
                    isUpdating={ isUpdating }
                    data-componentid={ componentId }
                    handleSubmit={ handleSubmit }
                />
            );
    }
};

export default ProfileFieldFormRenderer;
