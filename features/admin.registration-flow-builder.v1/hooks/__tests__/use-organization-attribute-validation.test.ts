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
import { Node } from "@xyflow/react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { AttributeType } from "../../models/attributes";
import useOrganizationAttributeValidation from "../use-organization-attribute-validation";

const mocks: {
    addNotification: Mock<(_notification: Notification) => void>;
    getNodes: Mock<() => Node[]>;
    removeNotification: Mock<(_id: string) => void>;
} = vi.hoisted(() => ({ addNotification: vi.fn(), getNodes: vi.fn(), removeNotification: vi.fn() }));

vi.mock("@xyflow/react", () => ({ useReactFlow: () => mocks }));
vi.mock("@wso2is/admin.flow-builder-core.v1/hooks/use-validation-status", () => ({ default: () => mocks }));

describe("useOrganizationAttributeValidation", () => {
    const organizationStep: Node = {
        data: { components: [ { components: [ { config: {
            identifier: "organizationDescription",
            identifierType: AttributeType.Organization
        } } ] } ] },
        id: "view",
        position: { x: 0, y: 0 }
    };

    beforeEach(() => {
        mocks.addNotification.mockReset();
        mocks.removeNotification.mockReset();
        mocks.getNodes.mockReset();
        mocks.getNodes.mockReturnValue([]);
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

    it("removes its notification on unmount", () => {
        mocks.getNodes.mockReturnValue([ organizationStep ]);
        const { unmount } = renderHook(() => useOrganizationAttributeValidation());

        mocks.removeNotification.mockClear();
        unmount();

        expect(mocks.removeNotification).toHaveBeenCalledTimes(1);
        expect(mocks.removeNotification).toHaveBeenCalledWith("organization-attribute-validation");
    });
});
