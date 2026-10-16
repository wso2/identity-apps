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

import { StepData, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import OrganizationAttributeConstants from "../constants/organization-attribute-constants";
import RegistrationFlowExecutorConstants from "../constants/registration-flow-executor-constants";
import collectOrganizationAttributeIdentifiers from "../utils/collect-organization-attribute-identifiers";

/**
 * Custom hook that keeps the END step's executor in step with what the flow collects.
 *
 * A flow that collects an organization name is an organization onboarding flow, and needs both the
 * user and the organization provisioned. Resolving this while the flow is being built means the
 * runtime has no classification to do — the executor named on the END step is the decision.
 *
 * The swap is bidirectional: removing the organization name field restores the user provisioning
 * executor, so a flow never tries to create an organization whose name it no longer asks for.
 */
const useOrganizationProvisioningExecutor = (): void => {
    const { getNodes, updateNodeData } = useReactFlow();

    const nodes: Node[] = getNodes();

    const endStep: Node | undefined = useMemo(
        () => nodes?.find((node: Node) => node.type === StepTypes.End),
        [ nodes ]
    );

    const resolvedExecutorName: string = useMemo(() => {
        const identifiers: string[] = collectOrganizationAttributeIdentifiers(nodes);

        return identifiers.includes(OrganizationAttributeConstants.ORGANIZATION_NAME_IDENTIFIER)
            ? RegistrationFlowExecutorConstants.PROVISIONING_DISPATCH_EXECUTOR
            : RegistrationFlowExecutorConstants.USER_PROVISIONING_EXECUTOR;
    }, [ nodes ]);

    const currentExecutorName: string = (endStep?.data as StepData)?.action?.executor?.name;

    /**
     * Write the resolved executor onto the END step.
     *
     * Guarded on the name having actually changed — writing unconditionally would feed the node
     * update back in as a render and re-trigger this effect.
     */
    useEffect(() => {
        if (!endStep?.id || currentExecutorName === resolvedExecutorName) {
            return;
        }

        updateNodeData(endStep.id, (node: Node) => ({
            action: {
                ...(node?.data as StepData)?.action,
                executor: {
                    ...(node?.data as StepData)?.action?.executor,
                    name: resolvedExecutorName
                }
            }
        }));
    }, [ endStep?.id, currentExecutorName, resolvedExecutorName, updateNodeData ]);
};

export default useOrganizationProvisioningExecutor;
