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
 *
 */

import { CryptoUtils } from "./crypto-utils";
import { ProfileConstants, UIConstants } from "../constants";
import { GravatarFallbackTypes, MultiValueAttributeInterface, ProfileSchemaInterface } from "../models";

/**
 * Utility class for profile related operations.
 */
export class ProfileUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Builds the Gravatar URL.
     *
     * @param {string} emailAddress - Gravatar qualified email address.
     * @param {number} size - Size of the image from 1 up to 2048.
     * @param {string} defaultImage - Custom default fallback image URL.
     * @param {GravatarFallbackTypes} fallback - Built in fallback strategy.
     * @param {boolean} forceDefault - Forcefully use the fallback image.
     * @see {@link https://en.gravatar.com/site/implement/images/}
     * @return {string} Gravatar Image URL.
     */
    public static buildGravatarURL(emailAddress: string,
                                   size?: number,
                                   defaultImage?: string,
                                   fallback: GravatarFallbackTypes = "404",
                                   forceDefault?: boolean): string {

        const URL: string = UIConstants.GRAVATAR_URL + "/avatar/" + CryptoUtils.MD5Hash(emailAddress);
        const params: string[] = [];

        if (size) {
            params.push("s=" + size);
        }

        if (defaultImage) {
            params.push("d=" + encodeURIComponent(defaultImage));
        } else if (fallback !== "default") {
            params.push("d=" + fallback);
        }

        if (forceDefault) {
            params.push("f=y");
        }

        return URL + "?" + params.join("&");
    }

    /**
     * This function extracts the sub attributes from the schemas and appends them to the main schema iterable.
     * The returned iterable will have all the schema attributes in a flat structure so that
     * you can just iterate through them to display them.
     *
     * @param {ProfileSchemaInterface[]} schemas - Array of Profile schemas
     * @param {string} parentSchemaName - Name of the parent attribute.
     * @return {ProfileSchemaInterface[]}
     */
    public static flattenSchemas(schemas: ProfileSchemaInterface[],
                                 parentSchemaName?: string): ProfileSchemaInterface[] {

        const tempSchemas: ProfileSchemaInterface[] = [];

        schemas.forEach((schema: ProfileSchemaInterface) => {
            if (schema.subAttributes && schema.subAttributes.length > 0) {

                // Add the email schema.
                if (schema.multiValued && schema.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ROLES") &&
                    schema.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS") &&
                    schema.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ADDRESSES") &&
                    schema.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("IMS") &&
                    schema.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PHOTOS")) {
                    tempSchemas.push(schema);
                }

                /**
                 * If the schema has sub attributes, then this function will be recursively called.
                 * The returned attributes are pushed into the `tempSchemas` array.
                 */
                tempSchemas.push(...ProfileUtils.flattenSchemas(schema.subAttributes, schema.name));
            } else {
                const tempSchema = { ...schema };

                if (parentSchemaName) {
                    tempSchema.name = parentSchemaName + "." + schema.name;
                }

                tempSchemas.push(tempSchema);
            }
        });

        return tempSchemas;
    }

    /**
     * This function checks if the passed schema  is of type `MultiValue`.
     *
     * @param {ProfileSchemaInterface[]} schemas - Array of schemas
     * @param {string} schemaName - Name of the parent schema.
     *
     * @return {boolean} attribute is MultiValue
     */
    public static isMultiValuedSchemaAttribute = (schemas: ProfileSchemaInterface[], schemaName?: string): boolean => {
        const parentSchema = schemas?.find((schema) => schema?.name === schemaName);

        return parentSchema?.multiValued;
    };

    /**
     * Type Guard to check if the passed in attribute is of type `String Array`.
     *
     * @param attribute - Profile attribute.
     * @return {attribute is string[]}
     */
     public static isStringArray = (attribute: string[] | MultiValueAttributeInterface[]): attribute is string[] => {
        return attribute?.length !== undefined;
    };

    /**
     * Checks whether a given schema name falls in to a possible
     * BOOLEAN attribute. Note that not all attributes are present
     * we can add them as we go.
     *
     * @param attributeName {string}
     * @return whether this is a boolean attribute or not
     */
     public static isPossibleBooleanAttribute = (attributeName: string): boolean => {
         return new Set([
             "active"
         ]).has(attributeName);
     }

}
