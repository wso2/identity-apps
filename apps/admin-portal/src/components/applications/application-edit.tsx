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

import React, { FunctionComponent } from "react";
import { Tab } from "semantic-ui-react";
import { ApplicationInterface } from "../../models";
import { GeneralDetailsApplication } from "./general-details-application";
import { ApplicationSettings } from "./settings-application";

interface EditApplicationPropsInterface {
    application: ApplicationInterface;
}

/**
 * Application edit component.
 *
 * @return {JSX.Element}
 */
export const EditApplication: FunctionComponent<EditApplicationPropsInterface> = (
    props: EditApplicationPropsInterface
): JSX.Element => {

    const {
        application
    } = props;

    const panes = () => ([
        {
            menuItem: "General",
            render: () => (
                <Tab.Pane attached={ false }>
                    <GeneralDetailsApplication
                        appId={ application.id }
                        name={ application.name }
                        description={ application.description }
                        imageUrl={ application.imageUrl }
                        accessUrl={ application.accessUrl }
                    />
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Settings",
            render: () => (
                <Tab.Pane attached={ false }>
                    <ApplicationSettings
                        appId={ application.id }
                        advancedConfigurations={ application.advancedConfigurations }
                    />
                </Tab.Pane>
            ),
        },
        {
            menuItem: "SignOnMethods",
            render: () => <Tab.Pane attached={ false }>SignOnMethod</Tab.Pane>,
        },
    ]);

    return (
        <>
            {
                application && (
                    <Tab
                        className="tabs resource-tabs"
                        menu={ { secondary: true, pointing: true } }
                        panes={ panes() }
                    />
                )
            }
        </>
    );
};
