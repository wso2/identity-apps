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

class FlowConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    // 1 min
    public static readonly AUTO_SAVE_INTERVAL: number = 60000;

    // Maximum number of history items to keep
    public static readonly MAX_HISTORY_ITEMS: number = 20;

    // Identifier that disables decision steps when listed in the disabled features of flows.
    public static readonly CONDITIONAL_BRANCHING_FEATURE_ID: string = "flows.conditionalBranching";

    // Limits on decision steps and their conditions, used when the deployment configuration sets none. They match the
    // server's defaults; a server configured with other limits needs the same values under
    // ui.flowExecution.conditionalBranching, as the server still validates them on save.
    public static readonly DEFAULT_MAX_DECISION_NODES: number = 20;
    public static readonly DEFAULT_MAX_RULES_COMBINED_WITH_OR: number = 10;
    public static readonly DEFAULT_MAX_EXPRESSIONS_COMBINED_WITH_AND: number = 5;

    // Identifier that disables flow variables when listed in the disabled features of flows.
    public static readonly VARIABLES_FEATURE_ID: string = "flows.variables";

    // Limits on flow variables, used when the deployment configuration sets none. They match the server's defaults;
    // a server configured with other limits needs the same values under ui.flowExecution.variables, as the server
    // still validates them on save.
    public static readonly DEFAULT_MAX_HEADERS: number = 10;
    public static readonly DEFAULT_MAX_RUNTIME_VALUES: number = 20;
    public static readonly DEFAULT_MAX_VALUE_LENGTH: number = 255;
    public static readonly DEFAULT_MAX_ARRAY_SIZE: number = 20;
}

export default FlowConstants;
