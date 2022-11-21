/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
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

import { RoutesReducerStateInterface } from "../../models";
import { RoutesAction, RoutesActionTypes } from "../actions/types";

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
