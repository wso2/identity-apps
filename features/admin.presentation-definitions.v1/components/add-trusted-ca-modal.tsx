/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { getCertificateIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Form } from "@wso2is/forms";
import {
    CertFileStrategy,
    FilePicker,
    Heading,
    LinkButton,
    PickerResult,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import React, { FC, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Modal } from "semantic-ui-react";

interface AddTrustedCaModalProps extends IdentifiableComponentInterface {
    existingCertPems: string[];
    onAdd: (pemBase64: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const FORM_ID: string = "add-trusted-ca-modal-form";
const I18N_PREFIX: string = "presentationDefinitions:editPage.issuerTrust.trustedCas.addModal";

/**
 * Modal for staging a trusted CA certificate to local state.
 * No API call is made — the parent commits everything via the Update button.
 */
export const AddTrustedCaModal: FC<AddTrustedCaModalProps> = (props): ReactElement => {

    const {
        ["data-componentid"]: componentId = "add-trusted-ca-modal",
        existingCertPems,
        onAdd,
        isOpen,
        onClose
    } = props;

    const { t } = useTranslation();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const [ pemBase64String, setPemBase64String ] = useState<string>("");
    const [ submitShouldBeDisabled, setSubmitShouldBeDisabled ] = useState<boolean>(true);

    const onCertificateChange = (result: PickerResult<string | File>): void => {
        try {
            const pem: string = result.serialized?.pem ?? "";

            setPemBase64String(pem ? btoa(pem) : "");
            setSubmitShouldBeDisabled(!pem || !result.valid);
        } catch (error) {
            setAlert({
                description: error?.message,
                level: AlertLevels.ERROR,
                message: t("common:somethingWentWrong")
            });
        }
    };

    const handleAdd = (): void => {
        if (existingCertPems.includes(pemBase64String)) {
            setAlert({
                description: t(`${ I18N_PREFIX }.duplicateError.description`),
                level: AlertLevels.ERROR,
                message: t(`${ I18N_PREFIX }.duplicateError.message`)
            });


            return;
        }

        onAdd(pemBase64String);
        onClose();
    };

    return (
        <Modal
            className="certificate-display"
            dimmer="blurring"
            size="tiny"
            open={ isOpen }
            onClose={ onClose }
            data-componentid={ `${ componentId }-view-certificate-modal` }
        >
            <Modal.Header className="wizard-header">
                { t(`${ I18N_PREFIX }.header`) }
                <Heading as="h6">
                    { t(`${ I18N_PREFIX }.subheading`) }
                </Heading>
            </Modal.Header>

            <Modal.Content className="content-container">
                { alert && alertComponent }
                <Form id={ FORM_ID } onSubmit={ () => ({ /*No Operations*/ }) } uncontrolledForm={ true }>
                    <FilePicker
                        key={ 1 }
                        fileStrategy={ new CertFileStrategy() }
                        normalizeStateOnRemoveOperations={ true }
                        onChange={ onCertificateChange }
                        uploadButtonText={ t(`${ I18N_PREFIX }.uploadButtonText`) }
                        dropzoneText={ t(`${ I18N_PREFIX }.dropzoneText`) }
                        pasteAreaPlaceholderText={ t(`${ I18N_PREFIX }.pasteAreaPlaceholderText`) }
                        icon={ getCertificateIllustrations().uploadPlaceholder }
                        placeholderIcon={ <Icon name="file alternate" size="huge" /> }
                        data-componentid={ `${ componentId }-form-wizard--pem-certificate` }
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ onClose }
                                data-componentid={ `${ componentId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                disabled={ submitShouldBeDisabled }
                                floated="right"
                                onClick={ handleAdd }
                                data-componentid={ `${ componentId }-finish-button` }
                            >
                                { t("common:add") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

