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
import { ClaimDataType, PatchOperationRequest } from "@wso2is/core/models";
import { FormValue } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import React, { Dispatch, FunctionComponent, ReactElement } from "react";
import { useDispatch } from "react-redux";
import CheckboxFieldForm from "./checkbox-field-form";
import CountryFieldForm from "./country-field-form";
import DOBFieldForm from "./dob-field-form";
import DropdownFieldForm from "./dropdown-field-form";
import EmailFieldForm from "./email-field-form";
import MobileFieldForm from "./mobile-field-form";
import MultiValueFieldForm from "./multi-valued-field-form";
import TextFieldForm from "./text-field-form";
import { CommonConstants } from "../../../constants";
import { SCIMConfigs as SCIMExtensionConfigs } from "../../../extensions/configs/scim";
import { ProfilePatchOperationValue } from "../../../models/profile";
import { ProfileFieldFormRendererPropsInterface } from "../../../models/profile-ui";
import { setActiveForm } from "../../../store/actions";

const ProfileFieldFormRenderer: FunctionComponent<ProfileFieldFormRendererPropsInterface> = (
    {
        fieldSchema,
        flattenedProfileSchema,
        fieldLabel,
        isActive,
        initialValue,
        isEditable,
        isRequired,
        setIsProfileUpdating,
        isLoading,
        isUpdating,
        triggerUpdate,
        profileInfo,
        isEmailVerificationEnabled,
        isMobileVerificationEnabled,
        [ "data-componentid" ]: componentId
    }: ProfileFieldFormRendererPropsInterface
): ReactElement => {

    const { type, canonicalValues, multiValued: isMultiValuedSchema, extended: isExtendedSchema } = fieldSchema;
    let fieldType: ClaimDataType = type?.toLocaleLowerCase() as ClaimDataType;

    const dispatch: Dispatch<any> = useDispatch();

    const onEditClicked = (): void => {
        dispatch(setActiveForm(CommonConstants.PERSONAL_INFO + fieldSchema.name));
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
                tempPatchValue = { [schemaName]: tempPatchValue ?? value };
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
                initialValue={ initialValue }
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

    // Render and handle email addresses in a different manner.
    if (
        [
            SCIMExtensionConfigs.scimUserSchema.emails,
            SCIMExtensionConfigs.scimUserSchema.emailsHome,
            SCIMExtensionConfigs.scimSystemSchema.emailAddresses
        ].includes(fieldSchema.schemaUri)
    ) {
        return (
            <EmailFieldForm
                fieldSchema={ fieldSchema }
                initialValue={ initialValue }
                profileInfo={ profileInfo }
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

    // Render and handle phone numbers in a different manner.
    if (
        [
            SCIMExtensionConfigs.scimUserSchema.phoneNumbersMobile,
            SCIMExtensionConfigs.scimSystemSchema.mobileNumbers
        ].includes(fieldSchema.schemaUri)
    ) {
        return (
            <MobileFieldForm
                fieldSchema={ fieldSchema }
                flattenedProfileSchema={ flattenedProfileSchema }
                initialValue={ initialValue }
                profileInfo={ profileInfo }
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
                initialValue={ initialValue }
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

    if (canonicalValues?.length > 0) {
        fieldType = ClaimDataType.OPTIONS;
    }

    if (isMultiValuedSchema && isExtendedSchema) {
        switch (fieldType) {
            case ClaimDataType.INTEGER: {
                const valueList: number[] = isEmpty(initialValue)
                    ? []
                    : initialValue.split(",").map((value: string) => Number(value));

                return (
                    <MultiValueFieldForm<number>
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
                        type="number"
                    />
                );
            }

            default: {
                const valueList: string[] = isEmpty(initialValue) ? [] : initialValue.split(",");

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
    }

    switch (fieldType) {
        case ClaimDataType.BOOLEAN:
            return (
                <CheckboxFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue }
                    fieldLabel={ fieldLabel }
                    setIsProfileUpdating={ setIsProfileUpdating }
                    isLoading={ isLoading }
                    isUpdating={ isUpdating }
                    data-componentid={ componentId }
                    handleSubmit={ handleSubmit }
                />
            );

        case ClaimDataType.INTEGER:
            return (
                <TextFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue }
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

        case ClaimDataType.DECIMAL:
            return (
                <TextFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue }
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
                    step="any"
                />
            );

        // As of now text field will be rendered for dates as well.
        case ClaimDataType.DATE_TIME:
        case ClaimDataType.STRING:
            return (
                <TextFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue }
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

        case ClaimDataType.OPTIONS:
            return (
                <DropdownFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue }
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

        default:
            return (
                <TextFieldForm
                    fieldSchema={ fieldSchema }
                    initialValue={ initialValue }
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
