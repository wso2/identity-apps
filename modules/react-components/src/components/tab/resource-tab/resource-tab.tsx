/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import {
    IdentifiableComponentInterface,
    LoadingStateOptionsInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import inRange from "lodash-es/inRange";
import React, {
    FunctionComponent,
    MouseEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { Card, MenuProps, Placeholder, SemanticShorthandItem, Tab, TabPaneProps, TabProps } from "semantic-ui-react";
import { ResourceTabPane } from "./resource-tab-pane";

/**
 * Interface for the resource tab sub components.
 */
export interface ResourceTabSubComponentsInterface {
    Pane: typeof ResourceTabPane;
}

/**
 * Interface for the resource tab pane components.
 */
export interface ResourceTabPaneInterface {
    pane?: SemanticShorthandItem<TabPaneProps>;
    menuItem?: any;
    render?: () => React.ReactNode;
    "data-tabid"?: string;
    componentId?: string;
    index?: number;
}

/**
 * Resource tabs component Prop types.
 */
export interface ResourceTabPropsInterface extends Omit<TabProps, "onTabChange">, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Custom class for the component.
     */
    className?: string;
    /**
     * Callback to set the panes list length.
     */
    onInitialize?: ({ panesLength }: { panesLength: number }) => void;
    /**
     * Is the tab menu and content attached?
     */
    attached?: MenuProps[ "attached" ];
    /**
     * Optional meta for the loading state.
     */
    loadingStateOptions?: LoadingStateOptionsInterface;
    /**
     * Is the tab menu has pointed items.
     */
    pointing?: MenuProps[ "pointing" ];
    /**
     * Is the tab menu in secondary variation.
     */
    secondary?: MenuProps[ "secondary" ];
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Specifies if it is needed to redirect to a specific tabindex
     */
    isAutomaticTabRedirectionEnabled?: boolean;
    /**
     * Specifies, to which tab(tabid) it need to redirect.
     */
    tabIdentifier?: string;
    /**
     * Should the component handle tab redirection based on the hash.
     */
    controlTabRedirectionInternally?: boolean;
    /**
     * The default tab to be active when there is no hash or an invalid hash.
     * This will only work when `controlTabRedirectionInternally` is enabled.
     * Otherwise, utilize `defaultActiveIndex`.
     */
    defaultActiveTab?: number | string;
    /**
     * Called on tab change.
     *
     * @param event - React's original SyntheticEvent.
     * @param data - The proposed new Tab.Pane.
     */
    onTabChange?: (event: React.MouseEvent<HTMLDivElement>, data: TabProps, activeTabMetadata?: {
        "data-tabid": string;
        index: number | string;
    }) => void
}

/**
 * Constant representing a URL hash fragment for the current tab.
 */
export const TAB_URL_HASH_FRAGMENT: string = "tab=";

/**
 * Resource tab component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Resource tab component
 */
export const ResourceTab: FunctionComponent<ResourceTabPropsInterface> & ResourceTabSubComponentsInterface = (
    props: ResourceTabPropsInterface
): ReactElement => {

    const {
        isLoading,
        attached,
        className,
        onInitialize,
        panes,
        defaultActiveIndex,
        loadingStateOptions,
        pointing,
        secondary,
        onTabChange,
        isAutomaticTabRedirectionEnabled,
        tabIdentifier,
        controlTabRedirectionInternally,
        defaultActiveTab,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes: string = classNames(
        "tabs resource-tabs",
        {
            "attached": attached
        }
        , className
    );

    const [ activeIndex, setActiveIndex ] = useState<number | string>(defaultActiveIndex);
    const [ isTabChanged, setIsTabChanged ] = useState<boolean>(false);

    /**
     * Called to set the pane index as the active tab index if it is needed to redirect to a specific tab
     */
    useEffect(() => {
        if (controlTabRedirectionInternally) {
            return;
        }

        if (isTabChanged) {
            return;
        }
        if (!isAutomaticTabRedirectionEnabled) {
            setActiveIndex(defaultActiveIndex);

            return;
        }

        const tabIndex: number | string = panes.indexOf(panes.find(element => element["data-tabid"] === tabIdentifier));

        if (inRange(tabIndex as number,  0, panes.length)) {
            if (tabIndex === activeIndex) {
                return;
            }
            setActiveIndex(tabIndex);
        } else {
            setActiveIndex(defaultActiveIndex);
        }
    }, [ defaultActiveIndex ]);

    /**
     * Update the active tab index based on the hash.
     */
    useEffect(() => {
        if (!controlTabRedirectionInternally) {
            return;
        }

        const hashComponents: string[] = window.location.hash.split(TAB_URL_HASH_FRAGMENT);
        let tabId: string;
        let tabIndex: number;

        // Verify if the hash contains the redirecting tab's ID or index.
        if (hashComponents.length == 2) {
            const hashTabValue: string = hashComponents[1];

            const hashTabIndex: number = parseInt(hashTabValue);

            if (isNaN(hashTabIndex)) {
                tabId = hashTabValue;
            } else {
                tabIndex = hashTabIndex;
            }
        }

        if (tabId) {
            tabIndex = panes?.findIndex((pane: ResourceTabPaneInterface) => pane["data-tabid"] === tabId);
        }

        if (tabIndex >= 0 && tabIndex < panes?.length) {
            if (tabIndex === activeIndex) {
                return;
            }
            setActiveIndex(tabIndex);
        } else {
            if (typeof defaultActiveTab === "string") {
                tabIndex = panes?.findIndex(
                    (pane: ResourceTabPaneInterface) => pane["data-tabid"] === defaultActiveTab);
            } else if (typeof defaultActiveTab === "number") {
                tabIndex = defaultActiveTab;
            }

            if (tabIndex >= 0 && tabIndex < panes?.length) {
                setActiveIndex(tabIndex);
            } else {
                setActiveIndex(0);
            }
        }
    }, [ window.location.hash, defaultActiveTab, panes ]);

    /**
     * Called to set the panes list length initially.
     */
    useEffect(()=> {

        if(onInitialize && typeof onInitialize === "function") {
            onInitialize({ panesLength: panes.length });
        }
    }, []);

    /**
     * Handles the tab change.
     */
    const handleTabChange = (e: SyntheticEvent, activeIndex: string | number, activeTabId: string) => {
        if (!controlTabRedirectionInternally) {
            setIsTabChanged(true);
            setActiveIndex(activeIndex);
        } else {
            window.location.hash = `${TAB_URL_HASH_FRAGMENT}${activeTabId}`;
        }
    };

    //TODO - Add style classes to placeholders.
    if (isLoading) {
        return (
            <>
                <Card.Group style={ { marginBottom: "3rem" } }>
                    {
                        [ ...Array(loadingStateOptions?.count ?? 0) ].map(() => {
                            return (
                                <>
                                    <Card style={ { boxShadow: "none", width: "10%" } }>
                                        <Placeholder>
                                            <Placeholder.Image style={ { height: "30px" } } />
                                        </Placeholder>
                                    </Card>
                                </>
                            );
                        })
                    }
                </Card.Group>
                <Placeholder>
                    {
                        [ ...Array(3) ].map(() => {
                            return (
                                <>
                                    <Placeholder.Line length="very short" />
                                    <Placeholder.Image style={ { height: "38px" } } />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </>
                            );
                        })
                    }
                </Placeholder>
            </>
        );
    }

    return (
        <Tab
            onTabChange={ (e: MouseEvent<HTMLDivElement>, data: TabProps) => {
                const activeTab: {
                    pane?: SemanticShorthandItem<TabPaneProps>
                    menuItem?: any
                    render?: () => ReactNode
                  } = panes[data.activeIndex];

                handleTabChange(e, data.activeIndex, activeTab["data-tabid"]);
                onTabChange && typeof onTabChange === "function" && onTabChange(e, data, {
                    "data-tabid": activeTab["data-tabid"],
                    index: data.activeIndex
                });
            } }
            className={ classes }
            menu={ {
                attached,
                pointing,
                secondary
            } }
            panes={ panes }
            activeIndex={ activeIndex }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        />
    );
};

/**
 * Default props for the resource tab component.
 */
ResourceTab.defaultProps = {
    attached: false,
    controlTabRedirectionInternally: false,
    "data-componentid": "resource-tabs",
    "data-testid": "resource-tabs",
    defaultActiveTab: 0,
    isAutomaticTabRedirectionEnabled: false,
    isLoading: false,
    pointing: true,
    secondary: true,
    tabIdentifierURLFrag: ""
};

ResourceTab.Pane = ResourceTabPane;
