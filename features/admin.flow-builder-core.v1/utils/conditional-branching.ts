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

import { isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { Node } from "@xyflow/react";
import { AxiosError } from "axios";
import FlowConstants from "../constants/flow-constants";
import { RuleLimitsInterface, RuleMetadataInterface } from "../models/metadata";
import { Resources } from "../models/resources";
import { Step, StepTypes } from "../models/steps";

/**
 * Status the server answers the rule metadata request with when conditional branching is disabled on it.
 */
const NOT_IMPLEMENTED_STATUS: number = 501;

/**
 * Whether the console has conditional branching turned on in its feature configuration.
 *
 * @param flowsFeatureConfig - Feature configuration of flows.
 * @returns True unless the feature is listed in the disabled features of flows.
 */
export const isConditionalBranchingConfigured = (flowsFeatureConfig: FeatureAccessConfigInterface): boolean =>
    isFeatureEnabled(flowsFeatureConfig, FlowConstants.CONDITIONAL_BRANCHING_FEATURE_ID);

/**
 * Whether decision steps can be added: the console allows them and the server has published the fields their
 * conditions can use.
 *
 * @param flowsFeatureConfig - Feature configuration of flows.
 * @param ruleMetadata - The rule metadata, once it has arrived.
 * @param ruleMetadataError - Error of the rule metadata request, if any.
 * @returns True if decision steps can be added.
 */
export const isConditionalBranchingAvailable = (
    flowsFeatureConfig: FeatureAccessConfigInterface,
    ruleMetadata?: RuleMetadataInterface,
    ruleMetadataError?: AxiosError
): boolean =>
    isConditionalBranchingConfigured(flowsFeatureConfig) && !ruleMetadataError && !!ruleMetadata;

/**
 * Whether the server answered the rule metadata request with Not Implemented, as it does when conditional branching
 * is disabled on it.
 *
 * @param ruleMetadataError - Error of the rule metadata request, if any.
 * @returns True if the server does not support conditional branching.
 */
export const isRuleMetadataNotImplemented = (ruleMetadataError?: AxiosError): boolean =>
    ruleMetadataError?.response?.status === NOT_IMPLEMENTED_STATUS;

/**
 * Whether the flow has a decision step, so a failure to read the rule metadata matters to it.
 *
 * @param nodes - Nodes of the flow.
 * @returns True if any node is a decision step.
 */
export const hasDecisionStep = (nodes: Node[]): boolean =>
    (nodes ?? []).some((node: Node) => node.type === StepTypes.RuleEvaluation);

/**
 * The limits on decision steps and their conditions, from the console's deployment configuration, with the server's
 * defaults for any that are not configured or not positive.
 *
 * @param configured - Limits configured under `ui.flowExecution.conditionalBranching`.
 * @returns The limits.
 */
export const resolveRuleLimits = (configured?: Partial<RuleLimitsInterface>): RuleLimitsInterface => {
    const positiveOr: (value: number | undefined, fallback: number) => number = (
        value: number | undefined,
        fallback: number
    ): number =>
        Number.isInteger(value) && value > 0 ? value : fallback;

    return {
        maxDecisionNodes: positiveOr(configured?.maxDecisionNodes, FlowConstants.DEFAULT_MAX_DECISION_NODES),
        maxExpressionsCombinedWithAnd: positiveOr(configured?.maxExpressionsCombinedWithAnd,
            FlowConstants.DEFAULT_MAX_EXPRESSIONS_COMBINED_WITH_AND),
        maxRulesCombinedWithOr: positiveOr(configured?.maxRulesCombinedWithOr,
            FlowConstants.DEFAULT_MAX_RULES_COMBINED_WITH_OR)
    };
};

/**
 * The resources without the decision step, for a palette that must not offer it.
 *
 * @param resources - Resources of the flow builder.
 * @returns The resources, with the decision step left out of the steps.
 */
export const withoutDecisionSteps = (resources: Resources): Resources => ({
    ...resources,
    steps: (resources?.steps ?? []).filter((step: Step) => step.type !== StepTypes.RuleEvaluation)
});
