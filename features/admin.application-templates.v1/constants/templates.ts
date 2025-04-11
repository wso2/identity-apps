/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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
import { AuthProtocolTypes } from "../../admin.connections.v1";

/**
 * Class containing application templates management constants.
 */
export class ApplicationTemplateConstants {
    public static readonly SUPPORTED_CATEGORIES_INFO: ExtensionTemplateCategoryInterface[] = [
        {
            description: "applicationTemplates:categories.default.description",
            displayName: "applicationTemplates:categories.default.displayName",
            displayOrder: 0,
            id: "DEFAULT"
        },
        {
            description: "applicationTemplates:categories.ssoIntegration.description",
            displayName: "applicationTemplates:categories.ssoIntegration.displayName",
            displayOrder: 1,
            id: "SSO-INTEGRATION"
        }
    ];

    public static readonly FEATURE_STATUS_ATTRIBUTE_KEY: string = "featureStatus";

    public static readonly SUPPORTED_TECHNOLOGIES_ATTRIBUTE_KEY: string = "supportedTechnologies";

    public static readonly CUSTOM_PROTOCOL_APPLICATION_TEMPLATE_ID: string = "custom-protocol-application";

    public static readonly APPLICATION_CREATE_WIZARD_SHARING_FIELD_NAME: string = "isApplicationSharable";

    public static readonly APPLICATION_INBOUND_PROTOCOL_KEYS: {
        [ AuthProtocolTypes.WS_FEDERATION ]: string;
        [ AuthProtocolTypes.WS_TRUST ]: string;
    } = {
        [ AuthProtocolTypes.WS_FEDERATION ]: "passiveSts",
        [ AuthProtocolTypes.WS_TRUST ]: "wsTrust"
    };

    /**
     * Excludes old application templates from triggering API calls to fetch
     * template or metadata JSON files, as they have not been migrated to the
     * extension API.
     */
    public static readonly EXCLUDED_APP_TEMPLATES_FOR_EXTENSION_API: string[] = [
        "custom-application",
        "custom-protocol-application",
        "m2m-application",
        "mobile-application",
        "single-page-application",
        "traditional-web-application"
    ];
}
