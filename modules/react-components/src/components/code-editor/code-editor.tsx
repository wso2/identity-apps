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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import classNames from "classnames";
import * as codemirror from "codemirror";
import JSBeautify from "js-beautify";
import { JSHINT } from "jshint/dist/jshint";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SVGProps,
    useEffect,
    useState
} from "react";
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
import { Modal } from "semantic-ui-react";
import { ReactComponent as CheckIcon } from "../../assets/images/icons/check-icon.svg";
import { ReactComponent as CopyIcon } from "../../assets/images/icons/copy-icon.svg";
import { ReactComponent as MaximizeIcon } from "../../assets/images/icons/maximize-icon.svg";
import { ReactComponent as MinimizeIcon } from "../../assets/images/icons/minimize-icon.svg";
import { GenericIcon } from "../icon";
import { Tooltip } from "../typography";

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
export interface CodeEditorProps extends IUnControlledCodeMirror, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Allow going full screen.
     */
    allowFullScreen?: boolean;
    /**
     * Allow to control the fullscreen mode from outside.
     */
    controlledFullScreenMode?: boolean;
    /**
     * Whether to format the code.
     */
    beautify?: boolean;
    /**
     * Trigger the fullscreen mode.
     */
    triggerFullScreen?: boolean;
    /**
     * Language the code is written in.
     */
    language?: "javascript" | "json" | "typescript" | "htmlmixed";
    /**
     * Flat to enable line wrapping.
     */
    lineWrapping?: boolean;
    /**
     * Whether to enable linting or not.
     */
    lint?: boolean;
    /**
     * Should the editor be formatted for a one line command.
     */
    oneLiner?: boolean;
    /**
     * Callback to be triggered on fullscreen toggle.
     */
    onFullScreenToggle?: (isFullScreen: boolean) => void;
    /**
     * If the editor is read only or not.
     */
    readOnly?: boolean | string;
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
     * Height of the editor.
     */
    height?: "100%" | string;
    /**
     * Editor theme.
     */
    theme?: "dark" | "light";
    /**
     * Get theme from the environment.
     */
    getThemeFromEnvironment?: boolean;
    /**
     * i18n translations for content.
     */
    translations?: CodeEditorContentI18nInterface;
    /**
     * Enable clipboard copy option.
     */
    withClipboardCopy?: boolean;
}

/**
 * Interface for the i18n string of the component.
 */
export interface CodeEditorContentI18nInterface {
    copyCode: ReactNode;
    exitFullScreen: ReactNode;
    goFullScreen: ReactNode;
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
        allowFullScreen,
        beautify,
        className,
        controlledFullScreenMode,
        getThemeFromEnvironment,
        height,
        language,
        lineWrapping,
        lint,
        onFullScreenToggle,
        options,
        oneLiner,
        readOnly,
        showLineNumbers,
        smart,
        sourceCode,
        tabSize,
        theme,
        translations,
        triggerFullScreen,
        withClipboardCopy,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const [ editorInstance, setEditorInstance ] = useState<codemirror.Editor>(undefined);
    const [
        copyToClipboardIcon,
        setCopyToClipboardIcon
    ] = useState<FunctionComponent<SVGProps<SVGSVGElement>> | (() => FunctionComponent<SVGProps<SVGSVGElement>>)>(
        CopyIcon
    );
    const [
        fullScreenToggleIcon,
        setFullScreenToggleIcon
    ] = useState<FunctionComponent<SVGProps<SVGSVGElement>> | (() => FunctionComponent<SVGProps<SVGSVGElement>>)>(
        MaximizeIcon
    );
    const [ isEditorFullScreen, setIsEditorFullScreen ] = useState<boolean>(false);
    const [ darkMode, setDarkMode ] = useState<boolean>(false);

    /**
     * Set the internal full screen state based on the externally provided state.
     */
    useEffect(() => {

        if (triggerFullScreen === undefined) {
            return;
        }
        
        if (triggerFullScreen) {
            setFullScreenToggleIcon(MinimizeIcon);
        } else {
            setFullScreenToggleIcon(MaximizeIcon);
        }

        setIsEditorFullScreen(triggerFullScreen);
        onFullScreenToggle(triggerFullScreen);
    }, [ triggerFullScreen ]);

    /**
     * Gets the browser color scheme so that the color scheme of the textarea can be decided.
     */
    useEffect(() => {

        // If `getThemeFromEnvironment` is false or `matchMedia` is not supported, fallback to dark theme.
        if (!getThemeFromEnvironment || !window.matchMedia) {
            setDarkMode(true);

            return;
        }

        if (window.matchMedia("(prefers-color-scheme:dark)").matches) {
            setDarkMode(true);
        }

        const callback = (e: MediaQueryListEvent): void => {
            if (e.matches) {
                setDarkMode(true);

                return;
            }

            setDarkMode(false);
        };

        try {
            window.matchMedia("(prefers-color-scheme:dark)")
                .addEventListener("change", (e: MediaQueryListEvent) => callback(e));
        } catch (error) {
            try {
                // Older versions of Safari doesn't support `addEventListener`.
                window.matchMedia("(prefers-color-scheme:dark)")
                    .addListener((e: MediaQueryListEvent) => callback(e));
            } catch (error) {
                // Fallback to dark if everything fails.
                setDarkMode(true);
            }
        }

        // Housekeeping. Remove the listeners.
        return () => {
            try {
                window.matchMedia("(prefers-color-scheme:dark)")
                    .removeEventListener("change", (e: MediaQueryListEvent) => callback(e));
            } catch (parentError) {
                try {
                    // Older versions of Safari doesn't support `addEventListener`.
                    window.matchMedia("(prefers-color-scheme:dark)")
                        .removeListener((e: MediaQueryListEvent) => callback(e));
                } catch (error) {
                    // TODO: Rather than silently failing, add debug logs here.
                }
            }
        };
    }, [ getThemeFromEnvironment ]);

    /**
     * Resolves the language mode.
     *
     * @param {string} language - Selected language.
     * @return {object} Resolved mode.
     */
    const resolveMode = (language: string): {
        json: boolean;
        name: "javascript" | string;
        statementIndent: number;
        typescript: boolean;
    } => {

        if (!language) {
            throw new Error("Please define a language.");
        }

        return {
            json: language === "json",
            name: (language === "json" || language === "typescript") ? "javascript" : language,
            statementIndent: 4,
            typescript: language === "typescript"
        };
    };

    /**
     * Resolves the editor theme.
     *
     * @return {"material" | "default"} Resolved mode.
     */
    const resolveTheme = (): "material" | "default" => {
        if (getThemeFromEnvironment) {
            return (darkMode ? "material" : "default");
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
            return JSBeautify(code, { indent_size: tabSize, space_in_empty_paren: true });
        }

        return code;
    };

    /**
     * Handles clipboard copy event internally.
     */
    const handleCopyToClipboard = (): void => {

        CommonUtils.copyTextToClipboard(editorInstance.doc.getValue())
            .then(() => {
                setCopyToClipboardIcon(CheckIcon);

                setTimeout(() => {
                    setCopyToClipboardIcon(CopyIcon);
                }, 1000);
            });
    };

    /**
     * Handles Full Screen mode toggle event event.
     */
    const handleFullScreenToggle = (): void => {

        if (!isEditorFullScreen) {
            setFullScreenToggleIcon(MinimizeIcon);
        } else {
            setFullScreenToggleIcon(MaximizeIcon);
        }

        onFullScreenToggle(!isEditorFullScreen);
        setIsEditorFullScreen(!isEditorFullScreen);
    };

    const classes = classNames(
        "code-editor",
        {
            "dark": resolveTheme() === "material",
            "light": resolveTheme() === "default",
            "one-liner": oneLiner,
            "with-actions": withClipboardCopy || allowFullScreen
        }
        , className);

    const fullScreenWrapperClasses = classNames("code-editor-fullscreen-wrapper", { theme });

    /**
     * Render inner content.
     *
     * @return {React.ReactElement}
     */
    const renderContent = (): ReactElement => {

        // Renders the full screen toggle.
        const renderFullScreenToggle = (): ReactElement => (
            <div className="editor-action" onClick={ handleFullScreenToggle }>
                <Tooltip
                    compact
                    trigger={ (
                        <div>
                            <GenericIcon
                                hoverable
                                size="mini"
                                transparent
                                icon={ fullScreenToggleIcon }
                            />
                        </div>
                    ) }
                    content={
                        isEditorFullScreen
                            ? translations?.exitFullScreen || "Exit full-Screen"
                            : translations?.goFullScreen || "Go full-Screen"
                    }
                    size="mini"
                />
            </div>
        );

        return (
            <div className={ classes }>
                <div className="editor-actions">
                    {
                        allowFullScreen && (
                            // If the full screen mode trigger is handled from outside, we don't need to show the
                            // embedded `Go full-screen` button.
                            !controlledFullScreenMode
                                ? isEditorFullScreen
                                    ? renderFullScreenToggle()
                                    : null
                                : renderFullScreenToggle()
                        )
                    }
                    {
                        withClipboardCopy && (
                            <div className="editor-action" onClick={ handleCopyToClipboard }>
                                <Tooltip
                                    compact
                                    trigger={ (
                                        <div>
                                            <GenericIcon
                                                hoverable
                                                size="mini"
                                                transparent
                                                icon={ copyToClipboardIcon }
                                            />
                                        </div>
                                    ) }
                                    content={ translations?.copyCode || "Copy to clipboard" }
                                    size="mini"
                                />
                            </div>
                        )
                    }
                </div>
                <CodeMirror
                    { ...rest }
                    value={ beautify ? beautifyCode() : sourceCode }
                    editorDidMount={ (editor: codemirror.Editor, ...args) => {
                        if (height) {
                            editor.setSize("", height);
                        }

                        if (oneLiner) {
                            editor.setSize("", "100%");
                        }

                        setEditorInstance(editor);

                        rest.editorDidMount && rest.editorDidMount(editor, ...args);
                    } }
                    options={
                        {
                            autoCloseBrackets: smart,
                            autoCloseTags: smart,
                            extraKeys: smart ? { "Ctrl-Space": "autocomplete" } : {},
                            gutters: [ "note-gutter", "CodeMirror-linenumbers", "CodeMirror-lint-markers" ],
                            indentUnit: tabSize,
                            lineNumbers: !oneLiner
                                ? showLineNumbers
                                : false,
                            lineWrapping,
                            lint,
                            matchBrackets: smart,
                            matchTags: smart,
                            mode: options?.mode ? options.mode : resolveMode(language),
                            readOnly,
                            tabSize,
                            theme: resolveTheme(),
                            ...options
                        }
                    }
                    data-componentid={ componentId }
                    data-testid={ testId }
                />
            </div>
        );
    };

    return (
        (allowFullScreen && isEditorFullScreen)
            ? (
                <Modal open={ true } size="fullscreen" className={ fullScreenWrapperClasses }>
                    <Modal.Content className="editor-content" scrolling>
                        { renderContent() }
                    </Modal.Content>
                </Modal>
            )
            : renderContent()
    );
};

/**
 * Default props for the code editor component.
 */
CodeEditor.defaultProps = {
    allowFullScreen: false,
    controlledFullScreenMode: true,
    "data-componentid": "code-editor",
    "data-testid": "code-editor",
    language: "javascript",
    lineWrapping: true,
    lint: false,
    readOnly: false,
    showLineNumbers: true,
    smart: false,
    tabSize: 4,
    theme: "dark"
};
