/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Stack from "@oxygen-ui/react/Stack";
import Toolbar, { ToolbarProps } from "@oxygen-ui/react/Toolbar";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import VisualEditorDraggableNode from "./visual-editor-draggable-node";
import useGetAuthenticationFlowBuilderPrimitives from "../api/use-get-authentication-flow-builder-primitives";
import { Primitive } from "../models/primitives";
import "./visual-editor-primitives-panel.scss";

/**
 * Props interface of {@link VisualEditorPrimitivesPanel}
 */
export interface VisualEditorPropsInterface extends IdentifiableComponentInterface, ToolbarProps {}

/**
 * Wrapper component for React Flow used in the Visual Editor.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor flow component.
 */
const VisualEditorPrimitivesPanel: FunctionComponent<VisualEditorPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-editor-primitives-panel",
    ...rest
}: VisualEditorPropsInterface): ReactElement => {
    const { data } = useGetAuthenticationFlowBuilderPrimitives();
    const { primitives } = data;

    return (
        <Toolbar
            className="authentication-flow-builder-primitives-panel"
            data-componentid={ componentId }
            { ...rest }
        >
            <Typography variant="h6" className="authentication-flow-builder-primitives-panel-heading">
                Primitives
            </Typography>
            <Stack direction="row" spacing={ 2 }>
                { primitives?.map((primitive: Primitive) => (
                    <VisualEditorDraggableNode
                        id={ primitive.type }
                        key={ primitive.type }
                        node={ primitive }
                    />
                )) }
            </Stack>
        </Toolbar>
    );
};

export default VisualEditorPrimitivesPanel;