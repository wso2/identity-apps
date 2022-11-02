/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { RouteInterface } from "@wso2is/core/src/models";

export enum RoutesActionTypes {
    SET_FILTERED_MANAGE_ROUTES = "SET_FILTERED_MANAGE_ROUTES",
    SET_SANITIZED_MANAGE_ROUTES = "SET_SANITIZED_MANAGE_ROUTES",
    SET_FILTERED_DEVELOP_ROUTES = "SET_FILTERED_DEVELOP_ROUTES",
    SET_SANITIZED_DEVELOP_ROUTES = "SET_SANITIZED_DEVELOP_ROUTES",
    SET_SELECTED_ROUTE = "SET_SELECTED_ROUTE"
}

export interface SetFilteredManageRoutesActionInterface {
    payload: RouteInterface[];
    type: RoutesActionTypes.SET_FILTERED_MANAGE_ROUTES;
}

export interface SetFilteredDevelopRoutesActionInterface {
    payload: RouteInterface[];
    type: RoutesActionTypes.SET_FILTERED_DEVELOP_ROUTES;
}

export interface SetSanitizedManageRoutesActionInterface {
    payload: RouteInterface[];
    type: RoutesActionTypes.SET_SANITIZED_MANAGE_ROUTES;
}

export interface SetSanitizedDevelopRoutesActionInterface {
    payload: RouteInterface[];
    type: RoutesActionTypes.SET_SANITIZED_DEVELOP_ROUTES;
}

/**
 * Action interface for the selected route action.
 */
export interface SetSelectedRouteActionInterface {
    payload: RouteInterface;
    type: RoutesActionTypes.SET_SELECTED_ROUTE;
}

export type RoutesAction = SetFilteredDevelopRoutesActionInterface |
    SetFilteredManageRoutesActionInterface |
    SetSanitizedDevelopRoutesActionInterface |
    SetSanitizedManageRoutesActionInterface |
    SetSelectedRouteActionInterface;
