/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { GlobalActionTypes, SetActiveViewAction } from "./types";
import { AppViewTypes } from "../../models";

/**
 * Set the active view of the Application.
 * Whether it's DEVELOP, MANAGE etc.
 *
 * @param {AppViewTypes} payload - Active view.
 *
 * @return {SetActiveViewAction}
 */
export const setActiveView = (payload: AppViewTypes): SetActiveViewAction => ({
    payload,
    type: GlobalActionTypes.SET_ACTIVE_VIEW
});
