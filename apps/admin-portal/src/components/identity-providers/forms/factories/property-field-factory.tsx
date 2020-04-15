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

import { CommonConstants, FieldType } from "../helpers";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../../models";
import { getCheckboxField, getConfidentialField, getQueryParamsField, getTextField, getURLField } from "../helpers";
import React, { FunctionComponent, ReactElement } from "react";

interface PropertyFieldFactoryFactoryInterface {
    property: CommonPluggableComponentPropertyInterface;
    propertyMetadata: CommonPluggableComponentMetaPropertyInterface;
    disabled: boolean;
}

/**
 * Property Field factory.
 *
 * @param {PropertyFieldFactoryFactoryInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const PropertyFieldFactory: FunctionComponent<PropertyFieldFactoryFactoryInterface> = 
    (props: PropertyFieldFactoryFactoryInterface): ReactElement => {

    const {
        property,
        propertyMetadata,
        disabled
    } = props;

    /**
     * Get interpreted field type for given property metada.
     *
     * @param propertyMetadata Property metadata of type {@link CommonPluggableComponentMetaPropertyInterface}.
     */
    const getFieldType = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): FieldType => {

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
        }
        return FieldType.TEXT;
    };

    /**
     * Get corresponding {@link Field} component for the provided property.
     *
     * @param property Property of type {@link CommonPluggableComponentPropertyInterface}.
     * @param propertyMetadata Property metadata of type {@link CommonPluggableComponentMetaPropertyInterface}.
     */
    const getPropertyField = (property: CommonPluggableComponentPropertyInterface,
                                     propertyMetadata: CommonPluggableComponentMetaPropertyInterface): ReactElement => {

        switch (getFieldType(propertyMetadata)) {
            // TODO Identify URLs, and generate a Field which supports URL validation.
            case FieldType.CHECKBOX : {
                return getCheckboxField(property, propertyMetadata);
            }
            case FieldType.CONFIDENTIAL : {
                return getConfidentialField(property, propertyMetadata);
            }
            case FieldType.URL : {
                return getURLField(property, propertyMetadata);
            }
            case FieldType.QUERY_PARAMS : {
                return getQueryParamsField(property, propertyMetadata);
            }
            default: {
                return getTextField(property, propertyMetadata);
            }
        }
    };

    return getPropertyField(property, propertyMetadata);
};
