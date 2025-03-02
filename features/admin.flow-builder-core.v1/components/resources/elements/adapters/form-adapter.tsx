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

import Badge from "@mui/material/Badge";
import { DroppableContainer, GetDragItemProps } from "@oxygen-ui/react/dnd";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useNodeId, useReactFlow } from "@xyflow/react";
import classNames from "classnames";
import React, { DragEvent, FunctionComponent, ReactElement, useCallback } from "react";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import useGenerateStepElement from "../../../../hooks/use-generate-step-element";
import { Element, ElementCategories } from "../../../../models/elements";
import ReorderableElement from "../../steps/view/reorderable-element";
import "./form-adapter.scss";

/**
 * Props interface of {@link FormAdapter}
 */
export interface FormAdapterPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the resource.
     */
    resourceId: string;
    /**
     * The resource properties.
     */
    resource: Element;
}

/**
 * Adapter for the Form component.
 *
 * @param props - Props injected to the component.
 * @returns The FormAdapter component.
 */
export const FormAdapter: FunctionComponent<FormAdapterPropsInterface> = ({
    resource
}: FormAdapterPropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const { updateNodeData } = useReactFlow();
    const { onResourceDropOnCanvas } = useAuthenticationFlowBuilderCore();
    const { generateStepElement } = useGenerateStepElement();

    const handleDrop: (e: DragEvent) => void = useCallback((event: DragEvent) => {
        event.preventDefault();
        // IMPORTANT: This ensures that the drop event is not propagated to the parent container.
        // DO NOT REMOVE THIS LINE.
        event.stopPropagation();

        const droppedData: string = event.dataTransfer.getData("application/json");

        if (droppedData) {
            const generatedElement: Element = generateStepElement(JSON.parse(droppedData));

            updateNodeData(nodeId, (node: any) => {
                return {
                    components: node?.data?.components?.map((component: Element) =>
                        component.id === resource.id
                            ? { ...component, components: [ ...(component.components || []), generatedElement ] }
                            : component
                    )
                };
            });

            onResourceDropOnCanvas(generatedElement, nodeId);
        }
    }, []);

    const shouldShowFormFieldsPlaceholder: boolean = !resource?.components?.some((element: Element) => element.category === ElementCategories.Field);

    return (
        <Badge
            anchorOrigin={ {
                horizontal: "left",
                vertical: "top"
            } }
            badgeContent="Form"
            className="adapter form-adapter"
            onDrop={ handleDrop }
        >
            { shouldShowFormFieldsPlaceholder && (
                <Typography variant="body2">DROP FORM FIELDS HERE</Typography>
            ) }
            <DroppableContainer nodes={ (resource?.components || []) as Element[] } onOrderChange={ null }>
                { ({ nodes, getDragItemProps }: { nodes: Element[]; getDragItemProps: GetDragItemProps }) =>
                    nodes.map((element: Element, index: number) => {
                        const { className: dragItemClassName, ...otherDragItemProps } = getDragItemProps(index);

                        return (
                            <ReorderableElement
                                key={ element.id }
                                element={ element }
                                className={ classNames("flow-builder-step-content-form-field", dragItemClassName) }
                                draggableProps={ otherDragItemProps }
                            />
                        );
                    })
                }
            </DroppableContainer>
        </Badge>
    );
};

export default FormAdapter;
