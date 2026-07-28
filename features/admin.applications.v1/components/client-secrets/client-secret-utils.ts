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

import { ClientSecretInterface, ClientSecretStatus } from "../../models/application-inbound";

/**
 * Expiry thresholds (in days) used to classify how soon a client secret expires. Hardcoded in the
 * console (not deployment configurable).
 */
const EXPIRY_WARNING_DAYS: number = 20;
const EXPIRY_CRITICAL_DAYS: number = 10;

const MILLISECONDS_PER_DAY: number = 24 * 60 * 60 * 1000;

/**
 * Expiry state of a client secret, mapped to the status dot colour.
 */
export enum ClientSecretExpiryState {
    /** Green — not expiring anytime soon. */
    ACTIVE = "active",
    /** Green — never expires. */
    NEVER = "never",
    /** Yellow — expiring within the warning window. */
    EXPIRING_WARNING = "expiringWarning",
    /** Red — expiring within the critical window. */
    EXPIRING_CRITICAL = "expiringCritical",
    /** Grey — already expired. */
    EXPIRED = "expired"
}

/**
 * Resolves the expiry state and a human-readable expiry date of a client secret.
 *
 * @param secret - Client secret metadata.
 * @param referenceTime - Epoch milliseconds to evaluate the expiry against.
 * @returns Resolved expiry details.
 */
export const resolveClientSecretExpiry = (
    secret: ClientSecretInterface,
    referenceTime: number = Date.now()
): { state: ClientSecretExpiryState; formattedDate: string | null } => {

    const formatDate = (epochSeconds: number): string => new Date(epochSeconds * 1000).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        weekday: "short",
        year: "numeric"
    });

    if (secret?.status === ClientSecretStatus.EXPIRED) {
        return {
            formattedDate: secret?.expiresAt ? formatDate(secret.expiresAt) : null,
            state: ClientSecretExpiryState.EXPIRED
        };
    }

    if (!secret?.expiresAt) {
        return {
            formattedDate: null,
            state: ClientSecretExpiryState.NEVER
        };
    }

    const daysRemaining: number = Math.ceil((secret.expiresAt * 1000 - referenceTime) / MILLISECONDS_PER_DAY);
    const formattedDate: string = formatDate(secret.expiresAt);

    /* The secret is active here (EXPIRED is trusted from the API above); classify how soon it expires. */
    let state: ClientSecretExpiryState;

    if (daysRemaining <= EXPIRY_CRITICAL_DAYS) {
        state = ClientSecretExpiryState.EXPIRING_CRITICAL;
    } else if (daysRemaining <= EXPIRY_WARNING_DAYS) {
        state = ClientSecretExpiryState.EXPIRING_WARNING;
    } else {
        state = ClientSecretExpiryState.ACTIVE;
    }

    return { formattedDate, state };
};

/**
 * Whether at least one active client secret is within the critical expiry window.
 *
 * @param secrets - List of client secrets.
 * @param referenceTime - Epoch milliseconds to evaluate the expiry against.
 * @returns True when any active secret is critically close to expiry.
 */
export const hasCriticallyExpiringSecret = (
    secrets: ClientSecretInterface[],
    referenceTime: number = Date.now()
): boolean => {

    /* Consider active secrets only; stop at the first one in the critical window. */
    return (secrets ?? [])
        .filter((secret: ClientSecretInterface) => secret?.status === ClientSecretStatus.ACTIVE)
        .some((secret: ClientSecretInterface) =>
            resolveClientSecretExpiry(secret, referenceTime).state === ClientSecretExpiryState.EXPIRING_CRITICAL);
};
