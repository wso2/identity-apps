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
import Notification, { NotificationType } from "@wso2is/admin.flow-builder-core.v1/models/notification";
import { ExecutionTypes, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Node } from "@xyflow/react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import RegistrationFlowExecutorConstants from "../../constants/registration-flow-executor-constants";
import { AttributeType } from "../../models/attributes";
import useOrganizationAttributeValidation from "../use-organization-attribute-validation";

const mocks: {
    addNotification: Mock<(_notification: Notification) => void>;
    getNodes: Mock<() => Node[]>;
    removeNotification: Mock<(_id: string) => void>;
} = vi.hoisted(() => ({ addNotification: vi.fn(), getNodes: vi.fn(), removeNotification: vi.fn() }));
const useSharedOrganizationRolesMock: Mock = vi.hoisted(() => vi.fn());

vi.mock("@xyflow/react", () => ({ useReactFlow: () => mocks }));
vi.mock("@wso2is/admin.flow-builder-core.v1/hooks/use-validation-status", () => ({ default: () => mocks }));
vi.mock("../use-shared-organization-roles", () => ({ default: useSharedOrganizationRolesMock }));

describe("useOrganizationAttributeValidation", () => {
    const organizationStep: Node = {
        data: { components: [ { components: [ { config: {
            identifier: "organizationDescription",
            identifierType: AttributeType.Organization
        } } ] } ] },
        id: "view",
        position: { x: 0, y: 0 }
    };
    const organizationNameStep: Node = {
        ...organizationStep,
        data: { components: [ { config: {
            identifier: "organizationName",
            identifierType: AttributeType.Organization
        } } ] }
    };
    const passwordStep: Node = {
        data: { components: [ { action: { executor: {
            name: RegistrationFlowExecutorConstants.PASSWORD_PROVISIONING_EXECUTOR
        } } } ] },
        id: "password",
        position: { x: 0, y: 0 }
    };
    const federatedStep: Node = {
        data: { action: { executor: { name: ExecutionTypes.GoogleFederation } } },
        id: "federated",
        position: { x: 0, y: 0 },
        type: "EXECUTION"
    };

    beforeEach(() => {
        mocks.addNotification.mockReset();
        mocks.removeNotification.mockReset();
        mocks.getNodes.mockReset();
        mocks.getNodes.mockReturnValue([]);
        useSharedOrganizationRolesMock.mockReset();
        useSharedOrganizationRolesMock.mockReturnValue({ isLoaded: false, roles: [], sharedRoles: [] });
    });

    it("warns when organization fields are collected without an organization name", () => {
        mocks.getNodes.mockReturnValue([ organizationStep ]);

        renderHook(() => useOrganizationAttributeValidation());

        expect(mocks.addNotification).toHaveBeenCalledTimes(1);
        const notification: Notification = mocks.addNotification.mock.calls[0][0];

        expect(notification.getId()).toBe("organization-attribute-validation");
        expect(notification.getType()).toBe(NotificationType.WARNING);
        expect(notification.getMessage()).toBe("flows:core.validation.organizationAttributes.missingOrganizationName");
    });

    it("removes the warning when the organization name field is added", () => {
        mocks.getNodes.mockReturnValue([ organizationStep ]);
        const { rerender } = renderHook(() => useOrganizationAttributeValidation());

        mocks.getNodes.mockReturnValue([ organizationStep, {
            data: { components: [ { config: {
                identifier: "organizationName",
                identifierType: AttributeType.Organization
            } } ] },
            id: "name-step",
            position: { x: 0, y: 0 }
        } ]);
        rerender();

        expect(mocks.addNotification).toHaveBeenCalledTimes(1);
        expect(mocks.removeNotification).toHaveBeenCalledWith("organization-attribute-validation");
    });

    it("does not warn when the flow collects no organization fields", () => {
        renderHook(() => useOrganizationAttributeValidation());

        expect(mocks.addNotification).not.toHaveBeenCalled();
        expect(mocks.removeNotification).toHaveBeenCalledWith("organization-attribute-validation");
    });

    it.each([
        ExecutionTypes.GoogleFederation,
        ExecutionTypes.AppleFederation,
        ExecutionTypes.FacebookFederation,
        ExecutionTypes.MicrosoftFederation,
        ExecutionTypes.GithubFederation,
        ExecutionTypes.DigitalWalletFederation
    ])("blocks organization onboarding with %s", (executor: ExecutionTypes) => {
        mocks.getNodes.mockReturnValue([ organizationNameStep, {
            ...federatedStep,
            data: { action: { executor: { name: executor } } }
        } ]);

        renderHook(() => useOrganizationAttributeValidation());

        expect(mocks.addNotification).toHaveBeenCalledTimes(1);
        const notification: Notification = mocks.addNotification.mock.calls[0][0];

        expect(notification.getId()).toBe("organization-federation-validation");
        expect(notification.getType()).toBe(NotificationType.ERROR);
        expect(notification.getMessage()).toBe(
            "flows:core.validation.organizationAttributes.federatedAuthenticationNotSupported"
        );
    });

    it("allows username and password organization onboarding", () => {
        mocks.getNodes.mockReturnValue([ organizationNameStep, passwordStep ]);

        renderHook(() => useOrganizationAttributeValidation());

        expect(mocks.addNotification).not.toHaveBeenCalled();
    });

    it("blocks mixed password and federated organization onboarding", () => {
        mocks.getNodes.mockReturnValue([ organizationNameStep, passwordStep, federatedStep ]);

        renderHook(() => useOrganizationAttributeValidation());

        expect(mocks.addNotification.mock.calls[0][0].getType()).toBe(NotificationType.ERROR);
    });

    it("allows federated registration without organization onboarding", () => {
        mocks.getNodes.mockReturnValue([ federatedStep ]);

        renderHook(() => useOrganizationAttributeValidation());

        expect(mocks.addNotification).not.toHaveBeenCalled();
    });

    it("keeps only the missing-name warning for federated flows without an organization name", () => {
        mocks.getNodes.mockReturnValue([ organizationStep, federatedStep ]);

        renderHook(() => useOrganizationAttributeValidation());

        expect(mocks.addNotification).toHaveBeenCalledTimes(1);
        expect(mocks.addNotification.mock.calls[0][0].getType()).toBe(NotificationType.WARNING);
    });

    it.each([ "federated authentication", "organization name" ])("removes the error after removing %s", (
        removed: string
    ) => {
        mocks.getNodes.mockReturnValue([ organizationNameStep, federatedStep ]);
        const { rerender } = renderHook(() => useOrganizationAttributeValidation());

        mocks.removeNotification.mockClear();
        mocks.getNodes.mockReturnValue(removed === "federated authentication" ? [ organizationNameStep ] :
            [ federatedStep ]);
        rerender();

        expect(mocks.removeNotification).toHaveBeenCalledWith("organization-federation-validation");
    });

    it("removes its notification on unmount", () => {
        mocks.getNodes.mockReturnValue([ organizationStep ]);
        const { unmount } = renderHook(() => useOrganizationAttributeValidation());

        mocks.removeNotification.mockClear();
        unmount();

        expect(mocks.removeNotification).toHaveBeenCalledTimes(3);
        expect(mocks.removeNotification).toHaveBeenCalledWith("organization-attribute-validation");
        expect(mocks.removeNotification).toHaveBeenCalledWith("organization-federation-validation");
        expect(mocks.removeNotification).toHaveBeenCalledWith("organization-role-validation");
    });

    it("warns about an unshared configured role without requiring the properties panel to be open", () => {
        mocks.getNodes.mockReturnValue([ organizationNameStep, {
            data: { action: { executor: { meta: { roleIds: JSON.stringify([ "role-a" ]) } } } },
            id: "end", position: { x: 0, y: 0 }, type: StepTypes.End
        } ]);
        useSharedOrganizationRolesMock.mockReturnValue({ isLoaded: true, roles: [], sharedRoles: [] });
        const { rerender } = renderHook(() => useOrganizationAttributeValidation());
        const notification: Notification = mocks.addNotification.mock.calls[0][0];

        expect(useSharedOrganizationRolesMock).toHaveBeenCalledWith(true);
        expect(notification.getId()).toBe("organization-role-validation");
        expect(notification.getType()).toBe(NotificationType.WARNING);
        expect(notification.getMessage()).toBe("flows:registrationFlow.steps.end.organizationRoles.unavailablerole-a");

        useSharedOrganizationRolesMock.mockReturnValue({
            isLoaded: true, roles: [], sharedRoles: [ { id: "role-a" } ]
        });
        mocks.removeNotification.mockClear();
        rerender();

        expect(mocks.removeNotification).toHaveBeenCalledWith("organization-role-validation");
    });

});
