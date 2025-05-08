import React, { useState } from "react";
import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import { Trans } from "react-i18next";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { Heading, LinkButton } from "@wso2is/react-components";
import ApplicationShareStatusWizard from "./wizard/application-share-status-wizard";
import { Grid } from "semantic-ui-react";
import { ApplicationShareStatus } from "../constants/application-management";

interface Props {
    status: ApplicationShareStatus;
    sharingOperationId?: string;
}

export const OperationStatusBanner: React.FC<Props> = ({ status, sharingOperationId }) => {
    if (status == ApplicationShareStatus.IDLE || status == ApplicationShareStatus.SUCCESS) return null;

    const isFailure = status === ApplicationShareStatus.PARTIALLY_COMPLETED || status === ApplicationShareStatus.FAILED;
    const [ showStatusModal, setShowStatusModal ] = useState(false);
    const [ componentId, SetComponentId ] = useState();

    const handleShowStatusModal = () => {
        setShowStatusModal(true);
    };
    const handleHideStatusModal = () => {
        setShowStatusModal(false);
    };

    return (

        <div className="banner-wrapper">
            { status === ApplicationShareStatus.IN_PROGRESS && (
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
                            <ApplicationShareStatusWizard
                                componentId="wizard1"
                                operationId={sharingOperationId}
                                isSubmitting={true}
                                isLoading={true}
                                hasError={false}
                            />
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
                                        onClick={ () => { handleHideStatusModal(); } }
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
        </div>
    );
};
