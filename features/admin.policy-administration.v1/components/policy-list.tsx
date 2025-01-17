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
import { DroppableContainer, GetDragItemProps, useDnD  } from "@oxygen-ui/react/dnd";
import {
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import React, { ReactElement } from "react";
import PolicyListDraggableNode from "./policy-list-draggable-node";
import PolicyListNode from "./policy-list-node";
import { PolicyInterface } from "../models/policies";
import "./policy-list.scss";


interface PolicyListProps extends IdentifiableComponentInterface {
    onDrop?: (containerId: string) => void;
    policies?: PolicyInterface[]; // Use PolicyInterface[]
    containerId: string;
    isDraggable?: boolean; // Add a prop to control drag functionality
    mutateInactivePolicyList?: () => void;
    mutateActivePolicyList?: () => void;
    setInactivePolicies?: React.Dispatch<React.SetStateAction<PolicyInterface[]>>;
    setPageInactive?: React.Dispatch<React.SetStateAction<number>>;
    setHasMoreInactivePolicies?: React.Dispatch<React.SetStateAction<boolean>>;
}



export const PolicyList: React.FunctionComponent<PolicyListProps> = ({
    onDrop,
    policies = [],
    mutateInactivePolicyList, setInactivePolicies,
    setPageInactive,
    setHasMoreInactivePolicies,
    mutateActivePolicyList,
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
                nodes.map((policy: PolicyInterface, index: number) => {
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
                                mutateActivePolicyList={ mutateActivePolicyList }
                                mutateInactivePolicyList={ mutateInactivePolicyList }
                                setPageInactive={ setPageInactive }
                                setInactivePolicies={ setInactivePolicies }
                                setHasMoreInactivePolicies={ setHasMoreInactivePolicies }

                            />
                        </div>
                    );
                })
            }
        </DroppableContainer>
    );

    const renderStaticList = () => (
        <div className="policy-inactive-list">
            { policies.map((policy: PolicyInterface) => (
                <PolicyListNode
                    key={ policy.policyId }
                    policy={ policy }
                    data-componentid={ generateComponentId() }
                    mutateInactivePolicyList={ mutateInactivePolicyList }
                    mutateActivePolicyList={ mutateActivePolicyList }
                    setInactivePolicies={ setInactivePolicies }
                    setPageInactive={ setPageInactive }
                    setHasMoreInactivePolicies={ setHasMoreInactivePolicies }
                />
            )) }
        </div>
    );

    return isDraggable ? renderDraggableList() : renderStaticList();
};

