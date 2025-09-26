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

import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    EdgeTypes,
    Node,
    NodeTypes,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
// IMPORTANT: `@xyflow/react/dist/style.css` should be at the top of the stylesheet import list.
import "@xyflow/react/dist/style.css";

/**
 * Props interface of {@link FlowPreviewContent}
 */
export interface FlowPreviewContentPropsInterface extends IdentifiableComponentInterface {
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

const MAX_ZOOM: number = 0.3;

/**
 * Internal FlowPreview component that must be wrapped with ReactFlowProvider.
 * This component renders the actual ReactFlow with the provided nodes and edges in read-only mode.
 *
 * @param props - Props injected to the component.
 * @returns Flow preview content component.
 */
const FlowPreviewContent: FunctionComponent<FlowPreviewContentPropsInterface> = ({
    "data-componentid": componentId = "flow-preview-content",
    initialNodes,
    initialEdges,
    nodeTypes = {},
    edgeTypes = {}
}: FlowPreviewContentPropsInterface) => {
    const { t } = useTranslation();
    const [ nodes, setNodes, onNodesChange ] = useNodesState([]);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState([]);
    const { fitView } = useReactFlow();

    const restoreFlow: null | (() => void) = useCallback(() => {
        if (initialNodes && initialEdges) {
            setNodes(initialNodes);
            setEdges(initialEdges);

            // Use setTimeout to ensure the flow is rendered before fitting view
            setTimeout(() => {
                fitView({ duration: 200, maxZoom: MAX_ZOOM });
            }, 100);
        }
    }, [ initialNodes, initialEdges, setNodes, setEdges, fitView ]);

    useEffect(() => {
        restoreFlow();
    }, [ restoreFlow ]);

    // Show fallback UI if no flow data is available
    if (!initialNodes.length && !initialEdges.length) {
        return (
            <Box
                sx={ {
                    alignItems: "center",
                    backgroundColor: "grey.50",
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    width: "100%"
                } }
            >
                <Typography variant="body2" color="text.secondary">
                    { t("flows:core.versionHistory.restoreDialog.noFlowData") }
                </Typography>
            </Box>
        );
    }

    return (
        <ReactFlow
            nodes={ nodes }
            edges={ edges }
            nodeTypes={ nodeTypes }
            edgeTypes={ edgeTypes }
            onNodesChange={ onNodesChange }
            onEdgesChange={ onEdgesChange }
            onConnect={ () => {} }
            onNodesDelete={ () => {} }
            onEdgesDelete={ () => {} }
            fitView
            fitViewOptions={ {
                maxZoom: MAX_ZOOM
            } }
            proOptions={ { hideAttribution: true } }
            data-componentid={ componentId }
            colorMode="light"
            nodesDraggable={ false }
            nodesConnectable={ false }
            elementsSelectable={ false }
            selectNodesOnDrag={ false }
            panOnDrag={ true }
            zoomOnScroll={ true }
            zoomOnPinch={ true }
        >
            <Background variant={ BackgroundVariant.Dots } gap={ 20 } size={ 1 } color="#e0e0e0" />
            <Controls
                position="top-right"
                showInteractive={ false }
                style={ {
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "4px"
                } }
            />
        </ReactFlow>
    );
};

export default FlowPreviewContent;
