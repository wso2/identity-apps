/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { act, renderHook } from "@testing-library/react";
import { Node } from "@xyflow/react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { FlowExtensionAccessConfigInterface } from "../../models/flow-extension-access";
import useFlowExtensionAccessConfigSaver, {
    UseFlowExtensionAccessConfigSaverReturnInterface
} from "../use-flow-extension-access-config-saver";

const mocks: {
    dispatch: Mock<(_action: unknown) => void>;
    update: Mock<(_id: string, _config: FlowExtensionAccessConfigInterface) => Promise<void>>;
} = vi.hoisted(() => ({ dispatch: vi.fn(), update: vi.fn() }));

vi.mock("../../api/update-flow-extension-access-config", () => ({ default: mocks.update }));
vi.mock("react-redux", () => ({ useDispatch: () => mocks.dispatch }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock("@wso2is/core/store", () => ({ addAlert: (alert: unknown) => ({ alert, type: "ADD_ALERT" }) }));

const extensionStep = (id: string, extensionId: string): Node => ({
    data: { action: { executor: { meta: { actionId: extensionId } } } },
    id,
    position: { x: 0, y: 0 }
});

const READ_PLAN: FlowExtensionAccessConfigInterface = {
    expose: [ { encrypted: false, flowType: "REGISTRATION", path: "/runtimeValues[name=plan]" } ],
    modify: []
};

const READ_DEVICE: FlowExtensionAccessConfigInterface = {
    expose: [ { encrypted: false, flowType: "REGISTRATION", path: "/request/additionalHeaders[name=device]" } ],
    modify: []
};

describe("useFlowExtensionAccessConfigSaver", () => {
    let nodes: Node[];

    beforeEach(() => {
        mocks.dispatch.mockReset();
        mocks.update.mockReset();
        mocks.update.mockResolvedValue(undefined);
        nodes = [ extensionStep("step-1", "ext-1") ];
    });

    const renderSaver = (): { current: UseFlowExtensionAccessConfigSaverReturnInterface } =>
        renderHook(() => useFlowExtensionAccessConfigSaver(() => nodes)).result;

    it("saves the changed access configs of the extensions the flow uses and clears them", async () => {
        const saver: { current: UseFlowExtensionAccessConfigSaverReturnInterface } = renderSaver();

        act(() => {
            saver.current.setFlowExtensionAccessConfig("ext-1", READ_PLAN);
            saver.current.setFlowExtensionAccessConfig("ext-removed", READ_DEVICE);
        });

        let saved: boolean;

        await act(async () => {
            saved = await saver.current.saveFlowExtensionAccessConfigs();
        });

        expect(saved).toBe(true);
        expect(mocks.update).toHaveBeenCalledTimes(1);
        expect(mocks.update).toHaveBeenCalledWith("ext-1", READ_PLAN);
        expect(saver.current.flowExtensionAccessConfigs).toEqual({});
        expect(saver.current.flowExtensionsSavedVersion).toBe(1);
        expect(mocks.dispatch).not.toHaveBeenCalled();
    });

    it("keeps a failed access config for the next save and reports the failure", async () => {
        nodes = [ extensionStep("step-1", "ext-1"), extensionStep("step-2", "ext-2") ];
        mocks.update.mockImplementation((extensionId: string) =>
            extensionId === "ext-2" ? Promise.reject(new Error("failed")) : Promise.resolve());
        const saver: { current: UseFlowExtensionAccessConfigSaverReturnInterface } = renderSaver();

        act(() => {
            saver.current.setFlowExtensionAccessConfig("ext-1", READ_PLAN);
            saver.current.setFlowExtensionAccessConfig("ext-2", READ_DEVICE);
        });

        let saved: boolean;

        await act(async () => {
            saved = await saver.current.saveFlowExtensionAccessConfigs();
        });

        expect(saved).toBe(false);
        expect(saver.current.flowExtensionAccessConfigs).toEqual({ "ext-2": READ_DEVICE });
        expect(mocks.dispatch).toHaveBeenCalledTimes(1);
    });

    it("keeps a change made while the save runs", async () => {
        let finishUpdate: () => void;

        mocks.update.mockReturnValue(new Promise<void>((resolve: () => void) => { finishUpdate = resolve; }));
        const saver: { current: UseFlowExtensionAccessConfigSaverReturnInterface } = renderSaver();

        act(() => {
            saver.current.setFlowExtensionAccessConfig("ext-1", READ_PLAN);
        });

        let saving: Promise<boolean>;

        act(() => {
            saving = saver.current.saveFlowExtensionAccessConfigs();
        });
        act(() => {
            saver.current.setFlowExtensionAccessConfig("ext-1", READ_DEVICE);
        });
        await act(async () => {
            finishUpdate();
            await saving;
        });

        expect(saver.current.flowExtensionAccessConfigs).toEqual({ "ext-1": READ_DEVICE });
    });

    it("saves nothing when no access config changed", async () => {
        const saver: { current: UseFlowExtensionAccessConfigSaverReturnInterface } = renderSaver();
        let saved: boolean;

        await act(async () => {
            saved = await saver.current.saveFlowExtensionAccessConfigs();
        });

        expect(saved).toBe(true);
        expect(mocks.update).not.toHaveBeenCalled();
        expect(saver.current.flowExtensionsSavedVersion).toBe(0);
    });
});
