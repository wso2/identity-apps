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

import { AddCertificateFormComponent } from "@wso2is/admin.core.v1/components/add-certificate-form";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";

interface AddIssuerCertificateModalPropsInterface extends IdentifiableComponentInterface {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (pem: string) => void;
}

/**
 * Modal that wraps the standard certificate upload/paste widget
 * for configuring an issuer PEM certificate on a presentation definition.
 */
export const AddIssuerCertificateModal: FunctionComponent<AddIssuerCertificateModalPropsInterface> = ({
    isOpen,
    onClose,
    onAdd,
    "data-componentid": componentId = "add-issuer-certificate-modal"
}: AddIssuerCertificateModalPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const [ triggerUpload, setTriggerUpload ] = useState<boolean>(false);
    const [ showFinishButton, setShowFinishButton ] = useState<boolean>(false);

    const handleFinish = (): void => {
        setTriggerUpload((prev: boolean) => !prev);
    };

    const handleCertSubmit = (certString: string): void => {
        // AddCertificateFormComponent returns a base64-encoded PEM; decode to raw PEM.
        onAdd(atob(certString));
        onClose();
    };

    return (
        <Modal
            open={ isOpen }
            className="wizard"
            dimmer="blurring"
            size="small"
            onClose={ onClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ componentId }
        >
            <Modal.Header>
                { t("presentationDefinitions:editPage.issuerTrust.issuerPem.modalTitle") }
            </Modal.Header>
            <Modal.Content scrolling>
                <AddCertificateFormComponent
                    triggerCertificateUpload={ triggerUpload }
                    onSubmit={ handleCertSubmit }
                    setShowFinishButton={ setShowFinishButton }
                    data-componentid={ `${componentId}-form` }
                />
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ onClose }
                                data-componentid={ `${componentId}-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                disabled={ !showFinishButton }
                                floated="right"
                                onClick={ handleFinish }
                                data-componentid={ `${componentId}-finish-button` }
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
