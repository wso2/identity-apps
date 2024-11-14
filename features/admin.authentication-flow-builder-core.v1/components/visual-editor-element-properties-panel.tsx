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

import Box from "@oxygen-ui/react/Box";
import Drawer from "@oxygen-ui/react/Drawer";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, HTMLAttributes, ReactElement, useState } from "react";
import "./visual-editor-element-properties-panel.scss";

/**
 * Props interface of {@link VisualEditorElementPropertiesPanel}
 */
export interface VisualEditorElementPropertiesPanelPropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {}

/**
 * Visual editor element properties panel to pick the nece
 *
 * @param props - Props injected to the component.
 * @returns Visual editor elements panel.
 */
const VisualEditorElementPropertiesPanel: FunctionComponent<VisualEditorElementPropertiesPanelPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-elements-panel",
    children,
    ...rest
}: VisualEditorElementPropertiesPanelPropsInterface): ReactElement => {
    const [ open, setOpen ] = useState(false);

    return (
        <Box
            width="100%"
            height="100%"
            id="drawer-container"
            position="relative"
            bgcolor="white"
            component="div"
            style={ { overflowX: "hidden", overflowY: "scroll" } }
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
            <Drawer
                open={ open }
                anchor="right"
                onClose={ () => {} }
                elevation={ 5 }
                PaperProps={ { className: "authentication-flow-builder-element-properties-panel" } }
                BackdropProps={ { style: { position: "absolute" } } }
                ModalProps={ {
                    container: document.getElementById("drawer-container"),
                    keepMounted: true,
                    style: { position: "absolute" }
                } }
                SlideProps={ {
                    onExiting: (node: HTMLElement) => {
                        node.style.webkitTransform = "scaleX(0)";
                        node.style.transform = "scaleX(0)";
                        node.style.transformOrigin = "top left ";
                    }
                } }
                hideBackdrop={ true }
                className={ classNames("authentication-flow-builder-element-properties-drawer", { mini: !open }) }
                variant="permanent"
            >
                <div
                    className={ classNames("authentication-flow-builder-element-properties-panel-content", {
                        "full-height": true
                    }) }
                >
                    Test
                </div>
            </Drawer>
        </Box>
    );
};

export default VisualEditorElementPropertiesPanel;
