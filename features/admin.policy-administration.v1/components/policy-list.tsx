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
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1";
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
    mutateInactivePolicyList?: () => void;
    mutateActivePolicyList?: () => void;
    setInactivePolicies?: React.Dispatch<React.SetStateAction<PolicyInterface[]>>;
    setPageInactive?: React.Dispatch<React.SetStateAction<number>>;
    setHasMoreInactivePolicies?: React.Dispatch<React.SetStateAction<boolean>>;
    setActivePolicies?: React.Dispatch<React.SetStateAction<PolicyInterface[]>>;
    setPageActive?: React.Dispatch<React.SetStateAction<number>>;
    setHasMoreActivePolicies?: React.Dispatch<React.SetStateAction<boolean>>;
}



export const PolicyList: React.FunctionComponent<PolicyListProps> = ({
    onDrop,
    policies = [],
    mutateInactivePolicyList, setInactivePolicies,
    setPageInactive,
    setHasMoreInactivePolicies,
    setActivePolicies,
    setPageActive,
    setHasMoreActivePolicies,
    mutateActivePolicyList,
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
                subtitle={ [
                    t("policyAdministration:activePoliciesPlaceholder.subtitle")
                ] }
                data-testid={ "empty-search-placeholder-icon" }
            />
        ) : (
            <DroppableContainer
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
                                draggable={ false }
                            >
                                <PolicyListDraggableNode
                                    policy={ policy }
                                    data-componentid={ generateComponentId() }
                                    mutateActivePolicyList={ mutateActivePolicyList }
                                    mutateInactivePolicyList={ mutateInactivePolicyList }
                                    setPageActive={ setPageActive }
                                    setHasMoreActivePolicies={ setHasMoreActivePolicies }
                                    setActivePolicies={ setActivePolicies }

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
                    subtitle={ [
                        t("policyAdministration:inactivePoliciesPlaceholder.subtitle")
                    ] }
                    data-testid={ "empty-search-placeholder-icon" }
                />
            ) : ( policies.map((policy: PolicyInterface) => (
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
            ))
            ) }
        </div>
    );

    return isDraggable ? renderDraggableList() : renderStaticList();
};

