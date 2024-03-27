/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import Drawer, { DrawerProps } from "@oxygen-ui/react/Drawer";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { MouseEvent, PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from "react";
import "./side-panel-drawer.scss";

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const ChevronsLeft = ({ width=16, height=16 }: { width: number; height: number }): ReactElement => (
    <svg width={ width } height={ height } viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        { /* eslint-disable-next-line max-len */ }
        <path d="M11.671 10.4793L11.7803 10.3509L19.4469 3.01762C19.616 2.85521 19.8425 2.75926 20.0818 2.74866C20.3211 2.73807 20.5559 2.8136 20.7399 2.96037C20.9239 3.10715 21.0437 3.31452 21.0758 3.54161C21.1079 3.76871 21.0499 3.99907 20.9132 4.18728L20.8039 4.31562L13.8139 10.9999L20.8039 17.6843C20.9624 17.8362 21.0601 18.0364 21.0801 18.2502C21.1001 18.4639 21.041 18.6776 20.9132 18.854L20.8039 18.9823C20.6451 19.1339 20.4358 19.2273 20.2123 19.2464C19.9889 19.2655 19.7655 19.209 19.5811 19.0868L19.4469 18.9823L11.7803 11.6489C11.6218 11.497 11.5241 11.2968 11.5041 11.083C11.4842 10.8693 11.5432 10.6556 11.671 10.4793ZM2.08769 10.4793L2.19694 10.3509L9.86361 3.01762C10.0326 2.85521 10.2591 2.75926 10.4985 2.74866C10.7378 2.73807 10.9726 2.8136 11.1566 2.96037C11.3406 3.10715 11.4604 3.31452 11.4925 3.54161C11.5245 3.76871 11.4665 3.99907 11.3299 4.18728L11.2206 4.31562L4.23053 10.9999L11.2206 17.6843C11.3791 17.8362 11.4768 18.0364 11.4968 18.2502C11.5167 18.4639 11.4577 18.6776 11.3299 18.854L11.2206 18.9823C11.0618 19.1339 10.8524 19.2273 10.629 19.2464C10.4055 19.2655 10.1822 19.209 9.99778 19.0868L9.86361 18.9823L2.19694 11.6489C2.03848 11.497 1.94076 11.2968 1.9208 11.083C1.90083 10.8693 1.95989 10.6556 2.08769 10.4793Z" fill="black"/>
    </svg>
);

/**
 * Proptypes for the side panel drawer component.
 */
export interface SidePanelDrawerPropsInterface extends DrawerProps, IdentifiableComponentInterface {
    /**
     * Override the defult drawer chevron icon.
     */
    drawerIcon?: ReactNode;
    /**
     * Drawer panel.
     */
    panel: ReactElement;
    /**
     * Label for the panel controls.
     */
    panelControlsLabel?: ReactNode;
}

/**
 * Side panel drawer component.
 *
 * @param props - Props injected to the component.
 * @returns Side panel drawer as a React component.
 */
const SidePanelDrawer = (props: PropsWithChildren<SidePanelDrawerPropsInterface>): ReactElement => {
    const {
        children,
        className,
        drawerIcon,
        panel,
        panelControlsLabel,
        open,
        [ "data-componentid" ]: componentId,
        onClose,
        ...rest
    } = props;

    const [ isDrawerOpen, setIsDrawerOpen ] = useState<boolean>(open);

    /**
     * Set the drawer open state when the `open` prop changes.
     */
    useEffect(() => {
        setIsDrawerOpen(open);
    }, [ open ]);

    /**
     * Handles the drawer open state.
     *
     * @param event - Click event.
     */
    const handleDrawerOpen = (event: MouseEvent<HTMLDivElement>): void => {
        if (!isDrawerOpen) {
            setIsDrawerOpen(true);

            return;
        }

        setIsDrawerOpen(false);
        onClose && onClose(event, "backdropClick");
    };

    return (
        <>
            <Box component="main" sx={ { flexGrow: 1 } } data-componentid={ `${ componentId }-main` }>
                { children }
            </Box>
            { panel && (
                <Drawer
                    open={ isDrawerOpen }
                    PaperProps={ {
                        className: classNames("side-panel-drawer", { open: isDrawerOpen }, className),
                        style: { position: "relative" }
                    } }
                    BackdropProps={ { style: { position: "absolute" } } }
                    ModalProps={ {
                        container: document.getElementById("drawer-container"),
                        style: { position: "absolute" }
                    } }
                    variant="permanent"
                    anchor="right"
                    className={ classNames("side-panel-drawer", { open: isDrawerOpen }, className) }
                    data-componentid={ componentId }
                    { ...rest }
                >
                    <div className="side-panel-drawer-panel">
                        <div className="side-panel-drawer-panel-controls" onClick={ handleDrawerOpen }>
                            <div className="side-panel-drawer-panel-controls-chevron">
                                { drawerIcon || <ChevronsLeft height={ 16 } width={ 16 } /> }
                            </div>
                            { panelControlsLabel && (
                                <div className="side-panel-drawer-panel-controls-label">
                                    <Typography>{ panelControlsLabel }</Typography>
                                </div>
                            ) }
                        </div>
                        <div className="side-panel-drawer-panel-content">
                            { panel }
                        </div>
                    </div>
                </Drawer>
            ) }
        </>
    );
};

/**
 * Default props for the side panel drawer component.
 */
SidePanelDrawer.defaultProps = {
    "data-componentid": "side-panel-drawer"
};

export default SidePanelDrawer;
