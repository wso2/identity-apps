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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
    ReactFlowProps,
    addEdge,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import React, { FunctionComponent, ReactElement, useCallback } from "react";
import useDnD from "../hooks/use-dnd";
import "@xyflow/react/dist/style.css";
import "./authentication-flow-visual-flow.scss";
import AuthenticationFlowVisualEditorPrimitivesPanel from "./authentication-flow-visual-editor-primitives-panel";
import StepNode from "./nodes/step-node";

let id = 0;
const getId = () => `dndnode_${id++}`;

/**
 * Props interface of {@link AuthenticationFlowVisualFlow}
 */
export interface AuthenticationFlowVisualEditorPropsInterface
    extends IdentifiableComponentInterface,
        ReactFlowProps<any, any> {}

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { step: StepNode };

/**
 * Wrapper component for React Flow used in the Visual Editor.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor flow component.
 */
const AuthenticationFlowVisualFlow: FunctionComponent<AuthenticationFlowVisualEditorPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-flow",
    ...rest
}: AuthenticationFlowVisualEditorPropsInterface): ReactElement => {
    const [ nodes, setNodes, onNodesChange ] = useNodesState([]);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [ data ] = useDnD();

    const onDragOver = useCallback(event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        event => {
            event.preventDefault();

            // check if the dropped element is valid
            if (!data?.type || data?.category !== "PRIMITIVE") {
                return;
            }

            // project was renamed to screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY
            });
            const newNode = {
                id: getId(),
                type: data.type,
                position,
                data: { label: `${data.type} node` }
            };

            setNodes(nds => nds.concat(newNode));
        },
        [ screenToFlowPosition, data?.type ]
    );

    const onConnect = useCallback(params => setEdges(eds => addEdge(params, eds)), []);

    return (
        <ReactFlow
            nodes={ nodes }
            edges={ edges }
            nodeTypes={ nodeTypes as any }
            onNodesChange={ onNodesChange }
            onEdgesChange={ onEdgesChange }
            onConnect={ onConnect }
            onDrop={ onDrop }
            onDragOver={ onDragOver }
            fitView
            proOptions={ { hideAttribution: true } }
            { ...rest }
        >
            <Background color="#e1e1e1" gap={ 16 } variant={ BackgroundVariant.Dots } size={ 2 } />
            <Controls position="top-right" />
            <AuthenticationFlowVisualEditorPrimitivesPanel />
        </ReactFlow>
    );
};

export default AuthenticationFlowVisualFlow;
