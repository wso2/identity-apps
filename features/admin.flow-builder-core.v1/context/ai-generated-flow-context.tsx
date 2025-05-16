/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

export interface AIGeneratedFlowContextProps {
    /**
     * Flag to determine if the flow generation is completed.
     */
    flowGenerationCompleted: boolean;
    /**
     * Function to handle the flow generation.
     * @param data - Data from the API response.
     */
    handleFlowGeneration: (data: unknown) => void;
    /**
     * Flag to determine if the flow is being generated.
     */
    isFlowGenerating: boolean;
    /**
     * State to hold the generated flow.
     */
    aiGeneratedFlow: any;
    /**
     * Set the generated flow.
     * @param flow - Login flow to be set.
     */
    setAIGeneratedFlow: (flow: any) => void;
    /**
     * Operation ID of the flow generation process.
     */
    operationId: string;
    /**
     * Set the flow generation completion status.
     * @param status - Status to be set.
     */
    setFlowGenerationCompleted: (status: boolean) => void;
    /**
     * Set the flow generation status.
     * @param status - Status to be set.
     */
    setIsFlowGenerating: (status: boolean) => void;
    /**
     * Set the operation ID of the flow generation process.
     * @param id - Operation ID.
     */
    setOperationId: (id: string) => void;
    /**
     * Prompt history.
     */
    promptHistory: string[];
    /**
     * Update the history with the new prompt.
     * @param prompt - prompt to be set.
     */
    updatePromptHistory: (prompt: string) => void;
    /**
     * user prompt.
     */
    userPrompt: string;
    /**
     * set user prompt.
     */
    setUserPrompt: (prompt: string) => void;
    /**
     * Banner state.
     */
    bannerState?: any;
    /**
     * Set the banner state.
     * @param state - State to be set.
     */
    setBannerState?: (state: any) => void;
}

const AIGeneratedFlowContext: Context<AIGeneratedFlowContextProps> = createContext<
    null | AIGeneratedFlowContextProps>(null);

/**
 * Display name for the AIGeneratedFlowContext.
 */
AIGeneratedFlowContext.displayName = "AIGeneratedFlowContext";

export default AIGeneratedFlowContext;
