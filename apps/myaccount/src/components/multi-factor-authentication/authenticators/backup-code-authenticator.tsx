/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { ContentLoader, GenericIcon, Heading, LinkButton, Popup } from "@wso2is/react-components";
import {
    deleteBackupCode,
    generateBackupCodes,
    getRemainingBackupCodesCount,
    updateEnabledAuthenticators
} from "@wso2is/selfcare.core.v1/api";
import { getMFAIcons } from "@wso2is/selfcare.core.v1/configs";
import {
    AlertInterface,
    AlertLevels,
    BackupCodeInterface,
    BackupCodesCountInterface,
    EnabledAuthenticatorUpdateAction
} from "@wso2is/selfcare.core.v1/models";
import { AppState } from "@wso2is/selfcare.core.v1/store";
import React, { FunctionComponent, MouseEvent, PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    Button,
    Container,
    Grid,
    GridColumn,
    Icon,
    Label,
    List,
    Message,
    Modal,
    Segment
} from "semantic-ui-react";

/**
 * Property types for the backup code component.
 * Also see {@link BackupCodeAuthenticator.defaultProps}
 */
interface BackupCodeProps extends IdentifiableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    initBackupCodeFlow: boolean;
    onBackupFlowCompleted: () => void;
    /**
     * This callback function handles the visibility of the
     * session termination modal.
     */
    handleSessionTerminationModalVisibility: (visibility: boolean) => void;
    isBackupCodesConfigured: boolean;
    isSuperTenantLogin: boolean;
    enabledAuthenticators: Array<string>;
    backupCodeAuthenticatorName: string;
    onEnabledAuthenticatorsUpdated: (updatedAuthenticators: Array<string>) => void;
}

export const BackupCodeAuthenticator : FunctionComponent<BackupCodeProps> = (
    props: PropsWithChildren<BackupCodeProps>
): ReactElement => {

    const {
        onAlertFired,
        initBackupCodeFlow,
        onBackupFlowCompleted,
        handleSessionTerminationModalVisibility,
        ["data-componentid"]: componentid,
        isBackupCodesConfigured,
        enabledAuthenticators,
        backupCodeAuthenticatorName,
        isSuperTenantLogin,
        onEnabledAuthenticatorsUpdated
    } = props;

    const { t } = useTranslation();

    const translateKey: string = "myAccount:components.mfa.backupCode.";

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
    const [ backupCodes, setBackupCodes ] = useState<Array<string>>([]);
    const [ remainingBackupCodes, setRemainingBackupCodes ] = useState<number>(0);
    const [ isCodesCopied, setIsCodesCopied ] = useState<boolean>(false);
    const [ isConfirmRegenerationModalOpen, setIsConfirmRegenerationModalOpen ] = useState<boolean>(false);
    const [ remainingBackupCodesAmountLow, setRemainingBackupCodesAmountLow ] = useState<boolean>(false);
    const [ isMFAConfigured, setIsMFAConfigured ] = useState<boolean>(false);
    const [ isRemoveBackupCodesModalOpen, setIsRemoveBackupCodesModalOpen ] = useState<boolean>(false);

    const minBackupCodesLimit: number = 4;

    /**
     * Fetch remaining backup codes count
     */
    useEffect(() => {
        getRemainingCount();
    }, []);

    /**
     * Check whether one of the additional authenticator is enabled
     */
    useEffect(() => {
        if (
            enabledAuthenticators.find(
                (authenticator: string) => authenticator !== backupCodeAuthenticatorName
            )
        ) {
            setIsMFAConfigured(true);
        } else {
            setIsMFAConfigured(false);
            if (isMFAConfigured && isBackupCodesConfigured && isSuperTenantLogin) {
                handleDeleteBackupCodes();
            }
        }
    }, [ enabledAuthenticators ]);

    /**
     * Starts backup code configuration flow
     */
    useEffect(() => {
        if (initBackupCodeFlow) {
            setIsLoading(true);
            setIsModalOpen(true);
            initBackupCodes();
        }
    }, [ initBackupCodeFlow ]);

    /**
     * Starts backup code configuration flow
     */
    const initializeBackupCodesConfig = (): void => {
        setIsLoading(true);
        setIsModalOpen(true);
        initBackupCodes();
    };

    /**
     * Update enabled authenticator list based on the update action.
     *
     * @param action - The update action.
     */
    const handleUpdateEnabledAuthenticators = (action: EnabledAuthenticatorUpdateAction): void => {
        const authenticatorsList: Array<string> = [ ...enabledAuthenticators ];

        switch(action) {
            case EnabledAuthenticatorUpdateAction.ADD : {
                if (!authenticatorsList.includes(backupCodeAuthenticatorName)) {
                    authenticatorsList.push(backupCodeAuthenticatorName);
                }

                break;
            }
            case EnabledAuthenticatorUpdateAction.REMOVE : {
                if (authenticatorsList.includes(backupCodeAuthenticatorName)) {
                    authenticatorsList.splice(authenticatorsList.indexOf(backupCodeAuthenticatorName), 1);
                }

                break;
            }
        }

        // Update enabled authenticator list.
        updateEnabledAuthenticators(authenticatorsList.join(","))
            .then(() => {
                onEnabledAuthenticatorsUpdated(authenticatorsList);
            })
            .catch(((errorMessage: any) => {
                onAlertFired({
                    description: t(translateKey +
                            "notifications.updateAuthenticatorError.error.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.updateAuthenticatorError.error.message")
                });
            }));
    };

    /**
     * Fetch remaining backup codes count
     */
    const getRemainingCount = (): void => {
        getRemainingBackupCodesCount()
            .then((response: BackupCodesCountInterface) => {
                const remainingCount: number = response.remainingBackupCodesCount;

                setRemainingBackupCodes(remainingCount);
                setRemainingBackupCodesAmountLow(remainingCount <= minBackupCodesLimit);
            })
            .catch((errorMessage: string)=> {
                onAlertFired({
                    description: t(
                        translateKey + "notifications.retrieveError.error.description",
                        {
                            error: errorMessage
                        }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        translateKey + "notifications.retrieveError.error.message"
                    )
                });
            });
    };

    /**
     * Generate backup codes and initialize the configuration flow
     */
    const initBackupCodes = (): void => {
        generateBackupCodes()
            .then((response: BackupCodeInterface) => {
                setBackupCodes(response?.backupCodes ?? []);
                handleUpdateEnabledAuthenticators(EnabledAuthenticatorUpdateAction.ADD);
            })
            .catch((errorMessage: string) => {
                onAlertFired({
                    description: t(
                        translateKey + "notifications.refreshError.error.description",
                        {
                            error: errorMessage
                        }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        translateKey + "notifications.refreshError.error.message"
                    )
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Refresh backup codes
     */
    const handleRefreshBackCodes = (): void => {
        setIsConfirmRegenerationModalOpen(false);
        setIsLoading(true);
        setIsModalOpen(true);

        generateBackupCodes()
            .then((response: BackupCodeInterface) => {
                setBackupCodes(response?.backupCodes ?? []);
            })
            .catch((errorMessage: string) => {
                onAlertFired({
                    description: t(translateKey + "notifications.refreshError.error.description",
                        {
                            error: errorMessage
                        }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.refreshError.error.message")
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Download backup codes
     */
    const handleDownloadBackupCodes = (): void => {
        if (backupCodes) {
            let backupCodeString: string = "";

            for (let i: number = 0; i < backupCodes.length; i += 2) {
                if (backupCodes[i + 1] !== undefined) {
                    backupCodeString +=
                        [ i + 1 ] +
                        ". " +
                        backupCodes[i] +
                        "\t " +
                        [ i + 2 ] +
                        ". " +
                        backupCodes[i + 1] +
                        "\n";
                } else {
                    backupCodeString += [ i + 1 ] + ". " + backupCodes[i] + "\n";
                }
            }

            const blob: Blob = new Blob(
                [
                    t(translateKey + "download.heading", { productName }) + "\n\n",
                    t(translateKey + "download.subHeading", { productName }) + "\n\n",
                    backupCodeString + "\n\n",
                    "* " + t(translateKey + "download.info1") + "\n",
                    "* " + t(translateKey + "download.info2") + new Date() + "."
                ],

                { type: "application/json" }
            );

            const url: string = window.URL.createObjectURL(blob);
            const a: HTMLAnchorElement = document.createElement("a");

            a.style.display = "none";
            a.href = url;
            a.download = "backup_codes.txt";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            // Sets a success notification.
            onAlertFired({
                description: t(translateKey + "notifications.downloadSuccess.genericMessage.description"),
                level: AlertLevels.SUCCESS,
                message: t(translateKey + "notifications.downloadSuccess.genericMessage.message")
            });
        } else {
            onAlertFired({
                description: t(translateKey + "notifications.downloadError.genericError.description"),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.downloadError.genericError.message")
            });
        }
    };

    /**
     * Copy backup codes
     */
    const handleCopyBackupCodes = (event: MouseEvent<HTMLButtonElement>): void => {
        event.stopPropagation();
        const contentToBeCopied: string = backupCodes?.join("\n");

        CommonUtils.copyTextToClipboard(contentToBeCopied)
            .then(()=> setIsCodesCopied(true));
    };

    /**
     * Render backup codes modal
     * @returns Backup codes modal
     */
    const renderBackupCodeWizard = (): ReactElement => {
        return (
            <Modal
                data-componentid={ `${componentid}-modal` }
                size="small"
                open={ isModalOpen }
                closeOnDimmerClick={ false }
                dimmer="blurring"
                className="wizard"
            >
                <Modal.Header className="wizard-header bold">
                    { t(translateKey + "modals.heading") }
                    <Heading as="h6">
                        { t(translateKey + "modals.subHeading") }
                    </Heading>
                </Modal.Header>

                <Modal.Content
                    data-componentid={ `${componentid}-modal-content` }
                    scrolling
                >
                    <Heading size={ "tiny" }  >
                        { t(translateKey + "modals.description") }
                    </Heading>
                    <Message className="display-flex" size="small" warning>
                        <Icon name="warning sign" color="orange" corner />
                        <Message.Content className="tiny">
                            { t(translateKey + "modals.warn") }
                        </Message.Content>
                    </Message>
                    <Message className="display-flex" size="small" info>
                        <Icon name="info" color="teal" corner />
                        <Message.Content className="tiny">
                            { t(translateKey + "modals.info") }
                        </Message.Content>
                    </Message>
                    { !isLoading
                        ? (
                            <Segment>
                                <Grid container columns={ 2 } textAlign="center">
                                    {
                                        backupCodes?.map((code: string, index: number)=> {
                                            return (
                                                <GridColumn
                                                    key={ index }
                                                    className="backup-code-column"
                                                    data-componentid={ `${ componentid }-modal-backup-code-${ index }` }
                                                >
                                                    <div>
                                                        { code }
                                                    </div>
                                                </GridColumn>
                                            );
                                        })
                                    }
                                </Grid>
                            </Segment>
                        ) : (
                            <Segment padded="very">
                                <ContentLoader inline="centered" active/>
                            </Segment>
                        )
                    }
                </Modal.Content>
                <Modal.Actions data-testid={ `${componentid}-modal-actions` }>
                    <LinkButton
                        floated="left"
                        onClick= { () => {
                            onBackupFlowCompleted();
                            getRemainingCount();
                            setIsModalOpen(false);
                            handleSessionTerminationModalVisibility(true);
                        } }
                        data-componentid={ `${componentid}-modal-actions-done-button` }
                    >
                        { t("common:close") }
                    </LinkButton>
                    <Button
                        basic
                        primary
                        onMouseEnter={ () => setIsCodesCopied(false) }
                        onClick={ handleCopyBackupCodes }
                        data-componentid={ `${componentid}-modal-copy-button` }
                    >
                        {
                            isCodesCopied
                                ? t(translateKey + "modals.actions.copied")
                                : t(translateKey + "modals.actions.copy")
                        }
                    </Button>
                    <Button
                        primary
                        onClick={ handleDownloadBackupCodes }
                        data-componentid={ `${componentid}-modal-download-button` }
                    >
                        { t(translateKey + "modals.actions.download") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    /**
     * Render the Backup codes regenerate confirmation modal
     */
    const renderConfirmRegenerateModal = (): ReactElement => {
        return (
            <Modal
                data-testid={ `${componentid}-regenerate-confirm-modal` }
                size="small"
                open={ isConfirmRegenerationModalOpen }
                closeOnDimmerClick={ false }
                dimmer="blurring"
            >
                <Modal.Content data-testid={ `${componentid}-regenerate-confirm-modal-content` }>
                    <Container>
                        <h3>{ t(translateKey + "modals.regenerate.heading") }</h3>
                    </Container>
                    <Message className="display-flex" size="small" warning>
                        <Icon name="info" color="orange" corner />
                        <Message.Content className="tiny">
                            { t(translateKey + "modals.regenerate.description") }
                        </Message.Content>
                    </Message>
                </Modal.Content>
                <Modal.Actions data-testid={ `${componentid}-regenerate-confirm-modal-actions` }>
                    <LinkButton
                        color="red"
                        onClick={ () => setIsConfirmRegenerationModalOpen(false) }
                        data-testid={ `${componentid}-regenerate-confirm-modal-actions-cancel-button` }
                    >
                        { t("common:cancel") }
                    </LinkButton>
                    <Button
                        color="red"
                        onClick={ handleRefreshBackCodes }
                        data-testid={ `${componentid}-regenerate-confirm-modal-actions-confirm-button` }
                    >
                        { t(translateKey + "modals.actions.regenerate") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    /**
     *  Initiate deletion of backup codes configuration.
     */
    const handleDeleteBackupCodes = (): void => {
        deleteBackupCode()
            .then(() => {
                handleUpdateEnabledAuthenticators(EnabledAuthenticatorUpdateAction.REMOVE);
                onAlertFired({
                    description: t(translateKey + "notifications.deleteSuccess.message"),
                    level: AlertLevels.SUCCESS,
                    message: t(translateKey + "notifications.deleteSuccess.genericMessage")
                });
                handleSessionTerminationModalVisibility(true);
            })
            .catch((errorMessage: any) => {
                onAlertFired({
                    description: t(translateKey + "notifications.deleteError.genericError.description", {
                        error: errorMessage
                    }),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.deleteError.genericError.message")
                });
            })
            .finally(() => {
                setIsRemoveBackupCodesModalOpen(false);
            });
    };

    /**
     * Handle the revoke backup codes delete confirmation modal close event.
     */
    const handleRemoveBackupCodesModalClose = (): void => {
        setIsRemoveBackupCodesModalOpen(false);
    };

    /**
     * This renders the backup codes delete confirmation Modal.
     */
    const renderRemoveBackupCodesModal = () => {
        return (
            <Modal
                data-testid={ `${componentid}-termination-modal` }
                size="mini"
                open={ isRemoveBackupCodesModalOpen }
                onClose={ handleRemoveBackupCodesModalClose }
                closeOnDimmerClick={ false }
                dimmer="blurring"
            >
                <Modal.Content data-testid={ `${componentid}-termination-modal-content` }>
                    <Container>
                        <h3>{ t(translateKey + "modals.delete.heading") }</h3>
                    </Container>
                    <br/>
                    <p>{ t(translateKey + "modals.delete.description") }</p>
                </Modal.Content>
                <Modal.Actions data-testid={ `${componentid}-termination-modal-actions` }>
                    <Button
                        className="link-button"
                        onClick={ handleRemoveBackupCodesModalClose }
                        data-testid={ `${componentid}-termination-modal-actions-cancel-button` }>
                        { t("common:cancel") }
                    </Button>
                    <Button
                        primary={ true }
                        onClick={ handleDeleteBackupCodes }
                        data-testid={ `${componentid}-termination-modal-actions-terminate-button` }>
                        { t("common:remove") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    return (
        <>
            { renderBackupCodeWizard() }
            { renderConfirmRegenerateModal() }
            { renderRemoveBackupCodesModal() }
            <Grid padded={ true } data-testid={ componentid }>
                <Grid.Row columns={ 3 }>
                    <Grid.Column width={ 1 } className="first-column" verticalAlign="middle">
                        <List.Content floated="left">
                            <GenericIcon
                                icon={ getMFAIcons().backupCodes }
                                size="mini"
                                twoTone={ true }
                                transparent={ true }
                                square={ true }
                                rounded={ true }
                                relaxed={ true }
                            />
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width={ 12 } className="first-column" verticalAlign="middle">
                        <List.Content>
                            <List.Header>
                                { t(translateKey + "heading") }
                                { isBackupCodesConfigured ? (
                                    <Label
                                        className={
                                            `backup-code-label ${ remainingBackupCodesAmountLow ? "warning" : "info" }`
                                        }
                                        data-testid={ `${componentid}-remaining-count-label` }
                                    >
                                        { `${remainingBackupCodes} ` + t(translateKey + "remaining") }
                                    </Label>
                                ) :
                                    null
                                }
                            </List.Header>
                            <List.Description data-testid={ `${componentid}-message` }>
                                { t(translateKey + "description") }
                            </List.Description>
                        </List.Content>
                    </Grid.Column>
                    <Grid.Column width={ 3 } className="last-column" verticalAlign="middle">
                        <List.Content floated="right">
                            { isBackupCodesConfigured ? (
                                <>
                                    <Popup
                                        trigger={
                                            (<Icon
                                                link={ true }
                                                className="list-icon"
                                                size="small"
                                                color="grey"
                                                name="refresh"
                                                onClick={ () => {
                                                    setIsConfirmRegenerationModalOpen(true);
                                                } }
                                                data-testid={ `${componentid}-regenerate-button` }
                                            />)
                                        }
                                        content={ t(translateKey + "modals.actions.regenerate") }
                                        inverted
                                    />
                                    <Popup
                                        trigger={
                                            (
                                                <Icon
                                                    link={ true }
                                                    onClick={ () => setIsRemoveBackupCodesModalOpen(true) }
                                                    className="list-icon padded-icon"
                                                    size="small"
                                                    color="grey"
                                                    name="trash alternate"
                                                    data-testid={ `${componentid}-delete` }
                                                />
                                            )
                                        }
                                        inverted
                                        content={ t(translateKey + "actions.delete") }
                                        position="top right"
                                    />
                                </>
                            ) : (
                                <Popup
                                    trigger={
                                        (<Icon
                                            link={ false }
                                            onClick={ initializeBackupCodesConfig }
                                            className="list-icon padded-icon"
                                            size="small"
                                            color="grey"
                                            name="add"
                                            disabled={ isLoading }
                                            data-testid={ `${componentid}-init-button` }
                                        />)
                                    }
                                    content={ t(translateKey + "actions.add") }
                                    inverted
                                />
                            ) }
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

/**
 * Default properties for {@link BackupCodeAuthenticator}
 * See type definitions in {@link BackupCodeProps}
 */
BackupCodeAuthenticator.defaultProps = {
    "data-componentid": "backup-code-authenticator"
};
