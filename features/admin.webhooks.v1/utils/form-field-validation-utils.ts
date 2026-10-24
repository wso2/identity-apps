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
import { ChildOrgSubscriptionPolicy } from "../models/shared-access";
import {
    WebhookChannelFormValueInterface,
    WebhookConfigFormPropertyInterface
} from "../models/webhooks";

/**
 * Validates webhook name field.
 *
 * @param name - The name value to validate.
 * @param t - Translation function.
 * @returns Error message or undefined if valid.
 */
const validateWebhookName = (name: string, t: TFunction): string | undefined => {
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
const validateWebhookEndpoint = (endpoint: string, t: TFunction): string | undefined => {
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
const validateWebhookSecret = (secret: string, isCreateFormState: boolean, t: TFunction): string | undefined => {
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
 * Validates that at least one event channel is subscribed.
 *
 * @param channels - The per-channel form state.
 * @param t - Translation function.
 * @returns Error message or undefined if valid.
 */
const validateWebhookChannels = (
    channels: Record<string, WebhookChannelFormValueInterface>,
    t: TFunction
): string | undefined => {
    const hasSelectedChannel: boolean = Object.values(channels || {}).some(
        (channel: WebhookChannelFormValueInterface) => channel?.subscribed
    );

    if (!hasSelectedChannel) {
        return t("webhooks:configForm.channels.validations.empty");
    }

    return undefined;
};

/**
 * Validates the organization selection of every subscribed channel.
 *
 * The API rejects an empty `organizations` array under `SELECTED_ORGS_ONLY`, so the same guard
 * runs here to fail before the request and point at the offending channel.
 *
 * @param channels - The per-channel form state.
 * @param t - Translation function.
 * @returns Error messages keyed by channel key. Empty when every channel is valid.
 */
const validateChannelOrganizations = (
    channels: Record<string, WebhookChannelFormValueInterface>,
    t: TFunction
): Record<string, string> => {
    const errors: Record<string, string> = {};

    Object.keys(channels || {}).forEach((key: string) => {
        const channel: WebhookChannelFormValueInterface = channels[key];

        if (!channel?.subscribed) {
            return;
        }

        if (channel.subscriptionPolicy !== ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY) {
            return;
        }

        if (!(channel.organizations?.length > 0)) {
            errors[key] = t("webhooks:configForm.channels.validations.noOrganizationsSelected");
        }
    });

    return errors;
};

/**
 * Shape of the errors produced by {@link validateWebhookForm}.
 *
 * `channelOrganizations` is not bound to a form field — it exists so the channel form can
 * render the message against the offending accordion row while still marking the form invalid.
 */
export interface WebhookFormErrorsInterface {
    name?: string;
    endpoint?: string;
    secret?: string;
    channels?: string;
    channelOrganizations?: Record<string, string>;
}

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
): WebhookFormErrorsInterface => {
    const errors: WebhookFormErrorsInterface = {};

    const nameError: string | undefined = validateWebhookName(values?.name, t);

    if (nameError) errors.name = nameError;

    const endpointError: string | undefined = validateWebhookEndpoint(values?.endpoint, t);

    if (endpointError) errors.endpoint = endpointError;

    const secretError: string | undefined = validateWebhookSecret(values?.secret, isCreateFormState, t);

    if (secretError) errors.secret = secretError;

    const channelsError: string | undefined = validateWebhookChannels(values?.channels, t);

    if (channelsError) errors.channels = channelsError;

    const channelOrganizationErrors: Record<string, string> = validateChannelOrganizations(values?.channels, t);

    if (Object.keys(channelOrganizationErrors).length > 0) {
        errors.channelOrganizations = channelOrganizationErrors;
    }

    return errors;
};
