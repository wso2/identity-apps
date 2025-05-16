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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import ResourcePanelItem, { ResourcePanelItemProps } from "./resource-panel-item";
import Draggable from "../dnd/draggable";

/**
 * Props interface of {@link ResourcePanelDraggable}
 */
export type ResourcePanelDraggablePropsInterface = ResourcePanelItemProps &
    IdentifiableComponentInterface &
    Omit<HTMLAttributes<HTMLDivElement>, "resource">;

/**
 * Draggable item for the resource panel.
 *
 * @param props - Props injected to the component.
 * @returns The ResourcePanelDraggable component.
 */
const ResourcePanelDraggable: FunctionComponent<ResourcePanelDraggablePropsInterface> = ({
    "data-componentid": componentId = "resource-panel-draggable-item",
    id,
    resource,
    onAdd,
    type = "draggable",
    ...rest
}: ResourcePanelDraggablePropsInterface): ReactElement => (
    <Draggable
        id={ id }
        data-componentid={ componentId }
        data={ { dragged: resource } }
        type={ resource.type }
        accept={ [ resource.type ] }
        { ...rest }
    >
        <ResourcePanelItem resource={ resource } type={ type } onAdd={ onAdd } />
    </Draggable>
);

export default ResourcePanelDraggable;
