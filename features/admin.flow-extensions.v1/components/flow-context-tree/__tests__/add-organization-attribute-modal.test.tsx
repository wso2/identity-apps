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

import { RenderResult, fireEvent, render, screen, within } from "@wso2is/unit-testing/utils";
import React from "react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import AddOrganizationAttributeModal from "../add-organization-attribute-modal";
import { OrganizationAttributeEntryInterface } from "../organization-attributes";
import type {} from "@testing-library/jest-dom/vitest";

describe("AddOrganizationAttributeModal", () => {
    const componentId: string = "add-organization-attribute-modal";
    const onClose: Mock<() => void> = vi.fn();
    const onSubmit: Mock<(_attributes: OrganizationAttributeEntryInterface[]) => void> = vi.fn();
    const attributeOptions: OrganizationAttributeEntryInterface[] = [
        { key: "businessType", label: "Business Type" },
        { key: "region", label: "Region" }
    ];

    const renderModal = (): RenderResult => render(
        <AddOrganizationAttributeModal
            open
            attributeOptions={ attributeOptions }
            existingKeys={ [ "region" ] }
            onClose={ onClose }
            onSubmit={ onSubmit }
        />
    );

    const getInput = (field: string): HTMLElement =>
        within(screen.getByTestId(`${componentId}-${field}`)).getByRole("textbox");

    beforeEach(() => {
        onClose.mockReset();
        onSubmit.mockReset();
    });

    it("disables submission until an attribute is selected", () => {
        renderModal();

        expect(screen.getByTestId(componentId)).toBeInTheDocument();
        expect(screen.getByTestId(`${componentId}-submit-button`)).toBeDisabled();
        expect(screen.getByTestId(`${componentId}-define-button`)).toBeDisabled();
    });

    it("offers collected attributes except keys that have already been added", () => {
        renderModal();

        const search: HTMLElement = within(screen.getByTestId(`${componentId}-search`)).getByRole("combobox");

        fireEvent.mouseDown(search);

        expect(screen.queryByRole("option", { name: /Region/ })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("option", { name: /Business Type/ }));
        fireEvent.click(screen.getByTestId(`${componentId}-submit-button`));

        expect(onSubmit).toHaveBeenCalledWith([ { key: "businessType", label: "Business Type" } ]);
    });

    it("adds a custom attribute using trimmed values and resets after submission", () => {
        renderModal();

        fireEvent.change(getInput("custom-key"), { target: { value: " taxId " } });
        fireEvent.change(getInput("custom-label"), { target: { value: " Tax ID " } });
        fireEvent.click(screen.getByTestId(`${componentId}-define-button`));

        expect(getInput("custom-key")).toHaveValue("");
        expect(getInput("custom-label")).toHaveValue("");
        fireEvent.click(screen.getByTestId(`${componentId}-submit-button`));

        expect(onSubmit).toHaveBeenCalledWith([ { key: "taxId", label: "Tax ID" } ]);
        expect(screen.getByTestId(`${componentId}-submit-button`)).toBeDisabled();
    });

    it("uses the key as the label when no custom label is provided", () => {
        renderModal();

        fireEvent.change(getInput("custom-key"), { target: { value: "taxId" } });
        fireEvent.click(screen.getByTestId(`${componentId}-define-button`));
        fireEvent.click(screen.getByTestId(`${componentId}-submit-button`));

        expect(onSubmit).toHaveBeenCalledWith([ { key: "taxId", label: "taxId" } ]);
    });

    it.each([ "businessType", "region" ])("rejects the duplicate key %s", (key: string): void => {
        renderModal();

        fireEvent.change(getInput("custom-key"), { target: { value: key } });
        fireEvent.click(screen.getByTestId(`${componentId}-define-button`));

        expect(screen.getByTestId(`${componentId}-define-error`))
            .toHaveTextContent("flowExtension:contextTree.addOrganizationAttributeModal.duplicateKey");
        expect(screen.getByTestId(`${componentId}-submit-button`)).toBeDisabled();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("rejects a key that cannot form an organization attribute path", () => {
        renderModal();

        fireEvent.change(getInput("custom-key"), { target: { value: "invalid/key" } });
        fireEvent.click(screen.getByTestId(`${componentId}-define-button`));

        expect(screen.getByTestId(`${componentId}-define-error`))
            .toHaveTextContent("flowExtension:contextTree.addOrganizationAttributeModal.invalidKey");
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("clears the selection and closes without submitting when cancelled", () => {
        renderModal();

        fireEvent.change(getInput("custom-key"), { target: { value: "taxId" } });
        fireEvent.click(screen.getByTestId(`${componentId}-define-button`));
        fireEvent.click(screen.getByTestId(`${componentId}-cancel-button`));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByTestId(`${componentId}-submit-button`)).toBeDisabled();
    });
});
