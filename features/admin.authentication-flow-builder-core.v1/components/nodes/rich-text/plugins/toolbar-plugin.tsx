/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import IconButton from "@oxygen-ui/react/IconButton";
import ListItemText from "@oxygen-ui/react/ListItemText";
import ListItemIcon from "@oxygen-ui/react/ListItemIcon";
import Paper from "@oxygen-ui/react/Paper";
import Divider from "@oxygen-ui/react/Divider";
import Menu from "@oxygen-ui/react/Menu";
import MenuItem from "@oxygen-ui/react/MenuItem";
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND
} from "lexical";
import Stack from "@oxygen-ui/react/Stack";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SVGProps,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import classNames from "classnames";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import "./toolbar-plugin.scss";

const LowPriority = 1;

// TODO: Move this to Oxygen UI.
const ArrowCounterClockwiseIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
    </svg>
);

// TODO: Move this to Oxygen UI.
const ArrowClockwiseIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
    </svg>
);

const BoldIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
    </svg>
);

const ItalicIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
    </svg>
);

const UnderlineIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
    </svg>
);

const StrikethroughIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
    </svg>
);

const LeftAlignIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path
            fill-rule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
        />
    </svg>
);

const RightAlignIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path
            fill-rule="evenodd"
            d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
        />
    </svg>
);

const CenterAlignIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path
            fill-rule="evenodd"
            d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
        />
    </svg>
);

const JustifyAlignIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path
            fill-rule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
        />
    </svg>
);
export interface ToolbarPluginProps extends IdentifiableComponentInterface, HTMLAttributes<HTMLDivElement> {
    history?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikeThrough?: boolean;
    alignment?: boolean;
    typography?: boolean;
}

const ToolbarPlugin: FunctionComponent<ToolbarPluginProps> = ({
    "data-componentid": componentId = "toolbar-plugin",
    history = true,
    bold = true,
    italic = true,
    underline = true,
    strikeThrough = true,
    alignment = true,
    typography = true
}: ToolbarPluginProps): ReactElement => {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [ typographyMenu, setTypographyMenu ] = useState<null | HTMLElement>(null);

    const openTypographyMenu: boolean = Boolean(typographyMenu);

    const handleTypographyMenuOpen = (event: { currentTarget: React.SetStateAction<HTMLElement> }) => {
        setTypographyMenu(event.currentTarget);
    };

    const handleTypographyMenuClose = (): void => {
        setTypographyMenu(null);
    };

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                payload => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                payload => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority
            )
        );
    }, [editor, $updateToolbar]);

    return (
        <Paper className={classNames("rich-text-toolbar")} ref={toolbarRef} variant="outlined" elevation={0}>
            <Stack direction="row">
                {history && (
                    <>
                        <IconButton
                            disableTouchRipple
                            disabled={!canUndo}
                            onClick={() => {
                                editor.dispatchCommand(UNDO_COMMAND, undefined);
                            }}
                            aria-label="Undo"
                        >
                            <ArrowCounterClockwiseIcon height={16} width={16} />
                        </IconButton>
                        <IconButton
                            disableTouchRipple
                            disabled={!canRedo}
                            onClick={() => {
                                editor.dispatchCommand(REDO_COMMAND, undefined);
                            }}
                            aria-label="Redo"
                        >
                            <ArrowClockwiseIcon height={16} width={16} />
                        </IconButton>
                        <Divider orientation="vertical" flexItem />
                    </>
                )}
                { typography && (
                    <>
                                    <Menu
                                    open={ openTypographyMenu }
                                    anchorEl={ typographyMenu }
                                    className="oxygen-user-dropdown-menu header-help-menu"
                                    id="header-help-menu"
                                    anchorOrigin={ { horizontal: "right", vertical: "bottom" } }
                                    transformOrigin={ { horizontal: "right", vertical: "top" } }
                                    onClose={ handleTypographyMenuClose }
                                >
                                        <MenuItem
                                            className="get-help-dropdown-item"
                                        >
                                            <>
                                                <ListItemIcon className="get-help-icon">
                                                </ListItemIcon>
                                                <ListItemText primary="Text" />
                                            </>
                                        </MenuItem>
                                </Menu>
                                <Divider orientation="vertical" flexItem />
                                </>
                )}
                {bold && (
                    <IconButton
                        disableTouchRipple
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                        }}
                        className={classNames({ active: isBold })}
                        aria-label="Format Bold"
                    >
                        <BoldIcon height={16} width={16} />
                    </IconButton>
                )}
                {italic && (
                    <IconButton
                        disableTouchRipple
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                        }}
                        className={classNames({ active: isItalic })}
                        aria-label="Format Italics"
                    >
                        <ItalicIcon height={16} width={16} />
                    </IconButton>
                )}
                {underline && (
                    <IconButton
                        disableTouchRipple
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                        }}
                        className={classNames({ active: isUnderline })}
                        aria-label="Format Underline"
                    >
                        <UnderlineIcon height={16} width={16} />
                    </IconButton>
                )}
                {strikeThrough && (
                    <IconButton
                        disableTouchRipple
                        onClick={() => {
                            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                        }}
                        className={classNames({ active: isStrikethrough })}
                        aria-label="Format Strikethrough"
                    >
                        <StrikethroughIcon height={16} width={16} />
                    </IconButton>
                )}
                {alignment && (
                    <>
                        <Divider orientation="vertical" flexItem />
                        <IconButton
                            disableTouchRipple
                            onClick={() => {
                                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                            }}
                            aria-label="Left Align"
                        >
                            <LeftAlignIcon height={16} width={16} />
                        </IconButton>
                        <IconButton
                            disableTouchRipple
                            onClick={() => {
                                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                            }}
                            aria-label="Center Align"
                        >
                            <CenterAlignIcon height={16} width={16} />
                        </IconButton>
                        <IconButton
                            disableTouchRipple
                            onClick={() => {
                                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                            }}
                            aria-label="Right Align"
                        >
                            <RightAlignIcon height={16} width={16} />
                        </IconButton>
                        <IconButton
                            disableTouchRipple
                            onClick={() => {
                                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                            }}
                            aria-label="Justify Align"
                        >
                            <JustifyAlignIcon height={16} width={16} />
                        </IconButton>
                    </>
                )}
            </Stack>
        </Paper>
    );
};

export default ToolbarPlugin;
