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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List, ModalContent } from "semantic-ui-react";
import { deleteDevice, getMetaData, startFidoFlow, startFidoUsernamelessFlow } from "../../../api";
import { MFAIcons } from "../../../configs";
import { AlertInterface, AlertLevels } from "../../../models";
import { ModalComponent, ThemeIcon } from "../../shared";

/**
 * Proptypes for the associated accounts component.
 */
interface FIDOAuthenticatorProps {
    onAlertFired: (alert: AlertInterface) => void;
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
    const [ isDeviceErrorModalVisible, setDeviceErrorModalVisibility ] = useState(false);
    const { onAlertFired } = props;

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

    /**
     * This handles the initiation of device registration with
     * passwordless authentication
     */
    const addDevice = () => {
        setDeviceErrorModalVisibility(false);
        startFidoFlow()
            .then(() => {
                getFidoMetaData();

                onAlertFired({
                    description: t(
                        "views:components.mfa.fido.notifications.startFidoFlow.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "views:components.mfa.fido.notifications.startFidoFlow.success.message"
                    )
                });
            }).catch(() => {
            onAlertFired({
                description: t(
                    "views:components.mfa.fido.notifications.startFidoFlow.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "views:components.mfa.fido.notifications.startFidoFlow.genericError.message"
                )
            });
        });
    };

    /**
     * This handles the initiation of device registration with
     * usernameless authentication
     */
    const addUsernamelessDevice = () => {
        setDeviceErrorModalVisibility(false);
        startFidoUsernamelessFlow()
            .then(() => {
                getFidoMetaData();

                onAlertFired({
                    description: t(
                        "views:components.mfa.fido.notifications.startFidoFlow.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "views:components.mfa.fido.notifications.startFidoFlow.success.message"
                    )
                });
            }).catch(() => {
            setDeviceErrorModalVisibility(true);
        });
    };

    const removeDevice = (event) => {
        deleteDevice(event.target.id)
            .then(() => {
                getFidoMetaData();
                onAlertFired({
                    description: t(
                        "views:components.mfa.fido.notifications.removeDevice.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "views:components.mfa.fido.notifications.removeDevice.success.message"
                    )
                });
            }).catch(() => {
            onAlertFired({
                description: t(
                    "views:components.mfa.fido.notifications.removeDevice.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "views:components.mfa.fido.notifications.removeDevice.genericError.description"
                )
            });
        });
    };

    /**
     * Handles the device registration error modal close action.
     */
    const handleDeviceErrorModalClose = (): void => {
        setDeviceErrorModalVisibility(false);
    };

    /**
     * Device registration error modal.
     *
     * @return {JSX.Element}
     */
    const deviceErrorModal = (): JSX.Element => {
        return (
            <ModalComponent
                primaryAction={ t("common:retry") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleDeviceErrorModalClose }
                onPrimaryActionClick={ addUsernamelessDevice }
                open={ isDeviceErrorModalVisible }
                onClose={ handleDeviceErrorModalClose }
                type="negative"
                header={ t("views:components.mfa.fido.modals.deviceRegistrationErrorModal.heading") }
                content={ t("views:components.mfa.fido.modals.deviceRegistrationErrorModal.description") }
            >
                <ModalContent>
                    <Button
                        className="negative-modal-link-button"
                        onClick={ addDevice }
                    >
                        { t("views:components.mfa.fido.tryButton") }
                    </Button>
                </ModalContent>
            </ModalComponent>
        );
    };

    return (
        <>
        <div>
            <Grid padded={ true }>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 11 } className="first-column">
                        <List.Content floated="left">
                            <ThemeIcon
                                icon={ MFAIcons.fingerprint }
                                size="mini"
                                twoTone={ true }
                                transparent={ true }
                                rounded={ true }
                                relaxed={ true }
                            />
                        </List.Content>
                        <List.Content>
                            <List.Header>{ t("views:components.mfa.fido.heading") }</List.Header>
                            <List.Description>
                                { t("views:components.mfa.fido.description") }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width={ 5 } className="last-column">
                        <List.Content floated="right">
                            <Icon
                                floated="right"
                                link={ true }
                                className="list-icon"
                                size="small"
                                color="grey"
                                name="add"
                                onClick={ addUsernamelessDevice }
                            />
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                deviceList ? (
                        <List
                            divided={ true }
                            verticalAlign="middle"
                            className="main-content-inner settings-section-inner-list"
                        >
                            {
                                deviceList.map((device, index) => (
                                    <List.Item className="inner-list-item" key={ index }>
                                        <Grid padded={ true }>
                                            <Grid.Row columns={ 2 } className="first-column">
                                                <Grid.Column width={ 11 }>
                                                    <List.Header className="with-left-padding">
                                                        <Icon
                                                            floated="right"
                                                            className="list-icon"
                                                            size="small"
                                                            color="grey"
                                                            name="dot circle outline"
                                                        />
                                                        { device.registrationTime }
                                                    </List.Header>
                                                </Grid.Column>
                                                <Grid.Column width={ 5 } className="last-column">
                                                    <List.Content floated="right">
                                                        <Icon
                                                            id={ device.credential.credentialId }
                                                            link={ true }
                                                            className="list-icon"
                                                            size="large"
                                                            color="red"
                                                            name="trash alternate outline"
                                                            onClick={ removeDevice }
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
                            <p style={ { fontSize: "12px" } }>
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
            <div>{ deviceErrorModal() }</div>
        </>
    );
};
