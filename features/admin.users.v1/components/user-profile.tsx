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
import { Show, useRequiredScopes } from "@wso2is/access-control";
import { getAllExternalClaims } from "@wso2is/admin.claims.v1/api/claims";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { SCIMConfigs, commonConfig, userConfig } from "@wso2is/admin.extensions.v1";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { searchRoleList, updateRoleDetails, updateUsersForRole } from "@wso2is/admin.roles.v2/api/roles";
import {
    PatchRoleDataInterface,
    SearchRoleInterface
} from "@wso2is/admin.roles.v2/models/roles";
import { ConnectorPropertyInterface, ServerConfigurationsConstants } from "@wso2is/admin.server-configurations.v1";
import { TenantInfo } from "@wso2is/admin.tenants.v1/models/tenant";
import { getAssociationType } from "@wso2is/admin.tenants.v1/utils/tenants";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { getUserNameWithoutDomain, isFeatureEnabled, resolveUserstore } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    ExternalClaim,
    FeatureAccessConfigInterface,
    MultiValueAttributeInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface,
    RolesMemberInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ProfileUtils } from "@wso2is/core/utils";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    LinkButton,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { CheckboxProps, Divider } from "semantic-ui-react";
import { ChangePasswordComponent } from "./user-change-password";
import { UserImpersonationAction } from "./user-impersonation-action";
import LegacyUserProfileForm from "./user-profile/legacy-user-profile-form";
import UserProfileForm from "./user-profile/user-profile-form";
import { resendCode, updateUserInfo } from "../api";
import {
    ACCOUNT_LOCK_REASON_MAP,
    AccountLockedReason,
    AccountState,
    AdminAccountTypes,
    CONNECTOR_PROPERTY_TO_CONFIG_STATUS_MAP,
    PASSWORD_RESET_PROPERTIES,
    RECOVERY_SCENARIO_TO_RECOVERY_OPTION_TYPE_MAP,
    RecoveryScenario,
    UserFeatureDictionaryKeys,
    UserManagementConstants
} from "../constants";
import {
    AccountConfigSettingsInterface,
    ResendCodeRequestData,
    SubValueInterface
} from "../models/user";
import { getDisplayOrder } from "../utils/user-management-utils";
import "./user-profile.scss";

/**
 * Prop types for the basic details component.
 */
interface UserProfilePropsInterface extends TestableComponentInterface {
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
export const UserProfile: FunctionComponent<UserProfilePropsInterface> = (
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
        [ "data-testid" ]: testId = "user-mgt-user-profile"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.providedUsername);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const currentOrganization: string =  useSelector((state: AppState) => state?.config?.deployment?.tenant);
    const authUserTenants: TenantInfo[] = useSelector((state: AppState) => state?.auth?.tenants);
    const userSchemaURI: string = useSelector((state: AppState) => state?.config?.ui?.userSchemaURI);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const hasUsersUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.users?.scopes?.update
    );

    const roleAssignmentsConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.roleAssignments);
    const hasRoleV3UpdatePermissions: boolean = useRequiredScopes(roleAssignmentsConfig?.scopes?.update);
    const updateUserRoleAssignmentsFunction: (roleId: string, data: PatchRoleDataInterface) => Promise<AxiosResponse> =
        hasRoleV3UpdatePermissions ? updateUsersForRole : updateRoleDetails;

    const [ profileInfo, setProfileInfo ] = useState(new Map<string, string>());
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchemaInterface[]>();
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
    const [ duplicatedUserClaims, setDuplicatedUserClaims ] = useState<ExternalClaim[]>([]);
    const [ isClaimsLoading, setIsClaimsLoading ] = useState<boolean>(true);

    const accountLocked: boolean = user[userConfig.userProfileSchema]?.accountLocked === "true" ||
        user[userConfig.userProfileSchema]?.accountLocked === true;
    const accountLockedReason: string = user[userConfig.userProfileSchema]?.lockedReason;
    const accountState: string = user[userConfig.userProfileSchema]?.accountState;
    const accountDisabled: boolean = user[userConfig.userProfileSchema]?.accountDisabled === "true" ||
        user[userConfig.userProfileSchema]?.accountDisabled === true;
    const isCurrentUserAdmin: boolean = user?.roles?.some((role: RolesMemberInterface) =>
        role.display === administratorConfig.adminRoleName) ?? false;

    const isLegacyUserProfileEnabled: boolean = isFeatureEnabled(
        featureConfig?.users,
        UserManagementConstants.FEATURE_DICTIONARY.get(UserFeatureDictionaryKeys.UserLegacyProfile)
    );

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

    useEffect(() => {
        // This will load authenticated user's association type to the current organization.
        setAssociationType(getAssociationType(authUserTenants, currentOrganization));

        if (adminUserType === AdminAccountTypes.INTERNAL && userConfig?.enableAdminPrivilegeRevokeOption) {
            // Admin role ID is only used by internal admins.
            getAdminRoleId();
        }
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
        const calculateDuplicateClaims = async () => {
            setIsClaimsLoading(true);

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
                setIsClaimsLoading(false);

            } catch (error) {
                dispatch(addAlert({
                    description: t("claims:external.notifications.fetchExternalClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("claims:external.notifications.fetchExternalClaims.genericError.message")
                }));
            }
        };

        calculateDuplicateClaims();
    }, []);

    /**
     * Sort the elements of the profileSchema state accordingly by the displayOrder attribute in the ascending order.
     */
    useEffect(() => {
        const META_VERSION: string = ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("META_VERSION");
        const filteredSchemas: ProfileSchemaInterface[] = [];

        for (const schema of ProfileUtils.flattenSchemas([ ...profileSchemas ])) {
            if (schema.name === META_VERSION) {
                continue;
            }
            filteredSchemas.push(schema);
        }

        filteredSchemas.sort((a: ProfileSchemaInterface, b: ProfileSchemaInterface) =>
            getDisplayOrder(a) - getDisplayOrder(b));

        setProfileSchema(filteredSchemas);
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
     * This function handles deletion of the user.
     *
     * @param deletingUser - user object to be revoked their admin permissions.
     */
    const handleUserAdminRevoke = (deletingUser: ProfileInfoInterface): void => {
        // Payload for the update role request.
        const roleData: PatchRoleDataInterface = hasRoleV3UpdatePermissions ? {
            Operations: [
                {
                    op: "remove",
                    path: `value eq ${deletingUser.id}`,
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        } : {
            Operations: [
                {
                    op: "remove",
                    path: `users[display eq ${deletingUser.userName}]`,
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        updateUserRoleAssignmentsFunction(adminRoleId, roleData)
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
        const isUserCurrentLoggedInUser: boolean = authenticatedUser?.includes(resolvedUsername);

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
                                <UserImpersonationAction
                                    user={ user }
                                    isLocked={ accountLocked }
                                    isDisabled={ accountDisabled }
                                    isReadOnly={ !hasUsersUpdatePermissions }
                                    isUserManagedByParentOrg={ isUserManagedByParentOrg }
                                    data-componentid="user-mgt-edit-user-impersonate-action"
                                />
                                <Divider hidden/>
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
                                                            data-testid={ `${ testId }-set-password` }
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
                                                            data-testid={ `${ testId }-change-password` }
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
                                                data-testid={ `${ testId }-account-disable-button` }
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
                                                data-testid={ `${ testId }-danger-zone-toggle` }
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
                                            data-testid={ `${ testId }-revoke-admin-privilege-danger-zone` }
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
                                        data-testid={ `${ testId }-danger-zone` }
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
                data-testid={ `${ testId }-resend-link` }
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

    return (
        !isReadOnlyUserStoresLoading && !isClaimsLoading && !isEmpty(profileInfo)
            ? (<>
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
                    {
                        isReadOnly
                        && !isReadOnlyUserStore
                        && (!isEmpty(tenantAdmin) || tenantAdmin !== null)
                        && !user[ SCIMConfigs.scim.systemSchema ]?.userSourceId
                        && editUserDisclaimerMessage
                    }

                    { isLegacyUserProfileEnabled ? (
                        <LegacyUserProfileForm
                            profileData={ user }
                            flattenedProfileData={ profileInfo }
                            profileSchema={ profileSchema }
                            isReadOnly={ isReadOnly }
                            onUpdate={ handleUserUpdate }
                            isUpdating={ isSubmitting }
                            adminUserType={ adminUserType }
                            setIsUpdating={ (isUpdating: boolean): void => setIsSubmitting(isUpdating) }
                            onUserUpdate={ handleUserUpdate }
                            accountConfigSettings={ configSettings }
                            isUserManagedByParentOrg={ isUserManagedByParentOrg }
                            data-componentid={ testId }
                        />
                    ) : (
                        <div className="form-container with-max-width">
                            <UserProfileForm
                                profileData={ user }
                                duplicateClaims={ duplicatedUserClaims }
                                isReadOnlyMode={ isReadOnly }
                                accountConfigSettings={ configSettings }
                                isUserManagedByParentOrg={ isUserManagedByParentOrg }
                                onUserUpdated={ handleUserUpdate }
                                data-componentid={ testId }
                            />
                        </div>
                    ) }
                </EmphasizedSegment>
                <Divider hidden />
                { resolveDangerActions() }
                {
                    deletingUser && (
                        <ConfirmationModal
                            data-testid={ `${testId}-confirmation-modal` }
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
                            <ConfirmationModal.Header data-testid={ `${testId}-confirmation-modal-header` }>
                                { t("user:deleteUser.confirmationModal.header") }
                            </ConfirmationModal.Header>
                            <ConfirmationModal.Message
                                data-testid={ `${testId}-confirmation-modal-message` }
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
                            data-testid={ `${testId}-admin-privilege-revoke-confirmation-modal` }
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
                                data-testid={ `${testId}-admin-privilege-revoke-confirmation-modal-header` }
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
                            data-testid={ `${testId}-confirmation-modal` }
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
                            <ConfirmationModal.Header data-testid={ `${testId}-confirmation-modal-header` }>
                                { editingAttribute.name === ProfileConstants
                                    .SCIM2_SCHEMA_DICTIONARY.get("ACCOUNT_LOCKED")
                                    ? t("user:lockUser.confirmationModal.header")
                                    : t("user:disableUser.confirmationModal.header")
                                }
                            </ConfirmationModal.Header>
                            <ConfirmationModal.Message
                                data-testid={ `${testId}-disable-confirmation-modal-message` }
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
            </>)
            : <ContentLoader dimmer/>
    );
};
