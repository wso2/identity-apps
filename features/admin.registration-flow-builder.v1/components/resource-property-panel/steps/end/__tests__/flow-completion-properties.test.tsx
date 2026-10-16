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

import { ResourceTypes } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { Step, StepCategories, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { RolesV2ResponseInterface } from "@wso2is/admin.roles.v2/models/roles";
import { RenderResult, fireEvent, render, screen, within } from "@wso2is/unit-testing/utils";
import { Node } from "@xyflow/react";
import React from "react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import RegistrationFlowExecutorConstants from "../../../../../constants/registration-flow-executor-constants";
import FlowCompletionProperties from "../flow-completion-properties";
import type {} from "@testing-library/jest-dom/vitest";

const mocks: {
    useAuthenticationFlowBuilderCore: Mock;
    useNodesData: Mock;
    updateNodeData: Mock<(_id: string, _update: (_node: Node) => Record<string, unknown>) => void>;
    useGetRolesList: Mock;
} = vi.hoisted(() => ({
    updateNodeData: vi.fn(),
    useAuthenticationFlowBuilderCore: vi.fn(),
    useGetRolesList: vi.fn(),
    useNodesData: vi.fn()
}));

vi.mock("@xyflow/react", () => ({
    useNodesData: mocks.useNodesData,
    useReactFlow: () => ({ updateNodeData: mocks.updateNodeData })
}));
vi.mock("@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context", () => ({
    default: mocks.useAuthenticationFlowBuilderCore
}));
vi.mock("@wso2is/admin.flow-builder-core.v1/api/use-get-flow-config", () => ({
    default: () => ({ data: { flowCompletionConfigs: {} } })
}));
vi.mock("@wso2is/admin.roles.v2/api/use-get-roles-list", () => ({ default: mocks.useGetRolesList }));

describe("FlowCompletionProperties organization provisioning", () => {
    const componentId: string = "flow-completion-properties-component";
    const endStep: Step = {
        __generationMeta__: {},
        category: StepCategories.Workflow,
        config: {},
        data: { action: { executor: {
            meta: { custom: "keep", roleIds: JSON.stringify([ "role-manager" ]) },
            name: RegistrationFlowExecutorConstants.PROVISIONING_DISPATCH_EXECUTOR
        }, next: "next-step" }, components: [] },
        deletable: false,
        deprecated: false,
        display: { image: "", label: "End", showOnResourcePanel: false },
        id: "end",
        position: { x: 0, y: 0 },
        resourceType: ResourceTypes.Step,
        size: { height: 100, width: 100 },
        type: StepTypes.End,
        version: "0.1.0"
    };
    const roles: RolesV2ResponseInterface = {
        Resources: [
            { audience: { display: "Organization", type: "ORGANIZATION", value: "organization-id" },
                displayName: "Manager", id: "role-manager", meta: { location: "" } },
            { audience: { display: "Organization", type: "ORGANIZATION", value: "organization-id" },
                displayName: "Auditor", id: "role-auditor", meta: { location: "" } }
        ],
        startIndex: 1,
        totalResults: 2
    };

    const renderProperties = (): RenderResult => render(
        <FlowCompletionProperties resource={ endStep } onChange={ vi.fn() } />
    );

    const getUpdatedAction = (node: Node = endStep): unknown => {
        expect(mocks.updateNodeData).toHaveBeenCalledTimes(1);
        expect(mocks.updateNodeData.mock.calls[0][0]).toBe(endStep.id);

        return mocks.updateNodeData.mock.calls[0][1](node).action;
    };

    beforeEach(() => {
        mocks.updateNodeData.mockReset();
        mocks.useNodesData.mockReset();
        mocks.useNodesData.mockReturnValue(endStep);
        mocks.useAuthenticationFlowBuilderCore.mockReset();
        mocks.useAuthenticationFlowBuilderCore.mockReturnValue({
            flowCompletionConfigs: {},
            lastInteractedStepId: endStep.id,
            metadata: { supportedFlowCompletionConfigs: [], workflowEnabled: false },
            setFlowCompletionConfigs: vi.fn()
        });
        mocks.useGetRolesList.mockReset();
        mocks.useGetRolesList.mockReturnValue({ data: roles, error: undefined, isLoading: false });
    });

    it("shows organization settings only for the dispatch executor", () => {
        mocks.useNodesData.mockReturnValue({ data: { action: { executor: {
            name: RegistrationFlowExecutorConstants.USER_PROVISIONING_EXECUTOR
        } } } });

        renderProperties();

        expect(screen.queryByTestId(`${componentId}-provision-target`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`${componentId}-organization-roles`)).not.toBeInTheDocument();
        expect(mocks.updateNodeData).not.toHaveBeenCalled();
    });

    it("sets the new-organization target without losing the action or executor metadata", () => {
        renderProperties();

        const checkbox: HTMLElement = within(screen.getByTestId(`${componentId}-provision-target`))
            .getByRole("checkbox");

        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);

        expect(getUpdatedAction()).toEqual({
            ...endStep.data.action,
            executor: {
                ...endStep.data.action.executor,
                meta: { ...endStep.data.action.executor.meta, provisionTarget: "NEW_ORGANIZATION" }
            }
        });
    });

    it("removes only the provision target when unchecked", () => {
        const node: Node = { ...endStep, data: { ...endStep.data, action: {
            ...endStep.data.action,
            executor: { ...endStep.data.action.executor,
                meta: { ...endStep.data.action.executor.meta, provisionTarget: "NEW_ORGANIZATION" } }
        } } };

        mocks.useNodesData.mockReturnValue(node);
        renderProperties();

        const checkbox: HTMLElement = within(screen.getByTestId(`${componentId}-provision-target`))
            .getByRole("checkbox");

        expect(checkbox).toBeChecked();
        fireEvent.click(checkbox);

        expect(getUpdatedAction(node)).toEqual(endStep.data.action);
    });

    it("serializes selected role IDs without losing other executor metadata", () => {
        renderProperties();

        const input: HTMLElement = within(screen.getByTestId(`${componentId}-organization-roles-input`))
            .getByRole("combobox");

        expect(screen.getByText("Manager (Organization)")).toBeInTheDocument();
        fireEvent.change(input, { target: { value: "Auditor" } });
        fireEvent.click(screen.getByRole("option", { name: /Auditor/ }));

        expect(getUpdatedAction()).toEqual({
            ...endStep.data.action,
            executor: {
                ...endStep.data.action.executor,
                meta: { custom: "keep", roleIds: JSON.stringify([ "role-manager", "role-auditor" ]) }
            }
        });
    });

    it("removes the role IDs key when the final selected role is cleared", () => {
        renderProperties();

        const input: HTMLElement = within(screen.getByTestId(`${componentId}-organization-roles-input`))
            .getByRole("combobox");

        fireEvent.mouseDown(input);
        fireEvent.click(screen.getByRole("option", { name: /Manager/ }));

        expect(getUpdatedAction()).toEqual({
            ...endStep.data.action,
            executor: { ...endStep.data.action.executor, meta: { custom: "keep" } }
        });
    });
});
