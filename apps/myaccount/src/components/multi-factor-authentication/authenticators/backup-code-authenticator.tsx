/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import { ContentLoader, Heading, LinkButton } from "@wso2is/react-components";
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
import {
    generateBackupCodes,
    getRemainingBackupCodesCount
} from "../../../api";
import {
    AlertInterface,
    AlertLevels,
    AuthStateInterface,
    BackupCodeInterface,
    BackupCodesCountInterface
} from "../../../models";
import { AppState } from "../../../store";

/**
 * Property types for the backup code component.
 * Also see {@link BackupCodeAuthenticator.defaultProps}
 */
interface BackupCodeProps extends IdentifiableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    initBackupCodeFlow: boolean;
    onBackupFlowCompleted: () => void;
}

export const BackupCodeAuthenticator : FunctionComponent<BackupCodeProps> = (
    props: PropsWithChildren<BackupCodeProps>
): ReactElement => {

    const { 
        onAlertFired,
        initBackupCodeFlow,
        onBackupFlowCompleted,
        ["data-componentid"]: componentid 
    } = props;

    const { t } = useTranslation();

    const translateKey: string = "myAccount:components.mfa.backupCode.";

    const profileDetails: AuthStateInterface = useSelector(
        (state: AppState) => state.authenticationInformation
    );

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
    const [ backupCodes, setBackupCodes ] = useState<Array<string>>([]);
    const [ remainingBackupCodes, setRemainingBackupCodes ] = useState<number>(0);
    const [ isCodesCopied, setIsCodesCopied ] = useState<boolean>(false);
    const [ isConfirmRegenerationModalOpen, setIsConfirmRegenerationModalOpen ] = useState<boolean>(false);
    const [ isWarnRemaingBackupCodes, setIsWarnRemaingBackupCodes ] = useState<boolean>(false);

    const minBackupCodesLimit: number = 4;
    
    /**
     * Fetch remaining backup codes count
     */
    useEffect(() => {
        getRemainingCount();
    }, []);

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
     * Fetch remaining backup codes count
     */
    const getRemainingCount = (): void => {
        getRemainingBackupCodesCount()
            .then((response: BackupCodesCountInterface) => {
                const remainingCount = response.remainingBackupCodesCount;

                setRemainingBackupCodes(remainingCount);
                setIsWarnRemaingBackupCodes(remainingCount <= minBackupCodesLimit);
            })
            .catch((errorMessage)=> {
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
            })
            .catch((errorMessage) => {
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
            .catch((errorMessage) => {
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

            for (let i = 0; i < backupCodes.length; i += 2) {
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
    
            const blob = new Blob(
                [
                    t(translateKey + "download.heading") + "\n",
                    "Username: " + getUserNameWithoutDomain(profileDetails.profileInfo.userName) + "\n\n",
                    t(translateKey + "download.subHeading") + "\n\n",
                    backupCodeString + "\n\n",
                    "*" + t(translateKey + "download.info1") + "\n",
                    "*" + t(translateKey + "download.info2") + new Date() + "."
                ],
    
                { type: "application/json" }
            );
    
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

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
                                        backupCodes?.map((code, index)=> {
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
                        { isCodesCopied ? "Copied" : "Copy Codes" }
                    </Button>
                    <Button
                        primary
                        onClick={ handleDownloadBackupCodes }
                        data-componentid={ `${componentid}-modal-download-button` }
                    >
                        { t(translateKey + "modals.download.heading") }
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
                    <Button
                        className="link-button"
                        onClick={ () => setIsConfirmRegenerationModalOpen(false) }
                        data-testid={ `${componentid}-regenerate-confirm-modal-actions-cancel-button` }>
                        { t("common:cancel") }
                    </Button>
                    <Button
                        primary={ true }
                        onClick={ handleRefreshBackCodes }
                        data-testid={ `${componentid}-regenerate-confirm-modal-actions-confirm-button` }>
                        { "Regenerate" }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    return (
        <>
            { renderBackupCodeWizard() }
            { renderConfirmRegenerateModal() }
            <Grid padded={ true } data-testid={ componentid }>
                <Grid.Column width={ 1 } className="first-column"/>
                <Grid.Column width={ 14 } className="first-column">
                    <Message 
                        className="display-flex" 
                        size="small" 
                        info={ !isWarnRemaingBackupCodes }
                        warning={ isWarnRemaingBackupCodes }
                        data-testid={ `${componentid}-message` }
                    >
                        { isWarnRemaingBackupCodes 
                            ? <Icon name="warning sign" color="orange" size="large"/>
                            : <Icon name="info circle" color="teal" size="large"/> 
                        }
                        <Message.Content className="tiny">
                            <List.Content>
                                <List.Header>
                                    { "Backup Codes" }
                                    <Label 
                                        className={ `backup-code-label ${ isWarnRemaingBackupCodes 
                                            ? "warning" : "info" }` }
                                        data-testid={ `${componentid}-remaining-count-label` }
                                    >
                                        { `${remainingBackupCodes} Remaining` }
                                    </Label>
                                </List.Header>
                                <List.Description>
                                    <div>
                                        { t(translateKey + "description") }
                                    </div>
                                    <LinkButton 
                                        compact 
                                        onClick={ () => {
                                            setIsConfirmRegenerationModalOpen(true);
                                        } }
                                        data-testid={ `${componentid}-regenerate-button` }
                                    >
                                        <Icon name="refresh" />
                                        { "Regenerate" }
                                    </LinkButton>
                                </List.Description>
                            </List.Content>
                        </Message.Content>
                    </Message>
                </Grid.Column>
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
