/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal } from "semantic-ui-react";
import { AddIDPCertificateFormComponent } from "./steps/add-certificate-form";
import { updateIDPCertificate } from "../../api/connections";
import { getConnectionWizardStepIcons } from "../../configs/ui";
import { ConnectionInterface } from "../../models/connection";

/**
 * Interface for the Add Idp certificate wizard component props.
 */
interface AddIDPCertificateWizardPropsInterface extends TestableComponentInterface {
    idp: ConnectionInterface;
    closeWizard: () => void;
    currentStep?: number;
    onUpdate: (id: string) => void;
}

/**
 *  Add Idp certificate wizard form component.
 *
 * @param props - Props injected to the component.
 */
export const AddIDPCertificateWizard: FunctionComponent<AddIDPCertificateWizardPropsInterface> = (
    props: AddIDPCertificateWizardPropsInterface): ReactElement => {

    const {
        idp,
        closeWizard,
        currentStep,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch : Dispatch = useDispatch();

    const [ finishSubmit, setFinishSubmit ] = useTrigger();
    const [ triggerUpload, setTriggerUpload ] = useTrigger();

    const [ partiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

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
        if (idp?.certificate?.certificates?.includes(values["certificate"])) {
            dispatch(addAlert({
                description: t("authenticationProvider:" +
                    "notifications.duplicateCertificateUpload.error" +
                    ".description", { idp: idp.name }),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:" +
                    "notifications.duplicateCertificateUpload.error.message")
            }));
            closeWizard();

            return;
        }

        let data: { operation: string; path: string; value: any; }[];
        const certificateIndex: number = idp?.certificate?.certificates ? idp?.certificate?.certificates?.length : 0;

        if (idp?.certificate?.jwksUri) {
            data = [
                {
                    "operation": "ADD",
                    "path": "/certificate/certificates/" + certificateIndex,
                    "value": values["certificate"]
                },
                {
                    "operation": "REPLACE",
                    "path": "/certificate/jwksUri",
                    "value": null
                }
            ];
        } else {
            data = [
                {
                    "operation": "ADD",
                    "path": "/certificate/certificates/" + certificateIndex,
                    "value": values["certificate"]
                }
            ];
        }

        setIsSubmitting(true);

        updateIDPCertificate(idp.id, data)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateIDPCertificate.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:" +
                        "notifications.updateIDPCertificate.success.message")
                }));
                closeWizard();
                onUpdate(idp.id);
            })
            .catch((error:IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:" +
                            "notifications.updateIDPCertificate.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("authenticationProvider:" +
                        "notifications.updateIDPCertificate.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:" +
                        "notifications.updateIDPCertificate.genericError.message")
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
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
    const STEPS : {
                    content: JSX.Element;
                    icon: any;
                        title: string;
                    }[] = [
                        {
                            content: (
                                <AddIDPCertificateFormComponent
                                    triggerCertificateUpload={ triggerUpload }
                                    triggerSubmit={ finishSubmit }
                                    onSubmit={ handleWizardFormFinish }
                                />
                            ),
                            icon: getConnectionWizardStepIcons().general,
                            title: t("certificates:keystore.wizard.steps.upload")
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
                { t("authenticationProvider:modals.addCertificate.title",
                    { idpName: idp.name }) }
                <Heading as="h6">
                    { t("authenticationProvider:modals.addCertificate.subTitle") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    current={ currentWizardStep }
                    data-testid={ `${ testId }-steps` }
                >
                    { STEPS.map((step : {
                                            content: JSX.Element;
                                            icon: any;
                                            title: string;
                                        } , index : number) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                            data-testid={ `${ testId }-step-${ index }` }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                                data-testid={ `${ testId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ navigateToNext }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                    data-testid={ `${ testId }-finish-button` }
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
 * Default props for the outbound provisioning IDP create wizard.
 */
AddIDPCertificateWizard.defaultProps = {
    currentStep: 0,
    "data-testid": "add-idp-certificate-wizard"
};
