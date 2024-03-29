/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {EnvironmentActionTypes, SetCurrentEnvironmentActionInterface, SetLoggedInUserIdActionInterface} from "./types/enviroment";
import {EnvironmentInfo} from "../../../../extensions/components/tenants/models";

/**
 * Redux action to set the current environment.
 *
 * @param environment
 */
export const setCurrentEnvironment = (environment: EnvironmentInfo): SetCurrentEnvironmentActionInterface => {
    return {
        payload: environment,
        type: EnvironmentActionTypes.SET_CURRENT_ENVIRONMENT
    };
};

export const setLoggedInUserId = (userId: string): SetLoggedInUserIdActionInterface => {
    return {
        payload: userId,
        type: EnvironmentActionTypes.SET_LOGGED_IN_USER_ID
    };
};
