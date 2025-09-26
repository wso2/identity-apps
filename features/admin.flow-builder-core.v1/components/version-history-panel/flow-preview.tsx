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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Edge, EdgeTypes, Node, NodeTypes, ReactFlowProvider } from "@xyflow/react";
import React, { FunctionComponent } from "react";
import FlowPreviewContent from "./flow-preview-content";
// IMPORTANT: `@xyflow/react/dist/style.css` should be at the top of the stylesheet import list.
import "@xyflow/react/dist/style.css";

/**
 * Props interface of {@link FlowPreview}
 */
export interface FlowPreviewPropsInterface extends IdentifiableComponentInterface {
    /**
     * Initial nodes to be rendered.
     */
    initialNodes: Node[];
    /**
     * Initial edges to be rendered.
     */
    initialEdges: Edge[];
    /**
     * Node types to be rendered.
     */
    nodeTypes?: NodeTypes;
    /**
     * Edge types to be rendered.
     */
    edgeTypes?: EdgeTypes;
}

/**
 * FlowPreview component for displaying a read-only preview of a flow.
 * This component wraps the preview content with ReactFlowProvider to avoid conflicts.
 *
 * @param props - Props injected to the component.
 * @returns Flow preview component.
 */
const FlowPreview: FunctionComponent<FlowPreviewPropsInterface> = ({
    "data-componentid": componentId = "flow-preview",
    initialNodes,
    initialEdges,
    nodeTypes,
    edgeTypes
}: FlowPreviewPropsInterface) => {
    return (
        <ReactFlowProvider>
            <FlowPreviewContent
                data-componentid={ componentId }
                initialNodes={ initialNodes }
                initialEdges={ initialEdges }
                nodeTypes={ nodeTypes }
                edgeTypes={ edgeTypes }
            />
        </ReactFlowProvider>
    );
};

export default FlowPreview;
