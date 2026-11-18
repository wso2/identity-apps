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
import TemporaryProfileRetentionSettings from "../components/temporary-profile-retention-settings";
import { CDSConfig, CDSSettingsSectionStateInterface } from "../models/config";
import "@testing-library/jest-dom";

const SETTINGS: string = "settings";

type Field = "intervalDays" | "retentionDays";

/**
 * Builds a configuration with the given settings.
 *
 * @param settings - Settings the server reports, or none for a server that reports none.
 * @returns The configuration.
 */
const configWith = (settings: Partial<CDSConfig> = {}): CDSConfig => ({
    cds_enabled: true,
    system_applications: [],
    ...settings
});

/**
 * Returns what the section last reported.
 *
 * @param onChange - The change handler given to the section.
 * @returns The last report.
 */
const lastReport = (onChange: ReturnType<typeof vi.fn>): CDSSettingsSectionStateInterface =>
    onChange.mock.calls[ onChange.mock.calls.length - 1 ][ 0 ];

/**
 * Returns the dropdown of a setting.
 *
 * @param field - The setting.
 * @returns The element that opens the options and holds the value.
 */
const dropdown = (field: Field): HTMLElement =>
    within(screen.getByTestId(`${ SETTINGS }-${ field }-select`)).getByRole("combobox");

/**
 * Returns the values the dropdown of a setting offers, in order.
 *
 * @param field - The setting.
 * @returns The values.
 */
const offered = (field: Field): number[] => {
    fireEvent.mouseDown(dropdown(field));

    return screen.getAllByRole("option").map((option: HTMLElement) => Number(option.getAttribute("data-value")));
};

/**
 * Picks a value in the dropdown of a setting.
 *
 * @param field - The setting.
 * @param value - The value.
 */
const choose = (field: Field, value: number): void => {
    fireEvent.mouseDown(dropdown(field));
    const option: HTMLElement | undefined = screen.getAllByRole("option")
        .find((candidate: HTMLElement) => Number(candidate.getAttribute("data-value")) === value);

    if (!option) {
        throw new Error(`The ${ field } dropdown has no option with the value ${ value }.`);
    }

    fireEvent.click(option);
};

const renderSection = (props: Partial<React.ComponentProps<typeof TemporaryProfileRetentionSettings>> = {}) => {
    const onChange: ReturnType<typeof vi.fn> = vi.fn();

    render(<TemporaryProfileRetentionSettings
        config={ configWith() } onChange={ onChange } data-componentid={ SETTINGS } { ...props } />);

    return onChange;
};

describe("TemporaryProfileRetentionSettings", () => {

    it("shows the settings the server reports", () => {
        renderSection({ config: configWith({
            temporary_profile_cleanup_interval_days: 7,
            temporary_profile_retention_days: 30
        }) });

        expect(dropdown("retentionDays")).toHaveTextContent(/retentionDays\.option30$/);
        expect(screen.getByTestId(`${ SETTINGS }-retentionDays-select`).querySelector("input"))
            .toHaveValue("30");
        expect(screen.getByTestId(`${ SETTINGS }-intervalDays-select`).querySelector("input"))
            .toHaveValue("7");
    });

    it.each([ undefined, 0 ])("shows the defaults when the server reports %s", (value: number | undefined) => {
        const onChange: ReturnType<typeof vi.fn> = renderSection({ config: configWith({
            temporary_profile_cleanup_interval_days: value,
            temporary_profile_retention_days: value
        }) });

        expect(screen.getByTestId(`${ SETTINGS }-retentionDays-select`).querySelector("input"))
            .toHaveValue("90");
        expect(screen.getByTestId(`${ SETTINGS }-intervalDays-select`).querySelector("input"))
            .toHaveValue("30");
        expect(lastReport(onChange).isDirty).toBe(false);
    });

    it("offers the choices of each setting", () => {
        renderSection();

        expect(offered("retentionDays")).toEqual([ 30, 60, 90, 180, 365 ]);
    });

    it("offers the intervals", () => {
        renderSection();

        expect(offered("intervalDays")).toEqual([ 3, 7, 14, 30, 60, 90 ]);
    });

    it("still shows a stored value that is not one of the choices", () => {
        renderSection({ config: configWith({ temporary_profile_retention_days: 45 }) });

        expect(screen.getByTestId(`${ SETTINGS }-retentionDays-select`).querySelector("input"))
            .toHaveValue("45");
        expect(offered("retentionDays")).toEqual([ 30, 45, 60, 90, 180, 365 ]);
    });

    it("reports a change with the settings as they stand", () => {
        const onChange: ReturnType<typeof vi.fn> = renderSection();

        choose("retentionDays", 30);
        choose("intervalDays", 7);

        expect(lastReport(onChange)).toEqual({
            hasError: false,
            isDirty: true,
            payload: {
                temporary_profile_cleanup_interval_days: 7,
                temporary_profile_retention_days: 30
            }
        });
    });

    it("is not a change when a value is put back", () => {
        const onChange: ReturnType<typeof vi.fn> = renderSection();

        choose("retentionDays", 30);
        choose("retentionDays", 90);

        expect(lastReport(onChange).isDirty).toBe(false);
    });

    it("keeps an edit when a refresh changes only the other setting", () => {
        const onChange: ReturnType<typeof vi.fn> = vi.fn();
        const { rerender } = render(<TemporaryProfileRetentionSettings
            config={ configWith({ temporary_profile_cleanup_interval_days: 30, temporary_profile_retention_days: 90 }) }
            onChange={ onChange } data-componentid={ SETTINGS } />);

        choose("retentionDays", 60);
        rerender(<TemporaryProfileRetentionSettings
            config={ configWith({ temporary_profile_cleanup_interval_days: 7, temporary_profile_retention_days: 90 }) }
            onChange={ onChange } data-componentid={ SETTINGS } />);

        expect(screen.getByTestId(`${ SETTINGS }-retentionDays-select`).querySelector("input"))
            .toHaveValue("60");
        expect(screen.getByTestId(`${ SETTINGS }-intervalDays-select`).querySelector("input"))
            .toHaveValue("7");
        expect(lastReport(onChange)).toEqual({
            hasError: false,
            isDirty: true,
            payload: {
                temporary_profile_cleanup_interval_days: 7,
                temporary_profile_retention_days: 60
            }
        });
    });

    it("shows the saved value again once the server holds the edit", () => {
        const onChange: ReturnType<typeof vi.fn> = vi.fn();
        const { rerender } = render(<TemporaryProfileRetentionSettings
            config={ configWith({ temporary_profile_retention_days: 90 }) }
            onChange={ onChange } data-componentid={ SETTINGS } />);

        choose("retentionDays", 60);
        rerender(<TemporaryProfileRetentionSettings
            config={ configWith({ temporary_profile_retention_days: 60 }) }
            onChange={ onChange } data-componentid={ SETTINGS } />);
        expect(lastReport(onChange).isDirty).toBe(false);

        rerender(<TemporaryProfileRetentionSettings
            config={ configWith({ temporary_profile_retention_days: 180 }) }
            onChange={ onChange } data-componentid={ SETTINGS } />);

        expect(screen.getByTestId(`${ SETTINGS }-retentionDays-select`).querySelector("input"))
            .toHaveValue("180");
        expect(lastReport(onChange).isDirty).toBe(false);
    });

    it("cannot be edited without permission", () => {
        renderSection({ isReadOnly: true });

        expect(dropdown("retentionDays")).toHaveAttribute("aria-disabled", "true");
        expect(dropdown("intervalDays")).toHaveAttribute("aria-disabled", "true");
    });

    it("shows a child organization the settings of its root organization, and cannot be edited", () => {
        renderSection({
            config: configWith({ temporary_profile_retention_days: 30 }),
            isInherited: true
        });

        expect(screen.getByTestId(`${ SETTINGS }-inherited`)).toBeInTheDocument();
        expect(screen.getByTestId(`${ SETTINGS }-retentionDays-select`).querySelector("input"))
            .toHaveValue("30");
        expect(dropdown("retentionDays")).toHaveAttribute("aria-disabled", "true");
    });
});
