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

import { TFunction } from "react-i18next";
import { ProfileSchemaAttribute, ProfileSchemaFullResponse } from "../models/profile-attributes";
import {
    ReasonCategory,
    ReasonPresentation,
    ReasonScope,
    ReasonTone
} from "../models/review-task-presentation";
import {
    ReviewReason,
    ReviewReasonCode,
    ReviewRuleOutcome,
    ReviewTaskModel,
    RuleVerdict
} from "../models/review-tasks";

/**
 * Reasons that are never shown. Falling short of the automatic merge threshold is true of every
 * task in the queue — it is what puts a pair there — so it tells a reviewer nothing.
 */
const SILENT_REASONS: ReadonlySet<string> = new Set<string>([ ReviewReasonCode.BELOW_AUTO_MERGE_THRESHOLD ]);

/**
 * Every reason the server can send that is shown, and how. A code missing from here — a newer
 * server — is shown as a neutral pair reason with a generic label, never as a raw code.
 */
const REASON_PRESENTATION: Record<
    Exclude<ReviewReasonCode, ReviewReasonCode.BELOW_AUTO_MERGE_THRESHOLD>,
    ReasonPresentation
> = {
    [ ReviewReasonCode.DISCRIMINATING_MISMATCH ]: {
        category: ReasonCategory.EVIDENCE, rank: 0, scope: ReasonScope.ROW, tone: ReasonTone.CRITICAL },
    [ ReviewReasonCode.CONFLICTING_EVIDENCE ]: {
        category: ReasonCategory.EVIDENCE, rank: 1, scope: ReasonScope.ROW, tone: ReasonTone.CAUTION },
    [ ReviewReasonCode.COMMON_VALUE ]: {
        category: ReasonCategory.EVIDENCE, rank: 2, scope: ReasonScope.ROW, tone: ReasonTone.INFO },
    [ ReviewReasonCode.WEAK_SOLE_EVIDENCE ]: {
        category: ReasonCategory.EVIDENCE, rank: 3, scope: ReasonScope.ROW, tone: ReasonTone.INFO },
    [ ReviewReasonCode.REJECTION_RECONSIDERED ]: {
        category: ReasonCategory.HISTORY, rank: 0, scope: ReasonScope.PAIR, tone: ReasonTone.NEUTRAL },
    [ ReviewReasonCode.AUTO_MERGE_FAILED ]: {
        category: ReasonCategory.OPERATIONAL, rank: 1, scope: ReasonScope.PAIR, tone: ReasonTone.NEUTRAL },
    [ ReviewReasonCode.MERGED_WITH_ANOTHER_PROFILE ]: {
        category: ReasonCategory.OPERATIONAL, rank: 2, scope: ReasonScope.PAIR, tone: ReasonTone.NEUTRAL },
    [ ReviewReasonCode.AUTO_MERGE_DISABLED ]: {
        category: ReasonCategory.CONFIGURATION, rank: 3, scope: ReasonScope.PAIR, tone: ReasonTone.NEUTRAL }
};

const UNKNOWN_REASON: ReasonPresentation = {
    category: ReasonCategory.OTHER, rank: 99, scope: ReasonScope.PAIR, tone: ReasonTone.NEUTRAL };

const presentationOf = (reason: ReviewReason): ReasonPresentation =>
    REASON_PRESENTATION[reason.code as keyof typeof REASON_PRESENTATION] ?? UNKNOWN_REASON;

/**
 * The i18n key under `reviewTasks.explanation.reasons` for a reason.
 */
const reasonKey = (reason: ReviewReason): string =>
    (REASON_PRESENTATION[reason.code as keyof typeof REASON_PRESENTATION] ? reason.code : "unknown");

/**
 * A score as a reviewer reads it: two decimal places at most, without trailing zeros — 1, 0, 0.97.
 *
 * It is truncated, not rounded, so a score that fell short never reads as one that did not: 0.996
 * shows as 0.99, never 1. The product is fixed to six places first, so that floating-point error
 * does not pull a whole number of hundredths down a step — 0.29 × 100 is 28.999…, which is 29.
 */
export const formatScore = (score: number): string =>
    String(Math.floor(Number(((score ?? 0) * 100).toFixed(6))) / 100);

/**
 * Display names for attributes, keyed by their full path, from the organization's profile schema.
 */
export type AttributeLabels = Record<string, string>;

export const buildAttributeLabels = (schema: ProfileSchemaFullResponse): AttributeLabels => {
    const labels: AttributeLabels = {};
    const attributes: ProfileSchemaAttribute[] = [
        ...(schema?.identity_attributes ?? []),
        ...(schema?.traits ?? []),
        ...Object.values(schema?.application_data ?? {}).flat()
    ];

    attributes.forEach((attribute: ProfileSchemaAttribute) => {
        if (attribute?.attribute_name && attribute.display_name) {
            labels[attribute.attribute_name] = attribute.display_name;
        }
    });

    return labels;
};

/**
 * An attribute as an administrator knows it: its display name from the schema, or failing that its
 * name without the scope prefix — `emailaddress` rather than `identity_attributes.emailaddress`.
 */
export const describeAttribute = (path: string, labels: AttributeLabels = {}): string =>
    labels[path] ?? (path.split(".").slice(1).join(".") || path);

/**
 * The rule that spoke for the match: the highest-priority rule that agreed.
 */
const getPrimaryRule = (task: ReviewTaskModel): ReviewRuleOutcome | undefined =>
    task.explanation?.rules?.find((rule: ReviewRuleOutcome) => rule.primary);

/**
 * How alike the pair is: the score of the rule that spoke for the match, before anything held the
 * pair back. It is one rule's score, not a combined probability, and only orders the queue.
 *
 * A task raised before explanations were recorded has only its breakdown, so its best attribute
 * score stands in.
 */
const getSimilarity = (task: ReviewTaskModel): number => {
    const primary: ReviewRuleOutcome = getPrimaryRule(task);

    if (primary?.score !== undefined) {
        return primary.score;
    }

    return Math.max(0, ...Object.values(task.score_breakdown ?? {}));
};

/**
 * The queue's order: explained tasks first, most alike first, oldest first among equals. A task
 * raised before explanations were recorded has the least to show a reviewer, so it goes last rather
 * than leading on a fallback score.
 */
export const compareReviewTasks = (a: ReviewTaskModel, b: ReviewTaskModel): number =>
    Number(!a.explanation) - Number(!b.explanation)
        || getSimilarity(b) - getSimilarity(a)
        || (a.created_at ?? "").localeCompare(b.created_at ?? "");

/**
 * The reasons a task records that are shown.
 */
const getShownReasons = (task: ReviewTaskModel): ReviewReason[] => (task.explanation?.reasons ?? [])
    .filter((reason: ReviewReason) => !SILENT_REASONS.has(reason.code));

/**
 * The reasons about the pair as a whole, in a stable order.
 */
export const getPairReasons = (task: ReviewTaskModel): ReviewReason[] => getShownReasons(task)
    .filter((reason: ReviewReason) => presentationOf(reason).scope === ReasonScope.PAIR)
    .sort((a: ReviewReason, b: ReviewReason) => presentationOf(a).rank - presentationOf(b).rank);

/**
 * The reasons that name a rule, for its row, most informative first. They are matched on rule ID
 * alone: a reason that names several rules — a conflict across email and phone — appears on each of
 * their rows, and a rule no reason names carries none, whatever its attribute type.
 */
export const getRowReasons = (task: ReviewTaskModel, rule: ReviewRuleOutcome): ReviewReason[] =>
    getShownReasons(task)
        .filter((reason: ReviewReason) =>
            presentationOf(reason).scope === ReasonScope.ROW && (reason.rule_ids ?? []).includes(rule.rule_id))
        .sort((a: ReviewReason, b: ReviewReason) => presentationOf(a).rank - presentationOf(b).rank);

export const getReasonTone = (reason: ReviewReason): ReasonTone => presentationOf(reason).tone;

export const getReasonCategory = (reason: ReviewReason): ReasonCategory => presentationOf(reason).category;

/**
 * A short label for a reason.
 */
export const describeReasonLabel = (reason: ReviewReason, t: TFunction): string =>
    t(`customerDataService:reviewTasks.explanation.reasons.${ reasonKey(reason) }.label`);

/**
 * The attributes a reason names, joined for a sentence.
 */
const describeRules = (task: ReviewTaskModel, ruleIds: string[] = [], labels: AttributeLabels): string => ruleIds
    .map((ruleId: string) => task.explanation?.rules?.find((rule: ReviewRuleOutcome) => rule.rule_id === ruleId))
    .filter(Boolean)
    .map((rule: ReviewRuleOutcome) => describeAttribute(rule.property_name, labels))
    .join(", ");

/**
 * A reason in full, for its tooltip: the specifics — which attributes, what earlier score — that the
 * label leaves out.
 */
export const describeReason = (
    task: ReviewTaskModel,
    reason: ReviewReason,
    t: TFunction,
    labels: AttributeLabels = {}
): string => {
    const key: string = `customerDataService:reviewTasks.explanation.reasons.${ reasonKey(reason) }`;
    const attributes: string = describeRules(task, reason.rule_ids, labels);

    switch (reason.code) {
        case ReviewReasonCode.COMMON_VALUE:
            return t(`${ key }.sentence`, { attribute: attributes, count: reason.shared_by_at_least });
        case ReviewReasonCode.REJECTION_RECONSIDERED:
            // Back either because a rule agrees that did not, which names it, or because the match
            // as a whole grew stronger, which names nothing.
            return t(attributes ? `${ key }.sentence` : `${ key }.sentenceStronger`, {
                attributes,
                score: formatScore(reason.previous_similarity)
            });
        default:
            return t(`${ key }.sentence`, { attribute: attributes, attributes });
    }
};

/**
 * Where a rule sits in the comparison: what agreed, then what differed, then what could not be read
 * either way, then what could not be compared.
 */
const VERDICT_ORDER: Record<string, number> = {
    [ RuleVerdict.AGREE ]: 0,
    [ RuleVerdict.DISAGREE ]: 1,
    [ RuleVerdict.INCONCLUSIVE ]: 2,
    [ RuleVerdict.UNKNOWN ]: 3
};

/**
 * The rules in the order the comparison shows them. The rule that spoke for the match leads the
 * agreements; otherwise rules keep their priority order. A task raised before explanations has no
 * verdicts, so its rows run from the highest score down.
 */
export const orderRulesForComparison = (rules: ReviewRuleOutcome[]): ReviewRuleOutcome[] => [ ...rules ].sort(
    (a: ReviewRuleOutcome, b: ReviewRuleOutcome) =>
        (VERDICT_ORDER[a.verdict] ?? 4) - (VERDICT_ORDER[b.verdict] ?? 4)
            || Number(Boolean(b.primary)) - Number(Boolean(a.primary))
            || (b.verdict ? 0 : (b.score ?? 0) - (a.score ?? 0))
            || (a.priority ?? 0) - (b.priority ?? 0)
);
