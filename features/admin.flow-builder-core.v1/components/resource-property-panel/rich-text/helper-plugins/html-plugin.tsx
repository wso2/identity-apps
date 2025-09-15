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

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $insertNodes, EditorState, LexicalNode, RootNode } from "lexical";
import { MutableRefObject, ReactElement, useEffect, useRef } from "react";
import { Resource } from "../../../../models/resources";

/**
 * Props interface for the HTML plugin.
 */
interface HTMLPluginProps {
    /**
     * Listener for changes in the editor state.
     */
    onChange: (value: string) => void;
    /**
     * The resource associated with the rich text editor.
     */
    resource: Resource;
    /**
     * Whether the editor is disabled.
     */
    disabled?: boolean;
}

const PRE_WRAP_STYLE_WITH_CLASS: string = "\" style=\"white-space: pre-wrap;\"";
const PRE_WRAP_STYLE: string = "style=\"white-space: pre-wrap;\"";
const TEXT_ALIGN_TYPES: string[] = [ "left", "right", "center", "justify" ];
const TEXT_ALIGN_PLACEHOLDER: string = "{{textAlign}}";
const TEXT_ALIGN_STYLE_WITH_CLASS: string = `" style="text-align: ${TEXT_ALIGN_PLACEHOLDER};"`;
const TEXT_ALIGN_STYLE: string = `style="text-align: ${TEXT_ALIGN_PLACEHOLDER};"`;
const DIR_LTR_CLASS: string = "\" dir=\"ltr\"";
const DIR_LTR: string = "dir=\"ltr\"";
const CLASS_NAME_PLACEHOLDER: string = "{{className}}";
const ADDITIONAL_CLASSES: string = `class="${CLASS_NAME_PLACEHOLDER}"`;
const EMPTY_CONTENT: string = "<p class=\"rich-text-paragraph\"><br></p>";

/**
 * This enum represents the different types of updates that can occur in the editor.
 */
enum UPDATE_TYPES {
    INTERNAL = "internal",
    EXTERNAL = "external",
    NONE = "none"
}

/**
 * Convert nodes tree to HTML string.
 */
const HTMLPlugin = ({ onChange, resource, disabled }: HTMLPluginProps): ReactElement => {
    const [ editor ] = useLexicalComposerContext();
    const updateType: MutableRefObject<UPDATE_TYPES> = useRef<UPDATE_TYPES>(UPDATE_TYPES.NONE);

    useEffect(() => {
        if (!editor || !resource) {
            return;
        }

        if (updateType.current === UPDATE_TYPES.INTERNAL) {
            updateType.current = UPDATE_TYPES.NONE;

            return;
        }

        const parser: DOMParser = new DOMParser();
        const dom: Document = parser.parseFromString(postProcessHTML(resource.config.text), "text/html");

        editor.update(() => {
            updateType.current = UPDATE_TYPES.EXTERNAL;

            const root: RootNode = $getRoot();

            root.clear(); // clear existing content if needed.

            const nodes: Array<LexicalNode> = $generateNodesFromDOM(editor, dom);

            $insertNodes(nodes); // insert new nodes into the editor.
        });
    }, [ editor, resource ]);

    /**
     * Register the update listener to process the editor state changes.
     */
    useEffect(() => {
        if (!editor || !onChange) {
            return;
        }

        return editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
            processEditorUpdate(editorState);
        });
    }, [ editor, onChange ]);

    /**
     * Handle the editor's disabled state.
     */
    useEffect(() => {
        if (disabled) {
            editor.setEditable(false);
        } else {
            if (!editor._editable) {
                editor.setEditable(true);
            }
        }
    }, [ disabled ]);

    /**
     * Process the editor state to generate HTML and call the onChange handler.
     */
    const processEditorUpdate: (editorState: EditorState) => void = (editorState: EditorState) => {
        if (updateType.current === UPDATE_TYPES.EXTERNAL) {
            updateType.current = UPDATE_TYPES.NONE;

            return;
        }

        editorState.read(() => {
            updateType.current = UPDATE_TYPES.INTERNAL;

            const htmlString: string = $generateHtmlFromNodes(editor);

            const processedHTML: string = preProcessHTML(htmlString);

            onChange(processedHTML === EMPTY_CONTENT ? "" : processedHTML);
        });
    };

    /**
     * Pre-process the HTML string to add additional classes and styles.
     *
     * @param html - The HTML string to pre-process.
     * @returns The pre-processed HTML string.
     */
    const preProcessHTML = (html: string): string => {

        html = html.replaceAll(DIR_LTR_CLASS, "\"");
        html = html.replaceAll(DIR_LTR, "");

        html = html.replaceAll(PRE_WRAP_STYLE_WITH_CLASS, " rich-text-pre-wrap\"");
        html = html.replaceAll(PRE_WRAP_STYLE,
            ADDITIONAL_CLASSES.replace(CLASS_NAME_PLACEHOLDER, "rich-text-pre-wrap"));

        for (const textAlign of TEXT_ALIGN_TYPES) {
            html = html.replaceAll(TEXT_ALIGN_STYLE_WITH_CLASS.replace(TEXT_ALIGN_PLACEHOLDER, textAlign),
                ` rich-text-align-${textAlign}"`);
            html = html.replaceAll(TEXT_ALIGN_STYLE.replace(TEXT_ALIGN_PLACEHOLDER, textAlign),
                ADDITIONAL_CLASSES.replace(CLASS_NAME_PLACEHOLDER, `rich-text-align-${textAlign}`));
        }

        return html;
    };

    /**
     * Post-process the HTML string to reverse the transformations done by preProcessHTML.
     * This method converts processed HTML back to its original format.
     *
     * @param html - The processed HTML string to reverse.
     * @returns The original HTML string.
     */
    const postProcessHTML = (html: string): string => {
        // Reverse text alignment class replacements.
        for (const textAlign of TEXT_ALIGN_TYPES) {
            html = html.replaceAll(` rich-text-align-${textAlign}"`,
                TEXT_ALIGN_STYLE_WITH_CLASS.replace(TEXT_ALIGN_PLACEHOLDER, textAlign));
            html = html.replaceAll(ADDITIONAL_CLASSES.replace(CLASS_NAME_PLACEHOLDER, `rich-text-align-${textAlign}`),
                TEXT_ALIGN_STYLE.replace(TEXT_ALIGN_PLACEHOLDER, textAlign));
        }

        // Reverse pre-wrap style replacements.
        html = html.replaceAll(" rich-text-pre-wrap\"", PRE_WRAP_STYLE_WITH_CLASS);
        html = html.replaceAll(ADDITIONAL_CLASSES.replace(CLASS_NAME_PLACEHOLDER, "rich-text-pre-wrap"),
            PRE_WRAP_STYLE);

        return html;
    };

    return null;
};

export default HTMLPlugin;
