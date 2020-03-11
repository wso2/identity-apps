/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 *
 */

import { withKnobs } from "@storybook/addon-knobs";
import * as React from "react";
import { CodeEditor } from "../../../src";
import { meta, SampleJSCodeSnippet, SampleJSONSnippet, SampleTSCodeSnippet } from "./code-editor.stories.meta";

export default {
    decorators: [ withKnobs ],
    parameters: {
        component: CodeEditor,
        componentSubtitle: meta.description,
    },
    title: "Components API/Components/Code Editor"
};

/**
 * Story to display the default code editor.
 * @return {any}
 */
export const Default = () => {

    return (
        <CodeEditor
            language="javascript"
            sourceCode={ SampleJSCodeSnippet }
        />
    );
};

Default.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description,
        },
    }
};

/**
 * Story to display a code editor with linting.
 * @return {any}
 */
export const EditorWithLinting = () => {

    return (
        <CodeEditor
            language="javascript"
            lint={ true }
            sourceCode={ SampleJSCodeSnippet }
        />
    );
};

EditorWithLinting.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description,
        },
    }
};

/**
 * Story to display a readonly code editor.
 * @return {any}
 */
export const ReadOnlyEditor = () => {

    return (
        <CodeEditor
            language="javascript"
            readOnly={ true }
            sourceCode={ SampleJSCodeSnippet }
        />
    );
};

ReadOnlyEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description,
        },
    }
};

/**
 * Story to display a smart code editor.
 * @return {any}
 */
export const SmartEditor = () => {

    return (
        <CodeEditor
            language="javascript"
            smart={ true }
            linting={ true }
            sourceCode={ SampleJSCodeSnippet }
        />
    );
};

SmartEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description,
        },
    }
};

/**
 * Story to display a JSON code editor.
 * @return {any}
 */
export const JSONEditor = () => {

    return (
        <CodeEditor
            language="json"
            smart={ true }
            lint={ true }
            sourceCode={ SampleJSONSnippet }
        />
    );
};

JSONEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description,
        },
    }
};

/**
 * Story to display a Typescript code editor.
 * @return {any}
 */
export const TypescriptEditor = () => {

    return (
        <CodeEditor
            language="typescript"
            smart={ true }
            sourceCode={ SampleTSCodeSnippet }
        />
    );
};

TypescriptEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 5 ].description,
        },
    }
};
