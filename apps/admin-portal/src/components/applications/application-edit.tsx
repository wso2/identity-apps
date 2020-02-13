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
import React, { FunctionComponent } from "react";
import { ApplicationInterface } from "../../models";
import { GeneralDetailsApplication } from "./general-details-application";
import { ApplicationSettings } from "./settings-application";

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
): JSX.Element => {

    const {
        application,
        isLoading
    } = props;

    const panes = () => ([
        {
            menuItem: "General",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <GeneralDetailsApplication
                        accessUrl={ application.accessUrl }
                        appId={ application.id }
                        description={ application.description }
                        discoverability={ application.advancedConfigurations?.discoverableByEndUsers }
                        imageUrl={ application.imageUrl }
                        name={ application.name }
                        isLoading={ isLoading }
                    />
                </ResourceTab.Pane>
            ),
        },
        {
            menuItem: "Settings",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <ApplicationSettings
                        appId={ application.id }
                        advancedConfigurations={ application.advancedConfigurations }
                        inboundProtocols={ application.inboundProtocols }
                        isLoading={ isLoading }
                    />
                </ResourceTab.Pane>
            ),
        },
        {
            menuItem: "Sign-on Methods",
            render: () => <ResourceTab.Pane attached={ false }>SignOnMethod</ResourceTab.Pane>,
        },
    ]);

    return (
        <>
            {
                application && (
                    <ResourceTab
                        panes={ panes() }
                    />
                )
            }
        </>
    );
};
