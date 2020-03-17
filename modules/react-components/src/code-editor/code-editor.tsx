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
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import { JSHINT } from "jshint/dist/jshint";
import JSBeautify from "js-beautify";

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
    beautify?: boolean;
    language?: "javascript" | "json" | "typescript";
    lint?: boolean;
    readOnly?: boolean;
    showLineNumbers?: boolean;
    smart?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sourceCode?: any;
    tabSize?: number;
    theme?: "dark" | "light";
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
        beautify,
        language,
        lint,
        readOnly,
        showLineNumbers,
        smart,
        sourceCode,
        tabSize,
        theme,
        ...rest
    } = props;

    /**
     * Resolves the language mode.
     *
     * @param {string} language - Selected language.
     * @return {object} Resolved mode.
     */
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

    /**
     * Resolves the editor theme.
     *
     * @param {string} theme - Selected theme.
     * @return {object} Resolved mode.
     */
    const resolveTheme = (theme: string): string => {
        if (!(theme === "dark" || theme === "light")) {
            throw new Error("Please select a supported theme. Only `dark` and `light` are supported at the moment.");
        }

        return (theme === "dark" ? "material" : "default");
    };

    /**
     * Beautifies the source code.
     *
     * @return {string} Beautified source code snippet.
     */
    const beautifyCode = (): string => {
        let code = sourceCode;

        if (code instanceof Array) {
            code = code.join("");
        }

        if (language === "javascript") {
            // eslint-disable-next-line @typescript-eslint/camelcase
            return JSBeautify(code, { indent_size: tabSize, space_in_empty_paren: true });
        }

        return code;
    };

    return (
        <CodeMirror
            { ...rest }
            value={ beautify ? beautifyCode() : sourceCode }
            options={
                {
                    ...rest.options,
                    mode: props.options?.mode ? props.options.mode : resolveMode(language),
                    theme: resolveTheme(theme),
                    lineNumbers: showLineNumbers,
                    readOnly,
                    gutters: [ "note-gutter", "CodeMirror-linenumbers", "CodeMirror-lint-markers" ],
                    tabSize,
                    lint,
                    autoCloseBrackets: smart,
                    matchBrackets: smart,
                    matchTags: smart,
                    autoCloseTags: smart,
                    extraKeys: smart ? { "Ctrl-Space": "autocomplete", } : {},
                }
            }
        />
    );
};

CodeEditor.defaultProps = {
    language: "javascript",
    lint: false,
    readOnly: false,
    showLineNumbers: true,
    smart: false,
    tabSize: 4,
    theme: "dark"
};
