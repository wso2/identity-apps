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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { AnyAction, Store, StoreEnhancer, applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import { reducers } from "./combine-reducers";

type ComponentInterface = IdentifiableComponentInterface;

/**
 * The type of state held by this store.
 */
export type AppState = ReturnType<typeof reducers>;

/**
 * The type of actions which may be dispatched by this store.
 */
export type AppActions = AnyAction;

/**
 * Enables the instantiation of a redux store which could be passed on
 * to the `Provider` supplied by the `react-redux` library.
 *
 * @return {Store<any, AnyAction> & Store<S & {}, A> & {dispatch: any}} Redux Store
 */
const configureStore = (): Store<any, AnyAction> & Store<AppState & ComponentInterface, AppActions> &
    { dispatch: any } => {

    const middleware = [
        thunk
    ];

    const middleWareEnhancer: StoreEnhancer<{ dispatch: any }> = applyMiddleware(...middleware);

    return createStore(
        reducers,
        composeWithDevTools(middleWareEnhancer)
    );
};

export const store = configureStore();
export * from "./actions";
