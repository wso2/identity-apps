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

import { combineReducers } from "redux";
import { applicationReducer, authenticateReducer, globalReducer } from "./reducers";
import { LoadersReducer } from "./reducers/loaders";
import { identityProviderReducer } from "./reducers/identity-provider";
import { commonConfigReducer } from "@wso2is/core/store";
import { DeploymentConfigInterface } from "../models";

/**
 * Combines all the reducers.
 *
 * @type {Reducer<any>} Root reducer to be used when creating the store.
 */
export const reducers = combineReducers({
    identityProvider: identityProviderReducer,
    application: applicationReducer,
    authenticationInformation: authenticateReducer,
    config: commonConfigReducer<DeploymentConfigInterface>(),
    global: globalReducer,
    loaders: LoadersReducer
});
