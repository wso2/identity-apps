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
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, LinkButton } from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import ApplicationShareStatusWizard from "./wizard/application-share-status-wizard";
import { OperationStatus } from "../constants/application-management";

/**
 * Proptypes for the operation status banner component.
 */
interface OperationStatusBannerPropsInterface extends IdentifiableComponentInterface {
    /**
     * Application share operation status.
     */
    status: OperationStatus;
    /**
     * The operation ID of the share operation.
     */
    sharingOperationId?: string;
}

/**
 * Operation status banner component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Operation status banner component.
 */
export const OperationStatusBanner: React.FC<OperationStatusBannerPropsInterface> = (
    props: OperationStatusBannerPropsInterface
): ReactElement => {
    const { status, sharingOperationId, [ "data-componentid" ]: componentId } = props;
    const [ showStatusModal, setShowStatusModal ] = useState(false);
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    if (status === OperationStatus.FAILED) {
        dispatch(addAlert({
            description: t("applications:edit.sections.shareApplication.completedSharingNotification."
                + "failure.description"),
            level: AlertLevels.ERROR,
            message: t("applications:edit.sections.shareApplication.completedSharingNotification."
                + "failure.message")
        }));
    } else if (status === OperationStatus.SUCCESS) {
        dispatch(addAlert({
            description: t("applications:edit.sections.shareApplication.completedSharingNotification."
                + "success.description"),
            level: AlertLevels.SUCCESS,
            message: t("applications:edit.sections.shareApplication.completedSharingNotification."
                + "success.message")
        }));
    } else if (status === OperationStatus.PARTIALLY_COMPLETED) {
        dispatch(addAlert({
            description: t("applications:edit.sections.shareApplication.completedSharingNotification."
                + "partialSuccess.description"),
            level: AlertLevels.WARNING,
            message: t("applications:edit.sections.shareApplication.completedSharingNotification."
                + "partialSuccess.message")
        }));
    }

    const handleShowStatusModal = () => {
        setShowStatusModal(true);
    };
    const handleHideStatusModal = () => {
        setShowStatusModal(false);
    };

    return (

        <div className="banner-wrapper">
            { status === OperationStatus.IN_PROGRESS && (
                <div className="banner-wrapper">
                    <Alert
                        severity="warning"
                    >
                        <AlertTitle className="alert-title">
                            <Trans components={ { strong: <strong/> } } >
                                { t("applications:edit.sections.shareApplication.asyncOperationStatus"
                                    + ".inProgress.heading") }
                            </Trans>
                        </AlertTitle>
                        { t("applications:edit.sections.shareApplication.asyncOperationStatus"
                            + ".inProgress.description") }
                    </Alert>
                </div>
            ) }
            { OperationStatus.PARTIALLY_COMPLETED|| status === OperationStatus.FAILED && (
                <div className="banner-wrapper">
                    <Alert
                        severity="warning"
                        action={
                            (
                                <Box display="flex">
                                    <Button
                                        className="banner-view-hide-details"
                                        onClick={ handleShowStatusModal }>
                                        { t("applications:edit.sections.shareApplication.asyncOperationStatus"
                                            + ".completed.actionText") }
                                    </Button>
                                </Box>
                            )
                        }
                    >
                        <AlertTitle className="alert-title">
                            <Trans components={ { strong: <strong/> } } >
                                { t("applications:edit.sections.shareApplication.asyncOperationStatus"
                                + ".completed.heading") }
                            </Trans>
                        </AlertTitle>
                        { t("applications:edit.sections.shareApplication.asyncOperationStatus"
                            + ".completed.description") }
                    </Alert>
                </div>
            ) }

            <ModalWithSidePanel
                data-testid={ `${ componentId }-modal` }
                data-componentid={ `${ componentId }-modal` }
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
                                componentId={ `${ componentId }-wizard` }
                                operationId={ sharingOperationId }
                                hasError={ false }
                            />
                        </Grid>
                    </ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Actions>
                        <Grid>
                            <Grid.Row column={ 1 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <LinkButton
                                        data-testid={ "-close-button" }
                                        data-componentid={ "-close-button" }
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
