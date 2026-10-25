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

import { Node } from "@xyflow/react";
import { StepTypes } from "../models/steps";

/**
 * Whether a flow already has as many decision steps as the server allows, so no more can be added.
 *
 * @param nodes - Nodes of the flow.
 * @param maxDecisionNodes - Maximum number of decision steps a flow may have.
 * @returns True if no more decision steps can be added.
 */
const isDecisionStepLimitReached = (nodes: Node[], maxDecisionNodes: number): boolean =>
    (nodes ?? []).filter((node: Node) => node.type === StepTypes.RuleEvaluation).length >= maxDecisionNodes;

export default isDecisionStepLimitReached;
