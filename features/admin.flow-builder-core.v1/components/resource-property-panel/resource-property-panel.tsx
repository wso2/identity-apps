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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Drawer, { DrawerProps } from "@oxygen-ui/react/Drawer";
import IconButton from "@oxygen-ui/react/IconButton";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import ResourceProperties from "./resource-properties";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import { Element } from "../../models/elements";
import "./resource-property-panel.scss";

/**
 * Props interface of {@link ResourcePropertyPanel}
 */
export interface ResourcePropertyPanelPropsInterface extends DrawerProps, IdentifiableComponentInterface, HTMLAttributes<HTMLDivElement> {
    onComponentDelete: (stepId: string, component: Element) => void;
}

// TODO: Move this to Oxygen UI.
const ChevronsRight = ({ width = 16, height = 16 }: { width: number; height: number }): ReactElement => (
    <svg width={ width } height={ height } viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            // eslint-disable-next-line max-len
            d="M7.88104 7.6378L7.80501 7.54847L2.47172 2.44706C2.35409 2.33408 2.19652 2.26733 2.03005 2.25996C1.86358 2.25259 1.70024 2.30513 1.57224 2.40724C1.44424 2.50934 1.3609 2.6536 1.33857 2.81158C1.31624 2.96956 1.35659 3.12981 1.45169 3.26074L1.52772 3.35002L6.39033 7.99995L1.52772 12.65C1.41746 12.7556 1.3495 12.8949 1.33558 13.0436C1.32167 13.1923 1.36278 13.341 1.45169 13.4637L1.52772 13.5529C1.63819 13.6584 1.78379 13.7234 1.93927 13.7366C2.09468 13.7499 2.25009 13.7106 2.37836 13.6256L2.47172 13.5529L7.80501 8.45143C7.91527 8.34576 7.98323 8.20649 7.99715 8.05776C8.01099 7.9091 7.96995 7.76044 7.88104 7.6378ZM14.5477 7.6378L14.4717 7.54847L9.13836 2.44706C9.0208 2.33408 8.86323 2.26733 8.6967 2.25996C8.53023 2.25259 8.36689 2.30513 8.23889 2.40724C8.11089 2.50934 8.02755 2.6536 8.00522 2.81158C7.98296 2.96956 8.0233 3.12981 8.11833 3.26074L8.19436 3.35002L13.057 7.99995L8.19436 12.65C8.0841 12.7556 8.01614 12.8949 8.00223 13.0436C7.98838 13.1923 8.02943 13.341 8.11833 13.4637L8.19436 13.5529C8.30483 13.6584 8.4505 13.7234 8.60591 13.7366C8.76139 13.7499 8.91673 13.7106 9.04502 13.6256L9.13836 13.5529L14.4717 8.45143C14.5819 8.34576 14.6499 8.20649 14.6638 8.05776C14.6777 7.9091 14.6366 7.76044 14.5477 7.6378Z"
            fill="black"
        />
    </svg>
);

/**
 * Component to render the resource property panel.
 *
 * @param props - Props injected to the component.
 * @returns The ResourcePropertyPanel component.
 */
const ResourcePropertyPanel: FunctionComponent<ResourcePropertyPanelPropsInterface> = ({
    "data-componentid": componentId = "resource-property-panel",
    children,
    open,
    anchor = "right",
    onComponentDelete,
    ...rest
}: ResourcePropertyPanelPropsInterface): ReactElement => {
    const { resourcePropertiesPanelHeading, setIsOpenResourcePropertiesPanel, lastInteractedStepId, lastInteractedResource } = useAuthenticationFlowBuilderCore();

    return (
        <Box
            width="100%"
            height="100%"
            id="drawer-container"
            position="relative"
            bgcolor="white"
            component="div"
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
            <Drawer
                open={ open }
                anchor={ anchor }
                onClose={ () => {} }
                elevation={ 5 }
                PaperProps={ { className: "flow-builder-element-property-panel" } }
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
                className={ classNames("flow-builder-element-property-panel", { mini: !open }) }
                variant={ open ? "permanent" : "temporary" }
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    className="flow-builder-element-property-panel-header"
                >
                    { resourcePropertiesPanelHeading }
                    <IconButton onClick={ () => setIsOpenResourcePropertiesPanel(false) }>
                        <ChevronsRight height={ 16 } width={ 16 } />
                    </IconButton>
                </Box>
                <div
                    className={ classNames("flow-builder-element-property-panel-content", {
                        "full-height": true
                    }) }
                >
                    <ResourceProperties />
                </div>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="right"
                    className="flow-builder-element-property-panel-footer"
                >
                    <Button variant="contained" onClick={ () => onComponentDelete(lastInteractedStepId, lastInteractedResource) } startIcon={ <TrashIcon size={ 14 } /> } color="error">
                        Delete
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
};

export default ResourcePropertyPanel;
