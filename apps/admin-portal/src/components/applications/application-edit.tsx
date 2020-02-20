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

import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { ApplicationInterface } from "../../models";
import { AdvanceSettings } from "./advance-application";
import { GeneralApplicationSettings } from "./general-application-settings";
import { ApplicationSettings } from "./settings-application";
import { SignOnMethods } from "./sign-on-methods";

/**
 * Proptypes for the applications edit component.
 */
interface EditApplicationPropsInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
}

/**
 * Application edit component.
 *
 * @param {EditApplicationPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const EditApplication: FunctionComponent<EditApplicationPropsInterface> = (
    props: EditApplicationPropsInterface
): ReactElement => {

    const {
        application,
        isLoading
    } = props;

    const GeneralApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <GeneralApplicationSettings
                accessUrl={ application.accessUrl }
                appId={ application.id }
                description={ application.description }
                discoverability={ application.advancedConfigurations?.discoverableByEndUsers }
                imageUrl={ application.imageUrl }
                name={ application.name }
                isLoading={ isLoading }
            />
        </ResourceTab.Pane>
    );

    const ApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <ApplicationSettings
                appId={ application.id }
                inboundProtocols={ application.inboundProtocols }
                isLoading={ isLoading }
            />
        </ResourceTab.Pane>
    );

    const SignOnMethodsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <SignOnMethods
                appId={ application.id }
                authenticationSequence={ application.authenticationSequence }
            />
        </ResourceTab.Pane>
    );

    const AdvancedSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AdvanceSettings
                appId={ application.id }
                advancedConfigurations={ application.advancedConfigurations }
            />
        </ResourceTab.Pane>
    );

    return (
        application && (
            <ResourceTab
                panes={ [
                    {
                        menuItem: "General",
                        render: GeneralApplicationSettingsTabPane
                    },
                    {
                        menuItem: "Access",
                        render: ApplicationSettingsTabPane
                    },
                    {
                        menuItem: "Sign-on Method",
                        render: SignOnMethodsTabPane,
                    },
                    {
                        menuItem: "Advance",
                        render: AdvancedSettingsTabPane,
                    },
                ] }
            />
        )
    );
};
