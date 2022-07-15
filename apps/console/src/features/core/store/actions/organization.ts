/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
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

import { OrganizationActionTypes, SetGetOrganizationLoadingActionInterface, SetOrganizationActionInterface } from "./types";
import { OrganizationInterface } from "../../../organizations/models";

/**
 * This action sets an organization in the redux store.
 *
 * @param {OrganizationInterface} organization - AN organization object
 *
 * @returns {SetOrganizationActionInterface} - A set organization action
 */
export const setOrganization = (organization: OrganizationInterface): SetOrganizationActionInterface => {
    return {
        payload: organization,
        type: OrganizationActionTypes.SET_ORGANIZATION
    };
};

/**
 * This action sets the loading state of the get organization API.
 *
 * @param {boolean} isLoading - A boolean value to set the loading state of the organization
 * @returns {SetGetOrganizationLoadingActionInterface} - A set get organization loading action
 */
export const setGetOrganizationLoading = (isLoading: boolean): SetGetOrganizationLoadingActionInterface => {
    return {
        payload: isLoading,
        type: OrganizationActionTypes.SET_GET_ORGANIZATION_LOADING
    };
};
