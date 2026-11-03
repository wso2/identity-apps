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

export interface ReasonPresentation {
    scope: ReasonScope;
    tone: ReasonTone;
    category: ReasonCategory;
    /**
     * Order among reasons in the same place: on a row the first is shown and the rest are a hover
     * away, so the most informative comes first.
     */
    rank: number;
}
