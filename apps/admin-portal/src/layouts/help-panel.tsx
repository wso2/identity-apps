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

import { AlertLevels, StorageIdentityAppsSettingsInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { HelpPanel, HelpPanelPropsInterface, HelpPanelTabInterface } from "@wso2is/react-components";
import classNames from "classnames";
import _ from "lodash";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Sidebar } from "semantic-ui-react";
import { HelpSidebarIcons } from "../configs";
import { AppState } from "../store";

/**
 * Sidebar pusher layout Prop types.
 */
interface SidebarPusherLayoutPropsInterface {
    /**
     * Completely disables the sidebar.
     */
    enabled?: boolean;
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
 * Sidebar pusher layout.
 *
 * @param {React.PropsWithChildren<PageLayoutPropsInterface>} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const HelpPanelLayout: FunctionComponent<PropsWithChildren<SidebarPusherLayoutPropsInterface>> = (
    props: PropsWithChildren<SidebarPusherLayoutPropsInterface>
): ReactElement => {

    const sidebarRef = useRef<HTMLDivElement>();
    const contentRef = useRef<HTMLDivElement>();

    const {
        children,
        enabled,
        sidebarDirection,
        tabs,
        ...rest
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const tenantName: string = useSelector((state: AppState) => state.config.deployment.tenant);
    const username: string = useSelector((state: AppState) => state.authenticationInformation.username);

    const [ helpSidebarVisibility, setHelpSidebarVisibility ] = useState<boolean>(false);
    const [ helpPanelTabsActiveIndex, setHelpPanelTabsActiveIndex ] = useState<number>(0);
    const [ userPreferences, setUserPreferences ] = useState<StorageIdentityAppsSettingsInterface>(undefined);

    const layoutClasses = classNames("layout", "help-panel-layout");
    const layoutContentClasses = classNames("layout-content");

    useEffect(() => {
        if (!sidebarRef?.current?.clientWidth) {
            return;
        }

        contentRef.current.style.width = "calc(100% - " + sidebarRef?.current?.clientWidth + "px)";
    }, [ helpSidebarVisibility ]);

    /**
     * Checks the browser persisted settings and sets the side panel visibility based on user pref.
     */
    useEffect(() => {
        if (!tenantName || !username) {
            return;
        }

        const preferences = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenantName));
        const userPreferences: StorageIdentityAppsSettingsInterface = preferences[ username ];

        if (_.isEmpty(userPreferences)
            || !userPreferences.identityAppsSettings?.devPortal?.helpPanel
            || userPreferences.identityAppsSettings.devPortal.helpPanel.isPinned === undefined) {

            return;
        }

        setUserPreferences(userPreferences);

        setHelpSidebarVisibility(userPreferences.identityAppsSettings.devPortal.helpPanel.isPinned);
    }, [ tenantName, username ]);

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

    /**
     * Handles the help panel pin action.
     */
    const handleHelpPanelPin = () => {
        const isPinned = userPreferences?.identityAppsSettings?.devPortal?.helpPanel?.isPinned;

        if (isPinned === undefined) {
            return;
        }

        const newPref = _.cloneDeep(userPreferences);
        newPref.identityAppsSettings.devPortal.helpPanel.isPinned = !isPinned;

        setUserPreferences(newPref);

        LocalStorageUtils.setValueInLocalStorage(tenantName, JSON.stringify({
            [ username ]: newPref
        }));


        dispatch(addAlert({
            description: t("devPortal:components.helpPanel.notifications.pin.success.description",
                { state: isPinned ? t("common:unpinned") : t("common:pinned") }),
            level: AlertLevels.INFO,
            message: t("devPortal:components.helpPanel.notifications.pin.success.message",
                { state: isPinned ? t("common:unpinned") : t("common:pinned") })
        }));
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
                                icon: HelpSidebarIcons.actionPanel.pin,
                                onClick: handleHelpPanelPin
                            },
                            {
                                icon: HelpSidebarIcons.actionPanel.close,
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
