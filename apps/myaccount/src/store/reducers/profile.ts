
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

import { ProfileReducerStateInterface } from "../../models";
import { ProfileActionTypes, ProfileActions } from "../actions/types/profile";

/**
 * Initial state.
 */
const initialState: ProfileReducerStateInterface = {
    completion: null,
    isSCIMEnabled: true,
    linkedAccounts: []
};

/**
 * Reducer to handle the state of profile related actions.
 *
 * @param state - Previous state
 * @param action - Action type
 * @returns The new state
 */
export const profileReducer = (
    state: ProfileReducerStateInterface = initialState, action: ProfileActions): ProfileReducerStateInterface => {
    switch (action.type) {
        case ProfileActionTypes.SET_PROFILE_COMPLETION:
            return {
                ...state,
                completion: action.payload
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
