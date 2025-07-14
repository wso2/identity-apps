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
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    SCIMConfigs as SCIMExtensionConfigs,
    commonConfig as commonExtensionConfig
} from "@wso2is/admin.extensions.v1";
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
import { FinalForm, FormRenderProps } from "@wso2is/form";
import { FinalFormField, FormApi, TextFieldAdapter } from "@wso2is/form/src";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import transform from "lodash-es/transform";
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

interface UserProfileFormPropsInterface extends IdentifiableComponentInterface {
    profileData: ProfileInfoInterface;
    duplicateClaims: ExternalClaim[];
    isReadOnlyMode: boolean;
    accountConfigSettings: AccountConfigSettingsInterface;
    isUserManagedByParentOrg: boolean;
    onUserUpdated: (userId: string) => void;
}

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
            const convertedSchemaId: string = schema.schemaId.replace(/\./g, "__DOT__");

            if (!schema.extended &&
                (schemaNameParts[0] === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS") ||
                schemaNameParts[0] === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS"))) {

                if (schemaNameParts.length === 1) {
                    if (schemaNameParts[0] === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")) {
                        const primaryEmail: string = (preparedInitialValues[schemaNameParts[0]] as unknown[])?.find(
                            (email: unknown): email is string => typeof email === "string");

                        _flattenedInitialValues[schemaNameParts[0]] = primaryEmail;
                    }
                } else {
                    _flattenedInitialValues[schema.name] = (preparedInitialValues[schemaNameParts[0]] as unknown[])
                        ?.find((value: unknown): value is { type: string; value: string } =>
                            (value as { type: string; value: string }).type === schemaNameParts[1])?.value;
                }
            } else if (!schema.extended &&
                schemaNameParts[0] === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ADDRESSES")) {

                _flattenedInitialValues[schema.name] = (preparedInitialValues[schemaNameParts[0]] as unknown[])?.find(
                    (value: unknown): value is { type: string; formatted: string } =>
                        (value as { type: string; formatted: string }).type === schemaNameParts[1])?.formatted;
            } else {
                if (schemaNameParts.length > 1) {
                    const schemaNameCanonicalParts: string[] = schemaNameParts[0].split("#");

                    if (schemaNameCanonicalParts.length > 1) {
                        let value: unknown = undefined;

                        if (!schema.extended) {
                            value = preparedInitialValues[schemaNameCanonicalParts[0]];
                        } else {
                            value = preparedInitialValues[convertedSchemaId]?.[schemaNameCanonicalParts[0]];
                        }

                        const flattenedValue: unknown = (value as unknown[]).find(
                            (value: unknown): value is { type: string; value: unknown } =>
                                (value as { type: string; value: unknown }).type === schemaNameCanonicalParts[1]
                        )?.value;

                        if (!schema.extended) {
                            _flattenedInitialValues[schema.name] = flattenedValue;
                        } else {
                            _flattenedInitialValues[convertedSchemaId][schema.name] = flattenedValue;
                        }
                    } else {
                        if (!schema.extended) {
                            _flattenedInitialValues[schema.name] = preparedInitialValues[
                                schemaNameParts[0]]?.[schemaNameParts[1]];
                        } else {
                            _flattenedInitialValues[convertedSchemaId][schema.name] = preparedInitialValues[
                                schema.schemaId]?.[schemaNameParts[0]]?.[schemaNameParts[1]];
                        }
                    }
                } else {
                    if (!schema.extended) {
                        _flattenedInitialValues[schema.name] = preparedInitialValues[schemaNameParts[0]];
                    } else {
                        _flattenedInitialValues[convertedSchemaId][schema.name] = preparedInitialValues[
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
        _flattenedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]["pendingEmails"] =
            preparedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]["pendingEmails"];
        _flattenedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]["pendingMobileNumber"] =
            preparedInitialValues[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]["pendingMobileNumber"];

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

    const handleSubmit = (values: Record<string, unknown>, formApi: FormApi): void => {
        setIsUpdating(true);

        const data: PatchOperationRequest<PatchUserOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };
        const dirtyFields: Record<string, boolean> = formApi.getState().dirtyFields;
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
            } else {
                const isExtendedSchema: boolean = (profileData.schemas as string[]).includes(fieldName);
                let revertedFieldName: string = fieldName;

                if (isExtendedSchema) {
                    // Replace back the __DOT_ with dots.
                    revertedFieldName = fieldName.replace(/__DOT__/g, ".");
                }

                // Convert the nested dirtyTree into a flat list of leaf-paths.
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
                    const fullPath: string = `${revertedFieldName}.${path}`;
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

        if (schema.schemaUri === SCIMExtensionConfigs.scimUserSchema.emails &&
            !commonExtensionConfig?.userEditSection?.showEmail) {
            return false;
        }

        if (
            (schema.schemaUri === SCIMExtensionConfigs.scimSystemSchema.emailAddresses ||
                schema.schemaUri === SCIMExtensionConfigs.scimSystemSchema.mobileNumbers) &&
            !isMultipleEmailAndMobileNumberEnabled
        ) {
            return false;
        }

        if (
            (schema.schemaUri === SCIMExtensionConfigs.scimUserSchema.emails ||
                schema.schemaUri === SCIMExtensionConfigs.scimUserSchema.phoneNumbersMobile) &&
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
                    <form id="user-profile-form" onSubmit={ handleSubmit } className="user-profile-form">
                        <Grid container spacing={ 3 }>

                            { profileData.id && (
                                <Grid xs={ 12 }>
                                    <FinalFormField
                                        key="userID"
                                        data-componentid={ `${ componentId }-userID` }
                                        component={ TextFieldAdapter }
                                        initialValue={ profileData?.id }
                                        label={ t("user:profile.fields.userId") }
                                        ariaLabel="userID"
                                        name="userID"
                                        type="text"
                                        maxLength={ 100 }
                                        minLength={ 0 }
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
                                                data-componentid={ componentId }
                                            />
                                        </Grid>
                                    );
                                })
                            }

                            { !isReadOnlyMode && (
                                <Grid xs={ 12 }>
                                    <Button
                                        data-componentid={ `${ componentId }-form-update-button` }
                                        variant="contained"
                                        type="submit"
                                        size="small"
                                        className="form-button"
                                        loading={ isUpdating }
                                        disabled={ isUpdating || !dirty }
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
