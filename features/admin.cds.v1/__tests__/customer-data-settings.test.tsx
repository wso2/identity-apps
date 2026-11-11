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

import { fireEvent, render, screen, waitFor } from "@wso2is/unit-testing/utils";
import React, { ReactElement, useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateCDSConfig } from "../api/config";
import useCDSConfig from "../hooks/use-config";
import useFuzzyUnificationEnabled from "../hooks/use-fuzzy-unification";
import useIsSubOrganization from "../hooks/use-is-sub-organization";
import { CDSSettingsSectionStateInterface } from "../models/config";
import CustomerDataSettingsPage from "../pages/customer-data-settings";
import "@testing-library/jest-dom";

vi.mock("../api/config", () => ({ updateCDSConfig: vi.fn() }));
vi.mock("../hooks/use-config", () => ({ default: vi.fn() }));
vi.mock("../hooks/use-fuzzy-unification", () => ({ default: vi.fn() }));
vi.mock("../hooks/use-is-sub-organization", () => ({ default: vi.fn() }));
vi.mock("@wso2is/access-control", async (importOriginal: () => Promise<Record<string, unknown>>) => ({
    ...(await importOriginal()),
    useRequiredScopes: (): boolean => true
}));

// Stands in for the thresholds: reports a changed automatic threshold, as editing it would.
vi.mock("../components/resolution-settings", () => {
    const ResolutionSettingsStub = (
        { onChange }: { onChange: (state: CDSSettingsSectionStateInterface) => void }
    ): ReactElement => {
        useEffect(() => {
            onChange({ hasError: false, isDirty: true, payload: { auto_merge_threshold: 0.9 } });
        }, []);

        return <div data-componentid="resolution-settings" />;
    };

    return { default: ResolutionSettingsStub };
});

const PAGE: string = "page";
const ORIGINS: string = `${ PAGE }-allowed-origins-input`;
const mutate: ReturnType<typeof vi.fn> = vi.fn();

const addOrigin = (origin: string): void => {
    fireEvent.change(screen.getByTestId(ORIGINS).querySelector("input"), { target: { value: origin } });
    fireEvent.click(screen.getByTestId(`${ ORIGINS }-add-button`));
};

describe("CustomerDataSettingsPage", () => {

    beforeEach(() => {
        vi.mocked(useCDSConfig).mockReturnValue({
            data: { cds_enabled: true, cors_allowed_origins: [ "https://app.example.com" ], system_applications: [] },
            error: undefined,
            isLoading: false,
            isValidating: false,
            mutate
        } as unknown as ReturnType<typeof useCDSConfig>);
        vi.mocked(useIsSubOrganization).mockReturnValue(false);
        vi.mocked(updateCDSConfig).mockReset().mockResolvedValue({ cds_enabled: true, system_applications: [] });
        mutate.mockReset();
    });

    it("shows the allowed origins without tolerant matching, and not the thresholds", () => {
        vi.mocked(useFuzzyUnificationEnabled).mockReturnValue(false);

        render(<CustomerDataSettingsPage data-componentid={ PAGE } />);

        expect(screen.getByTestId(`${ PAGE }-allowed-origins`)).toBeInTheDocument();
        expect(screen.queryByTestId("resolution-settings")).not.toBeInTheDocument();
    });

    it("saves the allowed origins and the thresholds with one update", async () => {
        vi.mocked(useFuzzyUnificationEnabled).mockReturnValue(true);

        render(<CustomerDataSettingsPage data-componentid={ PAGE } />);

        expect(screen.getByTestId("resolution-settings")).toBeInTheDocument();
        expect(screen.getAllByTestId(`${ PAGE }-save`)).toHaveLength(1);

        addOrigin("https://shop.example.com");
        fireEvent.click(screen.getByTestId(`${ PAGE }-save`));

        await waitFor(() => expect(mutate).toHaveBeenCalled());
        expect(updateCDSConfig).toHaveBeenCalledTimes(1);
        expect(updateCDSConfig).toHaveBeenCalledWith({
            auto_merge_threshold: 0.9,
            cors_allowed_origins: [ "https://shop.example.com", "https://app.example.com" ]
        });
    });

    it("sends only the changed section", async () => {
        vi.mocked(useFuzzyUnificationEnabled).mockReturnValue(false);

        render(<CustomerDataSettingsPage data-componentid={ PAGE } />);

        expect(screen.getByTestId(`${ PAGE }-save`)).toBeDisabled();

        addOrigin("https://shop.example.com");
        fireEvent.click(screen.getByTestId(`${ PAGE }-save`));

        await waitFor(() => expect(mutate).toHaveBeenCalled());
        expect(updateCDSConfig).toHaveBeenCalledWith({
            cors_allowed_origins: [ "https://shop.example.com", "https://app.example.com" ]
        });
    });

    it("keeps the sections read only until a save is done, so no edit is lost to the reload", async () => {
        vi.mocked(useFuzzyUnificationEnabled).mockReturnValue(false);
        let finishSave: () => void;

        vi.mocked(updateCDSConfig).mockReturnValue(new Promise((resolve: (value: never) => void) => {
            finishSave = () => resolve(undefined as never);
        }));

        render(<CustomerDataSettingsPage data-componentid={ PAGE } />);

        addOrigin("https://shop.example.com");
        fireEvent.click(screen.getByTestId(`${ PAGE }-save`));

        await waitFor(() => expect(screen.getByTestId(ORIGINS).querySelector("input")).toHaveAttribute("readonly"));
        expect(screen.queryByTestId(`${ ORIGINS }-https://shop.example.com-delete-button`)).not.toBeInTheDocument();

        finishSave();

        await waitFor(() => expect(screen.getByTestId(ORIGINS).querySelector("input")).not.toHaveAttribute("readonly"));
    });

    it("shows a child organization the allowed origins of its root organization, with nothing to update", () => {
        vi.mocked(useFuzzyUnificationEnabled).mockReturnValue(false);
        vi.mocked(useIsSubOrganization).mockReturnValue(true);

        render(<CustomerDataSettingsPage data-componentid={ PAGE } />);

        expect(screen.getByTestId(`${ PAGE }-allowed-origins-inherited`)).toBeInTheDocument();
        expect(screen.queryByTestId(`${ PAGE }-save`)).not.toBeInTheDocument();
    });
});
