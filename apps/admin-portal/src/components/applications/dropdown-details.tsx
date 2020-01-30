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
import { Grid, Tab } from "semantic-ui-react";
import { GeneralDetails } from "./dropdown-details-general";

/**
 *  Shows the brief details of the application
 */
interface AppDetailsProps {
    appName?: string;
    appDescription?: string;
}

export const AppDetails: FunctionComponent<AppDetailsProps> = (props): JSX.Element => {

    /**
     * Create the tab menu
     */
    const panes = () => {

        return [
            {
                menuItem: "General",
                render: () =>
                    (
                        <Tab.Pane attached={ false }>
                            <GeneralDetails
                                name={ props.appName }
                                description={ props.appDescription }
                            />
                        </Tab.Pane>
                    ),
            },
            {
                menuItem: "Settings",

                render: () => <Tab.Pane attached={ false }>settings</Tab.Pane>,
            },
            {
                menuItem: "Attributes",
                render: () => <Tab.Pane attached={ false }>mapping</Tab.Pane>,
            },
            {
                menuItem: "Connections",
                render: () => <Tab.Pane attached={ false }>connections</Tab.Pane>,
            },
        ];
    };

    return (
        <div>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <Tab menu={ { secondary: true, pointing: true } } panes={ panes() }/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};
