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

import { Node } from "@xyflow/react";
import { ExecutorConnectionInterface } from "../models/metadata";
import { Step, StepTypes } from "../models/steps";

const IDP_NAME_PLACEHOLDER: string = "{{IDP_NAME}}";

/**
 * Automatically assigns connections to nodes based on available connections.
 *
 * @param nodes - The array of nodes to process.
 * @param availableConnections - The array of available executor connections.
 */
const autoAssignConnections = (nodes: Node[], availableConnections: ExecutorConnectionInterface[]) => {
    const availableConnectionsMap: Record<string, string[]> = availableConnections.reduce(
        (map: Record<string, string[]>, executorConnections: ExecutorConnectionInterface) => {
            map[executorConnections.executorName] = executorConnections.connections;

            return map;
        },
        {} as Record<string, string[]>
    );

    nodes.forEach((node: Node) => {
        // Only process execution step nodes.
        if (node.type === StepTypes.Execution) {
            const step: Step = node as Step;

            const connections: string[] = availableConnectionsMap[step.data?.action?.executor?.name] ?? [];

            if (connections.length > 0 && step.data?.action?.executor?.meta?.idpName === IDP_NAME_PLACEHOLDER) {
                step.data.action.executor.meta.idpName = connections[0];
            }
        }
    });
};

export default autoAssignConnections;
