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
 * Where a review task stands.
 *
 * APPROVED and REJECTED are final. CANCELLED is not: it is applied when something else
 * unified one of the two profiles first, and the same pair can be raised again afterwards.
 */
enum ReviewTaskStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}

/**
 * What an administrator decided about a pair.
 */
export enum ReviewDecision {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface ReviewTaskModel {
    id: string;
    org_handle: string;
    /**
     * The profile whose write raised the task.
     */
    incoming_profile_id: string;
    /**
     * The profile it was found to resemble.
     */
    candidate_profile_id: string;
    status: ReviewTaskStatus;
    /**
     * Each rule that had something to compare, and what it scored, keyed by attribute.
     */
    score_breakdown?: Record<string, number>;
    /**
     * What every rule found and why the pair was held for review. Absent on a task raised
     * before the server recorded explanations; the breakdown is all there is for those.
     */
    explanation?: ReviewTaskExplanation;
    created_at: string;
    resolved_at?: string;
    resolved_by?: string;
    notes?: string;
}

/**
 * A rule's reading of the pair.
 */
export enum RuleVerdict {
    /**
     * Both values present and similar enough to support the match.
     */
    AGREE = "AGREE",
    /**
     * Both values present, neither close enough to support the match nor far enough to oppose it.
     */
    INCONCLUSIVE = "INCONCLUSIVE",
    /**
     * Both values present and clearly different.
     */
    DISAGREE = "DISAGREE",
    /**
     * One side had no value, so the rule had nothing to compare.
     */
    UNKNOWN = "UNKNOWN"
}

/**
 * Why a pair was held for review rather than merged. The server sends codes, not sentences,
 * so the wording is the Console's.
 */
export enum ReviewReasonCode {
    BELOW_AUTO_MERGE_THRESHOLD = "BELOW_AUTO_MERGE_THRESHOLD",
    DISCRIMINATING_MISMATCH = "DISCRIMINATING_MISMATCH",
    CONFLICTING_EVIDENCE = "CONFLICTING_EVIDENCE",
    WEAK_SOLE_EVIDENCE = "WEAK_SOLE_EVIDENCE",
    COMMON_VALUE = "COMMON_VALUE",
    AUTO_MERGE_DISABLED = "AUTO_MERGE_DISABLED",
    REJECTION_RECONSIDERED = "REJECTION_RECONSIDERED",
    AUTO_MERGE_FAILED = "AUTO_MERGE_FAILED",
    MERGED_WITH_ANOTHER_PROFILE = "MERGED_WITH_ANOTHER_PROFILE"
}

/**
 * What one rule found for the pair, as it stood when the task was raised.
 */
export interface ReviewRuleOutcome {
    rule_id: string;
    rule_name: string;
    property_name: string;
    attribute_type: string;
    unification_method: string;
    priority: number;
    match_strength: string;
    mismatch_strength: string;
    /**
     * Absent when the rule had nothing to compare.
     */
    score?: number;
    verdict: RuleVerdict;
    /**
     * The rule that spoke for the match: the highest-priority rule that agreed.
     */
    primary?: boolean;
}

/**
 * One reason the pair was held, with the rules it is about.
 */
export interface ReviewReason {
    code: ReviewReasonCode | string;
    rule_ids?: string[];
    /**
     * On BELOW_AUTO_MERGE_THRESHOLD: the automatic merge threshold at the time.
     */
    threshold?: number;
    /**
     * On COMMON_VALUE: how many profiles share a value for it to count as common.
     */
    shared_by_at_least?: number;
    /**
     * On REJECTION_RECONSIDERED: how alike the pair was when it was rejected.
     */
    previous_similarity?: number;
}

export interface ReviewTaskExplanation {
    rules: ReviewRuleOutcome[];
    reasons: ReviewReason[];
}

interface ReviewTaskPagination {
    count: number;
    page_size: number;
}

export interface ReviewTaskListResponse {
    pagination: ReviewTaskPagination;
    tasks: ReviewTaskModel[];
}

/**
 * Resolving a task is not only a status change: approving it unifies the two profiles,
 * rejecting it records the pair so the same match is not proposed again unless the evidence
 * materially improves.
 */
export interface ResolveReviewTaskPayload {
    decision: ReviewDecision;
    notes?: string;
}
