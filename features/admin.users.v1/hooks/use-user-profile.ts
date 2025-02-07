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

import { AppState } from "@wso2is/admin.core.v1/store";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { userConfig } from "@wso2is/admin.extensions.v1/configs/user";
import { searchRoleList } from "@wso2is/admin.roles.v2/api/roles";
import { SearchRoleInterface } from "@wso2is/admin.roles.v2/models/roles";
import { ConnectorPropertyInterface } from "@wso2is/admin.server-configurations.v1/models/governance-connectors";
import { TenantInfo } from "@wso2is/admin.tenants.v1/models";
import { getAssociationType } from "@wso2is/admin.tenants.v1/utils/tenants";
import { ProfileConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, ProfileSchemaInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ProfileUtils } from "@wso2is/core/utils";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    AdminAccountTypes,
    CONNECTOR_PROPERTY_TO_CONFIG_STATUS_MAP,
    PASSWORD_RESET_PROPERTIES
} from "../constants/user-management-constants";
import { AccountConfigSettingsInterface } from "../models/user";

const EMAIL_ADDRESSES_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES");
const MOBILE_NUMBERS_ATTRIBUTE: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS");

/**
 * Interface to define the inputs accepted by the component hook.
 */
interface UserProfileComponentProps {
    connectorProperties: ConnectorPropertyInterface[],
    adminUserType: string
}

/**
 * Interface to define the structure of data required by the UserProfile
 * component for rendering.
 */
interface UserProfileComponentData {
    /**
     * ID of the administrator role.
     */
    adminRoleId: string;
    /**
     * Association type.
     */
    associationType: string;
    /**
     * User account configuration settings.
     */
    configSettings: AccountConfigSettingsInterface;
    /**
     * user profile schema.
     */
    profileSchema: ProfileSchemaInterface[];
}

/**
 * Component hook to handle state and behaviour of the {@link UserProfile} component.
 *
 * @param userProfileComponentProps - a subset of props passed to UserProfile component.
 *
 * @returns UserProfileComponentData
 */
export default function useUserProfile ({
    connectorProperties,
    adminUserType
}: UserProfileComponentProps): UserProfileComponentData {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ configSettings, setConfigSettings ] = useState<AccountConfigSettingsInterface>({
        accountDisable: "false",
        accountLock: "false",
        forcePasswordReset: "false",
        isEmailVerificationEnabled: "false",
        isMobileVerificationByPrivilegeUserEnabled: "false",
        isMobileVerificationEnabled: "false"
    });

    const [ associationType, setAssociationType ] = useState<string>("");
    const [ profileSchema, setProfileSchema ] = useState<ProfileSchemaInterface[]>();
    const [ adminRoleId, setAdminRoleId ] = useState<string>("");

    const authUserTenants: TenantInfo[] = useSelector((state: AppState) => state?.auth?.tenants);
    const currentOrganization: string =  useSelector((state: AppState) => state?.config?.deployment?.tenant);
    const profileSchemas: ProfileSchemaInterface[] = useSelector((state: AppState) => state.profile.profileSchemas);


    useEffect(() => {
        // This will load authenticated user's association type to the current organization.
        setAssociationType(getAssociationType(authUserTenants, currentOrganization));

        if (adminUserType === AdminAccountTypes.INTERNAL && userConfig?.enableAdminPrivilegeRevokeOption) {
            // Admin role ID is only used by internal admins.
            getAdminRoleId();
        }
    }, []);
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
     * Sort the elements of the profileSchema state accordingly by the displayOrder attribute in the ascending order.
     */
    useEffect(() => {

        const getDisplayOrder = (schema: ProfileSchemaInterface): number => {
            if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE
                && (!schema.displayOrder || schema.displayOrder == "0")) return 6;
            if (schema.name === MOBILE_NUMBERS_ATTRIBUTE
                && (!schema.displayOrder || schema.displayOrder == "0")) return 7;

            return schema.displayOrder ? parseInt(schema.displayOrder, 10) : -1;
        };

        const sortedSchemas: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas([ ...profileSchemas ])
            .filter((item: ProfileSchemaInterface) =>
                item.name !== ProfileConstants?.SCIM2_SCHEMA_DICTIONARY.get("META_VERSION"))
            .sort((a: ProfileSchemaInterface, b: ProfileSchemaInterface) => {
                const orderA: number = getDisplayOrder(a);
                const orderB: number = getDisplayOrder(b);

                if (orderA === -1) {
                    return -1;
                } else if (orderB === -1) {
                    return 1;
                } else {
                    return orderA - orderB;
                }
            });

        setProfileSchema(sortedSchemas);
    }, [ profileSchemas ]);


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

    return {
        adminRoleId,
        associationType,
        configSettings,
        profileSchema
    };
}
