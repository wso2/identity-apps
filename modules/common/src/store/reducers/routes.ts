/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RoutesReducerStateInterface } from "../../models/reducer-state";
import { RoutesAction, RoutesActionTypes } from "../actions/types/routes";

const initialState: RoutesReducerStateInterface = {
    developeRoutes: {
        filteredRoutes: [],
        sanitizedRoutes: []
    },
    manageRoutes: {
        filteredRoutes: [],
        sanitizedRoutes: []
    }
};

export const routeReducer = (
    state: RoutesReducerStateInterface = initialState,
    action: RoutesAction
): RoutesReducerStateInterface => {
    switch (action.type) {
        case RoutesActionTypes.SET_FILTERED_DEVELOP_ROUTES:
            return {
                ...state,
                developeRoutes: {
                    ...state.developeRoutes,
                    filteredRoutes: action.payload
                }
            };
        case RoutesActionTypes.SET_FILTERED_MANAGE_ROUTES:
            return {
                ...state,
                manageRoutes: {
                    ...state.manageRoutes,
                    filteredRoutes: action.payload
                }
            };
        case RoutesActionTypes.SET_SANITIZED_MANAGE_ROUTES:
            return {
                ...state,
                manageRoutes: {
                    ...state.manageRoutes,
                    sanitizedRoutes: action.payload
                }
            };
        case RoutesActionTypes.SET_SANITIZED_DEVELOP_ROUTES:
            return {
                ...state,
                developeRoutes: {
                    ...state.developeRoutes,
                    sanitizedRoutes: action.payload
                }
            };
        default:
            return {
                ...state
            };
    }
};
