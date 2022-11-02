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

import { OrganizationType } from "../../../../organizations/constants";
import { OrganizationResponseInterface } from "../../../../organizations/models";

export enum OrganizationActionTypes {
    SET_ORGANIZATION = "SET_ORGANIZATION",
    SET_GET_ORGANIZATION_LOADING = "SET_GET_ORGANIZATION_LOADING",
    SET_IS_FIRST_LEVEL_ORGANIZATION = "SET_IS_FIRST_LEVEL_ORGANIZATION",
    SET_ORGANIZATION_TYPE = "SET_ORGANIZATION_TYPE"
}

export interface SetOrganizationActionInterface {
    payload: OrganizationResponseInterface;
    type: OrganizationActionTypes.SET_ORGANIZATION;
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
    | SetOrganizationActionInterface
    | SetGetOrganizationLoadingActionInterface
    | SetIsFirstLevelOrganizationInterface
    | SetOrganizationTypeInterface;
