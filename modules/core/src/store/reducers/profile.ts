/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { CommonProfileReducerStateInterface, emptyProfileInfo } from "../../models";
import { ProfileActions, ProfileActionTypes } from "../actions/types";

/**
 * Common profile reducer initial state.
 */
export const commonProfileReducerInitialState: CommonProfileReducerStateInterface = {
    isSCIMEnabled: true,
    linkedAccounts: [],
    profileInfo: emptyProfileInfo(),
    profileSchemas: []
};

/**
 * Reducer to handle the state of profile related actions.
 *
 * @param {CommonProfileReducerStateInterface} state - Previous state
 * @param {ProfileActions} action - Action type
 * @returns The new state
 */
export const commonProfileReducer = (state: CommonProfileReducerStateInterface = commonProfileReducerInitialState,
                                     action: ProfileActions) => {

    switch (action.type) {
        case ProfileActionTypes.SET_PROFILE_INFO:
            return {
                ...state,
                profileInfo: action.payload
            };
        case ProfileActionTypes.SET_PROFILE_SCHEMAS:
            return {
                ...state,
                profileSchemas: action.payload
            };
        case ProfileActionTypes.SET_PROFILE_LINKED_ACCOUNTS:
            return {
                ...state,
                linkedAccounts: action.payload
            };
        case ProfileActionTypes.TOGGLE_SCIM_ENABLED:
            return {
                ...state,
                isSCIMEnabled: action.payload
            };
        default:
            return state;
    }
};
