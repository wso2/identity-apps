/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { CommonConfigReducerStateInterface } from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import {
    DeploymentConfigInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "./app-config";

/**
 * Dev portal config reducer state interface.
 */
export type ConfigReducerStateInterface = CommonConfigReducerStateInterface<
    DeploymentConfigInterface,
    ServiceResourceEndpointsInterface,
    FeatureConfigInterface,
    I18nModuleOptionsInterface,
    UIConfigInterface>;

/**
 * Organization Reducer State Interface.
 */
export interface OrganizationReducerStateInterface {
    organizationType: OrganizationType;
    userOrganizationId: string;
}
