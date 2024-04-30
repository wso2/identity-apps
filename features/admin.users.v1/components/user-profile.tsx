/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { Show } from "@wso2is/access-control";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes, resolveUserEmails } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    MultiValueAttributeInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils, ProfileUtils } from "@wso2is/core/utils";
import { Field, Forms, Validation } from "@wso2is/forms";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import {
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import React, { FunctionComponent, ReactElement, ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, CheckboxProps, Divider, DropdownItemProps, Form, Grid, Input } from "semantic-ui-react";
import { ChangePasswordComponent } from "./user-change-password";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../admin.core.v1";
import { SCIMConfigs, commonConfig, userConfig } from "../../admin.extensions.v1";
import { TenantInfo } from "../../admin.extensions.v1/components/tenants/models";
import { getAssociationType } from "../../admin.extensions.v1/components/tenants/utils/tenants";
import { administratorConfig } from "../../admin.extensions.v1/configs/administrator";
import { searchRoleList, updateRoleDetails } from "../../admin.roles.v2/api/roles";
import {
    OperationValueInterface,
    PatchRoleDataInterface,
    ScimOperationsInterface,
    SearchRoleInterface
} from "../../admin.roles.v2/models/roles";
import { ConnectorPropertyInterface, ServerConfigurationsConstants  } from "../../admin.server-configurations.v1";
import { updateUserInfo } from "../api";
import { AdminAccountTypes, LocaleJoiningSymbol, UserManagementConstants } from "../constants";
import { AccountConfigSettingsInterface, SchemaAttributeValueInterface, SubValueInterface } from "../models";

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
        isReadOnlyUserStore,
        tenantAdmin,
        editUserDisclaimerMessage,
        adminUserType,
        isUserManagedByParentOrg,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.providedUsername);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const currentOrganization: string =  useSelector((state: AppState) => state?.config?.deployment?.tenant);
    const authUserTenants: TenantInfo[] = useSelector((state: AppState) => state?.auth?.tenants);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

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
        forcePasswordReset: "false"
    });
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();
    const [ countryList, setCountryList ] = useState<DropdownItemProps[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ adminRoleId, setAdminRoleId ] = useState<string>("");
    const [ associationType, setAssociationType ] = useState<string>("");

    const createdDate: string = user?.meta?.created;
    const modifiedDate: string = user?.meta?.lastModified;
    const accountLocked: boolean = user[userConfig.userProfileSchema]?.accountLocked === "true" ||
    user[userConfig.userProfileSchema]?.accountLocked === true;
    const accountDisabled: boolean = user[userConfig.userProfileSchema]?.accountDisabled === "true";
    const oneTimePassword: string = user[userConfig.userProfileSchema]?.oneTimePassword;

    useEffect(() => {

        if (connectorProperties && Array.isArray(connectorProperties) && connectorProperties?.length > 0) {

            let configurationStatuses: AccountConfigSettingsInterface = { ...configSettings } ;

            for (const property of connectorProperties) {
                if (property.name === ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE) {
                    configurationStatuses = {
                        ...configurationStatuses,
                        accountDisable: property.value
                    };
                } else if (property.name === ServerConfigurationsConstants.RECOVERY_LINK_PASSWORD_RESET
                    || property.name === ServerConfigurationsConstants.OTP_PASSWORD_RESET
                    || property.name === ServerConfigurationsConstants.OFFLINE_PASSWORD_RESET) {

                    if(property.value === "true") {
                        configurationStatuses = {
                            ...configurationStatuses,
                            forcePasswordReset: property.value
                        };
                    }
                } else if (property.name === ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION) {
                    configurationStatuses = {
                        ...configurationStatuses,
                        accountLock: property.value
                    };
                }
            }

            setConfigSettings(configurationStatuses);
        }
    }, [ connectorProperties ]);

    /**
     *  .
     */
    useEffect(() => {
        // This will load the countries to the dropdown
        setCountryList(CommonUtils.getCountryList());
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
        const sortedSchemas: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas([ ...profileSchemas ])
            .filter((item: ProfileSchemaInterface) =>
                item.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("META_VERSION"))
            .sort((a: ProfileSchemaInterface, b: ProfileSchemaInterface) => {
                if (!a.displayOrder) {
                    return -1;
                } else if (!b.displayOrder) {
                    return 1;
                } else {
                    return parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10);
                }
            });

        setProfileSchema(sortedSchemas);
    }, [ profileSchemas ]);

    useEffect(() => {
        mapUserToSchema(profileSchema, user);
    }, [ profileSchema, user ]);

    /**
     * This will add role attribute to countries search input to prevent autofill suggestions.
     */
    const onCountryRefChange: any = useCallback((node: any) => {
        if (node !== null) {
            node.children[0].children[1].children[0].role = "presentation";
        }
    }, []);

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

                            if (schema.extended && userInfo[userConfig.userProfileSchema]
                                && userInfo[userConfig.userProfileSchema][schemaNames[0]]) {
                                tempProfileInfo.set(
                                    schema.name, userInfo[userConfig.userProfileSchema][schemaNames[0]]
                                );

                                return;
                            }

                            if (schema.extended && userInfo[userConfig.userProfileSchema]
                                && userInfo[userConfig.userProfileSchema][schemaNames[0]]) {
                                tempProfileInfo.set(
                                    schema.name, userInfo[userConfig.userProfileSchema][schemaNames[0]]
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
                                tempProfileInfo.set(
                                    schema.name, userInfo[userConfig.userProfileSchema][schemaNames[0]]
                                );

                                return;
                            }

                            if (schema.extended && userInfo[userConfig.userProfileSchema]
                                && userInfo[userConfig.userProfileSchema][schemaNames[0]]) {
                                tempProfileInfo.set(
                                    schema.name, userInfo[ProfileConstants.SCIM2_WSO2_CUSTOM_SCHEMA][schemaNames[0]]
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
     * The function returns the normalized format of locale.
     *
     * @param locale - locale value.
     * @param localeJoiningSymbol - symbol used to join language and region parts of locale.
     */
    const  normalizeLocaleFormat = (locale: string, localeJoiningSymbol: LocaleJoiningSymbol): string => {
        if (!locale) {
            return locale;
        }

        let [ language, region ] = locale.split(/[-_]/);

        language = language.toLowerCase();
        region = region.toUpperCase();

        return `${language}${localeJoiningSymbol}${region}`;
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

        if (adminUserType === AdminAccountTypes.INTERNAL) {
            profileSchema.forEach((schema: ProfileSchemaInterface) => {

                if (schema.mutability === ProfileConstants.READONLY_SCHEMA) {
                    return;
                }

                let opValue: OperationValueInterface = {};

                const schemaNames: string[] = schema.name.split(".");

                if (schema.name !== "roles.default") {
                    if (values.get(schema.name) !== undefined && values.get(schema.name).toString() !== undefined) {

                        if (ProfileUtils.isMultiValuedSchemaAttribute(profileSchema, schemaNames[0]) ||
                            schemaNames[0] === "phoneNumbers") {

                            const attributeValues: (string | string[] | SchemaAttributeValueInterface)[] = [];
                            const attValues: Map<string, string | string []> = new Map();

                            if (schemaNames.length === 1 || schema.name === "phoneNumbers.mobile") {

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
                        } else {
                            if (schemaNames.length === 1) {
                                if (schema.extended) {
                                    const schemaId: string = schema?.schemaId
                                        ? schema.schemaId
                                        : userConfig.userProfileSchema;

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
                                                LocaleJoiningSymbol.UNDERSCORE
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
                                                [schemaNames[1]]: schema.type.toUpperCase() === "BOOLEAN" ?
                                                    !!values.get(schema.name)?.includes(schema.name) :
                                                    values.get(schema.name)
                                            }
                                        }
                                    };
                                } else if (schemaNames[0] === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY
                                    .get("NAME")) {
                                    values.get(schema.name) && (
                                        opValue = {
                                            name: { [schemaNames[1]]: values.get(schema.name) }
                                        }
                                    );
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

        } else {
            profileSchema.forEach((schema: ProfileSchemaInterface) => {
                if (schema.mutability === ProfileConstants.READONLY_SCHEMA) {
                    return;
                }

                let opValue: OperationValueInterface = {};

                const schemaNames: string[] = schema.name.split(".");

                if (schema.name !== "roles.default") {
                    if (values.get(schema.name) !== undefined && values.get(schema.name).toString() !== undefined) {
                        if (ProfileUtils.isMultiValuedSchemaAttribute(profileSchema, schemaNames[0]) ||
                            schemaNames[0] === "phoneNumbers") {

                            const attributeValues: (string | string[] | SchemaAttributeValueInterface)[] = [];
                            const attValues: Map<string, string | string []> = new Map();

                            if (schemaNames.length === 1 || schema.name === "phoneNumbers.mobile") {

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
                        } else {
                            if (schemaNames.length === 1) {
                                if (schema.extended) {
                                    const schemaId: string = schema?.schemaId
                                        ? schema.schemaId
                                        : userConfig.userProfileSchema;

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
                                                LocaleJoiningSymbol.UNDERSCORE
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
    const handleDangerActions = (attributeName: string, attributeValue: boolean): Promise<void> => {
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
            data = {
                "Operations": [
                    {
                        "op": "replace",
                        "value": {
                            [ SCIMConfigs?.scimEnterpriseUserClaimUri?.accountDisabled?.
                                startsWith(ProfileConstants.SCIM2_WSO2_USER_SCHEMA) &&
                                SCIMConfigs?.scimEnterpriseUserClaimUri?.accountLocked?.
                                    startsWith(ProfileConstants.SCIM2_WSO2_USER_SCHEMA)
                                ? ProfileConstants.SCIM2_WSO2_USER_SCHEMA
                                : ProfileConstants.SCIM2_ENT_USER_SCHEMA ]: {
                                [attributeName]: attributeValue
                            }
                        }
                    }
                ],
                "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
            };
        }

        return updateUserInfo(user.id, data)
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
                                        "success.message", { name: user.emails && user.emails !== undefined ?
                                        resolveUserEmails(user?.emails) : resolveUsernameOrDefaultEmail(user, true) })
                                    : t("user:profile.notifications.unlockUserAccount." +
                                        "success.message", { name: user.emails && user.emails !== undefined ?
                                        resolveUserEmails(user?.emails) : resolveUsernameOrDefaultEmail(user, true) })
                            ) : (
                                attributeValue
                                    ? t("user:profile.notifications.disableUserAccount." +
                                        "success.message", { name: user.emails && user.emails !== undefined ?
                                        resolveUserEmails(user?.emails) : resolveUsernameOrDefaultEmail(user, false) })
                                    : t("user:profile.notifications.enableUserAccount." +
                                        "success.message", { name: user.emails && user.emails !== undefined ?
                                        resolveUserEmails(user?.emails) : resolveUsernameOrDefaultEmail(user, false) })
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
        if (!hasRequiredScopes(
            featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)) {
            return null;
        }

        const resolvedUsername: string = resolveUsernameOrDefaultEmail(user, false);
        const isUserSystemAdminOrTenantAdminOrCurrentLoggedInUser: boolean =
            [ tenantAdmin, adminUsername ]?.includes(resolvedUsername) || authenticatedUser?.includes(resolvedUsername);

        return (
            <>
                {
                    (!isReadOnly || allowDeleteOnly || isUserManagedByParentOrg)
                    && !isUserSystemAdminOrTenantAdminOrCurrentLoggedInUser ? (
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
                                                        isButtonDisabled={ accountLocked }
                                                        buttonDisableHint={ t("user:editUser." +
                                                            "dangerZoneGroup.passwordResetZone.buttonHint") }
                                                    />
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

    const resolveFormField = (schema: ProfileSchemaInterface, fieldName: string, key: number): ReactElement => {
        if (schema.type.toUpperCase() === "BOOLEAN") {
            return (
                <Field
                    data-testid={ `${ testId }-profile-form-${ schema.name }-input` }
                    name={ schema.name }
                    required={ schema.required }
                    requiredErrorMessage={ fieldName + " " + "is required" }
                    type="checkbox"
                    value={ profileInfo.get(schema.name) ? [ schema.name ] : [] }
                    children={ [
                        {
                            label: fieldName,
                            value: schema.name
                        }
                    ] }
                    readOnly={ isReadOnly || schema.mutability === ProfileConstants.READONLY_SCHEMA }
                    key={ key }
                />
            );
        } else if (schema.name === "country") {
            return (
                <Field
                    ref = { onCountryRefChange }
                    data-testid={ `${ testId }-profile-form-${ schema.name }-input` }
                    name={ schema.name }
                    label={ fieldName }
                    required={ schema.required }
                    requiredErrorMessage={ fieldName + " " + "is required" }
                    placeholder={ "Select your" + " " + fieldName }
                    type="dropdown"
                    value={ profileInfo.get(schema.name) }
                    children={ [ {
                        "data-testid": `${ testId }-profile-form-country-dropdown-empty` as string,
                        key: "empty-country" as string,
                        text: "Select your country" as string,
                        value: "" as string
                    } ].concat(
                        countryList
                            ? countryList.map((list: DropdownItemProps) => {
                                return {
                                    "data-testid": `${ testId }-profile-form-country-dropdown-` +  list.value as string,
                                    flag: list.flag,
                                    key: list.key as string,
                                    text: list.text as string,
                                    value: list.value as string
                                };
                            })
                            : []
                    ) }
                    key={ key }
                    disabled={ false }
                    readOnly={ isReadOnly || schema.mutability === ProfileConstants.READONLY_SCHEMA }
                    clearable={ !schema.required }
                    search
                    selection
                    fluid
                />
            );
        } else if (schema?.name === "locale") {
            return (
                <Field
                    data-testid={ `${ testId }-profile-form-${ schema?.name }-input` }
                    name={ schema?.name }
                    label={ fieldName }
                    required={ schema?.required }
                    requiredErrorMessage={
                        t("user:profile.forms.generic.inputs.validations.empty", { fieldName })
                    }
                    placeholder={
                        t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName })
                    }
                    type="dropdown"
                    value={ normalizeLocaleFormat(profileInfo.get(schema?.name), LocaleJoiningSymbol.HYPHEN) }
                    children={ [ {
                        "data-testid": `${ testId }-profile-form-locale-dropdown-empty` as string,
                        key: "empty-locale" as string,
                        text: t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName }) as string,
                        value: "" as string
                    } ].concat(
                        supportedI18nLanguages
                            ? Object.keys(supportedI18nLanguages).map((key: string) => {
                                return {
                                    "data-testid": `${ testId }-profile-form-locale-dropdown-`
                                        +  supportedI18nLanguages[key].code as string,
                                    flag: supportedI18nLanguages[key].flag,
                                    key: supportedI18nLanguages[key].code as string,
                                    text: `${supportedI18nLanguages[key].name as string},
                                                ${supportedI18nLanguages[key].code as string}`,
                                    value: supportedI18nLanguages[key].code as string
                                };
                            })
                            : []
                    ) }
                    key={ key }
                    disabled={ false }
                    readOnly={ isReadOnly || schema?.mutability === ProfileConstants.READONLY_SCHEMA }
                    clearable={ !schema?.required }
                    search
                    selection
                    fluid
                />
            );
        } else {
            return (
                <Field
                    data-testid={ `${ testId }-profile-form-${ schema.name }-input` }
                    name={ schema.name }
                    label={ schema.name === "profileUrl" ? "Profile Image URL" :
                        (  (!commonConfig.userEditSection.showEmail && schema.name === "userName")
                            ? fieldName +" (Email)"
                            : fieldName
                        )
                    }
                    required={ schema.required }
                    requiredErrorMessage={ fieldName + " " + "is required" }
                    placeholder={ "Enter your" + " " + fieldName }
                    type="text"
                    value={ profileInfo.get(schema.name) }
                    key={ key }
                    disabled={ schema.name === "userName" }
                    readOnly={ isReadOnly || schema.mutability === ProfileConstants.READONLY_SCHEMA }
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
                            ? 1024
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
        return (!isEmpty(profileInfo.get(schema.name)) ||
            (!isReadOnly && (schema.mutability !== ProfileConstants.READONLY_SCHEMA)));
    };

    /**
     * This function generates the user profile details form based on the input Profile Schema
     *
     * @param schema - The profile schema to be used to generate the form.
     * @param key - The key for form field the profile schema.
     * @returns the form field for the profile schema.
     */
    const generateProfileEditForm = (schema: ProfileSchemaInterface, key: number): JSX.Element => {
        const fieldName: string = t("user:profile.fields." +
            schema.name.replace(".", "_"), { defaultValue: schema.displayName }
        );

        const domainName: string[] = profileInfo?.get(schema.name)?.toString().split("/");

        return (
            <Grid.Row columns={ 1 } key={ key }>
                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                    {
                        schema.name === "userName" && domainName.length > 1 ? (
                            <>
                                {
                                    adminUserType === "internal" ? (
                                        <Form.Field>
                                            <label>
                                                { !commonConfig.userEditSection.showEmail
                                                    ? fieldName + " (Email)"
                                                    : fieldName
                                                }
                                            </label>
                                            <Input
                                                data-testid={ `${ testId }-profile-form-${ schema.name }-input` }
                                                name={ schema.name }
                                                required={ schema.required }
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
                                                { !commonConfig.userEditSection.showEmail
                                                    ? fieldName + " (Email)"
                                                    : fieldName
                                                }
                                            </label>
                                            <Input
                                                data-testid={ `${ testId }-profile-form-${ schema.name }-input` }
                                                name={ schema.name }
                                                label={ domainName[0] + " / " }
                                                required={ schema.required }
                                                requiredErrorMessage={ fieldName + " " + "is required" }
                                                placeholder={ "Enter your" + " " + fieldName }
                                                type="text"
                                                value={ domainName[1] }
                                                key={ key }
                                                readOnly={ isReadOnly ||
                                                    schema.mutability === ProfileConstants.READONLY_SCHEMA }
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

    return (
        !isReadOnlyUserStoresLoading
            ? (<>
                {
                    !isEmpty(profileInfo) && (
                        <EmphasizedSegment padded="very">
                            {
                                (isReadOnly && !isEmpty(tenantAdmin)) && editUserDisclaimerMessage
                            }
                            <Forms
                                data-testid={ `${ testId }-form` }
                                onSubmit={ (values: Map<string, string | string[]>) => handleSubmit(values) }
                            >
                                <Grid>
                                    {
                                        user.id && (
                                            <Grid.Row columns={ 1 }>
                                                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                                                    <Form.Field>
                                                        <label>
                                                            { t("user:profile.fields.userId") }
                                                        </label>
                                                        <Input
                                                            name="userID"
                                                            type="text"
                                                            value={ user.id }
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
                                                || (!commonConfig.userEditSection.showEmail &&
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
                                                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                                                    <Field
                                                        data-testid={ `${ testId }-profile-form-one-time-pw }
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
                                                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
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
                                                <Grid.Column mobile={ 12 } tablet={ 12 } computer={ 6 }>
                                                    <Form.Field>
                                                        <label>
                                                            { t("user:profile.fields." +
                                                                    "modifiedDate") }
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
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                            {
                                                !isReadOnly && (
                                                    <Button
                                                        data-testid={ `${ testId }-form-update-button` }
                                                        primary
                                                        type="submit"
                                                        size="small"
                                                        className="form-button"
                                                        loading={ isSubmitting }
                                                        disabled={ isSubmitting }
                                                    >
                                                        Update
                                                    </Button>
                                                )
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Forms>
                        </EmphasizedSegment>
                    )
                }
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
                />
            </>)
            : <ContentLoader dimmer/>
    );
};

/**
 * User profile component default props.
 */
UserProfile.defaultProps = {
    adminUserType: "None",
    "data-testid": "user-mgt-user-profile",
    isReadOnlyUserStore: false
};
