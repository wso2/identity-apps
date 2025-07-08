/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import { Controls, Edge, Node, NodeTypes, ReactFlow, ReactFlowProps } from "@xyflow/react";
import React, { FC, FunctionComponent, ReactElement, useMemo } from "react";
import VisualFlowConstants from "../../constants/visual-flow-constants";
import { Resources } from "../../models/resources";
import generateResourceId from "../../utils/generate-resource-id";
import getKnownEdgeTypes from "../../utils/get-known-edge-types";
import Droppable from "../dnd/droppable";
import BaseEdge from "../react-flow-overrides/base-edge";
// IMPORTANT: `@xyflow/react/dist/style.css` should be at the top of the stylesheet import list.
import "@xyflow/react/dist/style.css";
import "./visual-flow.scss";

/**
 * Props interface of {@link VisualFlow}
 */
export interface VisualFlowPropsInterface extends IdentifiableComponentInterface, ReactFlowProps<any, any> {
    /**
     * Flow resources.
     */
    resources: Resources;
    /**
     * Custom edges to be rendered.
     */
    customEdgeTypes?: {
        [key: string]: Edge;
    };
    /**
     * Callback to be fired when an edge is resolved.
     * @param connection - Connection object.
     * @returns Edge object.
     */
    onEdgeResolve?: (connection: any, nodes: Node[]) => Edge;
    /**
     * Initial nodes and edges to be rendered.
     */
    initialNodes?: Node[];
    /**
     * Initial nodes and edges to be rendered.
     */
    initialEdges?: Edge[];
    /**
     * Node types to be rendered.
     */
    nodeTypes?: NodeTypes;
}

/**
 * Wrapper component for React Flow used in the Visual Editor.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor flow component.
 */
const VisualFlow: FunctionComponent<VisualFlowPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-flow",
    customEdgeTypes,
    nodeTypes,
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    onEdgesDelete
}: VisualFlowPropsInterface): ReactElement => {
    const edgeTypes: { [key: string]: FC<Edge> } = useMemo(() => {
        return {
            "base-edge": BaseEdge,
            ...getKnownEdgeTypes(),
            ...customEdgeTypes
        };
    }, []);

    return (
        <>
            <Droppable
                id={ generateResourceId(VisualFlowConstants.FLOW_BUILDER_CANVAS_ID) }
                type={ VisualFlowConstants.FLOW_BUILDER_DROPPABLE_CANVAS_ID }
                accept={ [ ...VisualFlowConstants.FLOW_BUILDER_CANVAS_ALLOWED_RESOURCE_TYPES ] }
            >
                <ReactFlow
                    fitView
                    fitViewOptions={ {
                        maxZoom: 0.8
                    } }
                    nodes={ nodes }
                    edges={ edges }
                    nodeTypes={ useMemo(() => nodeTypes, []) }
                    edgeTypes={ edgeTypes as any }
                    onConnect={ onConnect }
                    onNodesDelete={ onNodesDelete }
                    onEdgesDelete={ onEdgesDelete }
                    proOptions={ { hideAttribution: true } }
                    data-componentid={ componentId }
                    onNodesChange={ onNodesChange }
                    onEdgesChange={ onEdgesChange }
                    colorMode="light"
                >
                    <Controls position="top-right" />
                </ReactFlow>
            </Droppable>
        </>
    );
};

export default VisualFlow;
