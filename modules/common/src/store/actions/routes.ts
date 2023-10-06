/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RouteInterface } from "@wso2is/core/models";
import {
    RoutesActionTypes,
    SetFilteredDevelopRoutesActionInterface,
    SetFilteredManageRoutesActionInterface,
    SetSanitizedDevelopRoutesActionInterface,
    SetSanitizedManageRoutesActionInterface
} from "./types/routes";

export const setFilteredManageRoutes = (routes: RouteInterface[]): SetFilteredManageRoutesActionInterface => {
    return {
        payload: routes,
        type: RoutesActionTypes.SET_FILTERED_MANAGE_ROUTES
    };
};

export const setFilteredDevelopRoutes = (routes: RouteInterface[]): SetFilteredDevelopRoutesActionInterface => {
    return {
        payload: routes,
        type: RoutesActionTypes.SET_FILTERED_DEVELOP_ROUTES
    };
};

export const setSanitizedManageRoutes = (routes: RouteInterface[]): SetSanitizedManageRoutesActionInterface => {
    return {
        payload: routes,
        type: RoutesActionTypes.SET_SANITIZED_MANAGE_ROUTES
    };
};

export const setSanitizedDevelopRoutes = (routes: RouteInterface[]): SetSanitizedDevelopRoutesActionInterface => {
    return {
        payload: routes,
        type: RoutesActionTypes.SET_SANITIZED_DEVELOP_ROUTES
    };
};
