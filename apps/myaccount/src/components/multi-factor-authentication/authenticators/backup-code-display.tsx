import { TestableComponentInterface } from "@wso2is/core/models";
import { Heading, CopyInputField, EmptyPlaceholder } from "@wso2is/react-components";

import React, { PropsWithChildren, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {getEmptyPlaceholderIllustrations} from "../../../configs/ui"
import {
     Button,
     Grid,
     Icon,
     Message,
     Segment,
     Modal,
     GridColumn,
     GridRow
     
} from "semantic-ui-react";
import {
     refreshBackupCode,
     getBackupCodes,
} from "../../../api";
import {
    AlertInterface,
    AlertLevels,
    AuthStateInterface,
} from "../../../models";
import { AppState } from "../../../store";

/**
 * Property types for the backup code component.
 * Also see {@link BackupCodeAuthenticator.defaultProps}
 */
interface BackupCodePropss extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    openWizard: boolean;
    isInit: boolean;
    onOpenWizardToggle(isOpen : boolean);
    onShowBackupCodeWizardToggle(show : boolean)
    
}

export const RenderBackupCodeWizard : React.FunctionComponent<BackupCodePropss> = (
    props: PropsWithChildren<BackupCodePropss>
): React.ReactElement => {

    const { onAlertFired,openWizard, isInit, onOpenWizardToggle, onShowBackupCodeWizardToggle, ["data-testid"]: testId } = props;
    const [ backupCodes, setBackupCodes ] = useState<Array<string>>();
    const [ ListedbackupCodes, setListedBackupCodes ] = useState<Array<Array<string>>>();
    const { t } = useTranslation();
    const translateKey = "myAccount:components.mfa.backupCode.";

    const profileDetails: AuthStateInterface = useSelector(
        (state: AppState) => state.authenticationInformation
    );

    const updateListedBackupCodes = (backupCodeSet) => {

        const gridArr = []
        if (backupCodeSet && backupCodeSet.length > 0) {
            let arr = []
            for (let index = 0; index < backupCodeSet.length; index++) {
                arr.push(backupCodeSet[index])
                if ((index + 1)%4 === 0){
                    gridArr.push(arr)
                    arr = []
                }
            }
            if (arr.length > 0) {
                gridArr.push(arr)
            }
        }
        setListedBackupCodes(gridArr);
    }

    /**
     * Load backup codes when opening the modal.
     */
    useEffect(()=> {
        if (openWizard === true) {
            getBackupCodes().then((response) => {
                let backupCodes = response.data;
                if (isInit && (backupCodes === undefined || backupCodes.length === 0) ) {
                    refreshBackupCode().then((response) => {
                        backupCodes = response.data.backupCodes
                        setBackupCodes(backupCodes)
                        updateListedBackupCodes(backupCodes)
                    }).catch((errorMessage) => {
                        onAlertFired({
                            description: t(
                                translateKey +
                                    "notifications.refreshError.error.description",
                                {
                                    error: errorMessage,
                                }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                translateKey + "notifications.refreshError.error.message"
                            ),
                        });
                    })
                } else {
                    setBackupCodes(backupCodes)
                    updateListedBackupCodes(backupCodes)
                }
            }).catch((errorMessage)=> {
                onAlertFired({
                    description: t(
                        translateKey +
                            "notifications.retrieveError.error.description",
                        {
                            error: errorMessage,
                        }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        translateKey + "notifications.retrieveError.error.message"
                    ),
                });
            });
        }
    }, [openWizard])
    
    /**
     * Refreshes backup codes
     */
    const refreshBackCodes = () => {
        refreshBackupCode()
            .then((response) => {
                const backupCodes = response.data.backupCodes;
                setBackupCodes(backupCodes);
                updateListedBackupCodes(backupCodes)
            })
            .catch((errorMessage) => {
                onAlertFired({
                    description: t(
                        translateKey +
                            "notifications.refreshError.error.description",
                        {
                            error: errorMessage,
                        }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        translateKey + "notifications.refreshError.error.message"
                    ),
                });
            });
    };

    /**
     * Download backup codes
     */
     const downloadBackupCodes = () => {
        if (backupCodes) {
            let backupCodeString = "";
            for (let i = 0; i < backupCodes.length; i += 2) {
                if (backupCodes[i + 1] !== undefined) {
                    backupCodeString +=
                        [i + 1] +
                        ". " +
                        backupCodes[i] +
                        "\t " +
                        [i + 2] +
                        ". " +
                        backupCodes[i + 1] +
                        "\n";
                } else {
                    backupCodeString += [i + 1] + ". " + backupCodes[i] + "\n";
                }
            }
    
            const blob = new Blob(
                [
                    t(translateKey + "download.heading") + "\n",
                    t(translateKey + "download.subHeading") + "\n\n",
                    backupCodeString + "\n",
                    "(" + profileDetails.username + ")\n\n",
                    "*" + t(translateKey + "download.info1") + "\n",
                    "*" + t(translateKey + "download.info2") + new Date(),
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
                message: t(translateKey + "notifications.downloadSuccess.genericMessage.message"),
            });
        } else {
            onAlertFired({
                description: t(translateKey + "notifications.downloadError.genericError.description"),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.downloadError.genericError.message"),
            });
        }
    };

        return (
            <Modal
                data-testid={`${testId}-modal`}
                size="small"
                open={openWizard}
                onClose={() => {
                    onOpenWizardToggle(false);
                }}
                closeOnDimmerClick={ false }
                dimmer="blurring"
                className="wizard"
            >
                
                <Modal.Header className="wizard-header bold">
                    {t(translateKey + "modals.heading")}
                    <Heading as="h6">
                    {t(translateKey + "modals.subHeading")}
                    </Heading>
                </Modal.Header>
                
                <Modal.Content 
                    data-testid={`${testId}-modal-content`}
                    scrolling

                >
                <Heading size={"tiny"}  >
                {t(translateKey + "modals.description")}
                </Heading>
                
                {backupCodes && backupCodes.length > 0 ? (
                <Modal.Actions
                    data-testid={`${testId}-modal-actions`}
                    className="actions"
                >
                        <Message className="display-flex" size="small" info>
                            <Icon name="info" color="teal" corner />
                            <Message.Content className="tiny">{t(translateKey + "modals.info")}</Message.Content>
                        </Message>
                    
                </Modal.Actions>
                ): null }
                <Segment attached={"top"} piled>
                {backupCodes && backupCodes.length > 0 ? (
                        <div>
                            <Button attached="left" floated="right" className="ui basic primary left floated button link-button" onClick={downloadBackupCodes}>{t(translateKey + "modals.download.heading")}</Button>
                            <Button attached="right" floated="right" className="ui basic primary right floated button link-button" onClick={refreshBackCodes}>{t(translateKey + "modals.refresh.heading")}</Button>
                            
                        </div>
                        ) : null
                    }
                    {ListedbackupCodes && ListedbackupCodes.length > 0 ? (
                
                <Grid  container>
                    
                      {
                          ListedbackupCodes?.map((rowCodes, index)=> {
                              return (
                                  <GridRow stretched key={index}>
                                    {
                                        rowCodes?.map((code, index2)=> {
                                            return (
                                                <GridColumn  width={4} key={index2}>
                                                    <CopyInputField value={code}/>
                                                </GridColumn>
                                            )
                                        })
                                    }
                                  </GridRow>
                              )
                          })
                      } 
                </Grid>
                ) : (
                    <Grid centered>
                            <EmptyPlaceholder
                                data-testid={ `${ testId }-empty-placeholder` }
                                image={ getEmptyPlaceholderIllustrations().newList }
                                subtitle={ [ t(translateKey + "modals.generate.description") ] }
                                action={<Button  className="ui basic primary floated button link-button" onClick={refreshBackCodes}>{t(translateKey + "modals.generate.heading")}</Button>}
                                
                            />    
                            </Grid>
                        )
                    }
            </Segment>
                </Modal.Content>
                <Modal.Actions
                    
                >
                    <Button
                        
                        attached="top"
                        floated="left"
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
    
}


