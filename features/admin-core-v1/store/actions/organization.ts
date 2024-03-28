/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

import { Dispatch } from "redux";
import {
    OrganizationActionTypes,
    SetCurrentOrganizationActionInterface,
    SetGetOrganizationLoadingActionInterface,
    SetIsFirstLevelOrganizationInterface,
    SetOrganizationActionInterface,
    SetOrganizationTypeInterface,
    SetSuperAdminTypeInterface,
    SetUserOrganizationIdInterface
} from "./types";
import { OrganizationType } from "../../../organizations/constants";
import { OrganizationResponseInterface } from "../../../organizations/models";
import { ServerConfigurationsInterface, getServerConfigs } from "../../../server-configurations";

/**
 * This action sets an organization in the redux store.
 *
 * @param organization - AN organization object
 *
 * @returns - A set organization action
 */
export const setOrganization = (organization: OrganizationResponseInterface): SetOrganizationActionInterface => {
    return {
        payload: organization,
        type: OrganizationActionTypes.SET_ORGANIZATION
    };
};

/**
 * This action sets the current organization in the redux store.
 *
 * @param orgName - The current organization
 *
 * @returns - A set current organization action
 */
export const setCurrentOrganization = (orgName: string): SetCurrentOrganizationActionInterface => {
    return {
        payload: orgName,
        type: OrganizationActionTypes.SET_CURRENT_ORGANIZATION
    };
};

/**
 * This action sets the user organization id in the redux store.
 *
 * @param orgId - The user organization id
 *
 * @returns - A set user organization id action
 */
export const setUserOrganizationId = (orgId: string): SetUserOrganizationIdInterface => {
    return {
        payload: orgId,
        type: OrganizationActionTypes.SET_USER_ORGANIZATION_ID
    };
};

/**
 * This action sets the loading state of the get organization API.
 *
 * @param isLoading - A boolean value to set the loading state of the organization
 * @returns - A set get organization loading action
 */
export const setGetOrganizationLoading = (isLoading: boolean): SetGetOrganizationLoadingActionInterface => {
    return {
        payload: isLoading,
        type: OrganizationActionTypes.SET_GET_ORGANIZATION_LOADING
    };
};

/**
 * This action sets if the current organization is a first level organization.
 *
 * @param isFirstLevel - A boolean value to set the loading state of the organization
 *
 * @returns - An action that sets the if it is a first level organization.
 */
export const setIsFirstLevelOrganization = (isFirstLevel: boolean): SetIsFirstLevelOrganizationInterface => {
    return {
        payload: isFirstLevel,
        type: OrganizationActionTypes.SET_IS_FIRST_LEVEL_ORGANIZATION
    };
};

/**
 * Sets the organization type.
 *
 * @param orgType - The organization type.
 * @returns Redux action
 */
export const setOrganizationType = (orgType: OrganizationType): SetOrganizationTypeInterface => {
    return {
        payload: orgType,
        type: OrganizationActionTypes.SET_ORGANIZATION_TYPE
    };
};

export const setSuperAdmin = (admin: string): SetSuperAdminTypeInterface => {
    return {
        payload: admin,
        type: OrganizationActionTypes.SET_SUPER_ADMIN
    };
};

export const getServerConfigurations = () => (dispatch: Dispatch): void => {
    getServerConfigs()
        .then((response: ServerConfigurationsInterface) => {
            const adminUser: string = response?.realmConfig.adminUser;

            dispatch(setSuperAdmin(adminUser));
        });
};
