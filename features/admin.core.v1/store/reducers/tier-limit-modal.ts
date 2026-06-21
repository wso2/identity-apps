/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { TierLimitModalReducerStateInterface } from "../../models/reducer-state";
import {
    TierLimitModalActionInterface,
    TierLimitModalActionTypes
} from "../actions/types/tier-limit-modal";

const initialState: TierLimitModalReducerStateInterface = {
    actionLabel: "",
    description: "",
    header: "",
    message: "",
    open: false
};

export const tierLimitModalReducer = (
    state: TierLimitModalReducerStateInterface = initialState,
    action: TierLimitModalActionInterface
): TierLimitModalReducerStateInterface => {
    switch (action.type) {
        case TierLimitModalActionTypes.SHOW_TIER_LIMIT_REACHED_MODAL:
            return {
                ...action.payload,
                open: true
            };
        case TierLimitModalActionTypes.HIDE_TIER_LIMIT_REACHED_MODAL:
            return initialState;
        default:
            return state;
    }
};
