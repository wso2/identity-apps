/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TestableComponentInterface } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import { AddApplicationCertificateFormComponent } from "./add-certificate-form";
import { getAddIDPCertificateWizardStepIcons } from "../../../../identity-providers/configs/ui";

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
 * @param props - Props injected to the component.
 * @returns Add application certificate wizard form component.
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
    const STEPS: {
        content: JSX.Element;
        icon: any;
        title: string;
    }[] = [
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
