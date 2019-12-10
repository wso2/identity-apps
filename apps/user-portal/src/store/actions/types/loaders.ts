/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

/**
 * Action type to set the loader for profile schema
 */
export const SET_PROFILE_SCHEMA_LOADER: ActionTypes = "SET_PROFILE_SCHEMA_LOADER";

/**
 * Action type to set the loader for profile info
 */
export const SET_PROFILE_INFO_LOADER: ActionTypes = "SET_PROFILE_INFO_LOADER";

/**
 * Type for loader action types
 */
export type ActionTypes = "SET_PROFILE_SCHEMA_LOADER" | "SET_PROFILE_INFO_LOADER";

/**
 * Loader action model
 */
export interface LoaderAction {
    payload: boolean;
    type: ActionTypes;
}
