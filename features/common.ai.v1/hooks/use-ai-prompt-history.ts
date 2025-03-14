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

import useUserPreferences from "@wso2is/common.ui.v1/hooks/use-user-preferences";

/**
 * A reusable hook to read/write a string[] "AI prompt" array in user preferences.
 *
 * @param promptKey - The key in preferences.
 *
 * @returns {
 *   prompts: string[];
 *   addPrompt: (newPrompt: string) => void;
 *   removePrompt: (promptToRemove: string) => void;
 *   clearPrompts: () => void;
 * }
 */
const useAIPromptHistory = (
    promptKey: string = "registrationFlowAIPrompts"
) => {

    const { getPreferences, setPreferences } = useUserPreferences();


    const prompts: string[] = (getPreferences(promptKey) as string[] | null) || [];

    /**
   * Add a new prompt only if it doesn't already exist in the array.
   */
    function addPrompt(newPrompt: string): void {
        if (!prompts.includes(newPrompt)) {
            const updatedPrompts: string[] = [ ...prompts, newPrompt ];

            setPreferences({ [promptKey]: updatedPrompts });
        }
    }

    /**
   * Remove an existing prompt from the array by filtering it out.
   */
    const removePrompt = (promptToRemove: string): void =>{
        const updatedPrompts: string[] = prompts.filter((p) => p !== promptToRemove);

        setPreferences({ [promptKey]: updatedPrompts });
    };

    /**
   * Clear the entire prompt array (sets an empty array).
   */
    const clearPrompts = (): void => {
        setPreferences({ [promptKey]: [] });
    };

    return {
        addPrompt,
        clearPrompts,
        prompts,
        removePrompt
    };
};

export default useAIPromptHistory;
