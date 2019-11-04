/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List, Modal } from "semantic-ui-react";
import { deleteDevice, getMetaData, startFidoFlow } from "../../../api";
import { MFAIcons } from "../../../configs";
import { Notification } from "../../../models";
import { ThemeIcon } from "../../shared";

/**
 * Proptypes for the associated accounts component.
 */
interface FIDOAuthenticatorProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * FIDO section.
 *
 * @return {JSX.Element}
 */
export const FIDOAuthenticator: React.FunctionComponent<FIDOAuthenticatorProps> = (props: FIDOAuthenticatorProps):
    JSX.Element => {
    const { t } = useTranslation();
    const [ deviceList, setDeviceList ] = useState([]);
    const { onNotificationFired } = props;

    useEffect(() => {
        getFidoMetaData();
    }, []);

    const getFidoMetaData = () => {
        const devices = [];
        getMetaData()
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        // tslint:disable-next-line:prefer-for-of
                        for (let i = 0; i < response.data.length; i++) {
                            devices.push(response.data[i]);
                        }
                    }
                    setDeviceList(devices);
                }
                });
    };

    const addDevice = () => {
        startFidoFlow()
            .then(() => {
                getFidoMetaData();
                onNotificationFired({
                    description: t(
                        "views:securityPage.multiFactor.fido.notification.registration.success.description"
                    ),
                    message: t(
                        "views:securityPage.multiFactor.fido.notification.registration.success.message"
                    ),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                });
            }).catch(() => {
                onNotificationFired({
                    description: t(
                        "views:securityPage.multiFactor.fido.notification.registration.error.description"
                    ),
                    message: t(
                        "views:securityPage.multiFactor.fido.notification.registration.error.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
            });
        });
    }

    const removeDevice = (event) => {
        deleteDevice(event.target.id)
            .then(() => {
                getFidoMetaData();
                onNotificationFired({
                    description: t(
                        "views:securityPage.multiFactor.fido.notification.deletion.success.description"
                    ),
                    message: t(
                        "views:securityPage.multiFactor.fido.notification.deletion.success.message"
                    ),
                    otherProps: {
                        success: true
                    },
                    visible: true
                });
            }).catch(() => {
                onNotificationFired({
                    description: t(
                    "views:securityPage.multiFactor.fido.notification.deletion.error.description"
                    ),
                    message: t(
                    "views:securityPage.multiFactor.fido.notification.deletion.error.message"
                    ),
                    otherProps: {
                    negative: true
                    },
                    visible: true
                });
            });
    }

    return (
        <div>
            <Grid padded>
                <Grid.Row columns={2}>
                    <Grid.Column width={11} className="first-column">
                        <List.Content floated="left">
                            <ThemeIcon
                                icon={MFAIcons.fido}
                                size="mini"
                                twoTone
                                transparent
                                rounded
                                relaxed
                            />
                        </List.Content>
                        <List.Content>
                            <List.Header>{t("views:components.mfa.fido.heading")}</List.Header>
                            <List.Description>
                                {t("views:components.mfa.fido.description")}
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width={5} className="last-column">
                        <List.Content floated="right">
                            <Icon
                                floated="right"
                                link
                                className="list-icon"
                                size="small"
                                color="grey"
                                name="add"
                                onClick={addDevice}
                            />
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                deviceList ? (
                        <List divided verticalAlign="middle" className="main-content-inner settings-section-inner-list">
                            {
                                deviceList.map((device, index) => (
                                    <List.Item className="inner-list-item" key={index}>
                                        <Grid padded>
                                            <Grid.Row columns={2} className="first-column">
                                                <Grid.Column width={11}>
                                                    <List.Header className="with-left-padding">
                                                        <Icon
                                                            floated="right"
                                                            className="list-icon"
                                                            size="small"
                                                            color="green"
                                                            name="check circle outline"
                                                        />
                                                        {device.registrationTime}
                                                    </List.Header>
                                                </Grid.Column>
                                                <Grid.Column width={5} className="last-column">
                                                    <List.Content floated="right">
                                                        <Icon
                                                            id={device.credential.credentialId}
                                                            link
                                                            className="list-icon"
                                                            size="large"
                                                            color="red"
                                                            name="trash alternate outline"
                                                            onClick={removeDevice}
                                                        />
                                                    </List.Content>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Item>
                                ))
                            }
                        </List>
                    )
                    :
                    (
                        <>
                            <p style={{fontSize: "12px"}}>
                                <Icon
                                    color="grey"
                                    floated="left"
                                    name="info circle"
                                />
                                You don't have any devices registered yet.
                            </p>
                        </>
                    )
            }
        </div>
    );
};
