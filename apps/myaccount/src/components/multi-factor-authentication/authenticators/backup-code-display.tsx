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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CopyInputField, EmptyPlaceholder, Heading } from "@wso2is/react-components";
import React, { PropsWithChildren, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    Button,
    Grid,
    GridColumn,
    Icon,
    Message,
    Modal,
    Segment    
} from "semantic-ui-react";
import {
    getBackupCodes, 
    refreshBackupCode
} from "../../../api";
import { getEmptyPlaceholderIllustrations } from "../../../configs/ui";
import {
    AlertInterface,
    AlertLevels,
    AuthStateInterface,
    BackupCodeInterface
} from "../../../models";
import { AppState } from "../../../store";

/**
 * Property types for the backup code component.
 * Also see {@link BackupCodeAuthenticator.defaultProps}
 */
interface BackupCodeProps extends IdentifiableComponentInterface {

    onAlertFired: (alert: AlertInterface) => void;
    openWizard: boolean;
    isInit: boolean;
    onOpenWizardToggle(isOpen : boolean);
    onShowBackupCodeWizardToggle(show : boolean);
    backupCodes: Array<string>;
    updateBackupCodes(backupCodeList: Array<string>);
}

export const BackupCodeAuthenticator : React.FunctionComponent<BackupCodeProps> = (
    props: PropsWithChildren<BackupCodeProps>
): React.ReactElement => {

    const { onAlertFired, 
        openWizard, 
        onOpenWizardToggle, 
        onShowBackupCodeWizardToggle, 
        backupCodes,
        updateBackupCodes,
        isInit,
        ["data-componentid"]: componentid 
    } = props;

    const { t } = useTranslation();
    const translateKey: string = "myAccount:components.mfa.backupCode.";
    const profileDetails: AuthStateInterface = useSelector(
        (state: AppState) => state.authenticationInformation
    );

    /**
     * Load backup codes when opening the modal.
     */
    useEffect(()=> {
        if (openWizard === true && isInit === true) {
            getBackupCodes()
                .then((response) => {
                    let backupCodes: Array<string> = response.backupCodes;

                    if (backupCodes === undefined || backupCodes.length === 0) {
                        refreshBackupCode()
                            .then((response: BackupCodeInterface) => {
                                backupCodes = response.backupCodes;
                                updateBackupCodes(backupCodes);
                            })
                            .catch((errorMessage) => {
                                onAlertFired({
                                    description: t(
                                        translateKey +
                                    "notifications.refreshError.error.description",
                                        {
                                            error: errorMessage
                                        }
                                    ),
                                    level: AlertLevels.ERROR,
                                    message: t(
                                        translateKey + "notifications.refreshError.error.message"
                                    )
                                });
                            });
                    } else {
                        updateBackupCodes(backupCodes);
                    }
                })
                .catch((errorMessage)=> {
                    onAlertFired({
                        description: t(
                            translateKey +
                            "notifications.retrieveError.error.description",
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
        }
    }, [ openWizard ]);
    
    /**
     * Refreshes backup codes
     */
    const refreshBackCodes = (): void => {

        refreshBackupCode()
            .then((response: BackupCodeInterface) => {
                updateBackupCodes(response.backupCodes);
            })
            .catch((errorMessage) => {
                onAlertFired({
                    description: t(
                        translateKey +
                            "notifications.refreshError.error.description",
                        {
                            error: errorMessage
                        }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        translateKey + "notifications.refreshError.error.message"
                    )
                });
            });
    };

    /**
     * Generate a file containing backup codes and let the user download the file.
     * @example
     * SAVE YOUR BACKUP CODES.
     * Keep these backup codes somewhere safe but accessible.
     * 
     * 1. 123456	 2. 234567
     * 3. 345678	 4. 456789
     * 5. 567890	 6. 678901
     * 7. 789012	 8. 890123
     * 9. 901234	 10. 012345
     * 
     * (test@carbon.super)
     * *You can only use each backup code once.
     * *These codes were generated on: Mon Apr 18 2022 14:35:57 GMT+0530 (India Standard Time)
     */
    const downloadBackupCodes = (): void => {

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
                    t(translateKey + "download.subHeading") + "\n\n",
                    backupCodeString + "\n",
                    "(" + profileDetails.username + ")\n\n",
                    "*" + t(translateKey + "download.info1") + "\n",
                    "*" + t(translateKey + "download.info2") + new Date()
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

    return (
        <Modal
            data-componentid={ `${componentid}-modal` }
            size="small"
            open={ openWizard }
            onClose={ () => {
                onOpenWizardToggle(false);
            } }
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
                
                { backupCodes && backupCodes.length > 0 ? (
                    <Modal.Actions
                        data-componentid={ `${componentid}-modal-actions` }
                        className="actions"
                    >
                        <Message className="display-flex" size="small" info>
                            <Icon name="info" color="teal" corner />
                            <Message.Content className="tiny">{ t(translateKey + "modals.info") }</Message.Content>
                        </Message>
                    
                    </Modal.Actions>
                ): null }
                <Segment attached={ "top" } piled>
                    { backupCodes && backupCodes.length > 0 ? (
                        <div>
                            <Button 
                                attached="left" 
                                floated="right" 
                                className="ui basic primary left floated button link-button"
                                data-componentid={ `${componentid}-download-button` }
                                onClick={ downloadBackupCodes }>{ t(translateKey + "modals.download.heading") }
                            </Button>
                            <Button 
                                attached="right" 
                                floated="right"
                                data-componentid={ `${componentid}-refresh-button` }
                                className="ui basic primary right floated button link-button" 
                                onClick={ refreshBackCodes }>{ t(translateKey + "modals.refresh.heading") }
                            </Button>
                            
                        </div>
                    ) : null
                    }
                    { backupCodes && backupCodes.length > 0 ? (
                
                        <Grid  container columns={ 4 }>
                            {
                                backupCodes?.map((code, index)=> {
                                    return (
                                        <GridColumn key={ index }> 
                                            <CopyInputField 
                                                value={ code } 
                                                data-componentid={ `${ componentid }-copy-input-filed-${ index }` } />
                                        </GridColumn>
                                    );
                                })
                            }
                        </Grid>
                    ) : (
                        <Grid centered>
                            <EmptyPlaceholder
                                data-componentid={ `${ componentid }-empty-placeholder` }
                                image={ getEmptyPlaceholderIllustrations().newList }
                                subtitle={ [ t(translateKey + "modals.generate.description") ] }
                                action={ (<Button  
                                    className="ui basic primary floated button link-button"
                                    data-componentid={ `${componentid}-generate-button` }
                                    onClick={ refreshBackCodes }>{ t(translateKey + "modals.generate.heading") }
                                </Button>) }
                                
                            />    
                        </Grid>
                    )
                    }
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    attached="top"
                    floated="left"
                    data-componentid={ `${componentid}-cancel-button` }
                    className="ui basic primary left floated button link-button"
                    onClick= { () => {
                        onOpenWizardToggle(false);
                        onShowBackupCodeWizardToggle(false);
                    } }
                >
                    { t("common:cancel") }
                </Button>
                <Button
                    compact
                    floated="right"
                    primary
                    data-componentid={ `${componentid}-done-button` }
                    onClick= { () => {
                        onOpenWizardToggle(false);
                        onShowBackupCodeWizardToggle(false);
                    } }
                >
                    { t("common:done") }
                </Button>
                    
            </Modal.Actions>
        </Modal>
    );   
};

/**
 * Default properties for {@link BackupCodeAuthenticator}
 * See type definitions in {@link BackupCodeProps}
 */
BackupCodeAuthenticator.defaultProps = {
    "data-componentid": "backup-code-authenticator"
};
