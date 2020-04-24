/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import * as forge from "node-forge";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { CertificateSummary } from "./certificate-summary";
import { UploadCertificate } from "./upload-certificate";
import { createKeystoreCertificate } from "../../api";
import { ApplicationWizardStepIcons } from "../../configs";
import { AlertLevels, Certificate, DisplayCertificate } from "../../models";

/**
 * Prop types of the `ImportCertificate` component.
 */
interface ImportCertificatePropsInterface {
    /**
     * Specifies if the modal should be opened or not.
     */
    open: boolean;
    /**
     * Called when the modal is closed.
     */
    onClose: () => void;
    /**
     * Calls update on the parent component.
     */
    update: () => void;
}

/**
 * This renders the import certificate wizard.
 * 
 * @param {ImportCertificatePropsInterface} props
 * 
 * @returns {ReactElement}
 */
export const ImportCertificate: FunctionComponent<ImportCertificatePropsInterface> = (
    props: ImportCertificatePropsInterface
): ReactElement => {

    const { open, onClose, update } = props;

    const dispatch = useDispatch();

    const [ data, setData ] = useState<Certificate>(null);
    const [ currentWizardStep, setCurrentWizardStep ] = useState(0);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ name, setName ] = useState("");
    const [ fileDecoded, setFileDecoded ] = useState("");
    const [ pem, setPem ] = useState("");
    const [ file, setFile ] = useState<File>(null);
    const [ certificate, setCertificate ] = useState<forge.pki.Certificate>(null);
    const [ firstStep, setFirstStep ] = useTrigger();

    /**
     * Moves to the next step once the certificate display state is set.
     */
    useEffect(() => {
        if (certificateDisplay) {
            setCurrentWizardStep(1);
        }
    }, [ certificateDisplay ]);

    /**
     * Imports the certificate.
     */
    const handleSubmit = (): void => {
        createKeystoreCertificate(data).then(() => {
            dispatch(addAlert({
                description: "The certificate has been imported successfully.",
                level: AlertLevels.SUCCESS,
                message: "Certificate import success"
            }));
            update();
            onClose();
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description || "An error occurred while importing the certificate.",
                level: AlertLevels.ERROR,
                message: error?.message || "Something went wrong!"
            }));
        })
    };

    /**
     * This is called when the first step is submitted.
     * It stores
     *      1. the data returned by the first step to be posted.
     *      2. the state of the first step component 
     *       so that they can be sent back if previous is clicked.
     * 
     * @param {Certificate} data The alias and the PEM-encoded certificate string.
     * @param {string} name The alias of the certificate.
     * @param {string} pem The PEM-encoded string.
     * @param {string} fileDecoded The decoded `.cer` file content.
     * @param {File} file The File object.
     * @param {forge.pki.Certificate} forgeCertificate The forge certificate object.
     */
    const onSubmitFirstStep = (
        data: Certificate,
        name: string,
        pem: string,
        fileDecoded: string,
        file: File,
        forgeCertificate: forge.pki.Certificate
    ): void => {
        setData(data);
        setName(name);
        setPem(pem);
        setFileDecoded(fileDecoded);
        setFile(file);
        setCertificate(forgeCertificate);
        decodeCertificate(data, forgeCertificate);
    }

    /**
     * This serializes the certificate object.
     * 
     * @param {Certificate} data The data object containing the alias and the PEM string.
     * @param {forge.pki.Certificate} certificateForge The Forge Certificate object.
     */
    const decodeCertificate = (data: Certificate, certificateForge: forge.pki.Certificate): void => {
        const displayCertificate: DisplayCertificate = {
            alias: data.alias,
            issuerDN: certificateForge.issuer.attributes
                .map(attribute => {
                    return {
                        [ attribute.shortName ]: attribute.value
                    }
                }),
            serialNumber: certificateForge.serialNumber,
            subjectDN: certificateForge.subject.attributes
                .map(attribute => {
                    return {
                        [ attribute.shortName ]: attribute.value
                    }
                }),
            validFrom: certificateForge.validity.notBefore,
            validTill: certificateForge.validity.notAfter,
            version: certificateForge.version
        };

        setCertificateDisplay(displayCertificate);
    }

    /**
     * This contains the wizard steps
     */
    const STEPS = [
        {
            content: (
                <UploadCertificate
                    submit={ onSubmitFirstStep }
                    triggerSubmit={ firstStep }
                    pemData={ pem }
                    nameData={ name }
                    fileDecodedData={ fileDecoded }
                    fileData={ file }
                    forgeCertificateData={ certificate }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Upload certificate"
        },
        {
            content: (
                <CertificateSummary name={ data?.alias } certificate={ certificateDisplay } />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Summary"

        }
    ];

    /**
     * Moves to the next step in the wizard
     */
    const next = (): void => {
        switch (currentWizardStep) {
            case 0:
                setFirstStep();
                break;
            case 1:
                handleSubmit();
                break;
        }
    }

    /**
     * Moves to the previous step in the wizard
     */
    const previous = (): void => {
        setCurrentWizardStep(currentWizardStep - 1);
    }

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
        >
            <Modal.Header className="wizard-header">
                Import certificate
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    header="Import certificate into keystore."
                    current={ currentWizardStep }
                >
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content >
            <Modal.Content
                className={ `content-container ${currentWizardStep === 1 ? "certificate-content summary" : ""}` }
                scrolling
            >
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Next <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Import</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ previous }>
                                    <Icon name="arrow left" /> Previous
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    )
};
