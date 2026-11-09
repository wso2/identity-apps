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
import React, { ChangeEvent, ReactElement, ReactNode } from "react";
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FunctionLibraryContentEditor from "../function-library-content-editor";
import type {} from "@testing-library/jest-dom/vitest";

interface CodeEditorPropsInterface {
    editorDidMount: (editor: { getValue: () => string; setValue: (value: string) => void }) => void;
    onChange: (editor: unknown, data: unknown, value: string) => void;
    "data-componentid": string;
}

interface FilePickerPropsInterface {
    onChange: (result: { file: File }) => void;
    scriptEditor: ReactNode;
    "data-componentid": string;
}

vi.mock("@wso2is/admin.core.v1/configs/ui", () => ({
    getCertificateIllustrations: () => ({
        uploadPlaceholder: "upload.svg"
    })
}));

vi.mock("@wso2is/react-components", () => ({
    // A textarea stands in for CodeMirror: typing in it reports the new content like the editor does.
    CodeEditor: ({
        editorDidMount,
        onChange,
        "data-componentid": componentId
    }: CodeEditorPropsInterface): ReactElement => {
        editorDidMount({ getValue: (): string => "", setValue: vi.fn() });

        return (
            <textarea
                data-componentid={ componentId }
                onChange={ (event: ChangeEvent<HTMLTextAreaElement>) => onChange(null, null, event.target.value) }
            />
        );
    },
    // Reports the selected file like the real picker, and shows the editor that replaces its paste area.
    FilePicker: ({
        onChange,
        scriptEditor,
        "data-componentid": componentId
    }: FilePickerPropsInterface): ReactElement => (
        <div data-componentid={ componentId }>
            <input
                type="file"
                data-componentid={ `${ componentId }-input` }
                onChange={ (event: ChangeEvent<HTMLInputElement>) => onChange({ file: event.target.files[0] }) }
            />
            <button
                type="button"
                data-componentid={ `${ componentId }-remove` }
                onClick={ () => onChange({ file: null }) }
            >
                Remove
            </button>
            { scriptEditor }
        </div>
    ),
    Hint: ({ children }: { children: ReactNode }): ReactElement => <div>{ children }</div>
}));

/**
 * FileReader whose reads finish only when the test calls `finish`, so the order in which reads complete can be
 * controlled.
 */
class ControlledFileReader {
    public static readonly instances: ControlledFileReader[] = [];
    // jsdom's File cannot be read back, so the content of each selected file is kept here by file name.
    public static readonly contents: Map<string, string> = new Map<string, string>();
    public onload: () => void = null;
    public result: string = null;
    private file: File;

    constructor() {
        ControlledFileReader.instances.push(this);
    }

    public readAsText(file: File): void {
        this.file = file;
    }

    public finish(): void {
        this.result = ControlledFileReader.contents.get(this.file.name);
        this.onload?.();
    }
}

const COMPONENT_ID: string = "content-editor";

const renderEditor = (onChange: Mock, value: string = "", readOnly: boolean = false): void => {
    render(
        <FunctionLibraryContentEditor
            value={ value }
            onChange={ onChange }
            readOnly={ readOnly }
            data-componentid={ COMPONENT_ID }
        />
    );
};

const selectFile = (name: string, content: string): void => {
    ControlledFileReader.contents.set(name, content);
    fireEvent.change(screen.getByTestId(`${ COMPONENT_ID }-file-picker-input`), {
        target: { files: [ new File([ content ], name, { type: "text/javascript" }) ] }
    });
};

describe("FunctionLibraryContentEditor", () => {
    let onChangeMock: Mock;

    beforeEach(() => {
        ControlledFileReader.instances.length = 0;
        ControlledFileReader.contents.clear();
        vi.stubGlobal("FileReader", ControlledFileReader);
        onChangeMock = vi.fn();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("passes the content of the selected file to onChange", () => {
        renderEditor(onChangeMock);
        selectFile("a.js", "module.exports.a = 1;");
        ControlledFileReader.instances[0].finish();

        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith("module.exports.a = 1;");
    });

    it("ignores a read that finishes after another file was selected", () => {
        renderEditor(onChangeMock);
        selectFile("first.js", "module.exports.first = 1;");
        selectFile("second.js", "module.exports.second = 2;");
        ControlledFileReader.instances[1].finish();
        ControlledFileReader.instances[0].finish();

        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith("module.exports.second = 2;");
    });

    it("ignores a read that finishes after the content was edited", () => {
        renderEditor(onChangeMock);
        selectFile("a.js", "module.exports.a = 1;");
        fireEvent.change(screen.getByTestId(`${ COMPONENT_ID }-code-editor`), { target: { value: "typed" } });
        ControlledFileReader.instances[0].finish();

        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith("typed");
    });

    it("puts back the content from before the upload when the file is removed", () => {
        renderEditor(onChangeMock, "module.exports.original = 1;");
        selectFile("a.js", "module.exports.a = 1;");
        ControlledFileReader.instances[0].finish();
        fireEvent.click(screen.getByTestId(`${ COMPONENT_ID }-file-picker-remove`));

        expect(onChangeMock).toHaveBeenNthCalledWith(1, "module.exports.a = 1;");
        expect(onChangeMock).toHaveBeenNthCalledWith(2, "module.exports.original = 1;");
    });

    it("shows only the editor, without the file picker, when read-only", () => {
        renderEditor(onChangeMock, "module.exports.a = 1;", true);

        expect(screen.getByTestId(`${ COMPONENT_ID }-code-editor`)).toBeInTheDocument();
        expect(screen.queryByTestId(`${ COMPONENT_ID }-file-picker`)).not.toBeInTheDocument();
    });
});
