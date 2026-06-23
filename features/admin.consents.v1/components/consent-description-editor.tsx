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

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $isLinkNode, AutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { mergeRegister } from "@lexical/utils";
import { Theme, alpha, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { LanguageIcon, LinkIcon as OxygenLinkIcon } from "@oxygen-ui/react-icons";
import PlaceholderComponent from "@wso2is/common.branding.v1/components/placeholder-component";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { URLUtils } from "@wso2is/core/utils";
import { Hint } from "@wso2is/react-components";
import {
    $getRoot,
    $getSelection,
    $insertNodes,
    $isRangeSelection,
    BaseSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    CommandListenerPriority,
    EditorState,
    EditorThemeClasses,
    FORMAT_TEXT_COMMAND,
    LexicalNode,
    ParagraphNode,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    TextNode,
    UNDO_COMMAND
} from "lexical";
import React, {
    ChangeEvent,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    RefObject,
    SVGProps,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import ConsentI18nConfigurationCard, { LanguageTextFieldPropsInterface } from "./consent-i18n-configuration-card";
import { ConsentFloatingLinkEditor } from "./consent-floating-link-editor";

const TEXT_ALIGN_TYPES: string[] = [ "left", "right", "center", "justify" ];
const EMPTY_CONTENT: string = "<p class=\"rich-text-paragraph\"><br></p>";

const preProcessHTML = (rawHtml: string): string => {
    let result: string = rawHtml.replaceAll("\" dir=\"ltr\"", "\"");

    result = result.replaceAll("dir=\"ltr\"", "");
    result = result.replaceAll("\" style=\"white-space: pre-wrap;\"", " rich-text-pre-wrap\"");
    result = result.replaceAll("style=\"white-space: pre-wrap;\"", "class=\"rich-text-pre-wrap\"");

    for (const align of TEXT_ALIGN_TYPES) {
        result = result.replaceAll(`" style="text-align: ${align};"`, ` rich-text-align-${align}"`);
        result = result.replaceAll(`style="text-align: ${align};"`, `class="rich-text-align-${align}"`);
    }

    return result;
};

const postProcessHTML = (rawHtml: string): string => {
    let result: string = rawHtml;

    for (const align of TEXT_ALIGN_TYPES) {
        result = result.replaceAll(` rich-text-align-${align}"`, `" style="text-align: ${align};"`);
        result = result.replaceAll(`class="rich-text-align-${align}"`, `style="text-align: ${align};"`);
    }

    result = result.replaceAll(" rich-text-pre-wrap\"", "\" style=\"white-space: pre-wrap;\"");
    result = result.replaceAll("class=\"rich-text-pre-wrap\"", "style=\"white-space: pre-wrap;\"");

    return result;
};

const ThemeClasses: EditorThemeClasses = {
    link: "rich-text-link",
    paragraph: "rich-text-paragraph",
    text: {
        bold: "rich-text-bold",
        italic: "rich-text-italic",
        underline: "rich-text-underline"
    }
};

const editorConfig: InitialConfigType = {
    namespace: "ConsentDescription",
    nodes: [ ParagraphNode, TextNode, HeadingNode, LinkNode, AutoLinkNode ],
    onError(error: Error) {
        throw error;
    },
    theme: ThemeClasses
};

const ToolbarMainRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(0.25),
    padding: theme.spacing(0.25, 0.5)
}));

const ToolbarIconButton: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "&.active": {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        color: theme.palette.primary.main
    },
    "&:disabled": {
        cursor: "default",
        opacity: 0.38
    },
    "&:hover:not(:disabled)": {
        backgroundColor: theme.palette.action.selected
    },
    alignItems: "center",
    background: "transparent",
    border: "none",
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.secondary,
    cursor: "pointer",
    display: "inline-flex",
    height: "28px",
    justifyContent: "center",
    padding: 0,
    transition: "background-color 0.15s ease",
    width: "28px"
}));

const ToolbarDivider: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.divider,
    flexShrink: 0,
    height: "20px",
    margin: theme.spacing(0, 0.5),
    width: "1px"
}));

const EditorWrapperBox: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "&.error": {
        borderColor: theme.palette.error.main
    },
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    position: "relative"
}));

const EditorPlaceholder: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: "14px",
    left: theme.spacing(1.5),
    pointerEvents: "none",
    position: "absolute",
    top: theme.spacing(1.25),
    userSelect: "none"
}));

const EditorContainer: typeof Box = styled(Box)({
    width: "100%"
});

const I18nKeyOverlay: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: "inherit",
    bottom: 0,
    cursor: "default",
    fontSize: "14px",
    left: 0,
    padding: theme.spacing(1.25, 5, 1.25, 1.5),
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1
}));

const I18nIconButton: typeof IconButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: "1px solid",
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    height: 24,
    padding: theme.spacing(0.5),
    position: "absolute",
    right: 6,
    top: 6,
    width: 24,
    zIndex: 2
}));

const ToolbarPolicyLinkButton: typeof Box = styled(ToolbarIconButton)({
    fontSize: "10px",
    fontWeight: 600,
    gap: "4px",
    padding: "0 8px",
    width: "auto"
});

const EditorContentEditable: React.ComponentType<React.ComponentProps<typeof ContentEditable>> =
    styled(ContentEditable)(({ theme }: { theme: Theme }) => ({
        caretColor: "currentColor",
        fontSize: "14px",
        maxHeight: "260px",
        minHeight: "120px",
        outline: "none",
        overflowY: "auto",
        padding: theme.spacing(1.25, 5, 1.25, 1.5),
        tabSize: 1
    }));

const TranslationContentEditable: React.ComponentType<React.ComponentProps<typeof ContentEditable>> =
    styled(ContentEditable)(({ theme }: { theme: Theme }) => ({
        caretColor: "currentColor",
        fontSize: "14px",
        maxHeight: "160px",
        minHeight: "80px",
        outline: "none",
        overflowY: "auto",
        padding: theme.spacing(1.25, 1.5),
        tabSize: 1
    }));

const UndoIcon = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" { ...props }>
        <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
    </svg>
);

const RedoIcon = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" { ...props }>
        <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
    </svg>
);

const BoldIcon = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" { ...props }>
        { /* eslint-disable-next-line max-len */ }
        <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
    </svg>
);

const ItalicIcon = (props: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" { ...props }>
        { /* eslint-disable-next-line max-len */ }
        <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
    </svg>
);



interface HtmlSyncPluginPropsInterface {
    initialHtml: string;
    onChange: (html: string) => void;
    disabled?: boolean;
}

const HtmlSyncPlugin: FunctionComponent<HtmlSyncPluginPropsInterface> = (
    { initialHtml, onChange, disabled }: HtmlSyncPluginPropsInterface
): ReactElement => {
    const [ editor ] = useLexicalComposerContext();
    const isSkipNextUpdate: MutableRefObject<boolean> = useRef<boolean>(false);
    const isInitialized: MutableRefObject<boolean> = useRef<boolean>(false);

    useEffect(() => {
        if (!editor || !initialHtml || isInitialized.current) return;
        isInitialized.current = true;

        const parser: DOMParser = new DOMParser();
        const dom: Document = parser.parseFromString(postProcessHTML(initialHtml), "text/html");

        editor.update(() => {
            isSkipNextUpdate.current = true;
            const root: ReturnType<typeof $getRoot> = $getRoot();

            root.clear();
            const nodes: ReturnType<typeof $generateNodesFromDOM> = $generateNodesFromDOM(editor, dom);

            $insertNodes(nodes);
        });
    }, [ editor, initialHtml ]);

    useEffect(() => {
        if (!editor) return;

        return editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
            if (isSkipNextUpdate.current) {
                isSkipNextUpdate.current = false;

                return;
            }

            if (!editor.isEditable()) return;

            editorState.read(() => {
                const html: string = $generateHtmlFromNodes(editor);
                const processed: string = preProcessHTML(html);

                onChange(processed === EMPTY_CONTENT ? "" : processed);
            });
        });
    }, [ editor, onChange ]);

    useEffect(() => {
        editor.setEditable(!disabled);
    }, [ editor, disabled ]);

    return null;
};

interface ConsentEditorToolbarPropsInterface {
    policyUrl?: string;
    disabled?: boolean;
    componentId: string;
}

const LowPriority: CommandListenerPriority = 1;

const ConsentEditorToolbar: FunctionComponent<ConsentEditorToolbarPropsInterface> = ({
    policyUrl,
    disabled = false,
    componentId
}: ConsentEditorToolbarPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const [ editor ] = useLexicalComposerContext();

    const [ canUndo, setCanUndo ] = useState<boolean>(false);
    const [ canRedo, setCanRedo ] = useState<boolean>(false);
    const [ isBold, setIsBold ] = useState<boolean>(false);
    const [ isItalic, setIsItalic ] = useState<boolean>(false);
    const [ hasSelection, setHasSelection ] = useState<boolean>(false);
    const [ isLink, setIsLink ] = useState<boolean>(false);

    const updateToolbar: () => void = useCallback(() => {
        const selection: BaseSelection = $getSelection();

        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setHasSelection(!selection.isCollapsed());

            const node: LexicalNode = selection.anchor.getNode();
            const parent: LexicalNode | null = node.getParent();

            setIsLink($isLinkNode(parent) || $isLinkNode(node));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
                editorState.read(() => updateToolbar());
            }),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
                updateToolbar();

                return false;
            }, LowPriority),
            editor.registerCommand(CAN_UNDO_COMMAND, (payload: boolean) => {
                setCanUndo(payload);

                return false;
            }, LowPriority),
            editor.registerCommand(CAN_REDO_COMMAND, (payload: boolean) => {
                setCanRedo(payload);

                return false;
            }, LowPriority)
        );
    }, [ editor, updateToolbar ]);

    const isValidPolicyUrl: boolean = !!policyUrl && URLUtils.isHttpsOrHttpUrl(policyUrl);

    const handleInsertPolicyLink: () => void = (): void => {
        if (isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        } else if (isValidPolicyUrl) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, policyUrl);
        }
    };

    const handleLinkButtonClick: () => void = (): void => {
        if (isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        } else if (hasSelection) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
        }
    };

    /**
     * Resolves the appropriate tooltip message for the Policy Link button
     * based on whether a URL exists, whether it is valid, and whether text is selected.
     */
    const policyLinkTooltip: () => string = (): string => {
        if (isLink) {
            return t("consents:policyConsents.wizard.create.form.description.removePolicyLink");
        }
        if (!policyUrl) {
            return t("consents:policyConsents.wizard.create.form.description.insertPolicyLinkNoPolicyUrl");
        }
        if (!isValidPolicyUrl) {
            return t("consents:policyConsents.wizard.create.form.description.insertPolicyLinkInvalidUrl");
        }
        if (!hasSelection) {
            return t("consents:policyConsents.wizard.create.form.description.insertPolicyLinkNoSelection");
        }

        return t("consents:policyConsents.wizard.create.form.description.insertPolicyLinkTooltip");
    };

    return (
        <Paper variant="outlined" data-componentid={ `${componentId}-toolbar` } className="mb-2">
            <ToolbarMainRow>
                <ToolbarIconButton
                    component="button"
                    type="button"
                    title={ t("common:undo") }
                    disabled={ !canUndo || disabled }
                    onClick={ () => editor.dispatchCommand(UNDO_COMMAND, undefined) }
                    aria-label={ t("common:undo") }
                >
                    <UndoIcon />
                </ToolbarIconButton>
                <ToolbarIconButton
                    component="button"
                    type="button"
                    title={ t("common:redo") }
                    disabled={ !canRedo || disabled }
                    onClick={ () => editor.dispatchCommand(REDO_COMMAND, undefined) }
                    aria-label={ t("common:redo") }
                >
                    <RedoIcon />
                </ToolbarIconButton>
                <ToolbarDivider component="span" />
                <ToolbarIconButton
                    component="button"
                    type="button"
                    className={ isBold ? "active" : undefined }
                    title={ t("common:bold") }
                    disabled={ disabled }
                    onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold") }
                    aria-label={ t("common:bold") }
                >
                    <BoldIcon />
                </ToolbarIconButton>
                <ToolbarIconButton
                    component="button"
                    type="button"
                    className={ isItalic ? "active" : undefined }
                    title={ t("common:italic") }
                    disabled={ disabled }
                    onClick={ () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic") }
                    aria-label={ t("common:italic") }
                >
                    <ItalicIcon />
                </ToolbarIconButton>
                <ToolbarDivider component="span" />
                { policyUrl === undefined ? (
                    <ToolbarPolicyLinkButton
                        component="button"
                        type="button"
                        className={ isLink ? "active" : undefined }
                        disabled={ disabled || (!hasSelection && !isLink) }
                        onClick={ handleLinkButtonClick }
                        aria-label={ t(
                            "consents:policyConsents.wizard.create.form.description.insertCustomLinkShort"
                        ) }
                    >
                        <OxygenLinkIcon />
                        { t("consents:policyConsents.wizard.create.form.description.insertCustomLinkShort") }
                    </ToolbarPolicyLinkButton>
                ) : (
                    <Tooltip
                        title={ policyLinkTooltip() }
                        placement="top"
                        arrow
                    >
                        <span>
                            <ToolbarPolicyLinkButton
                                component="button"
                                type="button"
                                className={ isLink ? "active" : undefined }
                                disabled={ disabled || (!isLink && (!hasSelection || !isValidPolicyUrl)) }
                                onClick={ handleInsertPolicyLink }
                                aria-label={ t(
                                    "consents:policyConsents.wizard.create.form.description.insertPolicyLink"
                                ) }
                            >
                                <OxygenLinkIcon />
                                { t("consents:policyConsents.wizard.create.form.description.insertPolicyLinkShort") }
                            </ToolbarPolicyLinkButton>
                        </span>
                    </Tooltip>
                ) }
            </ToolbarMainRow>
        </Paper>
    );
};

const TranslationDescriptionEditor: FunctionComponent<LanguageTextFieldPropsInterface> = ({
    value,
    onChange,
    disabled = false,
    policyUrl,
    "aria-labelledby": ariaLabelledBy
}: LanguageTextFieldPropsInterface): ReactElement => {
    const handleChange: (_value: string) => void = useCallback((html: string): void => {
        onChange({ target: { value: html } } as ChangeEvent<HTMLInputElement>);
    }, [ onChange ]);

    return (
        <LexicalComposer initialConfig={ { ...editorConfig, namespace: "ConsentTranslation" } }>
            <ConsentEditorToolbar
                policyUrl={ policyUrl }
                disabled={ disabled }
                componentId="consent-translation-editor" />
            <EditorWrapperBox>
                <RichTextPlugin
                    contentEditable={ (
                        <TranslationContentEditable
                            ariaLabelledBy={ ariaLabelledBy }
                        />
                    ) }
                    ErrorBoundary={ LexicalErrorBoundary }
                />
                <HistoryPlugin />
                <LinkPlugin />
                <ConsentFloatingLinkEditor />
                <HtmlSyncPlugin
                    initialHtml={ value }
                    onChange={ handleChange }
                    disabled={ disabled }
                />
            </EditorWrapperBox>
        </LexicalComposer>
    );
};

/**
 * Props interface for the ConsentDescriptionEditor component.
 */
interface ConsentDescriptionEditorProps extends IdentifiableComponentInterface {
    /**
     * Initial HTML string. The editor is uncontrolled after mount; use a `key` prop to reset it.
     */
    value: string;
    /**
     * Called with the updated HTML string after every editor change.
     */
    onChange: (html: string) => void;
    /**
     * When provided, enables the "Insert Policy Link" toolbar button.
     */
    policyUrl?: string;
    /**
     * Optional policy name used in the placeholder example text.
     */
    policyName?: string;
    /**
     * Disables editing when true.
     */
    disabled?: boolean;
    /**
     * Renders error border when true.
     */
    hasError?: boolean;
    /**
     * The i18n key currently linked to this description (e.g. "consent.description").
     * When set, the description field value is `{{keyName}}` and the editor shows a key chip.
     */
    i18nKey?: string;
    /**
     * Called when the admin links or clears an i18n key via the translation configuration card.
     */
    onI18nKeyChange?: (key: string | null) => void;
    /**
     * Controls which i18n hint text to show below the editor. Defaults to "policy".
     */
    variant?: "policy" | "preference";
}

/**
 * Rich text editor for consent policy descriptions.
 * Uses Lexical under the hood with the same HTML class conventions as the flow-builder rich text component.
 */
export const ConsentDescriptionEditor: FunctionComponent<ConsentDescriptionEditorProps> = ({
    "data-componentid": componentId = "consent-description-editor",
    value,
    onChange,
    policyUrl,
    policyName,
    disabled = false,
    hasError = false,
    i18nKey,
    onI18nKeyChange,
    variant = "policy"
}: ConsentDescriptionEditorProps): ReactElement => {
    const { t } = useTranslation();
    const [ isI18nCardOpen, setIsI18nCardOpen ] = useState<boolean>(false);
    const i18nButtonRef: RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);

    const exampleLinkText: string =
        policyName || policyUrl || t("consents:policyConsents.form.name.placeholder");
    const isValidPolicyUrl: boolean = !!policyUrl && URLUtils.isHttpsOrHttpUrl(policyUrl);

    const preferencePlaceholderI18nKey: string = "consents:preferenceManagement.preview.exampleDescription";
    const policyPlaceholderI18nKey: string = "consents:policyConsents.wizard.create.preview.exampleDescription";

    const placeholderAriaText: string = variant === "preference"
        ? t(preferencePlaceholderI18nKey, { consentName: policyName }).replace(/<[^>]*>/g, "")
        : t(policyPlaceholderI18nKey, { policyName: exampleLinkText }).replace(/<[^>]*>/g, "");

    const placeholderContent: ReactElement = variant === "preference" ? (
        <EditorPlaceholder>
            { t(preferencePlaceholderI18nKey, { consentName: policyName }).replace(/<[^>]*>/g, "") }
        </EditorPlaceholder>
    ) : (
        <EditorPlaceholder>
            <Trans
                i18nKey={ policyPlaceholderI18nKey }
                values={ { policyName: exampleLinkText } }
                components={ [
                    <a
                        href={ isValidPolicyUrl ? policyUrl : undefined }
                        className="rich-text-link"
                        target={ isValidPolicyUrl ? "_blank" : undefined }
                        rel={ isValidPolicyUrl ? "noopener noreferrer" : undefined }
                    />
                ] }
            />
        </EditorPlaceholder>
    );

    return (
        <EditorContainer data-componentid={ componentId } className="mt-2 mb-1">
            <LexicalComposer initialConfig={ editorConfig }>
                <ConsentEditorToolbar
                    policyUrl={ policyUrl }
                    disabled={ disabled || !!i18nKey }
                    componentId={ componentId }
                />
                <EditorWrapperBox
                    className={ hasError ? "error" : undefined }
                >
                    <RichTextPlugin
                        contentEditable={ (
                            <EditorContentEditable
                                aria-placeholder={ placeholderAriaText }
                                placeholder={ i18nKey ? <></> : placeholderContent }
                            />
                        ) }
                        ErrorBoundary={ LexicalErrorBoundary }
                    />
                    <HistoryPlugin />
                    <LinkPlugin />
                    { variant === "preference" && <ConsentFloatingLinkEditor /> }
                    <HtmlSyncPlugin
                        initialHtml={ value }
                        onChange={ onChange }
                        disabled={ disabled || !!i18nKey }
                    />
                    { i18nKey && (
                        <I18nKeyOverlay>
                            <PlaceholderComponent value={ `{{${i18nKey}}}` } />
                        </I18nKeyOverlay>
                    ) }
                    { variant !== "preference" && (
                        <Tooltip
                            title={ t("consents:policyConsents.wizard.create.form.description.configureTranslation") }
                            placement="top"
                            arrow
                        >
                            <I18nIconButton
                                ref={ i18nButtonRef }
                                size="small"
                                disabled={ disabled }
                                onClick={ () => setIsI18nCardOpen(!isI18nCardOpen) }
                                aria-label={
                                    t("consents:policyConsents.wizard.create.form.description.configureTranslation")
                                }
                                aria-pressed={ isI18nCardOpen }
                            >
                                <LanguageIcon size={ 13 } />
                            </I18nIconButton>
                        </Tooltip>
                    ) }
                </EditorWrapperBox>
            </LexicalComposer>
            { variant !== "preference" && isI18nCardOpen && (
                <ConsentI18nConfigurationCard
                    open={ isI18nCardOpen }
                    anchorEl={ i18nButtonRef.current }
                    i18nKey={ i18nKey ?? "" }
                    onClose={ () => setIsI18nCardOpen(false) }
                    onChange={ (key: string | null) => {
                        onI18nKeyChange?.(key);
                        setIsI18nCardOpen(false);
                    } }
                    LanguageTextField={ TranslationDescriptionEditor }
                    policyUrl={ policyUrl }
                    data-componentid={ `${componentId}-i18n-card` }
                />
            ) }
            <Hint>
                { t(variant === "preference"
                    ? "consents:preferenceManagement.form.description.labelRoleHint"
                    : "consents:policyConsents.wizard.create.form.description.labelRoleHint")
                }
            </Hint>
        </EditorContainer>
    );
};
