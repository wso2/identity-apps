/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
