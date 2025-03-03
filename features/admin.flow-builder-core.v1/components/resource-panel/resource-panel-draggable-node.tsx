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

import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import { SupportedCanvasResources } from "../../models/visual-flow";
import Draggable from "../dnd/draggable";
import "./resource-panel-draggable-node.scss";

/**
 * Props interface of {@link ResourcePanelDraggableNode}
 */
export interface ResourcePanelDraggableNodePropsInterface
    extends IdentifiableComponentInterface,
        Omit<HTMLAttributes<HTMLDivElement>, "resource"> {
    /**
     * The resource node that is being dragged.
     */
    resource: SupportedCanvasResources;
}

/**
 * Draggable node for the resource panel.
 *
 * @param props - Props injected to the component.
 * @returns The ResourcePanelDraggableNode component.
 */
const ResourcePanelDraggableNode: FunctionComponent<ResourcePanelDraggableNodePropsInterface> = ({
    "data-componentid": componentId = "resource-panel-draggable-node",
    id,
    resource,
    ...rest
}: ResourcePanelDraggableNodePropsInterface): ReactElement => (
    <Draggable id={ id } data-componentid={ componentId } data={ { resource } } type={ resource.resourceType } { ...rest }>
        <Card className="flow-builder-element-panel-draggable-node" variant="elevation">
            <CardContent>
                <Stack direction="row" spacing={ 1 }>
                    <Avatar
                        src={ resource?.display?.image }
                        variant="square"
                        className="flow-builder-element-panel-draggable-node-avatar"
                    />
                    <Stack direction="column" spacing={ 0.5 }>
                        <Typography>{ resource?.display?.label }</Typography>
                        { resource?.display?.description && (
                            <Typography variant="body2">{ resource?.display?.description }</Typography>
                        ) }
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    </Draggable>
);

export default ResourcePanelDraggableNode;
