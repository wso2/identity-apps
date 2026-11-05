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

import { NodeType, TreeNodeStateInterface } from "./models";

// The organization a registration flow onboards is listed by the server with the attributes the
// registration flow collects for it. Its fields can only be read.

export const SUBJECT_ORGANIZATION_ATTRIBUTES_PATH: string = "/subjectOrganization/attributes";

const ATTRIBUTE_SELECTOR_PREFIX: string = "/subjectOrganization/attributes[name=";

const ALL_FLOW_TYPES: string = "ALL";

/**
 * The flow types a node applies to, when it does not apply to all of them.
 *
 * @param applicableFlowTypes - Flow types the server lists for the node.
 * @returns The flow types, or `undefined` when the node applies to every flow.
 */
export const getLimitedFlowTypes = (applicableFlowTypes?: string[]): string[] | undefined =>
    applicableFlowTypes?.length && !applicableFlowTypes.includes(ALL_FLOW_TYPES)
        ? applicableFlowTypes
        : undefined;

/**
 * Rows for the organization attributes saved in the access config that the registration flow no
 * longer collects, so they can be seen and removed.
 *
 * @param listedPaths - Paths of the attributes the server lists.
 * @param exposePaths - Saved expose paths, with their encrypted flag.
 * @param applicableFlowTypes - Flow types the attributes container applies to.
 * @returns The rows, marked as not in the flow.
 */
export const buildMissingAttributeRows = (
    listedPaths: Set<string>,
    exposePaths: Map<string, boolean>,
    applicableFlowTypes?: string[]
): TreeNodeStateInterface[] => {
    const rows: TreeNodeStateInterface[] = [];

    exposePaths.forEach((encrypted: boolean, path: string) => {
        if (!path.startsWith(ATTRIBUTE_SELECTOR_PREFIX) || !path.endsWith("]") || listedPaths.has(path)) {
            return;
        }

        rows.push({
            allowedOperations: [ "EXPOSE" ],
            applicableFlowTypes: getLimitedFlowTypes(applicableFlowTypes),
            canDelete: true,
            children: undefined,
            dataType: "String",
            dynamicEntryAllowed: false,
            dynamicEntryType: "",
            exposeEncrypted: encrypted,
            exposed: true,
            key: `synth:${path}`,
            modify: false,
            modifyEncrypted: false,
            nodeType: NodeType.LEAF,
            notInFlow: true,
            path,
            readOnly: true,
            replaceable: false,
            title: path.slice(ATTRIBUTE_SELECTOR_PREFIX.length, -1)
        });
    });

    return rows;
};
