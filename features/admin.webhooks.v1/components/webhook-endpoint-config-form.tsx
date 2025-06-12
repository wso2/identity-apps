/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Button from "@oxygen-ui/react/Button";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, TextFieldAdapter } from "@wso2is/form/src";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Field } from "react-final-form";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { WebhookConfigFormPropertyInterface } from "../models/webhooks";
import "./webhook-endpoint-config-form.scss";

interface WebhookEndpointConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Webhook's initial values.
     */
    initialValues: WebhookConfigFormPropertyInterface;
    /**
     * Specifies webhook creation state.
     */
    isCreateFormState: boolean;
    /**
     * Specifies whether the form is read-only.
     */
    isReadOnly: boolean;
}

const WebhookEndpointConfigForm: FunctionComponent<WebhookEndpointConfigFormInterface> = ({
    initialValues,
    isCreateFormState,
    isReadOnly,
    ["data-componentid"]: _componentId = "webhook-endpoint-config-form"
}: WebhookEndpointConfigFormInterface): ReactElement => {
    const [ isShowSecret, setShowSecret ] = useState<boolean>(false);
    const [ isShowSecretUpdateField, setShowSecretUpdateField ] = useState<boolean>(false);

    const { t } = useTranslation();

    useEffect(() => {
        if (initialValues?.id && !isCreateFormState) {
            setShowSecretUpdateField(false);
        } else if (isCreateFormState) {
            // In create mode, always show the secret field
            setShowSecretUpdateField(true);
        }
    }, [ initialValues ]);

    const renderInputAdornmentOfSecret = (showSecret: boolean, onClick: () => void): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !showSecret ? "eye" : "eye slash" }
                data-componentid={ `${_componentId}-secret-property-view-button` }
                onClick={ onClick }
            />
        </InputAdornment>
    );

    const handleSecretChange = (): void => {
        setShowSecretUpdateField(true);
    };

    const handleSecretChangeCancel = (): void => {
        setShowSecretUpdateField(false);
    };

    const renderWebhookSecretSection = (): ReactElement => {
        const renderWebhookSecretSectionInfoBox = (): ReactElement => {
            return (
                <Alert className="alert-nutral" icon={ false }>
                    <AlertTitle className="alert-title" data-componentid={ `${_componentId}-secret-info-box-title` }>
                        <Trans
                            i18nKey={ t("webhooks:configForm.fields.secret.info.title") }
                            components={ { strong: <strong /> } }
                        />
                    </AlertTitle>
                    <Trans i18nKey={ t("webhooks:configForm.fields.secret.info.message") } />
                    <div>
                        <Button
                            onClick={ handleSecretChange }
                            variant="outlined"
                            size="small"
                            className={ "secondary-button" }
                            data-componentid={ `${_componentId}-change-secret-button` }
                            disabled={ isReadOnly }
                        >
                            { t("webhooks:configForm.buttons.changeSecret") }
                        </Button>
                    </div>
                </Alert>
            );
        };

        const renderWebhookSecretUpdateWidget = (): ReactElement => {
            const renderWebhookSecretPropertyField = (): ReactElement => {
                const showSecretHint = (): ReactElement => (
                    <Hint className="hint-text" compact>
                        { `${t("webhooks:configForm.fields.secret.hint.common")}${
                            isCreateFormState
                                ? t("webhooks:configForm.fields.secret.hint.create")
                                : t("webhooks:configForm.fields.secret.hint.update")
                        }` }
                    </Hint>
                );

                return (
                    <>
                        <FinalFormField
                            key="secret"
                            className="text-field-container"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="secret"
                            required={ isCreateFormState || isShowSecretUpdateField }
                            data-componentid={ `${_componentId}-secret-property-field` }
                            name="secret"
                            type={ isShowSecret ? "text" : "password" }
                            InputProps={ {
                                endAdornment: renderInputAdornmentOfSecret(isShowSecret, () =>
                                    setShowSecret(!isShowSecret)
                                )
                            } }
                            label={ t("webhooks:configForm.fields.secret.label") }
                            placeholder={ t("webhooks:configForm.fields.secret.placeholder") }
                            helperText={ showSecretHint() }
                            component={ TextFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                            disabled={ isReadOnly }
                        />
                    </>
                );
            };

            return (
                <div className="box-field">
                    { renderWebhookSecretPropertyField() }
                    { !isCreateFormState && (
                        <Button
                            onClick={ handleSecretChangeCancel }
                            variant="outlined"
                            size="small"
                            className="secondary-button"
                            data-componentid={ `${_componentId}-cancel-edit-secret-button` }
                        >
                            { t("webhooks:configForm.buttons.cancel") }
                        </Button>
                    ) }
                </div>
            );
        };

        return isShowSecretUpdateField ? renderWebhookSecretUpdateWidget() : renderWebhookSecretSectionInfoBox();
    };

    return (
        <>
            <FinalFormField
                key="name"
                className="text-field-container"
                width={ 16 }
                FormControlProps={ {
                    margin: "dense"
                } }
                ariaLabel="webhookName"
                required={ true }
                data-componentid={ `${_componentId}-webhook-name` }
                name="name"
                type="text"
                label={ t("webhooks:configForm.fields.name.label") }
                placeholder={ t("webhooks:configForm.fields.name.placeholder") }
                helperText={
                    (<Hint className="hint" compact>
                        { t("webhooks:configForm.fields.name.hint") }
                    </Hint>)
                }
                component={ TextFieldAdapter }
                maxLength={ 100 }
                minLength={ 0 }
                disabled={ isReadOnly }
            />
            <FinalFormField
                key="uri"
                className="text-field-container"
                width={ 16 }
                FormControlProps={ {
                    margin: "dense"
                } }
                ariaLabel="endpoint"
                required={ true }
                data-componentid={ `${_componentId}-webhook-endpointUri` }
                name="endpoint"
                type="text"
                label={ t("webhooks:configForm.fields.endpoint.label") }
                placeholder={ t("webhooks:configForm.fields.endpoint.placeholder") }
                helperText={
                    (<Hint className="hint" compact>
                        { t("webhooks:configForm.fields.endpoint.hint") }
                    </Hint>)
                }
                component={ TextFieldAdapter }
                maxLength={ 100 }
                minLength={ 0 }
                disabled={ isReadOnly }
            />

            <Field name="endpoint" subscription={ { value: true } }>
                { ({ input }: { input: { value: string } }) => {
                    const isHttpEndpointUri: boolean = input.value?.startsWith("http://");

                    return isHttpEndpointUri ? (
                        <Alert
                            severity="warning"
                            className="endpoint-uri-alert"
                            data-componentid={ `${_componentId}-endpoint-uri-alert` }
                        >
                            <Trans i18nKey={ t("webhooks:configForm.fields.endpoint.validations.notHttps") } />
                        </Alert>
                    ) : null;
                } }
            </Field>

            { renderWebhookSecretSection() }
        </>
    );
};

export default WebhookEndpointConfigForm;
