/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import IconButton from "@oxygen-ui/react/IconButton";
import { default as OxygenList }from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Popup } from "@wso2is/react-components";
import QRCode from "qrcode.react";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
    Button,
    Container,
    Form,
    Grid,
    Icon,
    List,
    Message,
    Modal,
    Segment
} from "semantic-ui-react";
import {
    deletePushAuthRegisteredDevice,
    initPushAuthenticatorQRCode
} from "../../../api/multi-factor-push";
import { getMFAIcons } from "../../../configs";
import useGetPushAuthRegisteredDevices from "../../../hooks/use-get-push-auth-registered-devices";
import {
    AlertInterface,
    AlertLevels,
    HttpResponse
} from "../../../models";
import { PushAuthRegisteredDevice } from "../../../models/push-authenticator";

/**
 * Property types for the push authenticator component.
 */
interface PushAuthenticatorProps extends IdentifiableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    onEnabledAuthenticatorsUpdated: (updatedAuthenticators: Array<string>) => void;
    /**
     * This callback function handles the visibility of the
     * session termination modal.
     */
     handleSessionTerminationModalVisibility: (visibility: boolean) => void;
}

/**
 * Push Authenticator.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const PushAuthenticator: React.FunctionComponent<PushAuthenticatorProps> = (
    props: PropsWithChildren<PushAuthenticatorProps>
): React.ReactElement => {
    const {
        onAlertFired,
        handleSessionTerminationModalVisibility,
        ["data-componentid"]: componentId = "push-authenticator"
    } = props;

    const { t } = useTranslation();

    const translateKey: string = "myAccount:components.mfa.pushAuthenticatorApp.";

    const {
        data: registeredDeviceList,
        isLoading:isRegisteredDeviceListLoading,
        error: registeredDeviceListFetchError,
        mutate: updateRegisteredDeviceList
    } = useGetPushAuthRegisteredDevices();

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isConfigPushAuthenticatorModalOpen, setIsConfigPushAuthenticatorModalOpen ] = useState<boolean>(false);
    const [ qrCode, setQrCode ] = useState<string>(null);
    const [ PushAuthenticatorModalCurrentStep, setPushAuthenticatorModalCurrentStep ] = useState<number>(0);

    useEffect(() => {
        if (registeredDeviceListFetchError && !isRegisteredDeviceListLoading) {
            onAlertFired({
                description: t(translateKey +
                        "notifications.updateAuthenticatorError.error.description", {
                    error: registeredDeviceListFetchError?.message
                }),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.updateAuthenticatorError.error.message")
            });
        }
    }, [ isRegisteredDeviceListLoading, registeredDeviceListFetchError ]);

    /**
     * Initiate the push authenticator configuration flow.
     */
    const initPushAuthenticatorRegFlow = () => {
        setIsLoading(true);

        initPushAuthenticatorQRCode()
            .then((response: any) => {
                const qrCode: string = window.btoa(JSON.stringify(response?.data));

                setIsConfigPushAuthenticatorModalOpen(true);
                setQrCode(qrCode);
            })
            .catch((error: any) => {
                onAlertFired({
                    description: t(translateKey + "notifications.initError.error.description", {
                        error
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.initError.error.message")
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Handle cancelling push authenticator configuration flow.
     */
    const handlePushAuthenticatorInitCancel = () => {
        setIsConfigPushAuthenticatorModalOpen(false);
        setQrCode(null);
    };

    /**
     * Handle Push Authenticator configuration flow.
     *
     * @param event - Form submit event.
     * @param isRegenerated - Whether the push authenticator QR code is regenerated or not.
     */
    const handlePushAuthenticatorSetupSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        updateRegisteredDeviceList();
        setIsConfigPushAuthenticatorModalOpen(false);
    };

    /**
     * Render push authenticator form to shown in the push authenticator configuration modal.
     *
     * @param isRegenerated - Whether the push authenticator QR is regenerated or not.
     * @returns Rendered form component.
     */
    const renderPushAuthenticatorVerifyForm = (isRegenerated: boolean = false): React.ReactElement => {
        return (
            <>
                <Segment basic className="pl-0">
                    <Form
                        onSubmit={ handlePushAuthenticatorSetupSubmit }>
                        <Container>
                            <Grid className="ml-3 mr-3">
                                <div className = "totp-verify-step-btn">
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <Button
                                                primary
                                                type="submit"
                                                className="totp-verify-action-button"
                                                data-testid={ `${ componentId }-modal-actions-primary-button` }
                                            >
                                                { t("common:verify") }
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </div>
                                { !isRegenerated
                                    ? (
                                        <div className = "totp-verify-step-btn">
                                            <Grid.Row columns={ 1 }>
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                    <Button
                                                        type="button"
                                                        onClick={ handlePushAuthenticatorInitCancel }
                                                        className="link-button totp-verify-action-button"
                                                        data-testid={ `${ componentId }-modal-actions-cancel-button` }>
                                                        { t("common:cancel") }
                                                    </Button>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </div>
                                    ) : null
                                }
                            </Grid>
                        </Container>
                    </Form>
                </Segment>
            </>
        );
    };

    /**
     * Render push authenticator configuration modal content.
     *
     * @returns Modal content based on PushAuthenticatorModalCurrentStep.
     */
    const renderPushAuthenticatorWizardContent = (): React.ReactElement => {
        if (PushAuthenticatorModalCurrentStep === 0) {
            return (
                <Segment basic>
                    <h5 className=" text-center"> { t(translateKey + "modals.scan.heading") }</h5>
                    <Segment textAlign="center" basic className="qr-code">
                        { qrCode
                            ? <QRCode value={ qrCode } data-testid={ `${ componentId }-modals-scan-qrcode` }/>
                            : null
                        }
                    </Segment>
                    { renderPushAuthenticatorVerifyForm() }
                </Segment>
            );
        }

        return (
            <Segment className="totp">
                <div className="svg-box">
                    <svg className="circular positive-stroke">
                        <circle
                            className="path"
                            cx="75"
                            cy="75"
                            r="50"
                            fill="none"
                            strokeWidth="5"
                            strokeMiterlimit="10"
                        />
                    </svg>
                    <svg className="positive-icon positive-stroke">
                        <g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)">
                            <path
                                className="positive-icon__check"
                                fill="none"
                                d="M616.306,283.025L634.087,300.805L673.361,261.53"
                            />
                        </g>
                    </svg>
                </div>
                <p className= "success-content">{ t(translateKey + "modals.done") }</p>
            </Segment>
        );
    };

    /**
     * Render push authenticator configuration modal actions.
     *
     * @returns Modal action based on PushAuthenticatorModalCurrentStep.
     */
    const renderPushAuthenticatorWizardActions = (): React.ReactElement => {
        if (PushAuthenticatorModalCurrentStep === 0) {
            return (
                <Message className="totp-tooltip display-flex">
                    <Icon name="info circle" />
                    <Message.Content>
                        <Trans
                            i18nKey={ (translateKey + "modals.toolTip") }
                        >
                            Don&apos;t have an app? Download an authenticator
                            application like Google Authenticator from
                            <a
                                target="_blank"
                                href="https://www.apple.com/us/search/totp?src=globalnav"
                                rel="noopener noreferrer"> App Store </a>
                            or
                            <a
                                target="_blank"
                                href="https://play.google.com/store/search?q=totp"
                                rel="noopener noreferrer"> Google Play </a>
                        </Trans>
                    </Message.Content>
                </Message>
            );
        }

        return (
            <Button
                primary
                className = "totp-verify-done-button"
                data-testid={ `${ componentId }-modal-actions-primary-button` }
                onClick= { () => {
                    setIsConfigPushAuthenticatorModalOpen(false);
                    setQrCode(null);
                    setPushAuthenticatorModalCurrentStep(0);
                    handleSessionTerminationModalVisibility(true);
                } }
            >
                { t("common:done") }
            </Button>
        );
    };

    /**
     * Renders the push authenticator configuration Modal.
     *
     * @returns Rendered modal component
     */
    const renderPushAuthenticatorWizard = (): React.ReactElement => {
        return (
            <Modal
                data-testid={ `${ componentId }-modal` }
                dimmer="blurring"
                size="tiny"
                open={ isConfigPushAuthenticatorModalOpen }
                className="totp"
                closeOnDimmerClick={ false }
            >
                <Modal.Header className="wizard-header text-center">
                    { t(translateKey + "modals.heading") }
                </Modal.Header>
                <Modal.Content data-testid={ `${ componentId }-modal-content` } scrolling>
                    { renderPushAuthenticatorWizardContent() }
                </Modal.Content>
                <Modal.Actions data-testid={ `${ componentId }-modal-actions` } className ="actions">
                    { renderPushAuthenticatorWizardActions() }
                </Modal.Actions>
            </Modal>
        );
    };

    const deleteRegisteredDevice = (deviceId: string): void => {
        setIsLoading(true);
        deletePushAuthRegisteredDevice(deviceId).then(
            (res: HttpResponse) => {
                if(res.status >= 200 && res.status < 400)
                    onAlertFired({
                        description: "successfully deleted",
                        level: AlertLevels.SUCCESS,
                        message: "delete success"
                    });
            }
        ).catch((_err: any) => {
            onAlertFired({
                description: "error occurred when deleting the registered device",
                level: AlertLevels.ERROR,
                message: "delete error"
            });
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <>
            { renderPushAuthenticatorWizard() }
            <Grid padded={ true } data-componentid={ componentId }>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 1 } className="first-column">
                        <List.Content floated="left">
                            <GenericIcon
                                icon={ getMFAIcons().pushAuthenticatorApp }
                                size="mini"
                                twoTone={ true }
                                transparent={ true }
                                square={ true }
                                rounded={ true }
                                relaxed={ true }
                            />
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width={ 12 } className="first-column">
                        <List.Content>
                            <List.Header>{ t(translateKey + "heading") }</List.Header>
                            <List.Description className="mt-2">
                                { t(translateKey + "description") }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width={ 3 } className="last-column">
                        { (!registeredDeviceList || registeredDeviceList?.length === 0) && (
                            <List.Content floated="right">
                                <Popup
                                    trigger={
                                        (<Icon
                                            link={ true }
                                            onClick={ initPushAuthenticatorRegFlow }
                                            className="list-icon padded-icon"
                                            size="small"
                                            color="grey"
                                            name="plus"
                                            disabled={ isLoading }
                                            data-testid={ `${componentId}-view-button` }
                                        />)
                                    }
                                    content={ t(translateKey + "addHint") }
                                    inverted
                                />
                            </List.Content>
                        ) }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { registeredDeviceList?.length > 0 ? (<>
                <OxygenList
                    sx={ {
                        ml: 3,
                        mr: 3,
                        pt: 0
                    } }>
                    { registeredDeviceList.map((registeredDevice: PushAuthRegisteredDevice) => (
                        <ListItem
                            key={ registeredDevice?.deviceId }
                            secondaryAction={
                                (<IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={
                                        () => deleteRegisteredDevice(registeredDevice.deviceId)
                                    }>
                                    <TrashIcon />
                                </IconButton>)
                            }
                        >
                            <ListItemText
                                primary={ registeredDevice?.name }
                                secondary={ registeredDevice?.model }
                            />
                        </ListItem>
                    )) }

                </OxygenList>
            </>) : null }
        </>
    );
};
