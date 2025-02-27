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
import { useDnD } from "@oxygen-ui/react/dnd";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    Controls,
    Edge,
    MarkerType,
    Node,
    NodeTypes,
    OnConnect,
    OnNodesDelete,
    ReactFlow,
    ReactFlowProps,
    XYPosition,
    addEdge,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import React, { DragEvent, FC, FunctionComponent, ReactElement, useCallback, useMemo } from "react";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import { ResourceTypes, Resources } from "../../models/resources";
import getKnownEdgeTypes from "../../utils/get-known-edge-types";
import resolveKnownEdges from "../../utils/resolve-known-edges";
import transformFlow from "../../utils/transform-flow";
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
    onEdgeResolve,
    nodeTypes,
    initialNodes = [],
    initialEdges = [],
    ...rest
}: VisualFlowPropsInterface): ReactElement => {
    const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);
    const { screenToFlowPosition, toObject } = useReactFlow();
    const { node, generateComponentId } = useDnD();
    const { onResourceDropOnCanvas } = useAuthenticationFlowBuilderCore();

    const onDragOver: (event: DragEvent) => void = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop: (e: DragEvent) => void = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            // check if the dropped element is valid
            if (!node?.type || node?.resourceType !== ResourceTypes.Step) {
                return;
            }

            // project was renamed to screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position: XYPosition = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY
            });

            const newNode: Node = {
                data: {
                    label: `${node.type} node`,
                    ...node
                },
                deletable: false,
                id: generateComponentId(),
                position,
                type: node.type as string
            };

            setNodes((nodes: Node[]) => nodes.concat(newNode));

            onResourceDropOnCanvas(node, null);
        },
        [ screenToFlowPosition, node?.type ]
    );

    const onConnect: OnConnect = useCallback(
        (connection: any) => {
            let edge: Edge = onEdgeResolve ? onEdgeResolve(connection, nodes) : resolveKnownEdges(connection, nodes);

            if (!edge) {
                edge = {
                    ...connection,
                    markerEnd: {
                        type: MarkerType.Arrow
                    },
                    type: "base-edge"
                };
            }

            setEdges((edges: Edge[]) => addEdge(edge, edges));
        },
        [ setEdges, nodes ]
    );

    const onNodesDelete: OnNodesDelete<Node> = useCallback(
        (deleted: Node[]) => {
            setEdges(
                deleted.reduce((acc: Edge[], node: Node) => {
                    const incomers: Node[] = getIncomers(node, nodes, edges);
                    const outgoers: Node[] = getOutgoers(node, nodes, edges);
                    const connectedEdges: Edge[] = getConnectedEdges([ node ], edges);

                    const remainingEdges: Edge[] = acc.filter((edge: Edge) => !connectedEdges.includes(edge));

                    const createdEdges: Edge[] = incomers.flatMap(({ id: source }: { id: string }) =>
                        outgoers.map(({ id: target }: { id: string }) => ({
                            id: `${source}->${target}`,
                            source,
                            target
                        }))
                    );

                    return [ ...remainingEdges, ...createdEdges ];
                }, edges)
            );
        },
        [ nodes, edges ]
    );

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
                onDrop={ onDrop }
                onDragOver={ onDragOver }
                proOptions={ { hideAttribution: true } }
                data-componentid={ componentId }
                colorMode="dark"
                { ...rest }
            >
                <Controls position="top-right" />
            </ReactFlow>
        </>
    );
};

export default VisualFlow;
