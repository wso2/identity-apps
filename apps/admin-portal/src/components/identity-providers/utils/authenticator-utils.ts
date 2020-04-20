import {
    CommonConstants,
    FieldType,
    getCheckboxField,
    getConfidentialField, getDropDownField,
    getQueryParamsField,
    getTextField,
    getURLField
} from "../forms/helpers";
import { FederatedAuthenticatorMetaPropertyInterface } from "../../../models";

/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

const getFieldType = (propertyMetadata: FederatedAuthenticatorMetaPropertyInterface): FieldType => {
    if (propertyMetadata?.type?.toUpperCase() === CommonConstants.BOOLEAN) {
        return FieldType.CHECKBOX;
    } else if (propertyMetadata?.isConfidential) {
        return FieldType.CONFIDENTIAL;
    } else if (propertyMetadata?.key.toUpperCase().includes(CommonConstants.FIELD_COMPONENT_KEYWORD_URL)) {
        // todo Need proper backend support to identity URL fields.
        return FieldType.URL;
    } else if (propertyMetadata?.key.toUpperCase().includes(
        CommonConstants.FIELD_COMPONENT_KEYWORD_QUERY_PARAMETER)) {
        // todo Need proper backend support to identity Query parameter fields.
        return FieldType.QUERY_PARAMS;
    } else if (propertyMetadata?.options?.length > 0) {
        return FieldType.DROP_DOWN;
    }
    return FieldType.TEXT;
};

export const getPropertyField = (eachProp, propertyMetadata) => {
    switch (getFieldType(propertyMetadata)) {
        // TODO Identify URLs, and generate a Field which supports URL validation.
        case FieldType.CHECKBOX : {
            return getCheckboxField(eachProp, propertyMetadata);
        }
        case FieldType.CONFIDENTIAL : {
            return getConfidentialField(eachProp, propertyMetadata);
        }
        case FieldType.URL : {
            return getURLField(eachProp, propertyMetadata);
        }
        case FieldType.QUERY_PARAMS : {
            return getQueryParamsField(eachProp, propertyMetadata);
        }
        case FieldType.DROP_DOWN : {
            return getDropDownField(eachProp, propertyMetadata);
        }
        default: {
            return getTextField(eachProp, propertyMetadata);
        }
    }
};
