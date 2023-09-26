/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { OrganizationType } from "../../../constants/organization-constants";
import { OrganizationResponseInterface } from "../../../models/common";

export enum OrganizationActionTypes {
    SET_ORGANIZATION = "SET_ORGANIZATION",
    SET_CURRENT_ORGANIZATION = "SET_CURRENT_ORGANIZATION",
    SET_GET_ORGANIZATION_LOADING = "SET_GET_ORGANIZATION_LOADING",
    SET_IS_FIRST_LEVEL_ORGANIZATION = "SET_IS_FIRST_LEVEL_ORGANIZATION",
    SET_ORGANIZATION_TYPE = "SET_ORGANIZATION_TYPE"
}

export interface SetOrganizationActionInterface {
    payload: OrganizationResponseInterface;
    type: OrganizationActionTypes.SET_ORGANIZATION;
}

export interface SetCurrentOrganizationActionInterface {
    payload: string;
    type: OrganizationActionTypes.SET_CURRENT_ORGANIZATION;
}

export interface SetGetOrganizationLoadingActionInterface {
    payload: boolean;
    type: OrganizationActionTypes.SET_GET_ORGANIZATION_LOADING;
}

export interface SetIsFirstLevelOrganizationInterface {
    payload: boolean;
    type: OrganizationActionTypes.SET_IS_FIRST_LEVEL_ORGANIZATION;
}

export interface SetOrganizationTypeInterface {
    payload: OrganizationType;
    type: OrganizationActionTypes.SET_ORGANIZATION_TYPE;
}

export type OrganizationAction =
    | SetCurrentOrganizationActionInterface
    | SetOrganizationActionInterface
    | SetGetOrganizationLoadingActionInterface
    | SetIsFirstLevelOrganizationInterface
    | SetOrganizationTypeInterface;
