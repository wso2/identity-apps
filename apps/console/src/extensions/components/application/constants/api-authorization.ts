/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
    NO = "NONE"
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

/*
 * API Authorization constants.
 */
export class APIAuthorizationConstants {

    /**
     * Client credentials grant type string.
     */
    public static readonly CLIENT_CREDENTIALS_GRANT_TYPE: string = "client_credentials";
}
