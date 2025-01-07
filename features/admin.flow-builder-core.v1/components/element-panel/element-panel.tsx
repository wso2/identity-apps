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

import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Box from "@oxygen-ui/react/Box";
import Drawer, { DrawerProps } from "@oxygen-ui/react/Drawer";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronRightIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, HTMLAttributes, ReactElement, SVGProps } from "react";
import ElementPanelDraggableNode from "./element-panel-draggable-node";
import { Component } from "../../models/component";
import { Elements } from "../../models/elements";
import { Template } from "../../models/template";
import { Widget } from "../../models/widget";
import "./element-panel.scss";

/**
 * Props interface of {@link ElementPanel}
 */
export interface ElementPanelPropsInterface
    extends DrawerProps,
        IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    /**
     * Flow elements.
     */
    elements: Elements;
}

/**
 * Flow builder element panel that contains draggable components.
 *
 * @param props - Props injected to the component.
 * @returns The ElementPanel component.
 */
const ElementPanel: FunctionComponent<ElementPanelPropsInterface> = ({
    "data-componentid": componentId = "element-panel",
    children,
    open,
    elements,
    ...rest
}: ElementPanelPropsInterface): ReactElement => {
    const { components, widgets, nodes, templates } = elements;

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
                onClose={ () => {} }
                elevation={ 5 }
                PaperProps={ { className: "flow-builder-element-panel" } }
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
                className={ classNames("flow-builder-element-panel", { mini: !open }) }
                variant={ open ? "permanent" : "temporary" }
            >
                <div
                    className={ classNames("flow-builder-element-panel-content", {
                        "full-height": true
                    }) }
                >
                    <Accordion
                        square
                        disableGutters
                        defaultExpanded
                        className={ classNames("flow-builder-element-panel-categories") }
                    >
                        <AccordionSummary
                            className="flow-builder-element-panel-category-heading"
                            expandIcon={ <ChevronRightIcon size={ 14 } /> }
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h6">Starter Templates</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="flow-builder-element-panel-category-details">
                            <Typography variant="body2">
                                Choose one of these templates to start building registration experience
                            </Typography>
                            <Stack direction="column" spacing={ 1 }>
                                { templates.map((template: Template) => (
                                    <ElementPanelDraggableNode
                                        id={ template.type }
                                        key={ template.type }
                                        node={ template }
                                    />
                                )) }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion square disableGutters className={ classNames("flow-builder-element-panel-categories") }>
                        <AccordionSummary
                            className="flow-builder-element-panel-category-heading"
                            expandIcon={ <ChevronRightIcon size={ 14 } /> }
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h6">Widgets</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="flow-builder-element-panel-category-details">
                            <Typography variant="body2">
                                Use these widgets to build up the flow using per-created flow blocks
                            </Typography>
                            <Stack direction="column" spacing={ 1 }>
                                { widgets.map((widget: Widget) => (
                                    <ElementPanelDraggableNode id={ widget.type } key={ widget.type } node={ widget } />
                                )) }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        square
                        disableGutters
                        className={ classNames("flow-builder-element-panel-categories") }
                    >
                        <AccordionSummary
                            className="flow-builder-element-panel-category-heading"
                            expandIcon={ <ChevronRightIcon size={ 14 } /> }
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h6">Steps</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="flow-builder-element-panel-category-details">
                            <Typography variant="body2">
                                Use these step blocks to orchestrate your custom registration flow
                            </Typography>
                            <Stack direction="column" spacing={ 1 }>
                                { nodes.map((node: Component) => (
                                    <ElementPanelDraggableNode id={ node.type } key={ node.type } node={ node } />
                                )) }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion square disableGutters className={ classNames("flow-builder-element-panel-categories") }>
                        <AccordionSummary
                            className="flow-builder-element-panel-category-heading"
                            expandIcon={ <ChevronRightIcon size={ 14 } /> }
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h6">Components</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="flow-builder-element-panel-category-details">
                            <Typography variant="body2">Use these components to build up custom UI prompts</Typography>
                            <Stack direction="column" spacing={ 1 }>
                                { components.map((node: Component) => (
                                    <ElementPanelDraggableNode id={ node.type } key={ node.type } node={ node } />
                                )) }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </Drawer>
        </Box>
    );
};

export default ElementPanel;
