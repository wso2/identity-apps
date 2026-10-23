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
import { OrganizationAttribute } from "../../../../models/attributes";
import DefineOrganizationAttributeModal from "../define-organization-attribute-modal";
import type {} from "@testing-library/jest-dom/vitest";

describe("DefineOrganizationAttributeModal", () => {
    const componentId: string = "define-organization-attribute-modal";
    const onClose: Mock<() => void> = vi.fn();
    const onSubmit: Mock<(_attribute: OrganizationAttribute) => void> = vi.fn();

    const renderModal = (attribute: OrganizationAttribute | null = null): RenderResult => render(
        <DefineOrganizationAttributeModal
            open
            attribute={ attribute }
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

    it("renders an empty dialog with submission disabled", () => {
        renderModal();

        expect(screen.getByTestId(componentId)).toBeInTheDocument();
        expect(getInput("label")).toHaveValue("");
        expect(getInput("identifier")).toHaveValue("");
        expect(screen.getByTestId(`${componentId}-submit-button`)).toBeDisabled();
    });

    it("derives the identifier from the label and submits trimmed values", () => {
        renderModal();

        fireEvent.change(getInput("label"), { target: { value: " Business Type " } });

        expect(getInput("identifier")).toHaveValue("businessType");
        fireEvent.click(screen.getByTestId(`${componentId}-submit-button`));

        expect(onSubmit).toHaveBeenCalledWith({ claimURI: "businessType", displayName: "Business Type" });
    });

    it("preserves a manually entered identifier when the label changes", () => {
        renderModal();

        fireEvent.change(getInput("label"), { target: { value: "Business Type" } });
        fireEvent.change(getInput("identifier"), { target: { value: "businessCategory" } });
        fireEvent.change(getInput("label"), { target: { value: "Business Category" } });

        expect(getInput("identifier")).toHaveValue("businessCategory");
        fireEvent.click(screen.getByTestId(`${componentId}-submit-button`));

        expect(onSubmit).toHaveBeenCalledWith({ claimURI: "businessCategory", displayName: "Business Category" });
    });

    it.each([
        [ "invalid/key", "Identifier must start with a letter and contain only letters, numbers or underscores." ],
        [ "1invalid", "Identifier must start with a letter and contain only letters, numbers or underscores." ],
        [ "organizationName", "That identifier belongs to a built-in attribute. Choose a different one." ]
    ])("rejects the identifier %s", (identifier: string, error: string): void => {
        renderModal();

        fireEvent.change(getInput("label"), { target: { value: "Business Type" } });
        fireEvent.change(getInput("identifier"), { target: { value: identifier } });
        fireEvent.click(screen.getByTestId(`${componentId}-submit-button`));

        expect(screen.getByText(error)).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it("loads an existing attribute without changing its identifier when its label is edited", () => {
        const attribute: OrganizationAttribute = { claimURI: "taxId", displayName: "Tax ID" };

        renderModal(attribute);

        expect(getInput("label")).toHaveValue("Tax ID");
        expect(getInput("identifier")).toHaveValue("taxId");
        fireEvent.change(getInput("label"), { target: { value: "Company Tax ID" } });
        fireEvent.click(screen.getByTestId(`${componentId}-submit-button`));

        expect(onSubmit).toHaveBeenCalledWith({ claimURI: "taxId", displayName: "Company Tax ID" });
    });

    it("resets the draft and validation error when reopened for a new attribute", () => {
        const { rerender } = renderModal({ claimURI: "taxId", displayName: "Tax ID" });

        fireEvent.change(getInput("identifier"), { target: { value: "invalid/key" } });
        fireEvent.click(screen.getByTestId(`${componentId}-submit-button`));
        expect(screen.getByText(/Identifier must start with a letter/)).toBeInTheDocument();

        rerender(<DefineOrganizationAttributeModal
            open={ false } attribute={ null } onClose={ onClose } onSubmit={ onSubmit }
        />);
        rerender(<DefineOrganizationAttributeModal
            open attribute={ null } onClose={ onClose } onSubmit={ onSubmit }
        />);

        expect(getInput("label")).toHaveValue("");
        expect(getInput("identifier")).toHaveValue("");
        expect(screen.queryByText(/Identifier must start with a letter/)).not.toBeInTheDocument();
        fireEvent.change(getInput("label"), { target: { value: "Business Type" } });
        expect(getInput("identifier")).toHaveValue("businessType");
    });

    it("closes without submitting when cancelled", () => {
        renderModal();

        fireEvent.click(screen.getByTestId(`${componentId}-cancel-button`));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(onSubmit).not.toHaveBeenCalled();
    });
});
