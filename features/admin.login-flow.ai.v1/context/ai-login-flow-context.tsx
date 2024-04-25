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
import { AILoginFlowGenerationResultAPIResponseInterface } from "../models/ai-login-flow";

export interface AILoginFlowContextProps {
    /**
     * Flag to determine if the login flow generation is completed.
     */
    loginFlowGenerationCompleted: boolean;
    /**
     * Function to handle the login flow generation.
     * @param data - Data from the API response.
     */
    handleGenerate: (data: AuthenticationSequenceInterface) => void;
    /**
     * Flag to determine if the login flow is being generated.
     */
    isGeneratingLoginFlow: boolean;
    /**
     * State to hold the generated login flow.
     */
    aiGeneratedLoginFlow: AuthenticationSequenceInterface;
    /**
     * Operation ID of the login flow generation process.
     */
    operationId: string;
    /**
     * Set the login flow generation completion status.
     * @param status - Status to be set.
     */
    setLoginFlowGenerationCompleted: (status: boolean) => void;
    /**
     * Set the login flow generation status.
     * @param status - Status to be set.
     */
    setGeneratingLoginFlow: (status: boolean) => void;
    /**
     * Set the operation ID of the login flow generation process.
     * @param id - Operation ID.
     */
    setOperationId: (id: string) => void;
}

const AILoginFlowContext: Context<AILoginFlowContextProps> = createContext<
    null | AILoginFlowContextProps>(null);

/**
 * Display name for the AILoginFlowContext.
 */
AILoginFlowContext.displayName = "AILoginFlowContext";

export default AILoginFlowContext;
