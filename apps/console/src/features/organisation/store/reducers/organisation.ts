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



/**
 * Common profile reducer initial state.
 */
const initialState = "";

/**
 * Reducer to handle the state of application related actions.
 *
 * @param {ApplicationReducerStateInterface} state - Previous state
 * @param {ApplicationActions} action - Action type.
 * @returns The new state
 */
export const organisationsReducer = (state = initialState,
                                   action) => {
    switch (action.type) {
        case "ORGANISATION_SEARCH":
            return action.payload;

        default:
            return state;
    }
};
