/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CodeEditor, ResourceTab } from "@wso2is/react-components";
import { Editor } from "codemirror";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

/**
 * Props interface for the EditorViewTabs component.
 */
interface EditorViewTabsProps extends IdentifiableComponentInterface {
    /**
     * HTML content to be displayed in the HTML editor tab.
     */
    html: string;
    /**
     * Sets the HTML content.
     *
     * @param html - HTML content to set.
     */
    setHtml: (html: string) => void;
    /**
     * CSS content to be displayed in the CSS editor tab.
     */
    css: string;
    /**
     * Sets the CSS content.
     *
     * @param css - CSS content to set.
     */
    setCss: (css: string) => void;
    /**
     * JavaScript content to be displayed in the JavaScript editor tab.
     */
    js: string;
    /**
     * Sets the JavaScript content.
     *
     * @param js - JavaScript content to set.
     */
    setJs: (js: string) => void;
    /**
     * Indicates whether the editor is in read-only mode.
     */
    readOnly: boolean;
}

export const EditorViewTabs: FunctionComponent<EditorViewTabsProps> = ({
    html,
    setHtml,
    css,
    setCss,
    js,
    setJs,
    readOnly,
    [ "data-componentid" ]: componentId = "layout-editor-tabs"
}: EditorViewTabsProps): ReactElement => {

    const { t } = useTranslation();

    return (
        <ResourceTab
            panes = { [
                {
                    menuItem: t("branding:customPageEditor.tabs.html.label"),
                    render: () => (
                        <ResourceTab.Pane attached = { false } data-componentid={ `${ componentId }-html-tab` }>
                            <CodeEditor
                                language="htmlmixed"
                                sourceCode={ html }
                                options={ { lineWrapping: true } }
                                onBlur={ (editor: Editor) => setHtml(editor.getValue()) }
                                readOnly={ readOnly }
                                theme="light"
                                data-componentid={ `${ componentId }-html-editor` }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: t("branding:customPageEditor.tabs.css.label"),
                    render: () => (
                        <ResourceTab.Pane attached = { false } data-componentid = { `${ componentId }-css-tab` }>
                            <CodeEditor
                                language="css"
                                sourceCode={ css }
                                options={ { lineWrapping: true } }
                                onBlur={ (editor: Editor) => setCss(editor.getValue()) }
                                readOnly={ readOnly }
                                theme="light"
                                data-componentid={ `${ componentId }-css-editor` }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: t("branding:customPageEditor.tabs.js.label"),
                    render: () => (
                        <ResourceTab.Pane attached = { false } data-componentid = { `${ componentId }-js-tab` }>
                            <CodeEditor
                                language="javascript"
                                sourceCode={ js }
                                options={ { lineWrapping: true } }
                                onBlur={ (editor: Editor) => setJs(editor.getValue()) }
                                readOnly={ readOnly }
                                theme="light"
                                data-componentid={ `${ componentId }-js-editor` }
                            />
                        </ResourceTab.Pane>
                    )
                }
            ] }
            data-componentid = { `${ componentId }-tabs` }
        />
    );
};
