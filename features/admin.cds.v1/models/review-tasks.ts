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
    /**
     * How alike the pair was judged to be, between 0 and 1.
     */
    match_score: number;
    status: ReviewTaskStatus;
    /**
     * The rule the match was attributed to, where one was recorded.
     */
    match_reason?: string;
    /**
     * Each rule that had something to compare, and what it scored. The overall score is the
     * score of the rule that decided, not a combination of these — so a rule can appear here
     * scoring higher than the task itself.
     */
    score_breakdown?: Record<string, number>;
    created_at: string;
    resolved_at?: string;
    resolved_by?: string;
    notes?: string;
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
