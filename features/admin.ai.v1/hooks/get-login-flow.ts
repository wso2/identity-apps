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
import { AuthenticationSequenceInterface } from "../../admin.applications.v1/models/application";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getLoginFLow = (generatedLoginFlow:any): AuthenticationSequenceInterface => {

    const aiGeneratedLoginFlow: AuthenticationSequenceInterface = {
        attributeStepId : generatedLoginFlow.authenticationSequence.attributeStepId,
        requestPathAuthenticators :[],
        script: generatedLoginFlow.script,
        steps: generatedLoginFlow.authenticationSequence.steps,
        subjectStepId : generatedLoginFlow.subjectStepId,
        type : generatedLoginFlow.type
    };

    return aiGeneratedLoginFlow;

};

export default getLoginFLow;
