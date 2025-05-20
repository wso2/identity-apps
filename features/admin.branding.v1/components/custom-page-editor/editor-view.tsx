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

import { CodeEditor, ResourceTab } from "@wso2is/react-components";
import { Editor } from "codemirror";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useRef
} from "react";

interface EditorViewTabsProps {
    html: string;
    css: string;
    js: string;
    readOnly?: boolean;
    onContentUpdate?: (content: {
        html: string;
        css: string;
        js: string;
    }) => void;
    "data-testid"?: string;
}

export const EditorViewTabs: FunctionComponent<EditorViewTabsProps> = (
    props: EditorViewTabsProps
): ReactElement => {
    const {
        html,
        css,
        js,
        readOnly,
        onContentUpdate,
        "data-testid": testId = "layout-editor-tabs"
    } = props;

    const htmlContent: React.MutableRefObject<string> = useRef<string>(html);
    const cssContent: React.MutableRefObject<string> = useRef<string>(css);
    const jsContent: React.MutableRefObject<string> = useRef<string>(js);

    // Keep refs in sync when props change
    useEffect(() => {
        htmlContent.current = html;
    }, [ html ]);

    useEffect(() => {
        cssContent.current = css;
    }, [ css ]);

    useEffect(() => {
        jsContent.current = js;
    }, [ js ]);


    const handleTabChange = () => {
        onContentUpdate?.({
            css: cssContent.current,
            html: htmlContent.current,
            js: jsContent.current
        });
    };

    return (
        <ResourceTab
            onTabChange = { handleTabChange }
            panes = { [
                {
                    menuItem: "HTML",
                    render: () => (
                        <ResourceTab.Pane attached = { false } data-testid={ `${ testId }-html-tab` }>
                            <CodeEditor
                                language = "htmlmixed"
                                sourceCode = { html }
                                options = { { lineWrapping: true } }
                                onChange = { (_editor: Editor, _data: any, value: string) => {
                                    htmlContent.current = value;
                                } }
                                onBlur = { () => onContentUpdate?.({
                                    css: cssContent.current,
                                    html: htmlContent.current,
                                    js: jsContent.current
                                }) }
                                readOnly = { readOnly }
                                theme = "light"
                                data-testid = { `${ testId }-html-editor` }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: "CSS",
                    render: () => (
                        <ResourceTab.Pane attached = { false } data-testid = { `${ testId }-css-tab` }>
                            <CodeEditor
                                language = "css"
                                sourceCode = { css }
                                options = { { lineWrapping: true } }
                                onChange = { (_editor: Editor, _data: any, value: string) => {
                                    cssContent.current = value;
                                } }
                                onBlur = { () => onContentUpdate?.({
                                    css: cssContent.current,
                                    html: htmlContent.current,
                                    js: jsContent.current
                                }) }
                                readOnly = { readOnly }
                                theme = "light"
                                data-testid = { `${ testId }-css-editor` }
                            />
                        </ResourceTab.Pane>
                    )
                },
                {
                    menuItem: "JavaScript",
                    render: () => (
                        <ResourceTab.Pane attached = { false } data-testid = { `${ testId }-js-tab` }>
                            <CodeEditor
                                language = "javascript"
                                sourceCode = { js }
                                options = { { lineWrapping: true } }
                                onChange = { (_editor: Editor, _data: any, value: string) => {
                                    jsContent.current = value;
                                } }
                                onBlur={ () => onContentUpdate?.({
                                    css: cssContent.current,
                                    html: htmlContent.current,
                                    js: jsContent.current
                                }) }
                                readOnly = { readOnly }
                                theme = "light"
                                data-testid = { `${ testId }-js-editor` }
                            />
                        </ResourceTab.Pane>
                    )
                }
            ] }
            data-testid = { `${ testId }-tabs` }
        />
    );
};

/**
 * Default props for the component.
 */
EditorViewTabs.defaultProps = {
    "data-testid" : "layout-editor-tabs",
    readOnly: false
};

