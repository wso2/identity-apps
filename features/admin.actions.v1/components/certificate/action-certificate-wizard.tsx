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

import { AddCertificateFormComponent } from "@wso2is/admin.core.v1/components/add-certificate-form";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import updateAction from "../../api/update-action";
import { ActionsConstants } from "../../constants/actions-constants";
import { PreUpdatePasswordActionUpdateInterface } from "../../models/actions";
import { useHandleError, useHandleSuccess } from "../../util/alert-util";

/**
 * Interface for the action certificate wizard component props.
 */
interface ActionCertificateWizardPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback to close the wizard.
     */
    closeWizard: () => void;
    /**
     * Callback to update the PEM value.
     */
    updatePEMValue: (value: string) => void;
    /**
     * Callback to update the submit state.
     */
    updateSubmit: (value: boolean) => void;
    /**
     * The current PEM value.
     */
    currentPEMValue: string;
    /**
     * Indicates if the form is in creation mode.
     */
    isCreateFormState: boolean;
     /**
     * The API path for the action type.
     */
    actionTypeApiPath: string;
    /**
     * The ID of the action.
     */
    actionId: string;
}

/**
 *  Action certificate wizard component.
 *
 * @param props - Props injected to the component.
 * @returns Action certificate wizard component.
 */
export const ActionCertificateWizard: FunctionComponent<ActionCertificateWizardPropsInterface> = ({
    closeWizard,
    updatePEMValue,
    updateSubmit,
    currentPEMValue,
    isCreateFormState,
    actionTypeApiPath,
    actionId,
    ["data-componentid"]: _componentId = "action-certificate-wizard"
}: ActionCertificateWizardPropsInterface ): ReactElement => {

    const { t } = useTranslation();

    const handleSuccess: (operation: string) => void = useHandleSuccess();
    const handleError: (error: AxiosError, operation: string) => void = useHandleError();

    const [ finishSubmit, setFinishSubmit ] = useTrigger();
    const [ triggerUpload, setTriggerUpload ] = useTrigger();

    const [ showFinishButton, setShowFinishButton ] = useState<boolean>(false);
    const [ alert, , alertComponent ] = useWizardAlert();

    /**
     * Set triggers to finish certificate submission.
     */
    const finish = () => {
        setTriggerUpload();
        setFinishSubmit();
    };

    /**
     * Handles the final wizard submission.
     */
    const handleWizardFormFinish = (value: string): void => {

        if(!isCreateFormState) {

            const updatingValues: PreUpdatePasswordActionUpdateInterface = {
                passwordSharing: {
                    certificate: value
                }
            };

            updateSubmit(true);
            updateAction(actionTypeApiPath, actionId, updatingValues)
                .then(() => {
                    if (currentPEMValue) {
                        handleSuccess(ActionsConstants.CHANGE_CERTIFICATE);
                    }else {
                        handleSuccess(ActionsConstants.ADD_CERTIFICATE);
                    }
                })
                .catch((error: AxiosError) => {
                    if (currentPEMValue) {
                        handleError(error, ActionsConstants.CHANGE_CERTIFICATE);
                    }else {
                        handleError(error, ActionsConstants.ADD_CERTIFICATE);
                    }
                })
                .finally(() => {
                    updateSubmit(false);
                });
        }
        updatePEMValue(value);
        closeWizard();
    };

    return (
        <Modal
            open={ true }
            className="wizard action-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            data-componentid={ _componentId }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { isCreateFormState
                    ? t("actions:certificateWizard.add.heading")
                    : currentPEMValue
                        ? t("actions:certificateWizard.change.heading")
                        : t("actions:certificateWizard.add.heading")
                }
                <Heading as="h6">
                    { isCreateFormState
                        ? t("actions:certificateWizard.add.subHeading")
                        : currentPEMValue
                            ? t("actions:certificateWizard.change.subHeading")
                            : t("actions:certificateWizard.add.subHeading")
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                <AddCertificateFormComponent
                    triggerCertificateUpload={ triggerUpload }
                    triggerSubmit={ finishSubmit }
                    onSubmit= { handleWizardFormFinish }
                    setShowFinishButton={ setShowFinishButton }
                    data-componentid={ `${_componentId}-add-certificate-form` }
                />
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                                data-componentid={ `${_componentId}-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                disabled={ !showFinishButton }
                                floated="right"
                                onClick={ finish }
                                data-componentid={ `${_componentId}-finish-button` }
                            >
                                { t("common:finish") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

export default ActionCertificateWizard;
