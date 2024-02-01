/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { OrganizationType } from "@wso2is/common";

export enum OrganizationActionTypes {
    SET_ORGANIZATION_TYPE = "SET_ORGANIZATION_TYPE",
    SET_USER_ORGANIZATION_ID = "SET_USER_ORGANIZATION_ID"
}

export interface SetOrganizationTypeInterface {
    payload: OrganizationType;
    type: OrganizationActionTypes.SET_ORGANIZATION_TYPE;
}

export interface SetUserOrganizationIdInterface {
    payload: string;
    type: OrganizationActionTypes.SET_USER_ORGANIZATION_ID;
}

export type OrganizationAction =
    | SetOrganizationTypeInterface
    | SetUserOrganizationIdInterface;
