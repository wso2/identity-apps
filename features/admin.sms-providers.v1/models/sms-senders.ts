/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Interface representing an SMS notification sender.
 */
export interface NotificationSenderSMSInterface {
    /**
     * The name of the SMS notification sender.
     */
    name: string;
    /**
     * The provider of the SMS notification service.
     */
    provider: string;
    /**
     * The URL of the SMS notification provider.
     */
    providerURL: string;
    /**
     * The content type of the SMS notification.
     */
    contentType: string;
    /**
     * Optional properties for the SMS notification sender.
     */
    properties?: {
        /**
         * The key of the property.
         */
        key: string;

        /**
         * The value of the property.
         */
        value: string;
    }[];
}
