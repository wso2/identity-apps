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

import { store } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { WebhooksConstants } from "../constants/webhooks-constants";

/**
 * Whether per-channel child organization subscriptions are available to the console.
 *
 * Decides the API version as well as the UI: v2 reports no channels at all until the server's
 * `Webhooks.ChildOrganizationSubscriptionEnabled` is on, so an absent config must mean v1.
 *
 * @param featureConfig - The webhooks feature configuration.
 * @returns true if the child organization subscription feature is enabled.
 */
export const isChildOrgSubscriptionEnabled = (featureConfig: FeatureAccessConfigInterface): boolean =>
    Boolean(featureConfig)
    && isFeatureEnabled(featureConfig, WebhooksConstants.FEATURE_DICTIONARY.get("CHILD_ORG_SUBSCRIPTION"));

/**
 * The webhook resource endpoint for the version the console is configured to speak.
 *
 * Read from the store so the non-React API layer resolves the same config the components do.
 *
 * @returns The versioned webhook resource endpoint.
 */
export const getWebhooksEndpoint = (): string => {
    const featureConfig: FeatureAccessConfigInterface = store.getState()?.config?.ui?.features?.webhooks;

    return isChildOrgSubscriptionEnabled(featureConfig)
        ? store.getState().config.endpoints.webhooksV2
        : store.getState().config.endpoints.webhooks;
};
