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
import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { PenToSquareIcon } from "@oxygen-ui/react-icons";
import {
    $getSelection,
    $isRangeSelection,
    BaseSelection,
    CLICK_COMMAND,
    CommandListenerPriority,
    EditorState,
    ElementNode,
    KEY_ESCAPE_COMMAND,
    LexicalCommand,
    SELECTION_CHANGE_COMMAND,
    TextNode,
    createCommand
} from "lexical";
import React, {
    ChangeEvent,
    KeyboardEvent,
    MutableRefObject,
    ReactElement,
    MouseEvent as ReactMouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { getSelectedNode } from "../utils/get-selected-node";
import "./link-plugin.scss";

const LowPriority: CommandListenerPriority = 1;
const HighPriority: CommandListenerPriority = 3;

// Custom command for creating safe links.
export const TOGGLE_SAFE_LINK_COMMAND: LexicalCommand<string> = createCommand("TOGGLE_SAFE_LINK_COMMAND");

// Predefined URL options
interface PredefinedUrlOption {
    label: string;
    placeholder: string;
    value: string;
}

const PREDEFINED_URLS: PredefinedUrlOption[] = [
    {
        label: "flows:core.elements.richText.linkEditor.predefinedUrls.callbackOrApplicationAccessUrl",
        placeholder: "{{CALLBACK_OR_APPLICATION_ACCESS_URL}}",
        value: "{{application.callbackOrAccessUrl}}"
    },
    {
        label: "flows:core.elements.richText.linkEditor.predefinedUrls.applicationAccessUrl",
        placeholder: "{{APPLICATION_ACCESS_URL}}",
        value: "{{application.accessUrl}}"
    },
    {
        label: "flows:core.elements.richText.linkEditor.predefinedUrls.privacyPolicyUrl",
        placeholder: "{{PRIVACY_POLICY_URL}}",
        value: "{{branding.privacyPolicyUrl}}"
    },
    {
        label: "flows:core.elements.richText.linkEditor.predefinedUrls.termsOfUseUrl",
        placeholder: "{{TERMS_OF_USE_URL}}",
        value: "{{branding.termsOfUseUrl}}"
    },
    {
        label: "flows:core.elements.richText.linkEditor.predefinedUrls.supportEmail",
        placeholder: "{{SUPPORT_EMAIL}}",
        value: "mailto:{{branding.supportEmail}}"
    },
    {
        label: "flows:core.elements.richText.linkEditor.predefinedUrls.customUrl",
        placeholder: "",
        value: "CUSTOM"
    }
];

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

        // Get viewport dimensions.
        const viewportWidth: number = window.innerWidth;
        const viewportHeight: number = window.innerHeight;

        // Get editor dimensions.
        const editorWidth: number = editor.offsetWidth;
        const editorHeight: number = editor.offsetHeight;

        // Calculate initial position (centered below the selection).
        let top: number = rect.top + rect.height + window.pageYOffset + 10;
        let left: number = rect.left + window.pageXOffset - editorWidth / 2 + rect.width / 2;

        // Adjust horizontal position to keep editor within viewport.
        if (left < 0) {
            // If editor would be cut off on the left, align it to the left edge.
            left = 10;
        } else if (left + editorWidth > viewportWidth) {
            // If editor would be cut off on the right, align it to the right edge.
            left = viewportWidth - editorWidth - 10;
        }

        // Adjust vertical position to keep editor within viewport.
        if (top + editorHeight > viewportHeight + window.pageYOffset) {
            // If editor would be cut off at the bottom, position it above the selection.
            top = rect.top + window.pageYOffset - editorHeight - 10;
        }

        // Ensure top position is not negative.
        if (top < window.pageYOffset) {
            top = window.pageYOffset + 10;
        }

        editor.style.top = `${top}px`;
        editor.style.left = `${left}px`;
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
    const [ selectedUrlType, setSelectedUrlType ] = useState<string>("CUSTOM");

    const { t } = useTranslation();

    /**
     * Updates the link editor position and state based on the current selection.
     */
    const updateLinkEditor: () => void = useCallback(() => {
        const selection: BaseSelection = $getSelection();
        const editorElem: HTMLDivElement = editorRef.current;

        if ($isRangeSelection(selection)) {
            const node: TextNode | ElementNode = getSelectedNode(selection);
            const parent: ElementNode = node.getParent();

            if ($isLinkNode(parent)) {
                const url: string = parent.getURL();

                setLinkUrl(getPlaceholderUrl(url));
                setSelectedUrlType(determineUrlType(url));
            } else if ($isLinkNode(node)) {
                const url: string = node.getURL();

                setLinkUrl(getPlaceholderUrl(url));
                setSelectedUrlType(determineUrlType(url));
            } else {
                setLinkUrl("");
                setSelectedUrlType("CUSTOM");
                setEditMode(false);
                positionEditorElement(editorElem, null);

                return;
            }
        }

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
     * Gets the placeholder URL for a given URL.
     * @param url - The URL to get the placeholder for.
     * @returns The placeholder URL if found, otherwise an empty string.
     */
    const getPlaceholderUrl = (url: string): string => {
        const selectedType: string = determineUrlType(url);

        if (selectedType !== "CUSTOM") {
            const selectedOption: PredefinedUrlOption | undefined = PREDEFINED_URLS.find(
                (option: PredefinedUrlOption) => option.value === url
            );

            return selectedOption ? selectedOption.placeholder : "";
        }

        return url;
    };

    /**
     * Determines the URL type based on the URL content.
     */
    const determineUrlType = (url: string): string => {
        const predefinedUrl: PredefinedUrlOption = PREDEFINED_URLS.find(
            (option: PredefinedUrlOption) => option.value === url
        );

        return predefinedUrl ? predefinedUrl.value : "CUSTOM";
    };

    /**
     * Handles URL type selection change.
     */
    const handleUrlTypeChange = (event: { target: { value: unknown } }): void => {
        const newType: string = event.target.value as string;

        setSelectedUrlType(newType);

        if (newType !== "CUSTOM") {
            const selectedOption: PredefinedUrlOption = PREDEFINED_URLS.find(
                (option: PredefinedUrlOption) => option.value === newType
            );

            if (selectedOption) {
                setLinkUrl(selectedOption.placeholder);
                editor.dispatchCommand(TOGGLE_SAFE_LINK_COMMAND, selectedOption.value);
            }
        } else {
            setLinkUrl("https://");
            editor.dispatchCommand(TOGGLE_SAFE_LINK_COMMAND, "https://");
        }
    };

    /**
     * Gets the current URL for editing mode.
     */
    const getCurrentUrl = (): string => {
        if (selectedUrlType !== "CUSTOM") {
            const selectedOption: PredefinedUrlOption = PREDEFINED_URLS.find(
                (option: PredefinedUrlOption) => option.value === selectedUrlType
            );

            return selectedOption ? selectedOption.value : linkUrl;
        }

        return linkUrl;
    };

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
            ),
            editor.registerCommand(
                TOGGLE_SAFE_LINK_COMMAND,
                (url: string) => {
                    if (url) {
                        // First use the default command to handle the link creation/update.
                        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);

                        // Then update the link attributes to include safe properties.
                        const selection: BaseSelection = $getSelection();

                        if ($isRangeSelection(selection)) {
                            const node: TextNode | ElementNode = getSelectedNode(selection);
                            const linkNode: ElementNode = $isLinkNode(node) ? node : node.getParent();

                            if ($isLinkNode(linkNode)) {
                                // Update the link node with safe attributes.
                                linkNode.setTarget("_blank");
                                linkNode.setRel("noopener noreferrer");
                            }
                        }
                    } else {
                        // If no URL, remove the link (same as TOGGLE_LINK_COMMAND with null).
                        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                    }

                    return true;
                },
                HighPriority
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
                        <Select
                            value={ selectedUrlType }
                            label={ t("flows:core.elements.richText.linkEditor.urlTypeLabel") }
                            onChange={ handleUrlTypeChange }
                            size="small"
                            InputLabelProps={
                                { style: { marginLeft: 0, marginTop: 0 } }
                            }
                        >
                            { PREDEFINED_URLS.map((option: PredefinedUrlOption) => (
                                <MenuItem key={ option.value } value={ option.value }>
                                    { t(option.label) }
                                </MenuItem>
                            )) }
                        </Select>
                        <TextField
                            inputRef={ inputRef }
                            fullWidth
                            value={ selectedUrlType === "CUSTOM" ? linkUrl : "" }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                                if (selectedUrlType === "CUSTOM") {
                                    setLinkUrl(event.target.value);
                                }
                            } }
                            placeholder={
                                selectedUrlType === "CUSTOM"
                                    ? (t("flows:core.elements.richText.linkEditor.placeholder"))
                                    : PREDEFINED_URLS.find(
                                        (option: PredefinedUrlOption) => option.value === selectedUrlType
                                    )?.placeholder || ""
                            }
                            disabled={ selectedUrlType !== "CUSTOM" }
                            onKeyDown={ (event: KeyboardEvent<HTMLInputElement>) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    if (lastSelection !== null) {
                                        const currentUrl: string = getCurrentUrl();

                                        if (currentUrl !== "") {
                                            editor.dispatchCommand(TOGGLE_SAFE_LINK_COMMAND, currentUrl);
                                        }
                                        setEditMode(false);
                                    }
                                } else if (event.key === "Escape") {
                                    event.preventDefault();
                                    setEditMode(false);
                                }
                            } }
                        />
                        <Button
                            size="small"
                            variant="outlined"
                            className="link-input-save-button"
                            onClick={ (event: ReactMouseEvent<HTMLButtonElement>) => {
                                event.preventDefault();
                                if (lastSelection !== null) {
                                    const currentUrl: string = getCurrentUrl();

                                    if (currentUrl !== "") {
                                        editor.dispatchCommand(TOGGLE_SAFE_LINK_COMMAND, currentUrl);
                                    }
                                }
                                setEditMode(false);
                            } }
                        >
                            { t("common:save") }
                        </Button>
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
