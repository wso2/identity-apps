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

import { CommonPluggableComponentMetaPropertyInterface } from "../../models";

/**
 * Find the corresponding metadata for the given property key, among the provided set of meta properties. This method
 * recursively traverse through all the properties and sub-properties in the provided meta property set.
 *
 * @param propertyKey Key of the property.
 * @param metaProperties Set of meta properties.
 */
export const getPropertyMetadata = (propertyKey: string, metaProperties:
    CommonPluggableComponentMetaPropertyInterface[]): CommonPluggableComponentMetaPropertyInterface => {
    
    for (let i = 0; i < metaProperties?.length; i++) {
        const metaProperty = metaProperties[i];
        if (metaProperty.key === propertyKey) {
            return  metaProperty;
        } else if (metaProperty.subProperties?.length > 0) {
            return getPropertyMetadata(propertyKey, metaProperty.subProperties);
        }
    }
};
