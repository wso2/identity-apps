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

import { AlertLevels, Certificate, DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import { X509, zulutodate } from "jsrsasign";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { CertificateSummary } from "./wizard";
import { UploadCertificate } from "../../core";
import { createKeystoreCertificate } from "../api";
import { getImportCertificateWizardStepIcons } from "../configs";

/**
 * Prop types of the `ImportCertificate` component.
 */
interface ImportCertificatePropsInterface extends TestableComponentInterface {
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

    const {
        open,
        onClose,
        update,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ data, setData ] = useState<Certificate>(null);
    const [ currentWizardStep, setCurrentWizardStep ] = useState(0);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ name, setName ] = useState("");
    const [ fileDecoded, setFileDecoded ] = useState("");
    const [ pem, setPem ] = useState("");
    const [ file, setFile ] = useState<File>(null);
    const [ certificate, setCertificate ] = useState<X509>(null);

    const [ firstStep, setFirstStep ] = useTrigger();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

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
                description: t("console:manage.features.certificates.keystore.notifications." +
                    "addCertificate.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.certificates.keystore.notifications." +
                    "addCertificate.success.message")
            }));
            update();
            onClose();
        }).catch(error => {
            setAlert({
                description: error?.response?.data?.description
                    || t("console:manage.features.certificates.keystore.notifications." +
                        "addCertificate.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.response?.data?.message
                    || t("console:manage.features.certificates.keystore.notifications." +
                        "addCertificate.genericError.message")
            });
        });
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
     * @param {X509} forgeCertificate The X509 certificate object.
     */
    const onSubmitFirstStep = (
        data: Certificate,
        name: string,
        pem: string,
        fileDecoded: string,
        file: File,
        forgeCertificate: X509
    ): void => {
        setData(data);
        setName(name);
        setPem(pem);
        setFileDecoded(fileDecoded);
        setFile(file);
        setCertificate(forgeCertificate);
        decodeCertificate(data, forgeCertificate);
    };

    /**
     * This serializes the certificate object.
     *
     * @param {Certificate} data The data object containing the alias and the PEM string.
     * @param {X509} certificateForge The X509 Certificate object.
     */
    const decodeCertificate = (data: Certificate, cert: X509): void => {
        const displayCertificate: DisplayCertificate = {
            alias: data.alias,
            issuerDN: cert.getIssuerString().split("/").slice(1)
                .map(attribute => {
                    return {
                        [ attribute.split("=")[ 0 ] ]: attribute.split("=")[ 1 ]
                    };
                }),
            serialNumber: cert.getSerialNumberHex(),
            subjectDN: cert.getSubjectString().split("/").slice(1)
                .map(attribute => {
                    return {
                        [ attribute.split("=")[ 0 ] ]: attribute.split("=")[ 1 ]
                    };
                }),
            validFrom: new Date(zulutodate(cert.getNotBefore()).toUTCString()),
            validTill: new Date(zulutodate(cert.getNotAfter()).toUTCString()),
            version: cert.getVersion()
        };

        setCertificateDisplay(displayCertificate);
    };

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
                    data-testid={ `${ testId }-upload` }
                />
            ),
            icon: getImportCertificateWizardStepIcons().general,
            title: t("console:develop.features.certificates.keystore.wizard.steps.upload")
        },
        {
            content: (
                <CertificateSummary
                    name={ data?.alias }
                    certificate={ certificateDisplay }
                    data-testid={ `${ testId }-summary` }
                />
            ),
            icon: getImportCertificateWizardStepIcons().general,
            title: t("console:develop.features.certificates.keystore.wizard.steps.summary")

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
    };

    /**
     * Moves to the previous step in the wizard
     */
    const previous = (): void => {
        setCurrentWizardStep(currentWizardStep - 1);
    };

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
            data-testid={ `${ testId }-modal` }
            closeOnDimmerClick={ false }
        >
            <Modal.Header className="wizard-header">
                { t("console:manage.features.certificates.keystore.wizard.header")}
            </Modal.Header>
            <Modal.Content className="steps-container" data-testid={ `${ testId }-steps` }>
                <Steps.Group
                    header="Import certificate into keystore."
                    current={ currentWizardStep }
                >
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                            data-testid={ `${ testId }-step-${ index }` }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content >
            <Modal.Content>
                { alert && alertComponent }
            </Modal.Content>
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
                            <LinkButton floated="left" onClick={ () => onClose() }>{t("common:cancel")}</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    { t("common:next") } <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    data-testid={ `${ testId }-import-button` }
                                >
                                    { t("common:import") }
                                </PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ previous }
                                    data-testid={ `${ testId }-previous-button` }
                                >
                                    <Icon name="arrow left" /> { t("common:previous") }
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
ImportCertificate.defaultProps = {
    "data-testid": "import-certificate-wizard"
};
