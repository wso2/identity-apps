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

import Button from "@oxygen-ui/react/Button";
import Grid from "@oxygen-ui/react/Grid";
import TextField from "@oxygen-ui/react/TextField";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { commonConfig as commonExtensionConfig } from "@wso2is/admin.extensions.v1";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import { ProfileConstants } from "@wso2is/core/constants";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    ClaimDataType,
    ExternalClaim,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    PatchOperationRequest,
    ProfileInfoInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ProfileUtils } from "@wso2is/core/utils";
import { FinalForm, FinalFormField, FormApi, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import transform from "lodash-es/transform";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import ProfileFormFieldRenderer from "./fields/form-field-renderer";
import { updateUserInfo } from "../../api/users";
import { AccountConfigSettingsInterface, PatchUserOperationValue } from "../../models/user";
import {
    getDisplayOrder,
    isMultipleEmailsAndMobileNumbersEnabledForUserStore
} from "../../utils/user-management-utils";

/**
 * Props interface for the user profile form component.
 */
interface UserProfileFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Profile data.
     */
    profileData: ProfileInfoInterface;
    /**
     * Calculated duplicate claims.
     */
    duplicateClaims: ExternalClaim[];
    /**
     * Whether the whole form is in read-only mode.
     */
    isReadOnlyMode: boolean;
    /**
     * Account config settings.
     * Contains whether the email/mobile number verification is enabled or not.
     */
    accountConfigSettings: AccountConfigSettingsInterface;
    /**
     * Whether the user is managed by a parent organization.
     */
    isUserManagedByParentOrg: boolean;
    /**
     * Callback to be fired when the user is updated.
     */
    onUserUpdated: (userId: string) => void;
}

/**
 * Schema names to be hidden.
 */
const HIDDEN_SCHEMA_NAMES: string[] = [
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACTIVE"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("GROUPS"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS")
];

/**
 * User profile form component.
 */
const UserProfileForm: FunctionComponent<UserProfileFormPropsInterface> = ({
    profileData,
    duplicateClaims,
    isReadOnlyMode,
    accountConfigSettings,
    isUserManagedByParentOrg,
    onUserUpdated,
    ["data-componentid"]: componentId = "user-profile-form"
}: UserProfileFormPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);
    const isMultipleEmailsAndMobileNumbersConfigEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.isMultipleEmailsAndMobileNumbersEnabled
    );
    const attributeDialectsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.attributeDialects
    );

    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);

    const isMobileVerificationEnabled: boolean = accountConfigSettings?.isMobileVerificationEnabled === "true";
    const isEmailVerificationEnabled: boolean = accountConfigSettings?.isEmailVerificationEnabled === "true";

    const isDistinctAttributeProfilesFeatureEnabled: boolean = isFeatureEnabled(
        attributeDialectsFeatureConfig,
        ClaimManagementConstants.DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG
    );

    const oneTimePassword: string = profileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.oneTimePassword;
    const createdDate: string = profileData?.meta?.created;
    const modifiedDate: string = profileData?.meta?.lastModified;

    /**
     * Flatten the profile schemas and sort them based on the display order.
     */
    const flattenedProfileSchema: ProfileSchemaInterface[] = useMemo(() => {
        const sortedSchemas: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas([ ...profileSchemas ]).sort(
            (a: ProfileSchemaInterface, b: ProfileSchemaInterface) => {
                return getDisplayOrder(a) - getDisplayOrder(b);
            }
        );

        return sortedSchemas;
    }, [ profileSchemas ]);

    const isMultipleEmailAndMobileNumberEnabled: boolean = useMemo(() => {
        if (!isMultipleEmailsAndMobileNumbersConfigEnabled) {
            return false;
        }

        const usernameParts: string[] = profileData?.userName?.toString()?.split("/") || [];
        const userStoreDomain: string = (usernameParts.length > 1
            ? usernameParts[0]
            : PRIMARY_USERSTORE
        )?.toUpperCase();

        return isMultipleEmailsAndMobileNumbersEnabledForUserStore(flattenedProfileSchema, userStoreDomain);
    }, [ flattenedProfileSchema, profileData?.userName ]);

    /**
     * Builds the initial form values based on flattened profile data.
     *
     * This function:
     * 1. Clones the incoming `flattenedProfileData` into `initialValues`.
     * 2. Processes the top-level “EMAILS” entry:
     *    - If multiple emails are enabled, copies the primary email to the emailAddresses field.
     *    - If email-verification is enabled and the primary email is verified, adds it to verifiedEmailAddresses.
     * 3. Processes the top-level “MOBILE_NUMBERS” entry:
     *    - If multiple mobile numbers are enabled, copies the primary mobile to the mobileNumbers field.
     *    - If mobile-verification is enabled and the primary mobile is verified, appends it to verifiedMobileNumbers.
     *
     * @returns A `Record<string, unknown>` containing the initial form values.
     */
    const prepareInitialValues = (): Record<string, unknown> => {
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
            if (key === emailsField && !isEmpty(value)) {
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
     * Memoizes and flattens the initial profile data to a flat object to be used in the form.
     * @example
     * ```ts
     * // Suppose:
     * prepareInitialValues() returns:
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
    const flattenedInitialValues: Record<string, unknown> = useMemo(() => {
        const preparedInitialValues: Record<string, unknown> = prepareInitialValues();
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
    }, [
        profileData,
        isMultipleEmailAndMobileNumberEnabled,
        isEmailVerificationEnabled,
        isMobileVerificationEnabled
    ]);

    const extractAttributeValue = (schema: ProfileSchemaInterface): unknown => {
        if (schema.extended) {
            return flattenedInitialValues[schema.schemaId]?.[schema.name];
        }

        return flattenedInitialValues[schema.name];
    };

    /**
     * Handles form submission. Submits only the dirty fields.
     *
     * @param values - Form values.
     * @param formObj - React Final Form API object.
     */
    const handleSubmit = (values: Record<string, unknown>, formObj: FormApi): void => {
        setIsUpdating(true);

        const data: PatchOperationRequest<PatchUserOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };
        const dirtyFields: Record<string, boolean> = formObj.getState().dirtyFields;

        /**
         * Expand the flat dirtyFields object to a nested dirtyFields object.
         * Ex: `{ "name.givenName": true } => { "name": { "givenName": true } }`
         *
         * @param flat - Flat object to expand.
         * @returns A nested object.
         */
        const unFlattenDirtyFields = (flat: Record<string, boolean>): Record<string, unknown> => {
            return transform(
                flat,
                (acc: Record<string, unknown>, isDirty: boolean, path: string) => {
                    // only include keys whose value is exactly true
                    if (isDirty === true) {
                        set(acc, path, true);
                    }
                },
                {} as Record<string, unknown>
            );
        };
        const dirtyFieldsUnFlattened: Record<string, unknown> = unFlattenDirtyFields(dirtyFields);

        for (const [ fieldName, dirtyTree ] of Object.entries(dirtyFieldsUnFlattened)) {
            if (fieldName === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS") ||
                fieldName === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")) {
                const patchValue: unknown[] = [];

                // For emails - Primary email is submitted as a string:
                //   [ "8Q5YH@example.com", { type: "work", value: "8Q5YH@example.com" }].
                // Phone numbers are submitted as an array of phone number objects:
                //   [ { type: "mobile", value: "1234567890" }, { type: "work", value: "1234567890" }].
                for (const [ type, value ] of Object.entries(
                    values[fieldName] as Record<string, string>)) {
                    if (type === "primary") {
                        patchValue.push(value);
                    } else {
                        patchValue.push({
                            type: type,
                            value: value
                        });
                    }
                }

                data.Operations.push({
                    op: "replace",
                    value: {
                        [fieldName]: patchValue
                    } as unknown as PatchUserOperationValue
                });
            } else if (fieldName === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ADDRESSES")) {
                const patchValue: unknown[] = [];

                // Addresses should be submitted as an array of address objects,
                // [{ type: "home", formatted: "123 Main St" }, { type: "work", formatted: "456 Business St" }].
                // "formatted" property is added from UI.
                for (const [ type, value ] of Object.entries(
                    values[fieldName] as Record<string, string>)) {
                    patchValue.push({
                        formatted: value,
                        type: type
                    });
                }

                data.Operations.push({
                    op: "replace",
                    value: {
                        [fieldName]: patchValue
                    } as unknown as PatchUserOperationValue
                });
            } else if (fieldName.startsWith(`${ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ADDRESSES")}#`)) {
                // Handles address schema names like
                // "addresses#home.streetAddress", "addresses#work.streetAddress", etc.
                // These need to be converted to "addresses": [ { type: "home", streetAddress: "123 Main St" } ]
                const fieldNameParts: string[] = fieldName.split("#");

                for (const [ key, value ] of Object.entries(dirtyTree as Record<string, boolean>)) {
                    if (value === true) {
                        const updatedValue: string = get(values, `${fieldName}.${key}`, "") as string;

                        data.Operations.push({
                            op: "add",
                            value: {
                                [fieldNameParts[0]]: [ {
                                    [key]: updatedValue,
                                    type: fieldNameParts[1]
                                } ]
                            } as unknown as PatchUserOperationValue
                        });
                    }
                }
            } else {
                const isExtendedSchema: boolean = (profileData.schemas as string[]).includes(fieldName);
                let decodedFieldName: string = fieldName;

                if (isExtendedSchema) {
                    // Replace back the __DOT__ with dots.
                    decodedFieldName = fieldName.replace(/__DOT__/g, ".");
                }

                /**
                 * Following logics map the values from the form with the dirty fields and
                 * build the patch operations.
                 */
                // If the dirtyTree is a boolean, it means the field is a leaf node.
                // Ex: { "locale": "en_US" }
                if (dirtyTree === true) {
                    data.Operations.push({
                        op: "replace",
                        value: {
                            [decodedFieldName]: values[fieldName] ?? ""
                        } as unknown as PatchUserOperationValue
                    });

                    continue;
                }
                // Convert the nested dirtyTree into a flat list of leaf-paths.
                // Ex: { "name": { "givenName": "John" }, "urn:scim:wso2:schema": { "country": "Argentina" } }
                const attributePaths: string[] = Object.entries(dirtyTree)
                    .flatMap(([ key, value ]: [string, unknown]) =>
                        value === true
                            ? [ key ]
                            : typeof value === "object"
                                ? Object.keys(value).map((sub: string) => `${key}.${sub}`)
                                : []
                    );

                // For each path, build and push a patch op:
                attributePaths.forEach((path: string) => {
                    // Build the fullPath ex: "urn:scim:wso2:schema.country".
                    const fullPath: string = `${decodedFieldName}.${path}`;
                    // Grab the value at that path from the form values.
                    const leafValue: unknown = get(values, fullPath, "");
                    // Build { fieldName: { …nested… } }, e.g. { urn:…: { country: "Argentina" } }
                    const opValue: Record<string, any> = {};

                    set(opValue, fullPath, leafValue);

                    data.Operations.push({
                        op: "replace",
                        value: opValue as unknown as PatchUserOperationValue
                    });
                });
            }
        }

        updateUserInfo(profileData.id, data)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "user:profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "user:profile.notifications.updateProfileInfo.success.message"
                    )
                }));

                onUserUpdated(profileData.id);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("user:profile.notifications.updateProfileInfo." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("user:profile.notifications.updateProfileInfo." +
                        "genericError.message")
                }));
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    const isAttributeDisplayable = (schema: ProfileSchemaInterface): boolean => {

        if (HIDDEN_SCHEMA_NAMES.includes(schema.name)) {
            return false;
        }

        if (schema.schemaUri === ProfileConstants.SCIM2_CORE_USER_SCHEMA_ATTRIBUTES.emails &&
            !commonExtensionConfig?.userEditSection?.showEmail) {
            return false;
        }

        if (
            (schema.schemaUri === ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA_ATTRIBUTES.emailAddresses ||
                schema.schemaUri === ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA_ATTRIBUTES.mobileNumbers) &&
            !isMultipleEmailAndMobileNumberEnabled
        ) {
            return false;
        }

        if (
            (schema.schemaUri === ProfileConstants.SCIM2_CORE_USER_SCHEMA_ATTRIBUTES.emails ||
                schema.schemaUri === ProfileConstants.SCIM2_CORE_USER_SCHEMA_ATTRIBUTES.mobile) &&
            isMultipleEmailAndMobileNumberEnabled
        ) {
            return false;
        }

        // If the distinct attribute profiles feature is enabled, check the supportedByDefault flag.
        if (
            isDistinctAttributeProfilesFeatureEnabled &&
            schema.name !== ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME")
        ) {
            // The global supportedByDefault value is a string. Hence, it needs to be converted to a boolean.
            let resolveSupportedByDefaultValue: boolean = schema.supportedByDefault?.toLowerCase() === "true";

            if (schema.profiles?.console?.supportedByDefault !== undefined) {
                resolveSupportedByDefaultValue = schema?.profiles?.console?.supportedByDefault;
            }

            // If the schema is not supported by default, the field should not be displayed.
            if (!resolveSupportedByDefaultValue) {
                return false;
            }
        }

        if (duplicateClaims && duplicateClaims.some((claim: ExternalClaim) => claim.claimURI === schema.schemaUri)) {
            return false;
        }

        const attributeValue: unknown = extractAttributeValue(schema);

        if (schema.type !== ClaimDataType.BOOLEAN && isEmpty(attributeValue)) {
            // If the profile UI is in read only mode, the empty field should not be displayed.
            if (isReadOnlyMode) {
                return false;
            }

            const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;

            // If the schema is read only, the empty field should not be displayed.
            if (resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA) {
                return false;
            }
        }

        return true;
    };

    return (
        <FinalForm
            onSubmit={ handleSubmit }
            render={ ({ handleSubmit, dirty }: FormRenderProps) => {
                return (
                    <form
                        id="user-profile-form"
                        onSubmit={ handleSubmit }
                        className="user-profile-form"
                        data-componentid={ `${componentId}-form` }
                        data-testid={ `${componentId}-form` }
                    >
                        <Grid container spacing={ 3 }>

                            { profileData.id && (
                                <Grid xs={ 12 }>
                                    <FinalFormField
                                        key="userID"
                                        component={ TextFieldAdapter }
                                        initialValue={ profileData?.id }
                                        label={ t("user:profile.fields.userId") }
                                        ariaLabel="userID"
                                        name="userID"
                                        type="text"
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        data-componentid={ `${componentId}-profile-form-userID` }
                                        readOnly
                                    />
                                </Grid>
                            ) }

                            { flattenedProfileSchema
                                .filter(isAttributeDisplayable)
                                .map((schema: ProfileSchemaInterface) => {
                                    return (
                                        <Grid key={ schema.schemaUri } xs={ 12 }>
                                            <ProfileFormFieldRenderer
                                                schema={ schema }
                                                flattenedProfileSchema={ flattenedProfileSchema }
                                                initialValues={ flattenedInitialValues }
                                                isEmailVerificationEnabled={ isEmailVerificationEnabled }
                                                isMobileVerificationEnabled={ isMobileVerificationEnabled }
                                                isUserManagedByParentOrg={ isUserManagedByParentOrg }
                                                isReadOnlyMode={ isReadOnlyMode }
                                                isUpdating={ isUpdating }
                                                setIsUpdating={ (isUpdating: boolean) => setIsUpdating(isUpdating) }
                                                onUserUpdated={ onUserUpdated }
                                                data-componentid={ `${componentId}-profile-form` }
                                            />
                                        </Grid>
                                    );
                                })
                            }

                            {
                                oneTimePassword && (
                                    <Grid xs={ 12 }>
                                        <TextField
                                            defaultValue={ oneTimePassword }
                                            label={ t("user:profile.fields.oneTimePassword") }
                                            name="oneTimePassword"
                                            type="text"
                                            InputProps={ {
                                                readOnly: true
                                            } }
                                            data-testid={ `${ componentId }-profile-form-one-time-pw-input` }
                                            data-componentid={ `${ componentId }-profile-form-one-time-pw-input` }
                                            margin="dense"
                                            fullWidth
                                        />
                                    </Grid>
                                )
                            }

                            {
                                createdDate && (
                                    <Grid xs={ 12 }>
                                        <TextField
                                            defaultValue={ createdDate ? moment(createdDate).format("YYYY-MM-DD") : "" }
                                            label={ t("user:profile.fields.createdDate") }
                                            name="createdDate"
                                            type="text"
                                            InputProps={ {
                                                readOnly: true
                                            } }
                                            data-componentid={ `${ componentId }-profile-form-created-date-input` }
                                            margin="dense"
                                            fullWidth
                                        />
                                    </Grid>
                                )
                            }

                            {
                                modifiedDate && (
                                    <Grid xs={ 12 }>
                                        <TextField
                                            defaultValue={ modifiedDate
                                                ? moment(modifiedDate).format("YYYY-MM-DD") : "" }
                                            label={ t("user:profile.fields.modifiedDate") }
                                            name="modifiedDate"
                                            type="text"
                                            InputProps={ {
                                                readOnly: true
                                            } }
                                            data-componentid={ `${ componentId }-profile-form-modified-date-input` }
                                            margin="dense"
                                            fullWidth
                                        />
                                    </Grid>
                                )
                            }

                            { !isReadOnlyMode && (
                                <Grid xs={ 12 }>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="small"
                                        className="form-button"
                                        loading={ isUpdating }
                                        disabled={ isUpdating || !dirty }
                                        data-componentid={ `${ componentId }-form-update-button` }
                                        data-testid={ `${ componentId }-form-update-button` }
                                    >
                                        { t("common:update") }
                                    </Button>
                                </Grid>
                            ) }
                        </Grid>
                    </form>
                );
            } }
        />
    );
};

export default UserProfileForm;
