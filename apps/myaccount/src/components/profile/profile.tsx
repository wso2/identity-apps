/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import { extractAttributeValue, getFlattenedInitialValues } from "@wso2is/common.users.v1/utils/profile-utils";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { getUserNameWithoutDomain, hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    ClaimDataType,
    PatchOperationRequest,
    ProfileInfoInterface,
    ProfileSchemaInterface,
    SBACInterface,
    TestableComponentInterface,
    HttpErrorResponseDataInterface
} from "@wso2is/core/models";
import { ProfileUtils } from "@wso2is/core/utils";
import { Message } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { Dispatch, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Container, List, Placeholder } from "semantic-ui-react";
import ProfileFieldFormRenderer from "./fields/field-form-renderer";
import ProfileAvatar from "./profile-avatar";
import { updateProfileInfo } from "../../api/profile";
import { useGetPreference } from "../../api/use-get-preference";
import { fetchPasswordValidationConfig, getUsernameConfiguration } from "../../api/validation";
import { AppConstants, CommonConstants, ProfileConstants as MyAccountProfileConstants } from "../../constants";
import {
    AlertInterface,
    AuthStateInterface,
    FeatureConfigInterface,
    PreferenceProperty,
    ProfilePatchOperationValue,
    ProfileSchema,
    UIConfigInterface,
    ValidationFormInterface
} from "../../models";
import { AppState } from "../../store";
import { setActiveForm } from "../../store/actions";
import { getProfileInformation } from "../../store/actions/authenticate";
import { SettingsSection } from "../shared";
import "./profile.scss";

const USERNAME_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME");
const EMAIL_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS");
const MOBILE_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE");
const EMAIL_ADDRESSES_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES");
const MOBILE_NUMBERS_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS");
const VERIFIED_MOBILE_NUMBERS_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
    "VERIFIED_MOBILE_NUMBERS"
);
const VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get(
    "VERIFIED_EMAIL_ADDRESSES"
);

const HIDDEN_ATTRIBUTES: string[] = [
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACTIVE"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("GROUPS"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USER_SOURCE_ID"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("IDP_TYPE"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("LOCAL_CREDENTIAL_EXISTS"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("RESROUCE_TYPE"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EXTERNAL_ID"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("META_DATA"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("META_VERSION"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("META_LOCATION"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("META_CREATED"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("META_LAST_MODIFIED"),
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("META_RESOURCE_TYPE")
];

/**
 * Prop types for the basic details component.
 * Also see {@link Profile.defaultProps}
 */
interface ProfileProps extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    isNonLocalCredentialUser?: boolean;
}

/**
 * Basic details component.
 *
 * @param props - Props injected to the basic details component.
 * @returns Profile component.
 */
export const Profile: FunctionComponent<ProfileProps> = (props: ProfileProps): ReactElement => {
    const { isNonLocalCredentialUser, onAlertFired, featureConfig, ["data-testid"]: testId = "profile" } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();

    const profileDetails: AuthStateInterface = useSelector((state: AppState) => state.authenticationInformation);
    const isSCIMEnabled: boolean = useSelector((state: AppState) => state.profile.isSCIMEnabled);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isReadOnlyUser: boolean =
        useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly) === "true";
    const hasLocalAccount: boolean = useSelector((state: AppState) => state.authenticationInformation.hasLocalAccount);
    const isProfileInfoLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileInfoLoading);
    const isProfileSchemaLoading: boolean = useSelector((state: AppState) => state.loaders.isProfileSchemaLoading);
    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);

    const uiConfig: UIConfigInterface = useSelector((state: AppState) => state.config?.ui);
    const isMultipleEmailsAndMobileConfigEnabled: boolean = uiConfig?.isMultipleEmailsAndMobileNumbersEnabled;
    const isProfileUsernameReadonly: boolean = uiConfig?.isProfileUsernameReadonly;

    const [ isProfileUpdating, setIsProfileUpdating ] = useState<boolean>(false);
    // const [ isPreferencesLoading, setIsPreferencesLoading ] = useState<boolean>(true);
    // const [ isMobileVerificationEnabled, setIsMobileVerificationEnabled ] = useState<boolean>(false);
    // const [ isEmailVerificationEnabled, setIsEmailVerificationEnabled ] = useState<boolean>(false);
    const [ isValidationConfigsLoading, setIsValidationConfigsLoading ] = useState<boolean>(true);
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>();

    const hasPersonalInfoUpdatePermissions: boolean = useMemo(() => {
        return hasRequiredScopes(
            featureConfig?.personalInfo,
            featureConfig?.personalInfo?.scopes?.update,
            allowedScopes
        );
    }, [ featureConfig, allowedScopes ]);

    const isProfileReadOnly: boolean = isReadOnlyUser || !hasPersonalInfoUpdatePermissions;

    const isDistinctAttributeProfilesFeatureEnabled: boolean = isFeatureEnabled(
        featureConfig?.personalInfo,
        MyAccountProfileConstants.DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG
    );
    const isMobileVerificationFeatureEnabled: boolean = isFeatureEnabled(
        featureConfig?.personalInfo,
        AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_MOBILE_VERIFICATION")
    );

    // Fetch recovery preferences.
    const {
        data: preferenceData,
        isLoading: isPreferencesLoading,
        isValidating: isPreferencesValidating,
        error: preferenceFetchError
    } = useGetPreference([
        {
            "connector-name": ProfileConstants.USER_CLAIM_UPDATE_CONNECTOR,
            properties: [
                ProfileConstants.ENABLE_EMAIL_VERIFICATION,
                ProfileConstants.ENABLE_MOBILE_VERIFICATION,
                ProfileConstants.ENABLE_EMAIL_VERIFICATION_WITH_OTP
            ]
        }
    ]);

    // Show error if fetching preferences failed.
    useEffect(() => {
        if (preferenceFetchError) {
            onAlertFired({
                description: t(
                    "myAccount:sections.verificationOnUpdate.preference.notifications.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "myAccount:sections.verificationOnUpdate.preference.notifications.genericError.message"
                )
            });
        }
    }, [ preferenceFetchError ]);

    const isLoading: boolean = isProfileInfoLoading ||
        isProfileSchemaLoading || isPreferencesLoading || isPreferencesValidating || isValidationConfigsLoading;

    /**
     * Sort the elements of the profileSchema state according to the displayOrder attribute in the ascending order.
     */
    const flattenedProfileSchema: ProfileSchemaInterface[] = useMemo(() => {
        const getDisplayOrder = (schema: ProfileSchema): number => {
            if (schema.name === USERNAME_ATTRIBUTE) {
                return 0;
            }

            if (!schema.displayOrder || schema.displayOrder == "0") {
                if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
                    return 6;
                }

                if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
                    return 7;
                }

                return Number.MAX_SAFE_INTEGER;
            }

            return parseInt(schema.displayOrder, 10);
        };

        const sortedSchemas: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas([
            ...profileDetails.profileSchemas
        ]).sort((a: ProfileSchema, b: ProfileSchema) => {
            return getDisplayOrder(a) - getDisplayOrder(b);
        });

        return sortedSchemas;
    }, [ profileDetails.profileSchemas ]);

    /**
     * dispatch getProfileInformation action if the profileDetails object is empty
     */
    useEffect(() => {
        if (isEmpty(profileDetails.profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

    const isEmailVerificationEnabled: boolean = useMemo(() => {
        if (isEmpty(preferenceData) || isEmpty(preferenceData[0]?.properties)) {
            return false;
        }

        const responseProperties: PreferenceProperty[] = preferenceData[0].properties;
        const emailVerificationPreference: PreferenceProperty = responseProperties.find(
            (prop: PreferenceProperty) => prop.name === ProfileConstants.ENABLE_EMAIL_VERIFICATION
        );

        return emailVerificationPreference ? emailVerificationPreference.value.toLowerCase() === "true" : false;
    }, [ preferenceData ]);

    const isMobileVerificationEnabled: boolean = useMemo(() => {
        if (!isMobileVerificationFeatureEnabled) {
            return false;
        }
        if (isEmpty(preferenceData) || isEmpty(preferenceData[0]?.properties)) {
            return false;
        }

        const responseProperties: PreferenceProperty[] = preferenceData[0].properties;
        const mobileVerificationPreference: PreferenceProperty = responseProperties.find(
            (prop: PreferenceProperty) => prop.name === ProfileConstants.ENABLE_MOBILE_VERIFICATION
        );

        return mobileVerificationPreference ? mobileVerificationPreference.value.toLowerCase() === "true" : false;
    }, [ preferenceData, isMobileVerificationFeatureEnabled ]);

    const isEmailVerificationWithOTPEnabled: boolean = useMemo(() => {
        if (isEmpty(preferenceData) || isEmpty(preferenceData[0]?.properties)) {
            return false;
        }

        const responseProperties: PreferenceProperty[] = preferenceData[0].properties;
        const emailOTPVerificationPreference: PreferenceProperty = responseProperties.find(
            (prop: PreferenceProperty) => prop.name === ProfileConstants.ENABLE_EMAIL_VERIFICATION_WITH_OTP
        );

        return emailOTPVerificationPreference ? emailOTPVerificationPreference.value.toLowerCase() === "true" : false;
    }, [ preferenceData ]);

    /**
     * API call to get validation configurations.
     */
    const getValidationConfigurations = (): void => {
        setIsValidationConfigsLoading(true);
        fetchPasswordValidationConfig()
            .then((response: ValidationFormInterface[]) => {
                setUsernameConfig(getUsernameConfiguration(response));
                setIsValidationConfigsLoading(false);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                                "validationConfig.error.description",
                            { description: error?.response?.data?.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                                "validationConfig.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "validationConfig.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.changePassword.forms.passwordResetForm.validations." +
                            "validationConfig.genericError.message"
                    )
                });
            });
    };

    /**
     * Load validation configurations.
     */
    useEffect(() => {
        getValidationConfigurations();
    }, []);

    /**
     * Check if multiple emails and mobile numbers feature is enabled.
     */
    const isMultipleEmailsAndMobileNumbersEnabled: boolean = useMemo(() => {
        if (isEmpty(profileDetails) || isEmpty(flattenedProfileSchema) || !isMultipleEmailsAndMobileConfigEnabled) {
            return false;
        }

        const multipleEmailsAndMobileFeatureRelatedAttributes: string[] = [
            EMAIL_ADDRESSES_ATTRIBUTE,
            MOBILE_NUMBERS_ATTRIBUTE,
            VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE,
            VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
        ];

        // Check each required attribute exists and its supportedByDefault is enabled.
        const attributeCheck: boolean = multipleEmailsAndMobileFeatureRelatedAttributes.every((attribute: string) => {
            const schema: ProfileSchema = flattenedProfileSchema.find(
                (schema: ProfileSchema) => schema?.name === attribute
            );

            if (!schema) {
                return false;
            }

            // Resolve supportedByDefault: profile-level (endUser) takes precedence over global.
            let resolveSupportedByDefaultValue: boolean =
                schema?.supportedByDefault?.toLowerCase() === "true";

            if (schema?.profiles?.endUser?.supportedByDefault !== undefined) {
                resolveSupportedByDefaultValue = schema.profiles.endUser.supportedByDefault;
            }

            if (!resolveSupportedByDefaultValue) {
                return false;
            }

            return true;
        });

        return attributeCheck;
    }, [ profileDetails, flattenedProfileSchema ]);

    /**
     * Flatten the profile data for the form.
     * Refer to the `getFlattenedInitialValues` function for more details.
     */
    const flattenedProfileData: Record<string, unknown> = useMemo(() => {
        return getFlattenedInitialValues(
            (profileDetails.profileInfo as unknown) as ProfileInfoInterface,
            flattenedProfileSchema,
            isMultipleEmailsAndMobileNumbersEnabled,
            isEmailVerificationEnabled,
            isMobileVerificationEnabled
        );
    }, [
        profileDetails.profileInfo,
        flattenedProfileSchema,
        isMultipleEmailsAndMobileNumbersEnabled,
        isEmailVerificationEnabled,
        isMobileVerificationEnabled
    ]);

    /**
     * This useMemo identifies external claims that are mapped to the same local claim
     * between the Enterprise schema and the WSO2 System schema.
     *
     * These dual mappings occur only in migrated environments due to the SCIM2 schema restructuring
     * introduced in https://github.com/wso2/product-is/issues/20850.
     *
     * As claim management APIs are not available in My Account, this effect uses a value-based heuristic:
     * - A hardcoded list of attributes known to exist in both schemas is maintained.
     * - If both schema versions of a claim are present and have the same value, it is treated as a duplicate.
     *
     * Identified Enterprise claims are then excluded from the user profile UI to avoid redundancy.
     */
    const duplicatedUserClaims: string[] = useMemo(() => {
        if (isEmpty(flattenedProfileData) || isEmpty(flattenedProfileSchema)) {
            return;
        }

        const duplicatedEnterpriseClaims: string[] = [];

        ProfileConstants.MIGRATED_ENTERPRISE_SCIM_ATTRIBUTES.forEach((attrName: string) => {
            const enterpriseClaim: ProfileSchema = flattenedProfileSchema.find(
                (schema: ProfileSchema) =>
                    schema.name === attrName && schema?.schemaId === ProfileConstants.SCIM2_ENT_USER_SCHEMA
            );

            const systemClaim: ProfileSchema = flattenedProfileSchema.find(
                (schema: ProfileSchema) =>
                    schema.name === attrName && schema?.schemaId === ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA
            );

            if (!enterpriseClaim || !systemClaim) {
                return;
            }

            const enterpriseValue: string = flattenedProfileData[ProfileConstants.SCIM2_ENT_USER_SCHEMA]
                ?.[enterpriseClaim.name] ?? null;
            const systemValue: string = flattenedProfileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]
                ?.[systemClaim.name] ?? null;

            if (enterpriseValue === systemValue) {
                duplicatedEnterpriseClaims.push(enterpriseClaim.name);
            }
        });

        return duplicatedEnterpriseClaims;
    }, [ flattenedProfileSchema, flattenedProfileData ]);

    /**
     * Check if email address is displayed as a separate field.
     * Condition 1: If the custom username validation is enabled.
     * Condition 2: If the username is different from the email address. Handles the scenario
     * of username validation switched from custom username to email.
     */
    const isEmailFieldVisible: boolean =
        !isEmpty(flattenedProfileData) &&
        (usernameConfig?.enableValidator === "true" || (
            flattenedProfileData[ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME")] &&
            getUserNameWithoutDomain(
                flattenedProfileData[ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME")] as string
            ) !== flattenedProfileData[ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")]
        ));

    /**
     * Handles the profile update.
     *
     * @param data - The data to be updated.
     * @param resetOnUpdate - Indicates whether the form should be reset after update.
     */
    const handleProfileUpdate = (
        data: PatchOperationRequest<ProfilePatchOperationValue>,
        clearActiveForm: boolean = true
    ): void => {
        setIsProfileUpdating(true);

        updateProfileInfo(data as unknown as Record<string, unknown>)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.profile.notifications.updateProfileInfo.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t("myAccount:components.profile.notifications.updateProfileInfo.success.message")
                    });

                    // Re-fetch the profile information
                    dispatch(getProfileInformation(true));
                }
            })
            .catch((error: { status: string; detail: string }) => {
                if (error?.status === "400" && error?.detail) {
                    onAlertFired({
                        description: t("myAccount:components.profile.notifications.updateProfileInfo." +
                            "error.description", { description: error.detail }),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:components.profile.notifications.updateProfileInfo.error.message")
                    });

                    return;
                }

                onAlertFired({
                    description: t("myAccount:components.profile.notifications.updateProfileInfo" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.profile.notifications.updateProfileInfo.genericError.message")
                });
            })
            .finally(() => {
                setIsProfileUpdating(false);

                if (clearActiveForm) {
                    dispatch(setActiveForm(null));
                }
            });
    };

    /**
     * Check whether the profile url is readonly.
     *
     * @returns If the profile URL is readonly or not.
     */
    const isProfileUrlReadOnly = (): boolean => {
        return !(
            !isProfileReadOnly &&
            flattenedProfileSchema?.some((schema: ProfileSchemaInterface) => {
                const resolvedMutabilityValue: string = schema?.profiles?.endUser?.mutability ?? schema.mutability;

                return (
                    schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL") &&
                    resolvedMutabilityValue !== ProfileConstants.READONLY_SCHEMA
                );
            })
        );
    };

    /**
     * Check whether the value is empty or not.
     * @param schema - Profile schema
     * @returns boolean - Whether value is empty or not.
     */
    const isValueEmpty = (schema: ProfileSchema): boolean => {

        return isEmpty(extractAttributeValue(flattenedProfileData, schema));
    };

    /**
     * Resolves the effective supportedByDefault value for a schema,
     * giving precedence to the endUser profile-level override.
     */
    const resolveEndUserSupportedByDefault = (targetSchema: ProfileSchemaInterface): boolean => {
        let value: boolean = targetSchema?.supportedByDefault?.toLowerCase() === "true";

        if (targetSchema?.profiles?.endUser?.supportedByDefault !== undefined) {
            value = targetSchema.profiles.endUser.supportedByDefault;
        }

        return value;
    };

    /**
     * Checks whether a multi-valued attribute (emailAddresses or mobileNumbers) is
     * supported in the endUser profile, to decide whether to show it instead of the
     * corresponding primary attribute (emails or mobile).
     */
    const isMultiValuedAttributeSupportedInEndUser = (schemaName: string): boolean => {
        if (!isMultipleEmailsAndMobileConfigEnabled) {
            return false;
        }

        const targetSchema: ProfileSchemaInterface = flattenedProfileSchema.find(
            (s: ProfileSchemaInterface) => s.name === schemaName
        );

        if (!targetSchema) {
            return false;
        }

        return resolveEndUserSupportedByDefault(targetSchema);
    };

    /**
     * Check whether the field is displayable or not.
     * @param schema - Field schema.
     * @returns boolean - Whether the field is displayable or not.
     */
    const isFieldDisplayable = (schema: ProfileSchemaInterface): boolean => {
        if (HIDDEN_ATTRIBUTES.includes(schema.name)) {
            return false;
        }

        const resolvedMutabilityValue: string = schema?.profiles?.endUser?.mutability ?? schema.mutability;

        // Hide non-boolean empty attributes if the profile is read-only or the attribute is read-only.
        // Boolean attributes will be displayed in read-only mode even if they are empty.
        if (
            schema.type?.toLowerCase() !== ClaimDataType.BOOLEAN.toLowerCase() &&
            isValueEmpty(schema) &&
            (isProfileReadOnly || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA)
        ) {
            return false;
        }

        if ((schema.name === EMAIL_ATTRIBUTE || schema.name === EMAIL_ADDRESSES_ATTRIBUTE) && !isEmailFieldVisible) {
            return false;
        }

        if (
            schema.name === EMAIL_ADDRESSES_ATTRIBUTE &&
            !isMultipleEmailsAndMobileConfigEnabled
        ) {
            return false;
        }

        if (
            schema.name === MOBILE_NUMBERS_ATTRIBUTE &&
            !isMultipleEmailsAndMobileConfigEnabled
        ) {
            return false;
        }

        // Hide primary emails if emailAddresses is supported in the endUser profile.
        if (
            schema.name === EMAIL_ATTRIBUTE &&
            isMultiValuedAttributeSupportedInEndUser(
                ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES")
            )
        ) {
            return false;
        }

        // Hide primary mobile if mobileNumbers is supported in the endUser profile.
        if (
            schema.name === MOBILE_ATTRIBUTE &&
            isMultiValuedAttributeSupportedInEndUser(
                ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS")
            )
        ) {
            return false;
        }

        if (
            duplicatedUserClaims?.some(
                (claim: string) => claim === schema.name && schema.schemaId === ProfileConstants.SCIM2_ENT_USER_SCHEMA
            )
        ) {
            return false;
        }

        // If the Distinct Attribute Profiles feature is enabled, check the supportedByDefault flag.
        // Hide the field if the schema is not supported by default.
        // This does not apply to the username field. It is always shown.
        if (isDistinctAttributeProfilesFeatureEnabled && schema.name !== USERNAME_ATTRIBUTE) {
            let resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

            if (schema?.profiles?.endUser?.supportedByDefault !== undefined) {
                resolveSupportedByDefaultValue = schema?.profiles?.endUser?.supportedByDefault;
            }

            if (!resolveSupportedByDefaultValue) {
                return false;
            }
        }

        // If the attribute is a complex type, it should not be displayed.
        if (schema.type?.toLowerCase() === ClaimDataType.COMPLEX.toLowerCase() &&
            schema.schemaUri !== ProfileConstants.SCIM2_CORE_USER_SCHEMA_ATTRIBUTES.emails &&
            schema.schemaUri !== ProfileConstants.SCIM2_CORE_USER_SCHEMA_ATTRIBUTES.mobile) {
            return false;
        }

        return true;
    };

    const renderAttributeField = (schema: ProfileSchemaInterface): ReactElement => {
        /*
         * Makes the "Username" field a READ_ONLY field. By default the
         * server SCIM2 endpoint sends it as a "READ_WRITE" property.
         * We are able to enable/disable read-only mode for specific
         * claim dialects in user-store(s). However, it does not apply to
         * all the tenants.
         *
         * Since we only interested in checking `username` we check the
         * `isProfileUsernameReadonly` condition at top level. So,
         * if it is `false` by default then we won't check the `name`
         * unnecessarily.
         *
         * Match case explanation:-
         * Ideally it should be the exact attribute name @see {@link http://wso2.org/claims/username}
         * `username`. But we will transform the `schema.name`.
         * and `schema.displayName` to a lowercase string and then check
         * the value matches.
         */
        if (isProfileUsernameReadonly) {
            const usernameClaim: string = USERNAME_ATTRIBUTE.toLowerCase();

            if (schema.name?.toLowerCase() === usernameClaim || schema.displayName?.toLowerCase() === usernameClaim) {
                schema.mutability = ProfileConstants.READONLY_SCHEMA;
            }
        }

        // Makes the email field read-only for users without local credentials
        if (isNonLocalCredentialUser) {
            if (schema.name?.toLowerCase() === EMAIL_ATTRIBUTE) {
                schema.mutability = ProfileConstants.READONLY_SCHEMA;
            }
        }

        let fieldLabel: string = t("myAccount:components.profile.fields." + schema.displayName, {
            defaultValue: schema.displayName
        });

        if (schema.name === USERNAME_ATTRIBUTE && !isEmailFieldVisible) {
            fieldLabel = fieldLabel + " (Email)";
        }

        const resolvedMutabilityValue: string = schema?.profiles?.endUser?.mutability ?? schema.mutability;
        const isFieldReadOnly: boolean =
            isProfileReadOnly ||
            resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA ||
            schema.name === USERNAME_ATTRIBUTE;
        const resolvedRequiredValue: boolean = schema?.profiles?.endUser?.required ?? schema.required;

        const initialValue: unknown = extractAttributeValue(flattenedProfileData, schema);
        const formId: string = `${ CommonConstants.PERSONAL_INFO }-${ schema.schemaUri ?? "" }-${ schema.name }`;

        return (
            <List.Item
                key={ `${schema.schemaUri ?? ""}-${schema.name}` }
                className="inner-list-item"
                data-testid={ `${testId}-schema-list-item` }
            >
                <ProfileFieldFormRenderer
                    fieldLabel={ fieldLabel }
                    initialValue={ initialValue as string | number | boolean | string[] }
                    fieldSchema={ schema }
                    flattenedProfileSchema={ flattenedProfileSchema }
                    flattenedProfileData={ flattenedProfileData }
                    formId={ formId }
                    isActive={ activeForm === formId }
                    isEditable={ !isFieldReadOnly }
                    isRequired={ resolvedRequiredValue }
                    setIsProfileUpdating={ (isUpdating: boolean) => setIsProfileUpdating(isUpdating) }
                    isLoading={ isLoading }
                    isUpdating={ isProfileUpdating }
                    data-componentid={ testId }
                    triggerUpdate={ handleProfileUpdate }
                    isEmailVerificationEnabled={ isEmailVerificationEnabled }
                    isEmailVerificationWithOTPEnabled={ isEmailVerificationWithOTPEnabled }
                    isMobileVerificationEnabled={ isMobileVerificationEnabled }
                />
            </List.Item>
        );
    };

    return (
        <>
            <SettingsSection
                data-testid={ `${testId}-settings-section` }
                description={ t("myAccount:sections.profile.description") }
                header={ t("myAccount:sections.profile.heading") }
                icon={
                    (<ProfileAvatar
                        isReadOnly={ isProfileUrlReadOnly() }
                        profileInfo={ profileDetails?.profileInfo as any }
                        isProfileUpdating={ isProfileUpdating }
                        setIsUpdating={ (isUpdating: boolean) => setIsProfileUpdating(isUpdating) }
                    />)
                }
                iconMini={
                    (<ProfileAvatar
                        isReadOnly={ isProfileUrlReadOnly() }
                        isProfileUpdating={ isProfileUpdating }
                        profileInfo={ profileDetails?.profileInfo as any }
                        setIsUpdating={ (isUpdating: boolean) => setIsProfileUpdating(isUpdating) }
                    />)
                }
                placeholder={
                    !isSCIMEnabled ? t("myAccount:components.profile.placeholders.SCIMDisabled.heading") : null
                }
            >
                { (isLoading || !flattenedProfileData) && (
                    <Container className="p-4">
                        <Placeholder>
                            <Placeholder.Line />
                        </Placeholder>
                    </Container>
                ) }
                { !isLoading && !hasLocalAccount && (
                    <Container className="pl-5 pr-5 pb-4">
                        <Message
                            type="info"
                            content={
                                "Your profile cannot be managed from this portal." +
                                " Please contact your administrator for more details."
                            }
                            data-testid={ `${testId}-read-only-profile-banner` }
                            data-componentid={ `${testId}-read-only-profile-banner` }
                        />
                    </Container>
                ) }
                { !isLoading && hasLocalAccount && flattenedProfileData && (
                    <List
                        divided={ true }
                        verticalAlign="middle"
                        className="main-content-inner profile-form"
                        data-testid={ `${testId}-schema-list` }
                    >
                        { flattenedProfileSchema
                            ?.filter((schema: ProfileSchemaInterface) => isFieldDisplayable(schema))
                            ?.map((schema: ProfileSchemaInterface) => {
                                return renderAttributeField(schema);
                            }) }
                    </List>
                ) }
            </SettingsSection>
        </>
    );
};
