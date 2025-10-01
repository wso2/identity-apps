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

import { CollisionPriority } from "@dnd-kit/abstract";
import Box from "@oxygen-ui/react/Box";
import FormGroup from "@oxygen-ui/react/FormGroup";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { GearIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, Position, useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, HTMLAttributes, MouseEvent, ReactElement, useEffect } from "react";
import ReorderableElement from "./reorderable-element";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useOTPValidation from "../../../../hooks/use-otp-validation";
import { Element } from "../../../../models/elements";
import { EventTypes } from "../../../../models/extension";
import PluginRegistry from "../../../../plugins/plugin-registry";
import { Resource } from "../../../../public-api";
import generateResourceId from "../../../../utils/generate-resource-id";
import Droppable from "../../../dnd/droppable";
import ValidationErrorBoundary from "../../../validation-panel/validation-error-boundary";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import "./view.scss";

/**
 * Props interface of {@link View}
 */
export interface ViewPropsInterface
    extends Pick<CommonStepFactoryPropsInterface, "data" | "resource">,
        Omit<HTMLAttributes<HTMLDivElement>, "resource">,
        IdentifiableComponentInterface {
    /**
     * Name of the view.
     */
    heading?: string;
    /**
     * Droppable allowed resource list.
     */
    droppableAllowedTypes?: string[];
    /**
     * Droppable restricted resource list that should not be accepted.
     */
    droppableRestrictedTypes?: string[];
    /**
     * Flag to enable source handle.
     */
    enableSourceHandle?: boolean;
    /**
     * Event handler for double click on the action panel.
     *
     * @param event - The mouse event.
     */
    onActionPanelDoubleClick?: (event: MouseEvent<HTMLDivElement>) => void;
    /**
     * Is the view deletable.
     */
    deletable?: boolean;
    /**
     * Does the view has configurations.
     */
    configurable?: boolean;
    /**
     * Callback for configure action.
     */
    onConfigure?: () => void;
}

/**
 * Node for representing an empty view as a step in the flow builder.
 *
 * @param props - Props injected to the component.
 * @returns Step Node component.
 */
export const View: FunctionComponent<ViewPropsInterface> = ({
    heading,
    droppableAllowedTypes,
    droppableRestrictedTypes,
    enableSourceHandle,
    data,
    onActionPanelDoubleClick,
    className,
    deletable = true,
    configurable = false,
    onConfigure,
    "data-componentid": componentId = "view"
}: ViewPropsInterface): ReactElement => {
    const stepId: string = useNodeId();
    const node: Pick<Node, "data"> = useNodesData(stepId);
    const { deleteElements, updateNodeData } = useReactFlow();

    useOTPValidation((node as unknown) as Node);

    useEffect(() => {
        if ((data?.components as Element[])?.length <= 0) {
            return;
        }

        updateNodeData(stepId, () => {
            return {
                components: data?.components
            };
        });
    }, []);

    return (
        <ValidationErrorBoundary disableErrorBoundaryOnHover={ false } resource={ (node as unknown) as Resource }>
            <div className={ classNames("flow-builder-step", className) } data-componentid={ componentId }>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    className="flow-builder-step-action-panel"
                    onDoubleClick={ onActionPanelDoubleClick }
                >
                    <Typography
                        variant="body2"
                        data-componentid={ `${componentId}-heading-text` }
                        className="flow-builder-step-id"
                    >
                        { heading || "View" }
                    </Typography>
                    { configurable && (
                        <Tooltip
                            title={
                                // TODO: Add i18n
                                "Configure"
                            }
                        >
                            <IconButton
                                size="small"
                                onClick={ (_: MouseEvent<HTMLButtonElement>) => {
                                    onConfigure && onConfigure();
                                } }
                                className="flow-builder-step-action"
                            >
                                <GearIcon />
                            </IconButton>
                        </Tooltip>
                    ) }
                    { deletable && (
                        <Tooltip
                            title={
                                // TODO: Add i18n
                                "Remove"
                            }
                        >
                            <IconButton
                                size="small"
                                onClick={ (_: MouseEvent<HTMLButtonElement>) => {
                                    deleteElements({ nodes: [ { id: stepId } ] });
                                } }
                                className="flow-builder-step-action"
                            >
                                <TrashIcon />
                            </IconButton>
                        </Tooltip>
                    ) }
                </Box>
                <Handle type="target" position={ Position.Left } />
                <Box className="flow-builder-step-content" data-componentid={ `${componentId}-inner` }>
                    <Paper className="flow-builder-step-content-box" elevation={ 0 }>
                        <Box className="flow-builder-step-content-form">
                            <FormGroup>
                                <Droppable
                                    id={ generateResourceId(`${VisualFlowConstants.FLOW_BUILDER_VIEW_ID}_${stepId}`) }
                                    data={ { droppedOn: node, stepId } }
                                    type={ VisualFlowConstants.FLOW_BUILDER_DROPPABLE_VIEW_ID }
                                    accept={
                                        droppableAllowedTypes
                                            ? [
                                                VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID,
                                                ...droppableAllowedTypes.filter(
                                                    (type: string) => !droppableRestrictedTypes?.includes(type)
                                                )
                                            ]
                                            : [
                                                VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID,
                                                ...VisualFlowConstants.FLOW_BUILDER_VIEW_ALLOWED_RESOURCE_TYPES.filter(
                                                    (type: string) => !droppableRestrictedTypes?.includes(type)
                                                )
                                            ]
                                    }
                                    collisionPriority={ CollisionPriority.Low }
                                >
                                    { (node?.data?.components as any)?.map(
                                        (component: Element, index: number) =>
                                            PluginRegistry.getInstance().executeSync(
                                                EventTypes.ON_NODE_ELEMENT_FILTER,
                                                component
                                            ) && (
                                                <ReorderableElement
                                                    key={ component.id }
                                                    id={ component.id }
                                                    index={ index }
                                                    element={ component }
                                                    className={ classNames("flow-builder-step-content-form-field") }
                                                    type={ VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID }
                                                    accept={ [ VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID ] }
                                                    group={ stepId }
                                                />
                                            )
                                    ) }
                                </Droppable>
                            </FormGroup>
                        </Box>
                    </Paper>
                </Box>
                { enableSourceHandle && (
                    <Handle
                        type="source"
                        position={ Position.Right }
                        id={ `${stepId}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
                    />
                ) }
            </div>
        </ValidationErrorBoundary>
    );
};

export default View;
