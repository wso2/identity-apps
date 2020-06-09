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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    ForwardRefExoticComponent,
    PropsWithoutRef,
    ReactElement,
    ReactNode, RefAttributes,
    forwardRef, useEffect, useState
} from "react";
import {
    Icon,
    Menu,
    SemanticICONS,
    SemanticShorthandItem,
    Sidebar,
    SidebarProps,
    TabPaneProps
} from "semantic-ui-react";
import { HelpPanelActionBar } from "./help-panel-action-bar";
import { GenericIcon, GenericIconProps } from "../icon";
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
export interface HelpPanelPropsInterface extends SidebarProps, TestableComponentInterface {
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
    hidden: boolean;
    content: ReactNode;
    icon: SemanticICONS;
}

/**
 * Help side panel.
 *
 * @param {React.PropsWithChildren<HelpPanelComponentPropsInterface>} props - Props injected to the component.
 *
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
            [ "data-testid" ]: testId,
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
                data-testid={ testId }
                { ...rest }
            >
                <div ref={ ref }>
                    {
                        sidebarMiniEnabled && !visible && (
                            <>
                                <Menu.Item
                                    as="a"
                                    onClick={ onSidebarToggle }
                                    data-testid={ `${ testId }-visibility-toggle` }
                                >
                                    <Icon
                                        color="grey"
                                        name="angle left"
                                        data-testid={ `${ testId }-visibility-toggle-icon` }
                                    />
                                </Menu.Item>
                                {
                                    tabPanes && tabPanes instanceof Array && tabPanes.length > 0 && (
                                        tabPanes.map((pane, index) => (
                                            <Menu.Item
                                                as="a"
                                                key={ index }
                                                onClick={ () => onSidebarMiniItemClick(pane.menuItem) }
                                                data-testid={ `${ testId }-sidebar-mini-item-${ index }` }
                                            >
                                                <Icon
                                                    color="grey"
                                                    name={ pane.icon }
                                                    data-testid={ `${ testId }-sidebar-mini-item-${ index }-icon` }
                                                />
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
                                        <HelpPanel.ActionBar data-testid={ `${ testId }-action-bar` }>
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
                                                        data-testid={ `${ testId }-action-bar-action-${ index }` }
                                                        { ...action }
                                                    />
                                                ))
                                            }
                                        </HelpPanel.ActionBar>
                                    )
                                }
                                <ResourceTab
                                    className="help-panel-tabs"
                                    panes={ tabPanes }
                                    defaultActiveIndex={ tabsActiveIndex }
                                    data-testid={ `${ testId }-tabs` }
                                />
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
    "data-testid": "help-panel",
    direction: "right",
    sidebarMiniEnabled: true,
    visible: true
};

HelpPanel.ActionBar = HelpPanelActionBar;
