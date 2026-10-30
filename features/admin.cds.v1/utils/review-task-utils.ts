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
    ReviewReason,
    ReviewReasonCode,
    ReviewRuleOutcome,
    ReviewTaskModel,
    RuleVerdict
} from "../models/review-tasks";

/**
 * How a reason reads. A contradiction is marked by how strongly it argues against the match: an
 * attribute that tells people apart differing is critical, a conflicting one is a caution. A limit
 * on what a match can do on its own is information, not a problem with the data. Context about the
 * pair — a setting, a history — stays neutral.
 */
export enum ReasonTone {
    NEUTRAL = "neutral",
    INFO = "info",
    CAUTION = "caution",
    CRITICAL = "critical"
}

/**
 * Where a reason is shown. A pair reason is about the pair as a whole and sits above the
 * comparison; a row reason qualifies the evidence of the rules it names and sits in their rows.
 */
export enum ReasonScope {
    PAIR = "pair",
    ROW = "row"
}

/**
 * What a reason says the review is due to: the matching evidence itself, an earlier decision on the
 * pair, how the organization is configured, or something that went wrong while merging.
 */
export enum ReasonCategory {
    EVIDENCE = "evidence",
    HISTORY = "history",
    CONFIGURATION = "configuration",
    OPERATIONAL = "operational",
    /**
     * A reason this Console does not recognize, from a newer server.
     */
    OTHER = "other"
}

interface ReasonPresentation {
    scope: ReasonScope;
    tone: ReasonTone;
    category: ReasonCategory;
    /**
     * Order among reasons in the same place: on a row the first is shown and the rest are a hover
     * away, so the most informative comes first.
     */
    rank: number;
}

/**
 * Every reason the server can send, and how it is presented. A code missing from here — a newer
 * server — is shown as a neutral pair reason with a generic label, never as a raw code.
 */
const REASON_PRESENTATION: Record<ReviewReasonCode, ReasonPresentation> = {
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
        category: ReasonCategory.CONFIGURATION, rank: 3, scope: ReasonScope.PAIR, tone: ReasonTone.NEUTRAL },
    [ ReviewReasonCode.BELOW_AUTO_MERGE_THRESHOLD ]: {
        category: ReasonCategory.EVIDENCE, rank: 4, scope: ReasonScope.PAIR, tone: ReasonTone.NEUTRAL }
};

const UNKNOWN_REASON: ReasonPresentation = {
    category: ReasonCategory.OTHER, rank: 99, scope: ReasonScope.PAIR, tone: ReasonTone.NEUTRAL };

const presentationOf = (reason: ReviewReason): ReasonPresentation =>
    REASON_PRESENTATION[reason.code as ReviewReasonCode] ?? UNKNOWN_REASON;

/**
 * The i18n key under `reviewTasks.explanation.reasons` for a reason.
 */
const reasonKey = (reason: ReviewReason): string =>
    (REASON_PRESENTATION[reason.code as ReviewReasonCode] ? reason.code : "unknown");

/**
 * A score as a reviewer reads it: two decimal places at most, without trailing zeros — 1, 0, 0.97.
 */
export const formatScore = (score: number): string => String(Number((score ?? 0).toFixed(2)));

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
export const getPrimaryRule = (task: ReviewTaskModel): ReviewRuleOutcome | undefined =>
    task.explanation?.rules?.find((rule: ReviewRuleOutcome) => rule.primary);

/**
 * How alike the pair is: the score of the rule that spoke for the match, before anything held the
 * pair back. It is one rule's score, not a combined probability, and only orders the queue.
 *
 * A task raised before explanations were recorded has only its breakdown, so its best attribute
 * score stands in.
 */
export const getSimilarity = (task: ReviewTaskModel): number => {
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
 * The reasons about the pair as a whole, in a stable order.
 *
 * The match falling short of the automatic merge threshold is shown only when nothing else explains
 * the review. With the default threshold of 1 every fuzzy match falls short, so beside another
 * reason it repeats what the row's score already shows; alone — two rules agree, neither is strong
 * enough, and nothing objects — it is the whole explanation.
 */
export const getPairReasons = (task: ReviewTaskModel): ReviewReason[] => {
    const reasons: ReviewReason[] = task.explanation?.reasons ?? [];

    return reasons
        .filter((reason: ReviewReason) => presentationOf(reason).scope === ReasonScope.PAIR)
        .filter((reason: ReviewReason) =>
            reason.code !== ReviewReasonCode.BELOW_AUTO_MERGE_THRESHOLD || reasons.length === 1)
        .sort((a: ReviewReason, b: ReviewReason) => presentationOf(a).rank - presentationOf(b).rank);
};

/**
 * The reasons that name a rule, for its row, most informative first. They are matched on rule ID
 * alone: a reason that names several rules — a conflict across email and phone — appears on each of
 * their rows, and a rule no reason names carries none, whatever its attribute type.
 */
export const getRowReasons = (task: ReviewTaskModel, rule: ReviewRuleOutcome): ReviewReason[] =>
    (task.explanation?.reasons ?? [])
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
 * A reason in full, for its tooltip: the specifics — which attributes, what score, what threshold —
 * that the label leaves out.
 */
export const describeReason = (
    task: ReviewTaskModel,
    reason: ReviewReason,
    t: TFunction,
    labels: AttributeLabels = {}
): string => {
    const key: string = `customerDataService:reviewTasks.explanation.reasons.${ reasonKey(reason) }`;
    const attributes: string = describeRules(task, reason.rule_ids, labels);
    const primary: ReviewRuleOutcome = getPrimaryRule(task);

    switch (reason.code) {
        case ReviewReasonCode.BELOW_AUTO_MERGE_THRESHOLD:
            return t(`${ key }.sentence`, {
                attribute: attributes || describeAttribute(primary?.property_name ?? "", labels),
                score: formatScore(primary?.score),
                threshold: formatScore(reason.threshold ?? 1)
            });
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
