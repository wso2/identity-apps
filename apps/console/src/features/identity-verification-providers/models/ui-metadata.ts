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

export interface InputFieldMetaData {
    name: string;
    displayOrder: number;
    hint: string;
    label: string;
    type: string;
    required: boolean;
    isSecret: boolean;
    dataComponentId: string;
    defaultValue?: string | boolean | number | DropdownOptionsInterface;
    options?: DropdownOptionsInterface[];
    placeholder?: string;
    message?: FormFieldMessage;
    maxLength?: number;
    minLength?: number;
}

export interface UIMetaDataForIDVP {
    image: string;
    pages: {
        edit: {
            settings: InputFieldMetaData[];
            general?: InputFieldMetaData[];
            attributes?: InputFieldMetaData[];
        };
    }
}

export interface DropdownOptionsInterface {
     label: string;
     value: string
}
