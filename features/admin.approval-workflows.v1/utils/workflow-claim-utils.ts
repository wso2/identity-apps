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

import { ConditionExpressionMetaInterface, ListDataInterface } from "@wso2is/admin.rules.v1/models/meta";

export const USER_CLAIMS_FIELD: string = "user.claims";
export const INITIATOR_CLAIMS_FIELD: string = "initiator.claims";

export type WorkflowClaimGroupFieldType =
    | typeof USER_CLAIMS_FIELD
    | typeof INITIATOR_CLAIMS_FIELD;

export interface WorkflowClaimFieldGroupInterface {
    claims: ConditionExpressionMetaInterface[];
    field: ListDataInterface;
}

const USER_FIELD_PREFIX: string = "user.";
const INITIATOR_FIELD_PREFIX: string = "initiator.";
const CLAIM_URI_PATTERN: RegExp = /^https?:\/\//;

/**
 * Resolves the claim group from the real rule field name.
 *
 * @param fieldName - Real rule field name from the metadata.
 * @returns Matching claim group name if the field is a workflow claim.
 */
export const getWorkflowClaimGroupFromField = (fieldName: string): WorkflowClaimGroupFieldType | null => {
    if (!fieldName) {
        return null;
    }

    if (fieldName.startsWith(USER_FIELD_PREFIX) && CLAIM_URI_PATTERN.test(fieldName.slice(USER_FIELD_PREFIX.length))) {
        return USER_CLAIMS_FIELD;
    }

    if (
        fieldName.startsWith(INITIATOR_FIELD_PREFIX) &&
        CLAIM_URI_PATTERN.test(fieldName.slice(INITIATOR_FIELD_PREFIX.length))
    ) {
        return INITIATOR_CLAIMS_FIELD;
    }

    return null;
};

/**
 * Checks whether a metadata entry represents a workflow claim field.
 *
 * @param meta - Condition expression metadata.
 * @returns True if the metadata entry is a workflow claim field.
 */
export const isWorkflowClaimMeta = (meta: ConditionExpressionMetaInterface): boolean => {
    return getWorkflowClaimGroupFromField(meta?.field?.name) !== null;
};

/**
 * Checks whether a field name is one of the workflow claim group options.
 *
 * @param fieldName - Field name to check.
 * @returns True if the field name is a workflow claim group.
 */
export const isWorkflowClaimGroupField = (fieldName: string): boolean => {
    return fieldName === USER_CLAIMS_FIELD || fieldName === INITIATOR_CLAIMS_FIELD;
};

/**
 * Extracts the claim URI from a real workflow claim field name.
 *
 * @param fieldName - Real workflow claim field.
 * @returns Claim URI if available.
 */
export const getClaimUriFromWorkflowClaimField = (fieldName: string): string => {
    const claimGroup: WorkflowClaimGroupFieldType | null = getWorkflowClaimGroupFromField(fieldName);

    if (claimGroup === USER_CLAIMS_FIELD) {
        return fieldName.slice(USER_FIELD_PREFIX.length);
    }

    if (claimGroup === INITIATOR_CLAIMS_FIELD) {
        return fieldName.slice(INITIATOR_FIELD_PREFIX.length);
    }

    return fieldName;
};

/**
 * Removes the subject prefix from workflow claim display names.
 *
 * @param displayName - Display name to normalize.
 * @returns Claim display name without the workflow subject prefix.
 */
export const getWorkflowClaimDisplayName = (displayName: string): string => {
    if (!displayName) {
        return displayName;
    }

    if (displayName.startsWith(USER_FIELD_PREFIX)) {
        return displayName.slice(USER_FIELD_PREFIX.length).toLowerCase();
    }

    if (displayName.startsWith(INITIATOR_FIELD_PREFIX)) {
        return displayName.slice(INITIATOR_FIELD_PREFIX.length).toLowerCase();
    }

    return displayName;
};

/**
 * Groups workflow claim metadata into user claims and initiator claims.
 *
 * @param metaData - Condition expression metadata.
 * @param labels - Optional translated display labels for the claim groups.
 * @returns Grouped workflow claim metadata.
 */
export const buildWorkflowClaimMetaGroups = (
    metaData: ConditionExpressionMetaInterface[] = [],
    labels?: { initiatorClaim?: string; userClaim?: string }
): WorkflowClaimFieldGroupInterface[] => {
    const userClaimMeta: ConditionExpressionMetaInterface[] = [];
    const initiatorClaimMeta: ConditionExpressionMetaInterface[] = [];

    metaData?.forEach((meta: ConditionExpressionMetaInterface) => {
        const group: WorkflowClaimGroupFieldType | null = getWorkflowClaimGroupFromField(meta?.field?.name);

        if (group === USER_CLAIMS_FIELD) {
            userClaimMeta.push(meta);
        } else if (group === INITIATOR_CLAIMS_FIELD) {
            initiatorClaimMeta.push(meta);
        }
    });

    const sortClaims = (claims: ConditionExpressionMetaInterface[]): ConditionExpressionMetaInterface[] => {
        return [ ...claims ].sort(
            (first: ConditionExpressionMetaInterface, second: ConditionExpressionMetaInterface) => {
                return getWorkflowClaimDisplayName(first?.field?.displayName).localeCompare(
                    getWorkflowClaimDisplayName(second?.field?.displayName)
                );
            }
        );
    };

    return [
        ...(userClaimMeta.length > 0
            ? [ {
                claims: sortClaims(userClaimMeta),
                field: {
                    displayName: labels?.userClaim ?? "user claim",
                    name: USER_CLAIMS_FIELD
                }
            } ]
            : []),
        ...(initiatorClaimMeta.length > 0
            ? [ {
                claims: sortClaims(initiatorClaimMeta),
                field: {
                    displayName: labels?.initiatorClaim ?? "initiator claim",
                    name: INITIATOR_CLAIMS_FIELD
                }
            } ]
            : [])
    ];
};
