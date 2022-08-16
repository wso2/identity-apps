/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { ReactElement, ReactNode } from "react";
import { Divider, Grid, Header } from "semantic-ui-react";
import { ServerConfigurationConfig } from "./models/server-configuration";
import { GovernanceConnectorInterface } from "../../features/server-configurations";

export const serverConfigurationConfig: ServerConfigurationConfig = {
    autoEnableConnectorToggleProperty: false,
    connectorPropertiesToShow: [
        "all"
    ],
    connectorToggleName: {},
    connectorsToShow: [
        "all"
    ],
    intendSettings: true,
    renderConnector: (
        connector: GovernanceConnectorInterface,
        connectorForm: ReactElement,
        connectorIllustration: string,
        connectorTitle: ReactNode,
        connectorSubHeading: ReactNode,
        message: ReactNode
    ): ReactElement => {
        return(
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column>
                        <Grid padded>
                            <Grid.Row>
                                <Grid.Column width={ 16 }>
                                    <div
                                        className="connector-section-with-image-bg"
                                        style={ {
                                            background: `url(${ connectorIllustration })`
                                        } }
                                    >
                                        <Header>
                                            { connectorTitle }
                                            <Header.Subheader>
                                                { connectorSubHeading }
                                            </Header.Subheader>
                                        </Header>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        { message }
                        <Divider />
                        { connectorForm }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    },
    renderConnectorWithinEmphasizedSegment: true,
    showConnectorsOnTheSidePanel: true,
    showGovernanceConnectorCategories: true,
    showPageHeading: true
};
