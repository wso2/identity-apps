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

/**
 * Application identifier types used when communicating with CDS APIs.
 */
export enum CDSApplicationIdentifierType {
    /**
     * Applications are identified by the Identity Server application UUID.
     */
    APP_ID = "app_id",
    /**
     * Applications are identified by the OAuth client ID (legacy behavior).
     */
    CLIENT_ID = "client_id"
}

/**
 * CDS Configuration response interface.
 */
export interface CDSConfig {
    /**
     * Is CDS enabled
     */
    cds_enabled: boolean;

    /**
     * List of system application identifiers.
     */
    system_applications: string[];

    /**
     * Whether profiles the engine is confident about are merged without anyone being asked.
     * Off still raises review tasks; it only stops the unattended merge.
     */
    auto_merge_enabled?: boolean;

    /**
     * At or above this score, two profiles are merged automatically.
     */
    auto_merge_threshold?: number;

    /**
     * At or above this score, a pair is raised for a person to decide.
     *
     * This does two jobs: it is the escalation line, and it is also the bar a rule has to
     * clear to count as agreeing. Lowering it widens what counts as agreement, so it can
     * change which rule becomes the primary signal for a merge.
     */
    manual_review_threshold?: number;

    /**
     * Whether a match on an exact rule is final.
     *
     * On, a pair agreeing on any exact rule merges without the remaining rules being
     * consulted. Off, those rules may object and send the pair for review instead. Tolerant
     * rules are unaffected either way.
     */
    deterministic_match_decisive?: boolean;
}

/**
 * CDS Configuration update request interface.
 */
export interface CDSConfigUpdateRequest {
    /**
     * Is CDS enabled
     */
    cds_enabled?: boolean;

    /**
     * List of system application identifiers
     */
    system_applications?: string[];

    auto_merge_enabled?: boolean;
    auto_merge_threshold?: number;
    manual_review_threshold?: number;
    deterministic_match_decisive?: boolean;
}

/**
 * Defaults the server applies when an organisation has never set a value.
 *
 * Both toggles default on so that an organisation upgrading keeps the behaviour it had:
 * reading an absent setting as "off" would silently reroute merges it was relying on.
 */
export const CDS_RESOLUTION_DEFAULTS: {
    autoMergeEnabled: boolean;
    autoMergeThreshold: number;
    manualReviewThreshold: number;
    deterministicMatchDecisive: boolean;
} = {
    autoMergeEnabled: true,
    autoMergeThreshold: 0.95,
    deterministicMatchDecisive: true,
    manualReviewThreshold: 0.75
};

/**
 * The lowest score the server treats as evidence that two values are different. Fixed for
 * every organisation, and the review threshold has to stay above it.
 */
export const CDS_CONTRADICTION_THRESHOLD: number = 0.3;

/**
 * How far below the auto-merge threshold a held-back match is scored. The review threshold
 * has to leave room for it, or a match an objection holds back would fall below review and
 * be dropped instead of escalated.
 */
export const CDS_SCORE_PENALTY_OFFSET: number = 0.01;
