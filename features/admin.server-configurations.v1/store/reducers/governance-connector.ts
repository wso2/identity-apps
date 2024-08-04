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
