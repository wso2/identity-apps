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

import { FormValidation } from "@wso2is/validation";
import { TFunction } from "i18next";
import { WebhooksConstants } from "../constants/webhooks-constants";
import { WebhookConfigFormPropertyInterface } from "../models/webhooks";

/**
 * Validates webhook name field.
 *
 * @param name - The name value to validate.
 * @param t - Translation function.
 * @returns Error message or undefined if valid.
 */
export const validateWebhookName = (name: string, t: TFunction): string | undefined => {
    if (!name?.trim()) {
        return t("webhooks:configForm.fields.name.validations.empty");
    }

    if (!WebhooksConstants.WEBHOOK_NAME_REGEX.test(name)) {
        return t("webhooks:configForm.fields.name.validations.invalid");
    }

    return undefined;
};

/**
 * Validates webhook endpoint field.
 *
 * @param endpoint - The endpoint value to validate.
 * @param t - Translation function.
 * @returns Error message or undefined if valid.
 */
export const validateWebhookEndpoint = (endpoint: string, t: TFunction): string | undefined => {
    if (!endpoint?.trim()) {
        return t("webhooks:configForm.fields.endpoint.validations.empty");
    }

    if (
        !FormValidation.url(endpoint, {
            domain: {
                allowUnicode: true,
                minDomainSegments: 1,
                tlds: false
            },
            scheme: [ "https", "http" ]
        })
    ) {
        return t("webhooks:configForm.fields.endpoint.validations.invalid");
    }

    return undefined;
};

/**
 * Validates webhook secret field.
 *
 * @param secret - The secret value to validate.
 * @param isCreateFormState - Whether the form is in create mode.
 * @param t - Translation function.
 * @returns Error message or undefined if valid.
 */
export const validateWebhookSecret = (secret: string, isCreateFormState: boolean, t: TFunction): string | undefined => {
    // In create mode, secret is required
    if (isCreateFormState && !secret?.trim()) {
        return t("webhooks:configForm.fields.secret.validations.empty");
    }

    // If secret is provided, validate its format
    if (secret?.trim() && !WebhooksConstants.WEBHOOK_SECRET_REGEX.test(secret)) {
        return t("webhooks:configForm.fields.secret.validations.invalid");
    }

    return undefined;
};

/**
 * Validates webhook channels field.
 *
 * @param channels - The channels object to validate.
 * @param t - Translation function.
 * @returns Error message or undefined if valid.
 */
export const validateWebhookChannels = (channels: Record<string, boolean>, t: TFunction): string | undefined => {
    const hasSelectedChannel: boolean = Object.values(channels || {}).some(Boolean);

    if (!hasSelectedChannel) {
        return t("webhooks:configForm.channels.validations.empty");
    }

    return undefined;
};

/**
 * Validates the complete webhook form.
 *
 * @param values - Form values to validate.
 * @param isCreateFormState - Whether the form is in create mode.
 * @param t - Translation function.
 * @returns Object containing validation errors for each field.
 */
export const validateWebhookForm = (
    values: WebhookConfigFormPropertyInterface,
    isCreateFormState: boolean,
    t: TFunction
): Record<string, string> => {
    const errors: Record<string, string> = {};

    const nameError: string | undefined = validateWebhookName(values?.name, t);

    if (nameError) errors.name = nameError;

    const endpointError: string | undefined = validateWebhookEndpoint(values?.endpoint, t);

    if (endpointError) errors.endpoint = endpointError;

    const secretError: string | undefined = validateWebhookSecret(values?.secret, isCreateFormState, t);

    if (secretError) errors.secret = secretError;

    const channelsError: string | undefined = validateWebhookChannels(values?.channels, t);

    if (channelsError) errors.channels = channelsError;

    return errors;
};
