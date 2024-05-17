/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AuthenticatedUserInfo } from "@asgardeo/auth-react";
import {
    LinkedAccountInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import {
    commonAuthenticateReducer,
    commonConfigReducer,
    commonProfileReducer,
    commonRequestLoadersReducer
} from "@wso2is/core/store";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import { Reducer, combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import {
    accessControlReducer,
    commonConfigReducerInitialState,
    commonProfileReducerInitialState,
    commonRequestLoadersInitialState,
    globalReducer,
    helpPanelReducer,
    organizationReducer
} from "./reducers";
import { routeReducer } from "./reducers/routes";
import { applicationReducer } from "@wso2is/admin.applications.v1/store";
import { commonAuthenticateReducerInitialState } from "@wso2is/admin.authentication.v1/store";
import { identityProviderReducer } from "@wso2is/admin.identity-providers.v1/store";
import {
    AuthReducerStateInterface,
    DeploymentConfigInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "../models";

/**
 * Combines all the reducers.
 */
export const reducers: Reducer = combineReducers({
    accessControl: accessControlReducer,
    application: applicationReducer,
    auth: commonAuthenticateReducer<
        AuthReducerStateInterface,
        AuthenticatedUserInfo>(commonAuthenticateReducerInitialState),
    config: commonConfigReducer<
        DeploymentConfigInterface,
        ServiceResourceEndpointsInterface,
        FeatureConfigInterface,
        I18nModuleOptionsInterface,
        UIConfigInterface
        >(commonConfigReducerInitialState),
    form: formReducer,
    global: globalReducer,
    helpPanel: helpPanelReducer,
    identityProvider: identityProviderReducer,
    loaders: commonRequestLoadersReducer(commonRequestLoadersInitialState),
    organization: organizationReducer,
    profile: commonProfileReducer<
        ProfileInfoInterface,
        ProfileSchemaInterface[],
        LinkedAccountInterface[]
        >(commonProfileReducerInitialState),
    routes: routeReducer
});
