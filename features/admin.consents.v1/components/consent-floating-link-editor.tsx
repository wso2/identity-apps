/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import { PenToSquareIcon } from "@oxygen-ui/react-icons";
import {
    $getSelection,
    $isRangeSelection,
    BaseSelection,
    CommandListenerPriority,
    EditorState,
    KEY_ESCAPE_COMMAND,
    LexicalNode,
    SELECTION_CHANGE_COMMAND
} from "lexical";
import React, {
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const LowPriority: CommandListenerPriority = 1;

type FloatingLinkEditorRootType = React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;
const FloatingLinkEditorRoot: FloatingLinkEditorRootType = styled("div")(
    ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius * 2,
        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)",
        left: "-10000px",
        marginTop: "-6px",
        maxWidth: "350px",
        opacity: 0,
        position: "absolute",
        top: "-10000px",
        transition: "opacity 0.5s",
        width: "100%",
        zIndex: 1200
    })
) as unknown as FloatingLinkEditorRootType;

const FloatingLinkContent: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "& .link-input-save-button": {
        alignSelf: "self-end",
        padding: "5px 24px",
        width: "fit-content"
    },
    "& a": {
        marginRight: "5px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    "&.edit-mode": {
        alignItems: "stretch",
        flexDirection: "column"
    },
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius * 2,
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1),
    justifyContent: "space-between",
    margin: theme.spacing(1, 1.5),
    padding: theme.spacing(1, 1.5),
    position: "relative"
}));

export const ConsentFloatingLinkEditor = (): ReactElement => {
    const [ editor ] = useLexicalComposerContext();
    const { t } = useTranslation();
    const editorRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const inputRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const [ linkUrl, setLinkUrl ] = useState<string>("");
    const [ isEditMode, setIsEditMode ] = useState<boolean>(false);
    const [ lastSelection, setLastSelection ] = useState<BaseSelection | null>(null);

    const updateFloatingEditor: () => void = useCallback((): void => {
        const selection: BaseSelection = $getSelection();
        const editorElem: HTMLDivElement = editorRef.current;

        if ($isRangeSelection(selection)) {
            const node: LexicalNode = selection.anchor.getNode();
            const parent: LexicalNode | null = node.getParent();

            if ($isLinkNode(parent)) {
                setLinkUrl(parent.getURL());
            } else if ($isLinkNode(node)) {
                setLinkUrl(node.getURL());
            } else {
                setLinkUrl("");
                setIsEditMode(false);
                if (editorElem) {
                    editorElem.style.opacity = "0";
                    editorElem.style.top = "-10000px";
                    editorElem.style.left = "-10000px";
                }

                return;
            }
        }

        const nativeSelection: Selection = window.getSelection();
        const activeElement: Element = document.activeElement;

        if (!editorElem) return;

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

            const viewportWidth: number = window.innerWidth;
            const editorWidth: number = editorElem.offsetWidth;
            const editorHeight: number = editorElem.offsetHeight;

            let top: number = rect.bottom + 10;
            let left: number = rect.left + rect.width / 2 - editorWidth / 2;

            if (left < 10) left = 10;
            else if (left + editorWidth > viewportWidth - 10) left = viewportWidth - editorWidth - 10;

            if (top + editorHeight > window.innerHeight - 10) {
                top = rect.top - editorHeight - 10;
            }

            editorElem.style.opacity = "1";
            editorElem.style.top = `${top}px`;
            editorElem.style.left = `${left}px`;
            setLastSelection(selection);
        } else if (!activeElement?.closest(".consent-floating-link-editor")) {
            if (rootElement) {
                editorElem.style.opacity = "0";
                editorElem.style.top = "-10000px";
                editorElem.style.left = "-10000px";
            }
            setLastSelection(null);
            setIsEditMode(false);
            setLinkUrl("");
        }
    }, [ editor ]);

    useEffect(() => {
        const scrollerElem: HTMLElement = document.body;
        const update = (): void => {
            editor.getEditorState().read(() => updateFloatingEditor());
        };

        window.addEventListener("resize", update);
        scrollerElem.addEventListener("scroll", update);

        return () => {
            window.removeEventListener("resize", update);
            scrollerElem.removeEventListener("scroll", update);
        };
    }, [ editor, updateFloatingEditor ]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
                editorState.read(() => updateFloatingEditor());
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateFloatingEditor();

                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                () => {
                    if (isEditMode) {
                        setIsEditMode(false);

                        return true;
                    }

                    return false;
                },
                LowPriority
            )
        );
    }, [ editor, updateFloatingEditor, isEditMode ]);

    useEffect(() => {
        editor.getEditorState().read(() => updateFloatingEditor());
    }, [ editor, updateFloatingEditor ]);

    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [ isEditMode ]);

    const handleSave: () => void = (): void => {
        if (lastSelection !== null && linkUrl) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
        }
        setIsEditMode(false);
    };

    return createPortal(
        <FloatingLinkEditorRoot
            ref={ editorRef }
            className="consent-floating-link-editor"
        >
            <FloatingLinkContent className={ isEditMode ? "edit-mode" : undefined }>
                { isEditMode ? (
                    <>
                        <TextField
                            inputRef={ inputRef }
                            fullWidth
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value) }
                            onKeyDown={ (e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === "Enter") { e.preventDefault(); handleSave(); }
                                else if (e.key === "Escape") { setIsEditMode(false); }
                            } }
                            placeholder="https://"
                            aria-label="URL"
                        />
                        <Button
                            size="small"
                            variant="outlined"
                            className="link-input-save-button"
                            onClick={ handleSave }
                        >
                            { t("common:save") }
                        </Button>
                    </>
                ) : (
                    <>
                        <a href={ linkUrl } target="_blank" rel="noopener noreferrer">
                            { linkUrl }
                        </a>
                        <IconButton size="small" onClick={ () => setIsEditMode(true) }>
                            <PenToSquareIcon size={ 14 } />
                        </IconButton>
                    </>
                ) }
            </FloatingLinkContent>
        </FloatingLinkEditorRoot>,
        document.body
    );
};
