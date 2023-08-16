/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { GovernanceConnectorsInterface } from "../../models";
import {
    GovernanceConnectorActionTypes,
    GovernanceConnectorActions
} from "../actions/types";

/**
 * Governance Connector reducer initial state.
 */
const initialState: GovernanceConnectorsInterface = {
    categories: []
};

/**
 * Reducer to handle the state of governance connectors related actions.
 *
 * @param state - Previous state
 * @param action - Action type.
 * @returns The new state
 */
export const governanceConnectorReducer = (state: GovernanceConnectorsInterface = initialState,
    action: GovernanceConnectorActions): GovernanceConnectorsInterface => {

    switch (action.type) {
        case GovernanceConnectorActionTypes.SET_GOVERNANCE_CONNECTOR_CATEGORY:
            return {
                ...state,
                categories: action.payload.categories
            };
        default:
            return { ...state };
    }
};
