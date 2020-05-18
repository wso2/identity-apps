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

import { Field, Forms, useTrigger } from "@wso2is/forms";
import QRCode from "qrcode.react";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Divider, Form, Grid, Icon, List, Message, Modal, Popup, Segment} from "semantic-ui-react";
import {EditSection, ThemeIcon} from "../../../components/shared";
import {EnterCode, MFAIcons, QRCodeScan} from "../../../configs";
import {AlertInterface, AlertLevels} from "../../../models";
import {AppConfig} from "../../../helpers";
import {AUTHENTICATOR_APP, MULTI_FACTOR_AUTHENTICATION, SECURITY} from "../../../constants";
import {BiometricDevice, DiscoveryData} from "../../../models/biometric-authenticator";
import {
    deleteDeviceData,
    editDevicename,
    getAllDevices,
    getDiscoveryData,
    getRegisteredDevice,
} from "../../../api/multi-factor-biometricAuth";
import {FIDODevice} from "../../../models/fido-authenticator";
import _ from "lodash";

/**
 * Prop types for the associated accounts component.
 */
interface BiometricAuthenticatorProps {
    onAlertFired: (alert: AlertInterface) => void;
}

export const BiometricAuthenticator: React.FunctionComponent<BiometricAuthenticatorProps> = (props: BiometricAuthenticatorProps): JSX.Element => {

    const {onAlertFired} = props;
    const {t} = useTranslation();
    const [deviceList, setDeviceList] = useState<BiometricDevice[]>([]);
    const [discoveryData, setDiscoveryData] = useState<DiscoveryData>(null);
    const [biometricDevice, setBiometricDevice] = useState<BiometricDevice>(null);
    const [openWizard, setOpenWizard] = useState(false);
    const [submit, setSubmit] = useTrigger();
    const biometricConfig = useContext(AppConfig)[SECURITY][MULTI_FACTOR_AUTHENTICATION][AUTHENTICATOR_APP];
    const [step, setStep] = useState(0);
    const translateKey = "views:components.mfa.biometricAuthentication.";
    const [error, setError] = useState(false);
    const [cancel, setCancel] = useState(0);
    const [editDevice, setEditDevice] = useState<Map<string, boolean>>();
    const [isDeviceUpdateSuccessModalVisible, setIsDeviceUpdateSuccessModalVisibility] = useState(false);

    const fireFailureNotification = () => {
        onAlertFired({
            description: t(
                "views:components.mfa.biometricAuthentication.notifications.getDiscoveryData.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: t(
                "views:components.mfa.biometricAuthentication.notifications.getDiscoveryData.genericError.message"
            )
        });
    };

    /**
     * This function fires a notification on the success of device name update.
     */
    const fireDeviceNameUpdateSuccessNotification = () => {
        onAlertFired({
            description: t(
                "views:components.mfa.biometricAuthentication.notifications.updateDeviceName.success.description"
            ),
            level: AlertLevels.SUCCESS,
            message: t(
                "views:components.mfa.biometricAuthentication.notifications.updateDeviceName.success.message"
            )
        });
    };

    /**
     * This function fires a notification on successful removal of a device.
     */
    const fireDeletionSuccessNotification = () => {
        onAlertFired({
            description: t(
                "views:components.mfa.biometricAuthentication.notifications.removeDevice.success.description"
            ),
            level: AlertLevels.SUCCESS,
            message: t(
                "views:components.mfa.biometricAuthentication.notifications.removeDevice.success.message"
            )
        });
    };
    /**
     * Rest error and step when the modal is closed
     */
    useEffect(() => {
        if (!openWizard) {
            setError(false);
            setStep(0);
        }
    }, [openWizard]);

    /**
     * Initiates the Device registration flow by getting data for the QR code
     */
    const displayQrCode = () => {
        setCancel(0);
        let discoveryData: DiscoveryData;
        getDiscoveryData()
            .then(({data}) => {
                discoveryData = data;
                setDiscoveryData(discoveryData);
                stepContent(0);
                setOpenWizard(true);
                setTimeout(function () {
                    pollServer(discoveryData.id);
                }, 3000);
            }).catch(() => {
            fireFailureNotification();
        });
    };

    /**
     * Cancels polling the server
     */
    const cancelPolling = () =>{
        setCancel(1);
        setOpenWizard(false);
    };

    /**
     * Polls the server for the registraton requst
     */
    const pollServer = (id: string) => {
            console.log("Started polling ");
            console.log(id);
            let newdevice: BiometricDevice;
            getRegisteredDevice(id)
                .then((response) => {
                    newdevice = response.data;
                    setBiometricDevice(newdevice);
                    setDiscoveryData(null);
                    setStep(1);
                }).catch(() => {
                    if(cancel === 0){
                        setTimeout(function () {
                            pollServer(id);
                        },2000);
                    }

            });
    };

    /**
     * Refreshes the QR code
     */
    const refreshCode = () => {
        console.log("Refresh code")
    };

    /**
     * Changes the display name of the device after registration
     */
    const changeDeviceName = (id: string, newName: string) => {
        console.log("Changing device name");
        editDevicename(id, newName)
            .then((response)=>{
                setOpenWizard(false);
            }).catch(()=>{
            fireFailureNotification();
            setOpenWizard(false);
        })

    };

    /**
     * Lists all registered devices of a user
     */
    const listDevices = () => {
        let devices: BiometricDevice[];
        getAllDevices()
            .then(({data})=>{
                devices = data;
                setDeviceList(devices);
            }).catch(()=>{
            fireFailureNotification();})

    };

    useEffect(() => {
        listDevices();
    }, []);


    useEffect(() => {
        if (!_.isEmpty(biometricDevice)) {
            listDevices();
        }
    }, [biometricDevice]);

    const cancelEdit = (id: string) =>{
        const tempEditDevice: Map<string, boolean> = new Map(editDevice);
        tempEditDevice.set(id, false);
        setEditDevice(tempEditDevice);
    };

    const showEdit = (id: string) =>{
        const tempEditDevice: Map<string, boolean> = new Map(editDevice);
        tempEditDevice.set(id, true);
        setEditDevice(tempEditDevice);
    };

    const submitDeviceName = (name: string, id: string): void => {
        editDevicename(id, name)
            .then(()=>{
                listDevices();
                cancelEdit(id);
                fireDeviceNameUpdateSuccessNotification();
            }).catch(((error) => {
            fireFailureNotification();
        }));
    };

    const removeDevice = (id: string) =>{
        console.log("removing device " + id);
        deleteDeviceData(id)
            .then(()=> {
                cancelEdit(id);
                listDevices();
                fireDeletionSuccessNotification();
            }).catch((error) => {
            fireFailureNotification();
        })
    };

    /**
     * Displays the QR code
     */
    const renderQRCode = (): JSX.Element => {
        return (
            <>
                <Segment textAlign = "center" basic>
                    <QRCode value = { JSON.stringify(discoveryData) }/>
                    <Divider hidden/>
                    <p className="link" onClick = { refreshCode } > { t ( translateKey + "modals.scan.generate")}</p>
                </Segment>
                { biometricConfig?.apps?.length > 0
                    ? (
                        <Message info>
                            <Message.Header>{ t (translateKey + "modals.scan.messageHeading") } </Message.Header>
                            <Message.Content>
                                { t (translateKey + "modals.scan.messageBody") + " " }
                                <List bulleted>
                                    { biometricConfig?.apps?.map((app, index) => (
                                        <List.Item key = { index }>
                                            <a
                                                target = "_blank"
                                                href = { app.link }
                                                rel = "noopener noreferrer"
                                            >
                                                { app.name }
                                            </a>
                                        </List.Item>
                                    ))}
                                </List>
                            </Message.Content>
                        </Message>
                    )
                    : null}
            </>
        );
    };
    /**
     * Displays the newly registered device
     */
    const renderNewDevice = (): JSX.Element => {
        return (
            <>
                <Forms
                    onSubmit={ (values: Map<string, string>) => {
                        changeDeviceName(biometricDevice.id, values.get("newName"));
                    } }
                    submitState={ submit }
                >
                    <Field
                        name="newName"
                        label={ t(translateKey + "form.placeholder") }
                        type="text"
                        required={ true }
                        value={ biometricDevice.name }
                        requiredErrorMessage={ t(translateKey + "form.requiredError") }
                    />
                </Forms>
            </>
        );
    };
    const stepContent = (stepToDisplay: number): JSX.Element => {
        switch (stepToDisplay) {
            case 0:
                return renderQRCode();
            case 1:
                return renderNewDevice();
        }
    };
    /**
     * Generates illustration based on the input step
     * @param stepToDisplay The step number
     */
    const stepIllustration = (stepToDisplay: number): JSX.Element => {
        switch (stepToDisplay) {
            case 0:
                return <QRCodeScan.ReactComponent/>;
            case 1:
                return <EnterCode.ReactComponent/>;
        }
    };

    /**
     * Generates button text based on the input step
     * @param stepToDisplay The step number
     */
    const stepButtonText = (stepToDisplay: number): string => {
        switch (stepToDisplay) {
            case 0:
                return t("common:continue");
            case 1:
                return t("common:verify");
            case 3:
                return t("common:done");
        }
    };

    /**
     * Generates header text based on the input step
     * @param stepToDisplay The step number
     */
    const stepHeader = (stepToDisplay: number): string => {
        switch (stepToDisplay) {
            case 0:
                return t(translateKey + "modals.scan.heading");
            case 1:
                return t(translateKey + "modals.done");
        }
    };

    /**
     * Generates the right button-click event based on the input step number
     * @param stepToStep The step number
     */
    const handleModalButtonClick = (stepToStep: number) => {
        switch (stepToStep) {
            case 0:
                setStep(1);
                break;
            case 1:
                setSubmit();
                break;
            case 3:
                setOpenWizard(false);
                break;
        }
    };

    /**
     * This renders the TOTP wizard
     */
    const biometricWizard = (): JSX.Element => {
        return (
            <Modal
                dimmer = "blurring"
                size = "mini"
                open = { openWizard }
                onClose = { () => {
                    setOpenWizard(false);
                } }
                className = "totp"
            >
                {
                    step !== 3
                        ? (
                            < Modal.Header className = "totp-header">
                                <div className = "illustration">{stepIllustration(step)}</div>
                            </Modal.Header>
                        )
                        : null
                }
                <Modal.Content>
                    <h3>{ stepHeader(step) }</h3>
                    <Divider hidden/>
                    {stepContent(step)}
                </Modal.Content>
                <Modal.Actions>
                    {
                        (step !== 3 && step !==1)
                            ? (
                                < Button onClick = { () => {
                                    cancelPolling();
                                } } className="link-button">
                                    { t("common:cancel") }
                                </Button>
                            )
                            : null

                    }
                    {
                        (step === 1)
                            ? (
                                <Button onClick={ () => { handleModalButtonClick(step); } } primary>
                                    Confirm
                                </Button>
                            )
                            : null

                    }
                </Modal.Actions>


            </Modal>
        );
    };


    return (
        <>
            { biometricWizard() }
            <Grid padded={ true }>
                <Grid.Row columns = { 2 }>
                    <Grid.Column width = { 11 } className="first-column">
                        <List.Content floated="left">
                            <ThemeIcon
                                icon = { MFAIcons.fingerprint }
                                size = "mini"
                                twoTone = { true }
                                transparent = { true }
                                square = { true }
                                rounded = { true }
                                relaxed = { true }
                            />
                        </List.Content>
                        <List.Content>
                            <List.Header>
                                { t(translateKey + "heading") }
                            </List.Header>
                            <List.Description>
                                { t(translateKey + "description") }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width = { 5 } className="last-column">
                        <List.Content floated = "right">
                            <Popup
                                trigger={
                                    (
                                        <Icon
                                            link = { true }
                                            onClick = { displayQrCode }
                                            className = "list-icon"
                                            size = "small"
                                            color = "grey"
                                            name = "add"
                                        />
                                    )
                                }
                                content = { t(translateKey + "hint") }
                                inverted
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
                                    editDevice && editDevice.get(device.id)
                                        ? (
                                            <EditSection key={ device.id }>
                                                <Grid>
                                                    <Grid.Row columns={ 2 }>
                                                        <Grid.Column width={ 4 }>
                                                            {
                                                                t("views:components.mfa.fido.form.label")
                                                                + ` ${index + 1}`
                                                            }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 12 }>
                                                            <List.Item>
                                                                <List.Content>
                                                                    <Forms
                                                                        onSubmit={
                                                                            (values: Map<string, string>) => {
                                                                                submitDeviceName(
                                                                                    values.get(
                                                                                        device.id
                                                                                    ),
                                                                                    device.id
                                                                                );
                                                                            }
                                                                        }
                                                                    >
                                                                        <Field
                                                                            autoFocus={ true }
                                                                            label=""
                                                                            value={ device.name || "" }
                                                                            required={ true }
                                                                            requiredErrorMessage={ t(translateKey + "form.requiredError") }
                                                                            name={ device.id }
                                                                            type="text"
                                                                        />
                                                                        <Field
                                                                            hidden={ true }
                                                                            type="divider"
                                                                        />
                                                                        <Form.Group inline={ true }>
                                                                            <Field
                                                                                size="small"
                                                                                type="submit"
                                                                                value={ t("common:update").toString() }
                                                                            />
                                                                            <Field
                                                                                className="link-button"
                                                                                onClick={
                                                                                    () => {
                                                                                        cancelEdit(
                                                                                            device.id
                                                                                        );
                                                                                    }
                                                                                }
                                                                                size="small"
                                                                                type="button"
                                                                                value={ t("common:cancel").toString() }
                                                                            />
                                                                        </Form.Group>
                                                                    </Forms>
                                                                </List.Content>
                                                            </List.Item>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </EditSection>
                                        )
                                        : (
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
                                                                {
                                                                    device.name
                                                                    || t("views:components.mfa.fido.form.label")
                                                                    + ` ${index + 1}`
                                                                }
                                                            </List.Header>
                                                        </Grid.Column>
                                                        <Grid.Column width={ 5 } className="last-column">
                                                            <List.Content floated="right">
                                                                <Icon
                                                                    id={ device.id }
                                                                    link={ true }
                                                                    className="list-icon"
                                                                    size="large"
                                                                    color="grey"
                                                                    name="pencil alternate"
                                                                    onClick={
                                                                        () => {
                                                                            showEdit(device.id);
                                                                        }
                                                                    }
                                                                />
                                                                <Popup
                                                                    content={
                                                                        t("views:components.mfa.fido.form.remove")
                                                                    }
                                                                    inverted
                                                                    trigger={ (
                                                                        <Icon
                                                                            link={ true }
                                                                            name="trash alternate outline"
                                                                            color="red"
                                                                            size="small"
                                                                            className="list-icon"
                                                                            onClick={
                                                                                () => {
                                                                                    removeDevice(
                                                                                        device.id
                                                                                    );
                                                                                }
                                                                            }
                                                                        />
                                                                    ) }
                                                                />
                                                            </List.Content>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </List.Item>
                                        )
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
                                You don&apos;t have any devices registered yet.
                            </p>
                        </>
                    )
            }
        </>
    );
};
