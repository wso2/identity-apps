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

import { default as OxygenList }from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, GenericIcon, Popup } from "@wso2is/react-components";
import { getMFAIcons } from "@wso2is/selfcare.core.v1/configs";
import usePushAuthenticator from "@wso2is/selfcare.core.v1/hooks/use-push-authenticator";
import { PushAuthRegisteredDevice } from "@wso2is/selfcare.core.v1/models/push-authenticator";
import QRCode from "qrcode.react";
import React, { PropsWithChildren, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Container,
    Form,
    Grid,
    Icon,
    List,
    Modal,
    Segment
} from "semantic-ui-react";
import "./push-authenticator.scss";

/**
 * Property types for the push authenticator component.
 */
type PushAuthenticatorProps = IdentifiableComponentInterface;

/**
 * Push Authenticator.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const PushAuthenticator: React.FunctionComponent<PushAuthenticatorProps> = (
    props: PropsWithChildren<PushAuthenticatorProps>
): React.ReactElement => {
    const { ["data-componentid"]: componentId = "push-authenticator" } = props;

    const { t } = useTranslation();

    const {
        deleteRegisteredDevice,
        handlePushAuthenticatorInitCancel,
        handlePushAuthenticatorSetupSubmit,
        initPushAuthenticatorRegFlow,
        isConfigPushAuthenticatorModalOpen,
        isRegisteredDeviceListLoading,
        qrCode,
        registeredDeviceList,
        setIsConfigPushAuthenticatorModalOpen,
        translateKey
    } = usePushAuthenticator();

    const [ deviceIdToBeDeleted, setDeviceIdToBeDeleted ] = useState<string>("");

    /**
     * Renders the push authenticator configuration Modal.
     *
     * @returns Rendered modal component
     */
    const renderPushAuthenticatorWizard = (): React.ReactElement => {
        return (
            <Modal
                data-componentId={ `${ componentId }-modal` }
                dimmer="blurring"
                size="tiny"
                open={ isConfigPushAuthenticatorModalOpen }
                className="totp"
                closeOnDimmerClick={ false }
            >
                <Modal.Header className="wizard-header text-center">
                    { t(translateKey + "modals.scan.heading") }
                </Modal.Header>
                <Modal.Content data-componentId={ `${ componentId }-modal-content` } scrolling>
                    { renderPushAuthenticatorWizardContent() }
                </Modal.Content>
                { registeredDeviceList?.length > 0 && (
                    <Modal.Actions
                        data-componentId={ `${ componentId }-view-modal-actions` }
                        className ="actions"
                    >
                        { renderPushAuthenticatorWizardActions() }
                    </Modal.Actions>)
                }
            </Modal>
        );
    };

    /**
     * Render push authenticator configuration modal content.
     *
     * @returns Modal content
     */
    const renderPushAuthenticatorWizardContent = (): React.ReactElement => {
        if (!registeredDeviceList || registeredDeviceList?.length === 0) {
            return (
                <Segment basic>
                    <h5 className=" text-center"> { t(translateKey + "modals.scan.heading") }</h5>
                    <Segment textAlign="center" basic className="qr-code">
                        { qrCode
                            ? <QRCode value={ qrCode } data-componentId={ `${ componentId }-modals-scan-qrcode` }/>
                            : null
                        }
                    </Segment>
                    <Segment basic className="pl-0">
                        <Form onSubmit={ handlePushAuthenticatorSetupSubmit }>
                            <Container>
                                <Grid className="ml-3 mr-3">
                                    <div className = "totp-verify-step-btn">
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                <Button
                                                    primary
                                                    type="submit"
                                                    className="totp-verify-action-button"
                                                    data-componentId={ `${ componentId }-modal-actions-primary-button` }
                                                >
                                                    { t("common:verify") }
                                                </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </div>
                                    <div className = "totp-verify-step-btn">
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                <Button
                                                    type="button"
                                                    onClick={ handlePushAuthenticatorInitCancel }
                                                    className="link-button totp-verify-action-button"
                                                    data-componentId={ `${ componentId }-modal-actions-cancel-button` }>
                                                    { t("common:cancel") }
                                                </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </div>
                                </Grid>
                            </Container>
                        </Form>
                    </Segment>
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
                <p className= "success-content">{ t(translateKey + "modals.scan.done") }</p>
            </Segment>
        );
    };

    /**
     * Render push authenticator configuration modal actions.
     *
     * @returns Modal actions
     */
    const renderPushAuthenticatorWizardActions = (): React.ReactElement => {
        if (registeredDeviceList?.length > 0) {
            return (
                <Button
                    primary
                    className = "totp-verify-done-button"
                    data-componentId={ `${ componentId }-modal-actions-primary-button` }
                    onClick= { () => {
                        setIsConfigPushAuthenticatorModalOpen(false);
                    } }
                >
                    { t("common:done") }
                </Button>
            );
        }

    };

    /**
     * This methods generates and returns the delete confirmation modal.
     *
     * @returns ReactElement Generates the delete confirmation modal.
     */
    const renderDeleteConfirmationModal = (): ReactElement => (
        <ConfirmationModal
            data-componentId={ `${ componentId }-confirmation-modal` }
            onClose={ (): void => setDeviceIdToBeDeleted("") }
            type="negative"
            open={ Boolean(deviceIdToBeDeleted) }
            assertionHint={ t("myAccount:components.mfa.fido.modals.deleteConfirmation.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (): void => {
                setDeviceIdToBeDeleted("");
            } }
            onPrimaryActionClick={ (): void => {
                deleteRegisteredDevice(deviceIdToBeDeleted);
                setDeviceIdToBeDeleted("");
            } }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header data-componentId={ `${ componentId }-confirmation-modal-header` }>
                { t("myAccount:components.mfa.pushAuthenticatorApp.modals.deviceDeleteConfirmation.heading") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                data-componentId={ `${ componentId }-confirmation-modal-message` }
                attached
                negative
            >
                { t("myAccount:components.mfa.pushAuthenticatorApp.modals.deviceDeleteConfirmation.description") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentId={ `${ componentId }-confirmation-modal-content` }>
                { t("myAccount:components.mfa.pushAuthenticatorApp.modals.deviceDeleteConfirmation.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    return (
        <div className="push-authenticator">
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
                                            disabled={ isRegisteredDeviceListLoading }
                                            data-componentId={ `${componentId}-view-button` }
                                        />)
                                    }
                                    content={ t(translateKey + "addHint") }
                                    inverted
                                />
                            </List.Content>
                        ) }
                    </Grid.Column>
                </Grid.Row>
                {
                    registeredDeviceList?.length > 0 ? (
                        <Grid.Row columns={ 2 } className="push-auth-registered-device-list">
                            <Grid.Column width={ 1 }></Grid.Column>
                            <Grid.Column width={ 15 }>
                                <OxygenList>
                                    { registeredDeviceList.map((registeredDevice: PushAuthRegisteredDevice) => (
                                        <ListItem
                                            key={ registeredDevice?.deviceId }
                                            secondaryAction={ (
                                                <Popup
                                                    content={ t("common:delete") }
                                                    trigger={ (<Icon
                                                        name="trash alternate outline"
                                                        color="red"
                                                        size="mini"
                                                        className="list-icon"
                                                        data-componentId={ `${ componentId }-remove-device` }
                                                        onClick={
                                                            () => setDeviceIdToBeDeleted(registeredDevice.deviceId)
                                                        }
                                                    />) }
                                                    position="top center" // Positioning of the tooltip
                                                />

                                            ) }
                                        >
                                            <Icon
                                                name="mobile alternate"
                                                size="large"
                                                className="device-icon"
                                            />
                                            <ListItemText
                                                primary={ registeredDevice?.name }
                                                secondary={ registeredDevice?.model }
                                            />
                                        </ListItem>
                                    )) }
                                </OxygenList>
                            </Grid.Column>
                        </Grid.Row>
                    ) : null
                }
                { deviceIdToBeDeleted && renderDeleteConfirmationModal() }
            </Grid>
        </div>
    );
};
