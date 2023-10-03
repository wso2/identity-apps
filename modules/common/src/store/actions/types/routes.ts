/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RouteInterface } from "@wso2is/core/models";

export enum RoutesActionTypes {
    SET_FILTERED_MANAGE_ROUTES = "SET_FILTERED_MANAGE_ROUTES",
    SET_SANITIZED_MANAGE_ROUTES = "SET_SANITIZED_MANAGE_ROUTES",
    SET_FILTERED_DEVELOP_ROUTES = "SET_FILTERED_DEVELOP_ROUTES",
    SET_SANITIZED_DEVELOP_ROUTES = "SET_SANITIZED_DEVELOP_ROUTES"
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

export type RoutesAction = SetFilteredDevelopRoutesActionInterface |
    SetFilteredManageRoutesActionInterface |
    SetSanitizedDevelopRoutesActionInterface |
    SetSanitizedManageRoutesActionInterface;
