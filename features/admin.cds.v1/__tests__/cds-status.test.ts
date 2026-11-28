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

import { RenderHookResult, act, renderHook } from "@testing-library/react";
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { updateCDSServerConfig, updateCDSStatus } from "../api/config";
import useCDSEnabled, { UseCDSEnabledReturnInterface } from "../hooks/use-cds-enabled";
import useCDSToggle from "../hooks/use-cds-toggle";
import useCDSConfig from "../hooks/use-config";
import useIsSubOrganization from "../hooks/use-is-sub-organization";
import useCDSServerConfig from "../hooks/use-server-config";
import { CDSConfig } from "../models/config";
import { isCDSServerConfigEnabled } from "../utils/ui-mode-utils";

const httpRequestMock: Mock = vi.hoisted(() => vi.fn());
const dispatchMock: Mock = vi.hoisted(() => vi.fn());

const CDS_CONFIG_URL: string = "https://localhost:9443/t/carbon.super/cds/api/v1/config";
const SERVER_CONFIG_URL: string = "https://localhost:9443/t/carbon.super/api/server/v1/configs/cds";

vi.mock("@asgardeo/auth-react", () => ({
    AsgardeoSPAClient: {
        getInstance: vi.fn(() => ({
            httpRequest: httpRequestMock
        }))
    }
}));

vi.mock("@wso2is/admin.core.v1/store", () => ({
    store: {
        getState: () => ({
            config: {
                endpoints: {
                    cdsConfig: "https://localhost:9443/t/carbon.super/cds/api/v1/config",
                    cdsServerConfig: "https://localhost:9443/t/carbon.super/api/server/v1/configs/cds"
                }
            }
        })
    }
}));

vi.mock("react-redux", () => ({
    useDispatch: () => dispatchMock
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string): string => key })
}));

vi.mock("../utils/application-identifier-utils", () => ({
    resolveConsoleSystemApplicationIdentifier: vi.fn(() => Promise.resolve("CONSOLE"))
}));

vi.mock("../hooks/use-config", () => ({ default: vi.fn() }));
vi.mock("../hooks/use-server-config", () => ({ default: vi.fn() }));
vi.mock("../hooks/use-is-sub-organization", () => ({ default: vi.fn(() => false) }));

const setExtensions = (extensions: Record<string, unknown>): void => {
    window["AppUtils"] = {
        getConfig: () => ({ extensions })
    };
};

describe("CDS status", () => {

    beforeEach(() => {
        httpRequestMock.mockReset();
        httpRequestMock.mockResolvedValue({ data: {}, status: 200 });
    });

    afterEach(() => {
        delete window["AppUtils"];
    });

    it("uses the server configuration API only when the flag is true", () => {
        setExtensions({ cdsTenantConfigEnabled: true });
        expect(isCDSServerConfigEnabled()).toBe(true);

        setExtensions({ cdsTenantConfigEnabled: "true" });
        expect(isCDSServerConfigEnabled()).toBe(false);

        setExtensions({});
        expect(isCDSServerConfigEnabled()).toBe(false);
    });

    it("sends the status and the system applications to CDS in one request when the flag is off", async () => {
        setExtensions({});

        await updateCDSStatus(true, [ "CONSOLE" ]);

        expect(httpRequestMock).toHaveBeenCalledTimes(1);
        expect(httpRequestMock).toHaveBeenCalledWith(expect.objectContaining({
            data: { cds_enabled: true, system_applications: [ "CONSOLE" ] },
            method: "PATCH",
            url: CDS_CONFIG_URL
        }));
    });

    it("sends the status to the Identity Server first when the flag is on", async () => {
        setExtensions({ cdsTenantConfigEnabled: true });

        await updateCDSStatus(false, []);

        expect(httpRequestMock).toHaveBeenCalledTimes(2);
        expect(httpRequestMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
            data: { enabled: false },
            method: "PATCH",
            url: SERVER_CONFIG_URL
        }));
        expect(httpRequestMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
            data: { system_applications: [] },
            method: "PATCH",
            url: CDS_CONFIG_URL
        }));
    });

    it("does not change the system applications when the Identity Server rejects the status", async () => {
        setExtensions({ cdsTenantConfigEnabled: true });
        httpRequestMock.mockRejectedValueOnce(new Error("400"));

        await expect(updateCDSStatus(true, [ "CONSOLE" ])).rejects.toThrow("400");
        expect(httpRequestMock).toHaveBeenCalledTimes(1);
    });

    it("rejects a server configuration update that does not return 200", async () => {
        httpRequestMock.mockResolvedValueOnce({ data: {}, status: 204 });

        await expect(updateCDSServerConfig(true)).rejects.toThrow("Failed to update the CDS status.");
    });
});

describe("useCDSEnabled", () => {

    const cdsConfigMutate: Mock = vi.fn();
    const serverConfigMutate: Mock = vi.fn();

    beforeEach(() => {
        cdsConfigMutate.mockReset();
        serverConfigMutate.mockReset();
        (useIsSubOrganization as Mock).mockReturnValue(false);
        (useCDSConfig as Mock).mockReturnValue({
            data: { cds_enabled: true, system_applications: [] },
            isLoading: false,
            mutate: cdsConfigMutate
        });
        (useCDSServerConfig as Mock).mockReturnValue({
            data: { enabled: false },
            isLoading: false,
            mutate: serverConfigMutate
        });
    });

    afterEach(() => {
        delete window["AppUtils"];
    });

    it("reads cds_enabled of the CDS configuration when the flag is off", () => {
        setExtensions({});

        const { result }: RenderHookResult<UseCDSEnabledReturnInterface, unknown> =
            renderHook(() => useCDSEnabled(true));

        expect(result.current.isEnabled).toBe(true);
        expect(useCDSConfig).toHaveBeenLastCalledWith(true);
        expect(useCDSServerConfig).toHaveBeenLastCalledWith(false);

        result.current.mutate();
        expect(cdsConfigMutate).toHaveBeenCalledTimes(1);
        expect(serverConfigMutate).not.toHaveBeenCalled();
    });

    it("reads the Identity Server status when the flag is on", () => {
        setExtensions({ cdsTenantConfigEnabled: true });

        const { result }: RenderHookResult<UseCDSEnabledReturnInterface, unknown> =
            renderHook(() => useCDSEnabled(true));

        expect(result.current.isEnabled).toBe(false);
        expect(useCDSConfig).toHaveBeenLastCalledWith(false);
        expect(useCDSServerConfig).toHaveBeenLastCalledWith(true);

        result.current.mutate();
        expect(serverConfigMutate).toHaveBeenCalledTimes(1);
        expect(cdsConfigMutate).not.toHaveBeenCalled();
    });

    it("gives false when the Identity Server returns an error", () => {
        setExtensions({ cdsTenantConfigEnabled: true });
        (useCDSServerConfig as Mock).mockReturnValue({
            data: undefined,
            error: { response: { status: 400 } },
            isLoading: false,
            mutate: serverConfigMutate
        });

        const { result }: RenderHookResult<UseCDSEnabledReturnInterface, unknown> =
            renderHook(() => useCDSEnabled(true));

        expect(result.current.isEnabled).toBe(false);
    });

    it("does not fetch when the CDS feature is off", () => {
        setExtensions({ cdsTenantConfigEnabled: true });

        renderHook(() => useCDSEnabled(false));

        expect(useCDSConfig).toHaveBeenLastCalledWith(false);
        expect(useCDSServerConfig).toHaveBeenLastCalledWith(false);
    });

    it("reads cds_enabled of the CDS configuration in a child organization when the flag is on", () => {
        setExtensions({ cdsTenantConfigEnabled: true });
        (useIsSubOrganization as Mock).mockReturnValue(true);
        (useCDSServerConfig as Mock).mockReturnValue({
            data: { enabled: true },
            isLoading: false,
            mutate: serverConfigMutate
        });
        (useCDSConfig as Mock).mockReturnValue({
            data: { cds_enabled: false, system_applications: [] },
            isLoading: false,
            mutate: cdsConfigMutate
        });

        const { result }: RenderHookResult<UseCDSEnabledReturnInterface, unknown> =
            renderHook(() => useCDSEnabled(true));

        expect(result.current.isEnabled).toBe(false);
        expect(useCDSConfig).toHaveBeenLastCalledWith(true);
        expect(useCDSServerConfig).toHaveBeenLastCalledWith(false);

        result.current.mutate();
        expect(cdsConfigMutate).toHaveBeenCalledTimes(1);
        expect(serverConfigMutate).not.toHaveBeenCalled();
    });

    it("gives true in a child organization that the organization access includes", () => {
        setExtensions({ cdsTenantConfigEnabled: true });
        (useIsSubOrganization as Mock).mockReturnValue(true);

        const { result }: RenderHookResult<UseCDSEnabledReturnInterface, unknown> =
            renderHook(() => useCDSEnabled(true));

        expect(result.current.isEnabled).toBe(true);
    });

    it("gives false in a child organization when CDS returns an error", () => {
        setExtensions({ cdsTenantConfigEnabled: true });
        (useIsSubOrganization as Mock).mockReturnValue(true);
        (useCDSConfig as Mock).mockReturnValue({
            data: undefined,
            error: { response: { status: 404 } },
            isLoading: false,
            mutate: cdsConfigMutate
        });

        const { result }: RenderHookResult<UseCDSEnabledReturnInterface, unknown> =
            renderHook(() => useCDSEnabled(true));

        expect(result.current.isEnabled).toBe(false);
    });

    it("does not fetch in a child organization when the CDS feature is off", () => {
        setExtensions({ cdsTenantConfigEnabled: true });
        (useIsSubOrganization as Mock).mockReturnValue(true);

        renderHook(() => useCDSEnabled(false));

        expect(useCDSConfig).toHaveBeenLastCalledWith(false);
        expect(useCDSServerConfig).toHaveBeenLastCalledWith(false);
    });
});

describe("useCDSToggle", () => {

    const mutateMock: Mock = vi.fn();

    beforeEach(() => {
        httpRequestMock.mockReset();
        httpRequestMock.mockResolvedValue({ data: {}, status: 200 });
        dispatchMock.mockReset();
        mutateMock.mockReset();
        setExtensions({ cdsTenantConfigEnabled: true });
    });

    afterEach(() => {
        delete window["AppUtils"];
    });

    it("sends no request when the CDS configuration is not loaded", async () => {
        const { result }: RenderHookResult<ReturnType<typeof useCDSToggle>, unknown> =
            renderHook(() => useCDSToggle(undefined, mutateMock));

        let isUpdated: boolean;

        await act(async () => {
            isUpdated = await result.current.toggleCDS(false);
        });

        expect(isUpdated).toBe(false);
        expect(httpRequestMock).not.toHaveBeenCalled();
        expect(mutateMock).not.toHaveBeenCalled();
    });

    it("keeps the other system applications when it removes the Console", async () => {
        const { result }: RenderHookResult<ReturnType<typeof useCDSToggle>, unknown> =
            renderHook(() => useCDSToggle({ cds_enabled: true, system_applications: [ "APP", "CONSOLE" ] } as CDSConfig,
                mutateMock));

        await act(async () => {
            await result.current.toggleCDS(false);
        });

        expect(httpRequestMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
            data: { system_applications: [ "APP" ] },
            url: CDS_CONFIG_URL
        }));
        expect(mutateMock).toHaveBeenCalledTimes(1);
    });

    it("gets the status again when the CDS request fails after the Identity Server stores the status", async () => {
        httpRequestMock
            .mockResolvedValueOnce({ data: { enabled: false }, status: 200 })
            .mockRejectedValueOnce(new Error("500"));

        const { result }: RenderHookResult<ReturnType<typeof useCDSToggle>, unknown> =
            renderHook(() => useCDSToggle({ cds_enabled: true, system_applications: [ "CONSOLE" ] } as CDSConfig,
                mutateMock));

        let isUpdated: boolean;

        await act(async () => {
            isUpdated = await result.current.toggleCDS(false);
        });

        expect(isUpdated).toBe(false);
        expect(httpRequestMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(mutateMock).toHaveBeenCalledTimes(1);
    });
});
