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
import DraggableNode from "./draggable-node";
import { SupportedCanvasNodes } from "../models/visual-editor";
import "./visual-editor-draggable-node.scss";

/**
 * Props interface of {@link VisualEditorDraggableNode}
 */
export interface VisualEditorDraggableNodePropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    node: SupportedCanvasNodes;
}

/**
 * Draggable node for the visual editor.
 *
 * @param props - Props injected to the component.
 * @returns Draggable Visual Editor node component.
 */
const VisualEditorDraggableNode: FunctionComponent<VisualEditorDraggableNodePropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-editor-draggable-node",
    id,
    node,
    ...rest
}: VisualEditorDraggableNodePropsInterface): ReactElement => {
    return (
        <DraggableNode key={ id } node={ node } data-componentid={ componentId } { ...rest }>
            <Card className="authentication-flow-builder-draggable-node">
                <CardContent>
                    <Stack direction="row" spacing={ 1 }>
                        <Avatar
                            src={ node?.display?.image }
                            variant="square"
                            className="authentication-flow-builder-draggable-node-avatar"
                        />
                        <Typography>{ node?.display?.label?.fallback }</Typography>
                    </Stack>
                </CardContent>
            </Card>
        </DraggableNode>
    );
};

export default VisualEditorDraggableNode;
