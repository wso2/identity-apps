/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { LoadersInterface } from "../../models";
import { LoaderAction, SET_PROFILE_INFO_LOADER, SET_PROFILE_SCHEMA_LOADER } from "../actions/types";

const initialState: LoadersInterface = {
    isProfileInfoLoading: false,
    isProfileSchemaLoading: false
};

export const LoadersReducer = (state: LoadersInterface = initialState, action: LoaderAction): LoadersInterface => {
    switch (action.type) {
        case SET_PROFILE_INFO_LOADER:
            return {
                ...state,
                isProfileInfoLoading: action.payload
            };
        case SET_PROFILE_SCHEMA_LOADER:
            return {
                ...state,
                isProfileSchemaLoading: action.payload
            };
        default:
            return state;
    }
};
