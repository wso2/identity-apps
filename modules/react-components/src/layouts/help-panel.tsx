/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import { GenericIconProps, HelpPanel, HelpPanelPropsInterface, HelpPanelTabInterface } from "../components";

/**
 * Help panel layout Prop types.
 */
export interface HelpPanelLayoutLayoutPropsInterface {
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Completely disables the sidebar.
     */
    enabled?: boolean;
    /**
     * Set of icons for the action panel.
     */
    icons?: HelpPanelIconsInterface;
    /**
     * Callback for pin button click.
     */
    onHelpPanelPin: () => void;
    /**
     * Direction of the sidebar.
     */
    sidebarDirection?: HelpPanelPropsInterface["direction"];
    /**
     * Toggle the visibility of the sidebar. Mini version will be shown if it is enabled.
     */
    sidebarVisibility?: HelpPanelPropsInterface["visible"];
    /**
     * Is mini sidebar enabled.
     */
    sidebarMiniEnabled?: HelpPanelPropsInterface["sidebarMiniEnabled"];
    /**
     * Array of objects describing tabs.
     */
    tabs: HelpPanelPropsInterface["tabs"];
}

/**
 * Interface for help panel icons.
 */
export interface HelpPanelIconsInterface {
    /**
     * Pin icon.
     */
    pin: GenericIconProps["icon"];
    /**
     * Close icon.
     */
    close: GenericIconProps["icon"];
}

/**
 * Help panel layout.
 *
 * @param {React.PropsWithChildren<HelpPanelLayoutLayoutPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const HelpPanelLayout: FunctionComponent<PropsWithChildren<HelpPanelLayoutLayoutPropsInterface>> = (
    props: PropsWithChildren<HelpPanelLayoutLayoutPropsInterface>
): ReactElement => {

    const sidebarRef = useRef<HTMLDivElement>();
    const contentRef = useRef<HTMLDivElement>();

    const {
        children,
        className,
        enabled,
        icons,
        onHelpPanelPin,
        sidebarDirection,
        tabs,
        ...rest
    } = props;

    const [ helpSidebarVisibility, setHelpSidebarVisibility ] = useState<boolean>(false);
    const [ helpPanelTabsActiveIndex, setHelpPanelTabsActiveIndex ] = useState<number>(0);

    const layoutClasses = classNames(
        "layout",
        "help-panel-layout",
        className
    );

    const layoutContentClasses = classNames("layout-content");

    useEffect(() => {
        if (!sidebarRef?.current?.clientWidth) {
            return;
        }

        contentRef.current.style.width = "calc(100% - " + sidebarRef?.current?.clientWidth + "px)";
    }, [ helpSidebarVisibility ]);

    /**
     * Handles sidebar mini item click event.
     *
     * @param {string} item - Clicked item.
     */
    const handleSidebarMiniItemClick = (item: string) => {
        getFilteredHelpPanelTabs().forEach((pane, index) => {
            if (pane.heading === item) {
                setHelpPanelTabsActiveIndex(index);
            }
        });

        setHelpSidebarVisibility(true);
    };

    /**
     * Filter the help panel tabs and remove hidden tabs.
     *
     * @return {HelpPanelTabInterface[]} Modified tabs array.
     */
    const getFilteredHelpPanelTabs = (): HelpPanelTabInterface[] => {
        return tabs.filter((tab) => !tab.hidden)
    };

    /**
     * Handles the help panel toggle action.
     */
    const handleHelpPanelToggle = () => {
        setHelpSidebarVisibility(!helpSidebarVisibility);
    };

    return (
        enabled
            ? (
                <Sidebar.Pushable className={ layoutClasses }>
                    <HelpPanel
                        as={ Menu }
                        animation="overlay"
                        direction={ sidebarDirection }
                        icon="labeled"
                        vertical
                        visible={ helpSidebarVisibility }
                        ref={ sidebarRef }
                        actions={ [
                            {
                                icon: icons.pin,
                                onClick: onHelpPanelPin
                            },
                            {
                                icon: icons.close,
                                onClick: handleHelpPanelToggle
                            }
                        ] }
                        tabsActiveIndex={ helpPanelTabsActiveIndex }
                        tabs={ getFilteredHelpPanelTabs() }
                        onSidebarMiniItemClick={ handleSidebarMiniItemClick }
                        onSidebarToggle={ handleHelpPanelToggle }
                        { ...rest }
                    />

                    <Sidebar.Pusher className={ layoutContentClasses }>
                        <div ref={ contentRef }>
                            { children }
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            )
            : <>{ children }</>
    );
};

/**
 * Default props for the sidebar pusher layout.
 */
HelpPanelLayout.defaultProps = {
    enabled: true,
    sidebarMiniEnabled: true,
    sidebarVisibility: false
};
