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

import { TestableComponentInterface } from "@wso2is/core/models";
import JSBeautify from "js-beautify";
import { JSHINT } from "jshint/dist/jshint";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { UnControlled as CodeMirror, IUnControlledCodeMirror } from "react-codemirror2";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/javascript-lint";
import "codemirror/addon/hint/sql-hint";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/sql/sql";
import "codemirror/mode/xml/xml";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/hint/show-hint.css";

// Putting the `JSHINT` in the window object. To handle,
// Property 'JSHINT' does not exist on type 'Window & typeof globalThis'.
// See, https://github.com/scniro/react-codemirror2/issues/21
interface CustomWindow extends Window {
    JSHINT: any;
}
(window as CustomWindow & typeof globalThis).JSHINT = JSHINT;

/**
 * Code editor component Prop types.
 */
export interface CodeEditorProps extends IUnControlledCodeMirror, TestableComponentInterface {
    /**
     * Whether to format the code.
     */
    beautify?: boolean;
    /**
     * Language the code is written in.
     */
    language?: "javascript" | "json" | "typescript" | "htmlmixed";
    /**
     * Whether to enable linting or not.
     */
    lint?: boolean;
    /**
     * If the editor is read only or not.
     */
    readOnly?: boolean;
    /**
     * Whether to show line numbers.
     */
    showLineNumbers?: boolean;
    /**
     * Whether to enable smart mode which will enable auto bracket
     * closing etc.
     */
    smart?: boolean;
    /**
     * Code to be displayed on the editor.
     */
    sourceCode?: any;
    /**
     * Tab indent size.
     */
    tabSize?: number;
    /**
     * Editor theme.
     */
    theme?: "dark" | "light";
    /**
     * Get theme from the environment.
     */
    getThemeFromEnvironment?: boolean;
}

/**
 * Code editor component.
 *
 * @param {CodeEditorProps} props - Props injected to the danger zone component.
 *
 * @return {React.ReactElement}
 */
export const CodeEditor: FunctionComponent<CodeEditorProps> = (
    props: CodeEditorProps
): ReactElement => {

    const {
        beautify,
        getThemeFromEnvironment,
        language,
        lint,
        options,
        readOnly,
        showLineNumbers,
        smart,
        sourceCode,
        tabSize,
        theme,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const [ dark, setDark ] = useState(false);
    
    /**
     * Gets the browser color scheme so that the color scheme of the textarea can be decided.
     */
    useEffect(() => {
        if (getThemeFromEnvironment && window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches) {
            setDark(true);
        }
        const callback = (e) => {
            if (e.matches) {
                setDark(true);
            } else {
                setDark(false);
            }
        };
        getThemeFromEnvironment &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", callback);

        return () => {
            getThemeFromEnvironment &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme:dark)").removeEventListener("change", callback);
        }
    }, [getThemeFromEnvironment]);
    
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
            json: language === "json",
            name: (language === "json" || language === "typescript") ? "javascript" : language,
            statementIndent: 4,
            typescript: language === "typescript"
        };
    };

    /**
     * Resolves the editor theme.
     *
     * @return {object} Resolved mode.
     */
    const resolveTheme = (): string => {
        if (getThemeFromEnvironment) {
            return (dark ? "material" : "default");
        }

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
                    ...options,
                    autoCloseBrackets: smart,
                    autoCloseTags: smart,
                    extraKeys: smart ? { "Ctrl-Space": "autocomplete" } : {},
                    gutters: [ "note-gutter", "CodeMirror-linenumbers", "CodeMirror-lint-markers" ],
                    indentUnit: tabSize,
                    lineNumbers: showLineNumbers,
                    lint,
                    matchBrackets: smart,
                    matchTags: smart,
                    mode: options?.mode ? options.mode : resolveMode(language),
                    readOnly,
                    tabSize,
                    theme: resolveTheme()
                }
            }
            data-testid={ testId }
        />
    );
};

/**
 * Default props for the code editor component.
 */
CodeEditor.defaultProps = {
    "data-testid": "code-editor",
    language: "javascript",
    lint: false,
    readOnly: false,
    showLineNumbers: true,
    smart: false,
    tabSize: 4,
    theme: "dark"
};
