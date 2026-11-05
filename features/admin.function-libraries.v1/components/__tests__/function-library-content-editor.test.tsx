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
    editorDidMount: (editor: { setValue: (value: string) => void }) => void;
    onChange: (editor: unknown, data: unknown, value: string) => void;
    "data-componentid": string;
}

vi.mock("@wso2is/react-components", () => ({
    // A textarea stands in for CodeMirror: typing in it reports the new content like the editor does.
    CodeEditor: ({
        editorDidMount,
        onChange,
        "data-componentid": componentId
    }: CodeEditorPropsInterface): ReactElement => {
        editorDidMount({ setValue: vi.fn() });

        return (
            <textarea
                data-componentid={ componentId }
                onChange={ (event: ChangeEvent<HTMLTextAreaElement>) => onChange(null, null, event.target.value) }
            />
        );
    },
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

const selectFile = (name: string, content: string): void => {
    ControlledFileReader.contents.set(name, content);
    fireEvent.change(screen.getByTestId(`${ COMPONENT_ID }-file-input`), {
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
        render(<FunctionLibraryContentEditor value="" onChange={ onChangeMock } data-componentid={ COMPONENT_ID } />);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("passes the content of the selected file to onChange", () => {
        selectFile("a.js", "module.exports.a = 1;");
        ControlledFileReader.instances[0].finish();

        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith("module.exports.a = 1;");
    });

    it("ignores a read that finishes after another file was selected", () => {
        selectFile("first.js", "module.exports.first = 1;");
        selectFile("second.js", "module.exports.second = 2;");
        ControlledFileReader.instances[1].finish();
        ControlledFileReader.instances[0].finish();

        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith("module.exports.second = 2;");
    });

    it("ignores a read that finishes after the content was edited", () => {
        selectFile("a.js", "module.exports.a = 1;");
        fireEvent.change(screen.getByTestId(`${ COMPONENT_ID }-code-editor`), { target: { value: "typed" } });
        ControlledFileReader.instances[0].finish();

        expect(onChangeMock).toHaveBeenCalledTimes(1);
        expect(onChangeMock).toHaveBeenCalledWith("typed");
    });
});
