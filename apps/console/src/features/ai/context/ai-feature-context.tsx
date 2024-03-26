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
import { BannerState } from "../models/types";


/**
 * Props interface for AIFeatureContext.
 */
export interface AIFeatureContextProps {
    /**
     * Banner state.
     */
    bannerState: BannerState;
    /**
     * Set banner state.
     * @param state - Banner state.
     */
    setBannerState: (state: BannerState) => void;
    /**
     * Current status.
     */
    currentStatus: string;
    /**
     * Set current status.
     * @param status - Status.
     */
    setCurrentStatus: (status: string) => void;
    /**
     * Progress.
     */
    progress: number;
    /**
     * Set progress.
     * @param progress - Progress.
     */
    setProgress: (progress: number) => void;
}

/**
 * Context object for managing AI features.
 */
const AIFeatureContext: Context<AIFeatureContextProps> = createContext<
    null | AIFeatureContextProps
>(
    null
);

/**
 * Display name for the AIFeatureContext.
 */
AIFeatureContext.displayName = "AIFeatureContext";

export default AIFeatureContext;
