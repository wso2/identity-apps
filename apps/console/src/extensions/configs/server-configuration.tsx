/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React, { ReactElement, ReactNode } from "react";
import { Divider, Grid, Header } from "semantic-ui-react";
import { PasswordHistoryCountInterface, ServerConfigurationConfig } from "./models/server-configuration";
import { updatePasswordHistoryCount, useGetPasswordHistoryCount } from "../../features/password-history-count/api/password-history-count";
import { ConnectorPropertyInterface, GovernanceConnectorInterface, ServerConfigurationsConstants, updateGovernanceConnector, UpdateGovernanceConnectorConfigInterface } from "../../features/server-configurations";
import { ValidationFormInterface } from "../../features/validation/models";
import { PasswordHistoryCount } from "../../features/password-history-count/components/password-history-count";

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
    showPageHeading: true,
    usePasswordHistory: useGetPasswordHistoryCount,
    processInitialValues: (
        initialValues: ValidationFormInterface,
        passwordHistoryCount: GovernanceConnectorInterface
    ): PasswordHistoryCountInterface => {
        return {
            ...initialValues,
            passwordHistoryCount: parseInt(passwordHistoryCount.properties.map((property: ConnectorPropertyInterface) => {
                if(property.name === "passwordHistory.count") {
                    return property.value;
                }
            })[0]),
            passwordHistoryCountEnabled: passwordHistoryCount.properties.map((property: ConnectorPropertyInterface) => {
                if(property.name === "passwordHistory.enable") {
                    return property.value;
                }
            })[0] === "true"
        }
    },
    processPasswordCountSubmitData: (data: PasswordHistoryCountInterface) => {
        const passwordHistoryCount: number = data.passwordHistoryCount;
        const passwordHistoryCountEnabled: boolean = data.passwordHistoryCountEnabled;

        delete data.passwordHistoryCount;
        delete data.passwordHistoryCountEnabled;

        const passwordHistoryCountData: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: [ {
                name: "passwordHistory.count",
                value: passwordHistoryCount.toString()
            },
                {
                    name: "passwordHistory.enable",
                    value: passwordHistoryCountEnabled.toString()
            }]
        }

        return updatePasswordHistoryCount(passwordHistoryCountData)
    },
    passwordHistoryCountComponent: <PasswordHistoryCount/>
};
