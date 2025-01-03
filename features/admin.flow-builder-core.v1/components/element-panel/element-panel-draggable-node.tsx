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
import { DraggableNode } from "@wso2is/dnd";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import { SupportedCanvasNodes } from "../../models/visual-editor";
import "./element-panel-draggable-node.scss";

/**
 * Props interface of {@link ElementPanelDraggableNode}
 */
export interface ElementPanelDraggableNodePropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    /**
     * The node that is being dragged.
     */
    node: SupportedCanvasNodes;
}

/**
 * Draggable node for the visual editor element panel.
 *
 * @param props - Props injected to the component.
 * @returns The ElementPanelDraggableNode component.
 */
const ElementPanelDraggableNode: FunctionComponent<ElementPanelDraggableNodePropsInterface> = ({
    "data-componentid": componentId = "element-panel-draggable-node",
    id,
    node,
    ...rest
}: ElementPanelDraggableNodePropsInterface): ReactElement => {
    return (
        <DraggableNode key={ id } node={ node } data-componentid={ componentId } { ...rest }>
            <Card className="flow-builder-element-panel-draggable-node" variant="elevation">
                <CardContent>
                    <Stack direction="row" spacing={ 1 }>
                        <Avatar
                            src={ node?.display?.image }
                            variant="square"
                            className="flow-builder-element-panel-draggable-node-avatar"
                        />
                        <Stack direction="column" spacing={ 0.5 }>
                            <Typography>{ node?.display?.label }</Typography>
                            { node?.display?.description && (
                                <Typography variant="body2">{ node?.display?.description }</Typography>
                            ) }
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </DraggableNode>
    );
};

export default ElementPanelDraggableNode;
