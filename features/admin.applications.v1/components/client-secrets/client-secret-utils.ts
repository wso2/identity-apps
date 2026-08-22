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

import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ClientSecretInterface, ClientSecretStatus } from "../../models/application-inbound";

dayjs.extend(relativeTime);

/**
 * Number of days before expiry at which a client secret is considered about to expire. Hardcoded in
 * the console (not deployment configurable).
 */
const EXPIRY_THRESHOLD_DAYS: number = 14;

/**
 * Expiry state of a client secret.
 */
export enum ClientSecretExpiryState {
    // Not expiring anytime soon.
    ACTIVE = "active",
    // Never expires.
    NEVER = "never",
    // Within the expiry threshold window; also drives the expiry banner.
    EXPIRING = "expiring",
    // Already expired.
    EXPIRED = "expired"
}

/**
 * Resolves the expiry state, humanized expiry duration, and exact expiry date of a client secret.
 *
 * @param secret - Client secret metadata.
 * @param referenceTime - Epoch milliseconds to evaluate the expiry against.
 * @returns Resolved expiry details. `humanizedExpiry` is the duration to/from expiry without a suffix
 * (e.g. "20 days", "a month"); both it and `formattedDate` are null when there is no expiry timestamp.
 */
export const resolveClientSecretExpiry = (
    secret: ClientSecretInterface,
    referenceTime: number = Date.now()
): { state: ClientSecretExpiryState; humanizedExpiry: string | null; formattedDate: string | null } => {

    const expiresAt: number | undefined = secret?.expiresAt;

    if (!expiresAt) {
        /* No expiry timestamp: trust an API-stamped EXPIRED status; otherwise the secret never expires. */
        return {
            formattedDate: null,
            humanizedExpiry: null,
            state: secret?.status === ClientSecretStatus.EXPIRED
                ? ClientSecretExpiryState.EXPIRED
                : ClientSecretExpiryState.NEVER
        };
    }

    const expiryDate: Dayjs = dayjs.unix(expiresAt);
    const refDate: Dayjs = dayjs(referenceTime);

    const formattedDate: string = expiryDate.format("ddd, MMM D, YYYY");
    const humanizedExpiry: string = expiryDate.from(refDate, true);

    /*
     * A secret is expired when the API says so, or when its expiry timestamp is already in the past —
     * the latest secret is built from the OIDC configuration without an API status.
     */
    if (secret?.status === ClientSecretStatus.EXPIRED || expiresAt * 1000 <= referenceTime) {
        return { formattedDate, humanizedExpiry, state: ClientSecretExpiryState.EXPIRED };
    }

    const daysRemaining: number = expiryDate.diff(refDate, "day");
    const state: ClientSecretExpiryState = daysRemaining <= EXPIRY_THRESHOLD_DAYS
        ? ClientSecretExpiryState.EXPIRING
        : ClientSecretExpiryState.ACTIVE;

    return { formattedDate, humanizedExpiry, state };
};

/**
 * Whether at least one client secret is about to expire.
 *
 * @param secrets - List of client secrets.
 * @param referenceTime - Epoch milliseconds to evaluate the expiry against.
 * @returns True when any secret is within the expiry threshold window.
 */
export const hasSecretsAboutToExpire = (
    secrets: ClientSecretInterface[],
    referenceTime: number = Date.now()
): boolean => {

    return (secrets ?? []).some((secret: ClientSecretInterface) =>
        resolveClientSecretExpiry(secret, referenceTime).state === ClientSecretExpiryState.EXPIRING
    );
};
