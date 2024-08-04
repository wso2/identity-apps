/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { FormFieldMessage } from "@wso2is/form";

/**
 * Model that represent an input field in the UI metadata for an IDVP. It contains the
 * information required to render the input field in the UI.
 */
export interface InputFieldMetadata {
    name: string;
    displayOrder: number;
    hint: string;
    label: string;
    type: string;
    required: boolean;
    dataComponentId: string;
    defaultValue?: string | boolean | number | DropdownOptionsInterface;
    options?: DropdownOptionsInterface[];
    placeholder?: string;
    message?: FormFieldMessage;
    maxLength?: number;
    minLength?: number;
    validationRegex?: string;
    regexValidationError?: string;
}

/**
 * Model that represent the UI metadata for an IDP. It contains the information required
 * to render the configuration settings section when creating and editing an IDVP.
 */
export interface UIMetaDataForIDVP {
    pages: {
        edit: {
            settings: InputFieldMetadata[];
            general?: InputFieldMetadata[];
            attributes?: InputFieldMetadata[];
        };
    }
}

/**
 * Model that represents a dropdown option
 */
export interface DropdownOptionsInterface {
     label: string;
     value: string
}

/**
 * Model that represents the metadata of an IDVP type. It contains the information
 * required to render the IDVP templates section, resolve IDVP image, etc.
 */
export interface IDVPTypeMetadataInterface {
    id: string;
    name: string;
    description: string;
    image: string;
    displayOrder: number;
    tags: string[];
    category: string;
    type: string;
    self: string;
}
