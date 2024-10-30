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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow } from "@xyflow/react";
import classNames from "classnames";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement
} from "react";
import AuthenticationFlowVisualEditorWidgetPanel from "./authentication-flow-visual-editor-components-panel";
import "./authentication-flow-visual-editor.scss";
import "@xyflow/react/dist/style.css";

/**
 * Props interface of {@link AuthenticationFlowVisualEditor}
 */
export interface AuthenticationFlowVisualEditorPropsInterface extends IdentifiableComponentInterface,
    HTMLAttributes<HTMLDivElement> {
}

/**
 * Visual editor component.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor component.
 */
const AuthenticationFlowVisualEditor: FunctionComponent<AuthenticationFlowVisualEditorPropsInterface> = (
    {
        "data-componentid": componentId = "authentication-flow-visual-editor",
        ...rest
    }: AuthenticationFlowVisualEditorPropsInterface
): ReactElement => {
    return (
        <div
            className={ classNames("react-flow-container", "visual-editor") }
            data-componentid={ componentId }
            { ...rest }
        >
            <AuthenticationFlowVisualEditorWidgetPanel>
                <ReactFlow
                    fitView
                    nodes={ [
                        {
                            data: { label: "Hello" },
                            id: "1",
                            position: { x: 0, y: 0 }
                        }
                    ] }
                    proOptions={ { hideAttribution: true } }
                >
                    <Background color="#e1e1e1" gap={ 16 } variant={ BackgroundVariant.Dots } size={ 2 } />
                    <Controls position="top-right" />
                </ReactFlow>
            </AuthenticationFlowVisualEditorWidgetPanel>
        </div>
    );
};

export default AuthenticationFlowVisualEditor;
