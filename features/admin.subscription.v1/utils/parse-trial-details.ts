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

import { TrialDetailsInterface } from "../models/trial";

const DEFAULT_TRIAL_DETAILS: TrialDetailsInterface = {
    isTrialEnabled: false,
    isTrialExpired: false
};

/**
 * Parses the trialDetails JSON string from the SCIM trialDetails attribute.
 * The attribute stores data as a stringified JSON object
 * e.g. "\{'isTrialEnabled': true, 'isTrialExpired': false\}".
 *
 * Handles null, undefined, empty, partial, and malformed values gracefully.
 *
 * @param trialDetailsRaw - The raw trialDetails string from SCIM2.
 * @returns Parsed trial details with safe defaults.
 */
export const parseTrialDetails = (
    trialDetailsRaw: string | undefined | null
): TrialDetailsInterface => {
    if (!trialDetailsRaw) {
        return DEFAULT_TRIAL_DETAILS;
    }

    try {
        const normalized: string = trialDetailsRaw.replace(/'/g, "\"");
        const parsed: Record<string, unknown> = JSON.parse(normalized);

        return {
            isTrialEnabled: parsed?.isTrialEnabled === true,
            isTrialExpired: parsed?.isTrialExpired === true
        };
    } catch (_error: unknown) {
        return DEFAULT_TRIAL_DETAILS;
    }
};
