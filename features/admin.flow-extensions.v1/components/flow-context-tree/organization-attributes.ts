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

import { OrganizationContextConstants } from "../../constants/organization-context-constants";
import { PublishedFlowComponentInterface, PublishedFlowInterface } from "../../models/published-flow";

/**
 * A custom organization attribute a published flow collects.
 */
export interface OrganizationAttributeEntryInterface {
    key: string;
    label: string;
    readOnly?: boolean;
}

/**
 * Collect the custom organization attributes a published flow collects.
 *
 * Walks every step's components recursively, since a flow nests its inputs inside a form block.
 * Identifiers backed by a core node are skipped — their values are exposed at the core paths —
 * as are keys that cannot form a path segment. The first occurrence of a key wins, so a label is
 * taken from the field that introduces it.
 *
 * @param flow - Published flow to scan. A missing or malformed flow yields an empty list.
 * @returns The custom organization attributes, in the order the flow declares them.
 */
export const extractOrganizationAttributes = (
    flow: PublishedFlowInterface
): OrganizationAttributeEntryInterface[] => {
    const collected: Map<string, OrganizationAttributeEntryInterface> = new Map();

    const visit = (components: PublishedFlowComponentInterface[]): void => {
        components?.forEach((component: PublishedFlowComponentInterface) => {
            const identifier: string = component?.config?.identifier;

            if (component?.config?.identifierType === OrganizationContextConstants.ORGANIZATION_IDENTIFIER_TYPE
                && identifier
                && !OrganizationContextConstants.CORE_ATTRIBUTE_IDENTIFIERS.includes(identifier)
                && OrganizationContextConstants.KEY_PATTERN.test(identifier)
                && !collected.has(identifier)) {
                collected.set(identifier, { key: identifier, label: component?.config?.label || identifier });
            }

            visit(component?.components);
        });
    };

    flow?.steps?.forEach((step: PublishedFlowInterface["steps"][number]) => visit(step?.data?.components));

    return Array.from(collected.values());
};
