/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
import { applicationReducer } from "../../applications/store";
import { commonAuthenticateReducerInitialState } from "../../authentication/store";
import { identityProviderReducer } from "../../identity-providers/store";
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
