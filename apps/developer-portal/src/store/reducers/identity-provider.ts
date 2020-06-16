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

import { IdentityProviderReducerStateInterface } from "../../models";
import { IdentityProviderActionTypes, IdentityProviderActions } from "../actions/types";

/**
 * Common profile reducer initial state.
 */
const initialState: IdentityProviderReducerStateInterface = {
    meta: {
        authenticators: []
    }
};

/**
 * Reducer to handle the state of identity provider related actions.
 *
 * @param {IdentityProviderReducerStateInterface} state - Previous state
 * @param {IdentityProviderActions} action - Action type.
 * @returns {IdentityProviderReducerStateInterface} The new state
 */
export const identityProviderReducer = (state: IdentityProviderReducerStateInterface = initialState,
                                   action: IdentityProviderActions): IdentityProviderReducerStateInterface => {

    switch (action.type) {
        case IdentityProviderActionTypes.SET_AVAILABLE_AUTHENTICATOR_META:
            return {
                ...state,
                meta: {
                    ...state.meta,
                    authenticators: action.payload
                }
            };
        default:
            return state;
    }
};
