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

import Box, { BoxProps } from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GetDragItemProps } from "@wso2is/dnd";
import { useNodeId } from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, SVGProps } from "react";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { Component } from "../../../../models/component";
import { Element } from "../../../../models/elements";
import getWidgetElements from "../../../../utils/get-widget-elements";
import isWidget from "../../../../utils/is-widget";

/**
 * Props interface of {@link ReorderableComponent}
 */
export interface ReorderableComponentPropsInterface
    extends IdentifiableComponentInterface,
        Omit<BoxProps, "component"> {
    /**
     * The component to be rendered.
     */
    component: Component;
    /**
     * Additional props needed for the draggable functionality.
     */
    draggableProps?: Partial<GetDragItemProps>;
}

// TODO: Move this to Oxygen UI.
/* eslint-disable max-len */
const GridDotsVerticalIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg fill="#a0a0a0" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" { ...rest }>
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
            <path
                d="M686.211 137.143v-.137l68.572.137H686.21Zm0 1508.571c75.566 0 137.143 61.577 137.143 137.143S761.777 1920 686.211 1920c-75.702 0-137.142-61.577-137.142-137.143s61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.577 137.143 137.143S1310.349 1920 1234.783 1920c-75.703 0-137.143-61.577-137.143-137.143s61.44-137.143 137.143-137.143ZM686.21 1097.143c75.566 0 137.143 61.577 137.143 137.143 0 75.565-61.577 137.143-137.143 137.143-75.702 0-137.142-61.578-137.142-137.143 0-75.566 61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.577 137.143 137.143 0 75.565-61.577 137.143-137.143 137.143-75.703 0-137.143-61.578-137.143-137.143 0-75.566 61.44-137.143 137.143-137.143ZM686.21 548.57c75.566 0 137.143 61.578 137.143 137.143 0 75.566-61.577 137.143-137.143 137.143-75.702 0-137.142-61.577-137.142-137.143 0-75.565 61.44-137.143 137.142-137.143Zm548.572 0c75.566 0 137.143 61.578 137.143 137.143 0 75.566-61.577 137.143-137.143 137.143-75.703 0-137.143-61.577-137.143-137.143 0-75.565 61.44-137.143 137.143-137.143ZM686.21 0c75.566 0 137.143 61.577 137.143 137.143S761.776 274.286 686.21 274.286c-75.702 0-137.142-61.577-137.142-137.143S610.509 0 686.21 0Zm548.503 0c75.566 0 137.143 61.577 137.143 137.143s-61.577 137.143-137.143 137.143c-75.565 0-137.143-61.577-137.143-137.143S1159.15 0 1234.714 0Z"
                fillRule="evenodd"
            />
        </g>
    </svg>
);

/**
 * Re-orderable component inside a step node.
 *
 * @param props - Props injected to the component.
 * @returns ReorderableComponent component.
 */
export const ReorderableComponent: FunctionComponent<ReorderableComponentPropsInterface> = ({
    component,
    className,
    "data-componentid": componentId = "reorderable-component",
    draggableProps
}: ReorderableComponentPropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const { ComponentFactory, setLastInteractedElement } = useAuthenticationFlowBuilderCore();

    // Widgets have a flow property which contains the elements of the sub flow.
    // If the component is a widget, render the elements of the flow.
    if (isWidget(component)) {
        return (
            <>
                { getWidgetElements(component)?.map((element: Element) => (
                    <ReorderableComponent
                        key={ element.id }
                        component={ element }
                        className={ className }
                        draggableProps={ draggableProps }
                    />
                )
                ) }
            </>
        );
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            draggable={ false }
            className={ classNames("reorderable-component", className) }
            onClick={ () => setLastInteractedElement(component) }
            data-componentid={ `${componentId}-${component.type}` }
            { ...draggableProps }
        >
            <div className="flow-builder-step-content-form-field-drag-handle">
                <GridDotsVerticalIcon height={ 20 } />
            </div>
            <div className="flow-builder-step-content-form-field-content">
                <ComponentFactory nodeId={ nodeId } node={ component } />
            </div>
        </Box>
    );
};

export default ReorderableComponent;
