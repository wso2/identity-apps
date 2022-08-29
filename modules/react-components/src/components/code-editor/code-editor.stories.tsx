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

import React, { ReactElement } from "react";
import { CodeEditor } from "./code-editor";
import { SampleJSCodeSnippet, SampleJSONSnippet, SampleTSCodeSnippet, meta } from "./code-editor.stories.meta";

export default {
    parameters: {
        component: CodeEditor,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Code Editor"
};

/**
 * Story to display the default code editor.
 *
 * @return {React.ReactElement}
 */
export const DefaultCodeEditor = (): ReactElement => (
    <CodeEditor
        language="javascript"
        sourceCode={ SampleJSCodeSnippet }
    />
);

DefaultCodeEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display a code editor with linting.
 *
 * @return {React.ReactElement}
 */
export const EditorWithLinting = (): ReactElement => (
    <CodeEditor
        language="javascript"
        lint={ true }
        sourceCode={ SampleJSCodeSnippet }
    />
);

EditorWithLinting.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display a readonly code editor.
 *
 * @return {React.ReactElement}
 */
export const ReadOnlyEditor = (): ReactElement => (
    <CodeEditor
        language="javascript"
        readOnly={ true }
        sourceCode={ SampleJSCodeSnippet }
    />
);

ReadOnlyEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to display a smart code editor.
 *
 * @return {React.ReactElement}
 */
export const SmartEditor = (): ReactElement => (
    <CodeEditor
        language="javascript"
        smart={ true }
        lint={ true }
        sourceCode={ SampleJSCodeSnippet }
    />
);

SmartEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};

/**
 * Story to display a JSON code editor.
 *
 * @return {React.ReactElement}
 */
export const JSONEditor = (): ReactElement => (
    <CodeEditor
        language="json"
        smart={ true }
        lint={ true }
        sourceCode={ SampleJSONSnippet }
    />
);

JSONEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description
        }
    }
};

/**
 * Story to display a Typescript code editor.
 *
 * @return {React.ReactElement}
 */
export const TypescriptEditor = (): ReactElement => (
    <CodeEditor
        language="typescript"
        smart={ true }
        sourceCode={ SampleTSCodeSnippet }
    />
);

TypescriptEditor.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 5 ].description
        }
    }
};

/**
 * Story to display the code editor themes.
 *
 * @return {React.ReactElement}
 */
export const CodeEditorThemes = (): ReactElement => (
    <CodeEditor
        language="javascript"
        smart={ true }
        lint={ true }
        theme="light"
        sourceCode={ SampleJSCodeSnippet }
    />
);

CodeEditorThemes.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 6 ].description
        }
    }
};
