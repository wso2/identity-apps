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

import { renderHook } from "@testing-library/react";
import { Node } from "@xyflow/react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import {
    FlowExtensionAccessConfigInterface,
    FlowExtensionAccessRowInterface,
    FlowExtensionInterface
} from "../../models/flow-extension-access";
import useFlowExtensionAccessRows, {
    UseFlowExtensionAccessRowsReturnInterface
} from "../use-flow-extension-access-rows";

const mocks: {
    context: Record<string, unknown>;
    extension: { data?: FlowExtensionInterface; error?: unknown; mutate: Mock<() => void> };
    nodes: Node[];
    setFlowExtensionAccessConfig: Mock<(_id: string, _config: FlowExtensionAccessConfigInterface) => void>;
    variables: Record<string, unknown>;
} = vi.hoisted(() => ({
    context: {},
    extension: { mutate: vi.fn() },
    nodes: [],
    setFlowExtensionAccessConfig: vi.fn(),
    variables: {}
}));

vi.mock("../use-authentication-flow-builder-core-context", () => ({ default: () => mocks.context }));
vi.mock("../../api/use-get-flow-extension", () => ({ default: () => mocks.extension }));
vi.mock("@xyflow/react", () => ({
    useNodesData: () => ({ data: { variables: mocks.variables } }),
    useStore: (selector: (_state: { nodes: Node[] }) => unknown) => selector({ nodes: mocks.nodes })
}));

const organizationInput = (identifier: string): Record<string, unknown> =>
    ({ config: { identifier, identifierType: "ORGANIZATION" } });

const pathsOf = (rows: FlowExtensionAccessRowInterface[]): string[] =>
    rows.map((row: FlowExtensionAccessRowInterface) => row.path);

describe("useFlowExtensionAccessRows", () => {
    beforeEach(() => {
        mocks.setFlowExtensionAccessConfig.mockReset();
        mocks.context = {
            flowExtensionAccessConfigs: {},
            flowExtensionsSavedVersion: 0,
            flowType: "REGISTRATION",
            isFlowExtensionAccessLocked: false,
            isVariablesEnabled: true,
            setFlowExtensionAccessConfig: mocks.setFlowExtensionAccessConfig
        };
        mocks.extension = { data: { accessConfig: { expose: [], modify: [] }, id: "ext-1", name: "Ext" },
            mutate: vi.fn() };
        mocks.variables = {
            headers: [ { dataType: "STRING_ARRAY", name: "X-Device" } ],
            runtimeValues: [ { dataType: "STRING", name: "plan" } ]
        };
        mocks.nodes = [ {
            data: { components: [ { components: [
                organizationInput("organizationName"),
                organizationInput("organizationDescription"),
                organizationInput("country")
            ] } ] },
            id: "view",
            position: { x: 0, y: 0 }
        } ];
    });

    const render = (): UseFlowExtensionAccessRowsReturnInterface =>
        renderHook(() => useFlowExtensionAccessRows("ext-1")).result.current;

    it("lists the flow's runtime values, headers and organization fields", () => {
        const rows: UseFlowExtensionAccessRowsReturnInterface = render();

        expect(rows.isShown).toBe(true);
        expect(rows.runtimeValueRows).toEqual([
            { canWrite: true, dataType: "STRING", name: "plan", path: "/runtimeValues[name=plan]" }
        ]);
        expect(rows.headerRows).toEqual([ {
            canWrite: false,
            dataType: "STRING_ARRAY",
            name: "x-device",
            path: "/request/additionalHeaders[name=x-device]"
        } ]);
        expect(pathsOf(rows.subjectOrganizationRows)).toEqual([
            "/subjectOrganization/id",
            "/subjectOrganization/name",
            "/subjectOrganization/handle",
            "/subjectOrganization/description"
        ]);
        // The organization inputs with fields of their own are not listed as attributes.
        expect(pathsOf(rows.organizationAttributeRows)).toEqual([ "/subjectOrganization/attributes[name=country]" ]);
    });

    it("lists no organization fields outside a registration flow", () => {
        mocks.context = { ...mocks.context, flowType: "PASSWORD_RECOVERY" };

        const rows: UseFlowExtensionAccessRowsReturnInterface = render();

        expect(rows.isSubjectOrganizationShown).toBe(false);
        expect(rows.organizationAttributeRows).toEqual([]);
    });

    it("shows nothing when the flow extension cannot be fetched", () => {
        mocks.extension = { error: new Error("not found"), mutate: vi.fn() };

        expect(render().isShown).toBe(false);
    });

    it("reads an organization entry saved without a flow type as a registration entry", () => {
        mocks.extension = { data: { accessConfig: {
            expose: [ { encrypted: false, path: "/subjectOrganization/id" } ]
        }, id: "ext-1", name: "Ext" }, mutate: vi.fn() };

        const rows: UseFlowExtensionAccessRowsReturnInterface = render();

        expect(rows.isRead(rows.subjectOrganizationRows[0])).toBe(true);
        expect(rows.isRead(rows.subjectOrganizationRows[1])).toBe(false);
    });

    it("marks a row for this flow type and keeps the other entries", () => {
        const otherFlowEntry: FlowExtensionAccessConfigInterface["expose"][number] =
            { encrypted: false, flowType: "PASSWORD_RECOVERY", path: "/runtimeValues[name=plan]" };

        mocks.extension = { data: { accessConfig: { expose: [ otherFlowEntry ], modify: [] }, id: "ext-1",
            name: "Ext" }, mutate: vi.fn() };

        const rows: UseFlowExtensionAccessRowsReturnInterface = render();

        rows.toggleWrite(rows.runtimeValueRows[0]);

        expect(mocks.setFlowExtensionAccessConfig).toHaveBeenCalledWith("ext-1", {
            expose: [ otherFlowEntry ],
            modify: [ { encrypted: false, flowType: "REGISTRATION", path: "/runtimeValues[name=plan]" } ]
        });
    });
});
