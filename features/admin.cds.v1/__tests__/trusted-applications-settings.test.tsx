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

import { fireEvent, render, screen, waitFor, within } from "@wso2is/unit-testing/utils";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TrustedApplicationsSettings from "../components/trusted-applications-settings";
import { useCDSApplications } from "../hooks/use-cds-applications";
import { CDSConfig, CDSSettingsSectionStateInterface } from "../models/config";
import "@testing-library/jest-dom";

vi.mock("../hooks/use-cds-applications", () => ({ useCDSApplications: vi.fn() }));
vi.mock("../utils/application-identifier-utils", () => ({
    resolveConsoleSystemApplicationIdentifier: vi.fn().mockResolvedValue("CONSOLE")
}));

const SETTINGS: string = "settings";

const NAMES: Record<string, string> = { "client-billing": "Billing", "client-shop": "Shop" };

/**
 * Builds a configuration with the given applications.
 *
 * @param applications - Identifiers of the applications.
 * @returns The configuration.
 */
const configWith = (applications: string[]): CDSConfig => ({
    cds_enabled: true,
    system_applications: applications
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
 * Returns the chip of an application.
 *
 * @param identifier - Identifier of the application.
 * @returns The chip.
 */
const chip = (identifier: string): HTMLElement => screen.getByTestId(`${ SETTINGS }-chip-${ identifier }`);

/**
 * Returns the delete button of an application's chip.
 *
 * @param identifier - Identifier of the application.
 * @returns The delete button, or null when the application cannot be removed.
 */
const deleteIconOf = (identifier: string): Element | null => chip(identifier).querySelector(".MuiChip-deleteIcon");

/**
 * Returns the input of the section.
 *
 * @returns The input.
 */
const input = (): HTMLInputElement => screen.getByTestId(`${ SETTINGS }-input`).querySelector("input");

describe("TrustedApplicationsSettings", () => {

    beforeEach(() => {
        vi.mocked(useCDSApplications).mockReturnValue({
            applications: [
                { id: "shop", identifier: "client-shop", name: "Shop" },
                { id: "billing", identifier: "client-billing", name: "Billing" }
            ],
            getApplicationDisplayName: (identifier: string): string => NAMES[ identifier ] ?? identifier,
            isApplicationsRequestFailed: false,
            isLoading: false
        });
    });

    it("shows the applications by name and keeps the Console", async () => {
        const onChange: ReturnType<typeof vi.fn> = vi.fn();

        render(
            <TrustedApplicationsSettings
                config={ configWith([ "CONSOLE", "client-shop" ]) }
                onChange={ onChange }
                data-componentid={ SETTINGS }
            />
        );

        await waitFor(() => expect(deleteIconOf("CONSOLE")).toBeNull());
        // The tests render the translation keys.
        expect(chip("CONSOLE")).toHaveTextContent("customerDataService:trustedApplications.console");
        expect(chip("client-shop")).toHaveTextContent("Shop");
        expect(deleteIconOf("client-shop")).not.toBeNull();
        expect(lastReport(onChange)).toEqual({
            hasError: false,
            isDirty: false,
            payload: { system_applications: [ "CONSOLE", "client-shop" ] }
        });
    });

    it("reports an added application with the whole list", async () => {
        const onChange: ReturnType<typeof vi.fn> = vi.fn();

        render(
            <TrustedApplicationsSettings
                config={ configWith([ "CONSOLE" ]) }
                onChange={ onChange }
                data-componentid={ SETTINGS }
            />
        );

        fireEvent.mouseDown(input());
        fireEvent.click(within(screen.getByRole("listbox")).getByText("Billing"));

        await waitFor(() => expect(lastReport(onChange)).toEqual({
            hasError: false,
            isDirty: true,
            payload: { system_applications: [ "CONSOLE", "client-billing" ] }
        }));
    });

    it("removes an application, but not the Console", async () => {
        const onChange: ReturnType<typeof vi.fn> = vi.fn();

        render(
            <TrustedApplicationsSettings
                config={ configWith([ "client-shop", "CONSOLE" ]) }
                onChange={ onChange }
                data-componentid={ SETTINGS }
            />
        );

        await waitFor(() => expect(deleteIconOf("CONSOLE")).toBeNull());

        // Backspace removes the last application of the list, here the Console.
        fireEvent.keyDown(input(), { key: "Backspace" });
        expect(chip("CONSOLE")).toBeInTheDocument();

        fireEvent.click(deleteIconOf("client-shop"));

        await waitFor(() => expect(lastReport(onChange)).toEqual({
            hasError: false,
            isDirty: true,
            payload: { system_applications: [ "CONSOLE" ] }
        }));
    });

    it("cannot be changed while read only", () => {
        render(
            <TrustedApplicationsSettings
                config={ configWith([ "client-shop" ]) }
                onChange={ vi.fn() }
                isReadOnly
                data-componentid={ SETTINGS }
            />
        );

        expect(deleteIconOf("client-shop")).toBeNull();
        expect(input()).toHaveAttribute("readonly");
    });

    it("says when the applications could not be loaded", () => {
        vi.mocked(useCDSApplications).mockReturnValue({
            applications: [],
            getApplicationDisplayName: (identifier: string): string => identifier,
            isApplicationsRequestFailed: true,
            isLoading: false
        });

        render(
            <TrustedApplicationsSettings
                config={ configWith([ "client-shop" ]) }
                onChange={ vi.fn() }
                data-componentid={ SETTINGS }
            />
        );

        expect(screen.getByTestId(`${ SETTINGS }-load-error`)).toBeInTheDocument();
        expect(chip("client-shop")).toBeInTheDocument();
    });
});
