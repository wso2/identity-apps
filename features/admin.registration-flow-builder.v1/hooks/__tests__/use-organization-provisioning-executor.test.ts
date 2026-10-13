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

import { renderHook } from "@testing-library/react";
import { StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Node } from "@xyflow/react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import RegistrationFlowExecutorConstants from "../../constants/registration-flow-executor-constants";
import { AttributeType } from "../../models/attributes";
import useOrganizationProvisioningExecutor from "../use-organization-provisioning-executor";

const mocks: {
    getNodes: Mock<() => Node[]>;
    updateNodeData: Mock<(_id: string, _update: (_node: Node) => Record<string, unknown>) => void>;
} = vi.hoisted(() => ({ getNodes: vi.fn(), updateNodeData: vi.fn() }));

vi.mock("@xyflow/react", () => ({ useReactFlow: () => mocks }));

describe("useOrganizationProvisioningExecutor", () => {
    const endStep: Node = {
        data: { action: { executor: {
            meta: { provisionTarget: "NEW_ORGANIZATION", roleIds: JSON.stringify([ "role-1" ]) },
            name: RegistrationFlowExecutorConstants.USER_PROVISIONING_EXECUTOR
        } } },
        id: "end",
        position: { x: 0, y: 0 },
        type: StepTypes.End
    };

    const organizationStep: Node = {
        data: { components: [ { components: [ { config: {
            identifier: "organizationName",
            identifierType: AttributeType.Organization
        } } ] } ] },
        id: "view",
        position: { x: 0, y: 0 },
        type: StepTypes.View
    };

    beforeEach(() => {
        mocks.getNodes.mockReset();
        mocks.updateNodeData.mockReset();
        mocks.getNodes.mockReturnValue([ endStep ]);
    });

    it("selects the dispatch executor without losing existing executor metadata", () => {
        mocks.getNodes.mockReturnValue([ organizationStep, endStep ]);

        renderHook(() => useOrganizationProvisioningExecutor());

        expect(mocks.updateNodeData).toHaveBeenCalledTimes(1);
        expect(mocks.updateNodeData.mock.calls[0][0]).toBe(endStep.id);
        expect(mocks.updateNodeData.mock.calls[0][1](endStep)).toEqual({ action: { executor: {
            meta: { provisionTarget: "NEW_ORGANIZATION", roleIds: JSON.stringify([ "role-1" ]) },
            name: RegistrationFlowExecutorConstants.PROVISIONING_DISPATCH_EXECUTOR
        } } });
    });

    it("restores user provisioning when the organization name field is removed", () => {
        const dispatchEndStep: Node = {
            ...endStep,
            data: { action: { executor: {
                meta: { roleIds: JSON.stringify([ "role-1" ]) },
                name: RegistrationFlowExecutorConstants.PROVISIONING_DISPATCH_EXECUTOR
            } } }
        };

        mocks.getNodes.mockReturnValue([ organizationStep, dispatchEndStep ]);
        const { rerender } = renderHook(() => useOrganizationProvisioningExecutor());

        expect(mocks.updateNodeData).not.toHaveBeenCalled();
        mocks.getNodes.mockReturnValue([ dispatchEndStep ]);
        rerender();

        expect(mocks.updateNodeData).toHaveBeenCalledTimes(1);
        expect(mocks.updateNodeData.mock.calls[0][1](dispatchEndStep)).toEqual({ action: { executor: {
            meta: { roleIds: JSON.stringify([ "role-1" ]) },
            name: RegistrationFlowExecutorConstants.USER_PROVISIONING_EXECUTOR
        } } });
    });

    it("does not update an END step whose executor is already correct", () => {
        renderHook(() => useOrganizationProvisioningExecutor());

        expect(mocks.updateNodeData).not.toHaveBeenCalled();
    });

    it("does not update a flow without an END step", () => {
        mocks.getNodes.mockReturnValue([ organizationStep ]);

        renderHook(() => useOrganizationProvisioningExecutor());

        expect(mocks.updateNodeData).not.toHaveBeenCalled();
    });

    it("does not treat a user field as an organization name", () => {
        mocks.getNodes.mockReturnValue([ {
            ...organizationStep,
            data: { components: [ { config: {
                identifier: "organizationName",
                identifierType: AttributeType.User
            } } ] }
        }, endStep ]);

        renderHook(() => useOrganizationProvisioningExecutor());

        expect(mocks.updateNodeData).not.toHaveBeenCalled();
    });
});
