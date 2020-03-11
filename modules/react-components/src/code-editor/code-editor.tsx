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
 */

import React, { ReactElement } from "react";
import { IUnControlledCodeMirror, UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/javascript-lint";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import { JSHINT } from "jshint/dist/jshint";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/hint/show-hint.css";

// Putting the `JSHINT` in the window object.
// See, https://github.com/scniro/react-codemirror2/issues/21
window.JSHINT = JSHINT;

/**
 * Code editor component Prop types.
 */
export interface CodeEditorProps extends IUnControlledCodeMirror {
    sourceCode?: any;
    language?: "javascript" | "json" | "typescript";
    readOnly?: boolean;
    showLineNumbers?: boolean;
    theme?: Themes;
    tabSize?: number;
    lint?: boolean;
}

enum Themes {
    dark = "material",
    light = "default"
}

/**
 * Code editor component.
 *
 * @param {CodeEditorProps} props - Props injected to the danger zone component.
 * @return {React.ReactElement}
 */
export const CodeEditor: React.FunctionComponent<CodeEditorProps> = (
    props: CodeEditorProps
): ReactElement => {

    const {
        language,
        lint,
        readOnly,
        showLineNumbers,
        sourceCode,
        tabSize,
        theme,
        ...rest
    } = props;

    const resolveMode = (language: string): object => {
        if (!language) {
            throw new Error("Please define a language.");
        }

        return  {
            name: (language === "json" || language === "typescript") ? "javascript" : language,
            json: language === "json",
            typescript: language === "typescript",
            statementIndent: 4
        };
    };

    return (
        <CodeMirror
            { ...rest }
            value={ sourceCode }
            options={
                {
                    ...rest.options,
                    mode: props.options?.mode ? props.options.mode : resolveMode(language),
                    theme,
                    lineNumbers: showLineNumbers,
                    readOnly,
                    gutters: [ "note-gutter", "CodeMirror-linenumbers", "CodeMirror-lint-markers" ],
                    tabSize,
                    lint,
                    extraKeys: {
                        "Ctrl-Space": "autocomplete",
                    },
                }
            }
        />
    );
};

CodeEditor.defaultProps = {
    lint: true,
    readOnly: false,
    theme: Themes.dark,
    showLineNumbers: true,
    language: "javascript",
    tabSize: 4
};
