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

import { ProfileModel } from "../../models/profiles";
import {
    ReviewReason,
    ReviewRuleOutcome,
    ReviewTaskModel,
    RuleVerdict
} from "../../models/review-tasks";

/**
 * Review tasks shaped as the server returns them, one per scenario the review page has to explain.
 */

const rule = (
    id: string,
    property: string,
    verdict: RuleVerdict,
    score?: number,
    primary?: boolean
): ReviewRuleOutcome => ({
    attribute_type: "",
    match_strength: "",
    mismatch_strength: "",
    priority: 1,
    property_name: `identity_attributes.${ property }`,
    rule_id: id,
    rule_name: id,
    unification_method: "",
    verdict,
    ...(score !== undefined ? { score } : {}),
    ...(primary ? { primary } : {})
});

const task = (
    id: string,
    rules: ReviewRuleOutcome[],
    reasons: ReviewReason[],
    createdAt: string = "2026-10-30T04:00:00Z"
): ReviewTaskModel => ({
    candidate_profile_id: `${ id }-b`,
    created_at: createdAt,
    explanation: { reasons, rules },
    id,
    incoming_profile_id: `${ id }-a`,
    org_handle: "acme",
    status: "PENDING"
} as unknown as ReviewTaskModel);

/**
 * Rejected before; email and name both agree.
 */
export const priyanka: ReviewTaskModel = task("priyanka", [
    rule("email", "emailaddress", RuleVerdict.AGREE, 1, true),
    rule("name", "fullname", RuleVerdict.AGREE, 1)
], [
    { code: "REJECTION_RECONSIDERED", previous_similarity: 1, rule_ids: [ "email" ] }
]);

/**
 * Would have merged on email; automatic merging is disabled.
 */
export const chen: ReviewTaskModel = task("chen", [
    rule("email", "emailaddress", RuleVerdict.AGREE, 1, true),
    rule("name", "fullname", RuleVerdict.AGREE, 1)
], [
    { code: "AUTO_MERGE_DISABLED" }
]);

/**
 * Same name, different email, mobile on one side only.
 */
export const marcus: ReviewTaskModel = task("marcus", [
    rule("email", "emailaddress", RuleVerdict.DISAGREE, 0),
    rule("mobile", "mobile", RuleVerdict.UNKNOWN),
    rule("name", "fullname", RuleVerdict.AGREE, 1, true)
], [
    { code: "CONFLICTING_EVIDENCE", rule_ids: [ "email" ] },
    { code: "WEAK_SOLE_EVIDENCE", rule_ids: [ "name" ] }
]);

/**
 * A close name and different dates of birth: two reasons name the dob rule.
 */
export const katherine: ReviewTaskModel = task("katherine", [
    rule("dob", "dob", RuleVerdict.DISAGREE, 0),
    rule("name", "fullname", RuleVerdict.AGREE, 0.97, true)
], [
    { code: "BELOW_AUTO_MERGE_THRESHOLD", rule_ids: [ "name" ], threshold: 1 },
    { code: "DISCRIMINATING_MISMATCH", rule_ids: [ "dob" ] },
    { code: "CONFLICTING_EVIDENCE", rule_ids: [ "dob" ] },
    { code: "WEAK_SOLE_EVIDENCE", rule_ids: [ "name" ] }
]);

/**
 * A similar name alone, and an inconclusive city.
 */
export const jonathon: ReviewTaskModel = task("jonathon", [
    rule("name", "fullname", RuleVerdict.AGREE, 0.92, true),
    rule("city", "locality", RuleVerdict.INCONCLUSIVE, 0.5)
], [
    { code: "BELOW_AUTO_MERGE_THRESHOLD", rule_ids: [ "name" ], threshold: 1 },
    { code: "WEAK_SOLE_EVIDENCE", rule_ids: [ "name" ] }
]);

/**
 * Two rules agree, neither strongly enough, and nothing objects: falling short of the threshold is
 * the whole explanation.
 */
export const corroborated: ReviewTaskModel = task("corroborated", [
    rule("name", "fullname", RuleVerdict.AGREE, 0.94, true),
    rule("city", "locality", RuleVerdict.AGREE, 0.85)
], [
    { code: "BELOW_AUTO_MERGE_THRESHOLD", rule_ids: [ "name" ], threshold: 1 }
]);

/**
 * One conflict that names two rules.
 */
export const conflictAcrossRules: ReviewTaskModel = task("conflict", [
    rule("name", "fullname", RuleVerdict.AGREE, 1, true),
    rule("email", "emailaddress", RuleVerdict.DISAGREE, 0),
    rule("mobile", "mobile", RuleVerdict.DISAGREE, 0)
], [
    { code: "CONFLICTING_EVIDENCE", rule_ids: [ "email", "mobile" ] }
]);

/**
 * A reason code this Console does not know.
 */
export const unrecognised: ReviewTaskModel = task("unrecognised", [
    rule("name", "fullname", RuleVerdict.AGREE, 1, true)
], [
    { code: "SOMETHING_NEW" }
]);

/**
 * Raised before the server recorded explanations: a breakdown and nothing else.
 */
export const legacy: ReviewTaskModel = {
    candidate_profile_id: "legacy-b",
    created_at: "2026-10-01T00:00:00Z",
    id: "legacy",
    incoming_profile_id: "legacy-a",
    org_handle: "acme",
    score_breakdown: { "identity_attributes.fullname": 0.95, "identity_attributes.mobile": 1 },
    status: "PENDING"
} as unknown as ReviewTaskModel;

const profile = (id: string, attributes: Record<string, string>): ProfileModel => ({
    identity_attributes: attributes,
    profile_id: id
} as unknown as ProfileModel);

export const profiles: Record<string, ProfileModel> = {
    "jonathon-a": profile("jonathon-a", { fullname: "Jonathon Albrite", locality: "Colombo 07" }),
    "jonathon-b": profile("jonathon-b", { fullname: "Jonathan Albright", locality: "Colombo 03" }),
    "katherine-a": profile("katherine-a", { dob: "1985-06-12", fullname: "Katharine Jones" }),
    "katherine-b": profile("katherine-b", { dob: "1990-01-01", fullname: "Katherine Jones" }),
    "legacy-a": profile("legacy-a", { fullname: "Ravi Pereira", mobile: "0771234567" }),
    "legacy-b": profile("legacy-b", { fullname: "Ravi Perera", mobile: "+94 77 123 4567" }),
    "marcus-a": profile("marcus-a", { emailaddress: "mdelacroix@othermail.io", fullname: "Marcus Delacroix" }),
    "marcus-b": profile("marcus-b", {
        emailaddress: "marcus.d@cdsfuzz.io", fullname: "Marcus Delacroix", mobile: "+94 77 555 0101" }),
    "priyanka-a": profile("priyanka-a", {
        emailaddress: "priyanka.w@cdsfuzz.io", fullname: "Wickramasinghe Priyanka" }),
    "priyanka-b": profile("priyanka-b", {
        emailaddress: "priyanka.w@cdsfuzz.io", fullname: "Priyanka Wickramasinghe" })
};
