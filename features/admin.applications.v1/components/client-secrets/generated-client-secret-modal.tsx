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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ConfirmationModal, CopyInputField } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { ClientSecretInterface } from "../../models/application-inbound";

/**
 * Props for the generated client secret modal component.
 */
interface GeneratedClientSecretModalPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the modal is open.
     */
    open: boolean;
    /**
     * The newly generated client secret to display once.
     */
    secret: ClientSecretInterface;
    /**
     * Client ID of the application, displayed alongside the generated secret.
     */
    clientId?: string;
    /**
     * Callback fired when the modal is dismissed.
     */
    onClose: () => void;
}

/**
 * One-time reveal of a newly generated client secret value.
 *
 * @param props - Props injected to the component.
 * @returns Generated client secret modal.
 */
const GeneratedClientSecretModal: FunctionComponent<GeneratedClientSecretModalPropsInterface> = (
    props: GeneratedClientSecretModalPropsInterface
): ReactElement => {

    const {
        open,
        secret,
        clientId,
        onClose,
        [ "data-componentid" ]: componentId = "generated-client-secret-modal"
    } = props;

    const { t } = useTranslation();

    return (
        <ConfirmationModal
            type="warning"
            open={ open }
            primaryAction={ t("common:confirm") }
            onPrimaryActionClick={ onClose }
            onClose={ onClose }
            data-componentid={ componentId }
        >
            <ConfirmationModal.Header data-componentid={ `${ componentId }-header` }>
                { t("applications:confirmations.clientSecretHashDisclaimer.modal.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-componentid={ `${ componentId }-message` }
            >
                { t("applications:confirmations.clientSecretHashDisclaimer.modal.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${ componentId }-content` }>
                <Form>
                    { clientId && (
                        <Form.Field>
                            <label>
                                { t("applications:confirmations.clientSecretHashDisclaimer.forms." +
                                    "clientIdSecretForm.clientId.label") }
                            </label>
                            <CopyInputField
                                value={ clientId }
                                data-componentid={ `${ componentId }-client-id` }
                            />
                        </Form.Field>
                    ) }
                    <Form.Field>
                        <label>
                            { t("applications:confirmations.clientSecretHashDisclaimer.forms." +
                                "clientIdSecretForm.clientSecret.label") }
                        </label>
                        <CopyInputField
                            secret
                            value={ secret?.secretValue }
                            hideSecretLabel={ t("applications:confirmations.clientSecretHashDisclaimer.forms." +
                                "clientIdSecretForm.clientSecret.hide") }
                            showSecretLabel={ t("applications:confirmations.clientSecretHashDisclaimer.forms." +
                                "clientIdSecretForm.clientSecret.show") }
                            data-componentid={ `${ componentId }-value` }
                        />
                    </Form.Field>
                </Form>
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );
};

export default GeneratedClientSecretModal;
