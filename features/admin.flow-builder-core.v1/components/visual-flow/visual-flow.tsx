/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    Controls,
    Edge,
    Node,
    NodeTypes,
    ReactFlow,
    ReactFlowProps,
    useReactFlow
} from "@xyflow/react";
import React, { FC, FunctionComponent, ReactElement, useMemo } from "react";
import VisualFlowConstants from "../../constants/visual-flow-constants";
import { Resources, ResourceTypes } from "../../models/resources";
import getKnownEdgeTypes from "../../utils/get-known-edge-types";
import transformFlow from "../../utils/transform-flow";
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
     * Callback to be fired when the flow is submitted.
     * @param payload - Payload of the flow.
     */
    onFlowSubmit: (payload: any) => void;
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
    onFlowSubmit,
    nodeTypes,
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    onConnect,
    onNodesDelete,
    ...rest
}: VisualFlowPropsInterface): ReactElement => {
    const { toObject } = useReactFlow();


    const handlePublish = (): void => {
        const flow: any = toObject();

        onFlowSubmit(transformFlow(flow));
    };

    const edgeTypes: { [key: string]: FC<Edge> } = useMemo(() => {
        return {
            "base-edge": BaseEdge,
            ...getKnownEdgeTypes(),
            ...customEdgeTypes
        };
    }, []);

    return (
        <>
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                // TODO: Fix the styling once the design is finalized
                sx={ { marginTop: "-50px", position: "absolute", right: "24px" } }
            >
                <Button variant="contained" onClick={ () => handlePublish() }>
                    Publish
                </Button>
            </Box>
            <Droppable id={ VisualFlowConstants.FLOW_BUILDER_CANVAS_ID } type={ VisualFlowConstants.FLOW_BUILDER_CANVAS_ID } accept={ [ ResourceTypes.Step ] }>
                <ReactFlow
                    fitView
                    nodes={ nodes }
                    edges={ edges }
                    nodeTypes={ useMemo(() => nodeTypes, []) }
                    edgeTypes={ edgeTypes as any }
                    onNodesChange={ onNodesChange }
                    onEdgesChange={ onEdgesChange }
                    onConnect={ onConnect }
                    onNodesDelete={ onNodesDelete }
                    proOptions={ { hideAttribution: true } }
                    data-componentid={ componentId }
                    colorMode="dark"
                    { ...rest }
                >
                    <Controls position="top-right" />
                </ReactFlow>
            </Droppable>
        </>
    );
};

export default VisualFlow;
