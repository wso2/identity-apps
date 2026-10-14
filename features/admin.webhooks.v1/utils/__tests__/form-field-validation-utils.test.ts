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

import { TFunction } from "i18next";
import { ChildOrgSubscriptionPolicy } from "../../models/shared-access";
import {
    WebhookChannelFormValueInterface,
    WebhookConfigFormPropertyInterface
} from "../../models/webhooks";
import { WebhookFormErrorsInterface, validateWebhookForm } from "../form-field-validation-utils";

const t: TFunction = ((key: string) => key) as unknown as TFunction;

const channelValue = (
    overrides: Partial<WebhookChannelFormValueInterface> = {}
): WebhookChannelFormValueInterface => ({
    organizations: [],
    subscribed: true,
    subscriptionPolicy: ChildOrgSubscriptionPolicy.NONE,
    ...overrides
});

const formData = (
    channels: Record<string, WebhookChannelFormValueInterface>
): WebhookConfigFormPropertyInterface => ({
    channels,
    endpoint: "https://example.com/webhook",
    id: "webhook-1",
    name: "Sample Webhook",
    secret: "some-secret"
});

describe("validateWebhookForm", () => {
    it("accepts a webhook with one subscribed channel and no fanout", () => {
        const errors: WebhookFormErrorsInterface = validateWebhookForm(
            formData({ Logins: channelValue() }),
            true,
            t
        );

        expect(errors).toEqual({});
    });

    it("rejects a webhook with no subscribed channel", () => {
        const errors: WebhookFormErrorsInterface = validateWebhookForm(
            formData({ Logins: channelValue({ subscribed: false }) }),
            true,
            t
        );

        expect(errors.channels).toBe("webhooks:configForm.channels.validations.empty");
    });

    it("rejects SELECTED_ORGS_ONLY with nothing selected, pointing at the channel", () => {
        const errors: WebhookFormErrorsInterface = validateWebhookForm(
            formData({
                Logins: channelValue({ subscriptionPolicy: ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY })
            }),
            true,
            t
        );

        expect(errors.channelOrganizations).toEqual({
            Logins: "webhooks:configForm.channels.validations.noOrganizationsSelected"
        });
    });

    it("accepts SELECTED_ORGS_ONLY once an organization is selected", () => {
        const errors: WebhookFormErrorsInterface = validateWebhookForm(
            formData({
                Logins: channelValue({
                    organizations: [ "org-a" ],
                    subscriptionPolicy: ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY
                })
            }),
            true,
            t
        );

        expect(errors.channelOrganizations).toBeUndefined();
    });

    it("rejects a stored SELECTED_ORGS_ONLY channel with no organizations in the form", () => {
        // The form loads the stored selection as soon as the policy is known, so an empty list
        // here means the selection really is empty rather than merely unread.
        const errors: WebhookFormErrorsInterface = validateWebhookForm(
            formData({
                Logins: channelValue({
                    channelId: "channel-1",
                    subscriptionPolicy: ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY
                })
            }),
            false,
            t
        );

        expect(errors.channelOrganizations).toBeDefined();
    });

    it("ignores the policy of an unsubscribed channel", () => {
        const errors: WebhookFormErrorsInterface = validateWebhookForm(
            formData({
                Logins: channelValue(),
                Tokens: channelValue({
                    subscribed: false,
                    subscriptionPolicy: ChildOrgSubscriptionPolicy.SELECTED_ORGS_ONLY
                })
            }),
            true,
            t
        );

        expect(errors.channelOrganizations).toBeUndefined();
    });
});
