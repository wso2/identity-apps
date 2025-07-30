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

import { AutoLinkNode, LinkNode } from "@lexical/link";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import Paper from "@oxygen-ui/react/Paper";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import { EditorThemeClasses, ParagraphNode, TextNode } from "lexical";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import HTMLPlugin from "./helper-plugins/html-plugin";
import CustomLinkPlugin from "./helper-plugins/link-plugin";
import ToolbarPlugin, { ToolbarPluginProps } from "./helper-plugins/toolbar-plugin";
import { Resource } from "../../../models/resources";
import "./rich-text.scss";

/**
 * Theme classes for the rich text editor.
 */
const ThemeClasses: EditorThemeClasses = {
    heading: {
        h1: "rich-text-heading-h1",
        h2: "rich-text-heading-h2",
        h3: "rich-text-heading-h3",
        h4: "rich-text-heading-h4",
        h5: "rich-text-heading-h5",
        h6: "rich-text-heading-h6"
    },
    link: "rich-text-link",
    paragraph: "rich-text-paragraph",
    text: {
        bold: "rich-text-bold",
        italic: "rich-text-italic",
        underline: "rich-text-underline"
    }
};

/**
 * Configs for the rich text editor.
 */
const editorConfig: InitialConfigType = {
    namespace: "Rich Text",
    nodes: [
        ParagraphNode,
        TextNode,
        HeadingNode,
        LinkNode,
        AutoLinkNode
    ],
    onError(error: Error) {
        throw error;
    },
    theme: ThemeClasses
};

/**
 * Props interface for the RichText component.
 */
export interface RichTextProps extends IdentifiableComponentInterface {
    /**
     * Options to customize the rich text editor toolbar.
     */
    ToolbarProps?: ToolbarPluginProps;
    /**
     * Listener for changes in the rich text editor content.
     *
     * @param value - The HTML string representation of the rich text editor content.
     */
    onChange: (value: string) => void;
    /**
     * Additional CSS class names to apply to the rich text editor container.
     */
    className?: string;
    /**
     * The resource associated with the rich text editor.
     */
    resource: Resource;
}

/**
 * Rich text editor component.
 */
const RichText: FunctionComponent<RichTextProps> = ({
    "data-componentid": componentId = "rich-text",
    ToolbarProps,
    className,
    onChange,
    resource
}: RichTextProps): ReactElement => {
    const { t } = useTranslation();

    return (
        <LexicalComposer initialConfig={ editorConfig }>
            <div className={ classNames("OxygenRichText-root", className) } data-componentid={ componentId }>
                <ToolbarPlugin { ...ToolbarProps } />
                <Paper className="OxygenRichText-editor-root" variant="outlined">
                    <RichTextPlugin
                        contentEditable={
                            (<ContentEditable
                                className="OxygenRichText-editor-input"
                                aria-placeholder="Enter some rich text..."
                                placeholder={ (
                                    <div className="OxygenRichText-editor-input-placeholder">
                                        { t("flows:core.elements.richText.placeholder") }
                                    </div>
                                ) }
                            />)
                        }
                        ErrorBoundary={ LexicalErrorBoundary }
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <LinkPlugin />
                    <CustomLinkPlugin />
                    <HTMLPlugin resource={ resource } onChange={ onChange } />
                </Paper>
            </div>
        </LexicalComposer>
    );
};

export default RichText;
