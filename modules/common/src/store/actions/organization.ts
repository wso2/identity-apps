/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    OrganizationActionTypes,
    SetCurrentOrganizationActionInterface,
    SetGetOrganizationLoadingActionInterface,
    SetIsFirstLevelOrganizationInterface,
    SetOrganizationActionInterface,
    SetOrganizationTypeInterface
} from "./types/organization";
import { OrganizationType } from "../../constants/organization-constants";
import { OrganizationResponseInterface } from "../../models/common";

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
