/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { OrganizationManagementConstants, OrganizationType } from "../../constants/organization-constants";
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
        parent: {
            id: "",
            ref: ""
        },
        status: "",
        type: ""
    },
    organizationType: OrganizationType.SUPER_ORGANIZATION
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
        case OrganizationActionTypes.SET_ORGANIZATION_TYPE:
            return {
                ...state,
                organizationType: action.payload
            };
        default:
            return {
                ...state
            };
    }
};
