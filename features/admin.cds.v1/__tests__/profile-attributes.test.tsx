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

import { render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { ProfileSchemaListing } from "../components/profile-attributes";
import { ProfileSchemaListingRow } from "../models/profile-attribute-listing";
import "@testing-library/jest-dom";

vi.mock("../hooks/use-cds-applications", () => ({
    useCDSApplications: () => ({
        getApplicationDisplayName: (identifier: string): string => identifier
    })
}));

const LISTING: string = "listing";

const rowOf = (name: string, isShared: boolean): ProfileSchemaListingRow => ({
    attribute_id: name,
    attribute_name: `traits.${ name }`,
    chip_label: "traits",
    deletable: !isShared,
    display_name: name,
    editable: !isShared,
    id: `traits:${ name }`,
    is_shared: isShared,
    scope: "traits"
});

describe("ProfileSchemaListing", () => {

    it("shows the shared chip only on a shared attribute", () => {
        render(
            <ProfileSchemaListing
                isLoading={ false }
                onRefresh={ vi.fn() }
                rows={ [ rowOf("loyalty_tier", true), rowOf("nickname", false) ] }
                data-componentid={ LISTING }
            />
        );

        const chips: HTMLElement[] = screen.getAllByTestId(`${ LISTING }-shared-chip`);

        expect(chips).toHaveLength(1);
        expect(chips[0].closest("tr")).toHaveTextContent("loyalty_tier");
        expect(chips[0]).toHaveAttribute("aria-label", "customerDataService:sharing.sharedTooltip");
    });
});
