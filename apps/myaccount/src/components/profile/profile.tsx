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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { getUserNameWithoutDomain, hasRequiredScopes, isFeatureEnabled, resolveUserstore } from "@wso2is/core/helpers";
import {
    AlertLevels,
    ClaimDataType,
    PatchOperationRequest,
    ProfileSchemaInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { ProfileUtils } from "@wso2is/core/utils";
import { Message } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import isArray from "lodash-es/isArray";
import isEmpty from "lodash-es/isEmpty";
import React, { Dispatch, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Container, List, Placeholder } from "semantic-ui-react";
import ProfileFieldFormRenderer from "./fields/field-form-renderer";
import ProfileAvatar from "./profile-avatar";
import { getPreference } from "../../api/preference";
import { updateProfileInfo } from "../../api/profile";
import { fetchPasswordValidationConfig, getUsernameConfiguration } from "../../api/validation";
import { AppConstants, CommonConstants, ProfileConstants as MyAccountProfileConstants } from "../../constants";
import {
    AlertInterface,
    AuthStateInterface,
    BasicProfileInterface,
    FeatureConfigInterface,
    PreferenceConnectorResponse,
    PreferenceProperty,
    PreferenceRequest,
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
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES")
];

/**
 * Interface for the canonical attributes.
 */
interface CanonicalAttribute {
    [key: string]: string;
}

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
    const primaryUserStoreDomainName: string = uiConfig?.primaryUserStoreDomainName;
    const isProfileUsernameReadonly: boolean = uiConfig?.isProfileUsernameReadonly;
    const userSchemaURI: string = uiConfig?.userSchemaURI;

    const [ isProfileUpdating, setIsProfileUpdating ] = useState<boolean>(false);
    const [ isPreferencesLoading, setIsPreferencesLoading ] = useState<boolean>(true);
    const [ isMobileVerificationEnabled, setIsMobileVerificationEnabled ] = useState<boolean>(false);
    const [ isEmailVerificationEnabled, setIsEmailVerificationEnabled ] = useState<boolean>(false);
    const [ isValidationConfigsLoading, setIsValidationConfigsLoading ] = useState<boolean>(true);
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>();

    const isLoading: boolean =
        isProfileInfoLoading || isProfileSchemaLoading || isPreferencesLoading || isValidationConfigsLoading;

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

    /**
     * The following method gets the preference for verification on mobile and email update.
     * And check whether verification is enabled or not.
     */
    const getPreferences = (): void => {
        setIsPreferencesLoading(true);
        const userClaimUpdateConnector: PreferenceRequest[] = [
            {
                "connector-name": ProfileConstants.USER_CLAIM_UPDATE_CONNECTOR,
                properties: [ ProfileConstants.ENABLE_EMAIL_VERIFICATION, ProfileConstants.ENABLE_MOBILE_VERIFICATION ]
            }
        ];

        getPreference(userClaimUpdateConnector)
            .then((response: PreferenceConnectorResponse[]) => {
                if (response) {
                    const userClaimUpdateOptions: PreferenceConnectorResponse[] = response;
                    const responseProperties: PreferenceProperty[] = userClaimUpdateOptions[0].properties;

                    responseProperties.forEach((prop: PreferenceProperty) => {
                        if (prop.name === ProfileConstants.ENABLE_EMAIL_VERIFICATION) {
                            setIsEmailVerificationEnabled(prop.value.toLowerCase() == "true");
                        }
                        if (isMobileVerificationFeatureEnabled
                            && prop.name === ProfileConstants.ENABLE_MOBILE_VERIFICATION) {
                            setIsMobileVerificationEnabled(prop.value.toLowerCase() == "true");
                        }
                    });

                    setIsPreferencesLoading(false);
                } else {
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
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:sections.verificationOnUpdate.preference.notifications.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t("myAccount:sections.verificationOnUpdate.preference.notifications..error.message")
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:sections.verificationOnUpdate.preference.notifications.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:sections.verificationOnUpdate.preference.notifications.genericError.message")
                });
            });
    };

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
     * Load verification on update preferences.
     */
    useEffect(() => {
        getPreferences();
        getValidationConfigurations();
    }, []);

    /**
     * This also maps profile info to the schema.
     */
    const mappedProfileInfo: Map<string, string> = useMemo(() => {
        if (
            !isEmpty(flattenedProfileSchema) &&
            !isEmpty(profileDetails) &&
            !isEmpty(profileDetails.profileInfo) &&
            !isLoading
        ) {
            const tempProfileInfo: Map<string, string> = new Map<string, string>();

            flattenedProfileSchema.forEach((schema: ProfileSchema) => {
                // this splits for the sub-attributes
                const schemaNames: string[] = schema.name.split(".");

                let isCanonical: boolean = false;

                // this splits for the canonical types
                const schemaNamesCanonicalType: string[] = schemaNames[0].split("#");

                if (schemaNamesCanonicalType.length !== 1) {
                    isCanonical = true;
                }

                if (schemaNames.length === 1) {
                    if (schemaNames[0] === "emails") {
                        if (isEmailVerificationEnabled &&
                            profileDetails?.profileInfo?.pendingEmails?.length > 0) {
                            // If there is a verification pending email,
                            // then it will be shown as the primary email.
                            tempProfileInfo.set(schema.name,
                                profileDetails.profileInfo.pendingEmails[0].value as string);
                        } else {
                            const primaryEmail: string = !isEmpty(profileDetails.profileInfo[schemaNames[0]])
                                ? profileDetails.profileInfo[schemaNames[0]]?.find(
                                    (subAttribute: string) => typeof subAttribute === "string")
                                : "";

                            // Set the primary email value.
                            tempProfileInfo.set(schema.name, primaryEmail);
                        }
                    } else {
                        if (schema.extended) {
                            const schemaURIs: string[] = [
                                ProfileConstants.SCIM2_ENT_USER_SCHEMA,
                                ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA,
                                userSchemaURI
                            ];

                            for (const schemaURI of schemaURIs) {
                                if (profileDetails?.profileInfo[schemaURI]?.[schemaNames[0]]) {
                                    const multiValuedAttributes: string[] = [
                                        EMAIL_ADDRESSES_ATTRIBUTE,
                                        MOBILE_NUMBERS_ATTRIBUTE,
                                        VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE,
                                        VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
                                    ];

                                    if (
                                        (schemaURI === ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA &&
                                            multiValuedAttributes.includes(schemaNames[0])) ||
                                        (schemaURI === ProfileConstants.SCIM2_ENT_USER_SCHEMA && schema.multiValued) ||
                                        (schemaURI === userSchemaURI && schema.multiValued)
                                    ) {
                                        const attributeValue: string | string[] =
                                            profileDetails?.profileInfo[schemaURI]?.[schemaNames[0]];

                                        const formattedValue: string = Array.isArray(attributeValue)
                                            ? attributeValue.join(",")
                                            : "";

                                        tempProfileInfo.set(schema.name, formattedValue);

                                        return;
                                    }

                                    tempProfileInfo.set(
                                        schema.name,
                                        profileDetails?.profileInfo[schemaURI]?.[schemaNames[0]] ?? ""
                                    );

                                    return;
                                }
                            }
                        }
                        tempProfileInfo.set(schema.name, profileDetails.profileInfo[schemaNames[0]]);
                    }
                } else {
                    if (schemaNames[0] === "name") {
                        tempProfileInfo.set(schema.name, profileDetails.profileInfo[schemaNames[0]][schemaNames[1]]);
                    } else if (isCanonical) {
                        let indexOfType: number = -1;

                        profileDetails?.profileInfo[schemaNamesCanonicalType[0]]?.forEach(
                            (canonical: CanonicalAttribute) => {
                                if (schemaNamesCanonicalType[1] === canonical?.type) {
                                    indexOfType = profileDetails?.profileInfo[schemaNamesCanonicalType[0]].indexOf(
                                        canonical
                                    );
                                }
                            }
                        );

                        if (indexOfType > -1) {
                            const subValue: string =
                                profileDetails?.profileInfo[schemaNamesCanonicalType[0]][indexOfType][schemaNames[1]];

                            if (schemaNamesCanonicalType[0] === "addresses") {
                                tempProfileInfo.set(schema.name, subValue);
                            }
                        }
                    } else {
                        if (
                            schema.extended &&
                            schema.schemaId === ProfileConstants.SCIM2_ENT_USER_SCHEMA &&
                            profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaNames[0]]
                        ) {
                            const attributeValue: string | string[] =
                                profileDetails?.profileInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaNames[0]][
                                    schemaNames[1]
                                ];

                            if (schema.multiValued) {
                                const formattedValue: string = Array.isArray(attributeValue)
                                    ? attributeValue.join(",")
                                    : "";

                                tempProfileInfo.set(schema.name, formattedValue);
                            } else {
                                tempProfileInfo.set(schema.name, (attributeValue as string) ?? "");
                            }
                        } else if (
                            schema.extended &&
                            schema.schemaId === ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA &&
                            profileDetails?.profileInfo[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.[schemaNames[0]]
                        ) {
                            tempProfileInfo.set(
                                schema.name,
                                profileDetails.profileInfo[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA][schemaNames[0]][
                                    schemaNames[1]
                                ] ?? ""
                            );
                        } else if (
                            schema.extended &&
                            schema.schemaId === userSchemaURI &&
                            profileDetails?.profileInfo[userSchemaURI]?.[schemaNames[0]]
                        ) {
                            const attributeValue: string | string[] =
                                profileDetails?.profileInfo[userSchemaURI]?.[schemaNames[0]][schemaNames[1]];

                            if (schema.multiValued) {
                                const formattedValue: string = Array.isArray(attributeValue)
                                    ? attributeValue.join(",")
                                    : "";

                                tempProfileInfo.set(schema.name, formattedValue);
                            } else {
                                tempProfileInfo.set(schema.name, (attributeValue as string) ?? "");
                            }
                        } else {
                            const subValue: BasicProfileInterface =
                                profileDetails.profileInfo[schemaNames[0]] &&
                                profileDetails.profileInfo[schemaNames[0]].find(
                                    (subAttribute: BasicProfileInterface) => subAttribute.type === schemaNames[1]
                                );

                            if (schemaNames[0] === "addresses") {
                                tempProfileInfo.set(schema.name, subValue ? subValue.formatted : "");
                            } else {
                                tempProfileInfo.set(schema.name, subValue ? subValue.value : "");
                            }
                        }
                    }
                }
            });

            if (isArray(profileDetails.profileInfo.pendingEmails) && profileDetails.profileInfo.pendingEmails[0]) {
                const { value: pendingEmail } = profileDetails.profileInfo.pendingEmails[0];

                tempProfileInfo.set("pendingEmails.value", pendingEmail);
            }

            return tempProfileInfo;
        }
    }, [ flattenedProfileSchema, profileDetails.profileInfo ]);

    /**
     * Check if multiple emails and mobile numbers feature is enabled.
     */
    const isMultipleEmailsAndMobileNumbersEnabled: boolean = useMemo(() => {
        if (isEmpty(profileDetails) || isEmpty(flattenedProfileSchema) || !isMultipleEmailsAndMobileConfigEnabled) {
            return false;
        }

        const multipleEmailsAndMobileFeatureRelatedAttributes: string[] = [
            MOBILE_ATTRIBUTE,
            EMAIL_ATTRIBUTE,
            EMAIL_ADDRESSES_ATTRIBUTE,
            MOBILE_NUMBERS_ATTRIBUTE,
            VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE,
            VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
        ];

        const username: string = profileDetails?.profileInfo["userName"];

        if (!username) {
            return false;
        }

        const userStoreDomain: string = resolveUserstore(username, primaryUserStoreDomainName)?.toUpperCase();
        // Check each required attribute exists and domain is not excluded in the excluded user store list.
        const attributeCheck: boolean = multipleEmailsAndMobileFeatureRelatedAttributes.every((attribute: string) => {
            const schema: ProfileSchema = flattenedProfileSchema.find(
                (schema: ProfileSchema) => schema?.name === attribute
            );

            if (!schema) {
                return false;
            }

            // The global supportedByDefault value is a string. Hence, it needs to be converted to a boolean.
            const resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

            if (!resolveSupportedByDefaultValue) {
                return false;
            }

            const excludedUserStores: string[] =
                schema?.excludedUserStores?.split(",")?.map((store: string) => store?.trim().toUpperCase()) || [];

            return !excludedUserStores.includes(userStoreDomain);
        });

        return attributeCheck;
    }, [ profileDetails, flattenedProfileSchema ]);

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
        if (isEmpty(mappedProfileInfo) || isEmpty(flattenedProfileSchema)) {
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

            const enterpriseValue: string = mappedProfileInfo.get(enterpriseClaim.name) ?? null;
            const systemValue: string = mappedProfileInfo.get(systemClaim.name) ?? null;

            if (enterpriseValue === systemValue) {
                duplicatedEnterpriseClaims.push(enterpriseClaim.name);
            }
        });

        return duplicatedEnterpriseClaims;
    }, [ flattenedProfileSchema, mappedProfileInfo ]);

    /**
     * Check if email address is displayed as a separate field.
     * Condition 1: If the custom username validation is enabled.
     * Condition 2: If the username is different from the email address. Handles the scenario
     * of username validation switched from custom username to email.
     */
    const isEmailFieldVisible: boolean =
        !isEmpty(mappedProfileInfo) &&
        (usernameConfig?.enableValidator === "true" ||
            getUserNameWithoutDomain(
                mappedProfileInfo.get(ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME"))
            ) !== mappedProfileInfo.get(ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")));

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
            .catch((error: IdentityAppsApiException) => {
                onAlertFired({
                    description:
                        error?.response?.detail ??
                        t("myAccount:components.profile.notifications.updateProfileInfo.genericError.description"),
                    level: AlertLevels.ERROR,
                    message:
                        error?.message ??
                        t("myAccount:components.profile.notifications.updateProfileInfo.genericError.message")
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
     * The email address stored in "emails" is the primary email address.
     * @returns The email address stored in "emails".
     */
    const getExistingPrimaryEmail = (): string => {
        return (
            profileDetails.profileInfo[EMAIL_ATTRIBUTE] &&
            Array.isArray(profileDetails.profileInfo[EMAIL_ATTRIBUTE]) &&
            profileDetails.profileInfo[EMAIL_ATTRIBUTE].find((subAttribute: string) => typeof subAttribute === "string")
        );
    };

    /**
     * Check whether the value is empty or not.
     * @param schema - Profile schema
     * @returns boolean - Whether value is empty or not.
     */
    const isValueEmpty = (schema: ProfileSchema): boolean => {
        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            return isEmpty(mappedProfileInfo.get(schema.name)) && isEmpty(getExistingPrimaryEmail());
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            return isEmpty(mappedProfileInfo.get(schema.name)) && isEmpty(mappedProfileInfo.get(MOBILE_ATTRIBUTE));
        }

        return isEmpty(mappedProfileInfo.get(schema.name));
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

        if (
            isValueEmpty(schema) &&
            (isProfileReadOnly || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA)
        ) {
            return false;
        }

        if ((schema.name === EMAIL_ATTRIBUTE || schema.name === EMAIL_ADDRESSES_ATTRIBUTE) && !isEmailFieldVisible) {
            return false;
        }

        if (isMultipleEmailsAndMobileNumbersEnabled) {
            if (schema.name === EMAIL_ATTRIBUTE || schema.name === MOBILE_ATTRIBUTE) {
                return false;
            }
        } else {
            if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE || schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
                return false;
            }
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

        return (
            <List.Item key={ schema.name } className="inner-list-item" data-testid={ `${testId}-schema-list-item` }>
                <ProfileFieldFormRenderer
                    fieldLabel={ fieldLabel }
                    initialValue={ mappedProfileInfo.get(schema.name) }
                    fieldSchema={ schema }
                    flattenedProfileSchema={ flattenedProfileSchema }
                    isActive={ activeForm === CommonConstants.PERSONAL_INFO + schema.name }
                    isEditable={ !isFieldReadOnly }
                    isRequired={ resolvedRequiredValue }
                    setIsProfileUpdating={ (isUpdating: boolean) => setIsProfileUpdating(isUpdating) }
                    isLoading={ isLoading }
                    isUpdating={ isProfileUpdating }
                    data-componentid={ testId }
                    triggerUpdate={ handleProfileUpdate }
                    profileInfo={ mappedProfileInfo }
                    isEmailVerificationEnabled={ isEmailVerificationEnabled }
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
                { (isLoading || !mappedProfileInfo) && (
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
                { !isLoading && hasLocalAccount && mappedProfileInfo && (
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
