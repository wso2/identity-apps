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

import { ExtensionTemplateCategoryInterface } from "@wso2is/admin.template-core.v1/models/templates";

export class PushProviderConstants {

    public static readonly NOTIFICATION_PROVIDER_CATEGORIES_INFO: ExtensionTemplateCategoryInterface[] = [
        {
            description: "This category includes all the push notification providers that can be configured.",
            displayName: "Push Notification Providers",
            displayOrder: 0,
            id: "PUSH"
        }
    ];

    public static readonly FEATURE_STATUS_ATTRIBUTE_KEY: string = "featureStatus";

    public static readonly PUSH_PROVIDER_TEMPLATE_NAME_MAPPING: Map<string, string> = new Map<string, string>([
        [ "firebase-cloud-messaging", "FCM" ],
        [ "amazon-sns", "AmazonSNS" ]
    ]);
}
