/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import CLIUserAssignment from "./cli-user-assignment";
import { CLISettingsTabIds } from "../constants/cli-settings-constants";

/**
 * Props interface of {@link CLISettingsTabs}
 */
interface CLISettingsTabsPropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the CLI application.
     */
    cliApplicationId: string;
    /**
     * Read only flag
     */
    readonly: boolean;
}

/**
 * Interface for a CLI settings tab.
 */
interface CLISettingsTabInterface extends IdentifiableComponentInterface {
    id: CLISettingsTabIds;
    label: string;
    pane: ReactElement;
}

/**
 * Tab component for the CLI Settings page.
 *
 * @param props - Props injected to the component.
 * @returns CLI Settings tab component.
 */
const CLISettingsTabs: FunctionComponent<CLISettingsTabsPropsInterface> = (
    props: CLISettingsTabsPropsInterface
): ReactElement => {
    const { cliApplicationId, readonly, [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();

    const cliTabs: CLISettingsTabInterface[] = useMemo(
        () => [
            {
                "data-componentid": `${ componentId }-tab-users`,
                id: CLISettingsTabIds.USERS,
                label: t("cliSettings:tabs.users"),
                pane: (
                    <CLIUserAssignment
                        cliApplicationId={ cliApplicationId }
                        readonly={ readonly }
                        data-componentid={ `${ componentId }-user-assignment` }
                    />
                )
            }
        ],
        [ componentId, cliApplicationId, t ]
    );

    const getActiveTabFromUrl = (): number => {
        const activeTabIndex: number = cliTabs.findIndex(
            (tab: CLISettingsTabInterface) => location.hash === `#tab=${ tab.id }`
        );

        return activeTabIndex === -1 ? 0 : activeTabIndex;
    };

    const [ activeTab, setActiveTab ] = useState<number>(getActiveTabFromUrl());

    useEffect(() => {
        const handleHashChange = (): void => {
            setActiveTab(getActiveTabFromUrl());
        };

        window.addEventListener("hashchange", handleHashChange);

        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    const onTabChange = (_: SyntheticEvent, newTabIndex: number): void => {
        location.hash = `#tab=${ cliTabs[newTabIndex].id }`;
    };

    return (
        <div data-componentid={ componentId }>
            <Tabs value={ activeTab } onChange={ onTabChange }>
                { cliTabs.map((tab: CLISettingsTabInterface) => (
                    <Tab key={ tab.id } label={ tab.label } />
                )) }
            </Tabs>
            { cliTabs.map((tab: CLISettingsTabInterface, index: number) => (
                <TabPanel
                    key={ tab.id }
                    value={ activeTab }
                    index={ index }
                    data-componentid={ tab[ "data-componentid" ] }
                >
                    { tab.pane }
                </TabPanel>
            )) }
        </div>
    );
};

CLISettingsTabs.defaultProps = {
    "data-componentid": "cli-settings-tabs"
};

export default CLISettingsTabs;
