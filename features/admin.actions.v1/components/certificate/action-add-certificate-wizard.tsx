/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { getAddIDPCertificateWizardStepIcons } from "@wso2is/admin.identity-providers.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import updateAction from "../../api/update-action";
import { ActionsConstants } from "../../constants/actions-constants";
import { PreUpdatePasswordActionUpdateInterface } from "../../models/actions";
import { useHandleError, useHandleSuccess } from "../../util/alert-util";

/**
 * Interface for the Add action certificate wizard component props.
 */
interface AddActionCertificateWizardPropsInterface extends IdentifiableComponentInterface {
    closeWizard: () => void;
    currentStep?: number;
    updatePEMValue: (value: string) => void;
    updateSubmit: (value: boolean) => void;
    currentPEMValue: string;
    isCreateFormState: boolean;
    actionTypeApiPath: string;
    actionId: string;
}

/**
 *  Add Action certificate wizard form component.
 *
 * @param props - Props injected to the component.
 * @returns Add action certificate wizard form component.
 */
export const AddActionCertificateWizard: FunctionComponent<AddActionCertificateWizardPropsInterface> = (
    props: AddActionCertificateWizardPropsInterface): ReactElement => {

    const {
        closeWizard,
        currentStep,
        updatePEMValue,
        updateSubmit,
        currentPEMValue,
        isCreateFormState,
        actionTypeApiPath,
        actionId,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const handleSuccess: (operation: string) => void = useHandleSuccess();
    const handleError: (error: AxiosError, operation: string) => void = useHandleError();

    const [ finishSubmit, setFinishSubmit ] = useTrigger();
    const [ triggerUpload, setTriggerUpload ] = useTrigger();

    const [ partiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ showFinishButton, setShowFinishButton ] = useState<boolean>(false);
    const [ alert, , alertComponent ] = useWizardAlert();

    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change , and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentWizardStep - 1);
    }, [ partiallyCompletedStep ]);

    const finish = () => {
        switch (currentWizardStep) {
            case 0:
                setTriggerUpload();
                setFinishSubmit();
        }
    };

    /**
     * Handles the final wizard submission.
     */
    const handleWizardFormFinish = (values: any): void => {
        updatePEMValue(values);

        if(!isCreateFormState) {

            const updatingValues: PreUpdatePasswordActionUpdateInterface = {
                passwordSharing: {
                    certificate: values
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

        closeWizard();
    };

    /**
     * This contains the wizard steps
     */
    const STEPS: {
        content: JSX.Element;
        icon: any;
        title: string;
    }[] = [
        {
            content: (
                <AddCertificateFormComponent
                    triggerCertificateUpload={ triggerUpload }
                    triggerSubmit={ finishSubmit }
                    onSubmit= { handleWizardFormFinish }
                    setShowFinishButton={ setShowFinishButton }
                />
            ),
            icon: getAddIDPCertificateWizardStepIcons().general,
            title: t("certificates:keystore.wizard.steps.upload")
        }
    ];

    return (
        <Modal
            open={ true }
            className="wizard action-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            data-componentid={ componentId }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("actions:certificateWizard.heading") }
                <Heading as="h6">
                    { t("actions:certificateWizard.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { STEPS[currentWizardStep].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                                data-componentid={ `${componentId}-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    disabled={ !showFinishButton }
                                    floated="right"
                                    onClick={ finish }
                                    data-componentid={ `${componentId}-finish-button` }
                                >
                                    { t("common:finish") }
                                </PrimaryButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the add action certificate wizard.
 */
AddActionCertificateWizard.defaultProps = {
    currentStep: 0,
    "data-componentid": "add-action-certificate-wizard"
};
