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

import { Element } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { Node } from "@xyflow/react";
import { AttributeType } from "../models/attributes";

/**
 * Collect the organization attribute identifiers a flow currently collects.
 *
 * Walks every step's components recursively, since inputs are nested inside a form block. Core
 * organization fields and admin-defined custom keys both carry `identifierType: ORGANIZATION`, so
 * they are collected alike and the caller decides which identifiers it cares about.
 *
 * @param nodes - Builder nodes to scan. Missing or malformed nodes yield an empty list.
 * @returns The organization attribute identifiers, deduplicated.
 */
const collectOrganizationAttributeIdentifiers = (nodes: Node[]): string[] => {
    const collected: Set<string> = new Set<string>();

    const visit = (components: Element[]): void => {
        components?.forEach((component: Element) => {
            const identifier: string = component?.config?.identifier;

            if (component?.config?.identifierType === AttributeType.Organization && identifier) {
                collected.add(identifier);
            }

            visit(component?.components);
        });
    };

    nodes?.forEach((node: Node) => visit(node?.data?.components as Element[]));

    return Array.from(collected);
};

export default collectOrganizationAttributeIdentifiers;
