/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { I18n } from "@wso2is/i18n";

/**
 * Policies enum.
 */
export enum Policy {
    /**
     * Role based policy.
     */
    ROLE = "RBAC",
    /**
     * No Policy.
     */
    NO = "NO POLICY"
}

/**
 * Policy info interface.
 */
export interface PolicyInfo {
    /**
     * Policy name.
     */
    name: () => string;
    /**
     * Policy Identifier.
     */
    policyIdentifier : () => string;
    /**
     * Policy documentation link.
     */
    documentationLink?: () => string;
    /**
     * Hint
     */
    hint?: () => string;
}

/**
 * Policy details.
 */
export const policyDetails: Map<Policy, PolicyInfo> = new Map<Policy, PolicyInfo>([
    [
        Policy.ROLE, 
        { 
            documentationLink: (): string => "develop.applications.apiAuthorization.policies.rbac.learnMore",
            hint: (): string => I18n.instance.t("extensions:develop.applications.edit.sections.apiAuthorization" +
                ".sections.policySection.form.fields.rbac.hint"),
            name: (): string => I18n.instance.t("extensions:develop.applications.edit.sections.apiAuthorization" +
                ".sections.policySection.form.fields.rbac.name"),
            policyIdentifier: (): string => Policy.ROLE
        }
    ],
    [
        Policy.NO, 
        { 
            documentationLink: (): string => "develop.applications.apiAuthorization.policies.noPolicy.learnMore",
            hint: (): string => I18n.instance.t("extensions:develop.applications.edit.sections.apiAuthorization" +
                ".sections.policySection.form.fields.noPolicy.hint"),
            name: (): string => I18n.instance.t("extensions:develop.applications.edit.sections.apiAuthorization" +
                ".sections.policySection.form.fields.noPolicy.name"),
            policyIdentifier: (): string => Policy.NO
        }
    ]
]);
