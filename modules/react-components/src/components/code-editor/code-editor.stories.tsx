/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
 * @returns the story for displaying the default code editor.
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
 * @returns the story for displaying code editor with linting.
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
 * @returns the story for displaying a readonly code editor.
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
 * @returns the story for displaying a smart code editor.
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
 * @returns the story for displaying JSON code editor.
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
 * @returns the story for displaying TypeScript code editor
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
 * @returns the story for displaying the code editor themes.
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
