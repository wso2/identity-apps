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

import { fireEvent, render, screen } from "@wso2is/unit-testing/utils";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import AllowedOriginsSettings from "../components/allowed-origins-settings";
import { CDSConfig, CDSSettingsSectionStateInterface } from "../models/config";
import "@testing-library/jest-dom";

const SETTINGS: string = "settings";
const INPUT: string = `${ SETTINGS }-input`;

const configWith = (origins: string[]): CDSConfig => ({
    cds_enabled: true,
    cors_allowed_origins: origins,
    system_applications: []
});

const addOrigin = (origin: string): void => {
    const field: HTMLInputElement = screen.getByTestId(INPUT).querySelector("input");

    fireEvent.change(field, { target: { value: origin } });
    fireEvent.click(screen.getByTestId(`${ INPUT }-add-button`));
};

const lastReport = (onChange: ReturnType<typeof vi.fn>): CDSSettingsSectionStateInterface =>
    onChange.mock.calls[ onChange.mock.calls.length - 1 ][ 0 ];

describe("AllowedOriginsSettings", () => {

    it("reports an added origin as the server stores it, with the whole list", () => {
        const onChange: ReturnType<typeof vi.fn> = vi.fn();

        render(
            <AllowedOriginsSettings
                config={ configWith([ "https://app.example.com" ]) }
                onChange={ onChange }
                data-componentid={ SETTINGS }
            />
        );

        expect(lastReport(onChange)).toEqual({
            hasError: false,
            isDirty: false,
            payload: { cors_allowed_origins: [ "https://app.example.com" ] }
        });

        addOrigin("HTTPS://Shop.Example.COM/");

        expect(screen.getByTestId(`${ INPUT }-https://shop.example.com`)).toBeInTheDocument();
        expect(lastReport(onChange)).toEqual({
            hasError: false,
            isDirty: true,
            payload: { cors_allowed_origins: [ "https://shop.example.com", "https://app.example.com" ] }
        });
    });

    it("shows why an origin cannot be added and leaves the list as it was", () => {
        const onChange: ReturnType<typeof vi.fn> = vi.fn();

        render(
            <AllowedOriginsSettings
                config={ configWith([ "https://app.example.com" ]) }
                onChange={ onChange }
                data-componentid={ SETTINGS }
            />
        );

        addOrigin("https://blog.example.com/news");

        expect(screen.getByTestId(`${ INPUT }-valid-url-error-message`))
            .toHaveTextContent("customerDataService:allowedOrigins.errors.notAnOrigin");
        expect(lastReport(onChange).isDirty).toBe(false);
    });

    it("refuses an origin already in the list, whatever its case", () => {
        render(
            <AllowedOriginsSettings
                config={ configWith([ "https://app.example.com" ]) }
                onChange={ vi.fn() }
                data-componentid={ SETTINGS }
            />
        );

        addOrigin("HTTPS://APP.EXAMPLE.COM");

        expect(screen.getByTestId(`${ INPUT }-valid-url-error-message`))
            .toHaveTextContent("customerDataService:allowedOrigins.errors.duplicate");
    });

    it("removes an origin", () => {
        const onChange: ReturnType<typeof vi.fn> = vi.fn();

        render(
            <AllowedOriginsSettings
                config={ configWith([ "https://app.example.com", "https://shop.example.com" ]) }
                onChange={ onChange }
                data-componentid={ SETTINGS }
            />
        );

        fireEvent.click(screen.getByTestId(`${ INPUT }-https://app.example.com-delete-button`));

        expect(screen.queryByTestId(`${ INPUT }-https://app.example.com`)).not.toBeInTheDocument();
        expect(lastReport(onChange)).toEqual({
            hasError: false,
            isDirty: true,
            payload: { cors_allowed_origins: [ "https://shop.example.com" ] }
        });
    });

    it("shows a child organization the origins of its root organization, read only", () => {
        render(
            <AllowedOriginsSettings
                config={ configWith([ "https://app.example.com" ]) }
                onChange={ vi.fn() }
                isInherited
                data-componentid={ SETTINGS }
            />
        );

        expect(screen.getByTestId(`${ SETTINGS }-inherited`)).toBeInTheDocument();
        expect(screen.getByTestId(`${ INPUT }-https://app.example.com`)).toBeInTheDocument();
        expect(screen.queryByTestId(`${ INPUT }-https://app.example.com-delete-button`)).not.toBeInTheDocument();
    });
});
