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

import { IdentifiableComponentInterface, PatchOperationRequest, ProfileSchemaInterface } from "@wso2is/core/models";
import { FormValue, Validation } from "@wso2is/forms";
import { ProfilePatchOperationValue } from "./profile";

export interface ProfileFieldFormRendererPropsInterface extends IdentifiableComponentInterface {
    fieldSchema: ProfileSchemaInterface;
    flattenedProfileSchema: ProfileSchemaInterface[];
    initialValue: string;
    fieldLabel: string;
    isActive: boolean;
    isEditable: boolean;
    isRequired: boolean;
    setIsProfileUpdating: (value: boolean) => void;
    triggerUpdate: (data: PatchOperationRequest<ProfilePatchOperationValue>) => void;
    profileInfo: Map<string, string>;
    isEmailVerificationEnabled: boolean;
    isMobileVerificationEnabled: boolean;
    isLoading: boolean;
    isUpdating: boolean;
}

export interface ProfileFieldFormPropsInterface
    extends Omit<
        ProfileFieldFormRendererPropsInterface,
        | "triggerUpdate"
        | "profileInfo"
        | "isEmailVerificationEnabled"
        | "isMobileVerificationEnabled"
        | "flattenedProfileSchema"
    > {
    onEditClicked: () => void;
    onEditCancelClicked: () => void;
    handleSubmit: (schemaName: string, value: FormValue) => void;
}

export interface TextFieldFormPropsInterface extends ProfileFieldFormPropsInterface {
    onValidate?: (value: string, validation: Validation) => void;
    placeholderText?: string;
    type?: "text" | "number";
    step?: number | "any";
}

export interface CountryFieldFormPropsInterface extends ProfileFieldFormPropsInterface {}

export interface EmailFieldFormPropsInterface extends Omit<ProfileFieldFormPropsInterface, "handleSubmit"> {
    profileInfo: Map<string, string>;
    isVerificationEnabled: boolean;
    triggerUpdate: (data: PatchOperationRequest<ProfilePatchOperationValue>) => void;
}

export interface MobileFieldFormPropsInterface extends Omit<ProfileFieldFormPropsInterface, "handleSubmit"> {
    profileInfo: Map<string, string>;
    isVerificationEnabled: boolean;
    triggerUpdate: (data: PatchOperationRequest<ProfilePatchOperationValue>) => void;
    flattenedProfileSchema: ProfileSchemaInterface[];
}

export interface CheckBoxFieldFormPropsInterface
    extends Omit<
        ProfileFieldFormPropsInterface,
        "isActive" | "isEditable" | "isRequired" | "profileInfo" | "onEditClicked" | "onEditCancelClicked"
    > {}

export interface DOBFieldFormPropsInterface extends ProfileFieldFormPropsInterface {}

export interface DropdownFieldFormPropsInterface extends ProfileFieldFormPropsInterface {}

export interface MultiValueFieldFormPropsInterface<T extends string | number>
    extends Omit<ProfileFieldFormPropsInterface, "initialValue"> {
    initialValue: T[];
    type?: string;
}
