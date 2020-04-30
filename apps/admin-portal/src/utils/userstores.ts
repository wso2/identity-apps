import { UserStoreProperty } from "./../models/user-stores";
/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { CategorizedProperties, TypeProperty, UserstorePropertiesCategories, UserstoreType } from "../models";

export const reOrganizeProperties = (
    properties: UserstoreType["properties"],
    valueProperties?: UserStoreProperty[]
): CategorizedProperties => {
    const flattenedProperties: TypeProperty[] = [];
    flattenedProperties.push(...properties.Advanced);
    flattenedProperties.push(...properties.Mandatory);
    flattenedProperties.push(...properties.Optional);

    const connectionRequiredProperties: TypeProperty[] = [];
    const connectionOptionalProperties: TypeProperty[] = [];
    const connectionOptionalSqlProperties: TypeProperty[] = [];

    const userRequiredProperties: TypeProperty[] = [];
    const userOptionalProperties: TypeProperty[] = [];
    const userOptionalSqlProperties: TypeProperty[] = [];

    const groupRequiredProperties: TypeProperty[] = [];
    const groupOptionalProperties: TypeProperty[] = [];
    const groupOptionalSqlProperties: TypeProperty[] = [];

    const basicRequiredProperties: TypeProperty[] = [];
    const basicOptionalProperties: TypeProperty[] = [];
    const basicOptionalSqlProperties: TypeProperty[] = [];

    flattenedProperties.forEach((property: TypeProperty) => {
        const category = property.attributes?.find((attribute) => attribute.name === "category")?.value;
        const required = property.attributes?.find((attribute) => attribute.name === "required")?.value === "true";
        const sql = property.attributes?.find((attribute) => attribute.name === "type")?.value === "sql";
        const INSERT = property.description.toLowerCase().includes("add");
        const DELETE = property.description.toLowerCase().includes("delete");

        if (valueProperties) {
            property.value = valueProperties.find((valueProperty) => valueProperty.name === property.name)?.value ?? "";
        }

        switch (category) {
            case UserstorePropertiesCategories.CONNECTION:
                required
                    ? connectionRequiredProperties.push(property)
                    : sql
                    ? connectionOptionalSqlProperties.push(property)
                    : connectionOptionalProperties.push(property);
                break;
            case UserstorePropertiesCategories.GROUP:
                required
                    ? groupRequiredProperties.push(property)
                    : sql
                    ? groupOptionalSqlProperties.push(property)
                    : groupOptionalProperties.push(property);
                break;
            case UserstorePropertiesCategories.USER:
                required
                    ? userRequiredProperties.push(property)
                    : sql
                    ? userOptionalSqlProperties.push(property)
                    : userOptionalProperties.push(property);
                break;
            case UserstorePropertiesCategories.BASIC:
                required
                    ? basicRequiredProperties.push(property)
                    : sql
                    ? basicOptionalSqlProperties.push(property)
                    : basicOptionalProperties.push(property);
        }
    });

    return {
        basic: {
            optional: {
                nonSql: basicOptionalProperties,
                sql: basicOptionalSqlProperties
            },
            required: basicRequiredProperties
        },
        connection: {
            optional: {
                nonSql: connectionOptionalProperties,
                sql: connectionOptionalSqlProperties
            },
            required: connectionRequiredProperties
        },
        group: {
            optional: {
                nonSql: groupOptionalProperties,
                sql: groupOptionalSqlProperties
            },
            required: groupRequiredProperties
        },
        user: {
            optional: {
                nonSql: userOptionalProperties,
                sql: userOptionalSqlProperties
            },
            required: userRequiredProperties
        }
    };
};
