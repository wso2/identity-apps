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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, CopyInputField } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Form, Grid, ModalProps } from "semantic-ui-react";

export interface HashedClientSecretModalPropsInterface
    extends ModalProps,
    IdentifiableComponentInterface {
    /**
     * Is the modal open
     */
    open: boolean;
    /**
     * ClientId of the application
     */
    clientId?: string;
    /**
     * ClientSecret of the application
     */
    clientSecret?: string;
    /**
     * Callback when the primary button is clicked.
     */
    onPrimaryClick: () => void;
}

export const HashedClientSecretModal: FunctionComponent<HashedClientSecretModalPropsInterface> = (
    props: HashedClientSecretModalPropsInterface
) => {
    const {
        clientId,
        clientSecret,
        open,
        onPrimaryClick,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            data-componentid={ `${ componentId }-client-secret-hash-disclaimer-modal` }
            type="warning"
            open={ open }
            primaryAction={ t("common:confirm") }
            onPrimaryActionClick={ () => onPrimaryClick() }
        >
            <ConfirmationModal.Header
                data-componentid={ `${ componentId }-client-secret-hash-disclaimer-modal-header` }
            >
                {
                    t("console:develop.features.applications.confirmations.clientSecretHashDisclaimer" +
                        ".modal.header")
                }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-componentid={ `${ componentId }-client-secret-hash-disclaimer-modal-message` }
            >
                {
                    t("console:develop.features.applications.confirmations.clientSecretHashDisclaimer" +
                        ".modal.message")
                }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-componentid={ `${ componentId }-client-secret-hash-disclaimer-modal-content` }
            >
                <Form>
                    <Grid.Row>
                        <Grid.Column>
                            <Form.Field>
                                <label>
                                    {
                                        t("console:develop.features.applications.confirmations." +
                                            "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.label")
                                    }
                                </label>
                                <CopyInputField
                                    value={ clientId }
                                    hideSecretLabel={
                                        t("console:develop.features.applications.confirmations." +
                                            "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.hide")
                                    }
                                    showSecretLabel={
                                        t("console:develop.features.applications.confirmations." +
                                            "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.show")
                                    }
                                    data-componentid={ `${ componentId }-client-secret-readonly-input` }
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>
                                    {
                                        t("console:develop.features.applications.confirmations." +
                                            "clientSecretHashDisclaimer.forms.clientIdSecretForm." +
                                            "clientSecret.label")
                                    }
                                </label>
                                <CopyInputField
                                    secret
                                    value={ clientSecret }
                                    hideSecretLabel={
                                        t("console:develop.features.applications.confirmations." +
                                            "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientSecret.hide")
                                    }
                                    showSecretLabel={
                                        t("console:develop.features.applications.confirmations." +
                                            "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientSecret.show")
                                    }
                                    data-componentid={ `${ componentId }-client-secret-readonly-input` }
                                />
                            </Form.Field>
                        </Grid.Column>
                    </Grid.Row>
                </Form>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

/**
 * Default props for the component.
 */
HashedClientSecretModal.defaultProps = {
    "data-componentid": "hashed-client-secret-modal"
};
