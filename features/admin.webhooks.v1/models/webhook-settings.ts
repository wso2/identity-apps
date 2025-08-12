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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EventPublishingOrgSharePolicy } from "./shared-access";

/**
 * Form values interface.
 */
export interface WebhookSettingsFormValuesInterface {
    /**
     * Event publishing organization scope.
     */
    organizationPolicy: OrganizationPolicyFormValuesInterface;
}

/**
 * Organization policy form values interface.
 */
export interface OrganizationPolicyFormValuesInterface {
    /**
     * Name of the organization policy.
     */
    policyName: EventPublishingOrgSharePolicy;
}

/**
 * Proptypes for the webhook settings form component.
 */
export interface WebhookSettingsFormPropsInterface extends IdentifiableComponentInterface {

}

/**
 * Interface for webhook metadata update request.
 */
export interface WebhookMetadataUpdateRequestInterface {
    /**
     * Event publishing organization scope.
     */
    organizationPolicy: OrganizationPolicyUpdateInterface;
}

/**
 * Interface for organization policy update.
 */
export interface OrganizationPolicyUpdateInterface {
    /**
     * Name of the organization policy.
     */
    policyName: EventPublishingOrgSharePolicy;
}

/**
 * Interface for webhook metadata update response.
 */
export interface WebhookMetadataUpdateResponseInterface {
    /**
     * Event publishing organization scope.
     */
    organizationPolicy: EventPublishingOrgSharePolicy;
}
