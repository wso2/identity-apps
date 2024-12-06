/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import Paper from "@oxygen-ui/react/Paper";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    $isTextNode,
    DOMConversionMap,
    DOMExportOutput,
    DOMExportOutputMap,
    Klass,
    LexicalEditor,
    LexicalNode,
    ParagraphNode,
    TextNode
} from "lexical";
import React, { FunctionComponent, HTMLAttributes, ReactElement, useEffect } from "react";
import ToolbarPlugin, { ToolbarPluginProps } from "./plugins/toolbar-plugin";
import { parseAllowedColor, parseAllowedFontSize } from "./style-config";
import "./rich-text.scss";

const removeStylesExportDOM = (editor: LexicalEditor, target: LexicalNode): DOMExportOutput => {
    const output = target.exportDOM(editor);

    if (output && output.element instanceof HTMLElement) {
        // Remove all inline styles and classes if the element is an HTMLElement
        // Children are checked as well since TextNode can be nested
        // in i, b, and strong tags.
        for (const el of [ output.element, ...output.element.querySelectorAll("[style],[class],[dir=\"ltr\"]") ]) {
            el.removeAttribute("class");
            el.removeAttribute("style");
            if (el.getAttribute("dir") === "ltr") {
                el.removeAttribute("dir");
            }
        }
    }

    return output;
};

const exportMap: DOMExportOutputMap = new Map<
    Klass<LexicalNode>,
    (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
        >([
            [ ParagraphNode, removeStylesExportDOM ],
            [ TextNode, removeStylesExportDOM ]
        ]);

const getExtraStyles = (element: HTMLElement): string => {
    // Parse styles from pasted input, but only if they match exactly the
    // sort of styles that would be produced by exportDOM
    let extraStyles = "";
    const fontSize = parseAllowedFontSize(element.style.fontSize);
    const backgroundColor = parseAllowedColor(element.style.backgroundColor);
    const color = parseAllowedColor(element.style.color);

    if (fontSize !== "" && fontSize !== "15px") {
        extraStyles += `font-size: ${fontSize};`;
    }
    if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
        extraStyles += `background-color: ${backgroundColor};`;
    }
    if (color !== "" && color !== "rgb(0, 0, 0)") {
        extraStyles += `color: ${color};`;
    }

    return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
    const importMap: DOMConversionMap = {};

    // Wrap all TextNode importers with a function that also imports
    // the custom styles implemented by the playground
    for (const [ tag, fn ] of Object.entries(TextNode.importDOM() || {})) {
        importMap[tag] = importNode => {
            const importer = fn(importNode);

            if (!importer) {
                return null;
            }

            return {
                ...importer,
                conversion: element => {
                    const output = importer.conversion(element);

                    if (
                        output === null ||
                        output.forChild === undefined ||
                        output.after !== undefined ||
                        output.node !== null
                    ) {
                        return output;
                    }
                    const extraStyles = getExtraStyles(element);

                    if (extraStyles) {
                        const { forChild } = output;

                        return {
                            ...output,
                            forChild: (child, parent) => {
                                const textNode = forChild(child, parent);

                                if ($isTextNode(textNode)) {
                                    textNode.setStyle(textNode.getStyle() + extraStyles);
                                }

                                return textNode;
                            }
                        };
                    }

                    return output;
                }
            };
        };
    }

    return importMap;
};

const editorConfig = {
    html: {
        export: exportMap,
        import: constructImportMap()
    },
    namespace: "Rich Text",
    nodes: [ ParagraphNode, TextNode ],
    onError(error: Error) {
        throw error;
    }
};

export interface RichTextProps extends IdentifiableComponentInterface, HTMLAttributes<HTMLDivElement> {
    ToolbarProps?: ToolbarPluginProps;
}

const RichText: FunctionComponent<RichTextProps> = ({
    "data-componentid": componentId = "rich-text",
    ToolbarProps
}: RichTextProps): ReactElement => {
    return (
        <LexicalComposer initialConfig={ editorConfig }>
            <div className="rich-text" data-componentid={ componentId }>
                <ToolbarPlugin { ...ToolbarProps } />
                <Paper className="rich-text-editor" variant="outlined">
                    <RichTextPlugin
                        contentEditable={
                            (<ContentEditable
                                className="rich-text-editor-input"
                                aria-placeholder="Enter some rich text..."
                                placeholder={ <div className="rich-text-editor-input-placeholder">Enter some rich text.</div> }
                            />)
                        }
                        ErrorBoundary={ LexicalErrorBoundary }
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                </Paper>
            </div>
        </LexicalComposer>
    );
};

export default RichText;
