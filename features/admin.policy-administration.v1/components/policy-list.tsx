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

import { DroppableContainer, GetDragItemProps, useDnD  } from "@oxygen-ui/react/dnd";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import {
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import {
    EmptyPlaceholder
} from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import PolicyListDraggableNode from "./policy-list-draggable-node";
import PolicyListNode from "./policy-list-node";
import { PolicyInterface } from "../models/policies";
import "./policy-list.scss";

interface PolicyListProps extends IdentifiableComponentInterface {
    onDrop?: (containerId: string) => void;
    policies?: PolicyInterface[]; // Use PolicyInterface[]
    containerId: string;
    isDraggable?: boolean; // Add a prop to control drag functionality
    /**
     * Delete an active policy.
     *
     * @param policyId - The policy ID.
     */
    deleteActivePolicy?: (policyId: string) => void;
    /**
     * Delete an inactive policy.
     *
     * @param policyId - The policy ID.
     */
    deleteInactivePolicy?: (policyId: string) => void;
    /**
     * Deactivate a policy.
     *
     * @param policyId - The policy ID.
     */
    deactivatePolicy?: (policyId: string) => void;
    /**
     * Activate a policy.
     *
     * @param policyId - The policy ID.
     */
    activatePolicy?: (policyId: string) => void;
}



export const PolicyList: React.FunctionComponent<PolicyListProps> = ({
    onDrop,
    policies = [],
    deleteActivePolicy,
    deleteInactivePolicy,
    activatePolicy,
    deactivatePolicy,
    containerId,
    isDraggable = true // Default to draggable
}: PolicyListProps): ReactElement => {
    const { t } = useTranslation();
    const { generateComponentId } = useDnD();

    const renderDraggableList = () => (
        policies.length === 0 ? (
            <EmptyPlaceholder
                image={ getEmptyPlaceholderIllustrations().emptySearch }
                imageSize="tiny"
                title={ t("policyAdministration:activePoliciesPlaceholder.title") }
                subtitle={ [ t("policyAdministration:activePoliciesPlaceholder.subtitle") ] }
                data-componentid={ "active-policy-list-empty-search-placeholder-icon" }
            />
        ) : (
            <DroppableContainer
                nodes={ policies }
                onDrop={ () => onDrop(containerId) }
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
                                draggable={ false }
                            >
                                <PolicyListDraggableNode
                                    policy={ policy }
                                    data-componentid={ generateComponentId() }
                                    onDelete={ deleteActivePolicy }
                                    onDeactivate={ deactivatePolicy }
                                />
                            </div>
                        );
                    })
                }
            </DroppableContainer>
        )
    );

    const renderStaticList = () => (
        <div className="policy-inactive-list">
            { policies.length === 0 ? (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                    title={ t("policyAdministration:inactivePoliciesPlaceholder.title") }
                    subtitle={ [ t("policyAdministration:inactivePoliciesPlaceholder.subtitle") ] }
                    data-componentid={ "inactive-policy-list-empty-search-placeholder-icon" }
                />
            ) : ( policies.map((policy: PolicyInterface) => (
                <PolicyListNode
                    key={ policy.policyId }
                    policy={ policy }
                    data-componentid={ generateComponentId() }
                    onDelete={ deleteInactivePolicy }
                    onActivate={ activatePolicy }
                />
            ))
            ) }
        </div>
    );

    return isDraggable ? renderDraggableList() : renderStaticList();
};

