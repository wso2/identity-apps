/**
 * Copyright (c) 2019-2026, WSO2 LLC. (https://www.wso2.com).
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

import { ProfileConstants } from "@wso2is/core/constants";
import isEmpty from "lodash-es/isEmpty";
import { commonConfig } from "../extensions";
import { SCIMConfigs } from "../extensions/configs/scim";
import {
    BasicProfileInterface,
    MultiValue,
    ProfileAttribute,
    ProfileCompletion,
    ProfileSchema,
    emptyProfileCompletion
} from "../models";
import { store } from "../store";
import { setProfileCompletion } from "../store/actions";

/**
 * This function extracts the sub attributes from the schemas and appends them to the main schema iterable.
 * The returned iterable will have all the schema attributes in a flat structure so that
 * you can just iterate through them to display them.
 *
 * @param schemas - Array of Profile schemas
 * @param parentSchemaName - Name of the parent attribute.
 * @returns - Flattened array of schemas.
 */
const flattenSchemas = (schemas: ProfileSchema[], parentSchemaName?: string): ProfileSchema[] => {
    const tempSchemas: ProfileSchema[] = [];

    schemas.forEach((schema: ProfileSchema) => {
        if (schema.subAttributes && schema.subAttributes.length > 0) {
            /**
             * If the schema has sub attributes, then this function will be recursively called.
             * The returned attributes are pushed into the `tempSchemas` array.
             */
            tempSchemas.push(...flattenSchemas(schema.subAttributes, schema.name));
            if (schema.multiValued && schema.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ROLES") &&
                schema.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS") &&
                schema.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("ADDRESSES")) {
                tempSchemas.push(schema);
            }
        } else {
            const tempSchema: ProfileSchema = { ...schema };

            if (parentSchemaName) {
                tempSchema.name = parentSchemaName + "." + schema.name;
            }

            tempSchemas.push(tempSchema);
        }
    });

    return tempSchemas;
};

/**
 * Type Guard to check if the passed in attribute is of type `MultiValue`.
 *
 * @param attribute - Profile attribute.
 * @returns - `True` if the attribute is of type `MultiValue`.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const isMultiValuedProfileAttribute = (attribute: any): attribute is MultiValue => {
    return attribute.type !== undefined;
};

/**
 * Modifies the profile info object in to a flat level.
 *
 * @param profileInfo - Profile information.
 * @param parentAttributeName - Name of the parent attribute.
 * @returns - Flattened profile info.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const flattenProfileInfo = (profileInfo: any, parentAttributeName?: string): any[] => {
    const tempProfile: Partial<BasicProfileInterface>[] = [];
    let mutatedProfileInfo: BasicProfileInterface = { ...profileInfo };

    if (profileInfo[ SCIMConfigs.scim.customEnterpriseSchema ]) {
        mutatedProfileInfo = { ...profileInfo, ...profileInfo[SCIMConfigs.scim.customEnterpriseSchema] };
        delete mutatedProfileInfo[SCIMConfigs.scim.customEnterpriseSchema];
    }

    for (let key in mutatedProfileInfo) {
        const value: any = mutatedProfileInfo[key];

        // Skip `associations`, `responseStatus` & `roles`.
        if (key === "associations" || key === "responseStatus" || value == undefined || key === "roles") {
            continue;
        }

        // If `parentAttributeName` param is available,
        // append it to the existing attribute key.
        if (parentAttributeName) {
            key = parentAttributeName + "." + key;
            if (parentAttributeName === ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")) {
                key = parentAttributeName;
            }
        }

        // Check if the value is an array and if it's a string array
        // join and save it as a string, if it's of type `MultiValue`
        // recursively call the function.
        if (Array.isArray(value)) {
            if (value.length && value.length > 0) {
                if (typeof value[0] === "string") {
                    tempProfile.push({
                        [key]: value.join(",")
                    });

                    continue;
                }
            }

            tempProfile.push(...flattenProfileInfo(value, key));

            continue;
        }

        // Check if the value is of type `MultiValue`.
        if (isMultiValuedProfileAttribute(value)) {
            // If `parentAttributeName` param is available,
            // append it to the existing multi valued attribute key.
            if (parentAttributeName) {
                key = parentAttributeName + "." + value.type;
            }

            tempProfile.push({
                [key]: value.value
            });

            continue;
        }

        // If the value is of type object, recursively call the function.
        if (typeof value === "object") {
            tempProfile.push(...flattenProfileInfo(value, key));

            continue;
        }

        tempProfile.push({
            [key]: value
        });
    }

    return tempProfile;
};

/**
 * Returns `True` if profile image exists.
 * Returns `False` if the profile image doesn't exist.
 * @param name - Name of the schema
 * @param profileInfo - ProfileInfo from the store
 * @returns Boolean
 */
const isProfileImageComplete = (name: string, profileInfo: BasicProfileInterface): boolean => {
    return !(isEmpty(profileInfo.profileUrl) && isEmpty(profileInfo.userImage));
};

/**
 * Calculates the profile completion.
 *
 * @param profileInfo - Profile information.
 * @param profileSchemas - Profile schemas.
 * @param isReadOnlyUser - Whether the user is read only.
 * @returns ProfileCompletion
 */
export const getProfileCompletion = (
    profileInfo: BasicProfileInterface,
    profileSchemas: ProfileSchema[],
    isReadOnlyUser: boolean
): ProfileCompletion => {
    const completion: ProfileCompletion = emptyProfileCompletion();
    const skippedAttributed: string[] = [];
    const hiddenAttributes: string[] = store.getState()?.config?.ui?.features?.personalInfo?.properties
        ?.hiddenAttributes;

    for (const schema of flattenSchemas([ ...profileSchemas ])) {
        // Skip `Roles` & 'Local Credential Exists'
        if (commonConfig.utils.isSchemaNameSkippableforProfileCompletion(schema)) {
            continue;
        }

        // Attributes hidden from the user profile cannot be filled by the user.
        if (isHiddenProfileAttribute(schema, hiddenAttributes)) {
            continue;
        }

        // Attribute to be stored as `completed` or `incomplete` attribute.
        const attribute: ProfileAttribute = {
            displayName: schema.name === "profileUrl" ? "Profile Image" : schema.displayName,
            name: schema.name
        };

        let isMapped: boolean = false;

        if (schema.required) {
            completion.required.totalCount++;
        } else {
            completion.optional.totalCount++;
        }

        for (const info of flattenProfileInfo(profileInfo)) {
            for (const [ key, value ] of Object.entries(info)) {
                if (schema.name === key) {
                    if (!value && (schema.mutability === ProfileConstants.READONLY_SCHEMA || isReadOnlyUser)) {
                        if (!skippedAttributed.includes(attribute.name)) {
                            if (schema.required) {
                                completion.required.totalCount--;
                            } else {
                                completion.optional.totalCount--;
                            }
                        }
                        skippedAttributed.push(attribute.name);

                        continue;
                    }
                    if (schema.required) {
                        if (
                            value ||
                            (schema.name === "profileUrl" && isProfileImageComplete(schema.name, profileInfo))
                        ) {
                            completion.required.completedCount++;
                            completion.required.completedAttributes.push(attribute);
                        } else {
                            completion.required.incompleteAttributes.push(attribute);
                        }
                    } else {
                        if (
                            value ||
                            (schema.name === "profileUrl" && isProfileImageComplete(schema.name, profileInfo))
                        ) {
                            completion.optional.completedCount++;
                            completion.optional.completedAttributes.push(attribute);
                        } else {
                            completion.optional.incompleteAttributes.push(attribute);
                        }
                    }

                    isMapped = true;
                }
            }
        }

        // If the schema couldn't be mapped, add it to in-completed list.
        if (!isMapped) {
            if (schema.mutability === ProfileConstants.READONLY_SCHEMA || isReadOnlyUser) {
                if (!skippedAttributed.includes(attribute.name)) {
                    if (schema.required) {
                        completion.required.totalCount--;
                    } else {
                        completion.optional.totalCount--;
                    }
                }
                skippedAttributed.push(attribute.name);

                continue;
            }
            if (schema.required) {
                if (schema.name !== "profileUrl" || !isProfileImageComplete(schema.name, profileInfo)) {
                    completion.required.incompleteAttributes.push(attribute);
                }
            } else {
                if (schema.name !== "profileUrl" || !isProfileImageComplete(schema.name, profileInfo)) {
                    completion.optional.incompleteAttributes.push(attribute);
                }
            }
        }
    }

    const totalCount: number = completion.required.totalCount + completion.optional.totalCount;
    const completedCount: number = completion.required.completedCount + completion.optional.completedCount;

    // Calculate the profile completion percentage. With no attribute to count, use 0 instead of NaN.
    completion.percentage = totalCount > 0
        ? Math.ceil(((completedCount / totalCount) * 100) / 10) * 10
        : 0;

    // Set the redux state.
    store.dispatch(setProfileCompletion(completion));

    return completion;
};

/**
 * Checks if the primary claim is verified.
 *
 * @param claimKey - Claim key to check.
 * @param profileInfo - Profile information.
 * @returns True if the primary claim is verified, false otherwise.
 */
export const isPrimaryClaimVerified = (claimKey: string, profileInfo: BasicProfileInterface): boolean => {
    const systemSchema: string | undefined = SCIMConfigs?.scim?.systemSchema;
    const claimValue: boolean | string = profileInfo?.[systemSchema]?.[claimKey];

    return claimValue === true || claimValue === "true";
};

interface AttributeUriPartsInterface {
    path: string;
    schemaId: string;
}

/**
 * Split a lower-cased attribute URI at its last `:` into the schema ID and the attribute path.
 */
const splitAttributeUri = (attributeUri: string): AttributeUriPartsInterface | undefined => {
    const normalizedUri: string = attributeUri.trim().toLowerCase();
    const separatorIndex: number = normalizedUri.lastIndexOf(":");

    if (separatorIndex <= 0 || separatorIndex === normalizedUri.length - 1) {
        return undefined;
    }

    return {
        path: normalizedUri.slice(separatorIndex + 1),
        schemaId: normalizedUri.slice(0, separatorIndex)
    };
};

/**
 * Checks whether a profile attribute is configured to be hidden from the user profile.
 *
 * The schema ID and the attribute path are matched separately and case-insensitively, as SCIM attribute names
 * are case-insensitive. Hiding a complex attribute also hides its sub-attributes.
 *
 * @param schema - Profile schema of the attribute. Sub-attributes are expected in the flattened form.
 * @param hiddenAttributes - Attribute URIs configured to be hidden.
 * @returns True if the attribute should be hidden, false otherwise.
 */
export const isHiddenProfileAttribute = (
    schema: Pick<ProfileSchema, "name" | "schemaId" | "schemaUri">,
    hiddenAttributes?: string[]
): boolean => {
    if (!Array.isArray(hiddenAttributes) || hiddenAttributes.length === 0) {
        return false;
    }

    // The schemas API sets `schemaUri` on every attribute. The schema ID and the name are used if it is missing.
    const attributeUri: string = schema?.schemaUri
        ?? (schema?.schemaId && schema?.name ? `${schema.schemaId}:${schema.name}` : "");
    const attribute: AttributeUriPartsInterface | undefined = splitAttributeUri(attributeUri);

    if (!attribute) {
        return false;
    }

    return hiddenAttributes.some((hiddenAttribute: string): boolean => {
        const hidden: AttributeUriPartsInterface | undefined = typeof hiddenAttribute === "string"
            ? splitAttributeUri(hiddenAttribute)
            : undefined;

        return !!hidden
            && hidden.schemaId === attribute.schemaId
            && (attribute.path === hidden.path || attribute.path.startsWith(`${hidden.path}.`));
    });
};
