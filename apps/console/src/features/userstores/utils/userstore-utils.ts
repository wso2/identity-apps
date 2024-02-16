/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import {
    CategorizedProperties, PropertyAttribute, TypeProperty, UserStoreProperty,
    UserstorePropertiesCategories, UserstoreType
} from "../models";

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
    const connectionOptionalSqlInsertProperties: TypeProperty[] = [];
    const connectionOptionalSqlDeleteProperties: TypeProperty[] = [];
    const connectionOptionalSqlUpdateProperties: TypeProperty[] = [];
    const connectionOptionalSqlSelectProperties: TypeProperty[] = [];

    const userRequiredProperties: TypeProperty[] = [];
    const userOptionalProperties: TypeProperty[] = [];
    const userOptionalSqlInsertProperties: TypeProperty[] = [];
    const userOptionalSqlDeleteProperties: TypeProperty[] = [];
    const userOptionalSqlUpdateProperties: TypeProperty[] = [];
    const userOptionalSqlSelectProperties: TypeProperty[] = [];

    const groupRequiredProperties: TypeProperty[] = [];
    const groupOptionalProperties: TypeProperty[] = [];
    const groupOptionalSqlInsertProperties: TypeProperty[] = [];
    const groupOptionalSqlDeleteProperties: TypeProperty[] = [];
    const groupOptionalSqlUpdateProperties: TypeProperty[] = [];
    const groupOptionalSqlSelectProperties: TypeProperty[] = [];

    const basicRequiredProperties: TypeProperty[] = [];
    const basicOptionalProperties: TypeProperty[] = [];
    const basicOptionalSqlInsertProperties: TypeProperty[] = [];
    const basicOptionalSqlDeleteProperties: TypeProperty[] = [];
    const basicOptionalSqlUpdateProperties: TypeProperty[] = [];
    const basicOptionalSqlSelectProperties: TypeProperty[] = [];

    flattenedProperties.forEach((property: TypeProperty) => {
        const category: string = property.attributes?.find((attribute: PropertyAttribute) =>
            attribute.name === "category")?.value;
        const required: boolean = property.attributes?.find((attribute: PropertyAttribute) =>
            attribute.name === "required")?.value === "true";
        const sql: boolean = property.attributes?.find((attribute: PropertyAttribute) =>
            attribute.name === "type")?.value === "sql";
        const INSERT: boolean = property.description.toLowerCase().includes("add");
        const DELETE: boolean = property.description.toLowerCase().includes("delete");
        const UPDATE: boolean = property.description.toLowerCase().includes("update");

        if (valueProperties) {
            property.value = valueProperties.find((valueProperty: UserStoreProperty) =>
                valueProperty.name === property.name)?.value ?? "";
        }

        switch (category) {
            case UserstorePropertiesCategories.CONNECTION:
                required
                    ? connectionRequiredProperties.push(property)
                    : sql
                        ? INSERT
                            ? connectionOptionalSqlInsertProperties.push(property)
                            : DELETE
                                ? connectionOptionalSqlDeleteProperties.push(property)
                                : UPDATE
                                    ? connectionOptionalSqlUpdateProperties.push(property)
                                    : connectionOptionalSqlSelectProperties.push(property)
                        : connectionOptionalProperties.push(property);

                break;
            case UserstorePropertiesCategories.GROUP:
                required
                    ? groupRequiredProperties.push(property)
                    : sql
                        ? INSERT
                            ? groupOptionalSqlInsertProperties.push(property)
                            : DELETE
                                ? groupOptionalSqlDeleteProperties.push(property)
                                : UPDATE
                                    ? groupOptionalSqlUpdateProperties.push(property)
                                    : groupOptionalSqlSelectProperties.push(property)
                        : groupOptionalProperties.push(property);

                break;
            case UserstorePropertiesCategories.USER:
                required
                    ? userRequiredProperties.push(property)
                    : sql
                        ? INSERT
                            ? userOptionalSqlInsertProperties.push(property)
                            : DELETE
                                ? userOptionalSqlDeleteProperties.push(property)
                                : UPDATE
                                    ? userOptionalSqlUpdateProperties.push(property)
                                    : userOptionalSqlSelectProperties.push(property)
                        : userOptionalProperties.push(property);

                break;
            case UserstorePropertiesCategories.BASIC:
                required
                    ? basicRequiredProperties.push(property)
                    : sql
                        ? INSERT
                            ? basicOptionalSqlInsertProperties.push(property)
                            : DELETE
                                ? basicOptionalSqlDeleteProperties.push(property)
                                : UPDATE
                                    ? basicOptionalSqlUpdateProperties.push(property)
                                    : basicOptionalSqlSelectProperties.push(property)
                        : basicOptionalProperties.push(property);

                break;
        }
    });

    return {
        basic: {
            optional: {
                nonSql: basicOptionalProperties,
                sql: {
                    delete: basicOptionalSqlDeleteProperties,
                    insert: basicOptionalSqlInsertProperties,
                    select: basicOptionalSqlSelectProperties,
                    update: basicOptionalSqlUpdateProperties
                }
            },
            required: basicRequiredProperties
        },
        connection: {
            optional: {
                nonSql: connectionOptionalProperties,
                sql: {
                    delete: connectionOptionalSqlDeleteProperties,
                    insert: connectionOptionalSqlInsertProperties,
                    select: connectionOptionalSqlSelectProperties,
                    update: connectionOptionalSqlUpdateProperties
                }
            },
            required: connectionRequiredProperties
        },
        group: {
            optional: {
                nonSql: groupOptionalProperties,
                sql: {
                    delete: groupOptionalSqlDeleteProperties,
                    insert: groupOptionalSqlInsertProperties,
                    select: groupOptionalSqlSelectProperties,
                    update: groupOptionalSqlUpdateProperties
                }
            },
            required: groupRequiredProperties
        },
        user: {
            optional: {
                nonSql: userOptionalProperties,
                sql: {
                    delete: userOptionalSqlDeleteProperties,
                    insert: userOptionalSqlInsertProperties,
                    select: userOptionalSqlSelectProperties,
                    update: userOptionalSqlUpdateProperties
                }
            },
            required: userRequiredProperties
        }
    };
};

/**
 * This validates and extracts the matched string with Regex.
 *
 * @returns validity status and the invalid string
 */
export const validateInputWithRegex = (input: string, regex: string): Map<string, string | boolean> => {
    const regExpInvalidSymbols: RegExp = new RegExp(regex);

    let isMatch: boolean = false;
    let invalidStringValue: string = null;

    if (regExpInvalidSymbols.test(input)) {
        isMatch = true;
        invalidStringValue = regExpInvalidSymbols.exec(input).toString();
    }

    const validityResultsMap: Map<string, string | boolean> = new Map<string, string | boolean>();

    validityResultsMap.set("isMatch", isMatch);
    validityResultsMap.set("invalidStringValue", invalidStringValue);

    return validityResultsMap;
};
