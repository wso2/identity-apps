/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import { AddApplicationCertificateFormComponent } from "./add-certificate-form";
import { getAddIDPCertificateWizardStepIcons } from "../../../../identity-providers/configs";

/**
 * Interface for the Add application certificate wizard component props.
 */
interface AddApplicationCertificateWizardPropsInterface extends TestableComponentInterface {
    applicationName?: string;
    closeWizard: () => void;
    currentStep?: number;
    updatePEMValue: (value: string) => void;
}

/**
 *  Add Application certificate wizard form component.
 *
 * @param {AddApplicationCertificateWizard} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AddApplicationCertificateWizard: FunctionComponent<AddApplicationCertificateWizardPropsInterface> = (
    props: AddApplicationCertificateWizardPropsInterface): ReactElement => {

    const {
        closeWizard,
        currentStep,
        updatePEMValue,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

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

    const navigateToNext = () => {
        switch (currentWizardStep) {
            case 0:
                setTriggerUpload();
                setFinishSubmit();
        }
    };

    const addCertificate = (values: any) => {
        updatePEMValue(values);
        closeWizard();
    };

    /**
     * Handles the final wizard submission.
     */
    const handleWizardFormFinish = (values: any): void => {
        addCertificate(values);
    };

    /**
     * This contains the wizard steps
     */
    const STEPS = [
        {
            content: (
                <AddApplicationCertificateFormComponent
                    triggerCertificateUpload={ triggerUpload }
                    triggerSubmit={ finishSubmit }
                    onSubmit={ handleWizardFormFinish }
                    setShowFinishButton={ setShowFinishButton }
                />
            ),
            icon: getAddIDPCertificateWizardStepIcons().general,
            title: t("console:manage.features.certificates.keystore.wizard.steps.upload")
        }
    ];

    return (
        <Modal
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            data-testid={ testId }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("console:develop.features.applications.wizards.applicationCertificateWizard.heading") }
                <Heading as="h6">
                    { t("console:develop.features.applications.wizards.applicationCertificateWizard.subHeading") }
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
                                data-testid={ `${testId}-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    disabled={ !showFinishButton }
                                    floated="right"
                                    onClick={ navigateToNext }
                                    data-testid={ `${testId}-finish-button` }
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
 * Default props for the add application certificate wizard.
 */
AddApplicationCertificateWizard.defaultProps = {
    currentStep: 0,
    "data-testid": "add-application-certificate-wizard"
};
