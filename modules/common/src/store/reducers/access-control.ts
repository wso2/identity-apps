/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AccessControlReducerStateInterface } from "../../models/reducer-state";
import { AccessControlActionType, AccessControlActions } from "../actions/types/access-control";
 
/**
  * Common access control reducer initial state.
  */
const initialState: AccessControlReducerStateInterface = {
    isDevelopAllowed: true,
    isManageAllowed: true
};
 
/**
 * Reducer to handle the state of access control related actions.
 *
 * @param {AccessControlReducerStateInterface} state - Previous state
 * @param {AccessControlActionType} action - Action type.
 * @returns The new state
 */
export const accessControlReducer = (state: AccessControlReducerStateInterface = initialState,
    action: AccessControlActions): AccessControlReducerStateInterface => {

    switch (action.type) {
        case AccessControlActionType.SET_DEVELOPER_VISIBILITY:
            return {
                ...state,
                isDevelopAllowed: action.payload
            };
        case AccessControlActionType.SET_MANAGE_VISIBILITY:
            return {
                ...state,
                isManageAllowed: action.payload
            };
        default:
            return state;
    }
};
