/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { BasicProfileInterface, emptyProfileCompletion, MultiValue, ProfileCompletion, ProfileSchema } from "../models";
import { store } from "../store";
import { setProfileCompletion } from "../store/actions";

/**
 * Calculates the profile completion.
 *
 * @param {BasicProfileInterface} profileInfo - Profile information.
 * @param {ProfileSchema[]} profileSchemas - Profile schemas.
 * @return {ProfileCompletion}
 */
export const getProfileCompletion = (
    profileInfo: BasicProfileInterface, profileSchemas: ProfileSchema[]): ProfileCompletion => {

    const completion: ProfileCompletion = emptyProfileCompletion();

    for (const schema of flattenSchemas(profileSchemas)) {
        // Skip `Roles`
        if (schema.displayName === "Role") {
            continue;
        }

        let isMapped: boolean = false;

        if (schema.required) {
            completion.required.totalCount++;
        } else {
            completion.optional.totalCount++;
        }

        for (const info of flattenProfileInfo(profileInfo)) {
            for (const [ key, value ] of Object.entries(info)) {
                if (schema.name === key) {
                    if (schema.required) {
                        if (value) {
                            completion.required.completedCount++;
                            completion.required.completedAttributes.push(key);
                        } else {
                            completion.required.incompleteAttributes.push(key);
                        }
                    } else {
                        if (value) {
                            completion.optional.completedCount++;
                            completion.optional.completedAttributes.push(key);
                        } else {
                            completion.optional.incompleteAttributes.push(key);
                        }
                    }

                    isMapped = true;
                }
            }
        }

        // If the schema couldn't be mapped, add it to in-completed list.
        if (!isMapped) {
            if (schema.required) {
                completion.required.incompleteAttributes.push(schema.name);
            } else {
                completion.optional.incompleteAttributes.push(schema.name);
            }
        }
    }

    // Calculate the profile completion percentage.
    completion.percentage = Math.ceil(((completion.required.completedCount + completion.optional.completedCount)
        / (completion.required.totalCount + completion.optional.totalCount)) * 100 / 10) * 10;

    // Set the redux state.
    store.dispatch(setProfileCompletion(completion));

    return completion;
};

/**
 * This function extracts the sub attributes from the schemas and appends them to the main schema iterable.
 * The returned iterable will have all the schema attributes in a flat structure so that
 * you can just iterate through them to display them.
 *
 * @param schemas - Array of Profile schemas
 */
export const flattenSchemas = (schemas: ProfileSchema[]): ProfileSchema[] => {

    const tempSchemas: ProfileSchema[] = [];

    schemas.forEach((schema: ProfileSchema) => {
        if (schema.subAttributes && schema.subAttributes.length > 0) {
            /**
             * If the schema has sub attributes, then this function will be recursively called.
             * The returned attributes are pushed into the `tempSchemas` array.
             */
            tempSchemas.push(...flattenSchemas(schema.subAttributes));
        } else {
            tempSchemas.push(schema);
        }
    });

    return tempSchemas;
};

/**
 * Modifies the profile info object in to a flat level.
 *
 * @param profileInfo - Profile information.
 * @return {any[]}
 */
export const flattenProfileInfo = (profileInfo: any) => {

    const tempProfile = [];

    for (const [ key, value ] of Object.entries(profileInfo)) {
        // Skip `associations`, `responseStatus` & `roles`.
        if (key === "associations" || key === "responseStatus") {
            continue;
        }

        // Check if the value is an array and if it's a string array
        // join and save it as a string, if it's of type `MultiValue`
        // recursively call the function.
        if (Array.isArray(value)) {
            if (value.length && value.length > 0) {
                if (typeof value[ 0 ] === "string") {
                    tempProfile.push({
                        [ key ]: value.join(",")
                    });

                    continue;
                }
            }

            tempProfile.push(...flattenProfileInfo(value));

            continue;
        }

        // Check if the value is of type `MultiValue`.
        if (isMultiValuedProfileAttribute(value)) {
            tempProfile.push({
                [ value.type ]: value.value
            });

            continue;
        }

        // If the value is of type object, recursively call the function.
        if (typeof value === "object") {
            tempProfile.push(...flattenProfileInfo(value));

            continue;
        }

        tempProfile.push({
            [ key ]: value
        });
    }

    return tempProfile;
};

/**
 * Typeguard to check if the passed in attribute is of type `MultiValue`.
 *
 * @param attribute - Profile attribute.
 * @return {attribute is MultiValue}
 */
export const isMultiValuedProfileAttribute = (attribute: any): attribute is MultiValue => {
    return attribute.type !== undefined;
};
