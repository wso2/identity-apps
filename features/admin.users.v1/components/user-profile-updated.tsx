/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import Button from "@oxygen-ui/react/Button";
import Flag from "@oxygen-ui/react/CountryFlag";
import OxygenGrid from "@oxygen-ui/react/Grid";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { CircleInfoIcon } from "@oxygen-ui/react-icons";
import { Show, useRequiredScopes } from "@wso2is/access-control";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { SCIMConfigs, commonConfig, userConfig } from "@wso2is/admin.extensions.v1";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { searchRoleList, updateRoleDetails } from "@wso2is/admin.roles.v2/api/roles";
import {
    OperationValueInterface,
    PatchRoleDataInterface,
    ScimOperationsInterface,
    SearchRoleInterface
} from "@wso2is/admin.roles.v2/models/roles";
import { ConnectorPropertyInterface, ServerConfigurationsConstants } from "@wso2is/admin.server-configurations.v1";
import { TenantInfo } from "@wso2is/admin.tenants.v1/models/tenant";
import { getAssociationType } from "@wso2is/admin.tenants.v1/utils/tenants";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { getUserNameWithoutDomain, resolveUserstore } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    MultiValueAttributeInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface,
    RolesMemberInterface,
    SharedProfileValueResolvingMethod
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils, ProfileUtils } from "@wso2is/core/utils";
import {
    AutocompleteFieldAdapter,
    FinalForm,
    FinalFormField,
    FormRenderProps,
    TextFieldAdapter
} from "@wso2is/form";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    LinkButton,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider, DropdownItemProps } from "semantic-ui-react";
import { ChangePasswordComponent } from "./user-change-password";
import DynamicTypeFormField from "./user-profile/dynamic-type-form-field";
import MultiValuedFormFields from "./user-profile/multi-valued-form-field";
import { resendCode, updateUserInfo } from "../api";
import {
    ACCOUNT_LOCK_REASON_MAP,
    AccountLockedReason,
    AccountState,
    AdminAccountTypes,
    AttributeDataType,
    CONNECTOR_PROPERTY_TO_CONFIG_STATUS_MAP,
    EMAIL_ADDRESSES_ATTRIBUTE,
    EMAIL_ATTRIBUTE,
    LocaleJoiningSymbol,
    MOBILE_ATTRIBUTE,
    MOBILE_NUMBERS_ATTRIBUTE,
    PASSWORD_RESET_PROPERTIES,
    RECOVERY_SCENARIO_TO_RECOVERY_OPTION_TYPE_MAP,
    RecoveryScenario,
    UserManagementConstants,
    VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE,
    VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
} from "../constants";
import {
    AccountConfigSettingsInterface,
    ResendCodeRequestData,
    SchemaAttributeValueInterface,
    SubValueInterface
} from "../models/user";
import {
    constructPatchOpValueForMultiValuedAttribute,
    constructPatchOperationForMultiValuedVerifiedAttribute,
    flattenValues,
    getDisplayOrder,
    isMultipleEmailsAndMobileNumbersEnabled,
    isSchemaReadOnly,
    normalizeLocaleFormat
} from "../utils/user-management-utils";
import "./legacy-user-profile.scss";

/**
 * Prop types for the basic details component.
 */
interface UserProfilePropsInterface extends IdentifiableComponentInterface {
    /**
     * System admin username
     */
    adminUsername: string;
    /**
     * On alert fired callback.
     */
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
    /**
     * Is the user store readonly.
     */
    isReadOnlyUserStore?: boolean;
    /**
     * Allow if the user is deletable.
     */
    allowDeleteOnly?: boolean;
    /**
     * Password reset connector properties
     */
    connectorProperties: ConnectorPropertyInterface[];
    /**
     * Is read only user stores loading.
     */
    isReadOnlyUserStoresLoading?: boolean;
    /**
     * Tenant admin
     */
    tenantAdmin?: string;
    /**
     * User Disclaimer Message
     */
    editUserDisclaimerMessage?: ReactNode;
    /**
     * Admin user type
     */
    adminUserType?: string;
    /**
     * Is user managed by parent organization.
     */
    isUserManagedByParentOrg?: boolean;
}

/**
 * Basic details component.
 *
 * @param props - Props injected to the basic details component.
 * @returns The react component for the user profile.
 */
export const UserProfileUpdated: FunctionComponent<UserProfilePropsInterface> = (
    props: UserProfilePropsInterface
): ReactElement => {

    const {
        adminUsername,
        onAlertFired,
        user,
        handleUserUpdate,
        isReadOnly,
        allowDeleteOnly,
        connectorProperties,
        isReadOnlyUserStoresLoading,
        isReadOnlyUserStore = false,
        tenantAdmin,
        editUserDisclaimerMessage,
        adminUserType = "None",
        isUserManagedByParentOrg,
        [ "data-componentid" ]: componentId = "user-mgt-user-profile"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.providedUsername);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const currentOrganization: string =  useSelector((state: AppState) => state?.config?.deployment?.tenant);
    const authUserTenants: TenantInfo[] = useSelector((state: AppState) => state?.auth?.tenants);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );
    const userSchemaURI: string = useSelector((state: AppState) => state?.config?.ui?.userSchemaURI);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const hasUsersUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.users?.scopes?.update
    );

    const [ profileInfo, setProfileInfo ] = useState(new Map<string, string>());
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchemaInterface[]>();
    const [ simpleMultiValuedExtendedProfileSchema, setSimpleMultiValuedExtendedProfileSchema ]
        = useState<ProfileSchemaInterface[]>();
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showAdminRevokeConfirmationModal, setShowAdminRevokeConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<ProfileInfoInterface>(undefined);
    const [ editingAttribute, setEditingAttribute ] = useState(undefined);
    const [ showLockDisableConfirmationModal, setShowLockDisableConfirmationModal ] = useState<boolean>(false);
    const [ openChangePasswordModal, setOpenChangePasswordModal ] = useState<boolean>(false);
    const [ configSettings, setConfigSettings ] = useState<AccountConfigSettingsInterface>({
        accountDisable: "false",
        accountLock: "false",
        forcePasswordReset: "false",
        isEmailVerificationEnabled: "false",
        isMobileVerificationByPrivilegeUserEnabled: "false",
        isMobileVerificationEnabled: "false"
    });
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ adminRoleId, setAdminRoleId ] = useState<string>("");
    const [ associationType, setAssociationType ] = useState<string>("");
    const [ multiValuedInputFieldValue, setMultiValuedInputFieldValue ] = useState<Record<string, string>>({});
    const [ multiValuedAttributeValues, setMultiValuedAttributeValues ] =
        useState<Record<string, string[]>>({});
    const [ primaryValues, setPrimaryValues ] = useState<Record<string, string>>({});

    const createdDate: string = user?.meta?.created;
    const modifiedDate: string = user?.meta?.lastModified;
    const accountLocked: boolean = user[userConfig.userProfileSchema]?.accountLocked === "true" ||
        user[userConfig.userProfileSchema]?.accountLocked === true;
    const accountLockedReason: string = user[userConfig.userProfileSchema]?.lockedReason;
    const accountState: string = user[userConfig.userProfileSchema]?.accountState;
    const accountDisabled: boolean = user[userConfig.userProfileSchema]?.accountDisabled === "true" ||
        user[userConfig.userProfileSchema]?.accountDisabled === true;
    const oneTimePassword: string = user[userConfig.userProfileSchema]?.oneTimePassword;
    const isCurrentUserAdmin: boolean = user?.roles?.some((role: RolesMemberInterface) =>
        role.display === administratorConfig.adminRoleName) ?? false;
    const isDistinctAttributeProfilesDisabled: boolean = featureConfig?.attributeDialects?.disabledFeatures?.includes(
        ClaimManagementConstants.DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG
    );

    const isMultipleEmailAndMobileNumberEnabled: boolean = useMemo(() => {
        return isMultipleEmailsAndMobileNumbersEnabled(profileInfo, profileSchema);
    }, [ profileSchema, profileInfo ]);

    const countryList: DropdownItemProps[] = useMemo(() => CommonUtils.getCountryList(), []);

    const supportedI18nLanguagesArray: DropdownItemProps[] = useMemo(() => {
        return supportedI18nLanguages
            ? Object.keys(supportedI18nLanguages).map((key: string) => ({
                "data-componentId": `${ componentId }-profile-form-locale-dropdown-${
                    supportedI18nLanguages[key].code }`,
                flag: supportedI18nLanguages[key].flag ?? UserManagementConstants.GLOBE,
                key: supportedI18nLanguages[key].code,
                text:
                    supportedI18nLanguages[key].name === UserManagementConstants.GLOBE
                        ? supportedI18nLanguages[key].code
                        : `${supportedI18nLanguages[key].name}, ${supportedI18nLanguages[key].code}`,
                value: supportedI18nLanguages[key].code
            }))
            : [];
    }, [ supportedI18nLanguages ]);

    const hiddenSchemas: string[] = [
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ROLES_DEFAULT"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACTIVE"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("GROUPS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PROFILE_URL"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_DISABLED"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ONETIME_PASSWORD"),
        !commonConfig.userEditSection.showEmail && ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS")
    ];

    useEffect(() => {
        if (connectorProperties && Array.isArray(connectorProperties) && connectorProperties?.length > 0) {

            const accountConfigSettings: AccountConfigSettingsInterface = { ...configSettings } ;

            for (const property of connectorProperties) {
                if (PASSWORD_RESET_PROPERTIES.includes(property.name)) {
                    if (property.value === "true") {
                        accountConfigSettings.forcePasswordReset = property.value;
                    }

                    continue;
                }
                const configKey: string = CONNECTOR_PROPERTY_TO_CONFIG_STATUS_MAP[property.name];

                if (configKey) {
                    accountConfigSettings[configKey] = property.value;
                }
            }
            setConfigSettings(accountConfigSettings);
        }
    }, [ connectorProperties ]);

    /**
     *  .
     */
    useEffect(() => {
        // This will load authenticated user's association type to the current organization.
        setAssociationType(getAssociationType(authUserTenants, currentOrganization));

        if (adminUserType === AdminAccountTypes.INTERNAL && userConfig?.enableAdminPrivilegeRevokeOption) {
            // Admin role ID is only used by internal admins.
            getAdminRoleId();
        }
    }, []);

    /**
     * Sort the elements of the profileSchema state accordingly by the displayOrder attribute in the ascending order.
     */
    useEffect(() => {
        const META_VERSION: string = ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("META_VERSION");
        const filteredSchemas: ProfileSchemaInterface[] = [];
        const simpleMultiValuedExtendedSchemas: ProfileSchemaInterface[] = [];

        for (const schema of ProfileUtils.flattenSchemas([ ...profileSchemas ])) {
            if (schema.name === META_VERSION) {
                continue;
            }
            // Only simple multi-valued attributes in extended schemas are supported generally.
            if (schema.extended && schema.multiValued && schema.type !== AttributeDataType.COMPLEX) {
                simpleMultiValuedExtendedSchemas.push(schema);
            }
            filteredSchemas.push(schema);
        }

        filteredSchemas.sort((a: ProfileSchemaInterface, b: ProfileSchemaInterface) =>
            getDisplayOrder(a) - getDisplayOrder(b));

        setProfileSchema(filteredSchemas);
        setSimpleMultiValuedExtendedProfileSchema(simpleMultiValuedExtendedSchemas);
    }, [ profileSchemas ]);

    useEffect(() => {
        mapUserToSchema(profileSchema, user);
    }, [ profileSchema, user ]);

    /**
     * The following function maps profile details to the SCIM schemas.
     *
     * @param proSchema - ProfileSchema
     * @param userInfo - BasicProfileInterface
     */
    const mapUserToSchema = (proSchema: ProfileSchemaInterface[], userInfo: ProfileInfoInterface): void => {
        if (!isEmpty(profileSchema) && !isEmpty(userInfo)) {
            const tempProfileInfo: Map<string, string> = new Map<string, string>();

            if (adminUserType === AdminAccountTypes.INTERNAL) {
                proSchema.forEach((schema: ProfileSchemaInterface) => {
                    const schemaNames: string[] = schema.name.split(".");

                    if (schemaNames.length === 1) {
                        if (schemaNames[0] === "emails") {
                            const emailSchema: string = schemaNames[0];

                            if(ProfileUtils.isStringArray(userInfo[emailSchema])) {
                                const emails: any[] = userInfo[emailSchema];
                                const primaryEmail: string = emails.find((subAttribute: any) =>
                                    typeof subAttribute === "string");

                                // Set the primary email value.
                                tempProfileInfo.set(schema.name, primaryEmail);
                            }
                        } else {
                            const schemaName:string = schemaNames[0];

                            // System Schema
                            if (schema.extended
                                && userInfo[userConfig.userProfileSchema]?.[schemaNames[0]]
                            ) {
                                if (UserManagementConstants.MULTI_VALUED_ATTRIBUTES.includes(schemaNames[0])) {
                                    const attributeValue: string | string[] =
                                        userInfo[userConfig.userProfileSchema]?.[schemaNames[0]];
                                    const formattedValue: string = Array.isArray(attributeValue)
                                        ? attributeValue.join(",")
                                        : "";

                                    tempProfileInfo.set(schema.name, formattedValue);

                                    return;
                                }
                                tempProfileInfo.set(
                                    schema.name, userInfo[userConfig.userProfileSchema][schemaNames[0]]
                                );

                                return;
                            }

                            // Enterprise Schema
                            if (schema.extended
                                && userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaNames[0]]
                            ) {
                                if (schema.multiValued) {
                                    const attributeValue: string | string[] =
                                        userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaNames[0]];
                                    const formattedValue: string = Array.isArray(attributeValue)
                                        ? attributeValue.join(",")
                                        : "";

                                    tempProfileInfo.set(schema.name, formattedValue);

                                    return;
                                }
                                tempProfileInfo.set(
                                    schema.name, userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]]
                                );

                                return;
                            }

                            // Custom Schema
                            if (
                                schema.extended
                                && userInfo?.[userSchemaURI]?.[schemaNames[0]]
                            ) {
                                if (schema.multiValued) {
                                    const attributeValue: string | string[] = userInfo[userSchemaURI]?.[schemaNames[0]];
                                    const formattedValue: string = Array.isArray(attributeValue)
                                        ? attributeValue.join(",")
                                        : "";

                                    tempProfileInfo.set(schema.name, formattedValue);

                                    return;
                                }
                                tempProfileInfo.set(
                                    schema.name, userInfo[userSchemaURI][schemaNames[0]]
                                );

                                return;
                            }
                            tempProfileInfo.set(schema.name, userInfo[schemaName]);
                        }
                    } else {
                        if (schemaNames[0] === "name") {
                            const nameSchema: string = schemaNames[0];
                            const givenNameSchema: string = schemaNames[1];

                            givenNameSchema && userInfo[nameSchema] &&
                                userInfo[nameSchema][givenNameSchema] && (
                                tempProfileInfo.set(schema.name, userInfo[nameSchema][givenNameSchema])
                            );
                        } else {
                            const schemaName: string = schemaNames[0];
                            const schemaSecondaryProperty: string = schemaNames[1];

                            const userProfileSchema: string = userInfo
                                ?.[userConfig.userProfileSchema]?.[schemaName]
                                ?.[schemaSecondaryProperty];

                            const enterpriseSchema: string = userInfo
                                ?.[ProfileConstants.SCIM2_ENT_USER_SCHEMA]?.[schemaName]
                                ?.[schemaSecondaryProperty];

                            const customSchema: string = userInfo
                                ?.[userSchemaURI]?.[schemaName]
                                ?.[schemaSecondaryProperty];

                            if (schema.extended && (userProfileSchema || enterpriseSchema || customSchema)) {
                                if (userProfileSchema) {
                                    tempProfileInfo.set(schema.name, userProfileSchema);
                                } else if (enterpriseSchema && schema.multiValued) {
                                    tempProfileInfo.set(schema.name,
                                        Array.isArray(enterpriseSchema) ? enterpriseSchema.join(",") : "");
                                } else if (enterpriseSchema) {
                                    tempProfileInfo.set(schema.name, enterpriseSchema);
                                } else if (customSchema && schema.multiValued) {
                                    tempProfileInfo.set(schema.name,
                                        Array.isArray(customSchema) ? customSchema.join(",") : "");
                                } else if (customSchema) {
                                    tempProfileInfo.set(schema.name, customSchema);
                                }
                            } else {
                                const subValue: SubValueInterface = userInfo[schemaName] &&
                                    Array.isArray(userInfo[schemaName]) &&
                                    userInfo[schemaName]
                                        .find((subAttribute: MultiValueAttributeInterface) =>
                                            subAttribute.type === schemaSecondaryProperty);

                                if (schemaName.includes("addresses")) {
                                    // Ex: addresses#home.streetAddress
                                    const addressSubSchema: string = schema?.name?.split(".")[1];
                                    const addressSchemaArray: string[] = schemaName?.split("#");

                                    if (addressSchemaArray.length > 1) {
                                        // Ex: addresses#home
                                        const addressSchema: string = addressSchemaArray[0];
                                        const addressType: string = addressSchemaArray[1];

                                        const subValue: SubValueInterface = userInfo[addressSchema] &&
                                            Array.isArray(userInfo[addressSchema]) &&
                                            userInfo[addressSchema]
                                                .find((subAttribute: MultiValueAttributeInterface) =>
                                                    subAttribute.type === addressType);

                                        tempProfileInfo.set(
                                            schema.name,
                                            (subValue && subValue[addressSubSchema]) ? subValue[addressSubSchema] : ""
                                        );
                                    } else {
                                        tempProfileInfo.set(
                                            schema.name,
                                            subValue ? subValue.formatted : ""
                                        );
                                    }
                                } else {
                                    tempProfileInfo.set(
                                        schema.name,
                                        subValue ? subValue.value : ""
                                    );
                                }
                            }
                        }
                    }
                });
            } else {
                proSchema.forEach((schema: ProfileSchemaInterface) => {
                    const schemaNames: string[] = schema.name.split(".");

                    if (schemaNames.length === 1) {
                        if (schemaNames[0] === "emails") {
                            const emailSchema: string = schemaNames[0];

                            if(ProfileUtils.isStringArray(userInfo[emailSchema])) {
                                const emails: string[] | MultiValueAttributeInterface[] = userInfo[emailSchema];
                                const primaryEmail: string = (emails as string[]).find((subAttribute: string) => {
                                    return typeof subAttribute === "string";
                                });

                                // Set the primary email value.
                                tempProfileInfo.set(schema.name, primaryEmail);
                            }
                        } else {
                            const schemaName:string = schemaNames[0];

                            if (schema.extended && userInfo[userConfig.userProfileSchema]
                                && userInfo[userConfig.userProfileSchema][schemaNames[0]]) {
                                if (UserManagementConstants.MULTI_VALUED_ATTRIBUTES.includes(schemaNames[0])) {
                                    const attributeValue: string | string[] =
                                        userInfo[userConfig.userProfileSchema]?.[schemaNames[0]];
                                    const formattedValue: string = Array.isArray(attributeValue)
                                        ? attributeValue.join(",")
                                        : "";

                                    tempProfileInfo.set(schema.name, formattedValue);

                                    return;
                                }
                                tempProfileInfo.set(
                                    schema.name, userInfo[userConfig.userProfileSchema][schemaNames[0]]
                                );

                                return;
                            }

                            if (schema.extended && userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]
                                && userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]]) {
                                tempProfileInfo.set(
                                    schema.name, userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaNames[0]]
                                );

                                return;
                            }

                            if (
                                schema.extended
                                && userInfo?.[userSchemaURI]?.[schemaNames[0]]
                            ) {
                                if (UserManagementConstants.MULTI_VALUED_ATTRIBUTES.includes(schemaNames[0])) {
                                    const attributeValue: string | string[] =
                                        userInfo[userSchemaURI]?.[schemaNames[0]];
                                    const formattedValue: string = Array.isArray(attributeValue)
                                        ? attributeValue.join(",")
                                        : "";

                                    tempProfileInfo.set(schema.name, formattedValue);

                                    return;
                                }
                                tempProfileInfo.set(
                                    schema.name, userInfo[userSchemaURI][schemaNames[0]]
                                );

                                return;
                            }
                            tempProfileInfo.set(schema.name, userInfo[schemaName]);
                        }
                    } else {
                        if (schemaNames[0] === "name") {
                            const nameSchema: string = schemaNames[0];
                            const givenNameSchema: string = schemaNames[1];

                            givenNameSchema && userInfo[nameSchema] &&
                                userInfo[nameSchema][givenNameSchema] && (
                                tempProfileInfo.set(schema.name, userInfo[nameSchema][givenNameSchema])
                            );
                        } else {
                            const schemaName: string = schemaNames[0];
                            const schemaSecondaryProperty: string = schemaNames[1];

                            if (schema.extended && userInfo[userConfig.userProfileSchema]) {
                                schemaName && schemaSecondaryProperty &&
                                    userInfo[userConfig.userProfileSchema][schemaName] &&
                                    userInfo[userConfig.userProfileSchema][schemaName][schemaSecondaryProperty] && (
                                    tempProfileInfo.set(schema.name,
                                        userInfo[userConfig.userProfileSchema][schemaName][schemaSecondaryProperty])
                                );
                            } else if (schema.extended && userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA]
                                && userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA][schemaName]) {
                                const enterpriseUserInfo: {[key: string]: any}
                                    = userInfo[ProfileConstants.SCIM2_ENT_USER_SCHEMA];

                                tempProfileInfo.set(
                                    schema.name, enterpriseUserInfo[schemaName][schemaSecondaryProperty]
                                );
                            } else {
                                const subValue: SubValueInterface = userInfo[schemaName] &&
                                    Array.isArray(userInfo[schemaName]) &&
                                    userInfo[schemaName]
                                        .find((subAttribute: MultiValueAttributeInterface) =>
                                            subAttribute.type === schemaSecondaryProperty);

                                if (schemaName === "addresses") {
                                    tempProfileInfo.set(
                                        schema.name,
                                        subValue ? subValue.formatted : ""
                                    );
                                } else {
                                    tempProfileInfo.set(
                                        schema.name,
                                        subValue ? subValue.value : ""
                                    );
                                }
                            }
                        }
                    }
                });
            }

            setProfileInfo(tempProfileInfo);
        }
    };

    useEffect(() => {
        mapMultiValuedAttributeValues(profileInfo);
    }, [ profileInfo ]);

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
     * This function handles deletion of the user.
     *
     * @param deletingUser - user object to be deleted.
     */
    const handleUserDelete = (deletingUser: ProfileInfoInterface): void => {
        userConfig.deleteUser(deletingUser)
            .then(() => {
                onAlertFired({
                    description: t(
                        "users:notifications.deleteUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "users:notifications.deleteUser.success.message"
                    )
                });

                if (adminUserType === AdminAccountTypes.EXTERNAL) {
                    history.push(AppConstants.getPaths().get("ADMINISTRATORS"));
                } else {
                    history.push(AppConstants.getPaths().get("USERS"));
                }
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.deleteUser.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("users:notifications.deleteUser.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.deleteUser.genericError" +
                        ".message")
                });
            });
    };

    /**
     * This function returns the username or the default email of the current user (if the username is empty).
     *
     * @param user - user that the username will be extracted from.
     * @param shouldReturnDefaultEmailAsFallback - whether to return the default email address when the username is
     *                                             empty.
     */
    const resolveUsernameOrDefaultEmail = (user: ProfileInfoInterface,
        shouldReturnDefaultEmailAsFallback: boolean): string => {
        let username: string = user?.userName;

        if (username.length === 0 && shouldReturnDefaultEmailAsFallback) {
            return user.email;
        }

        if (username.split("/").length > 1) {
            username = username.split("/")[1];
        }

        return username;
    };

    /**
     * This function returns the ID of the administrator role.
     *
     */
    const getAdminRoleId = () => {
        const searchData: SearchRoleInterface = {
            filter: "displayName eq " + administratorConfig.adminRoleName,
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:SearchRequest" ],
            startIndex: 0
        };

        searchRoleList(searchData)
            .then((response: AxiosResponse) => {
                if (response?.data?.Resources.length > 0) {
                    const adminId: string = response?.data?.Resources[0]?.id;

                    setAdminRoleId(adminId);
                }
            }).catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.getAdminRole.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("users:notifications.getAdminRole." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.getAdminRole.genericError" +
                        ".message")
                }));
            });
    };

    /**
     * This function returns the verification pending attribute value for email and mobile attributes.
     * @param schemaName - Schema name.
     * @returns Verification pending attribute value.
     */
    const getVerificationPendingAttributeValue = (schemaName: string): string | null => {
        if (schemaName === EMAIL_ATTRIBUTE || schemaName === EMAIL_ADDRESSES_ATTRIBUTE) {
            const pendingAttributes: Array<{value: string}> | undefined =
            user[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.["pendingEmails"];

            return Array.isArray(pendingAttributes)
                && pendingAttributes.length > 0
                && pendingAttributes[0]?.value !== undefined
                ? pendingAttributes[0].value
                : null;
        } else if (schemaName === MOBILE_ATTRIBUTE || schemaName === MOBILE_NUMBERS_ATTRIBUTE) {
            return !isEmpty(user[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.["pendingMobileNumber"])
                ? user[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.["pendingMobileNumber"]
                : null;
        }

        return null;
    };

    /**
     * This function handles deletion of the user.
     *
     * @param deletingUser - user object to be revoked their admin permissions.
     */
    const handleUserAdminRevoke = (deletingUser: ProfileInfoInterface): void => {
        // Payload for the update role request.
        const roleData: PatchRoleDataInterface = {
            Operations: [
                {
                    op: "remove",
                    path: `users[display eq ${deletingUser.userName}]`,
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        updateRoleDetails(adminRoleId, roleData)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "users:notifications.revokeAdmin.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "users:notifications.revokeAdmin.success.message"
                    )
                }));
                history.push(AppConstants.getPaths().get("ADMINISTRATORS"));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.revokeAdmin.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("users:notifications.revokeAdmin." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.revokeAdmin.genericError" +
                        ".message")
                }));
            });
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
            || configSettings?.isEmailVerificationEnabled !== "true"
            || isSchemaReadOnly(verifiedAttributeSchema, isUserManagedByParentOrg)) return;

        const verifiedAttributeValueList: string[]
            = profileInfo?.get(VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE)?.split(",") ?? [];
        const operation: ScimOperationsInterface = constructPatchOperationForMultiValuedVerifiedAttribute({
            primaryValue: profileInfo?.get(EMAIL_ATTRIBUTE),
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
            || configSettings?.isMobileVerificationEnabled !== "true"
            || isSchemaReadOnly(verifiedAttributeSchema, isUserManagedByParentOrg)) return;

        const verifiedAttributeValueList: string[]
            = profileInfo?.get(VERIFIED_MOBILE_NUMBERS_ATTRIBUTE)?.split(",") ?? [];
        const operation: ScimOperationsInterface = constructPatchOperationForMultiValuedVerifiedAttribute({
            primaryValue: profileInfo?.get(MOBILE_ATTRIBUTE),
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
            || configSettings?.isEmailVerificationEnabled !== "true"
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
            || configSettings?.isMobileVerificationEnabled !== "true"
            || isEmpty(getVerificationPendingAttributeValue(MOBILE_ATTRIBUTE))
            || values.get(MOBILE_ATTRIBUTE) !== getVerificationPendingAttributeValue(MOBILE_ATTRIBUTE)) return;

        values.delete(MOBILE_ATTRIBUTE);
    };

    /**
     * The following method handles the `onSubmit` event of forms.
     *
     * @param values - submit values.
     */
    const handleSubmit = (formValues: ProfileInfoInterface): void => {

        // Process country and local value before flattening
        const countryValue: DropdownItemProps = formValues["country"];
        const localeValue: DropdownItemProps = formValues["locale"];

        if (!isEmpty(countryValue)) {
            formValues["country"] = countryValue.value;
        }

        if (!isEmpty(localeValue)) {
            formValues["locale"] = localeValue.value;
        }

        const values: Map<string, string> = flattenValues(formValues);

        // Remove userID, createdDate and modifiedDate from the values map
        values.delete("userID");
        values.delete("createdDate");
        values.delete("modifiedDate");
        values.delete("multiValuedStateTracker");

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
                                        : userConfig.userProfileSchema;

                                    if (schema.name === "externalId") {
                                        opValue = {
                                            [schemaNames[0]]: values.get(schemaNames[0])
                                        };
                                    } else {
                                        opValue = {
                                            [schemaId]: {
                                                [schemaNames[0]]: values.get(schemaNames[0])
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
                                                false,
                                                supportedI18nLanguages
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
                                        : userConfig.userProfileSchema;

                                    opValue = {
                                        [schemaId]: {
                                            [schemaNames[0]]: {
                                                [schemaNames[1]]: values.get(schema.name)
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
                                                    value: values.get(schema.name)
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
                                        : userConfig.userProfileSchema;

                                    opValue = {
                                        [schemaId]: {
                                            [schemaNames[0]]: values.get(schemaNames[0])
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
                                                false,
                                                supportedI18nLanguages
                                            ) }
                                            : { [schemaNames[0]]: values.get(schemaNames[0]) };
                                }
                            } else {
                                if(schema.extended) {
                                    const schemaId: string = schema?.schemaId
                                        ? schema.schemaId
                                        : userConfig.userProfileSchema;

                                    opValue = {
                                        [schemaId]: {
                                            [schemaNames[0]]: {
                                                [schemaNames[1]]: values.get(schema.name)
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
                                                    value: values.get(schema.name)
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

        setIsSubmitting(true);

        updateUserInfo(user.id, data)
            .then(() => {
                onAlertFired({
                    description: t(
                        "user:profile.notifications.updateProfileInfo.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "user:profile.notifications.updateProfileInfo.success.message"
                    )
                });

                handleUserUpdate(user.id);
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
                setIsSubmitting(false);
            });
    };

    /**
     * Handle danger zone toggle actions.
     *
     * @param toggleData - danger zone toggle data.
     */
    const handleDangerZoneToggles = (toggleData: CheckboxProps) => {
        setEditingAttribute({
            name: toggleData?.target?.id,
            value: toggleData?.target?.checked
        });

        if(toggleData?.target?.checked) {
            setShowLockDisableConfirmationModal(true);
        } else {
            handleDangerActions(toggleData?.target?.id, toggleData?.target?.checked);
        }
    };

    /**
     * The method handles the locking and disabling of user account.
     */
    const handleDangerActions = (attributeName: string, attributeValue: boolean): void => {
        let data: PatchRoleDataInterface = {
            "Operations": [
                {
                    "op": "replace",
                    "value": {
                        [userConfig.userProfileSchema]: {
                            [attributeName]: attributeValue
                        }
                    }
                }
            ],
            "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        if (adminUserType === "internal") {
            const accountDisabledURI: string = UserManagementConstants.SCIM2_ATTRIBUTES_DICTIONARY
                .get("ACCOUNT_LOCKED");
            const accountLockedURI: string = UserManagementConstants.SCIM2_ATTRIBUTES_DICTIONARY
                .get("ACCOUNT_DISABLED");

            const schemaURI: string = accountDisabledURI?.startsWith(ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA)
                && accountLockedURI?.startsWith(ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA)
                ? ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA
                : userSchemaURI;

            data = {
                "Operations": [
                    {
                        "op": "replace",
                        value: {
                            [schemaURI]: {
                                [attributeName]: attributeValue
                            }
                        }
                    }
                ],
                "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
            };
        }

        updateUserInfo(user.id, data)
            .then(() => {
                onAlertFired({
                    description:
                        attributeName === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                            ? (
                                attributeValue
                                    ? t("user:profile.notifications.lockUserAccount." +
                                        "success.description")
                                    : t("user:profile.notifications.unlockUserAccount." +
                                        "success.description")
                            ) : (
                                attributeValue
                                    ? t("user:profile.notifications.disableUserAccount." +
                                        "success.description")
                                    : t("user:profile.notifications.enableUserAccount." +
                                        "success.description")
                            ),
                    level: AlertLevels.SUCCESS,
                    message:
                        attributeName === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                            ? (
                                attributeValue
                                    ? t("user:profile.notifications.lockUserAccount." +
                                        "success.message", { name: resolveUsernameOrDefaultEmail(user, true) })
                                    : t("user:profile.notifications.unlockUserAccount." +
                                        "success.message", { name: resolveUsernameOrDefaultEmail(user, true) })
                            ) : (
                                attributeValue
                                    ? t("user:profile.notifications.disableUserAccount." +
                                        "success.message", { name: resolveUsernameOrDefaultEmail(user, true) })
                                    : t("user:profile.notifications.enableUserAccount." +
                                        "success.message", { name: resolveUsernameOrDefaultEmail(user, true) })
                            )
                });
                setShowLockDisableConfirmationModal(false);
                handleUserUpdate(user.id);
                setEditingAttribute(undefined);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    onAlertFired({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message:
                            attributeName === UserManagementConstants.SCIM2_ATTRIBUTES_DICTIONARY.get("ACCOUNT_LOCKED")
                                ? t("user:profile.notifications.lockUserAccount.error." +
                                    "message")
                                : t("user:profile.notifications.disableUserAccount.error." +
                                    "message")
                    });

                    return;
                }

                onAlertFired({
                    description:
                        editingAttribute?.name === UserManagementConstants.SCIM2_ATTRIBUTES_DICTIONARY
                            .get("ACCOUNT_LOCKED")
                            ? t("user:profile.notifications.lockUserAccount.genericError." +
                                "description")
                            : t("user:profile.notifications.disableUserAccount.genericError." +
                                "description"),
                    level: AlertLevels.ERROR,
                    message:
                        editingAttribute?.name === UserManagementConstants.SCIM2_ATTRIBUTES_DICTIONARY
                            .get("ACCOUNT_LOCKED")
                            ? t("user:profile.notifications.lockUserAccount.genericError." +
                                "message")
                            : t("user:profile.notifications.disableUserAccount.genericError." +
                                "message")
                });
            });
    };

    const resolveDangerActions = (): ReactElement => {
        if (!hasUsersUpdatePermissions) {
            return null;
        }

        const resolvedUsername: string = resolveUsernameOrDefaultEmail(user, false);
        const isUserCurrentLoggedInUser: boolean =
            authenticatedUser?.includes(resolvedUsername);

        return (
            <>
                {
                    (
                        !isReadOnly
                        || allowDeleteOnly
                        || isUserManagedByParentOrg
                        || user[ SCIMConfigs.scim.systemSchema ]?.userSourceId
                    ) && (
                        !isCurrentUserAdmin
                        || !isUserCurrentLoggedInUser
                    ) ? (
                            <Show
                                when={ featureConfig?.users?.scopes?.delete }
                            >
                                <DangerZoneGroup
                                    sectionHeader={ t("user:editUser.dangerZoneGroup.header") }
                                >
                                    {
                                        (
                                            !isReadOnly &&
                                            !isReadOnlyUserStore &&
                                            !isUserManagedByParentOrg &&
                                            user.userName !== adminUsername
                                        ) ? (
                                                <Show when={ featureConfig?.users?.scopes?.update }>
                                                    { isSetPassword ? (
                                                        <DangerZone
                                                            data-componentId={ `${ componentId }-set-password` }
                                                            actionTitle={ t("user:editUser." +
                                                                "dangerZoneGroup.passwordSetZone.actionTitle") }
                                                            header={ t("user:editUser." +
                                                                "dangerZoneGroup.passwordSetZone.header") }
                                                            subheader={ t("user:editUser." +
                                                                "dangerZoneGroup.passwordSetZone.subheader") }
                                                            onActionClick={ (): void => {
                                                                setOpenChangePasswordModal(true);
                                                            } }
                                                        />
                                                    ) : (
                                                        <DangerZone
                                                            data-componentId={ `${ componentId }-change-password` }
                                                            actionTitle={ t("user:editUser." +
                                                                "dangerZoneGroup.passwordResetZone.actionTitle") }
                                                            header={ t("user:editUser." +
                                                                "dangerZoneGroup.passwordResetZone.header") }
                                                            subheader={ t("user:editUser." +
                                                                "dangerZoneGroup.passwordResetZone.subheader") }
                                                            onActionClick={ (): void => {
                                                                setOpenChangePasswordModal(true);
                                                            } }
                                                            isButtonDisabled={
                                                                accountLocked &&
                                                                accountLockedReason !== AccountLockedReason.
                                                                    PENDING_ADMIN_FORCED_USER_PASSWORD_RESET
                                                            }
                                                            buttonDisableHint={ t("user:editUser." +
                                                                "dangerZoneGroup.passwordResetZone.buttonHint") }
                                                        />
                                                    ) }
                                                </Show>
                                            ) : null
                                    }
                                    {
                                        !allowDeleteOnly && configSettings?.accountDisable === "true" && (
                                            <DangerZone
                                                data-componentId={ `${ componentId }-account-disable-button` }
                                                actionTitle={ t("user:editUser." +
                                                "dangerZoneGroup.disableUserZone.actionTitle") }
                                                header={ t("user:editUser.dangerZoneGroup." +
                                                "disableUserZone.header") }
                                                subheader={ t("user:editUser.dangerZoneGroup." +
                                                "disableUserZone.subheader") }
                                                onActionClick={ undefined }
                                                toggle={ {
                                                    checked: accountDisabled,
                                                    id: "accountDisabled",
                                                    onChange: handleDangerZoneToggles
                                                } }
                                            />
                                        )
                                    }
                                    {
                                        !allowDeleteOnly && !isUserManagedByParentOrg  && (
                                            <DangerZone
                                                data-componentId={ `${ componentId }-danger-zone-toggle` }
                                                actionTitle={ t("user:editUser." +
                                                    "dangerZoneGroup.lockUserZone.actionTitle") }
                                                header={
                                                    t("user:editUser.dangerZoneGroup." +
                                                    "lockUserZone.header")
                                                }
                                                subheader={
                                                    t("user:editUser.dangerZoneGroup." +
                                                    "lockUserZone.subheader")
                                                }
                                                onActionClick={ undefined }
                                                toggle={ {
                                                    checked: accountLocked,
                                                    disableHint: t("user:editUser.dangerZoneGroup." +
                                                        "lockUserZone.disabledHint"),
                                                    disabled: accountDisabled,
                                                    id: "accountLocked",
                                                    onChange: handleDangerZoneToggles
                                                } }
                                            />
                                        )
                                    }
                                    {
                                        userConfig?.enableAdminPrivilegeRevokeOption && !isPrivilegedUser &&
                                    adminUserType === AdminAccountTypes.INTERNAL &&
                                    associationType !== UserManagementConstants.GUEST_ADMIN_ASSOCIATION_TYPE &&
                                    (
                                        <DangerZone
                                            data-componentId={ `${ componentId }-revoke-admin-privilege-danger-zone` }
                                            actionTitle={ t("user:editUser.dangerZoneGroup." +
                                            "deleteAdminPriviledgeZone.actionTitle") }
                                            header={ t("user:editUser.dangerZoneGroup." +
                                            "deleteAdminPriviledgeZone.header") }
                                            subheader={ t("user:editUser.dangerZoneGroup." +
                                            "deleteAdminPriviledgeZone.subheader") }
                                            onActionClick={ (): void => {
                                                setShowAdminRevokeConfirmationModal(true);
                                                setDeletingUser(user);
                                            } }
                                        />
                                    )
                                    }
                                    <DangerZone
                                        data-componentId={ `${ componentId }-danger-zone` }
                                        actionTitle={ t("user:editUser.dangerZoneGroup." +
                                        "deleteUserZone.actionTitle") }
                                        header={ t("user:editUser.dangerZoneGroup." +
                                        "deleteUserZone.header") }
                                        subheader={ commonConfig.userEditSection.isGuestUser
                                            ? t("extensions:manage.guest.editUser.dangerZoneGroup.deleteUserZone." +
                                                "subheader")
                                            : t("user:editUser.dangerZoneGroup." +
                                                "deleteUserZone.subheader")
                                        }
                                        onActionClick={ (): void => {
                                            setShowDeleteConfirmationModal(true);
                                            setDeletingUser(user);
                                        } }
                                        isButtonDisabled={
                                            adminUserType === AdminAccountTypes.INTERNAL && isReadOnlyUserStore }
                                        buttonDisableHint={ t("user:editUser.dangerZoneGroup." +
                                        "deleteUserZone.buttonDisableHint") }
                                    />
                                </DangerZoneGroup>
                            </Show>
                        ) : null }
            </>
        );
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
        if (!isDistinctAttributeProfilesDisabled) {
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

        return (!isEmpty(profileInfo.get(schema.name)) ||
            (!isReadOnly && (resolvedMutabilityValue !== ProfileConstants.READONLY_SCHEMA)));
    };

    /**
     * Form validator to validate the value against the schema regex.
     * @param value - Input value.
     * @returns An error if the value is not valid else undefined.
     */
    const validateInput = async (
        value: string,
        schema: ProfileSchemaInterface,
        fieldName: string,
        required: boolean = false
    ):
        Promise<string | undefined> => {
        if (required && isEmpty(value) ) {
            return (
                t("user:profile.forms.generic.inputs.validations.empty", { fieldName })
            );
        }

        if (isEmpty(value)) {
            return undefined;
        }

        if (!RegExp(schema.regEx).test(value)) {
            return (
                t("users:forms.validation.formatError", { field: fieldName })
            );
        }

        return undefined;
    };

    const generatePendingVerificationTooltip = (): ReactNode => (
        <Tooltip
            title={ t("user:profile.tooltips.confirmationPending") }
            data-componentid={ `${ componentId }-profile-form-email-pending-verification-icon` }
            placement="top"
        >
            <span>
                <CircleInfoIcon />
            </span>
        </Tooltip>
    );

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

        if (!commonConfig.userEditSection.showEmail && schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            return;
        }

        const fieldName: string = t("user:profile.fields." +
            schema.name.replace(".", "_"), { defaultValue: schema.displayName }
        );

        const resolvedMutabilityValue: string = schema?.profiles?.console?.mutability ?? schema.mutability;
        const sharedProfileValueResolvingMethod: string = schema?.sharedProfileValueResolvingMethod;
        const resolvedComponentId: string = `${ componentId }-${ schema.name }-input`;

        const resolvedRequiredValue = (): boolean => {
            if (isUserManagedByParentOrg &&
                sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN) {
                return false;
            }

            return schema?.profiles?.console?.required ?? schema.required;
        };

        if (schema.name === "userName") {
            const domainName: string[] = profileInfo?.get(schema.name)?.toString().split("/");

            if (domainName?.length > 1) {
                if (adminUserType === "internal") {
                    return (
                        <>
                            <FinalFormField
                                data-componentId={ `${ componentId }-profile-form-${ schema.name }-input` }
                                key={ key }
                                ariaLabel="userID"
                                data-componentid={ `${componentId}-userID` }
                                name={ schema.name }
                                type="text"
                                label={ !commonConfig.userEditSection.showEmail
                                    ? fieldName + " (Email)"
                                    : fieldName
                                }
                                component={ TextFieldAdapter }
                                initialValue={ domainName[1] }
                                readOnly={ true }
                            />
                            <Divider hidden/>
                        </>
                    );
                }

                return (
                    <>
                        <FinalFormField
                            data-componentId={ `${ componentId }-profile-form-${ schema.name }-input` }
                            key={ key }
                            ariaLabel="userID"
                            data-componentid={ `${componentId}-userID` }
                            name={ schema.name }
                            type="text"
                            label={ domainName[0] + " / " }
                            component={ TextFieldAdapter }
                            initialValue={ domainName[1] }
                            readOnly={ isReadOnly ||
                                resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA }
                            maxLength={
                                schema.maxLength
                                    ? schema.maxLength
                                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                            }
                        />
                        <Divider hidden/>
                    </>
                );
            }

            return (
                <>
                    <FinalFormField
                        data-componentId={ `${ componentId }-profile-form-${ schema.name }-input` }
                        key={ key }
                        ariaLabel="userID"
                        data-componentid={ `${componentId}-userID` }
                        name={ schema.name }
                        type="text"
                        label={ !commonConfig.userEditSection.showEmail
                            ? fieldName + " (Email)"
                            : fieldName
                        }
                        component={ TextFieldAdapter }
                        initialValue={ profileInfo.get(schema.name) }
                        readOnly={ true }
                    />
                    <Divider hidden/>
                </>
            );
        }

        if (schema?.extended && schema?.multiValued) {
            return (
                <MultiValuedFormFields
                    schema={ schema }
                    fieldName={ fieldName }
                    key={ key }
                    isUserManagedByParentOrg={ isUserManagedByParentOrg }
                    profileInfo={ profileInfo }
                    user={ user }
                    multiValuedAttributeValues={ multiValuedAttributeValues }
                    setMultiValuedAttributeValues={ setMultiValuedAttributeValues }
                    primaryValues={ primaryValues }
                    setPrimaryValues={ setPrimaryValues }
                    handleUserUpdate={ handleUserUpdate }
                    multiValuedInputFieldValue={ multiValuedInputFieldValue }
                    setMultiValuedInputFieldValue={ setMultiValuedInputFieldValue }
                    isReadOnly={ isReadOnly }
                    configSettings={ configSettings }
                    profileSchema={ profileSchema }
                />
            );
        }

        if (schema.name === "country") {
            const selectedCountry: DropdownItemProps = countryList.find(
                (country: DropdownItemProps) =>
                    country.value === profileInfo.get(schema.name)
            );

            return (
                <>
                    <FinalFormField
                        key={ key }
                        component={ AutocompleteFieldAdapter }
                        data-componentid={ resolvedComponentId }
                        initialValue={ selectedCountry }
                        ariaLabel={ fieldName }
                        name={ schema.name }
                        label={ fieldName }
                        placeholder={
                            t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                                { fieldName })
                        }
                        options={ countryList }
                        getOptionLabel={ (option: DropdownItemProps) => option.value }
                        renderOption={ (props: any, option: DropdownItemProps)  => {
                            const { key, ...optionProps } = props;

                            return (
                                <ListItem
                                    key={ key }
                                    data-componentid={ `${ componentId }-profile-form-country-dropdown-${
                                        option.value }` }
                                    { ...optionProps }
                                >
                                    <ListItemIcon>
                                        <Flag countryCode={ option.flag as string } />
                                    </ListItemIcon>
                                    <ListItemText>
                                        { option.text }
                                    </ListItemText>
                                </ListItem>
                            );
                        } }
                        isOptionEqualToValue={
                            (option: DropdownItemProps, value: DropdownItemProps) =>
                                option.value === value.value
                        }
                        readOnly={ (isUserManagedByParentOrg &&
                            sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                            || isReadOnly
                            || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                        }
                        required={ resolvedRequiredValue() }
                        disableClearable={ resolvedRequiredValue() }
                    />
                    <Divider hidden/>
                </>
            );
        }

        if (schema?.name === "locale") {
            const normalizedLocale: string = normalizeLocaleFormat(profileInfo.get(schema?.name),
                LocaleJoiningSymbol.HYPHEN, true, supportedI18nLanguages);

            const selectedLocale: DropdownItemProps = supportedI18nLanguagesArray.find(
                (locale: DropdownItemProps) =>
                    locale.value === normalizedLocale
            );

            return (
                <>
                    <FinalFormField
                        key={ key }
                        component={ AutocompleteFieldAdapter }
                        data-componentid={ resolvedComponentId }
                        initialValue={ selectedLocale }
                        ariaLabel={ fieldName }
                        name={ schema.name }
                        label={ fieldName }
                        placeholder={
                            t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                                { fieldName })
                        }
                        options={ supportedI18nLanguagesArray }
                        getOptionLabel={ (option: DropdownItemProps) => option.text }
                        renderOption={ (props: any, option: DropdownItemProps)  => {
                            const { key, ...optionProps } = props;

                            return (
                                <ListItem
                                    key={ key }
                                    data-componentid={ `${ componentId }-profile-form-locale-dropdown-${
                                        option.value }` }
                                    { ...optionProps }
                                >
                                    <ListItemIcon>
                                        <Flag countryCode={ option.flag as string } />
                                    </ListItemIcon>
                                    <ListItemText>
                                        { option.text }
                                    </ListItemText>
                                </ListItem>
                            );
                        } }
                        isOptionEqualToValue={
                            (option: DropdownItemProps, value: DropdownItemProps) =>
                                option.text === value.text
                        }
                        readOnly={ (isUserManagedByParentOrg &&
                            sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                            || isReadOnly
                            || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                        }
                        required={ resolvedRequiredValue() }
                        disableClearable={ resolvedRequiredValue() }
                    />
                    <Divider hidden/>
                </>
            );
        }

        // TODO: Use the DateTimePicker component when it's available.
        if (schema?.name === "dateOfBirth") {
            return (
                <>
                    <FinalFormField
                        key={ key }
                        component={ TextFieldAdapter }
                        data-componentid={ resolvedComponentId }
                        initialValue={ profileInfo.get(schema.name) }
                        ariaLabel={ fieldName }
                        name={ schema.name }
                        label={ fieldName }
                        placeholder="YYYY-MM-DD"
                        type="text"
                        validate={ (value: string) => validateInput(value, schema, fieldName) }
                        parse={ (value: string) => value }
                        maxLength={ schema.maxLength
                            ? schema.maxLength
                            : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                        }
                        readOnly={ (isUserManagedByParentOrg &&
                            sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                            || isReadOnly
                            || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                        }
                        required={ resolvedRequiredValue() }

                    />
                    <Divider hidden/>
                </>
            );
        }

        if (schema?.name === EMAIL_ATTRIBUTE || schema?.name === MOBILE_ATTRIBUTE) {
            let isVerificationPending: boolean = false;
            let initialValue: string = profileInfo.get(schema?.name);

            if (schema?.name === EMAIL_ATTRIBUTE) {
                isVerificationPending = configSettings?.isEmailVerificationEnabled === "true"
                    && !isEmpty(getVerificationPendingAttributeValue(EMAIL_ATTRIBUTE));
            } else {
                isVerificationPending = configSettings?.isMobileVerificationEnabled === "true"
                    && !isEmpty(getVerificationPendingAttributeValue(MOBILE_ATTRIBUTE));
            }

            if (isVerificationPending) {
                initialValue = getVerificationPendingAttributeValue(schema?.name);
            }

            return (
                <>
                    <FinalFormField
                        key={ key }
                        component={ TextFieldAdapter }
                        data-componentid={ resolvedComponentId }
                        initialValue={ initialValue }
                        ariaLabel={ fieldName }
                        name={ schema.name }
                        type="text"
                        label={ fieldName }
                        placeholder={
                            t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                                { fieldName })
                        }
                        validate={ (value: string) => validateInput(value, schema, fieldName) }
                        maxLength={
                            schema.maxLength
                                ? schema.maxLength
                                : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
                        }
                        readOnly={ (isUserManagedByParentOrg &&
                            sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                            || isReadOnly
                            || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                            || schema.name === "userName"
                        }
                        required={ resolvedRequiredValue() }
                        endAdornment={ isVerificationPending
                            ? (
                                <InputAdornment position="end">
                                    { generatePendingVerificationTooltip() }
                                </InputAdornment>
                            )
                            : null
                        }
                    />
                    <Divider hidden/>
                </>
            );
        }

        return (
            <DynamicTypeFormField
                key={ key }
                data-componentid={ resolvedComponentId }
                schema={ schema }
                profileInfo={ profileInfo }
                readOnly={ (isUserManagedByParentOrg &&
                    sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN)
                    || isReadOnly
                    || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA
                }
                required={ resolvedRequiredValue() }
            />
        );
    };

    /**
     * Resolves the user account locked reason text.
     *
     * @returns The resolved account locked reason in readable text.
     */
    const resolveUserAccountLockedReason = (): string => {
        if (accountDisabled) {
            return t("user:profile.accountDisabled");
        }

        if (accountLockedReason) {
            return ACCOUNT_LOCK_REASON_MAP[accountLockedReason] ?? ACCOUNT_LOCK_REASON_MAP["DEFAULT"];
        }

        return "";
    };

    /**
     * Checks if the user account is in a pending ask password state where the user hasn't
     * set their password via the setup link yet.
     */
    const isPendingAskPasswordState: boolean = accountState === AccountState.PENDING_AP;

    /**
     * Determines which password change option to be displayed.
     *
     * Is true if the "Set Password" option should be presented—this indicates that the
     * account is in the pending ask password state (i.e. the user hasn’t set a password yet).
     *
     * Else false if the "Force Password Reset" option should be displayed, meaning the user
     * already has an existing password.
     */
    const isSetPassword: boolean = isPendingAskPasswordState ||
        (accountLockedReason === AccountLockedReason.PENDING_ASK_PASSWORD);

    /**
     * Resolves the recovery scenario based on the account locked reason or account state.
     * This recoveryscenario is then used to determine whether the resending code/link is supported.
     *
     * @returns The resolved recovery scenario.
     */
    const resolveRecoveryScenario = (): string | null => {
        // If the account is locked and a locked reason is provided, process locked reason
        // to determine the scenario.
        if (accountLocked && accountLockedReason) {
            if (accountLockedReason === AccountLockedReason.PENDING_ADMIN_FORCED_USER_PASSWORD_RESET) {
                if (isAdminPasswordResetSMSOTPEnabled()) {
                    return RecoveryScenario.ADMIN_FORCED_PASSOWRD_RESET_VIA_SMS_OTP;
                }
                if (isAdminPasswordResetEmailLinkEnabled()) {
                    return RecoveryScenario.ADMIN_FORCED_PASSWORD_RESET_VIA_EMAIL_LINK;
                }
                if (isAdminPasswordResetEmailOTPEnabled()) {
                    return RecoveryScenario.ADMIN_FORCED_PASSWORD_RESET_VIA_OTP;
                }
            }
            if (accountLockedReason === AccountLockedReason.PENDING_ASK_PASSWORD) {
                return RecoveryScenario.ASK_PASSWORD;
            }
        }
        // For non-locked accounts, use the account state to determine the scenario.
        if (!accountLocked && accountState) {
            if (accountState === AccountState.PENDING_AP) {
                return RecoveryScenario.ASK_PASSWORD;
            }
        }

        return null;
    };

    /**
     * Renders the "Resend" link component.
     *
     * The resend option is shown when a valid recovery scenario is resolved either from
     * the account locked reason or account state.
     *
     * @returns The "Resend" link component.
     */
    const ResendLink = (): JSX.Element | null => {
        const recoveryScenario: string | null = resolveRecoveryScenario();

        if (!recoveryScenario) return null;

        return (
            <LinkButton
                onClick={ () => handleResendCode(recoveryScenario) }
                aria-disabled={ isSubmitting }
                disabled={ isSubmitting }
                data-componentId={ `${ componentId }-resend-link` }
            >
                { t("user:resendCode.resend") }
            </LinkButton>
        );
    };

    /**
     * Initiates a recovery process based on the account's locked reason or account state.
     **/
    const handleResendCode = (recoveryScenario: string) => {
        setIsSubmitting(true);

        const resolvedUsername: string = getUserNameWithoutDomain(user?.userName);
        const userStoreDomain: string = resolveUserstore(user?.userName, primaryUserStoreDomainName);

        const requestData: ResendCodeRequestData = {
            properties: [
                {
                    key: "RecoveryScenario",
                    value: recoveryScenario
                }
            ],
            user: {
                realm: userStoreDomain,
                username: resolvedUsername
            }
        };

        resendCode(requestData)
            .then(() => {
                onAlertFired({
                    description: t("user:profile.notifications.resendCode.success.description",
                        { recoveryOption: RECOVERY_SCENARIO_TO_RECOVERY_OPTION_TYPE_MAP[recoveryScenario] }),
                    level: AlertLevels.SUCCESS,
                    message: t("user:profile.notifications.resendCode.success.message")
                });
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description || error?.response?.data?.detail ||
                        t("user:profile.notifications.resendCode.genericError.description", {
                            recoveryOption: RECOVERY_SCENARIO_TO_RECOVERY_OPTION_TYPE_MAP[recoveryScenario] }),
                    level: AlertLevels.ERROR,
                    message: t("user:profile.notifications.resendCode.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Checks if admin forced password reset via Email link is enabled.
     *
     * @returns true if enabled, false otherwise.
     */
    const isAdminPasswordResetEmailLinkEnabled = (): boolean => {
        const property: ConnectorPropertyInterface | undefined = connectorProperties?.find(
            (property: ConnectorPropertyInterface) =>
                property.name === ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_EMAIL_LINK
        );

        return property?.value === "true";
    };

    /**
     * Checks if admin forced password reset via Email OTP is enabled.
     *
     * @returns true if enabled, false otherwise
     */
    const isAdminPasswordResetEmailOTPEnabled = (): boolean => {
        const property: ConnectorPropertyInterface | undefined = connectorProperties?.find(
            (property: ConnectorPropertyInterface) =>
                property.name === ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_EMAIL_OTP
        );

        return property?.value === "true";
    };

    /**
     * Checks if admin forced password reset via SMS OTP is enabled.
     *
     * @returns true if enabled, false otherwise
     */
    const isAdminPasswordResetSMSOTPEnabled = (): boolean => {
        const property: ConnectorPropertyInterface | undefined = connectorProperties?.find(
            (property: ConnectorPropertyInterface) =>
                property.name === ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_SMS_OTP
        );

        return property?.value === "true";
    };

    if (isReadOnlyUserStoresLoading || isEmpty(profileInfo)) {
        return (
            <ContentLoader />
        );
    }

    return (
        <>
            {
                (accountLocked || accountDisabled) && (
                    <Alert severity="warning" className="user-profile-alert">
                        { t(resolveUserAccountLockedReason()) }
                        <ResendLink />
                    </Alert>
                )
            }
            {
                (!accountLocked && isPendingAskPasswordState) && (
                    <Alert severity="warning" className="user-profile-alert">
                        { t("user:profile.accountState.pendingAskPassword") }
                        <ResendLink />
                    </Alert>
                )
            }
            <EmphasizedSegment padded="very">
                <OxygenGrid container>
                    <OxygenGrid lg={ 8 } md={ 16 }>
                        {
                            isReadOnly
                            && !isReadOnlyUserStore
                            && (!isEmpty(tenantAdmin) || tenantAdmin !== null)
                            && !user[ SCIMConfigs.scim.systemSchema ]?.userSourceId
                            && editUserDisclaimerMessage
                        }
                        <FinalForm
                            keepDirtyOnReinitialize={ true }
                            onSubmit={ handleSubmit }
                            render={ ({ handleSubmit, dirty }: FormRenderProps) => {
                                return (
                                    <form
                                        id="user-profile-form"
                                        onSubmit={ handleSubmit }
                                        className="user-profile-form"
                                    >

                                        {
                                            user.id && (
                                                <>
                                                    <FinalFormField
                                                        key="userID"
                                                        data-componentid={ `${ componentId }-userID` }
                                                        component={ TextFieldAdapter }
                                                        initialValue={ user.id }
                                                        label={ t("user:profile.fields.userId") }
                                                        ariaLabel="userID"
                                                        name="userID"
                                                        type="text"
                                                        maxLength={ 100 }
                                                        minLength={ 0 }
                                                        readOnly={ true }
                                                    />
                                                    <Divider hidden/>
                                                </>
                                            )
                                        }
                                        {
                                            profileSchema &&
                                            profileSchema.map((schema: ProfileSchemaInterface, index: number) => {
                                                if (hiddenSchemas.includes(schema.name) ||
                                                    !isFieldDisplayable(schema)) {

                                                    return;
                                                }

                                                return generateProfileEditForm(schema, index);
                                            })
                                        }
                                        {
                                            oneTimePassword && (
                                                <>
                                                    <FinalFormField
                                                        key="oneTimePassword"
                                                        data-componentid={ `${ componentId }-one-time-password` }
                                                        component={ TextFieldAdapter }
                                                        label={ t("user:profile.fields." +
                                                            "oneTimePassword") }
                                                        initialValue={ oneTimePassword }
                                                        ariaLabel="oneTimePassword"
                                                        name="oneTimePassword"
                                                        type="text"
                                                        required={ false }
                                                        readOnly={ true }
                                                    />
                                                    <Divider hidden/>
                                                </>
                                            )
                                        }
                                        {
                                            createdDate && (
                                                <>
                                                    <FinalFormField
                                                        key="createdDate"
                                                        data-componentid={ `${ componentId }-created-date` }
                                                        component={ TextFieldAdapter }
                                                        label={ t("user:profile.fields.createdDate") }
                                                        initialValue={ createdDate
                                                            ? moment(createdDate).format("YYYY-MM-DD")
                                                            : ""
                                                        }
                                                        ariaLabel="createdDate"
                                                        name="createdDate"
                                                        type="text"
                                                        required={ false }
                                                        readOnly={ true }
                                                    />
                                                    <Divider hidden/>
                                                </>
                                            )
                                        }
                                        {
                                            modifiedDate && (
                                                <>
                                                    <FinalFormField
                                                        key="modifiedDate"
                                                        data-componentid={ `${ componentId }-modified-date` }
                                                        component={ TextFieldAdapter }
                                                        label={ t("user:profile.fields.modifiedDate") }
                                                        initialValue={ modifiedDate
                                                            ? moment(modifiedDate).format("YYYY-MM-DD")
                                                            : ""
                                                        }
                                                        ariaLabel="modifiedDate"
                                                        name="modifiedDate"
                                                        type="text"
                                                        required={ false }
                                                        readOnly={ true }
                                                    />
                                                    <Divider hidden/>
                                                </>
                                            )
                                        }
                                        <FinalFormField
                                            name="multiValuedStateTracker"
                                            component="input"
                                            type="hidden"
                                        />
                                        {
                                            !isReadOnly && (
                                                <Button
                                                    data-componentid={ `${ componentId }-form-update-button` }
                                                    variant="contained"
                                                    type="submit"
                                                    size="small"
                                                    className="form-button"
                                                    loading={ isSubmitting }
                                                    disabled={ isSubmitting || !dirty }
                                                >
                                                    { t("common:update") }
                                                </Button>
                                            )
                                        }
                                    </form>
                                );
                            } }

                        />
                    </OxygenGrid>
                </OxygenGrid>
            </EmphasizedSegment>
            <Divider hidden />
            { resolveDangerActions() }
            {
                deletingUser && (
                    <ConfirmationModal
                        data-componentId={ `${componentId}-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("user:deleteUser.confirmationModal." +
                            "assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => {
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => handleUserDelete(deletingUser) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-componentId={ `${componentId}-confirmation-modal-header` }>
                            { t("user:deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentId={ `${componentId}-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { commonConfig.userEditSection.isGuestUser
                                ? t("extensions:manage.guest.deleteUser.confirmationModal.message")
                                : t("user:deleteUser.confirmationModal.message")
                            }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { commonConfig.userEditSection.isGuestUser
                                ? t("extensions:manage.guest.deleteUser.confirmationModal.content")
                                : t("user:deleteUser.confirmationModal.content")
                            }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                deletingUser && (
                    <ConfirmationModal
                        data-componentId={ `${componentId}-admin-privilege-revoke-confirmation-modal` }
                        onClose={ (): void => setShowAdminRevokeConfirmationModal(false) }
                        type="negative"
                        open={ showAdminRevokeConfirmationModal }
                        assertionHint={ t("user:revokeAdmin.confirmationModal." +
                            "assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => {
                            setShowAdminRevokeConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => handleUserAdminRevoke(deletingUser) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-componentId={ `${componentId}-admin-privilege-revoke-confirmation-modal-header` }
                        >
                            { t("user:revokeAdmin.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Content>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { t("user:revokeAdmin.confirmationModal.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                editingAttribute && (
                    <ConfirmationModal
                        data-componentId={ `${componentId}-confirmation-modal` }
                        onClose={ (): void => {
                            setShowLockDisableConfirmationModal(false);
                            setEditingAttribute(undefined);
                        } }
                        type="warning"
                        open={ showLockDisableConfirmationModal }
                        assertion={ resolveUsernameOrDefaultEmail(user, false) }
                        assertionHint={ editingAttribute.name === ProfileConstants
                            .SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                            ? t("user:lockUser.confirmationModal.assertionHint")
                            : t("user:disableUser.confirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => {
                            setEditingAttribute(undefined);
                            setShowLockDisableConfirmationModal(false);
                        } }
                        onPrimaryActionClick={ () =>
                            handleDangerActions(editingAttribute.name, editingAttribute.value)
                        }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-componentId={ `${componentId}-confirmation-modal-header` }>
                            { editingAttribute.name === ProfileConstants
                                .SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                                ? t("user:lockUser.confirmationModal.header")
                                : t("user:disableUser.confirmationModal.header")
                            }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentId={ `${componentId}-disable-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { editingAttribute.name === ProfileConstants
                                .SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                                ? t("user:lockUser.confirmationModal.message")
                                : t("user:disableUser.confirmationModal.message")
                            }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { editingAttribute.name === ProfileConstants
                                .SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                                ? t("user:lockUser.confirmationModal.content")
                                : t("user:disableUser.confirmationModal.content")
                            }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            <ChangePasswordComponent
                handleForcePasswordResetTrigger={ null }
                connectorProperties={ connectorProperties }
                handleCloseChangePasswordModal={ () => setOpenChangePasswordModal(false) }
                openChangePasswordModal={ openChangePasswordModal }
                onAlertFired={ onAlertFired }
                user={ user }
                handleUserUpdate={ handleUserUpdate }
                isResetPassword={ !isSetPassword }
            />
        </>
    );
};
