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

import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, Form } from "@wso2is/forms";
import { Heading, LinkButton, Message, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import { createClientSecret } from "../../api/application";
import { ClientSecretExpirationOption, ClientSecretInterface } from "../../models/application-inbound";

const FORM_ID: string = "generate-client-secret-form";
const SECONDS_PER_DAY: number = 24 * 60 * 60;
const CUSTOM_EXPIRY_MIN_DAYS: number = 1;
const CUSTOM_EXPIRY_MAX_DAYS: number = 3650;

/**
 * Shape of the generate client secret form values.
 */
interface GenerateClientSecretFormValues {
    expiration: ClientSecretExpirationOption;
    customExpiryDays?: string;
}

/**
 * Props for the generate client secret modal component.
 */
interface GenerateClientSecretModalPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the modal is open.
     */
    open: boolean;
    /**
     * ID of the application.
     */
    appId: string;
    /**
     * Maximum number of client secrets allowed, shown in the limit-reached message.
     */
    maxCount: number;
    /**
     * Callback fired with the created secret once generation succeeds.
     */
    onGenerated: (secret: ClientSecretInterface) => void;
    /**
     * Callback fired when the modal is dismissed.
     */
    onCancel: () => void;
}

/**
 * Modal to generate a new OAuth2/OIDC client secret.
 *
 * @param props - Props injected to the component.
 * @returns Generate client secret modal.
 */
const GenerateClientSecretModal: FunctionComponent<GenerateClientSecretModalPropsInterface> = (
    props: GenerateClientSecretModalPropsInterface
): ReactElement => {

    const {
        open,
        appId,
        maxCount,
        onGenerated,
        onCancel,
        [ "data-componentid" ]: componentId = "generate-client-secret-modal"
    } = props;

    const { t } = useTranslation();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const formRef: React.MutableRefObject<any> = useRef(null);

    const [ selectedExpiration, setSelectedExpiration ] = useState<ClientSecretExpirationOption>(
        ClientSecretExpirationOption.THIRTY_DAYS
    );
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const expirationOptions: { key: string; text: string; value: string }[] = [
        {
            key: ClientSecretExpirationOption.THIRTY_DAYS,
            text: t("applications:clientSecrets.wizard.expiration.options.days", { count: 30 }),
            value: ClientSecretExpirationOption.THIRTY_DAYS
        },
        {
            key: ClientSecretExpirationOption.SIXTY_DAYS,
            text: t("applications:clientSecrets.wizard.expiration.options.days", { count: 60 }),
            value: ClientSecretExpirationOption.SIXTY_DAYS
        },
        {
            key: ClientSecretExpirationOption.NINETY_DAYS,
            text: t("applications:clientSecrets.wizard.expiration.options.days", { count: 90 }),
            value: ClientSecretExpirationOption.NINETY_DAYS
        },
        {
            key: ClientSecretExpirationOption.ONE_EIGHTY_DAYS,
            text: t("applications:clientSecrets.wizard.expiration.options.days", { count: 180 }),
            value: ClientSecretExpirationOption.ONE_EIGHTY_DAYS
        },
        {
            key: ClientSecretExpirationOption.CUSTOM,
            text: t("applications:clientSecrets.wizard.expiration.options.custom"),
            value: ClientSecretExpirationOption.CUSTOM
        },
        {
            key: ClientSecretExpirationOption.NO_EXPIRATION,
            text: t("applications:clientSecrets.wizard.expiration.options.neverExpire"),
            value: ClientSecretExpirationOption.NO_EXPIRATION
        }
    ];

    const resolveExpiresAt = (values: GenerateClientSecretFormValues): number | undefined => {
        const nowInSeconds: number = Math.floor(Date.now() / 1000);

        switch (values.expiration) {
            case ClientSecretExpirationOption.NO_EXPIRATION:
                return undefined;
            case ClientSecretExpirationOption.CUSTOM:
                return nowInSeconds + Number(values.customExpiryDays) * SECONDS_PER_DAY;
            default:
                return nowInSeconds + Number(values.expiration) * SECONDS_PER_DAY;
        }
    };

    const handleSubmit = (values: GenerateClientSecretFormValues): void => {
        setIsSubmitting(true);

        createClientSecret(appId, { expiresAt: resolveExpiresAt(values) })
            .then((response: AxiosResponse<ClientSecretInterface>) => {
                onGenerated(response.data);
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                if (error?.response?.status === 409) {
                    setAlert({
                        description: t("applications:clientSecrets.maxCountReachedHint", { count: maxCount }),
                        level: AlertLevels.ERROR,
                        message: null
                    });

                    return;
                }

                if (error?.response?.data?.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:clientSecrets.notifications.generateSecret.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("applications:clientSecrets.notifications.generateSecret.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:clientSecrets.notifications.generateSecret.genericError.message")
                });
            })
            .finally(() => setIsSubmitting(false));
    };

    /**
     * Form-level validation. Enforces the custom expiry field when the Custom option is selected,
     * since the field-level `required` check only fires once the field has been modified.
     *
     * @param values - Current form values.
     * @returns Validation errors keyed by field name.
     */
    const validateForm = (values: GenerateClientSecretFormValues): Record<string, string> => {
        const errors: Record<string, string> = {};

        if (values.expiration === ClientSecretExpirationOption.CUSTOM) {
            const days: number = Number(values.customExpiryDays);

            if (!values.customExpiryDays) {
                errors.customExpiryDays =
                    t("applications:clientSecrets.wizard.customExpiry.validations.required");
            } else if (isNaN(days) || days < CUSTOM_EXPIRY_MIN_DAYS || days > CUSTOM_EXPIRY_MAX_DAYS) {
                errors.customExpiryDays =
                    t("applications:clientSecrets.wizard.customExpiry.validations.invalid");
            }
        }

        return errors;
    };

    return (
        <Modal
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            open={ open }
            onClose={ onCancel }
            onKeyPress={ (event: React.KeyboardEvent) => {
                if (event.key === "Enter" && open) {
                    formRef?.current?.triggerSubmit();
                }
            } }
            data-componentid={ componentId }
        >
            <Modal.Header className="wizard-header">
                { t("applications:clientSecrets.wizard.heading") }
                <Heading as="h6">
                    { t("applications:clientSecrets.wizard.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container">
                { alert && alertComponent }
                <Form
                    id={ FORM_ID }
                    ref={ formRef }
                    uncontrolledForm={ false }
                    onSubmit={ handleSubmit }
                    validate={ validateForm }
                    initialValues={ { expiration: ClientSecretExpirationOption.THIRTY_DAYS } }
                >
                    <Field.Dropdown
                        required
                        name="expiration"
                        label={ t("applications:clientSecrets.wizard.expiration.label") }
                        ariaLabel={ t("applications:clientSecrets.wizard.expiration.label") }
                        options={ expirationOptions }
                        value={ selectedExpiration }
                        listen={ (value: ClientSecretExpirationOption) => setSelectedExpiration(value) }
                        data-componentid={ `${ componentId }-expiration` }
                    />
                    { selectedExpiration === ClientSecretExpirationOption.CUSTOM && (
                        <Field.Input
                            required
                            name="customExpiryDays"
                            inputType="number"
                            label={ t("applications:clientSecrets.wizard.customExpiry.label") }
                            ariaLabel={ t("applications:clientSecrets.wizard.customExpiry.label") }
                            placeholder={ t("applications:clientSecrets.wizard.customExpiry.placeholder") }
                            min={ CUSTOM_EXPIRY_MIN_DAYS }
                            max={ CUSTOM_EXPIRY_MAX_DAYS }
                            minLength={ 1 }
                            maxLength={ 4 }
                            data-componentid={ `${ componentId }-custom-expiry` }
                        />
                    ) }
                    <Message
                        type="warning"
                        content={ t("applications:clientSecrets.wizard.expiryWarning") }
                        data-componentid={ `${ componentId }-expiry-warning` }
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ onCancel }
                                data-componentid={ `${ componentId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                disabled={ isSubmitting }
                                loading={ isSubmitting }
                                onClick={ () => formRef?.current?.triggerSubmit() }
                                data-componentid={ `${ componentId }-generate-button` }
                            >
                                { t("applications:clientSecrets.wizard.generateButton") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

export default GenerateClientSecretModal;
