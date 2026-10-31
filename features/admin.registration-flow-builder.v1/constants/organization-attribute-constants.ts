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

import { OrganizationAttribute } from "../models/attributes";

/**
 * Constants related to organization attributes in the Registration flow.
 *
 * @remarks
 * This class is not meant to be instantiated. It only provides static constants.
 *
 * @example
 * ```typescript
 * const attributes = OrganizationAttributeConstants.CORE_ATTRIBUTES;
 * ```
 */
class OrganizationAttributeConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}


    /**
     * Allowed shape of a custom organization attribute key.
     *
     * Restricted to an alphanumeric/underscore identifier so a key can never contain `/`.
     * Keys are embedded into slash-separated context paths (`/organization/attributes/<key>`)
     * when the flow extension access config is built; a `/` inside a key would make the path
     * ambiguous to parse.
     */
    public static readonly KEY_PATTERN: RegExp = /^[a-zA-Z][a-zA-Z0-9_]*$/;

    /**
     * Identifier of the organization name field.
     *
     * An organization cannot be created without a name, so its presence in a flow is what marks
     * the flow as an organization onboarding flow.
     */
    public static readonly ORGANIZATION_NAME_IDENTIFIER: string = "organizationName";

    /**
     * Core organization attributes offered by the attribute selector.
     *
     * `organizationHandle` is deliberately absent — the dedicated `ORG_HANDLE` input variant
     * owns that identifier, and the attribute selector is not rendered for that variant.
     */
    public static readonly CORE_ATTRIBUTES: OrganizationAttribute[] = [
        {
            claimURI: OrganizationAttributeConstants.ORGANIZATION_NAME_IDENTIFIER,
            dataType: "STRING",
            description: "Name of the organization",
            displayName: "Organization Name",
            required: true
        },
        {
            claimURI: "organizationDescription",
            dataType: "STRING",
            description: "Description of the organization",
            displayName: "Organization Description",
            required: false
        }
    ];
}

export default OrganizationAttributeConstants;
