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
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import ConsoleAdministrators from "./console-administrators/console-administrators";
import ConsoleLoginFlow from "./console-login-flow/console-login-flow";
import ConsoleProtocol from "./console-protocol/console-protocol";
import ConsoleRolesList from "./console-roles/console-roles-list";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import "./console-settings-tabs.scss";

/**
 * Props interface of {@link ConsoleSettingsTabs}
 */
type ConsoleSettingsTabsInterface = IdentifiableComponentInterface;

/**
 * Enum for Console Settings modes.
 */
enum ConsoleSettingsModes {
    /**
     * Administrators tab mode.
     */
    ADMINISTRATORS = "ADMINISTRATORS",
    /**
     * Roles tab mode.
     */
    ROLES = "ROLES",
    /**
     * Protocol tab mode.
     */
    PROTOCOL = "PROTOCOL",
    /**
     * Security tab mode.
     */
    SECURITY = "SECURITY"
}

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
    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const consoleTabs: ConsoleSettingsTabInterface[] = useMemo(() => [
        {
            className: "administrators-list",
            "data-componentid": `${componentId}-tab-administrators`,
            id: ConsoleSettingsModes.ADMINISTRATORS,
            label: t("console:consoleSettings.administrators.tabLabel"),
            pane: <ConsoleAdministrators />,
            value: 0
        },
        {
            className: "console-roles-list",
            "data-componentid": `${componentId}-tab-roles`,
            id: ConsoleSettingsModes.ROLES,
            label: t("console:consoleSettings.roles.tabLabel"),
            pane: <ConsoleRolesList />,
            value: 1
        },
        !isSubOrganization() && {
            className: "console-protocol",
            "data-componentid": `${componentId}-tab-protocol`,
            id: ConsoleSettingsModes.PROTOCOL,
            label: t("console:consoleSettings.protocol.tabLabel"),
            pane: <ConsoleProtocol />,
            value: 3
        },
        !isSubOrganization() && {
            className: "console-security",
            "data-componentid": `${componentId}-tab-login-flow`,
            id: ConsoleSettingsModes.SECURITY,
            label: t("console:consoleSettings.loginFlow.tabLabel"),
            pane: <ConsoleLoginFlow />,
            value: 4
        }
    ], []);

    const [ activeTab, setActiveTab ] = useState<number>(consoleTabs[0].value);

    return (
        <div className="console-settings-tabs">
            <Tabs
                value={ activeTab }
                onChange={ (_: SyntheticEvent, newValue: number) => {
                    setActiveTab(newValue);
                } }
            >
                { consoleTabs.map((tab: ConsoleSettingsTabInterface) => (
                    <Tab key={ tab.value } label={ tab.label } />
                )) }
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
