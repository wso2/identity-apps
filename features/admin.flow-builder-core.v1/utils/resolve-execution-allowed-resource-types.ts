/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import VisualFlowConstants from "../constants/visual-flow-constants";
import { ExecutionAllowedResourceTypesInterface } from "../models/steps";

/**
 * Resolves the component types an execution step's page allows: the static content, plus the additions the
 * executor lists for the phase (see `FLOW_BUILDER_EXECUTION_ALLOWED_RESOURCE_TYPES`).
 *
 * @param executorName - Name of the step's executor.
 * @param phase - Phase in `action.executor.meta.phase`, if any.
 * @returns Allowed component types.
 */
const resolveExecutionAllowedResourceTypes = (executorName: string | undefined, phase?: string): string[] => {
    const baseline: string[] = VisualFlowConstants.FLOW_BUILDER_STATIC_CONTENT_ALLOWED_RESOURCE_TYPES;
    const config: ExecutionAllowedResourceTypesInterface | undefined = executorName
        ? VisualFlowConstants.FLOW_BUILDER_EXECUTION_ALLOWED_RESOURCE_TYPES[ executorName ]
        : undefined;

    if (!config) {
        return baseline;
    }

    const additions: string[] = (phase && config.phases?.[ phase ]) || config.default;

    return Array.from(new Set<string>([ ...baseline, ...additions ]));
};

export default resolveExecutionAllowedResourceTypes;
