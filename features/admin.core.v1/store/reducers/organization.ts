/**
 * Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

import { OrganizationManagementConstants, OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { OrganizationReducerStateInterface } from "../../models/reducer-state";
import { OrganizationAction, OrganizationActionTypes } from "../actions/types/organization";

const initialState: OrganizationReducerStateInterface = {
    currentOrganization: "",
    getOrganizationLoading: true,
    isFirstLevelOrganization: false,
    organization: {
        attributes: [],
        created: new Date().toString(),
        description: "",
        domain: "",
        id: OrganizationManagementConstants.ROOT_ORGANIZATION.id,
        lastModified: new Date().toString(),
        name: OrganizationManagementConstants.ROOT_ORGANIZATION.name,
        orgHandle: OrganizationManagementConstants.ROOT_ORGANIZATION.orgHandle,
        parent: {
            id: "",
            ref: ""
        },
        status: "",
        type: ""
    },
    organizationType: OrganizationType.SUPER_ORGANIZATION,
    superAdmin: "",
    userOrganizationId: ""
};

export const organizationReducer = (
    state: OrganizationReducerStateInterface = initialState,
    action: OrganizationAction
): OrganizationReducerStateInterface => {
    switch (action.type) {
        case OrganizationActionTypes.SET_CURRENT_ORGANIZATION:
            return {
                ...state,
                currentOrganization: action.payload
            };
        case OrganizationActionTypes.SET_ORGANIZATION:
            return {
                ...state,
                organization: action.payload
            };
        case OrganizationActionTypes.SET_GET_ORGANIZATION_LOADING:
            return {
                ...state,
                getOrganizationLoading: action.payload
            };
        case OrganizationActionTypes.SET_IS_FIRST_LEVEL_ORGANIZATION:
            return {
                ...state,
                isFirstLevelOrganization: action.payload
            };
        case OrganizationActionTypes.SET_SUPER_ADMIN:
            return {
                ...state,
                superAdmin: action.payload
            };
        case OrganizationActionTypes.SET_ORGANIZATION_TYPE:
            return {
                ...state,
                organizationType: action.payload
            };
        case OrganizationActionTypes.SET_USER_ORGANIZATION_ID:
            return {
                ...state,
                userOrganizationId: action.payload
            };
        default:
            return {
                ...state
            };
    }
};
