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
import { useDnD } from "@wso2is/dnd";
import {
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    OnConnect,
    OnNodesDelete,
    ReactFlow,
    ReactFlowProps,
    Node as XYFlowNode,
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
import NodeFactory from "./elements/nodes/node-factory";
import useGetFlowBuilderCoreElements from "../api/use-get-flow-builder-core-elements";
import useAuthenticationFlowBuilderCore from "../hooks/use-authentication-flow-builder-core-context";
import { ElementCategories } from "../models/elements";
import { Node } from "../models/node";
import "@xyflow/react/dist/style.css";
import "./visual-flow.scss";

/**
 * Props interface of {@link VisualFlow}
 */
export type VisualFlowPropsInterface = IdentifiableComponentInterface & ReactFlowProps<any, any>;

/**
 * Wrapper component for React Flow used in the Visual Editor.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor flow component.
 */
const VisualFlow: FunctionComponent<VisualFlowPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-flow",
    ...rest
}: VisualFlowPropsInterface): ReactElement => {
    const [ nodes, setNodes, onNodesChange ] = useNodesState([]);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState([]);
    const { screenToFlowPosition, toObject } = useReactFlow();
    const { node, generateComponentId } = useDnD();
    const { onElementDropOnCanvas } = useAuthenticationFlowBuilderCore();
    const { data: coreElements } = useGetFlowBuilderCoreElements();

    const onDragOver: (event: DragEvent) => void = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop: (e: DragEvent) => void = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            // check if the dropped element is valid
            if (!node?.type || node?.category !== ElementCategories.Nodes) {
                return;
            }

            // project was renamed to screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position: XYPosition = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY
            });

            const newNode: XYFlowNode = {
                data: {
                    label: `${node.type} node`,
                    ...node
                },
                id: generateComponentId(),
                position,
                type: node.type as string
            };

            setNodes((nodes: XYFlowNode[]) => nodes.concat(newNode));

            onElementDropOnCanvas(node, null);
        },
        [ screenToFlowPosition, node?.type ]
    );

    const onConnect: OnConnect = useCallback((params: any) => setEdges((edges: Edge[]) => addEdge(params, edges)), []);

    const onNodesDelete: OnNodesDelete<XYFlowNode> = useCallback(
        (deleted: XYFlowNode[]) => {
            setEdges(
                deleted.reduce((acc: Edge[], node: XYFlowNode) => {
                    const incomers: XYFlowNode[] = getIncomers(node, nodes, edges);
                    const outgoers: XYFlowNode[] = getOutgoers(node, nodes, edges);
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

    // TODO: Handle the submit
    const handlePublish = (): void => {
        const flow: any = toObject();

        console.log(JSON.stringify(flow, null, 2));
    };

    const generateNodeTypes = () => {
        if (!coreElements?.nodes) {
            return {};
        }

        return coreElements.nodes.reduce((acc: Record<string, FC<XYFlowNode>>, node: Node) => {
            acc[node.type] = (props: any) => <NodeFactory { ...props } node={ node } />;

            return acc;
        }, {} as Record<string, FC<XYFlowNode>>);
    };

    const nodeTypes: { [key: string]: FC<XYFlowNode> } = useMemo(() => generateNodeTypes(), []);

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
                nodeTypes={ nodeTypes as any }
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
                <Background gap={ 16 } variant={ BackgroundVariant.Dots } size={ 2 } />
                <Controls position="top-right" />
            </ReactFlow>
        </>
    );
};

export default VisualFlow;
