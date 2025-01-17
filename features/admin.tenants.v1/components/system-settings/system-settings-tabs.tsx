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

import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Tabs from "@oxygen-ui/react/Tabs";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminSessionAdvisoryBanner from "./admin-session-advisory-banner";
import RemoteLogPublishing from "./remote-log-publishing";
import { SystemSettingsModes, SystemSettingsTabIDs } from "../../models/system-settings/ui";

/**
 * Props interface of {@link SystemSettingsTabs}
 */
export type SystemSettingsTabsInterface = IdentifiableComponentInterface;

/**
 * System settings tab interface.
 */
export interface SystemSettingsTabInterface extends IdentifiableComponentInterface {
    /**
     * Tab id.
     */
    id: string;
    /**
     * Tab class name.
     */
    className: string;
    /**
     * Tab label.
     */
    label: string;
    /**
     * Tab value.
     */
    value: number;
    /**
     * Tab pane.
     */
    pane: ReactElement;
    /**
     * Is tab hidden.
     */
    hidden?: boolean;
}

/**
 * Tab component for the System Settings applicable to all the root organizations.
 *
 * @param props - Props injected to the component.
 * @returns System Settings tab component.
 */
const SystemSettingsTabs: FunctionComponent<SystemSettingsTabsInterface> = ({
    ["data-componentid"]: componentId = "system-settings-tab"
}: SystemSettingsTabsInterface): ReactElement => {
    const { t } = useTranslation();

    const tabs: SystemSettingsTabInterface[] = useMemo(
        () =>
            [
                {
                    className: "remote-log-publishing",
                    "data-componentid": `${componentId}-remote-log-publishing`,
                    "data-tabid": SystemSettingsModes.REMOTE_LOG_PUBLISHING,
                    id: SystemSettingsModes.REMOTE_LOG_PUBLISHING,
                    label: t("serverConfigs:remoteLogPublishing.title"),
                    pane: <RemoteLogPublishing />,
                    value: SystemSettingsTabIDs.REMOTE_LOG_PUBLISHING
                },
                {
                    className: "admin-advisory-banner",
                    "data-componentid": `${componentId}-"admin-advisory-banner`,
                    "data-tabid": SystemSettingsModes.ADMIN_ADVISORY_BANNER,
                    id: SystemSettingsModes.ADMIN_ADVISORY_BANNER,
                    label: t("serverConfigs:adminAdvisory.title"),
                    pane: <AdminSessionAdvisoryBanner />,
                    value: SystemSettingsTabIDs.ADMIN_ADVISORY_BANNER
                }
            ]
                .filter((tab: SystemSettingsTabInterface) => tab && !tab?.hidden)
                .map((tab: SystemSettingsTabInterface, index: number) => ({ ...tab, value: index })),
        []
    );

    /**
     * Get the active tab index from the tab id defined in the URL params.
     * @returns Active tab.
     */
    const getActiveTabFromUrl = (): number => {
        const activeTabFromUrl: SystemSettingsTabInterface | undefined = tabs.find(
            (tab: SystemSettingsTabInterface) => {
                return location.hash === `#tab=${tab.id}`;
            }
        );

        return activeTabFromUrl ? activeTabFromUrl.value : tabs[0].value;
    };

    const [ activeTab, setActiveTab ] = useState<number>(getActiveTabFromUrl());

    /**
     * Register a hash change listener to update the active tab.
     */
    useEffect(() => {
        const handleHashChange = (): void => {
            setActiveTab(getActiveTabFromUrl());
        };

        // Listen for changes in the URL hash
        window.addEventListener("hashchange", handleHashChange);

        return () => {
            // Clean up the event listener when the component unmounts
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    /**
     * Callback to handle tab change.
     *
     * @param _ - Tab change event.
     * @param newTabIndex - New tab index.
     */
    const onTabChange = (_: SyntheticEvent, newTabIndex: number): void => {
        location.hash = `#tab=${tabs[newTabIndex].id}`;
    };

    return (
        <div className="system-settings-tabs">
            <Tabs value={ activeTab } onChange={ onTabChange }>
                { tabs.map((tab: SystemSettingsTabInterface) => {
                    if (tab.hidden) {
                        return null;
                    }

                    return <Tab key={ tab.value } label={ tab.label } />;
                }) }
            </Tabs>
            { tabs.map((tab: SystemSettingsTabInterface, index: number) => (
                <TabPanel
                    key={ tab.value }
                    value={ activeTab }
                    index={ index }
                    className={ tab.className }
                    data-componentid={ tab["data-componentid"] }
                >
                    { tab.pane }
                </TabPanel>
            )) }
        </div>
    );
};

export default SystemSettingsTabs;
