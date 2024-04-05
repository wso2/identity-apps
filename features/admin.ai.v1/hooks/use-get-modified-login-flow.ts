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
import { useContext } from "react";
import AILoginFlowContext from "../../admin.ai.v1/context/login-flow-context";
import { AuthenticationSequenceInterface } from "../../admin.applications.v1/models/application";

/**
 *
 * @param authenticationSequence currently configured authentication sequence for the application.
 */

const useGetModifiedLoginFLow = (authenticationSequence: any): AuthenticationSequenceInterface => {

    /**
     * Get the state of the AI generated login flow.
     */
    const {
        aiGeneratedAiLoginFlow
    } = useContext(AILoginFlowContext);

    if (aiGeneratedAiLoginFlow){
        return aiGeneratedAiLoginFlow;
    }

    return authenticationSequence;

};

export default useGetModifiedLoginFLow;
