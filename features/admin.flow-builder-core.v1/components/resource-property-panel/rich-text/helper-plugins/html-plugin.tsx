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

import { $generateHtmlFromNodes } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";
import { ReactElement, useEffect } from "react";

/**
 * Props interface for the HTML plugin.
 */
interface HTMLPluginProps {
    onChange: (value: string) => void;
}

/**
 * Convert nodes tree to HTML string.
 */
const HTMLPlugin = ({ onChange }: HTMLPluginProps): ReactElement => {
    const [ editor ] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
            // Convert the editor state to HTML string whenever it updates.
            editorState.read(() => {
                const htmlString: string = $generateHtmlFromNodes(editor);

                //onChange(htmlString);
                console.log("Editor as HTML:", htmlString);
            });
        });
    }, [ editor, onChange ]);

    return null;
};

export default HTMLPlugin;
