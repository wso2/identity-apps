/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    LinkedAccountInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface
} from "@wso2is/core/models";
import {
    commonConfigReducer,
    commonProfileReducer,
    commonRequestLoadersReducer
} from "@wso2is/core/store";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { accessControlReducer } from "./reducers/access-control";
import { commonProfileReducerInitialState } from "./reducers/profile";
import { commonRequestLoadersInitialState } from "./reducers/loaders";
import { globalReducer } from "./reducers/global";
import { helpPanelReducer } from "./reducers/help-panel";
import { organizationReducer } from "./reducers/organization";
import { routeReducer } from "./reducers/routes";

/**
 * Combines all the reducers.
 *
 * @type {Reducer<any>} Root reducer to be used when creating the store.
 */
export const reducers = combineReducers({
    accessControl: accessControlReducer,
    config: null,
    form: formReducer,
    global: globalReducer,
    helpPanel: helpPanelReducer,
    loaders: commonRequestLoadersReducer(commonRequestLoadersInitialState),
    organization: organizationReducer,
    profile: commonProfileReducer<
        ProfileInfoInterface,
        ProfileSchemaInterface[],
        LinkedAccountInterface[]
        >(commonProfileReducerInitialState),
    routes: routeReducer
});
