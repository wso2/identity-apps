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
import {
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { DraggableNode, DroppableContainer, GetDragItemProps, useDnD  } from "@wso2is/dnd";
import React, { ReactElement, useState } from "react";

import PolicyListDraggableNode from "./policy-list-draggable-node";
import PolicyListNode from "./policy-list-node";
import {  PolicyInterface, PolicyListInterface } from "../models/policies";
import "./policy-list.scss";


interface PolicyListProps extends IdentifiableComponentInterface {
    onDrop?: (containerId: string) => void;
    policies?: PolicyInterface[]; // Use PolicyInterface[]
    containerId: string;
    isDraggable?: boolean; // Add a prop to control drag functionality
}



export const PolicyList: React.FunctionComponent<PolicyListProps> = ({
    onDrop,
    policies = [],
    containerId,
    isDraggable = true // Default to draggable
}: PolicyListProps): ReactElement => {
    const { generateComponentId } = useDnD();

    const renderDraggableList = () => (
        <DroppableContainer<PolicyInterface>
            nodes={ policies }
            onDrop={ () => onDrop?.(containerId) }
        >
            { ({
                nodes,
                getDragItemProps
            }: {
                nodes: PolicyInterface[];
                getDragItemProps: GetDragItemProps;
            }) =>
                nodes.map((policy: PolicyInterface, index) => {
                    const {
                        className: dragItemClassName,
                        ...otherDragItemProps
                    } = getDragItemProps(index);

                    return (
                        <div
                            key={ policy.policyId }
                            className={ dragItemClassName }
                            { ...otherDragItemProps }
                        >
                            <PolicyListDraggableNode
                                policy={ policy }
                                data-componentid={ generateComponentId() }
                            />
                        </div>
                    );
                })
            }
        </DroppableContainer>
    );

    const renderStaticList = () => (
        <div className="policy-inactive-list">
            { policies.map((policy) => (
                <PolicyListNode
                    key={ policy.policyId }
                    policy={ policy }
                    data-componentid={ generateComponentId() }
                />
            )) }
        </div>
    );

    return isDraggable ? renderDraggableList() : renderStaticList();
};

