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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { DragEvent, FunctionComponent, HTMLAttributes, ReactElement } from "react";
import useDnD from "../hooks/use-dnd";
import "./draggable-node.scss";

/**
 * Props interface of {@link DraggableNode}
 */
export interface DraggableNodePropsInterface<T = any>
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    /**
     * The node that is being dragged.
     */
    node: T;
}

/**
 * A component that represents a draggable node.
 *
 * @param props - Props injected to the component.
 * @returns Draggable node component.
 */
const DraggableNode: FunctionComponent<DraggableNodePropsInterface> = ({
    "data-componentid": componentId = "draggable-node",
    children,
    node,
    ...rest
}: DraggableNodePropsInterface): ReactElement => {
    const { setNode } = useDnD();

    const onDragStart = (event: DragEvent, node: Node) => {
        setNode(node);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/json", JSON.stringify(node));
    };

    return (
        <div
            draggable
            onDragStart={ (event: DragEvent) => onDragStart(event, node) }
            data-componentid={ componentId }
            className="draggable-node"
            { ...rest }
        >
            { children }
        </div>
    );
};

export default DraggableNode;
