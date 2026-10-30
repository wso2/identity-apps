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

import { t } from "react-i18next";
import { describe, expect, it } from "vitest";
import {
    chen,
    conflictAcrossRules,
    corroborated,
    jonathon,
    katherine,
    legacy,
    marcus,
    priyanka,
    unrecognised
} from "./fixtures/review-tasks";
import { ProfileSchemaFullResponse } from "../models/profile-attributes";
import { ReviewReason, ReviewRuleOutcome, ReviewTaskModel, RuleVerdict } from "../models/review-tasks";
import {
    ReasonCategory,
    ReasonTone,
    buildAttributeLabels,
    compareReviewTasks,
    describeAttribute,
    describeReason,
    describeReasonLabel,
    formatScore,
    getPairReasons,
    getReasonCategory,
    getReasonTone,
    getRowReasons,
    orderRulesForComparison
} from "../utils/review-task-utils";

const ruleOf = (task: ReviewTaskModel, ruleId: string): ReviewRuleOutcome =>
    task.explanation.rules.find((rule: ReviewRuleOutcome) => rule.rule_id === ruleId);

const codes = (reasons: ReviewReason[]): string[] => reasons.map((reason: ReviewReason) => reason.code);

describe("Review task reasons", () => {

    it("puts a reconsidered rejection in the review context and marks no agreeing row", () => {
        expect(codes(getPairReasons(priyanka))).toEqual([ "REJECTION_RECONSIDERED" ]);
        expect(getRowReasons(priyanka, ruleOf(priyanka, "email"))).toEqual([]);
        expect(getRowReasons(priyanka, ruleOf(priyanka, "name"))).toEqual([]);
    });

    it("puts automatic merging disabled in the review context and marks no agreeing row", () => {
        expect(codes(getPairReasons(chen))).toEqual([ "AUTO_MERGE_DISABLED" ]);
        expect(getRowReasons(chen, ruleOf(chen, "name"))).toEqual([]);
    });

    it("marks a lone match and a conflicting difference on their own rows only", () => {
        expect(getPairReasons(marcus)).toEqual([]);
        expect(codes(getRowReasons(marcus, ruleOf(marcus, "name")))).toEqual([ "WEAK_SOLE_EVIDENCE" ]);
        expect(codes(getRowReasons(marcus, ruleOf(marcus, "email")))).toEqual([ "CONFLICTING_EVIDENCE" ]);
        expect(getRowReasons(marcus, ruleOf(marcus, "mobile"))).toEqual([]);
    });

    it("leads a row with its most informative reason when several name it", () => {
        expect(getPairReasons(katherine)).toEqual([]);
        expect(codes(getRowReasons(katherine, ruleOf(katherine, "dob"))))
            .toEqual([ "DISCRIMINATING_MISMATCH", "CONFLICTING_EVIDENCE" ]);
    });

    it("leaves the merge threshold out beside another reason, and keeps the lone match for its row", () => {
        expect(getPairReasons(jonathon)).toEqual([]);
        expect(codes(getRowReasons(jonathon, ruleOf(jonathon, "name")))).toEqual([ "WEAK_SOLE_EVIDENCE" ]);
        expect(getRowReasons(jonathon, ruleOf(jonathon, "city"))).toEqual([]);
    });

    it("shows the merge threshold when it is the only explanation", () => {
        expect(codes(getPairReasons(corroborated))).toEqual([ "BELOW_AUTO_MERGE_THRESHOLD" ]);
    });

    it("says what each pair reason is due to", () => {
        expect(getReasonCategory({ code: "REJECTION_RECONSIDERED" })).toBe(ReasonCategory.HISTORY);
        expect(getReasonCategory({ code: "AUTO_MERGE_DISABLED" })).toBe(ReasonCategory.CONFIGURATION);
        expect(getReasonCategory({ code: "AUTO_MERGE_FAILED" })).toBe(ReasonCategory.OPERATIONAL);
        expect(getReasonCategory({ code: "MERGED_WITH_ANOTHER_PROFILE" })).toBe(ReasonCategory.OPERATIONAL);
        expect(getReasonCategory({ code: "BELOW_AUTO_MERGE_THRESHOLD" })).toBe(ReasonCategory.EVIDENCE);
    });

    it("shows a reason that names several rules on each of their rows, naming all of them", () => {
        const email: ReviewReason[] = getRowReasons(conflictAcrossRules, ruleOf(conflictAcrossRules, "email"));
        const mobile: ReviewReason[] = getRowReasons(conflictAcrossRules, ruleOf(conflictAcrossRules, "mobile"));

        expect(codes(email)).toEqual([ "CONFLICTING_EVIDENCE" ]);
        expect(codes(mobile)).toEqual([ "CONFLICTING_EVIDENCE" ]);
        expect(describeReason(conflictAcrossRules, email[0], t, {}))
            .toContain("emailaddress, mobile");
    });

    it("presents an unrecognised reason as a neutral pair reason with a generic label", () => {
        expect(codes(getPairReasons(unrecognised))).toEqual([ "SOMETHING_NEW" ]);
        expect(getReasonTone(getPairReasons(unrecognised)[0])).toBe(ReasonTone.NEUTRAL);
        expect(describeReasonLabel(getPairReasons(unrecognised)[0], t))
            .toBe("customerDataService:reviewTasks.explanation.reasons.unknown.label");
    });

    it("tones a reason by how it bears on the match", () => {
        expect(getReasonTone({ code: "DISCRIMINATING_MISMATCH" })).toBe(ReasonTone.CRITICAL);
        expect(getReasonTone({ code: "CONFLICTING_EVIDENCE" })).toBe(ReasonTone.CAUTION);
        expect(getReasonTone({ code: "WEAK_SOLE_EVIDENCE" })).toBe(ReasonTone.INFO);
        expect(getReasonTone({ code: "COMMON_VALUE" })).toBe(ReasonTone.INFO);
        expect(getReasonTone({ code: "BELOW_AUTO_MERGE_THRESHOLD" })).toBe(ReasonTone.NEUTRAL);
    });

    it("formats scores without trailing zeros", () => {
        expect([ 1, 0, 0.97, 0.9214, 0.5 ].map(formatScore)).toEqual([ "1", "0", "0.97", "0.92", "0.5" ]);
    });

    it("explains a reconsidered rejection by the rules that newly agree, or by strength when none do", () => {
        const byRule: ReviewReason = getPairReasons(priyanka)[0];

        expect(describeReason(priyanka, byRule, t, {}))
            .toBe("customerDataService:reviewTasks.explanation.reasons.REJECTION_RECONSIDERED.sentence"
                + "emailaddress.1");
        expect(describeReason(priyanka, { ...byRule, rule_ids: [] }, t, {}))
            .toBe("customerDataService:reviewTasks.explanation.reasons.REJECTION_RECONSIDERED.sentenceStronger"
                + ".1");
    });
});

describe("Review task comparison", () => {

    it("orders rows by what agreed, differed, was inconclusive, then could not be compared", () => {
        const ordered: string[] = orderRulesForComparison([
            ...marcus.explanation.rules,
            { ...ruleOf(jonathon, "city"), rule_id: "city" }
        ]).map((rule: ReviewRuleOutcome) => rule.rule_id);

        expect(ordered).toEqual([ "name", "email", "city", "mobile" ]);
    });

    it("leads the agreements with the rule that spoke for the match", () => {
        const ordered: string[] = orderRulesForComparison([
            { ...ruleOf(priyanka, "name") },
            { ...ruleOf(priyanka, "email") }
        ]).map((rule: ReviewRuleOutcome) => rule.rule_id);

        expect(ordered).toEqual([ "email", "name" ]);
    });

    it("orders the rows of a task without an explanation by score", () => {
        const rows: ReviewRuleOutcome[] = Object.entries(legacy.score_breakdown)
            .map(([ path, score ]: [ string, number ]) => ({
                attribute_type: "", match_strength: "", mismatch_strength: "", priority: 0,
                property_name: path, rule_id: path, rule_name: path, score, unification_method: "",
                verdict: null
            }));

        expect(orderRulesForComparison(rows).map((rule: ReviewRuleOutcome) => rule.score)).toEqual([ 1, 0.95 ]);
    });

    it("sorts tasks without an explanation after those with one", () => {
        const sorted: string[] = [ legacy, jonathon, marcus ].sort(compareReviewTasks)
            .map((task: ReviewTaskModel) => task.id);

        expect(sorted).toEqual([ "marcus", "jonathon", "legacy" ]);
    });

    it("never reads an unknown verdict as a score", () => {
        expect(ruleOf(marcus, "mobile").verdict).toBe(RuleVerdict.UNKNOWN);
        expect(ruleOf(marcus, "mobile").score).toBeUndefined();
    });
});

describe("Attribute labels", () => {

    it("names attributes by their schema display name, falling back to the name without its scope", () => {
        const labels: Record<string, string> = buildAttributeLabels({
            application_data: {},
            identity_attributes: [
                { attribute_name: "identity_attributes.fullname", display_name: "Full name" }
            ],
            traits: []
        } as unknown as ProfileSchemaFullResponse);

        expect(describeAttribute("identity_attributes.fullname", labels)).toBe("Full name");
        expect(describeAttribute("identity_attributes.dob", labels)).toBe("dob");
    });
});
