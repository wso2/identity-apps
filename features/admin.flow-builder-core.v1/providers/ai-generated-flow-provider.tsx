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

import React, { PropsWithChildren, useState } from "react";
import AIGeneratedFlowContext from "../context/ai-generated-flow-context";

export type AIGeneratedFlowProviderProps = any;

/**
 * Provider for the AI generated flow context.
 *
 * @param props - Props for the client.
 * @returns AI generated flow provider.
 */
const AIGeneratedFlowProvider = (props: PropsWithChildren<AIGeneratedFlowProviderProps>): React.ReactElement=>{

    const { children } = props;

    const [ aiGeneratedFlow, setAIGeneratedFlow ] = useState<any>(undefined);
    const [ operationId, setOperationId ] = useState<string>();
    const [ isFlowGenerating, setIsFlowGenerating ] = useState<boolean>(false);
    const [ flowGenerationCompleted, setFlowGenerationCompleted ] = useState<boolean>(false);
    const [ promptHistory, setPromptHistory ] = useState<string[]>([]);
    const [ userPrompt, setUserPrompt ] = useState<string>("");
    const [ nodes, setNodes ] = useState<any>([]);
    const [ edges, setEdges ] = useState<any>([]);

    /**
     * Function to process the API response and generate the flow.
     *
     * @param data - Data from the API response.
     */
    const handleFlowGeneration = (data: any) => {
        setAIGeneratedFlow(data);
        setIsFlowGenerating(false);
        setFlowGenerationCompleted(false);
    };

    const updatePromptHistory = (prompt: string) => {
        // Only keep the last 3 prompts
        // If the prompt is already in the history, remove it and add it to the top
        if (promptHistory.includes(prompt)) {
            setPromptHistory([ prompt, ...promptHistory.filter((item: string) => item !== prompt) ]);
        } else {
            setPromptHistory([ prompt, ...promptHistory.slice(0, 2) ]);
        }
    };

    return (
        <AIGeneratedFlowContext.Provider
            value={ {
                aiGeneratedFlow,
                flowGenerationCompleted,
                handleFlowGeneration,
                isFlowGenerating,
                operationId,
                promptHistory,
                setAIGeneratedFlow,
                setFlowGenerationCompleted,
                setIsFlowGenerating,
                setOperationId,
                setUserPrompt,
                setNodes,
                setEdges,
                nodes,
                edges,
                updatePromptHistory,
                userPrompt
            } }
        >
            { children }
        </AIGeneratedFlowContext.Provider>
    );
};

export default AIGeneratedFlowProvider;
