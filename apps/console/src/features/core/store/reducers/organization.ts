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

import { OrganizationManagementConstants } from "../../../organizations/constants";
import { OrganizationReducerStateInterface } from "../../models";
import { OrganizationAction, OrganizationActionTypes } from "../actions/types";

const initialState: OrganizationReducerStateInterface = {
    getOrganizationLoading: true,
    organization: OrganizationManagementConstants.ROOT_ORGANIZATION
};

export const organizationReducer = (
    state: OrganizationReducerStateInterface = initialState,
    action: OrganizationAction
): OrganizationReducerStateInterface => {
    switch (action.type) {
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
        default:
            return {
                ...state
            };
    }
};
