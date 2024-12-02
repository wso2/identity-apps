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
import cloneDeep from "lodash-es/cloneDeep";
import React, { HTMLAttributes, MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";
import "./droppable-container.scss";

/**
 * Props interface of {@link DroppableContainer}
 */

export interface DroppableContainerProps<T = any>
    extends IdentifiableComponentInterface,
        Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * The nodes to be rendered inside the droppable container.
     */
    nodes: T[];
    /**
     * Callback to handle the order change of nodes.
     *
     * @param newOrder - The new order of nodes.
     */
    onOrderChange?: (newOrder: T[]) => void;
    /**
     * Function to render the children of the droppable container.
     *
     * @param props - The props to be passed to the children.
     * @returns The rendered children.
     */
    children: (props: { nodes: T[]; dragHandlers: DragHandlers; getDragItemProps: GetDragItemProps }) => ReactNode;
}

/**
 * Interface for the props of a draggable item.
 */
export interface DragItemProps {
    /**
     * The class name to be applied to the draggable item.
     */
    className?: string;
    /**
     * Indicates whether the item is draggable.
     */
    draggable: boolean;
    /**
     * Function to handle the drag start event.
     */
    onDragStart: () => void;
    /**
     * Function to handle the drag enter event.
     */
    onDragEnter: () => void;
    /**
     * Function to handle the drag end event.
     */
    onDragEnd: () => void;
}

/**
 * Type for the function to get the props of a draggable item.
 *
 * @param index - The index of the draggable item.
 * @returns The props of the draggable item.
 */
export type GetDragItemProps = (index: number) => DragItemProps;

/**
 * Interface for the drag handlers.
 */
export interface DragHandlers {
    /**
     * Function to handle the drag start event.
     *
     * @param index - The index of the item being dragged.
     */
    onDragStart: (index: number) => void;
    /**
     * Function to handle the drag end event.
     */
    onDragEnd: () => void;
    /**
     * Function to handle the drag enter event.
     *
     * @param index - The index of the item being dragged over.
     */
    onDragEnter: (index: number) => void;
}

/**
 * Container to drop draggable items.
 *
 * @param props - Props injected to the component.
 * @returns Droppable container component.
 */
const DroppableContainer = <T,>({ nodes, onOrderChange, children }: DroppableContainerProps<T>) => {
    const [ orderedNodes, setOrderedNodes ] = useState<T[]>([]);
    const dragNodeIndex: MutableRefObject<number> = useRef<number | null>(null);
    const dragOverNodeIndex: MutableRefObject<number> = useRef<number | null>(null);

    useEffect(() => setOrderedNodes(cloneDeep(nodes)), [ nodes ]);

    /**
     * Handles the drag start event.
     *
     * @param index - The index of the item being dragged.
     */
    const handleDragStart = (index: number) => {
        dragNodeIndex.current = index;
    };

    /**
     * Handles the drag enter event.
     *
     * @param index - The index of the item being dragged over.
     */
    const handleDragEnter = (index: number) => {
        dragOverNodeIndex.current = index;
    };

    /**
     * Handles the drag end event.
     */
    const handleDragEnd = () => {
        if (
            dragNodeIndex.current !== null &&
            dragOverNodeIndex.current !== null &&
            dragNodeIndex.current !== dragOverNodeIndex.current
        ) {
            const updatedNodes: T[] = [ ...orderedNodes ];
            const [ draggedItem ] = updatedNodes.splice(dragNodeIndex.current, 1);

            updatedNodes.splice(dragOverNodeIndex.current, 0, draggedItem);

            setOrderedNodes(updatedNodes);
            if (onOrderChange) {
                onOrderChange(updatedNodes);
            }
        }

        dragNodeIndex.current = null;
        dragOverNodeIndex.current = null;
    };

    const dragHandlers: DragHandlers = {
        onDragEnd: handleDragEnd,
        onDragEnter: handleDragEnter,
        onDragStart: handleDragStart
    };

    const getDragItemProps = (index: number): DragItemProps => ({
        className: "draggable-item",
        draggable: true,
        onDragEnd: handleDragEnd,
        onDragEnter: () => handleDragEnter(index),
        onDragStart: () => handleDragStart(index)
    });

    return (
        <div className="droppable-container">{ children({ dragHandlers, getDragItemProps, nodes: orderedNodes }) }</div>
    );
};

export default DroppableContainer;
