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

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { reducers } from "./combine-reducers";
import { apiMiddleware } from "./middleware";

/**
 * Type of the Redux store.
 */
export type AppState = ReturnType<typeof reducers>;

/**
 * Enables the instantiation of a redux store which could be passed on
 * to the `Provider` supplied by the `react-redux` library.
 *
 * @return {Store<any, AnyAction> & Store<S & {}, A> & {dispatch: any}} Redux Store
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const configureStore = (): any => {
    // Set of custom middleware.
    const middleware = [
        apiMiddleware,
        thunk
    ];
    const middleWareEnhancer = applyMiddleware(...middleware);

    return createStore(
        reducers,
        composeWithDevTools(middleWareEnhancer)
    );
};

export const store = configureStore();
