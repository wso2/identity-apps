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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import Skeleton from "@oxygen-ui/react/Skeleton";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FormRenderProps } from "@wso2is/form/src";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import WebhookChannelConfigForm from "./webhook-channel-config-form";
import WebhookEndpointConfigForm from "./webhook-endpoint-config-form";
import { WebhookChannelConfigInterface } from "../models/event-profile";
import { WebhookChannelSubscriptionInterface, WebhookConfigFormPropertyInterface } from "../models/webhooks";
import { validateWebhookForm } from "../utils/form-field-validation-utils";
import "./webhook-config-form.scss";

interface WebhookConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Webhook's initial values.
     */
    initialValues: WebhookConfigFormPropertyInterface;
    /**
     * Specifies the channelConfigs for the form.
     */
    channelConfigs: WebhookChannelConfigInterface[];
    /**
     * Current channel subscriptions with status.
     */
    channelSubscriptions?: WebhookChannelSubscriptionInterface[];
    /**
     * Flag for loading state.
     */
    isLoading?: boolean;
    /**
     * Specifies whether the form is read-only.
     */
    isReadOnly: boolean;
    /**
     * Specifies action creation state.
     */
    isCreateFormState: boolean;
    /**
     * Form submission handler.
     */
    onSubmit?: (values: WebhookConfigFormPropertyInterface) => void;
    /**
     * Specifies if form is submitting.
     */
    isSubmitting?: boolean;
    /**
     * Hide the update/create button.
     */
    hideSubmitButton?: boolean;
    /**
     * Flag to indicate if the form is in WebSub Hub adopter mode.
     */
    isWebSubHubAdopterMode?: boolean;
}

const WebhookConfigForm: FunctionComponent<WebhookConfigFormInterface> = ({
    initialValues,
    channelConfigs,
    channelSubscriptions,
    isLoading,
    isReadOnly,
    isCreateFormState,
    onSubmit,
    isSubmitting,
    hideSubmitButton,
    isWebSubHubAdopterMode,
    ["data-componentid"]: _componentId = "webhook-config-form"
}: WebhookConfigFormInterface): ReactElement => {
    const { t } = useTranslation();

    const renderLoadingPlaceholders = (): ReactElement => (
        <Box className="placeholder-box">
            <Skeleton variant="rectangular" height={ 7 } width="30%" />
            <Skeleton variant="rectangular" height={ 28 } />
            <Skeleton variant="rectangular" height={ 7 } width="90%" />
            <Skeleton variant="rectangular" height={ 7 } />
        </Box>
    );

    const renderFormFields = (): ReactElement => {
        if (isLoading) {
            return renderLoadingPlaceholders();
        }

        return (
            <>
                <WebhookEndpointConfigForm
                    initialValues={ initialValues }
                    isCreateFormState={ isCreateFormState }
                    isReadOnly={ isReadOnly }
                    isWebSubHubAdopterMode={ isWebSubHubAdopterMode }
                    data-componentid={ `${_componentId}-endpoint-config-form` }
                />
                <Divider className="divider-container" />
                <WebhookChannelConfigForm
                    channelConfigs={ channelConfigs }
                    channelSubscriptions={ channelSubscriptions }
                    isReadOnly={ isReadOnly }
                    data-componentid={ `${_componentId}-channel-config-form` }
                />
            </>
        );
    };

    const handleFormSubmit = (values: WebhookConfigFormPropertyInterface): void => {
        onSubmit?.(values);
    };

    const validateForm = (values: WebhookConfigFormPropertyInterface): Record<string, string> => {
        return validateWebhookForm(values, isCreateFormState, t);
    };

    return (
        <Box>
            <FinalForm
                onSubmit={ handleFormSubmit }
                validate={ validateForm }
                initialValues={ initialValues }
                render={ ({ handleSubmit, submitting, invalid }: FormRenderProps) => (
                    <Box component="form" onSubmit={ handleSubmit }>
                        <EmphasizedSegment
                            className="form-wrapper"
                            padded="very"
                            data-componentid={ `${_componentId}-section` }
                        >
                            <Box className="form-container with-max-width">
                                { renderFormFields() }
                                { !isLoading && !hideSubmitButton && (
                                    <Button
                                        size="medium"
                                        variant="contained"
                                        type="submit"
                                        className="button-container"
                                        data-componentid={ `${_componentId}-primary-button` }
                                        loading={ isSubmitting || submitting }
                                        disabled={ isReadOnly || invalid }
                                    >
                                        { isCreateFormState
                                            ? t("webhooks:configForm.buttons.create")
                                            : t("webhooks:configForm.buttons.update") }
                                    </Button>
                                ) }
                            </Box>
                        </EmphasizedSegment>
                    </Box>
                ) }
            />
        </Box>
    );
};

export default WebhookConfigForm;
