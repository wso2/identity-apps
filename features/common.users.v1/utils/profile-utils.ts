/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { ProfileInfoInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";

/**
 * Builds and returns the initial values object for a user profile form from a SCIM2 profile payload.
 *
 * Behavior:
 * - Deep-clones the incoming profileData into an isolated initial values map.
 * - Ensures the SCIM2 system schema container exists within the result.
 * - EMAILS handling:
 *   - If multiple emails are enabled and the system emailAddresses array is empty,
 *     seeds it with the primary email (first string in the top-level EMAILS array).
 *   - If email verification is enabled and the primary email is already marked verified
 *     (system[emailVerified] === true), adds it to system[verifiedEmailAddresses] without duplication.
 * - PHONE_NUMBERS handling:
 *   - If multiple mobile numbers are enabled and the system mobileNumbers array is empty,
 *     seeds it with the primary mobile (the value where type === "mobile" in PHONE_NUMBERS).
 *   - If mobile verification is enabled and the primary mobile is already marked verified
 *     (system[phoneVerified] === true), adds it to system[verifiedMobileNumbers] without duplication.
 *
 * The "primary" email is determined as the first string entry in the top-level EMAILS array. The "primary"
 * mobile number is determined from the PHONE_NUMBERS entry whose type is "mobile".
 *
 * @param profileData - The flattened SCIM2 user profile payload to derive initial form values from.
 * @param isMultipleEmailAndMobileNumberEnabled - Whether multiple email and mobile number fields are enabled.
 * @param isEmailVerificationEnabled - Whether email verification features are enabled.
 * @param isMobileVerificationEnabled - Whether mobile verification features are enabled.
 * @returns A deep-cloned, augmented record of initial form values suitable for initializing a profile form.
 */
const prepareInitialValues = (
    profileData: ProfileInfoInterface,
    isMultipleEmailAndMobileNumberEnabled: boolean,
    isEmailVerificationEnabled: boolean,
    isMobileVerificationEnabled: boolean
): Record<string, unknown> => {
    const initialValues: Record<string, unknown> = cloneDeep(profileData as Record<string, unknown>);

    const systemSchema: string = ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA;

    if (!(systemSchema in initialValues)) {
        initialValues[systemSchema] = {};
    }

    const emailsField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS");
    const emailAddressesField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES");
    const verifiedEmailAddressesField: string = ProfileConstants
        .SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES");
    const primaryEmailVerifiedField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_VERIFIED");
    const phoneNumbersField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS");
    const mobileNumbersField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS");
    const verifiedMobileNumbersField: string = ProfileConstants
        .SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS");
    const primaryMobileNumberVerifiedField: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_VERIFIED");

    for (const [ key, value ] of Object.entries(profileData as Record<string, unknown>)) {
        if (key === emailsField) {
            // There is a possibility that the emails field is an empty string rather than an empty array.
            // Handle that situation by initializing it as an empty array.
            if (isEmpty(value)) {
                initialValues[emailsField] = [];

                continue;
            }

            const rawEmailAddresses: unknown = (
                    initialValues[systemSchema] as Record<string, unknown>
            )?.[emailAddressesField];
            const emailAddresses: string[] = Array.isArray(rawEmailAddresses)
                ? (rawEmailAddresses as string[])
                : [];

            const emails: unknown[] = Array.isArray(value) ? (value as unknown[]) : [];
            const primaryEmail: string = emails.find(
                (email: unknown): email is string => typeof email === "string");

            if (isMultipleEmailAndMobileNumberEnabled && isEmpty(emailAddresses)) {
                if (primaryEmail) {
                    (
                        initialValues[systemSchema] as Record<string, unknown>
                    )[emailAddressesField] = [ primaryEmail ];
                }
            }

            if (isMultipleEmailAndMobileNumberEnabled && isEmailVerificationEnabled) {
                const isPrimaryEmailVerified: boolean = initialValues[systemSchema]?.[primaryEmailVerifiedField];

                if (isPrimaryEmailVerified) {
                    const rawVerifiedEmailAddresses: unknown = (
                        initialValues[systemSchema] as Record<string, unknown>
                    )?.[verifiedEmailAddressesField];
                    const verifiedEmailAddresses: string[] = Array.isArray(rawVerifiedEmailAddresses)
                        ? (rawVerifiedEmailAddresses as string[])
                        : [];

                    if (!verifiedEmailAddresses.includes(primaryEmail)) {
                        (initialValues[systemSchema] as Record<string, unknown>)[verifiedEmailAddressesField] = [
                            ...verifiedEmailAddresses, primaryEmail
                        ];
                    }
                }
            }
        } else if (key === phoneNumbersField && !isEmpty(value)) {
            const rawMobileNumbers: unknown = (
                initialValues[systemSchema] as Record<string, unknown>
            )?.[mobileNumbersField];
            const mobileNumbers: string[] = Array.isArray(rawMobileNumbers)
                ? (rawMobileNumbers as string[])
                : [];

            const phoneNumbers: unknown[] = Array.isArray(value) ? (value as unknown[]) : [];
            const primaryMobile: string = phoneNumbers.find(
                (phone: unknown): phone is { type: string; value: string } =>
                    (phone as { type: string; value: string }).type === "mobile"
            )?.value;

            if (isMultipleEmailAndMobileNumberEnabled && isEmpty(mobileNumbers)) {
                if (primaryMobile) {
                    (
                        initialValues[systemSchema] as Record<string, unknown>
                    )[mobileNumbersField] = [ primaryMobile ];
                }
            }

            if (isMultipleEmailAndMobileNumberEnabled && isMobileVerificationEnabled) {
                const isPrimaryMobileVerified: boolean = initialValues[systemSchema]
                    ?.[primaryMobileNumberVerifiedField];

                if (isPrimaryMobileVerified) {
                    const rawVerifiedMobileNumbers: unknown = (
                        initialValues[systemSchema] as Record<string, unknown>
                    )?.[verifiedMobileNumbersField];
                    const verifiedMobileNumbers: string[] = Array.isArray(rawVerifiedMobileNumbers)
                        ? (rawVerifiedMobileNumbers as string[])
                        : [];

                    if (!verifiedMobileNumbers.includes(primaryMobile)) {
                        (initialValues[systemSchema] as Record<string, unknown>)[verifiedMobileNumbersField] = [
                            ...verifiedMobileNumbers, primaryMobile
                        ];
                    }
                }
            }
        }
    }

    return initialValues;
};

/**
 * Flattens the initial profile data to a flat object to be used in the form.
 *
 * @param profileData - The initial profile data to flatten.
 * @param flattenedProfileSchema - The schema to use for flattening the profile data.
 * @param isMultipleEmailAndMobileNumberEnabled - Whether multiple email and mobile number support is enabled.
 * @param isEmailVerificationEnabled - Whether email verification is enabled.
 * @param isMobileVerificationEnabled - Whether mobile verification is enabled.
 * @returns The flattened initial values.
 *
 * @example
 * ```ts
 * // Suppose:
 * // `profileData` is:
 * {
 *   id: "abcd-1234",
 *   userName: "jdoe",
 *   emails: ["jdoe@example.com", { type: "work", value: "jdoe.work@example" }],
 *   phoneNumbers: [{ type: "mobile", value: "+9876543210" }, { type: "work", value: "+9876543210" }],
 *   addresses: [
 *     { type: "home", formatted: "123 Main St" },
 *     { type: "work", formatted: "456 Elm Rd" }
 *   ],
 *   "urn:enterprise:User": { department: "Engineering" },
 *   "urn:system:User": {
 *     "country": "Sri Lanka",
 *     "complex": { "nested": "value" }
 *   }
 * }
 *
 * // Then `flattenedProfileSchema` will be:
 * {
 *   id: "abcd-1234",
 *   userName: "jdoe",
 *   emails: "jdoe@example.com",
 *   "emails.work": "jdoe.work@example",
 *   "phoneNumbers.mobile": "+9876543210",
 *   "phoneNumbers.work": "+9876543210",
 *   "urn:enterprise:User": { department: "Engineering" },
 *   "urn:system:User": {
 *     "country": "Sri Lanka",
 *     "complex.nested": "value"
 *   }
 * }
 * ```
 */
export const getFlattenedInitialValues = (
    profileData: ProfileInfoInterface,
    flattenedProfileSchema: ProfileSchemaInterface[],
    isMultipleEmailAndMobileNumberEnabled: boolean,
    isEmailVerificationEnabled: boolean,
    isMobileVerificationEnabled: boolean
): Record<string, unknown> => {
    const preparedInitialValues: Record<string, unknown> = prepareInitialValues(
        profileData, isMultipleEmailAndMobileNumberEnabled, isEmailVerificationEnabled, isMobileVerificationEnabled);
    const _flattenedInitialValues: Record<string, unknown> = {};

    _flattenedInitialValues["id"] = preparedInitialValues.id;

    for (const schemaId of profileData.schemas) {
        if (schemaId === ProfileConstants.SCIM2_CORE_USER_SCHEMA) {
            continue;
        }
        // Replace dots with __DOT__ to avoid issues with dot separated field names.
        _flattenedInitialValues[schemaId.toString().replace(/\./g, "__DOT__")] = {};
    }

    for (const schema of flattenedProfileSchema) {
        const schemaNameParts: string[] = schema.name.split(".");
        // Replace dots with __DOT__ to avoid issues with dot separated field names.
        const encodedSchemaId: string = schema.schemaId.replace(/\./g, "__DOT__");

        if (!schema.extended &&
            (schemaNameParts[0] === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS") ||
            schemaNameParts[0] === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS"))) {

            if (schemaNameParts.length === 1) {
                if (schemaNameParts[0] === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")) {
                    /**
                     * Extracts the primary email address from the emails array.
                     *
                     * @example
                     * ```
                     * Suppose: Profile data:
                     * {
                     *   ...
                     *   "emails": [
                     *     "jdoe@example.com",
                     *     { "type": "work", "value": "jdoe.work@example" }
                     *   ],
                     *   ...
                     * }
                     *
                     * Then: _flattenedInitialValues:
                     * {
                     *   ...
                     *   "emails": "jdoe@example.com",
                     *   "emails.work": "jdoe.work@example",
                     *   ...
                     * }
                     * ```
                     */
                    const primaryEmail: string = (preparedInitialValues[schemaNameParts[0]] as unknown[])?.find(
                        (email: unknown): email is string => typeof email === "string");

                    _flattenedInitialValues[schemaNameParts[0]] = primaryEmail;
                }
            } else {
                /**
                 * Handles the cases like: "emails.work", "phoneNumbers.mobile", "phoneNumbers.work", etc.
                 *
                 * @example
                 * ```
                 * Suppose: Profile data:
                 * {
                 *   ...
                 *   "phoneNumbers": [
                 *     { "type": "mobile", "value": "+9876543210" },
                 *     { "type": "work", "value": "+9876543210" }
                 *   ]
                 *   "emails": [
                 *     "jdoe@example.com",
                 *     { "type": "work", "value": "jdoe.work@example" }
                 *   ],
                 *   ...
                 * }
                 *
                 * Then: _flattenedInitialValues:
                 * {
                 *   ...
                 *   "emails.work": "jdoe.work@example",
                 *   "phoneNumbers.mobile": "+9876543210",
                 *   "phoneNumbers.work": "+9876543210",
                 *   ...
                 * }
                 * ```
                 */
                _flattenedInitialValues[schema.name] = (preparedInitialValues[schemaNameParts[0]] as unknown[])
                    ?.find((value: unknown): value is { type: string; value: string } =>
                        (value as { type: string; value: string }).type === schemaNameParts[1])?.value;
            }
        } else if (!schema.extended &&
            schemaNameParts[0] === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ADDRESSES")) {

            /**
             * Handles the cases like: "addresses.home", "addresses.work", etc.
             *
             * @example
             * ```
             * Suppose: Profile data:
             * {
             *   ...
             *   "addresses": [
             *     { "type": "home", "formatted": "123 Main St" },
             *     { "type": "work", "formatted": "456 Elm Rd" }
             *   ]
             *   ...
             * }
             *
             * Then: _flattenedInitialValues:
             * {
             *   ...
             *   "addresses.home": "123 Main St",
             *   "addresses.work": "456 Elm Rd",
             *   ...
             * }
             * ```
             */
            _flattenedInitialValues[schema.name] = (preparedInitialValues[schemaNameParts[0]] as unknown[])?.find(
                (value: unknown): value is { type: string; formatted: string } =>
                    (value as { type: string; formatted: string }).type === schemaNameParts[1])?.formatted;
        } else if (!schema.extended &&
            schemaNameParts[0].startsWith(`${ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ADDRESSES")}#`)) {

            /**
             * Handles the cases like: "addresses#home.street", "addresses#home.city", etc.
             *
             * @example
             * ```
             * Suppose: Profile data:
             * {
             *   ...
             *   "addresses": [
             *     { "type": "home", "street": "123 Main St", "city": "Colombo" }
             *   ]
             *   ...
             * }
             *
             * Then: _flattenedInitialValues:
             * {
             *   ...
             *   "addresses#home.street": "123 Main St",
             *   "addresses#home.city": "Colombo",
             *   ...
             * }
             * ```
             */
            const typeParts: string[] = schemaNameParts[0].split("#");
            const subName: string = schemaNameParts[1];

            _flattenedInitialValues[schema.name] = (preparedInitialValues[typeParts[0]] as unknown[])?.find(
                (value: unknown): value is { type: string; [key: string]: string } =>
                    (value as { type: string; [key: string]: string }).type === typeParts[1])?.[subName];
        } else {
            if (schemaNameParts.length > 1) {
                const schemaNameCanonicalParts: string[] = schemaNameParts[0].split("#");

                if (schemaNameCanonicalParts.length > 1) {
                    let value: unknown = undefined;

                    if (!schema.extended) {
                        value = preparedInitialValues[schemaNameCanonicalParts[0]];
                    } else {
                        value = preparedInitialValues[encodedSchemaId]?.[schemaNameCanonicalParts[0]];
                    }

                    const flattenedValue: unknown = (value as unknown[]).find(
                        (value: unknown): value is { type: string; value: unknown } =>
                            (value as { type: string; value: unknown }).type === schemaNameCanonicalParts[1]
                    )?.value;

                    if (!schema.extended) {
                        _flattenedInitialValues[schema.name] = flattenedValue;
                    } else {
                        _flattenedInitialValues[encodedSchemaId][schema.name] = flattenedValue;
                    }
                } else {
                    if (!schema.extended) {
                        _flattenedInitialValues[schema.name] = preparedInitialValues[
                            schemaNameParts[0]]?.[schemaNameParts[1]];
                    } else {
                        _flattenedInitialValues[encodedSchemaId][schema.name] = preparedInitialValues[
                            schema.schemaId]?.[schemaNameParts[0]]?.[schemaNameParts[1]];
                    }
                }
            } else {
                if (!schema.extended) {
                    _flattenedInitialValues[schema.name] = preparedInitialValues[schemaNameParts[0]];
                } else {
                    /**
                     * Handles extended schemas.
                     * @example
                     * ```
                     * Suppose: Profile data:
                     * {
                     *   ...
                     *   "urn:scim:wso2:schema": {
                     *     "country": "Sri Lanka",
                     *     "complex": {
                     *       "attribute1": "val1",
                     *       "attribute2": "val2"
                     *     }
                     *   }
                     *   ...
                     * }
                     *
                     * Then: _flattenedInitialValues:
                     * {
                     *   ...
                     *   "urn:scim:wso2:schema": {
                     *     "country": "Sri Lanka",
                     *     "complex.attribute1": "val1",
                     *     "complex.attribute2": "val2"
                     *   }
                     *   ...
                     * }
                     * ```
                     */
                    _flattenedInitialValues[encodedSchemaId][schema.name] = preparedInitialValues[
                        schema.schemaId]?.[schemaNameParts[0]];
                }
            }
        }
    }

    _flattenedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_VERIFIED")
    ] =
        preparedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][
            ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_VERIFIED")
        ];
    _flattenedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_VERIFIED")
    ] =
        preparedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][
            ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_VERIFIED")
        ];

    const pendingEmailsAttribute: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PENDING_EMAILS");

    _flattenedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][pendingEmailsAttribute] =
        preparedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][pendingEmailsAttribute];

    const pendingMobileAttribute: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PENDING_MOBILE");

    _flattenedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][pendingMobileAttribute] =
        preparedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][pendingMobileAttribute];

    return _flattenedInitialValues;
};

/**
 * Extract the attribute value from the flattened profile data.
 * @param flattenedProfileData - The flattened profile data.
 * @param schema - The profile schema.
 * @returns The attribute value or undefined.
 */
export const extractAttributeValue = (
    flattenedProfileData: Record<string, unknown>,
    schema: ProfileSchemaInterface
): unknown => {
    if (schema.extended) {
        const encodedSchemaId: string = schema.schemaId.replace(/\./g, "__DOT__");

        return flattenedProfileData[encodedSchemaId]?.[schema.name];
    }

    return flattenedProfileData[schema.name];
};
