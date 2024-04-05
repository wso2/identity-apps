/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { Context, createContext } from "react";
import { AuthenticationSequenceInterface } from "../../admin.applications.v1/models/application";
import { BannerState } from "../models/banner-state";

export interface AILoginFlowContextInterface{
    // Add required properties here
    /**
     * Banner State of the AI login flow banner component
     */
    bannerState: BannerState;
    /**
     * State to hold the generated login flow.
     */
     aiGeneratedAiLoginFlow: AuthenticationSequenceInterface;
    /**
     * Callback function to set banner state.
     */
    setBannerState: (state: BannerState) => void;
}

const AILoginFlowContext: Context<AILoginFlowContextInterface> = createContext<AILoginFlowContextInterface>(undefined);

export default AILoginFlowContext;
