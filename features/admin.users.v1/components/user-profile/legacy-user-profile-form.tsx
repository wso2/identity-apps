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

import TableContainer from "@mui/material/TableContainer";
import OxygenButton from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Table from "@oxygen-ui/react/Table";
import TableBody from "@oxygen-ui/react/TableBody";
import TableCell from "@oxygen-ui/react/TableCell";
import TableRow from "@oxygen-ui/react/TableRow";
import { getAllExternalClaims } from "@wso2is/admin.claims.v1/api/claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { commonConfig as commonExtensionConfig } from "@wso2is/admin.extensions.v1/configs/common";
import { userConfig as userExtensionConfig } from "@wso2is/admin.extensions.v1/configs/user";
import {
    OperationValueInterface,
    PatchRoleDataInterface,
    ScimOperationsInterface
} from "@wso2is/admin.roles.v2/models/roles";
import { ProfileConstants } from "@wso2is/core/constants";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    ExternalClaim,
    IdentifiableComponentInterface,
    PatchOperationRequest,
    ProfileInfoInterface,
    ProfileSchemaInterface,
    SharedProfileValueResolvingMethod
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils, ProfileUtils } from "@wso2is/core/utils";
import { Field, Forms, Validation } from "@wso2is/forms";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { Button, Popup } from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, Form, Grid, Icon, Input } from "semantic-ui-react";
import { updateUserInfo } from "../../api/users";
import {
    AdminAccountTypes,
    AttributeDataType,
    LocaleJoiningSymbol,
    UserManagementConstants
} from "../../constants/user-management-constants";
import {
    AccountConfigSettingsInterface,
    PatchUserOperationValue,
    SchemaAttributeValueInterface
} from "../../models/user";
import {
    constructPatchOpValueForMultiValuedAttribute,
    constructPatchOperationForMultiValuedVerifiedAttribute,
    isMultipleEmailsAndMobileNumbersEnabled,
    isSchemaReadOnly
} from "../../utils/user-management-utils";

const EMAIL_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS");
const MOBILE_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE");
const EMAIL_ADDRESSES_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES");
const MOBILE_NUMBERS_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS");
const VERIFIED_MOBILE_NUMBERS_ATTRIBUTE: string =
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS");
const VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE: string =
    ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES");
const PRIMARY_EMAIL_VERIFIED_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_VERIFIED");
const PRIMARY_MOBILE_VERIFIED_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_VERIFIED");

interface UserProfileFormPropsInterface extends IdentifiableComponentInterface {
    profileData: ProfileInfoInterface;
    flattenedProfileData: Map<string, string>;
    profileSchema: ProfileSchemaInterface[];
    isReadOnly: boolean;
    onUserUpdate: (userId: string) => void;
    isUpdating: boolean;
    adminUserType?: string;
    isUserManagedByParentOrg: boolean;
    setIsUpdating: (isUpdating: boolean) => void;
    accountConfigSettings: AccountConfigSettingsInterface;
    onUpdate: (userId: string) => void;
}

const UserProfileForm: FunctionComponent<UserProfileFormPropsInterface> = (
    {
        profileData,
        flattenedProfileData,
        profileSchema,
        isReadOnly,
        isUpdating,
        adminUserType,
        isUserManagedByParentOrg,
        setIsUpdating,
        onUserUpdate,
        accountConfigSettings,
        onUpdate,
        ["data-componentid"]: componentId = "user-profile-form"
    }: UserProfileFormPropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const createdDate: string = profileData?.meta?.created;
    const modifiedDate: string = profileData?.meta?.lastModified;
    const oneTimePassword: string = profileData[userExtensionConfig.userProfileSchema]?.oneTimePassword;

    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ isFormStale, setIsFormStale ] = useState<boolean>(false);
    const [ isMultiValuedItemInvalid, setIsMultiValuedItemInvalid ] =  useState<Record<string, boolean>>({});
    const [ simpleMultiValuedExtendedProfileSchema, setSimpleMultiValuedExtendedProfileSchema ]
            = useState<ProfileSchemaInterface[]>();
    const [ multiValuedAttributeValues, setMultiValuedAttributeValues ] =
            useState<Record<string, string[]>>({});
    const [ multiValuedInputFieldValue, setMultiValuedInputFieldValue ] = useState<Record<string, string>>({});
    const [ primaryValues, setPrimaryValues ] = useState<Record<string, string>>({});
    const [ duplicatedUserClaims, setDuplicatedUserClaims ] = useState<ExternalClaim[]>([]);

    const isDistinctAttributeProfilesFeatureEnabled: boolean = isFeatureEnabled(featureConfig?.attributeDialects,
        ClaimManagementConstants.DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG);

    const isMultipleEmailAndMobileNumberEnabled: boolean = useMemo(() => {
        return isMultipleEmailsAndMobileNumbersEnabled(flattenedProfileData, profileSchema);
    }, [ profileSchema, flattenedProfileData ]);

    /**
     * This will add role attribute to countries search input to prevent autofill suggestions.
     */
    const onCountryRefChange: any = useCallback((node: any) => {
        if (node !== null) {
            node.children[0].children[1].children[0].role = "presentation";
        }
    }, []);

    /**
     * Loads the country list.
     */
    const countryList: DropdownItemProps = useMemo(() => {
        return CommonUtils.getCountryList();
    }, []);

    /**
     * This useEffect identifies external claims that are mapped to the same local claim
     * between the Enterprise schema and the WSO2 System schema.
     *
     * These dual mappings occur only in migrated environments due to the SCIM2 schema restructuring
     * introduced in https://github.com/wso2/product-is/issues/20850.
     *
     * The effect fetches both sets of external claims and detects overlaps by comparing their
     * mappedLocalClaimURI values.
     * Identified Enterprise claims are then excluded from the user profile UI to avoid redundancy.
     */
    useEffect(() => {
        const fetchAllClaims = async () => {
            try {
                const [ enterpriseClaims, systemClaims ] = await Promise.all([
                    getAllExternalClaims(
                        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_ENT_USER"),
                        null
                    ),
                    getAllExternalClaims(
                        ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_SYSTEM"),
                        null
                    )
                ]);

                const systemMappedClaimURIs: Set<string> = new Set(
                    systemClaims.map((claim: ExternalClaim) => claim.mappedLocalClaimURI).filter(Boolean)
                );
                const duplicates: ExternalClaim[] = enterpriseClaims.filter(
                    (claim: ExternalClaim) =>
                        claim.mappedLocalClaimURI &&
                        systemMappedClaimURIs.has(claim.mappedLocalClaimURI)
                );

                setDuplicatedUserClaims(duplicates);

            } catch (error) {
                dispatch(addAlert({
                    description: t("claims:external.notifications.fetchExternalClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("claims:external.notifications.fetchExternalClaims.genericError.message")
                }));
            }
        };

        fetchAllClaims();
    }, []);

    /**
     * Set multi-valued attribute values to the state.
     */
    useEffect(() => {
        mapMultiValuedAttributeValues(flattenedProfileData);
    }, [ flattenedProfileData, simpleMultiValuedExtendedProfileSchema ]);

    /**
     *  Filters out simple multi-valued attributes from extended schemas.
     */
    useEffect(() => {
        const META_VERSION: string = ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("META_VERSION");
        const simpleMultiValuedExtendedSchemas: ProfileSchemaInterface[] = [];

        for (const schema of ProfileUtils.flattenSchemas([ ...profileSchemas ])) {
            if (schema.name === META_VERSION) {
                continue;
            }
            // Only simple multi-valued attributes in extended schemas are supported generally.
            if (schema.extended && schema.multiValued && schema.type !== AttributeDataType.COMPLEX) {
                simpleMultiValuedExtendedSchemas.push(schema);
            }
        }

        setSimpleMultiValuedExtendedProfileSchema(simpleMultiValuedExtendedSchemas);
    }, [ profileSchemas ]);

    /**
     * The following function map multi-valued attribute values and their primary values from profile data.
     *
     * @param profileData - Profile data.
     */
    const mapMultiValuedAttributeValues = (profileData: Map<string, string>): void => {

        const tempMultiValuedAttributeValues: Record<string, string[]> = {};
        const tempPrimaryValues: Record<string, string> = {};

        simpleMultiValuedExtendedProfileSchema?.forEach((schema: ProfileSchemaInterface) => {
            const attributeValue: string = profileData?.get(schema.name);

            tempMultiValuedAttributeValues[schema.name] = attributeValue ? attributeValue.split(",") : [];
        });

        if (isMultipleEmailAndMobileNumberEnabled) {
            const primaryEmail: string = profileData?.get(EMAIL_ATTRIBUTE);
            const primaryMobile: string = profileData?.get(MOBILE_ATTRIBUTE);

            if (!isEmpty(primaryEmail)) {
                const emailAddresses: string[] = tempMultiValuedAttributeValues[EMAIL_ADDRESSES_ATTRIBUTE]
                    ?.filter((value: string) => !isEmpty(value) && value !== primaryEmail) ?? [];

                emailAddresses.unshift(primaryEmail);
                tempMultiValuedAttributeValues[EMAIL_ADDRESSES_ATTRIBUTE] = emailAddresses;
            }
            if (!isEmpty(primaryMobile)) {
                const mobileNumbers: string[] = tempMultiValuedAttributeValues[MOBILE_NUMBERS_ATTRIBUTE]
                    ?.filter((value: string) => !isEmpty(value) && value !== primaryMobile) ?? [];

                mobileNumbers.unshift(primaryMobile);
                tempMultiValuedAttributeValues[MOBILE_NUMBERS_ATTRIBUTE] = mobileNumbers;
            }
            tempPrimaryValues[EMAIL_ATTRIBUTE] = primaryEmail;
            tempPrimaryValues[MOBILE_ATTRIBUTE] = primaryMobile;
        }

        setMultiValuedAttributeValues(tempMultiValuedAttributeValues);
        setPrimaryValues(tempPrimaryValues);
    };

    /**
     * The function returns the normalized format of locale.
     *
     * @param locale - locale value.
     * @param localeJoiningSymbol - symbol used to join language and region parts of locale.
     * @param updateSupportedLanguage - If supported languages needs to be updated with the given localString or not.
     */
    const normalizeLocaleFormat = (
        locale: string,
        localeJoiningSymbol: LocaleJoiningSymbol,
        updateSupportedLanguage: boolean
    ): string => {
        if (!locale) {
            return locale;
        }

        const separatorIndex: number = locale.search(/[-_]/);

        let normalizedLocale: string = locale;

        if (separatorIndex !== -1) {
            const language: string = locale.substring(0, separatorIndex).toLowerCase();
            const region: string = locale.substring(separatorIndex + 1).toUpperCase();

            normalizedLocale = `${language}${localeJoiningSymbol}${region}`;
        }

        if (updateSupportedLanguage && !supportedI18nLanguages[normalizedLocale]) {
            supportedI18nLanguages[normalizedLocale] = {
                code: normalizedLocale,
                name: UserManagementConstants.GLOBE,
                namespaces: []
            };
        }

        return normalizedLocale;
    };

    /**
     * Resolves the required value of the attribute based on the shared profile value resolving method
     * and the schema.
     *
     * @param schema - Schema of the attribute.
     * @param sharedProfileValueResolvingMethod - Shared profile value resolving method of the attribute.
     * @returns True if the attribute is required.
     */
    const resolveRequiredValue = (
        schema: ProfileSchemaInterface,
        sharedProfileValueResolvingMethod: string
    ): boolean => {

        if (isUserManagedByParentOrg &&
            sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN) {
            return false;
        }

        return schema?.profiles?.console?.required ?? schema.required;
    };


    /**
     * Delete a multi-valued item.
     *
     * @param schema - schema of the attribute
     * @param attributeValue - value of the attribute
     */
    const handleMultiValuedItemDelete = (schema: ProfileSchemaInterface, attributeValue: string) => {

        const filteredValues: string[] =
            multiValuedAttributeValues[schema?.name]?.filter((value: string) => value !== attributeValue) || [];

        setMultiValuedAttributeValues((prevValues: Record<string, string[]>) => ({
            ...prevValues,
            [schema.name]: filteredValues
        }));

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            if (primaryValues[EMAIL_ATTRIBUTE] === attributeValue) {
                setPrimaryValues({
                    ...primaryValues,
                    [EMAIL_ATTRIBUTE]: ""
                });
            }
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            if (primaryValues[MOBILE_ATTRIBUTE] === attributeValue) {
                setPrimaryValues({
                    ...primaryValues,
                    [MOBILE_ATTRIBUTE]: ""
                });
            }
        }

        setIsFormStale(true);
    };

    /**
     * Verify an email address or mobile number.
     *
     * @param schema - Schema of the attribute
     * @param attributeValue - Value of the attribute
     */
    const handleVerify = (schema: ProfileSchemaInterface, attributeValue: string) => {
        setIsUpdating(true);
        const data: PatchOperationRequest<PatchUserOperationValue> = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };
        let translationKey: string = "";

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            translationKey = "user:profile.notifications.verifyEmail.";
            const verifiedEmailList: string[] = flattenedProfileData?.get(ProfileConstants.SCIM2_SCHEMA_DICTIONARY.
                get("VERIFIED_EMAIL_ADDRESSES"))?.split(",") || [];

            verifiedEmailList.push(attributeValue);
            data.Operations[0].value = {
                [schema.schemaId]: {
                    [VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE]:
                        verifiedEmailList
                }
            };
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            translationKey = "user:profile.notifications.verifyMobile.";
            const verifiedMobileList: string[] = flattenedProfileData?.get(ProfileConstants.SCIM2_SCHEMA_DICTIONARY.
                get("VERIFIED_MOBILE_NUMBERS"))?.split(",") || [];

            verifiedMobileList.push(attributeValue);
            data.Operations[0].value = {
                [schema.schemaId]: {
                    [VERIFIED_MOBILE_NUMBERS_ATTRIBUTE]:
                        verifiedMobileList
                }
            };
        }

        setIsUpdating(true);

        updateUserInfo(profileData.id, data)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        `${translationKey}success.description`
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        `${translationKey}success.message`
                    )
                }));

                onUserUpdate(profileData.id);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail || error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.detail || error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: `${translationKey}error.message`
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t(`${translationKey}genericError.description`),
                    level: AlertLevels.ERROR,
                    message: t(`${translationKey}genericError.message`)
                }));
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    /**
     * Assign primary email address or mobile number the multi-valued attribute.
     *
     * @param schemaName - Name of the primary attribute schema.
     * @param attributeValue - Value of the attribute
     */
    const handleMakePrimary = (schemaName: string, attributeValue: string) => {

        setPrimaryValues({
            ...primaryValues,
            [schemaName]: attributeValue
        });
        setIsFormStale(true);
    };

    /**
     * Handle the add multi-valued attribute item.
     *
     * @param schema - Schema of the attribute
     * @param attributeValue - Value of the attribute
     */
    const handleAddMultiValuedItem = (schema: ProfileSchemaInterface, attributeValue: string) => {

        if (isEmpty(attributeValue)) return;

        setMultiValuedAttributeValues((prevValues: Record<string, string[]>) => ({
            ...prevValues,
            [schema.name]: [ ...(multiValuedAttributeValues[schema.name] || []), attributeValue ]
        }));

        const updatePrimaryValue = (primaryKey: string) => {
            if (isEmpty(primaryValues[primaryKey])) {
                setPrimaryValues({
                    ...primaryValues,
                    [primaryKey]: attributeValue
                });
            }
        };

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            updatePrimaryValue(EMAIL_ATTRIBUTE);
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            updatePrimaryValue(MOBILE_ATTRIBUTE);
        }
        setIsFormStale(true);
    };

    const generatePendingVerificationTooltip = (): JSX.Element => {
        return (
            <div
                className="verification-pending-icon"
                data-componentid={ `${componentId}-profile-form-email-pending-verification-icon` }
            >
                <Popup
                    name="pending-verification-popup"
                    size="tiny"
                    trigger={
                        (
                            <Icon
                                name="info circle"
                                color="yellow"
                            />
                        )
                    }
                    header= { t("user:profile.tooltips.confirmationPending") }
                    inverted
                />
            </div>
        );
    };

    const resolveMultiValuedAttributesFormField = (
        schema: ProfileSchemaInterface,
        fieldName: string,
        key: number
    ): ReactElement => {
        let attributeValueList: string[] = [];
        let verifiedAttributeValueList: string[] = [];
        let primaryAttributeValue: string = "";
        let fetchedPrimaryAttributeValue: string = "";
        let verificationEnabled: boolean = false;
        let primaryAttributeSchema: ProfileSchemaInterface;
        let maxAllowedLimit: number = 0;
        let verificationPendingValue: string = "";
        let primaryVerified: boolean = false;

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            attributeValueList = multiValuedAttributeValues[EMAIL_ADDRESSES_ATTRIBUTE] ?? [];
            verifiedAttributeValueList = flattenedProfileData
                ?.get(VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
            primaryAttributeValue = primaryValues[EMAIL_ATTRIBUTE];
            fetchedPrimaryAttributeValue = flattenedProfileData?.get(EMAIL_ATTRIBUTE);
            verificationEnabled = accountConfigSettings?.isEmailVerificationEnabled === "true";
            primaryAttributeSchema = profileSchema.find((schema: ProfileSchemaInterface) =>
                schema.name === EMAIL_ATTRIBUTE);
            maxAllowedLimit = ProfileConstants.MAX_EMAIL_ADDRESSES_ALLOWED;
            verificationPendingValue = getVerificationPendingAttributeValue(EMAIL_ADDRESSES_ATTRIBUTE);
            primaryVerified = profileData[userExtensionConfig.userProfileSchema]
                ?.[PRIMARY_EMAIL_VERIFIED_ATTRIBUTE] === true ||
                profileData[userExtensionConfig.userProfileSchema]?.[PRIMARY_EMAIL_VERIFIED_ATTRIBUTE] === "true";

        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            attributeValueList = multiValuedAttributeValues[MOBILE_NUMBERS_ATTRIBUTE] ?? [];
            verifiedAttributeValueList = flattenedProfileData?.get(VERIFIED_MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
            primaryAttributeValue = primaryValues[MOBILE_ATTRIBUTE];
            fetchedPrimaryAttributeValue = flattenedProfileData?.get(MOBILE_ATTRIBUTE);
            verificationEnabled = accountConfigSettings?.isMobileVerificationEnabled === "true";
            primaryAttributeSchema = profileSchema.find((schema: ProfileSchemaInterface) =>
                schema.name === MOBILE_ATTRIBUTE);
            maxAllowedLimit = ProfileConstants.MAX_MOBILE_NUMBERS_ALLOWED;
            verificationPendingValue = getVerificationPendingAttributeValue(MOBILE_NUMBERS_ATTRIBUTE);
            primaryVerified = profileData[userExtensionConfig.userProfileSchema]
                ?.[PRIMARY_MOBILE_VERIFIED_ATTRIBUTE] === true ||
                profileData[userExtensionConfig.userProfileSchema]?.[PRIMARY_MOBILE_VERIFIED_ATTRIBUTE] === "true";

        } else {
            attributeValueList = multiValuedAttributeValues[schema.name] ?? [];
            maxAllowedLimit = ProfileConstants.MAX_MULTI_VALUES_ALLOWED;
        }

        const showAccordion: boolean = attributeValueList.length >= 1;
        const isEmailOrMobile: boolean = schema.name === EMAIL_ADDRESSES_ATTRIBUTE
            || schema.name === MOBILE_NUMBERS_ATTRIBUTE;

        const showVerifiedPopup = (value: string): boolean => {
            const isPrimaryAndVerified: boolean = value === fetchedPrimaryAttributeValue && primaryVerified;

            return isEmailOrMobile && verificationEnabled &&
                (verifiedAttributeValueList.includes(value) || isPrimaryAndVerified);
        };

        const showPrimaryPopup = (value: string): boolean => {
            if (!isEmailOrMobile) {
                return false;
            }

            const isFetchedPrimary : boolean = value === fetchedPrimaryAttributeValue;
            const isCurrentPrimary : boolean = value === primaryAttributeValue;
            const isVerified : boolean =
                !verificationEnabled ||                       // verification disabled → treat as verified.
                verifiedAttributeValueList.includes(value) || // explicitly verified via list.
                (isFetchedPrimary && primaryVerified);        // legacy single‑value flow

            /* ───────── SINGLE VALUE ─────────
            * Show the popup if that lone value is either:
            *   • already stored as primary in the database, OR
            *   • the user later set as primary while it is verified.
            */
            if (attributeValueList.length === 1) {
                return isFetchedPrimary || (isCurrentPrimary && isVerified);
            }

            /* ───── MULTIPLE VALUES ─────
            * Show the popup on exactly one row — the one that is the
            * current primary *and* meets at least ONE of these:
            *   • it is verified, OR
            *   • the database has flagged it as primary.
            */
            return isCurrentPrimary && (isVerified || isFetchedPrimary);
        };

        const showPendingVerificationPopup = (value: string): boolean => {
            return isEmailOrMobile && verificationEnabled
                && !isEmpty(verificationPendingValue)
                && !verifiedAttributeValueList.includes(value)
                && verificationPendingValue === value;
        };

        const showMakePrimaryButton = (value: string): boolean => {
            const isPrimaryAndVerified: boolean = value === fetchedPrimaryAttributeValue && primaryVerified;

            if (!isEmailOrMobile) {
                return false;
            }
            if (verificationEnabled) {
                return (verifiedAttributeValueList.includes(value) || isPrimaryAndVerified)
                    && value !== primaryAttributeValue;
            }

            return value !== primaryAttributeValue;
        };

        const showVerifyButton = (value: string): boolean =>
            schema.name === EMAIL_ADDRESSES_ATTRIBUTE
            && verificationEnabled
            && !(verifiedAttributeValueList.includes(value) ||
                (value === fetchedPrimaryAttributeValue && primaryVerified));

        const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;
        const resolvedMultiValueAttributeRequiredValue: boolean
            = schema?.profiles?.console?.required ?? schema.required;
        const sharedProfileValueResolvingMethod: string = schema?.sharedProfileValueResolvingMethod;
        const resolvedPrimarySchemaRequiredValue: boolean
            = primaryAttributeSchema?.profiles?.console?.required ?? primaryAttributeSchema?.required;
        const resolvedRequiredValue: boolean = (resolvedMultiValueAttributeRequiredValue
            || resolvedPrimarySchemaRequiredValue);

        const showDeleteButton = (value: string): boolean => {
            return !(value === primaryAttributeValue && resolvedPrimarySchemaRequiredValue);
        };

        return (
            <div key={ key }>
                <Field
                    action={ {
                        icon: "plus",
                        onClick: (event: React.MouseEvent) => {
                            event.preventDefault();
                            const value: string = multiValuedInputFieldValue[schema.name];

                            if (isMultiValuedItemInvalid[schema.name] || isEmpty(value)
                                || multiValuedAttributeValues[schema.name]?.includes(value)
                            ) return;
                            handleAddMultiValuedItem(schema, value);
                            setMultiValuedInputFieldValue({
                                ...multiValuedInputFieldValue,
                                [schema.name]: ""
                            });
                        }
                    } }
                    disabled={ isUpdating
                        || isReadOnly
                        || multiValuedAttributeValues[schema?.name]?.length >= maxAllowedLimit
                    }
                    data-testid={ `${ componentId }-profile-form-${ schema.name }-input` }
                    name={ schema.name }
                    label={ schema.name === "profileUrl" ? "Profile Image URL" :
                        (  (!commonExtensionConfig.userEditSection.showEmail && schema.name === "userName")
                            ? fieldName +" (Email)"
                            : fieldName
                        )
                    }
                    placeholder={ "Enter your" + " " + fieldName }
                    type="text"
                    value={ multiValuedInputFieldValue[schema.name] }
                    readOnly={ (isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod == SharedProfileValueResolvingMethod.FROM_ORIGIN)
                        || isReadOnly
                        || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                    }
                    required={ !(isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod == SharedProfileValueResolvingMethod.FROM_ORIGIN)
                       && resolvedRequiredValue && isEmpty(multiValuedAttributeValues[schema?.name]) }
                    requiredErrorMessage={ t("user:profile.forms.generic.inputs.validations.empty", { fieldName }) }
                    validation={ (value: string, validation: Validation) => {
                        if (isEmpty(value) && resolvedRequiredValue
                            && isEmpty(multiValuedAttributeValues[schema?.name])) {
                            setIsMultiValuedItemInvalid({
                                ...isMultiValuedItemInvalid,
                                [schema.name]: true
                            });
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("user:profile.forms.generic.inputs.validations.empty", { fieldName }));
                        }

                        if (!RegExp(primaryAttributeSchema?.regEx).test(value)) {
                            setIsMultiValuedItemInvalid({
                                ...isMultiValuedItemInvalid,
                                [schema.name]: true
                            });
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("users:forms.validation.formatError", {
                                    field: fieldName
                                }));
                        } else {
                            setIsMultiValuedItemInvalid({
                                ...isMultiValuedItemInvalid,
                                [schema.name]: false
                            });
                        }
                    } }
                    displayErrorOn="blur"
                    listen={ (values: ProfileInfoInterface) => {
                        setMultiValuedInputFieldValue({
                            ...multiValuedInputFieldValue,
                            [schema.name]: values.get(schema.name)
                        });
                    } }
                    maxLength={
                        fieldName.toLowerCase().includes("uri") || fieldName.toLowerCase().includes("url")
                            ? ProfileConstants.URI_CLAIM_VALUE_MAX_LENGTH
                            : (
                                schema.maxLength
                                    ? schema.maxLength
                                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                            )
                    }
                    controlled
                />
                <div hidden={ !showAccordion }>
                    <TableContainer
                        component={ Paper }
                        elevation={ 0 }
                        data-componentid={ `${componentId}-profile-form-${schema.name}-accordion` }
                    >
                        <Table
                            className="multi-value-table"
                            size="small"
                            aria-label="multi-attribute value table"
                        >
                            <TableBody>
                                { multiValuedAttributeValues[schema?.name]?.map(
                                    (value: string, index: number) => (
                                        <TableRow key={ index } className="multi-value-table-data-row">
                                            <TableCell align="left">
                                                <div className="table-c1">
                                                    <label
                                                        className="c1-value"
                                                        data-componentid={
                                                            `${componentId}-profile-form-${schema.name}` +
                                                                    `-value-${index}`
                                                        }
                                                    >
                                                        { value }
                                                    </label>
                                                    {
                                                        showVerifiedPopup(value)
                                                                && (
                                                                    <div
                                                                        className="verified-icon"
                                                                        data-componentid={
                                                                            `${componentId}-profile-form-${
                                                                                schema.name}` +
                                                                            `-verified-icon-${index}`
                                                                        }
                                                                    >
                                                                        <Popup
                                                                            name="verified-popup"
                                                                            size="tiny"
                                                                            trigger={
                                                                                (
                                                                                    <Icon
                                                                                        name="check"
                                                                                        color="green"
                                                                                    />
                                                                                )
                                                                            }
                                                                            header= { t("common:verified") }
                                                                            inverted
                                                                        />
                                                                    </div>
                                                                )
                                                    }
                                                    {
                                                        showPrimaryPopup(value)
                                                                && (
                                                                    <div
                                                                        data-componentid={
                                                                            `${componentId}-profile-form-${
                                                                                schema.name}` +
                                                                            `-primary-icon-${index}`
                                                                        }
                                                                    >
                                                                        <Chip
                                                                            label={ t("common:primary") }
                                                                            size="medium"
                                                                        />
                                                                    </div>
                                                                )
                                                    }
                                                    {
                                                        showPendingVerificationPopup(value)
                                                            && (
                                                                <div
                                                                    className="verified-icon"
                                                                    data-componentid={
                                                                        `${componentId}-profile-form-${schema.name}` +
                                                                        `-pending-verification-icon-${index}`
                                                                    }
                                                                >
                                                                    <Popup
                                                                        name="pending-verification-popup"
                                                                        size="tiny"
                                                                        trigger={
                                                                            (
                                                                                <Icon
                                                                                    name="info circle"
                                                                                    color="yellow"
                                                                                />
                                                                            )
                                                                        }
                                                                        header= { t("user:profile.tooltips." +
                                                                            "confirmationPending") }
                                                                        inverted
                                                                    />
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">
                                                <div className="table-c2">
                                                    { showVerifyButton(value) && (
                                                        <OxygenButton
                                                            variant="text"
                                                            size="small"
                                                            className="text-btn"
                                                            onClick={ () => handleVerify(schema, value) }
                                                            data-componentid={
                                                                `${componentId}-profile-form` +
                                                                        `-${schema.name}-verify-button-${index}`
                                                            }
                                                            disabled={ isUpdating || isReadOnly }
                                                        >
                                                            { t("common:verify") }
                                                        </OxygenButton>
                                                    ) }
                                                    { showMakePrimaryButton(value) && (
                                                        <OxygenButton
                                                            variant="text"
                                                            size="small"
                                                            className="text-btn"
                                                            onClick={ () =>
                                                                handleMakePrimary(primaryAttributeSchema?.name, value)
                                                            }
                                                            data-componentid={
                                                                `${componentId}-profile-form` +
                                                                        `-${schema.name}-make-primary-button-${index}`
                                                            }
                                                            disabled={ isUpdating || isReadOnly }
                                                        >
                                                            { t("common:makePrimary") }
                                                        </OxygenButton>
                                                    ) }
                                                    <IconButton
                                                        size="small"
                                                        hidden={ !showDeleteButton(value) }
                                                        onClick={ () => {
                                                            handleMultiValuedItemDelete(schema, value);
                                                        } }
                                                        data-componentid={
                                                            `${componentId}-profile-form` +
                                                                    `-${schema.name}-delete-button-${index}`
                                                        }
                                                        disabled={ isUpdating || isReadOnly }
                                                    >
                                                        <Popup
                                                            trigger={ (
                                                                <Icon name="trash alternate" />
                                                            ) }
                                                            header={ t("common:delete") }
                                                            size="tiny"
                                                            inverted
                                                        />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                ) }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        );
    };

    /**
     * This function returns the verification pending attribute value for email and mobile attributes.
     * @param schemaName - Schema name.
     * @returns Verification pending attribute value.
     */
    const getVerificationPendingAttributeValue = (schemaName: string): string | null => {
        if (schemaName === EMAIL_ATTRIBUTE || schemaName === EMAIL_ADDRESSES_ATTRIBUTE) {
            const pendingAttributes: Array<{value: string}> | undefined =
            profileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.["pendingEmails"];

            return Array.isArray(pendingAttributes)
                && pendingAttributes.length > 0
                && pendingAttributes[0]?.value !== undefined
                ? pendingAttributes[0].value
                : null;
        } else if (schemaName === MOBILE_ATTRIBUTE || schemaName === MOBILE_NUMBERS_ATTRIBUTE) {
            return !isEmpty(profileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.["pendingMobileNumber"])
                ? profileData[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.["pendingMobileNumber"]
                : null;
        }

        return null;
    };

    /**
     * Handles updating the primary email and mobile values when multiple emails and mobile numbers are enabled.
     *
     * @param values - The Map of form values.
     */
    const handlePrimaryEmailAndMobile = (values: Map<string, string | string[]>): void => {

        const mobileSchema: ProfileSchemaInterface = profileSchema.find(
            (schema: ProfileSchemaInterface) => schema.name === MOBILE_ATTRIBUTE
        );

        if (!isSchemaReadOnly(mobileSchema, isUserManagedByParentOrg)) {
            const tempPrimaryMobile: string = primaryValues[MOBILE_ATTRIBUTE];
            const mobileNumbersInputFieldValue: string = multiValuedInputFieldValue[MOBILE_NUMBERS_ATTRIBUTE];

            if (tempPrimaryMobile !== undefined && tempPrimaryMobile !== null) {
                values.set(MOBILE_ATTRIBUTE, tempPrimaryMobile);
            }

            if (isEmpty(tempPrimaryMobile) && !isEmpty(mobileNumbersInputFieldValue)) {
                values.set(MOBILE_ATTRIBUTE, mobileNumbersInputFieldValue);
            }
        }

        const emailSchema: ProfileSchemaInterface = profileSchema.find(
            (schema: ProfileSchemaInterface) => schema.name === EMAIL_ATTRIBUTE
        );

        if (!isSchemaReadOnly(emailSchema, isUserManagedByParentOrg)) {
            const tempPrimaryEmail: string = primaryValues[EMAIL_ATTRIBUTE] ?? "";
            const emailsInputFieldValue: string = multiValuedInputFieldValue[EMAIL_ADDRESSES_ATTRIBUTE];

            if (tempPrimaryEmail !== undefined && tempPrimaryEmail !== null) {
                values.set(EMAIL_ATTRIBUTE, tempPrimaryEmail);
            }
            if (isEmpty(tempPrimaryEmail) && !isEmpty(emailsInputFieldValue)) {
                values.set(EMAIL_ATTRIBUTE, emailsInputFieldValue);
            }
        }
    };

    const handleVerifiedEmailAddresses = (data: PatchRoleDataInterface): void => {

        const verifiedAttributeSchema: ProfileSchemaInterface | undefined = profileSchema.find(
            (schema: ProfileSchemaInterface) => schema.name === VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE
        );

        if (!isMultipleEmailAndMobileNumberEnabled
            || accountConfigSettings?.isEmailVerificationEnabled !== "true"
            || isSchemaReadOnly(verifiedAttributeSchema, isUserManagedByParentOrg)) return;

        const verifiedAttributeValueList: string[]
            = flattenedProfileData?.get(VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
        const operation: ScimOperationsInterface = constructPatchOperationForMultiValuedVerifiedAttribute({
            primaryValue: flattenedProfileData?.get(EMAIL_ATTRIBUTE),
            valueList: multiValuedAttributeValues[EMAIL_ADDRESSES_ATTRIBUTE],
            verifiedAttributeSchema,
            verifiedValueList: verifiedAttributeValueList
        });

        if (!operation) return;
        data.Operations.push(operation);
    };

    const handleVerifiedMobileNumbers = (data: PatchRoleDataInterface): void => {
        const verifiedAttributeSchema: ProfileSchemaInterface | undefined = profileSchema.find(
            (schema: ProfileSchemaInterface) => schema.name === VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
        );

        if (!isMultipleEmailAndMobileNumberEnabled
            || accountConfigSettings?.isMobileVerificationEnabled !== "true"
            || isSchemaReadOnly(verifiedAttributeSchema, isUserManagedByParentOrg)) return;

        const verifiedAttributeValueList: string[]
            = flattenedProfileData?.get(VERIFIED_MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
        const operation: ScimOperationsInterface = constructPatchOperationForMultiValuedVerifiedAttribute({
            primaryValue: flattenedProfileData?.get(MOBILE_ATTRIBUTE),
            valueList: multiValuedAttributeValues[MOBILE_NUMBERS_ATTRIBUTE],
            verifiedAttributeSchema,
            verifiedValueList: verifiedAttributeValueList
        });

        if (!operation) return;
        data.Operations.push(operation);
    };

    /**
     * Removes the email address from the form values if it is pending verification.
     * This prevents unnecessary retriggering of the verification process.
     * @param values - Form values.
     */
    const handleVerificationPendingEmail = (values: Map<string, string | string[]>): void => {
        if (isMultipleEmailAndMobileNumberEnabled
            || accountConfigSettings?.isEmailVerificationEnabled !== "true"
            || isEmpty(getVerificationPendingAttributeValue(EMAIL_ATTRIBUTE))
            || values.get(EMAIL_ATTRIBUTE) !== getVerificationPendingAttributeValue(EMAIL_ATTRIBUTE)) return;

        values.delete(EMAIL_ATTRIBUTE);
    };

    /**
     * Removes the mobile number from the form values if it is pending verification.
     * This prevents unnecessary retriggering of the verification process.
     * @param values - Form values.
     */
    const handleVerificationPendingMobile = (values: Map<string, string | string[]>): void => {
        if (isMultipleEmailAndMobileNumberEnabled
            || accountConfigSettings?.isMobileVerificationEnabled !== "true"
            || isEmpty(getVerificationPendingAttributeValue(MOBILE_ATTRIBUTE))
            || values.get(MOBILE_ATTRIBUTE) !== getVerificationPendingAttributeValue(MOBILE_ATTRIBUTE)) return;

        values.delete(MOBILE_ATTRIBUTE);
    };

    const resolveFormField = (schema: ProfileSchemaInterface, fieldName: string, key: number): ReactElement => {
        const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;
        const sharedProfileValueResolvingMethod: string = schema?.sharedProfileValueResolvingMethod;
        const resolvedRequiredValue: boolean = resolveRequiredValue(schema, sharedProfileValueResolvingMethod);

        if (schema.type.toUpperCase() === "BOOLEAN") {
            return (
                <Field
                    data-testid={ `${ componentId }-profile-form-${ schema.name }-input` }
                    name={ schema.name }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={ fieldName + " " + "is required" }
                    type="checkbox"
                    value={ flattenedProfileData.get(schema.name) ? [ schema.name ] : [] }
                    children={ [
                        {
                            label: fieldName,
                            value: schema.name
                        }
                    ] }
                    readOnly={ (isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                        || isReadOnly
                        || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                    }
                    key={ key }
                />
            );
        } else if (schema.name === "country") {
            return (
                <Field
                    ref = { onCountryRefChange }
                    data-testid={ `${ componentId }-profile-form-${ schema.name }-input` }
                    name={ schema.name }
                    label={ fieldName }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={ fieldName + " " + "is required" }
                    placeholder={ "Select your" + " " + fieldName }
                    type="dropdown"
                    value={ flattenedProfileData.get(schema.name) }
                    children={ [ {
                        "data-testid": `${ componentId }-profile-form-country-dropdown-empty` as string,
                        key: "empty-country" as string,
                        text: "Select your country" as string,
                        value: "" as string
                    } ].concat(
                        countryList
                            ? countryList.map((list: DropdownItemProps) => {
                                return {
                                    "data-testid": `${ componentId }-profile-form-country-dropdown-` +
                                        list.value as string,
                                    flag: list.flag,
                                    key: list.key as string,
                                    text: list.text as string,
                                    value: list.value as string
                                };
                            })
                            : []
                    ) }
                    key={ key }
                    disabled={ (isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                        || isReadOnly
                        || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                    }
                    readOnly={ (isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                        || isReadOnly
                        || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                    }
                    clearable={ !resolvedRequiredValue }
                    search
                    selection
                    fluid
                />
            );
        } else if (schema?.name === "locale") {
            return (
                <Field
                    data-testid={ `${ componentId }-profile-form-${ schema?.name }-input` }
                    name={ schema?.name }
                    label={ fieldName }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={
                        t("user:profile.forms.generic.inputs.validations.empty", { fieldName })
                    }
                    placeholder={
                        t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName })
                    }
                    type="dropdown"
                    value={
                        normalizeLocaleFormat(flattenedProfileData.get(schema?.name), LocaleJoiningSymbol.HYPHEN, true)
                    }
                    children={ [ {
                        "data-testid": `${ componentId }-profile-form-locale-dropdown-empty` as string,
                        key: "empty-locale" as string,
                        text: t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName }) as string,
                        value: "" as string
                    } ].concat(
                        supportedI18nLanguages
                            ? Object.keys(supportedI18nLanguages).map((key: string) => {
                                return {
                                    "data-testid": `${ componentId }-profile-form-locale-dropdown-`
                                        +  supportedI18nLanguages[key].code as string,
                                    flag: supportedI18nLanguages[key].flag ?? UserManagementConstants.GLOBE,
                                    key: supportedI18nLanguages[key].code as string,
                                    text: supportedI18nLanguages[key].name === UserManagementConstants.GLOBE
                                        ? supportedI18nLanguages[key].code
                                        : `${supportedI18nLanguages[key].name as string},
                                            ${supportedI18nLanguages[key].code as string}`,
                                    value: supportedI18nLanguages[key].code as string
                                };
                            })
                            : []
                    ) }
                    key={ key }
                    disabled={ false }
                    readOnly={ (isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                        || isReadOnly
                        || schema?.mutability === ProfileConstants.READONLY_SCHEMA
                    }
                    clearable={ !resolvedRequiredValue }
                    search
                    selection
                    fluid
                />
            );
        } else if (schema?.extended && schema?.multiValued) {
            return resolveMultiValuedAttributesFormField(schema, fieldName, key);
        } else if (schema?.name === "dateOfBirth") {
            return (
                <Field
                    data-testid={ `${ componentId }-profile-form-${ schema.name }-input` }
                    name={ schema.name }
                    label={ fieldName }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={ fieldName + " is required" }
                    placeholder="YYYY-MM-DD"
                    type="text"
                    value={ flattenedProfileData.get(schema.name) }
                    key={ key }
                    readOnly={ (isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                        || isReadOnly
                        || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                    }
                    validation={ (value: string, validation: Validation) => {
                        if (!RegExp(schema.regEx).test(value)) {
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("users:forms.validation.dateFormatError", {
                                    field: fieldName
                                }));
                        }
                    } }
                    maxLength={ schema.maxLength
                        ? schema.maxLength
                        : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                    }
                />
            );
        } else if (schema?.name === EMAIL_ATTRIBUTE || schema?.name === MOBILE_ATTRIBUTE) {
            let isVerificationPending: boolean = false;
            let initialValue: string = flattenedProfileData.get(schema?.name);

            if (schema?.name === EMAIL_ATTRIBUTE) {
                isVerificationPending = accountConfigSettings?.isEmailVerificationEnabled === "true"
                    && !isEmpty(getVerificationPendingAttributeValue(EMAIL_ATTRIBUTE));
            } else {
                isVerificationPending = accountConfigSettings?.isMobileVerificationEnabled === "true"
                    && !isEmpty(getVerificationPendingAttributeValue(MOBILE_ATTRIBUTE));
            }

            if (isVerificationPending) {
                initialValue = getVerificationPendingAttributeValue(schema?.name);
            }

            return (
                <Field
                    data-testid={ `${componentId}-profile-form-${schema.name}-input` }
                    name={ schema.name }
                    label={ fieldName }
                    icon={ isVerificationPending
                        ? generatePendingVerificationTooltip()
                        : null }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={ fieldName + " is required" }
                    placeholder={ "Enter your " + fieldName }
                    type="text"
                    value={ initialValue }
                    key={ key }
                    disabled={ schema.name === "userName" }
                    readOnly={ (isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                        || isReadOnly
                        || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                    }
                    validation={ (value: string, validation: Validation) => {
                        if (!RegExp(schema.regEx).test(value)) {
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("users:forms.validation.formatError", {
                                    field: fieldName
                                }));
                        }
                    } }
                    maxLength={
                        schema.maxLength
                            ? schema.maxLength
                            : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                    }
                />
            );
        } else {
            return (
                <Field
                    data-testid={ `${ componentId }-profile-form-${ schema.name }-input` }
                    name={ schema.name }
                    label={ schema.name === "profileUrl" ? "Profile Image URL" :
                        (  (!commonExtensionConfig.userEditSection.showEmail && schema.name === "userName")
                            ? fieldName + " (Email)"
                            : fieldName
                        )
                    }
                    required={ resolvedRequiredValue }
                    requiredErrorMessage={ fieldName + " is required" }
                    placeholder={ "Enter your " + fieldName }
                    type="text"
                    value={ flattenedProfileData.get(schema.name) }
                    key={ key }
                    disabled={ schema.name === "userName" }
                    readOnly={ (isUserManagedByParentOrg &&
                        sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                        || isReadOnly
                        || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                    }
                    validation={ (value: string, validation: Validation) => {
                        if (!RegExp(schema.regEx).test(value)) {
                            validation.isValid = false;
                            validation.errorMessages
                                .push(t("users:forms.validation.formatError", {
                                    field: fieldName
                                }));
                        }
                    } }
                    maxLength={
                        fieldName.toLowerCase().includes("uri") || fieldName.toLowerCase().includes("url")
                            ? ProfileConstants.URI_CLAIM_VALUE_MAX_LENGTH
                            : (
                                schema.maxLength
                                    ? schema.maxLength
                                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                            )
                    }
                />
            );
        }
    };

    /**
     * If the profile schema is read only or the user is read only, the profile detail for a profile schema should
     * only be displayed in the form only if there is a value for the schema. This function validates whether the
     * filed should be displayed considering these factors.
     *
     * @param schema - The profile schema to be validated.
     * @returns whether the field for the input schema should be displayed.
     */
    const isFieldDisplayable = (schema: ProfileSchemaInterface): boolean => {
        if (!isMultipleEmailAndMobileNumberEnabled) {
            if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE || schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
                return false;
            }
        }
        const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;

        // If the distinct attribute profiles feature is enabled, check the supportedByDefault flag.
        if (isDistinctAttributeProfilesFeatureEnabled) {
            if (schema?.name === "userName") {
                return true;
            }
            // The global supportedByDefault value is a string. Hence, it needs to be converted to a boolean.
            let resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

            if (schema?.profiles?.console?.supportedByDefault !== undefined) {
                resolveSupportedByDefaultValue = schema?.profiles?.console?.supportedByDefault;
            }

            // If the schema is not supported by default and the value is empty, the field should not be displayed.
            if (!resolveSupportedByDefaultValue) {
                return false;
            }
        }

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE || schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            return !isEmpty(multiValuedAttributeValues[schema.name])
                || (!isReadOnly && resolvedMutabilityValue !== ProfileConstants.READONLY_SCHEMA);
        }

        const schemaClaimURI: string = `${schema.schemaId}:${schema.name}`;

        if (duplicatedUserClaims?.some((claim: ExternalClaim) => claim.claimURI === schemaClaimURI)) {
            return false;
        }

        return (!isEmpty(flattenedProfileData.get(schema.name)) ||
            (!isReadOnly && (resolvedMutabilityValue !== ProfileConstants.READONLY_SCHEMA)));
    };

    /**
     * This function generates the user profile details form based on the input Profile Schema
     *
     * @param schema - The profile schema to be used to generate the form.
     * @param key - The key for form field the profile schema.
     * @returns the form field for the profile schema.
     */
    const generateProfileEditForm = (schema: ProfileSchemaInterface, key: number): JSX.Element => {
        // Hide the email and mobile number fields when the multi-valued email and mobile config is enabled.
        const fieldsToHide: string[] = [
            isMultipleEmailAndMobileNumberEnabled
                ? EMAIL_ATTRIBUTE
                : EMAIL_ADDRESSES_ATTRIBUTE,
            isMultipleEmailAndMobileNumberEnabled
                ? MOBILE_ATTRIBUTE
                : MOBILE_NUMBERS_ATTRIBUTE,
            VERIFIED_MOBILE_NUMBERS_ATTRIBUTE,
            VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE
        ];

        if (fieldsToHide.some((name: string) => schema.name === name)) {
            return;
        }

        if (!commonExtensionConfig.userEditSection.showEmail && schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            return;
        }

        const fieldName: string = t("user:profile.fields." +
            schema.name.replace(".", "_"), { defaultValue: schema.displayName }
        );

        const domainName: string[] = flattenedProfileData?.get(schema.name)?.toString().split("/");
        const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;
        const resolvedRequiredValue: boolean = schema?.profiles?.console?.required ?? schema.required;

        return (
            <Grid.Row columns={ 1 } key={ key }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    {
                        schema.name === "userName" && domainName.length > 1 ? (
                            <>
                                {
                                    adminUserType === "internal" ? (
                                        <Form.Field>
                                            <label>
                                                { !commonExtensionConfig.userEditSection.showEmail
                                                    ? fieldName + " (Email)"
                                                    : fieldName
                                                }
                                            </label>
                                            <Input
                                                data-componentId={
                                                    `${ componentId }-profile-form-${ schema.name }-input`
                                                }
                                                name={ schema.name }
                                                required={ resolvedRequiredValue }
                                                requiredErrorMessage={ fieldName + " " + "is required" }
                                                placeholder={ "Enter your" + " " + fieldName }
                                                type="text"
                                                value={ domainName[1] }
                                                key={ key }
                                                readOnly
                                                maxLength={
                                                    schema.maxLength
                                                        ? schema.maxLength
                                                        : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                                                }
                                            />
                                        </Form.Field>
                                    ) : (
                                        <Form.Field>
                                            <label>
                                                { !commonExtensionConfig.userEditSection.showEmail
                                                    ? fieldName + " (Email)"
                                                    : fieldName
                                                }
                                            </label>
                                            <Input
                                                data-componentId={
                                                    `${ componentId }-profile-form-${ schema.name }-input`
                                                }
                                                name={ schema.name }
                                                label={ domainName[0] + " / " }
                                                required={ resolvedRequiredValue }
                                                requiredErrorMessage={ fieldName + " " + "is required" }
                                                placeholder={ "Enter your" + " " + fieldName }
                                                type="text"
                                                value={ domainName[1] }
                                                key={ key }
                                                readOnly={ isReadOnly ||
                                                    resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA }
                                                maxLength={
                                                    schema.maxLength
                                                        ? schema.maxLength
                                                        : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                                                }
                                            />
                                        </Form.Field>
                                    )
                                }
                            </>
                        ) : (
                            resolveFormField(schema, fieldName, key)
                        )
                    }
                </Grid.Column>
            </Grid.Row>
        );
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values - submit values.
     */
    const handleSubmit = (values: Map<string, string | string[]>): void => {

        const data: PatchRoleDataInterface = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        let operation: ScimOperationsInterface = {
            op: "replace",
            value: {}
        };

        if (isMultipleEmailAndMobileNumberEnabled) {
            handlePrimaryEmailAndMobile(values);
            handleVerifiedEmailAddresses(data);
            handleVerifiedMobileNumbers(data);
        } else {
            handleVerificationPendingEmail(values);
            handleVerificationPendingMobile(values);
        }

        if (adminUserType === AdminAccountTypes.INTERNAL) {
            profileSchema.forEach((schema: ProfileSchemaInterface) => {
                const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;
                const sharedProfileValueResolvingMethod: string = schema?.sharedProfileValueResolvingMethod;

                if (resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA || (isUserManagedByParentOrg &&
                    sharedProfileValueResolvingMethod == SharedProfileValueResolvingMethod.FROM_ORIGIN)) {
                    return;
                }
                if (!isFieldDisplayable(schema)) return;

                let opValue: OperationValueInterface = {};

                const schemaNames: string[] = schema.name.split(".");

                if (schema.name !== "roles.default") {
                    if (values.get(schema.name) !== undefined && values.get(schema.name).toString() !== undefined) {

                        if (ProfileUtils.isMultiValuedSchemaAttribute(profileSchema, schemaNames[0]) ||
                            schemaNames[0] === "phoneNumbers") {

                            const attributeValues: (string | string[] | SchemaAttributeValueInterface)[] = [];
                            const attValues: Map<string, string | string []> = new Map();

                            if (schemaNames.length === 1 || schemaNames.length === 2) {
                                if (schema.extended) {
                                    opValue = {
                                        [schema.schemaId]: constructPatchOpValueForMultiValuedAttribute(
                                            schema.name,
                                            multiValuedAttributeValues[schema.name],
                                            multiValuedInputFieldValue[schema.name]
                                        )
                                    };
                                } else {
                                    // Handle emails and phoneNumbers and their sub attributes.
                                    // Extract the sub attributes from the form values.
                                    for (const value of values.keys()) {
                                        const subAttribute: string[] = value.split(".");

                                        if (subAttribute[0] === schemaNames[0]) {
                                            attValues.set(value, values.get(value));
                                        }
                                    }

                                    for (const [ key, value ] of attValues) {
                                        const attribute: string[] = key.split(".");

                                        if (value && value !== "") {
                                            if (attribute.length === 1) {
                                                attributeValues.push(value);
                                            } else {
                                                attributeValues.push({
                                                    type: attribute[1],
                                                    value: value
                                                });
                                            }
                                        }
                                    }
                                    opValue = {
                                        [schemaNames[0]]: attributeValues
                                    };
                                }
                            }
                        } else {
                            if (schemaNames.length === 1) {
                                if (schema.extended) {
                                    const schemaId: string = schema?.schemaId
                                        ? schema.schemaId
                                        : userExtensionConfig.userProfileSchema;

                                    if (schema.name === "externalId") {
                                        opValue = {
                                            [schemaNames[0]]: values.get(schemaNames[0])
                                        };
                                    } else {
                                        opValue = {
                                            [schemaId]: {
                                                [schemaNames[0]]: schema.type.toUpperCase() === "BOOLEAN" ?
                                                    !!values.get(schema.name)?.includes(schema.name) :
                                                    values.get(schemaNames[0])
                                            }
                                        };
                                    }
                                } else {
                                    opValue = schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                        .get("EMAILS")
                                        ? { emails: [ values.get(schema.name) ] }
                                        : schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                            .get("LOCALE")
                                            ? { [schemaNames[0]]: normalizeLocaleFormat(
                                                values.get(schemaNames[0]) as string,
                                                LocaleJoiningSymbol.UNDERSCORE,
                                                false
                                            ) }
                                            : { [schemaNames[0]]: values.get(schemaNames[0]) };
                                }
                            } else {
                                if (schema.extended && schema.multiValued) {
                                    opValue = {
                                        [schema.schemaId]: {
                                            [schemaNames[0]]: constructPatchOpValueForMultiValuedAttribute(
                                                schemaNames[1],
                                                multiValuedAttributeValues[schema.name],
                                                multiValuedInputFieldValue[schema.name]
                                            )
                                        }
                                    };
                                } else if (schema.extended) {
                                    const schemaId: string = schema?.schemaId
                                        ? schema.schemaId
                                        : userExtensionConfig.userProfileSchema;

                                    opValue = {
                                        [schemaId]: {
                                            [schemaNames[0]]: {
                                                [schemaNames[1]]: schema.type.toUpperCase() === "BOOLEAN" ?
                                                    !!values.get(schema.name)?.includes(schema.name) :
                                                    values.get(schema.name)
                                            }
                                        }
                                    };
                                } else if (schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                    .get("NAME")) {

                                    if (values.get(schema.name) || values.get(schema.name) === "") {
                                        opValue = {
                                            name: { [schemaNames[1]]: values.get(schema.name) }
                                        };
                                    }
                                } else {
                                    if (schemaNames[0].includes("addresses")) {
                                        if (schemaNames[0].split("#").length > 1) {
                                            // Ex: addresses#home
                                            const addressSchema: string = schemaNames[0]?.split("#")[0];
                                            const addressType: string = schemaNames[0]?.split("#")[1];

                                            opValue = {
                                                [addressSchema]: [
                                                    {
                                                        type: addressType,
                                                        [schemaNames[1]]: values.get(schema.name)
                                                    }
                                                ]
                                            };
                                        } else {
                                            opValue = {
                                                [schemaNames[0]]: [
                                                    {
                                                        formatted: values.get(schema.name),
                                                        type: schemaNames[1]
                                                    }
                                                ]
                                            };
                                        }
                                    } else if (schemaNames[0] !== "emails" && schemaNames[0] !== "phoneNumbers") {
                                        opValue = {
                                            [schemaNames[0]]: [
                                                {
                                                    type: schemaNames[1],
                                                    value: schema.type.toUpperCase() === "BOOLEAN" ?
                                                        !!values.get(schema.name)?.includes(schema.name) :
                                                        values.get(schema.name)
                                                }
                                            ]
                                        };
                                    }
                                }
                            }
                        }
                    }
                }

                operation = {
                    op: "replace",
                    value: opValue
                };
                // This is required as the api doesn't support patching the address attributes at the
                // sub attribute level using 'replace' operation.
                if (schemaNames[0].includes("addresses")) {
                    operation.op = "add";
                }
                data.Operations.push(operation);
            });

        } else {
            profileSchema.forEach((schema: ProfileSchemaInterface) => {
                const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;

                if (resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA) {
                    return;
                }

                if (!isFieldDisplayable(schema)) return;

                let opValue: OperationValueInterface = {};

                const schemaNames: string[] = schema.name.split(".");

                if (schema.name !== "roles.default") {
                    if (values.get(schema.name) !== undefined && values.get(schema.name).toString() !== undefined) {
                        if (ProfileUtils.isMultiValuedSchemaAttribute(profileSchema, schemaNames[0]) ||
                            schemaNames[0] === "phoneNumbers") {

                            const attributeValues: (string | string[] | SchemaAttributeValueInterface)[] = [];
                            const attValues: Map<string, string | string []> = new Map();

                            if (schemaNames.length === 1 || schemaNames.length === 2) {

                                if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE
                                    || schema.name == MOBILE_NUMBERS_ATTRIBUTE) {
                                    opValue = {
                                        [schema.schemaId]: constructPatchOpValueForMultiValuedAttribute(
                                            schema.name,
                                            multiValuedAttributeValues[schema.name],
                                            multiValuedInputFieldValue[schema.name]
                                        )
                                    };
                                } else {
                                    // Extract the sub attributes from the form values.
                                    for (const value of values.keys()) {
                                        const subAttribute: string[] = value.split(".");

                                        if (subAttribute[0] === schemaNames[0]) {
                                            attValues.set(value, values.get(value));
                                        }
                                    }

                                    for (const [ key, value ] of attValues) {
                                        const attribute: string[] = key.split(".");

                                        if (value && value !== "") {
                                            if (attribute.length === 1) {
                                                attributeValues.push(value);
                                            } else {
                                                attributeValues.push({
                                                    type: attribute[1],
                                                    value: value
                                                });
                                            }
                                        }
                                    }
                                    opValue = {
                                        [schemaNames[0]]: attributeValues
                                    };
                                }
                            }
                        } else {
                            if (schemaNames.length === 1) {
                                if (schema.extended) {
                                    const schemaId: string = schema?.schemaId
                                        ? schema.schemaId
                                        : userExtensionConfig.userProfileSchema;

                                    opValue = {
                                        [schemaId]: {
                                            [schemaNames[0]]: schema.type.toUpperCase() === "BOOLEAN" ?
                                                !!values.get(schema.name)?.includes(schema.name) :
                                                values.get(schemaNames[0])
                                        }
                                    };
                                } else {
                                    opValue = schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                        .get("EMAILS")
                                        ? { emails: [ values.get(schema.name) ] }
                                        : schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                            .get("LOCALE")
                                            ? { [schemaNames[0]]: normalizeLocaleFormat(
                                                values.get(schemaNames[0]) as string,
                                                LocaleJoiningSymbol.UNDERSCORE,
                                                false
                                            ) }
                                            : { [schemaNames[0]]: values.get(schemaNames[0]) };
                                }
                            } else {
                                if(schema.extended) {
                                    const schemaId: string = schema?.schemaId
                                        ? schema.schemaId
                                        : userExtensionConfig.userProfileSchema;

                                    opValue = {
                                        [schemaId]: {
                                            [schemaNames[0]]: {
                                                [schemaNames[1]]: schema.type.toUpperCase() === "BOOLEAN" ?
                                                    !!values.get(schema.name)?.includes(schema.name) :
                                                    values.get(schema.name)
                                            }
                                        }
                                    };
                                } else if (schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                    .get("NAME")) {
                                    opValue = {
                                        name: { [schemaNames[1]]: values.get(schema.name) }
                                    };
                                } else {
                                    if (schemaNames[0] === "addresses") {
                                        opValue = {
                                            [schemaNames[0]]: [
                                                {
                                                    formatted: values.get(schema.name),
                                                    type: schemaNames[1]
                                                }
                                            ]
                                        };
                                    } else if (schemaNames[0] !== "emails" && schemaNames[0] !== "phoneNumbers") {
                                        opValue = {
                                            [schemaNames[0]]: [
                                                {
                                                    type: schemaNames[1],
                                                    value: schema.type.toUpperCase() === "BOOLEAN" ?
                                                        !!values.get(schema.name)?.includes(schema.name) :
                                                        values.get(schema.name)
                                                }
                                            ]
                                        };
                                    }
                                }
                            }
                        }
                    }
                }

                operation = {
                    op: "replace",
                    value: opValue
                };
                // This is required as the api doesn't support patching the address attributes at the
                // sub attribute level using 'replace' operation.
                if (schemaNames[0] === "addresses") {
                    operation.op = "add";
                }
                data.Operations.push(operation);
            });
        }

        setIsUpdating(true);

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

                onUpdate(profileData.id);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail || error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.detail || error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t("user:profile.notifications.updateProfileInfo." +
                            "error.message")
                    }));

                    return;
                }

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

    return (
        <Forms
            data-testid={ `${ componentId }-form` }
            onSubmit={ (values: Map<string, string | string[]>) => handleSubmit(values) }
            onStaleChange={ (stale: boolean) => setIsFormStale(stale) }
        >
            <Grid className="user-profile-form form-container with-max-width">
                {
                    profileData.id && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Form.Field>
                                    <label>
                                        { t("user:profile.fields.userId") }
                                    </label>
                                    <Input
                                        name="userID"
                                        type="text"
                                        value={ profileData.id }
                                        readOnly={ true }
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    profileSchema
                    && profileSchema.map((schema: ProfileSchemaInterface, index: number) => {
                        if (!(schema.name === ProfileConstants?.
                            SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT")
                            || schema.name === ProfileConstants?.
                                SCIM2_SCHEMA_DICTIONARY.get("ACTIVE")
                            || schema.name === ProfileConstants?.
                                SCIM2_SCHEMA_DICTIONARY.get("GROUPS")
                            || schema.name === ProfileConstants?.
                                SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL")
                            || schema.name === ProfileConstants?.
                                SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                            || schema.name === ProfileConstants?.
                                SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED")
                            || schema.name === ProfileConstants?.
                                SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD")
                            || (!commonExtensionConfig.userEditSection.showEmail &&
                                schema.name === ProfileConstants?.
                                    SCIM2_SCHEMA_DICTIONARY.get("EMAILS")))
                            && isFieldDisplayable(schema)) {
                            return (
                                generateProfileEditForm(schema, index)
                            );
                        }
                    })
                }
                {
                    oneTimePassword && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field
                                    data-testid={ `${ componentId }-profile-form-one-time-pw }
                                    -input` }
                                    name="oneTimePassword"
                                    label={ t("user:profile.fields." +
                                        "oneTimePassword") }
                                    required={ false }
                                    requiredErrorMessage=""
                                    type="text"
                                    hidden={ oneTimePassword === undefined }
                                    value={ oneTimePassword && oneTimePassword }
                                    readOnly={ true }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    createdDate && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Form.Field>
                                    <label>
                                        { t("user:profile.fields." +
                                            "createdDate") }
                                    </label>
                                    <Input
                                        name="createdDate"
                                        type="text"
                                        value={ createdDate ?
                                            moment(createdDate).format("YYYY-MM-DD") : "" }
                                        readOnly={ true }
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    modifiedDate && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Form.Field>
                                    <label>
                                        { t("user:profile.fields.modifiedDate") }
                                    </label>
                                    <Input
                                        name="modifiedDate"
                                        type="text"
                                        value={ modifiedDate ?
                                            moment(modifiedDate).format("YYYY-MM-DD") : "" }
                                        readOnly={ true }
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        {
                            !isReadOnly && (
                                <Button
                                    data-testid={ `${ componentId }-form-update-button` }
                                    primary
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    loading={ isUpdating }
                                    disabled={ isUpdating || !isFormStale }
                                >
                                    { t("common:update") }
                                </Button>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

export default UserProfileForm;
