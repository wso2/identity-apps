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
import { ParagraphNode, TextNode } from "lexical";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import CustomLinkPlugin from "./helper-plugins/link-plugin";
import ToolbarPlugin, { ToolbarPluginProps } from "./helper-plugins/toolbar-plugin";
import "./rich-text.scss";

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
    }
};

export interface RichTextProps extends IdentifiableComponentInterface, HTMLAttributes<HTMLDivElement> {
    ToolbarProps?: ToolbarPluginProps;
}

/**
 * Rich text editor component.
 */
const RichText: FunctionComponent<RichTextProps> = ({
    "data-componentid": componentId = "rich-text",
    ToolbarProps,
    className
}: RichTextProps): ReactElement => {
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
                                placeholder={
                                    <div className="OxygenRichText-editor-input-placeholder">Enter some rich text.</div>
                                }
                            />)
                        }
                        ErrorBoundary={ LexicalErrorBoundary }
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <LinkPlugin />
                    <CustomLinkPlugin />
                </Paper>
            </div>
        </LexicalComposer>
    );
};

export default RichText;
