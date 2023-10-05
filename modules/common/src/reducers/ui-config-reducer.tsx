/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { UIConfigAction, UIConfigActionTypes } from "../actions/ui-config";

/**
 * Reducer to handle the state of UI config related actions.
 */
export const UIConfigReducer = (state: any, action: UIConfigAction) => {
    switch (action.type) {
        case UIConfigActionTypes.SET_UI_CONFIG:
            return { ...state, UIConfig: action.payload };
        default:
            return state;
    }
};
