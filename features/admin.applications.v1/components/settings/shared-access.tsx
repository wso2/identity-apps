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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { ConfirmationModal, EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useOperationStatusPoller } from "../../hooks/use-operation-status-poller";
import { ApplicationInterface } from "../../models/application";
import { ApplicationShareForm } from "../forms/share-application-form";
import ApplicationShareStatusWizard from "../wizard/application-share-status-wizard";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import {
    Heading,
    LinkButton,
} from "@wso2is/react-components";
import { Grid } from "semantic-ui-react";

export type OperationStatus = "IDLE" | "ONGOING" | "SUCCESS" | "FAILED" | "PARTIAL";

/**
 * Proptypes for the shared access component.
 */
interface SharedAccessPropsInterface extends SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 *  Shared access component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Share access component.
 */
export const SharedAccess: FunctionComponent<SharedAccessPropsInterface> = (
    props: SharedAccessPropsInterface
): ReactElement => {

    const { t } = useTranslation();

    const { application, onUpdate, readOnly } = props;
    const [ sharingState, setSharingState ] = useState<OperationStatus>("IDLE");
    const [ sharingOperationId, setSharingOperationId ] = useState<string>();
    const [ showBanner, setShowBanner ] = useState(false);
    const [ showConfirmationModal, setShowConfirmationModal ] = useState(false);
    const [ showStatusModal, setShowStatusModal ] = useState(false);
    const [ componentId, SetComponentId ] = useState();

    const { status, startPolling } = useOperationStatusPoller({  // use-application-sharing-operation-status
        applicationId: application.id,
        pollingInterval: 5000,
        onCompleted: (finalStatus) => {
            setSharingState(finalStatus);
            setShowBanner(true);
        },
        onStatusChange: (newOperationId, newStatus) => {
            setSharingState(newStatus);
            setSharingOperationId(newOperationId);
        },
        onError: (error) => {
            console.error("Polling error:", error);
        }//enabled
    });

    const handleChildStartedOperation = () => {
        setSharingState("ONGOING");
        setShowBanner(true);
        startPolling();
    };
    
    const handleShowStatusModal = () => {
        setShowStatusModal(true);
    };
    const handleHideStatusModal = () => {
        setShowStatusModal(false);
    };

    const resolveContent = (): ReactElement => {
        return (
            <ApplicationShareStatusWizard
                componentId="wizard1"
                operationId={sharingOperationId}
                isSubmitting={true}
                isLoading={true}
                hasError={false}
            />
        );
    };

    const renderBanner = (): ReactElement | null => {

        const isOngoing = sharingState === "ONGOING";
        const isFailure = sharingState === "PARTIAL" || sharingState === "FAILED";

        if ( !isOngoing && !isFailure ) return null;
        return (
            <>
                { sharingState === "ONGOING" && (
                    <div className="banner-wrapper">
                        <Alert
                            severity="warning"
                        >
                            <AlertTitle className="alert-title">
                                <Trans components={ { strong: <strong/> } } >
                                    Update In Progress.
                                </Trans>
                            </AlertTitle>
                            Updating shared access is in progress.
                        </Alert>
                    </div>
                ) }
                { isFailure && (
                    <div className="banner-wrapper">
                        <Alert
                            // className={ classes }
                            severity="warning"
                            action={
                                (
                                    <Box display="flex">
                                        <Button
                                            className="banner-view-hide-details"
                                            onClick={handleShowStatusModal}>
                                            {
                                                "View"
                                            }
                                        </Button>
                                    </Box>
                                )
                            }
                        >
                            <AlertTitle className="alert-title">
                                <Trans components={ { strong: <strong/> } } >
                                    Update Partialy Successfull.
                                </Trans>
                            </AlertTitle>
                            Updating shared access completed with partial success.
                        </Alert>
                    </div>
                ) }
            </>
            
        );
    };

    

    return (
        <>
            { renderBanner() }

            <ModalWithSidePanel
                data-testid={ componentId }
                data-componentid={ componentId }
                open={ showStatusModal }
                className="wizard application-create-wizard"
                dimmer="blurring"
                size="small"
                onClose={ () => handleHideStatusModal() }
                closeOnDimmerClick={ false }
                closeOnEscape
            >
                <ModalWithSidePanel.MainPanel>
                    <ModalWithSidePanel.Header className="wizard-header">
                            Summary - Update application shared access
                        <Heading as="h6">
                            Summary of detailed application sharing failures.
                        </Heading>
                    </ModalWithSidePanel.Header>
    
                    <ModalWithSidePanel.Content className="content-container">
                        <Grid>
                            { resolveContent() }
                        </Grid>
    
                    </ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Actions>
                        <Grid>
                            <Grid.Row column={ 1 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <LinkButton
                                        data-testid={ `-close-button` }
                                        data-componentid={ `-close-button` }
                                        floated="left"
                                        onClick={ () => {
                                            handleHideStatusModal();
                                        } }
                                        disabled={ false }
                                    >
                                        close
                                    </LinkButton>
                                </Grid.Column>
                            </Grid.Row>                           
                        </Grid>
                    </ModalWithSidePanel.Actions>                
                </ModalWithSidePanel.MainPanel>
            </ModalWithSidePanel>
            
            <EmphasizedSegment className="advanced-configuration-section" padded="very">
                <ApplicationShareForm
                    application={ application }
                    onApplicationSharingCompleted={ () => onUpdate(application?.id) }
                    readOnly={ readOnly }
                    onOperationStarted={ handleChildStartedOperation }
                    operationStatus={ status }
                    isSharingInProgress={ sharingState === "ONGOING" }
                />
            </EmphasizedSegment>
        </>
    );
};

/**
 * Default props for the application advanced settings component.
 */
SharedAccess.defaultProps = {
    "data-componentid": "application-shared-access"
};
