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

import { Edge, Node } from "@xyflow/react";
import { SocialConnectionEdgeKey } from "../components/react-flow-overrides/social-connection-edge";
import ButtonAdapterConstants from "../constants/button-adapter-constants";
import { ActionVariants } from "../models/actions";
import { Element, ElementCategories } from "../models/elements";

/**
 * Resolves known edges based on the connection and nodes provided.
 *
 * @param connection - The edge connection to resolve.
 * @param nodes - The list of nodes to search for the source element.
 * @returns The resolved edge with additional data if it matches known criteria, otherwise null.
 */
const resolveKnownEdges = (connection: Edge, nodes: Node[]): Edge => {
    const sourceElementId: string = connection.sourceHandle
        .replace(ButtonAdapterConstants.NEXT_BUTTON_HANDLE_SUFFIX, "")
        .replace(ButtonAdapterConstants.PREVIOUS_BUTTON_HANDLE_SUFFIX, "");
    const sourceElement: Element | undefined = nodes
        .flatMap((node: Node) => node?.data?.components as Element[])
        .find((component: Element) => component?.id === sourceElementId);

    if (sourceElement?.category === ElementCategories.Action) {
        if (sourceElement.variant === ActionVariants.SOCIAL) {
            return {
                ...connection,
                data: {
                    img: "https://www.svgrepo.com/show/475656/google-color.svg",
                    label: "Sign in with Google"
                },
                type: SocialConnectionEdgeKey
            };
        }
    }

    return null;
};

export default resolveKnownEdges;