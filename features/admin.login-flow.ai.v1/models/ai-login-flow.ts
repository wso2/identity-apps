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

import { AuthenticationSequenceInterface } from "../../admin.applications.v1/models";

/**
 * Status of the login flow generation.
 */
export interface AILoginFlowGenerationStatusAPIResponseInterface {
    status: {
        generating_login_flow_authenticators: boolean;
        generating_login_flow_script: boolean;
        generation_of_login_flow_authenticators_complete: boolean;
        generation_of_login_flow_script_complete: boolean;
        login_flow_generation_complete: boolean
        optimization_and_validation_complete: boolean;
        optimizing_and_validating_final_login_flow: boolean;
        optimizing_and_validating_user_query: boolean,
        retrieval_of_examples_complete: boolean,
        retrieving_examples: boolean
    };
    operation_id: string;
}

/**
 * Login flow generation result API response interface.
 */
export interface AILoginFlowGenerationResultAPIResponseInterface {
    data: AuthenticationSequenceInterface | { error: string};
    status: LoginFlowResultStatus;
}

/**
 * Login flow generation API response interface.
 */
export interface GenerateLoginFlowAPIResponseInterface {
    operation_id: string;
}

/**
 * Login flow result status
 */
export enum LoginFlowResultStatus {
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    IN_PROGRESS = "IN_PROGRESS"
}
