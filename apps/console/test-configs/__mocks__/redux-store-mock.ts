/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * @fileoverview Mocks the Redux store.
 */

import { Middleware } from "redux";
import configureStore, { MockStoreCreator } from "redux-mock-store";
import thunk from "redux-thunk";

/**
 * Middleware for the Redux store.
 * @see {@link src/features/core/store/index.ts} for middleware used in the actual store.
 */
const middleware: Middleware[] = [
    thunk
];

/**
 * Configure mock store.
 * @type {MockStoreCreator<any, Dispatch<AnyAction>>}
 */
export const mockStore: MockStoreCreator<any, Record<string, unknown>> = configureStore(middleware);
