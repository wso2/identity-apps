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

import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Tabs from "@oxygen-ui/react/Tabs";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ConsoleAdministrators from "./console-administrators/console-administrators";
import ConsoleLoginFlow from "./console-login-flow/console-login-flow";
import ConsoleProtocol from "./console-protocol/console-protocol";
import ConsoleRolesList from "./console-roles/console-roles-list";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { ConsoleSettingsModes, ConsoleSettingsTabIDs } from "../models/ui";
import "./console-settings-tabs.scss";

/**
 * Props interface of {@link ConsoleSettingsTabs}
 */
type ConsoleSettingsTabsInterface = IdentifiableComponentInterface;

/**
 * Interface for tabs.
 */
interface ConsoleSettingsTabInterface extends IdentifiableComponentInterface {
    /**
     * Tab id.
     */
    id: ConsoleSettingsModes;
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
 * Tab component for the Console Settings page.
 *
 * @param props - Props injected to the component.
 * @returns Console Settings tab component.
 */
const ConsoleSettingsTabs: FunctionComponent<ConsoleSettingsTabsInterface> = (
    props: ConsoleSettingsTabsInterface
): ReactElement => {
    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const consoleTabs: ConsoleSettingsTabInterface[] = useMemo(
        () =>
            [
                {
                    className: "administrators-list",
                    "data-componentid": `${componentId}-tab-administrators`,
                    "data-tabid": ConsoleSettingsModes.ADMINISTRATORS,
                    id: ConsoleSettingsModes.ADMINISTRATORS,
                    label: t("console:consoleSettings.administrators.tabLabel"),
                    pane: <ConsoleAdministrators />,
                    value: ConsoleSettingsTabIDs.ADMINISTRATORS
                },
                {
                    className: "console-roles-list",
                    "data-componentid": `${componentId}-tab-roles`,
                    "data-tabid": ConsoleSettingsModes.ROLES,
                    id: ConsoleSettingsModes.ROLES,
                    label: t("console:consoleSettings.roles.tabLabel"),
                    pane: <ConsoleRolesList />,
                    value: ConsoleSettingsTabIDs.ROLES
                },
                !isSubOrganization() && {
                    className: "console-protocol",
                    "data-componentid": `${componentId}-tab-protocol`,
                    "data-tabid": ConsoleSettingsModes.PROTOCOL,
                    hidden: true,
                    id: ConsoleSettingsModes.PROTOCOL,
                    label: t("console:consoleSettings.protocol.tabLabel"),
                    pane: <ConsoleProtocol />,
                    value: ConsoleSettingsTabIDs.PROTOCOL
                },
                !isSubOrganization() && {
                    className: "console-security",
                    "data-componentid": `${componentId}-tab-login-flow`,
                    "data-tabid": ConsoleSettingsModes.LOGIN_FLOW,
                    id: ConsoleSettingsModes.LOGIN_FLOW,
                    label: t("console:consoleSettings.loginFlow.tabLabel"),
                    pane: <ConsoleLoginFlow />,
                    value: ConsoleSettingsTabIDs.LOGIN_FLOW
                }
            ]
                .filter((tab: ConsoleSettingsTabInterface) => !tab || !tab.hidden)
                .map((tab: ConsoleSettingsTabInterface, index: number) => ({ ...tab, value: index })),
        []
    );

    /**
     * Get the active tab index from the tab id defined in the URL params.
     * @returns Active tab.
     */
    const getActiveTabFromUrl = (): number => {
        const activeTabFromUrl: ConsoleSettingsTabInterface = consoleTabs.find((tab: ConsoleSettingsTabInterface) => {
            return location.hash === `#tab=${tab.value}`;
        });

        return activeTabFromUrl ? activeTabFromUrl.value : consoleTabs[0].value;
    };

    const [ activeTab, setActiveTab ] = useState<number>(getActiveTabFromUrl);

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

    return (
        <div className="console-settings-tabs">
            <Tabs
                value={ activeTab }
                onChange={ (_: SyntheticEvent, newValue: number) => {
                    location.hash = `#tab=${newValue}`;
                    setActiveTab(newValue);
                } }
            >
                { consoleTabs.map((tab: ConsoleSettingsTabInterface) => {
                    if (tab.hidden) {
                        return null;
                    }

                    return <Tab key={ tab.value } label={ tab.label } />;
                }) }
            </Tabs>
            { consoleTabs.map((tab: ConsoleSettingsTabInterface, index: number) => (
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

/**
 * Default props for the component.
 */
ConsoleSettingsTabs.defaultProps = {
    "data-componentid": "console-settings-tab"
};

export default ConsoleSettingsTabs;
