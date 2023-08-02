/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { TFunction } from "react-i18next";
import { Divider, Grid, Header } from "semantic-ui-react";
import {
    PasswordExpiryInterface,
    PasswordHistoryCountInterface,
    ServerConfigurationConfig
} from "./models/server-configuration";
import { ConnectorPropertyInterface, GovernanceConnectorInterface } from "../../features/server-configurations";
import { ValidationFormInterface } from "../../features/validation/models";
import {
    useGetPasswordExpiryProperties
} from "../components/password-expiry/api/password-expiry";
import {
    useGetPasswordHistoryCount
} from "../components/password-history-count/api";

export const serverConfigurationConfig: ServerConfigurationConfig = {
    autoEnableConnectorToggleProperty: false,
    connectorPropertiesToShow: [ "all" ],
    connectorToggleName: {},
    connectorsToShow: [ "all" ],
    intendSettings: true,
    passwordExpiryComponent: (
        _componentId: string,
        _passwordExpiryEnabled: boolean,
        _setPasswordExpiryEnabled: (state: boolean) => void,
        _t: TFunction<"translation", undefined>
    ): ReactElement => {
        return null;
    },
    passwordHistoryCountComponent: (
        _componentId: string,
        _passwordHistoryEnabled: boolean,
        _setPasswordHistoryEnabled: (state: boolean) => void,
        _t: TFunction<"translation", undefined>
    ): ReactElement => {
        return null;
    },
    processInitialValues: (
        initialValues: ValidationFormInterface,
        passwordHistoryCount: GovernanceConnectorInterface,
        setPasswordHistoryEnabled: (state: boolean) => void
    ): PasswordHistoryCountInterface => {
        const isEnabled: boolean =
            passwordHistoryCount.properties.filter(
                (property: ConnectorPropertyInterface) =>
                    property.name === "passwordHistory.enable"
            )[ 0 ].value === "true";

        setPasswordHistoryEnabled(isEnabled);

        return {
            ...initialValues,
            passwordHistoryCount: parseInt(
                passwordHistoryCount.properties.filter(
                    (property: ConnectorPropertyInterface) =>
                        property.name === "passwordHistory.count"
                )[ 0 ].value
            ),
            passwordHistoryCountEnabled: isEnabled
        };    },
    processPasswordCountSubmitData: (
        _data: PasswordHistoryCountInterface
    ): Promise<any> => {
        return;
    },
    processPasswordExpiryInitialValues: (
        _initialValues: ValidationFormInterface,
        _passwordExpiry: GovernanceConnectorInterface,
        _setPasswordExpiryEnabled: (state: boolean) => void
    ): PasswordExpiryInterface => {
        return;
    },
    processPasswordExpirySubmitData: (
        _data: PasswordExpiryInterface
    ): Promise<any> => {
        return;
    },
    renderConnector: (
        connector: GovernanceConnectorInterface,
        connectorForm: ReactElement,
        connectorIllustration: string,
        connectorTitle: ReactNode,
        connectorSubHeading: ReactNode,
        message: ReactNode
    ): ReactElement => {
        return (
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
    // usePasswordExpiry: useGetPasswordExpiryProperties,
    usePasswordHistory: useGetPasswordHistoryCount,
    usePasswordExpiry: () => ({
        data: null,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: () => {
            return Promise.resolve({
                config: {},
                data: {
                    category: "Password Policies",
                    displayName: "Enable Password Expiry",
                    friendlyName: "Password Expiry",
                    id: "cGFzc3dvcmRFeHBpcnk",
                    name: "passwordExpiry",
                    order: "0",
                    properties: [
                        {
                          name: "passwordExpiry.enablePasswordExpiry",
                          value: "false",
                          displayName: "Enable Password Expiry",
                          description: "Allow users to reset the password after configured number of days",
                          meta: {
                            "groupID": 0
                          }
                        },
                        {
                          name: "passwordExpiry.passwordExpiryInDays",
                          value: "1",
                          displayName: "Password Expiry In Days",
                          description: "Number of days after which the password will expire",
                          meta: {
                            "groupID": 0
                          }
                        }
                      ],
                    subCategory: "DEFAULT"
                },
                headers: {},
                request: {},
                status: 200,
                statusText: "OK"
            });
        }
    })
    // usePasswordHistory: () => ({
    //     data: null,
    //     error: null,
    //     isLoading: false,
    //     isValidating: false,
    //     mutate: () => {
    //         return Promise.resolve({
    //             config: {},
    //             data: {
    //                 category: "",
    //                 displayName: "",
    //                 friendlyName: "",
    //                 id: "",
    //                 name: "",
    //                 order: "",
    //                 properties: [],
    //                 subCategory: ""
    //             },
    //             headers: {},
    //             request: {},
    //             status: 200,
    //             statusText: "OK"
    //         });
    //     }
    // })
};
