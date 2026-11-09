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

import { fireEvent, render, screen } from "@wso2is/unit-testing/utils";
import React, { ChangeEvent, ReactElement } from "react";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import FunctionLibraryContentEditor from "../function-library-content-editor";
import type {} from "@testing-library/jest-dom/vitest";

interface MonacoEditorPropsInterface {
    onChange: (value: string) => void;
    options: { readOnly?: boolean };
    theme: string;
    value: string;
    "data-componentid": string;
}

const userPreferences: { theme: string } = vi.hoisted(() => ({ theme: undefined }));

// A textarea stands in for the Monaco editor and shows the props it was given.
vi.mock("@wso2is/admin.core.v1/components/monaco-editor/monaco-editor", () => ({
    default: ({
        onChange,
        options,
        theme,
        value,
        "data-componentid": componentId
    }: MonacoEditorPropsInterface): ReactElement => (
        <textarea
            data-componentid={ componentId }
            data-theme={ theme }
            readOnly={ options?.readOnly }
            value={ value }
            onChange={ (event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value) }
        />
    )
}));

vi.mock("@wso2is/admin.core.v1/utils/app-utils", () => ({
    AppUtils: {
        getUserPreferences: () => ({
            identityAppsSettings: {
                userPreferences: userPreferences.theme ? { conditionalAuthEditorTheme: userPreferences.theme } : {}
            }
        }),
        setUserPreferences: vi.fn()
    }
}));

vi.mock("@wso2is/admin.applications.v1/constants/application-management", () => ({
    ApplicationManagementConstants: {
        CONDITIONAL_AUTH_EDITOR_THEME_STORAGE_KEY: "conditionalAuthEditorTheme"
    }
}));

const COMPONENT_ID: string = "content-editor";
const EDITOR_ID: string = `${ COMPONENT_ID }-code-editor`;

const renderEditor = (onChange: Mock, props: { error?: string; readOnly?: boolean; value?: string } = {}): void => {
    render(
        <FunctionLibraryContentEditor
            value={ props.value ?? "" }
            onChange={ onChange }
            readOnly={ props.readOnly }
            error={ props.error }
            data-componentid={ COMPONENT_ID }
        />
    );
};

describe("FunctionLibraryContentEditor", () => {
    let onChangeMock: Mock;

    beforeEach(() => {
        userPreferences.theme = undefined;
        onChangeMock = vi.fn();
    });

    it("shows the content and passes edits to onChange", async () => {
        renderEditor(onChangeMock, { value: "module.exports.a = 1;" });
        const editor: HTMLElement = await screen.findByTestId(EDITOR_ID);

        expect(editor).toHaveValue("module.exports.a = 1;");
        fireEvent.change(editor, { target: { value: "module.exports.b = 2;" } });
        expect(onChangeMock).toHaveBeenCalledWith("module.exports.b = 2;");
    });

    it("makes the editor read-only when asked", async () => {
        renderEditor(onChangeMock, { readOnly: true });

        expect(await screen.findByTestId(EDITOR_ID)).toHaveAttribute("readonly");
    });

    it("uses the dark theme by default", async () => {
        renderEditor(onChangeMock);
        expect(await screen.findByTestId(EDITOR_ID)).toHaveAttribute("data-theme", "vs-dark");
    });

    it("uses the theme saved by the conditional authentication script editor", async () => {
        userPreferences.theme = "vc";
        renderEditor(onChangeMock);
        expect(await screen.findByTestId(EDITOR_ID)).toHaveAttribute("data-theme", "vc");
    });

    it("opens the same content in a full-screen editor", async () => {
        renderEditor(onChangeMock, { value: "module.exports.a = 1;" });
        fireEvent.click(await screen.findByTestId(`${ COMPONENT_ID }-full-screen-toggle`));

        const editors: HTMLElement[] = await screen.findAllByTestId(EDITOR_ID);

        expect(screen.getByTestId(`${ COMPONENT_ID }-full-screen`)).toBeInTheDocument();
        expect(editors).toHaveLength(2);
        editors.forEach((editor: HTMLElement) => expect(editor).toHaveValue("module.exports.a = 1;"));
    });

    it("shows the validation error below the editor", async () => {
        renderEditor(onChangeMock, { error: "Function library content cannot be empty." });

        expect(await screen.findByTestId(`${ COMPONENT_ID }-error`))
            .toHaveTextContent("Function library content cannot be empty.");
    });
});
