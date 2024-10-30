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

import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Stack from "@oxygen-ui/react/Stack";
import Toolbar from "@oxygen-ui/react/Toolbar";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ReactFlowProps } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import AuthenticationFlowVisualEditorDraggableNode from "./authentication-flow-visual-editor-draggable-node";
import DraggableNode from "./draggable-node";
import useGetAuthenticationFlowBuilderPrimitives from "../api/use-get-authentication-flow-builder-primitives";
import "./authentication-flow-visual-editor-primitives-panel.scss";
import { Primitive } from "../models/primitives";

const StepIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 16 16" fill="none">
        <path
            fill="#000000"
            fillRule="evenodd"
            d="M12.25 14a.75.75 0 000-1.5h-3a1.75 1.75 0 01-1.75-1.75v-.25a1.75 1.75 0 001.75-1.75v-1.5A1.75 1.75 0 007.5 5.5V2.75a.75.75 0 00-1.5 0V5.5a1.75 1.75 0 00-1.75 1.75v1.5c0 .966.784 1.75 1.75 1.75v.25A3.25 3.25 0 009.25 14h3zm-6.5-6.75A.25.25 0 016 7h1.5a.25.25 0 01.25.25v1.5A.25.25 0 017.5 9H6a.25.25 0 01-.25-.25v-1.5z"
            clipRule="evenodd"
        />
    </svg>
);

const DecisionIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="#000000"
        width="20px"
        height="20px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 100 100"
        xmlSpace="preserve"
    >
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
            <g>
                <path d="M79.4,28.8l-5.2-3.9c-0.8-0.5-1.5-0.8-2.4-0.8H54V22c0-1.1-0.9-2-2-2h-4c-1.1,0-2,0.9-2,2v2H26 c-1.1,0-2,0.9-2,2v8c0,1.1,0.9,2,2,2h45.8c0.9,0,1.8-0.2,2.4-0.8l5.2-3.9C80.2,30.6,80.2,29.4,79.4,28.8z M74,46H54v-3 c0-0.6-0.4-1-1-1h-6c-0.6,0-1,0.4-1,1v3H28.3c-0.9,0-1.8,0.2-2.4,0.8l-5.2,3.9c-0.9,0.6-0.9,1.9,0,2.6l5.2,3.9 c0.8,0.5,1.5,0.8,2.4,0.8H74c1.1,0,2-0.9,2-2v-8C76,46.9,75.1,46,74,46z M54,71.6v-4.9c0-0.6-0.4-1-1-1h-6c-0.6,0-1,0.4-1,1v4.9 c-4,1.1-6.2,3.5-6.9,6.5C38.9,79,39.6,80,40.6,80h18.9c1,0,1.8-0.9,1.5-1.9C60.3,75.1,58,72.8,54,71.6z" />
            </g>
        </g>
    </svg>
);

/**
 * Props interface of {@link AuthenticationFlowVisualEditorPrimitivesPanel}
 */
export interface AuthenticationFlowVisualEditorPropsInterface
    extends IdentifiableComponentInterface,
        ReactFlowProps<any, any> {}

/**
 * Wrapper component for React Flow used in the Visual Editor.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor flow component.
 */
const AuthenticationFlowVisualEditorPrimitivesPanel: FunctionComponent<AuthenticationFlowVisualEditorPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-editor-primitives-panel",
    ...rest
}: AuthenticationFlowVisualEditorPropsInterface): ReactElement => {
    const { data } = useGetAuthenticationFlowBuilderPrimitives();
    const { primitives } = data;

    return (
        <Toolbar className="authentication-flow-visual-editor-primitives-panel">
            <Typography variant="h6" className="authentication-flow-visual-editor-primitives-panel-heading">
                Primitives
            </Typography>
            <Stack direction="row" spacing={ 2 }>
                { primitives?.map((primitive: Primitive) => (
                    <AuthenticationFlowVisualEditorDraggableNode
                        id={ primitive.type }
                        key={ primitive.type }
                        category={ primitive.category }
                        type={ primitive.type }
                        displayName={ primitive.displayName }
                        image={ primitive.image }
                    />
                )) }
            </Stack>
        </Toolbar>
    );
};

export default AuthenticationFlowVisualEditorPrimitivesPanel;
