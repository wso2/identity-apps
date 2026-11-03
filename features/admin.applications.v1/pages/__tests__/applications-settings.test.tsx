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
import React from "react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import ApplicationsSettingsForm from "../applications-settings";
import type {} from "@testing-library/jest-dom/vitest";

const updateDCRConfigurationsMock: Mock = vi.hoisted(() => vi.fn());
const updateOAuth2InboundConfigMock: Mock = vi.hoisted(() => vi.fn());
const useGetOAuth2InboundConfigMock: Mock = vi.hoisted(() => vi.fn());

vi.mock("../../api/applications-settings", () => ({
    updateDCRConfigurations: updateDCRConfigurationsMock,
    updateOAuth2InboundConfig: updateOAuth2InboundConfigMock
}));

vi.mock("../../api/use-get-dcr-configurations", () => ({
    useGetDCRConfigurations: () => ({
        data: {
            authenticationRequired: true,
            enableFapiEnforcement: false,
            mandateSSA: false
        },
        error: null,
        isLoading: false,
        mutate: vi.fn()
    })
}));

vi.mock("../../api/use-get-oauth2-inbound-config", () => ({
    default: useGetOAuth2InboundConfigMock
}));

vi.mock("../../api/application", () => ({
    getOIDCApplicationConfigurations: () => Promise.resolve({
        dynamicClientRegistrationEndpoint: "https://localhost:9443/api/identity/oauth2/dcr/v1.1/register"
    })
}));

vi.mock("@wso2is/access-control", async (importOriginal: () => Promise<Record<string, unknown>>) => ({
    ...await importOriginal(),
    useRequiredScopes: () => true
}));

const getInput = (name: string): HTMLInputElement =>
    document.querySelector<HTMLInputElement>(`input[name="${ name }"]`);

const renderPage = (enableClientIdMetadataDocument: boolean): void => {
    useGetOAuth2InboundConfigMock.mockReturnValue({
        data: { enableClientIdMetadataDocument },
        isLoading: false,
        mutate: vi.fn()
    });

    render(<ApplicationsSettingsForm />);
};

describe("Application Settings page", () => {
    beforeEach(() => {
        updateDCRConfigurationsMock.mockReset().mockResolvedValue(undefined);
        updateOAuth2InboundConfigMock.mockReset().mockResolvedValue(undefined);
    });

    it("shows the organization's CIMD setting", () => {
        renderPage(true);

        expect(getInput("enableClientIdMetadataDocument")).toBeChecked();
    });

    it("updates only the settings that changed", async () => {
        renderPage(false);

        fireEvent.click(getInput("enableClientIdMetadataDocument"));
        fireEvent.click(screen.getByRole("button", { name: "common:update" }));

        await waitFor(() => expect(updateOAuth2InboundConfigMock).toHaveBeenCalledWith({
            enableClientIdMetadataDocument: true
        }));
        expect(updateDCRConfigurationsMock).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.getByRole("button", { name: "common:update" })).toBeEnabled());

        fireEvent.change(getInput("ssaJwks"), {
            target: { value: "https://example.com/jwks" }
        });
        fireEvent.click(screen.getByRole("button", { name: "common:update" }));

        await waitFor(() => expect(updateDCRConfigurationsMock).toHaveBeenCalledTimes(1));
    });
});
