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
    useSharedOrganizationRoles: Mock;
} = vi.hoisted(() => ({
    updateNodeData: vi.fn(),
    useAuthenticationFlowBuilderCore: vi.fn(),
    useNodesData: vi.fn(),
    useSharedOrganizationRoles: vi.fn()
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
vi.mock("../../../../../hooks/use-shared-organization-roles", () => ({
    default: mocks.useSharedOrganizationRoles
}));

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
        mocks.useSharedOrganizationRoles.mockReset();
        mocks.useSharedOrganizationRoles.mockReturnValue({
            hasRoleReadPermission: true,
            isLoaded: true,
            isLoading: false,
            roles: roles.Resources,
            sharedRoles: roles.Resources
        });
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

    it("groups account settings before organization settings without changing the saved target", () => {
        renderProperties();

        const headings: HTMLElement[] = screen.getAllByRole("heading");

        expect(headings.map((heading: HTMLElement): string => heading.textContent)).toEqual([
            "flows:registrationFlow.steps.end.account",
            "flows:registrationFlow.steps.end.organization.label"
        ]);
        expect(screen.getByRole("radio", { name: /provisionTarget.currentOrganization.label/ })).toBeChecked();
        expect(mocks.updateNodeData).not.toHaveBeenCalled();
    });

    it("uses the existing label and helper typography in both sections", () => {
        mocks.useAuthenticationFlowBuilderCore.mockReturnValue({
            flowCompletionConfigs: {},
            lastInteractedStepId: endStep.id,
            metadata: {
                supportedFlowCompletionConfigs: [ "isEmailVerificationEnabled", "isAccountLockOnCreationEnabled",
                    "isAutoLoginEnabled", "isFlowCompletionNotificationEnabled" ],
                workflowEnabled: false
            },
            setFlowCompletionConfigs: vi.fn()
        });
        renderProperties();

        const bodyStyle: CSSStyleDeclaration = window.getComputedStyle(
            screen.getByText(/defines what happens once the flow is completed/)
        );
        const helperStyle: CSSStyleDeclaration = window.getComputedStyle(
            screen.getByText("flows:registrationFlow.steps.end.accountVerification.hint")
        );

        [ "account", "organization.label", "accountVerification.label",
            "accountActivation.activateImmediately.label", "autoLogin.label", "accountFlowCompletion.label",
            "provisionTarget.label", "provisionTarget.newOrganization.label",
            "provisionTarget.currentOrganization.label",
            "organizationRoles.label" ].forEach((key: string): void => {
            const style: CSSStyleDeclaration = window.getComputedStyle(
                screen.getByText(`flows:registrationFlow.steps.end.${key}`)
            );

            expect(style.fontSize).toBe(bodyStyle.fontSize);
            expect(style.fontWeight).toBe(bodyStyle.fontWeight);
        });
        [ "organization.hint", "organizationRoles.hint" ].forEach((key: string): void => {
            const style: CSSStyleDeclaration = window.getComputedStyle(
                screen.getByText(`flows:registrationFlow.steps.end.${key}`)
            );

            expect(style.fontSize).toBe(helperStyle.fontSize);
            expect(style.fontWeight).toBe(helperStyle.fontWeight);
        });
    });

    it("uses default helper text aligned with the organization option titles", () => {
        renderProperties();

        const helperStyle: CSSStyleDeclaration = window.getComputedStyle(
            screen.getByText("flows:registrationFlow.steps.end.organization.hint")
        );

        [ "newOrganization", "currentOrganization" ].forEach((option: string): void => {
            const description: HTMLElement = screen.getByText(
                `flows:registrationFlow.steps.end.provisionTarget.${option}.hint`
            );
            const title: HTMLElement = screen.getByText(
                `flows:registrationFlow.steps.end.provisionTarget.${option}.label`
            );

            expect(description).toHaveClass("MuiFormHelperText-root");
            expect(window.getComputedStyle(description).fontSize).toBe(helperStyle.fontSize);
            expect(window.getComputedStyle(description).marginLeft).toBe(window.getComputedStyle(title).marginLeft);
        });
    });

    it("shows the email verification notice as a warning", () => {
        mocks.useAuthenticationFlowBuilderCore.mockReturnValue({
            flowCompletionConfigs: {},
            lastInteractedStepId: endStep.id,
            metadata: { supportedFlowCompletionConfigs: [ "isEmailVerificationEnabled" ], workflowEnabled: false },
            setFlowCompletionConfigs: vi.fn()
        });
        renderProperties();

        expect(screen.getByRole("alert")).toHaveClass("MuiAlert-standardWarning");
        expect(screen.getByRole("alert"))
            .toHaveTextContent("flows:registrationFlow.steps.end.accountVerification.warning");
    });

    it("keeps account activation slightly indented from the verification option", () => {
        mocks.useAuthenticationFlowBuilderCore.mockReturnValue({
            flowCompletionConfigs: {},
            lastInteractedStepId: endStep.id,
            metadata: {
                supportedFlowCompletionConfigs: [ "isEmailVerificationEnabled", "isAccountLockOnCreationEnabled" ],
                workflowEnabled: false
            },
            setFlowCompletionConfigs: vi.fn()
        });
        renderProperties();

        const verificationOption: HTMLElement = screen.getByText(
            "flows:registrationFlow.steps.end.accountVerification.hint"
        ).parentElement as HTMLElement;
        const activationOption: HTMLElement = screen.getByText(
            "flows:registrationFlow.steps.end.accountActivation.activateImmediately.hint"
        ).parentElement as HTMLElement;

        expect(parseFloat(window.getComputedStyle(activationOption).marginLeft))
            .toBeGreaterThan(parseFloat(window.getComputedStyle(verificationOption).marginLeft) || 0);
    });

    it("preserves account setting dependencies when email verification is disabled", () => {
        const setFlowCompletionConfigs: Mock = vi.fn();

        mocks.useAuthenticationFlowBuilderCore.mockReturnValue({
            flowCompletionConfigs: {
                isAccountLockOnCreationEnabled: "false",
                isAutoLoginEnabled: "true",
                isEmailVerificationEnabled: "true"
            },
            lastInteractedStepId: endStep.id,
            metadata: { supportedFlowCompletionConfigs: [ "isEmailVerificationEnabled" ], workflowEnabled: false },
            setFlowCompletionConfigs
        });
        renderProperties();

        fireEvent.click(screen.getByRole("checkbox", { name: /accountVerification.label/ }));

        expect(setFlowCompletionConfigs).toHaveBeenCalledWith({
            isAccountLockOnCreationEnabled: "true",
            isAutoLoginEnabled: "false",
            isEmailVerificationEnabled: "false"
        });
        expect(mocks.updateNodeData).not.toHaveBeenCalled();
    });

    it("keeps the provision target label color unchanged when either radio option is focused", () => {
        renderProperties();

        const label: HTMLElement = screen.getByText("flows:registrationFlow.steps.end.provisionTarget.label");
        const color: string = window.getComputedStyle(label).color;

        screen.getAllByRole("radio").forEach((radio: HTMLElement): void => {
            fireEvent.focus(radio);

            expect(label).toHaveClass("Mui-focused");
            expect(window.getComputedStyle(label).color).toBe(color);
            fireEvent.blur(radio);
        });
    });

    it("sets the new-organization target without losing the action or executor metadata", () => {
        renderProperties();

        const radio: HTMLElement = within(screen.getByTestId(`${componentId}-provision-target`))
            .getByRole("radio", { name: /provisionTarget.newOrganization.label/ });

        expect(radio).not.toBeChecked();
        fireEvent.click(radio);

        expect(getUpdatedAction()).toEqual({
            ...endStep.data.action,
            executor: {
                ...endStep.data.action.executor,
                meta: { ...endStep.data.action.executor.meta, provisionTarget: "NEW_ORGANIZATION" }
            }
        });
    });

    it("removes only the provision target when the current organization is selected", () => {
        const node: Node = { ...endStep, data: { ...endStep.data, action: {
            ...endStep.data.action,
            executor: { ...endStep.data.action.executor,
                meta: { ...endStep.data.action.executor.meta, provisionTarget: "NEW_ORGANIZATION" } }
        } } };

        mocks.useNodesData.mockReturnValue(node);
        renderProperties();

        const group: HTMLElement = screen.getByTestId(`${componentId}-provision-target`);

        expect(within(group).getByRole("radio", { name: /provisionTarget.newOrganization.label/ })).toBeChecked();
        fireEvent.click(within(group).getByRole("radio", { name: /provisionTarget.currentOrganization.label/ }));

        expect(getUpdatedAction(node)).toEqual(endStep.data.action);
    });

    it("serializes selected role IDs without losing other executor metadata", () => {
        renderProperties();

        const input: HTMLElement = within(screen.getByTestId(`${componentId}-organization-roles-input`))
            .getByRole("combobox");

        expect(screen.getByText("Manager · Organization")).toBeInTheDocument();
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
