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

import { fireEvent, render, screen, within } from "@wso2is/unit-testing/utils";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import {
    chen,
    corroborated,
    jonathon,
    katherine,
    legacy,
    marcus,
    priyanka,
    profiles
} from "./fixtures/review-tasks";
import ReviewTaskList from "../components/review-task-list";
import { ReviewTaskModel } from "../models/review-tasks";
import "@testing-library/jest-dom";

const LIST: string = "cds-review-task-list";
const REASONS: string = "customerDataService:reviewTasks.explanation.reasons";
const MATCH: string = "customerDataService:reviewTasks.explanation.match";

const renderExpanded = (tasks: ReviewTaskModel[]): void => {
    render(
        <ReviewTaskList
            tasks={ tasks }
            profiles={ profiles }
            failedProfileIds={ [] }
            isLoading={ false }
            canResolve={ true }
            onResolve={ vi.fn() }
            attributeLabels={ { "identity_attributes.fullname": "Full name" } }
        />
    );
    tasks.forEach((task: ReviewTaskModel) => fireEvent.click(screen.getByTestId(`${ LIST }-toggle-${ task.id }`)));
};

const row = (taskId: string, ruleId: string): HTMLElement => screen.getByTestId(`${ LIST }-rule-${ taskId }-${ ruleId }`);

const chipCodes = (element: HTMLElement): string[] =>
    Array.from(element.querySelectorAll(`[data-componentid^="${ LIST }-reason-"]`))
        .map((chip: Element) => chip.getAttribute("data-componentid").split("-").pop());

describe("ReviewTaskList", () => {

    it("keeps the header controls", () => {
        renderExpanded([ marcus ]);

        expect(screen.getByTestId(`${ LIST }-approve-marcus`)).toBeInTheDocument();
        expect(screen.getByTestId(`${ LIST }-reject-marcus`)).toBeInTheDocument();
    });

    it("shows a reconsidered rejection as review context, with no reason on agreeing rows", () => {
        renderExpanded([ priyanka ]);

        expect(chipCodes(screen.getByTestId(`${ LIST }-context-priyanka`))).toEqual([ "REJECTION_RECONSIDERED" ]);
        expect(chipCodes(row("priyanka", "email"))).toEqual([]);
        expect(chipCodes(row("priyanka", "name"))).toEqual([]);
    });

    it("shows automatic merging disabled as review context, with no weakness label", () => {
        renderExpanded([ chen ]);

        expect(chipCodes(screen.getByTestId(`${ LIST }-context-chen`))).toEqual([ "AUTO_MERGE_DISABLED" ]);
        expect(screen.queryByText(`${ REASONS }.WEAK_SOLE_EVIDENCE.label`)).not.toBeInTheDocument();
    });

    it("puts each rule's reason in its Match cell, and shows an uncompared rule as not compared", () => {
        renderExpanded([ marcus ]);

        expect(screen.queryByTestId(`${ LIST }-context-marcus`)).not.toBeInTheDocument();
        expect(within(row("marcus", "name")).getByText(`${ MATCH }.agree1`)).toBeInTheDocument();
        expect(chipCodes(row("marcus", "name"))).toEqual([ "WEAK_SOLE_EVIDENCE" ]);
        expect(within(row("marcus", "email")).getByText(`${ MATCH }.differs0`)).toBeInTheDocument();
        expect(chipCodes(row("marcus", "email"))).toEqual([ "CONFLICTING_EVIDENCE" ]);

        const mobile: HTMLElement = row("marcus", "mobile");

        expect(within(mobile).getByText(`${ MATCH }.notCompared`)).toBeInTheDocument();
        expect(within(mobile).queryByText(`${ MATCH }.differs0`)).not.toBeInTheDocument();
    });

    it("shows every reason that names a row, most informative first", () => {
        renderExpanded([ katherine ]);

        expect(screen.queryByTestId(`${ LIST }-context-katherine`)).not.toBeInTheDocument();
        expect(chipCodes(row("katherine", "dob"))).toEqual([ "DISCRIMINATING_MISMATCH", "CONFLICTING_EVIDENCE" ]);
    });

    it("marks a lone similar match as insufficient alone, and nothing on an inconclusive row", () => {
        renderExpanded([ jonathon ]);

        expect(chipCodes(row("jonathon", "name"))).toEqual([ "WEAK_SOLE_EVIDENCE" ]);
        expect(chipCodes(row("jonathon", "city"))).toEqual([]);
    });

    it("names each verdict with its score, and gives each its own style", () => {
        renderExpanded([ marcus, jonathon ]);

        const kind = (element: HTMLElement): string =>
            [ "exact", "agree", "inconclusive", "differs", "not-compared" ].find((name: string) =>
                element.querySelector(".review-task-verdict-chip").classList.contains(name));

        expect(kind(row("marcus", "name"))).toBe("exact");
        expect(kind(row("jonathon", "name"))).toBe("agree");
        expect(within(row("jonathon", "name")).getByText(`${ MATCH }.agree0.92`)).toBeInTheDocument();
        expect(kind(row("jonathon", "city"))).toBe("inconclusive");
        expect(within(row("jonathon", "city")).getByText(`${ MATCH }.inconclusive0.5`)).toBeInTheDocument();
        expect(kind(row("marcus", "email"))).toBe("differs");
        expect(kind(row("marcus", "mobile"))).toBe("not-compared");
    });

    it("colours each pair reason by what the review is due to", () => {
        renderExpanded([ priyanka, chen, corroborated ]);

        const chip = (taskId: string, code: string): HTMLElement =>
            screen.getByTestId(`${ LIST }-reason-${ taskId }-${ code }`);

        expect(chip("priyanka", "REJECTION_RECONSIDERED")).toHaveClass("category-history");
        expect(chip("chen", "AUTO_MERGE_DISABLED")).toHaveClass("category-configuration");
        expect(chip("corroborated", "BELOW_AUTO_MERGE_THRESHOLD")).toHaveClass("category-evidence");
    });

    it("names attributes by their display name", () => {
        renderExpanded([ marcus ]);

        expect(within(row("marcus", "name")).getByText("Full name")).toBeInTheDocument();
        expect(within(row("marcus", "email")).getByText("emailaddress")).toBeInTheDocument();
    });

    it("shows the scores of a task raised before explanations, without reasons", () => {
        renderExpanded([ legacy ]);

        const evidence: HTMLElement = screen.getByTestId(`${ LIST }-evidence-legacy`);

        expect(within(evidence).getByText("1")).toBeInTheDocument();
        expect(within(evidence).getByText("0.95")).toBeInTheDocument();
        expect(chipCodes(evidence)).toEqual([]);
        expect(screen.queryByTestId(`${ LIST }-context-legacy`)).not.toBeInTheDocument();
    });
});
