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

import { CommonConfigActions, CommonConfigActionTypes } from "../actions/types";
import { CommonConfigReducerStateInterface } from "../../models";

/**
 * Initial state.
 */
export const commonConfigReduceInitialState: CommonConfigReducerStateInterface<any> = {
    deployment: {}
};

/**
 * Reducer to handle the state of common config actions.
 *
 * @param {CommonConfigReducerStateInterface<T>} state - Previous state.
 * @param {CommonConfigActions} action - Actions.
 *
 * @return The new state.
 */
export const commonConfigReducer = <T>() => (
    state: CommonConfigReducerStateInterface<T> = commonConfigReduceInitialState,
    action: CommonConfigActions<T>
) => {

    switch (action.type) {
        case CommonConfigActionTypes.SET_DEPLOYMENT_CONFIGS:
            return {
                ...state,
                deployment: action.payload
            };
        default:
            return state;
    }
};
