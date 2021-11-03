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

import { ApplicationReducerStateInterface } from "../../models";
import { ApplicationActionTypes, ApplicationActions } from "../actions/types";

/**
 * Common profile reducer initial state.
 */
const initialState: ApplicationReducerStateInterface = {
    groupedTemplates: undefined,
    meta: {
        customInboundProtocolChecked: false,
        customInboundProtocols: [],
        inboundProtocols: [],
        protocolMeta: {}
    },
    oidcConfigurations: undefined,
    samlConfigurations: undefined,
    templates: undefined
};

/**
 * Reducer to handle the state of application related actions.
 *
 * @param {ApplicationReducerStateInterface} state - Previous state
 * @param {ApplicationActions} action - Action type.
 * @returns The new state
 */
export const applicationReducer = (state: ApplicationReducerStateInterface = initialState,
    action: ApplicationActions): ApplicationReducerStateInterface => {

    switch (action.type) {
        case ApplicationActionTypes.SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META:
            return {
                ...state,
                meta: {
                    ...state.meta,
                    inboundProtocols: action.payload
                }
            };
        case ApplicationActionTypes.SET_AVAILABLE_CUSTOM_INBOUND_AUTH_PROTOCOL_META:
            return {
                ...state,
                meta: {
                    ...state.meta,
                    customInboundProtocols: action.payload
                }
            };
        case ApplicationActionTypes.CHECK_CUSTOM_INBOUND_AUTH_PROTOCOL_META:
            return {
                ...state,
                meta: {
                    ...state.meta,
                    customInboundProtocolChecked: action.payload
                }
            };
        case ApplicationActionTypes.SET_AUTH_PROTOCOL_META:
            return {
                ...state,
                meta: {
                    ...state.meta,
                    protocolMeta: {
                        ...state.meta.protocolMeta,
                        ...action.payload
                    }
                }
            };
        case ApplicationActionTypes.SET_APPLICATION_TEMPLATES:
            return {
                ...state,
                templates: action.payload
            };
        case ApplicationActionTypes.SET_GROUPED_APPLICATION_TEMPLATES:
            return {
                ...state,
                groupedTemplates: action.payload
            };
        case ApplicationActionTypes.SET_OIDC_APPLICATION_CONFIGURATIONS:
            return {
                ...state,
                oidcConfigurations: action.payload
            };
        case ApplicationActionTypes.SET_SAML_APPLICATION_CONFIGURATIONS:
            return {
                ...state,
                samlConfigurations: action.payload
            };
        default:
            return state;
    }
};
