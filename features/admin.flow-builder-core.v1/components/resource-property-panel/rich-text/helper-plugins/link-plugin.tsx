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

import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import { CheckIcon, PenToSquareIcon } from "@oxygen-ui/react-icons";
import {
    $getSelection,
    $isRangeSelection,
    BaseSelection,
    CLICK_COMMAND,
    CommandListenerPriority,
    EditorState,
    ElementNode,
    KEY_ESCAPE_COMMAND,
    SELECTION_CHANGE_COMMAND,
    TextNode
} from "lexical";
import React, {
    ChangeEvent,
    KeyboardEvent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { createPortal } from "react-dom";
import { getSelectedNode } from "../utils/get-selected-node";
import "./link-plugin.scss";

const LowPriority: CommandListenerPriority = 1;

/**
 * Positions the editor element based on the selection rectangle.
 * @param editor - The editor element to position.
 * @param rect - The bounding rectangle of the selection.
 */
const positionEditorElement = (editor: HTMLDivElement, rect: DOMRect | null): void => {
    if (rect === null) {
        editor.style.opacity = "0";
        editor.style.top = "-1000px";
        editor.style.left = "-1000px";
    } else {
        editor.style.opacity = "1";
        editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
        editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2}px`;
    }
};

/**
 * Link editor component for managing links in the rich text editor.
 */
const LinkEditor = (): ReactElement => {
    const [ editor ] = useLexicalComposerContext();
    const editorRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement | null>(null);
    const inputRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const [ linkUrl, setLinkUrl ] = useState("");
    const [ isEditMode, setEditMode ] = useState(false);
    const [ lastSelection, setLastSelection ] = useState<BaseSelection | null>(null);

    /**
     * Updates the link editor position and state based on the current selection.
     */
    const updateLinkEditor: () => void = useCallback(() => {
        const selection: BaseSelection = $getSelection();

        if ($isRangeSelection(selection)) {
            const node: TextNode | ElementNode = getSelectedNode(selection);
            const parent: ElementNode = node.getParent();

            if ($isLinkNode(parent)) {
                setLinkUrl(parent.getURL());
            } else if ($isLinkNode(node)) {
                setLinkUrl(node.getURL());
            } else {
                setLinkUrl("");

                return;
            }
        }

        const editorElem: HTMLDivElement = editorRef.current;
        const nativeSelection: Selection = window.getSelection();
        const activeElement: Element = document.activeElement;

        if (editorElem === null) {
            return;
        }

        const rootElement: HTMLElement = editor.getRootElement();

        if (
            selection !== null &&
            nativeSelection !== null &&
            !nativeSelection.isCollapsed &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode)
        ) {
            const domRange: Range = nativeSelection.getRangeAt(0);
            let rect: DOMRect;

            if (nativeSelection.anchorNode === rootElement) {
                let inner: HTMLElement = rootElement;

                while (inner.firstElementChild != null) {
                    inner = inner.firstElementChild as HTMLElement;
                }
                rect = inner.getBoundingClientRect();
            } else {
                rect = domRange.getBoundingClientRect();
            }

            positionEditorElement(editorElem, rect);
            setLastSelection(selection);
        } else if (!activeElement || activeElement.className !== "link-input") {
            if (rootElement !== null) {
                positionEditorElement(editorElem, null);
            }
            setLastSelection(null);
            setEditMode(false);
            setLinkUrl("");
        }

        return true;
    }, [ editor ]);

    /**
     * Sets up event listeners for window resize and scroll to update the link editor position.
     */
    useEffect(() => {
        const scrollerElem: HTMLElement = document.body;

        const update = (): void => {
            editor.getEditorState().read(() => {
                updateLinkEditor();
            });
        };

        window.addEventListener("resize", update);
        scrollerElem.addEventListener("scroll", update);

        return () => {
            window.removeEventListener("resize", update);
            scrollerElem.removeEventListener("scroll", update);
        };
    }, [ editor, updateLinkEditor ]);

    /**
     * Registers commands and listeners for the link editor.
     */
    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
                editorState.read(() => {
                    updateLinkEditor();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateLinkEditor();

                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                () => {
                    if (isEditMode) {
                        setEditMode(false);

                        return true;
                    }

                    return false;
                },
                LowPriority
            )
        );
    }, [ editor, updateLinkEditor, isEditMode ]);

    /**
     * Updates the link editor position.
     */
    useEffect(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor();
        });
    }, [ editor, updateLinkEditor ]);

    /**
     * Focuses the input field when in edit mode.
     */
    useEffect(() => {
        if (isEditMode && inputRef?.current) {
            inputRef.current.focus();
        }
    }, [ isEditMode ]);

    return (
        <div ref={ editorRef } className="rich-text-toolbar-link-editor">
            <div className="link-input">
                { isEditMode ? (
                    <>
                        <TextField
                            inputRef={ inputRef }
                            fullWidth
                            value={ linkUrl }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                setLinkUrl(event.target.value)
                            }
                            placeholder="Enter link URL"
                            onKeyDown={ (event: KeyboardEvent<HTMLInputElement>) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    if (lastSelection !== null) {
                                        if (linkUrl !== "") {
                                            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                                        }
                                        setEditMode(false);
                                    }
                                } else if (event.key === "Escape") {
                                    event.preventDefault();
                                    setEditMode(false);
                                }
                            } }
                        />
                        <IconButton onClick={ () => setEditMode(false) }>
                            <CheckIcon />
                        </IconButton>
                    </>
                ) : (
                    <>
                        <a href={ linkUrl } target="_blank" rel="noopener noreferrer">
                            { linkUrl }
                        </a>
                        <IconButton onClick={ () => setEditMode(true) }>
                            <PenToSquareIcon />
                        </IconButton>
                    </>
                ) }
            </div>
        </div>
    );
};

/**
 * Custom link plugin that handles link editing in the rich text editor.
 */
const CustomLinkPlugin = (): ReactElement => {
    const [ editor ] = useLexicalComposerContext();

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CLICK_COMMAND,
                (payload: MouseEvent) => {
                    const selection: BaseSelection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        const node: TextNode | ElementNode = getSelectedNode(selection);
                        const linkNode: ElementNode = $isLinkNode(node) ? node : node.getParent();

                        if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
                            window.open(linkNode.getURL(), "_blank");

                            return true;
                        }
                    }

                    return false;
                },
                LowPriority
            )
        );
    }, [ editor ]);

    return createPortal(<LinkEditor />, document.body);
};

export default CustomLinkPlugin;
