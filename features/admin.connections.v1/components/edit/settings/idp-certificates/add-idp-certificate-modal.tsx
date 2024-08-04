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

import { getCertificateIllustrations } from "@wso2is/admin.core.v1";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Form } from "@wso2is/form";
import {
    CertFileStrategy,
    ContentLoader,
    FilePicker,
    Heading,
    LinkButton,
    PickerResult,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import React, { FC, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { updateIDPCertificate } from "../../../../api/connections";
import { ConnectionInterface } from "../../../../models/connection";

/**
 * Props of {@link AddIdpCertificateModal}
 */
export interface AddIdPCertificateModalV2Props extends IdentifiableComponentInterface {
    currentlyEditingIdP: ConnectionInterface;
    refreshIdP: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const FORM_ID: string = "idp-certificate-add-modal-form";

/**
 * This component is responsible for adding certificates to a given
 * IdP {@link ConnectionInterface}. It can take user input in PEM
 * and Certificate file formats.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AddIdpCertificateModal: FC<AddIdPCertificateModalV2Props> = (props): ReactElement => {

    const {
        ["data-componentid"]: testId,
        isOpen,
        onClose,
        currentlyEditingIdP,
        refreshIdP
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const [ pemBase64String, setPemBase64String ] = useState<string>("");
    const [ submitShouldBeDisabled, setSubmitShouldBeDisabled ] = useState<boolean>(true);
    const [ requestInProgress, setRequestInProgress ] = useState<boolean>(false);

    /**
     * Callback for on certificate change.
     *
     * @param result - Picker results.
     */
    const onCertificateChange = (result: PickerResult<string | File>): void => {
        try {
            setPemBase64String(btoa(result.serialized?.pem ?? ""));
            setSubmitShouldBeDisabled(
                (!result.pastedContent || !result.file) &&
                !result.serialized &&
                !result.valid
            );
        } catch (error) {
            setAlert({
                description: error && error?.message,
                level: AlertLevels.ERROR,
                message: "An unknown error occurred."
            });
        }
    };

    const onWizardFinish = async () => {

        setRequestInProgress(true);

        // Check if the certificate is already in the model.
        if (currentlyEditingIdP?.certificate?.certificates?.includes(pemBase64String)) {
            dispatch(addAlert({
                description: t(
                    "authenticationProvider:notifications" +
                    ".duplicateCertificateUpload.error.description",
                    { idp: currentlyEditingIdP.name }
                ),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:notifications" +
                    ".duplicateCertificateUpload.error.message")
            }));
            setRequestInProgress(false);
            onClose();

            return;
        }

        // If there's one or more certificates server requires which index to
        // be patched or added.
        const certificateIndex: number = currentlyEditingIdP?.certificate?.certificates ?
            currentlyEditingIdP?.certificate?.certificates?.length
            : 0;

        const PATCH_OBJECT = [
            {
                "operation": "ADD",
                "path": "/certificate/certificates/" + certificateIndex,
                "value": pemBase64String
            }
        ];

        const doOnSuccess = () => {
            dispatch(addAlert({
                description: t("authenticationProvider:notifications" +
                    ".updateIDPCertificate.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("authenticationProvider:notifications" +
                    ".updateIDPCertificate.success.message")
            }));
            setRequestInProgress(false);
            onClose();
            refreshIdP(currentlyEditingIdP.id);
        };

        const ifTheresAnyErrors = (error) => {
            if (error.response && error.response.data && error.response.data.description) {
                setAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications" +
                        ".updateIDPCertificate.error.message")
                });
                setRequestInProgress(false);

                return;
            }
            setAlert({
                description: t("authenticationProvider:notifications" +
                    ".updateIDPCertificate.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:notifications" +
                    ".updateIDPCertificate.genericError.message")
            });
            setRequestInProgress(false);
        };

        await updateIDPCertificate(currentlyEditingIdP.id, PATCH_OBJECT)
            .then(doOnSuccess)
            .catch(ifTheresAnyErrors);

    };

    return (
        <Modal
            className="certificate-display"
            dimmer="blurring"
            size="tiny"
            open={ isOpen }
            onClose={ onClose }
            data-testid={ `${ testId }-view-certificate-modal` }>

            <Modal.Header className="wizard-header">
                { t("authenticationProvider:modals.addCertificate.title") }
                <Heading as="h6">
                    { t("authenticationProvider:modals.addCertificate.subTitle", {
                        idpName: currentlyEditingIdP?.name ?? ""
                    }) }
                </Heading>
            </Modal.Header>

            <Modal.Content className="content-container">
                { alert && alertComponent }
                <Form
                    id={ FORM_ID }
                    onSubmit={ () => ({ /*No Operations*/ }) }
                    uncontrolledForm={ true }
                >
                    <FilePicker
                        key={ 1 }
                        fileStrategy={ new CertFileStrategy() }
                        normalizeStateOnRemoveOperations={ true }
                        onChange={ onCertificateChange }
                        uploadButtonText="Upload Certificate File"
                        dropzoneText="Drag and drop a certificate file here."
                        pasteAreaPlaceholderText="Paste IdP certificate in PEM format."
                        icon={ getCertificateIllustrations().uploadPlaceholder }
                        placeholderIcon={ <Icon name="file alternate" size={ "huge" }/> }
                        data-testid={ `${ testId }-form-wizard--pem-certificate` }
                    />
                </Form>
                { requestInProgress && <ContentLoader/> }
            </Modal.Content>

            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ onClose }
                                data-testid={ `${ testId }-cancel-button` }>
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                disabled={ submitShouldBeDisabled || requestInProgress }
                                floated="right"
                                loading={ requestInProgress }
                                onClick={ onWizardFinish }
                                data-testid={ `${ testId }-finish-button` }>
                                { t("common:finish") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>

        </Modal>
    );

};

/**
 * Default properties of {@link AddIdpCertificateModal}
 */
AddIdpCertificateModal.defaultProps = {
    "data-componentid": "add-certificate-modal"
};
