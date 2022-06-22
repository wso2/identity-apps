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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    ForwardRefExoticComponent,
    PropsWithoutRef,
    ReactElement,
    ReactNode,
    RefAttributes,
    forwardRef,
    useEffect,
    useState
} from "react";
import {
    Menu,
    SemanticShorthandItem,
    Sidebar,
    SidebarProps,
    TabPaneProps
} from "semantic-ui-react";
import { HelpPanelActionBar } from "./help-panel-action-bar";
import { ReactComponent as CaretLeftIcon } from "../../assets/images/caret-left-icon.svg";
import { GenericIcon, GenericIconProps } from "../icon";
import { ResourceTab } from "../tab";
import { Tooltip } from "../typography";

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
export interface HelpPanelPropsInterface extends SidebarProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Set of actions for the top action bar.
     */
    actions?: HelpPanelActionInterface[];
    /**
     * Enable borders.
     */
    bordered?: "left" | "right" | "bottom" | "top" | boolean;
    /**
     * Array of objects describing tabs.
     */
    tabs: HelpPanelTabInterface[];
    /**
     * Is mini sidebar enabled.
     */
    sidebarMiniEnabled?: boolean;
    /**
     * Tooltip for the sidebar toggle button.
     */
    sidebarToggleTooltip?: string;
    /**
     * Flag to show/hide tab labels on mini sidebar.
     */
    showLabelsOnSidebarMini?: boolean;
    /**
     * Flag to enable/disable showing tool tips on action bar.
     */
    showTooltipsOnActionBar?: boolean;
    /**
     * Flag to enable/disable showing tool tips on sidebar mini.
     */
    showTooltipsOnSidebarMini?: boolean;
    /**
     * Callback to be called on sidebar toggle.
     */
    onSidebarToggle?: () => void;
    /**
     * Called on sidebar mini item click.
     * @param {string} item - Clicked on item.
     */
    onSidebarMiniItemClick?: (item: string) => void;
    /**
     * Should the help panel appear raised.
     */
    raised?: boolean;
    /**
     * Initial tabs active index.
     */
    tabsActiveIndex?: number;
}

/**
 * Interface for help panel actions.
 */
export interface HelpPanelActionInterface extends GenericIconProps {
    /**
     * Tooltip for the button.
     */
    tooltip?: string;
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
    icon: GenericIconProps;
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
        (props: HelpPanelPropsInterface, ref): ReactElement => {

            const {
                actions,
                bordered,
                children,
                className,
                onSidebarToggle,
                tabs,
                raised,
                showLabelsOnSidebarMini,
                showTooltipsOnSidebarMini,
                sidebarMiniEnabled,
                sidebarToggleTooltip,
                visible,
                tabsActiveIndex,
                onSidebarMiniItemClick,
                [ "data-componentid" ]: componentId,
                [ "data-testid" ]: testId,
                ...rest
            } = props;

            const [ activeIndex, setActiveIndex ] = useState<number>(tabsActiveIndex);
            const [ tabPanes, setTabPanes ] = useState<{
            icon?: GenericIconProps;
            pane?: SemanticShorthandItem<TabPaneProps>;
            menuItem?: any;
            render?: () => ReactNode;
                }[]>([]);

            const classes = classNames(
                "help-panel",
                {
                    [ typeof bordered === "boolean" ? "bordered-default" : `bordered-${ bordered }` ]: bordered,
                    mini: sidebarMiniEnabled && !visible,
                    raised
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
                    };
                }));
            }, [ tabs ]);

            return (
                <Sidebar
                    animation="overlay"
                    className={ classes }
                    visible={ sidebarMiniEnabled || visible }
                    data-componentid={ componentId }
                    data-testid={ testId }
                    { ...rest }
                >
                    <div className="help-panel-content-container" ref={ ref }>
                        {
                            sidebarMiniEnabled && !visible && (
                                <div className="sidebar-mini-menu">
                                    {
                                        tabPanes && tabPanes instanceof Array && tabPanes.length > 1 && (
                                            <Menu.Item
                                                as="a"
                                                onClick={ onSidebarToggle }
                                                data-componentid={ `${ componentId }-visibility-toggle` }
                                                data-testid={ `${ testId }-visibility-toggle` }
                                            >
                                                <Tooltip
                                                    compact
                                                    trigger={ (
                                                        <div>
                                                            <GenericIcon
                                                                link
                                                                hoverable
                                                                defaultIcon
                                                                transparent
                                                                icon={ CaretLeftIcon }
                                                                size="default"
                                                                hoverType="circular"
                                                                data-componentid={
                                                                    `${ componentId }-visibility-toggle-icon`
                                                                }
                                                                data-testid={ `${ testId }-visibility-toggle-icon` }
                                                            />
                                                        </div>
                                                    ) }
                                                    content={ sidebarToggleTooltip }
                                                    size="mini"
                                                />
                                            </Menu.Item>
                                        )
                                    }
                                    {
                                        tabPanes && tabPanes instanceof Array && tabPanes.length > 0 && (
                                            tabPanes.map((pane, index) => (
                                                <Menu.Item
                                                    as="a"
                                                    key={ index }
                                                    onClick={ () => onSidebarMiniItemClick(pane.menuItem) }
                                                    data-componentid={
                                                        `${ componentId }-sidebar-mini-item-${ index }`
                                                    }
                                                    data-testid={ `${ testId }-sidebar-mini-item-${ index }` }
                                                >
                                                    <Tooltip
                                                        compact
                                                        disabled={
                                                            showLabelsOnSidebarMini || !showTooltipsOnSidebarMini
                                                        }
                                                        trigger={ (
                                                            <div>
                                                                <GenericIcon
                                                                    link
                                                                    hoverable
                                                                    defaultIcon
                                                                    transparent
                                                                    size="default"
                                                                    hoverType="circular"
                                                                    data-componentid={
                                                                        `${ componentId }-sidebar-mini-item-${
                                                                            index
                                                                        }-icon`
                                                                    }
                                                                    data-testid={
                                                                        `${ testId }-sidebar-mini-item-${ index }-icon`
                                                                    }
                                                                    { ...pane.icon }
                                                                />
                                                            </div>
                                                        ) }
                                                        content={ pane.menuItem }
                                                        size="mini"
                                                    />
                                                    { showLabelsOnSidebarMini && pane.menuItem }
                                                </Menu.Item>
                                            ))
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            visible && (
                                <>
                                    {
                                        actions && actions instanceof Array && actions.length > 0 && (
                                            <HelpPanel.ActionBar
                                                data-componentid={ `${ componentId }-action-bar` }
                                                data-testid={ `${ testId }-action-bar` }
                                            >
                                                {
                                                    actions.map((action, index) => (
                                                        <Tooltip
                                                            compact
                                                            key={ index }
                                                            // TODO: Enable after fixing the flickering issue.
                                                            disabled={ true }
                                                            trigger={ (
                                                                <div>
                                                                    <GenericIcon
                                                                        link
                                                                        inline
                                                                        hoverable
                                                                        transparent
                                                                        defaultIcon
                                                                        size="default"
                                                                        data-componentid={
                                                                            `${ componentId }-action-bar-action-${
                                                                                index
                                                                            }`
                                                                        }
                                                                        data-testid={
                                                                            `${ testId }-action-bar-action-${ index }`
                                                                        }
                                                                        { ...action }
                                                                    />
                                                                </div>
                                                            ) }
                                                            content={ action.tooltip }
                                                            size="mini"
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
                                        data-componentid={ `${ componentId }-tabs` }
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
    bordered: "left",
    "data-componentid": "help-panel",
    "data-testid": "help-panel",
    direction: "right",
    raised: false,
    showLabelsOnSidebarMini: false,
    showTooltipsOnActionBar: true,
    showTooltipsOnSidebarMini: true,
    sidebarMiniEnabled: true,
    sidebarToggleTooltip: "Open help panel",
    visible: true
};

HelpPanel.ActionBar = HelpPanelActionBar;
