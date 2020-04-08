/*
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

import { GenericIcon, GenericIconProps } from "../icon";
import {
    Icon,
    Menu,
    SemanticICONS,
    SemanticShorthandItem,
    Sidebar,
    SidebarProps,
    TabPaneProps
} from "semantic-ui-react";
import React, {
    forwardRef,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    ReactElement, ReactNode,
    RefAttributes, useEffect, useState
} from "react";
import classNames from "classnames";
import { HelpPanelActionBar } from "./help-panel-action-bar";
import { ResourceTab } from "../tab";

/**
 * Component ref type.
 */
export type HelpPanelRefType = HTMLDivElement;

/**
 * Help side panel component sub component.
 */
export interface HelpPanelSubComponentsInterface {
    ActionBar: typeof HelpPanelActionBar;
}

/**
 * Help panel interface.
 */
export interface HelpPanelPropsInterface extends SidebarProps {
    /**
     * Set of actions for the top action bar.
     */
    actions: GenericIconProps[];
    /**
     * Array of objects describing tabs.
     */
    tabs: HelpPanelTabInterface[];
    /**
     * Is mini sidebar enabled.
     */
    sidebarMiniEnabled?: boolean;
    /**
     * Callback to be called on sidebar toggle.
     */
    onSidebarToggle: () => void;
    /**
     * Called on sidebar mini item click.
     * @param {string} item - Clicked on item.
     */
    onSidebarMiniItemClick?: (item: string) => void;
    /**
     * Initial tabs active index.
     */
    tabsActiveIndex?: number;
}

/**
 * Help panel component Prop types.
 */
export interface HelpPanelComponentPropsInterface extends HelpPanelPropsInterface, HelpPanelSubComponentsInterface {
}

/**
 * Help panel tab interface.
 */
export interface HelpPanelTabInterface {
    heading: any;
    content: ReactNode;
    icon: SemanticICONS;
}

/**
 * Help side panel.
 *
 * @param {React.PropsWithChildren<HelpPanelComponentPropsInterface>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const HelpPanel: ForwardRefExoticComponent<PropsWithoutRef<HelpPanelComponentPropsInterface>
    & RefAttributes<HelpPanelRefType>> & any = forwardRef<HelpPanelRefType, HelpPanelComponentPropsInterface>(
    (props, ref): ReactElement => {

        const {
            actions,
            children,
            className,
            onSidebarToggle,
            tabs,
            sidebarMiniEnabled,
            visible,
            tabsActiveIndex,
            onSidebarMiniItemClick,
            ...rest
        } = props;

        const [ activeIndex, setActiveIndex ] = useState<number>(tabsActiveIndex);
        const [ tabPanes, setTabPanes ] = useState<{
            icon?: SemanticICONS;
            pane?: SemanticShorthandItem<TabPaneProps>;
            menuItem?: any;
            render?: () => ReactNode;
        }[]>([]);

        const classes = classNames(
            "help-panel",
            {
                mini: sidebarMiniEnabled && !visible
            },
            className
        );

        /**
         * Called on tab active index change.
         */
        useEffect(() => {
            if (!tabsActiveIndex || tabsActiveIndex === activeIndex) {
                return;
            }

            setActiveIndex(tabsActiveIndex);
        }, [ tabsActiveIndex ]);

        /**
         * Called on tabs array change.
         */
        useEffect(() => {
            if (!tabs) {
                return;
            }

            setTabPanes(tabs.map((tab) => {
                return {
                    icon: tab.icon,
                    menuItem: tab.heading,
                    render: () => (
                        <ResourceTab.Pane attached={ false }>
                            { tab.content }
                        </ResourceTab.Pane>
                    )
                }
            }));
        }, [ tabs ]);

        return (
            <Sidebar
                animation="overlay"
                className={ classes }
                visible={ sidebarMiniEnabled || visible }
                { ...rest }
            >
                <div ref={ ref }>
                    {
                        sidebarMiniEnabled && !visible && (
                            <>
                                <Menu.Item as="a" onClick={ onSidebarToggle }>
                                    <Icon color="grey" name="angle left"/>
                                </Menu.Item>
                                {
                                    tabPanes && tabPanes instanceof Array && tabPanes.length > 0 && (
                                        tabPanes.map((pane, index) => (
                                            <Menu.Item as="a" key={ index }
                                                       onClick={ () => onSidebarMiniItemClick(pane.menuItem) }>
                                                <Icon color="grey" name={ pane.icon }/>
                                                { pane.menuItem }
                                            </Menu.Item>
                                        ))
                                    )
                                }
                            </>
                        )
                    }
                    {
                        visible && (
                            <>
                                {
                                    actions && actions instanceof Array && actions.length > 0 && (
                                        <HelpPanel.ActionBar>
                                            {
                                                actions.map((action, index) => (
                                                    <GenericIcon
                                                        key={ index }
                                                        size="default"
                                                        defaultIcon
                                                        link
                                                        hoverable
                                                        inline
                                                        transparent
                                                        { ...action }
                                                    />
                                                ))
                                            }
                                        </HelpPanel.ActionBar>
                                    )
                                }
                                <ResourceTab className="help-panel-tabs" panes={ tabPanes }
                                             defaultActiveIndex={ tabsActiveIndex }/>
                                { children }
                            </>
                        )
                    }
                </div>
            </Sidebar>
        );
    });

/**
 * Default props for the help panel component.
 */
HelpPanel.defaultProps = {
    direction: "right",
    sidebarMiniEnabled: true,
    visible: true
};

HelpPanel.ActionBar = HelpPanelActionBar;
