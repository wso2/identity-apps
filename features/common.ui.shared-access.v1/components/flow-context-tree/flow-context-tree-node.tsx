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

import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Collapse from "@oxygen-ui/react/Collapse";
import IconButton from "@oxygen-ui/react/IconButton";
import Switch from "@oxygen-ui/react/Switch";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import React, { FunctionComponent, ReactElement, useState } from "react";
import "./flow-context-tree.scss";
import { NodeType, TreeNodeState } from "./models";

const INDENT: number = 18;

/**
 * Domain color CSS custom property names — set on .flow-context-tree root.
 */
const V = {
    expose: "var(--tree-expose)",
    exposeFaint: "var(--tree-expose-faint)",
    green: "var(--tree-green)",
    modify: "var(--tree-modify)",
    modifyFaint: "var(--tree-modify-faint)"
} as const;

interface FlowContextTreeNodeProps {
    node: TreeNodeState;
    depth?: number;
    hasCertificate?: boolean;
    onToggleExpose: (key: string) => void;
    onToggleModify: (key: string) => void;
    onToggleExposeEncrypt: (key: string) => void;
    onToggleModifyEncrypt: (key: string) => void;
    onDelete: (key: string) => void;
    onRename: (key: string, newTitle: string) => void;
    onAddChild: (node: TreeNodeState) => void;
    readOnly?: boolean;
    "data-componentid"?: string;
}

/**
 * Data type tag displayed next to the node title.
 */
const TypeTag = ({ type }: { type: string }): ReactElement => (
    <Chip
        label={type}
        size="small"
        sx={{
            "& .MuiChip-label": { px: "5px" },
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: "20px",
            color: "text.disabled",
            flexShrink: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "7px",
            fontWeight: 500,
            height: 13
        }}
    />
);

/**
 * Inline mini encryption switch — sits next to its corresponding EXPOSE / MODIFY chip.
 */
const EncryptMiniSwitch = ({
    checked,
    kind,
    onChange,
    readOnly
}: {
    checked: boolean;
    kind: "expose" | "modify";
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}): ReactElement => (
    <Box
        className={ `encrypt-mini-switch ${kind}-encrypt` }
        onClick={ (e: React.MouseEvent) => e.stopPropagation() }
    >
        <Switch
            size="small"
            checked={ checked }
            onChange={ readOnly ? undefined : onChange }
            disabled={ readOnly }
        />
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
            stroke={ checked
                ? (kind === "expose" ? V.expose : V.modify)
                : "var(--tree-gray-20, #D0D0D0)" }
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    </Box>
);

/**
 * Determine lock icon className based on encryption state.
 * Returns null if no encryption is active.
 */
const getLockClass = (node: TreeNodeState): string | null => {
    const hasExposeEnc: boolean = node.exposeEncrypted && node.exposed;
    const hasModifyEnc: boolean = node.modifyEncrypted && node.modify;

    if (hasExposeEnc && hasModifyEnc) return "lock-both";
    if (hasExposeEnc) return "lock-expose-only";
    if (hasModifyEnc) return "lock-modify-only";

    return null;
};

/**
 * Operation chip buttons for EXPOSE and MODIFY, with inline encryption toggles.
 */
const OpChips = ({
    node,
    rowHovered,
    hasCertificate,
    onToggleExpose,
    onToggleModify,
    onToggleExposeEncrypt,
    onToggleModifyEncrypt,
    readOnly
}: {
    node: TreeNodeState;
    rowHovered: boolean;
    hasCertificate: boolean;
    onToggleExpose: () => void;
    onToggleModify: () => void;
    onToggleExposeEncrypt: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleModifyEncrypt: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}): ReactElement | null => {

    const isLeaf: boolean = node.nodeType === NodeType.LEAF;
    const canExpose: boolean = node.allowedOperations.includes("EXPOSE");
    const canModify: boolean = node.allowedOperations.includes("MODIFY") && isLeaf && !node.readOnly;

    if (!canExpose && !canModify) return null;

    // When not hovered, show only active chips + lock icon
    if (!rowHovered) {
        const chips: ReactElement[] = [];

        if (node.exposed) {
            chips.push(
                <Chip
                    key="expose"
                    label="EXPOSE"
                    size="small"
                    className="expose-chip expose-chip-active"
                    onClick={ readOnly ? undefined : (e: React.MouseEvent) => {
                        e.stopPropagation(); onToggleExpose();
                    } }
                    sx={ {
                        "& .MuiChip-label": { px: "6px" },
                        cursor: readOnly ? "default" : "pointer"
                    } }
                />
            );
        }
        if (node.modify && canModify) {
            chips.push(
                <Chip
                    key="modify"
                    label="MODIFY"
                    size="small"
                    className="modify-chip modify-chip-active"
                    onClick={ readOnly ? undefined : (e: React.MouseEvent) => {
                        e.stopPropagation(); onToggleModify();
                    } }
                    sx={ {
                        "& .MuiChip-label": { px: "6px" },
                        cursor: readOnly ? "default" : "pointer"
                    } }
                />
            );
        }

        // Collapsed lock icon showing encryption state
        const lockClass: string | null = getLockClass(node);

        if (lockClass) {
            chips.push(
                <Tooltip key="lock" title="Encrypted" placement="top">
                    <Box className={ `lock-icon ${lockClass}` }>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </Box>
                </Tooltip>
            );
        }

        if (chips.length === 0) return null;

        return (
            <Box sx={ { alignItems: "center", display: "inline-flex", flexShrink: 0, gap: "3px" } }>
                { chips }
            </Box>
        );
    }

    // When hovered, show all available ops with inline encryption toggles
    return (
        <Box sx={ { alignItems: "center", display: "inline-flex", flexShrink: 0, gap: "4px" } }>
            { canExpose && (
                <>
                    <Chip
                        label="EXPOSE"
                        size="small"
                        className={ `expose-chip${node.exposed ? " expose-chip-active" : ""}` }
                        onClick={ readOnly ? undefined : (e: React.MouseEvent) => {
                            e.stopPropagation(); onToggleExpose();
                        } }
                        sx={ {
                            "& .MuiChip-label": { px: "6px" },
                            cursor: readOnly ? "default" : "pointer"
                        } }
                    />
                    { /* Expose encryption toggle — only when exposed AND certificate is available */ }
                    { node.exposed && hasCertificate && (
                        <EncryptMiniSwitch
                            checked={ node.exposeEncrypted }
                            kind="expose"
                            onChange={ onToggleExposeEncrypt }
                            readOnly={ readOnly }
                        />
                    ) }
                </>
            ) }
            { canModify && (
                <>
                    <Chip
                        label="MODIFY"
                        size="small"
                        className={ `modify-chip${node.modify ? " modify-chip-active" : ""}` }
                        onClick={ readOnly ? undefined : (e: React.MouseEvent) => {
                            e.stopPropagation(); onToggleModify();
                        } }
                        sx={ {
                            "& .MuiChip-label": { px: "6px" },
                            cursor: readOnly ? "default" : "pointer"
                        } }
                    />
                    { /* Modify encryption toggle — only when modify is active */ }
                    { node.modify && (
                        <EncryptMiniSwitch
                            checked={ node.modifyEncrypted }
                            kind="modify"
                            onChange={ onToggleModifyEncrypt }
                            readOnly={ readOnly }
                        />
                    ) }
                </>
            ) }
        </Box>
    );
};

/**
 * Recursive tree node component for the Flow Context Tree.
 */
const FlowContextTreeNode: FunctionComponent<FlowContextTreeNodeProps> = ({
    node,
    depth = 0,
    hasCertificate = false,
    onToggleExpose,
    onToggleModify,
    onToggleExposeEncrypt,
    onToggleModifyEncrypt,
    onDelete,
    onRename,
    onAddChild,
    readOnly,
    "data-componentid": componentId = "flow-context-tree-node"
}: FlowContextTreeNodeProps): ReactElement => {

    const [open, setOpen] = useState<boolean>(true);
    const [editing, setEditing] = useState<boolean>(false);
    const [editValue, setEditValue] = useState<string>(node.title);
    const [hovered, setHovered] = useState<boolean>(false);

    const expandable: boolean = Array.isArray(node.children);
    const isNodeContainer: boolean =
        node.nodeType === NodeType.OBJECT ||
        node.nodeType === NodeType.MAP ||
        node.nodeType === NodeType.COMPLEX_MAP;

    const saveEdit = (val: string): void => {
        setEditing(false);
        onRename(node.key, val.trim() || "untitled");
    };

    return (
        <Box data-componentid={`${componentId}-${node.key}`}>
            { /* ── Row ── */}
            <Box
                className={ `tree-node-row${expandable ? " expandable" : ""}` }
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => expandable && setOpen((o: boolean) => !o)}
                sx={{
                    pl: `${depth * INDENT + 6}px`
                }}
            >
                { /* Tree connector lines */}
                {depth > 0 && (
                    <>
                        <Box
                            className="tree-connector-vertical"
                            sx={{
                                left: (depth - 1) * INDENT + 9
                            }}
                        />
                        <Box
                            className="tree-connector-horizontal"
                            sx={{
                                left: (depth - 1) * INDENT + 9
                            }}
                        />
                    </>
                )}

                { /* Expand / leaf icon */}
                <Box
                    sx={{
                        alignItems: "center",
                        display: "flex",
                        flexShrink: 0,
                        justifyContent: "center",
                        width: 12,
                        zIndex: 1
                    }}
                >
                    {expandable ? (
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--tree-gray-20, #D0D0D0)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                                transition: "transform 0.18s ease"
                            }}
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    ) : (
                        <svg
                            width="5"
                            height="5"
                            viewBox="0 0 8 8"
                        >
                            <circle cx="4" cy="4" r="3" fill="var(--tree-gray-20, #D0D0D0)" />
                        </svg>
                    )}
                </Box>

                { /* Title or edit field */}
                {editing ? (
                    <TextField
                        autoFocus
                        size="small"
                        value={editValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.key === "Enter") saveEdit(editValue);
                            if (e.key === "Escape") setEditing(false);
                        }}
                        onBlur={() => saveEdit(editValue)}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        sx={{
                            "& .MuiInputBase-input": {
                                bgcolor: V.exposeFaint,
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 12,
                                px: "7px",
                                py: "2px"
                            },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: V.expose },
                                "&.Mui-focused fieldset": {
                                    borderColor: V.expose,
                                    borderWidth: "1.5px"
                                }
                            },
                            width: 210
                        }}
                    />
                ) : (
                    <Typography
                        component="span"
                        sx={{
                            color: node.readOnly
                                ? "text.secondary"
                                : node.nodeType === NodeType.OBJECT
                                    ? "text.primary"
                                    : node.nodeType === NodeType.MAP || node.nodeType === NodeType.COMPLEX_MAP
                                        ? "text.primary"
                                        : "text.secondary",
                            flexShrink: 0,
                            fontFamily: node.nodeType === NodeType.LEAF || node.canDelete
                                ? "'JetBrains Mono', monospace"
                                : "'Inter', sans-serif",
                            fontSize: node.nodeType === NodeType.OBJECT
                                ? 13
                                : isNodeContainer ? 12.5 : 12,
                            fontWeight: node.nodeType === NodeType.OBJECT
                                ? 700
                                : isNodeContainer ? 600 : 500,
                            letterSpacing: "-0.015em",
                            lineHeight: 1,
                            whiteSpace: "nowrap"
                        }}
                    >
                        {node.title}
                        {node.readOnly && (
                            <Typography
                                component="span"
                                sx={{
                                    color: "text.disabled",
                                    fontSize: "8px",
                                    fontStyle: "italic",
                                    ml: 0.5
                                }}
                            >
                                (read-only)
                            </Typography>
                        )}
                    </Typography>
                )}

                { /* Data type tag */}
                {node.dataType && !editing && <TypeTag type={node.dataType} />}

                { /* Operation chips with inline encryption */}
                {!editing && (
                    <OpChips
                        node={node}
                        rowHovered={hovered}
                        hasCertificate={hasCertificate}
                        onToggleExpose={() => onToggleExpose(node.key)}
                        onToggleModify={() => onToggleModify(node.key)}
                        onToggleExposeEncrypt={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.stopPropagation();
                            onToggleExposeEncrypt(node.key);
                        }}
                        onToggleModifyEncrypt={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.stopPropagation();
                            onToggleModifyEncrypt(node.key);
                        }}
                        readOnly={readOnly}
                    />
                )}

                { /* Add entry chip for maps */}
                {node.dynamicEntryAllowed && !editing && hovered && !readOnly && (
                    <Chip
                        label="+ ADD ENTRY"
                        className="add-entry-chip"
                        size="small"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onAddChild(node);
                        }}
                        variant="outlined"
                        sx={{
                            "&:hover": {
                                bgcolor: V.exposeFaint,
                                border: `1px dashed ${V.expose}`,
                                color: V.expose
                            },
                            border: "1px dashed",
                            borderColor: "grey.300",
                            borderRadius: "20px",
                            color: "text.disabled",
                            cursor: "pointer",
                            flexShrink: 0,
                            fontSize: "8px",
                            fontWeight: 700,
                            height: 15,
                            letterSpacing: "0.06em",
                            transition: "all 0.12s"
                        }}
                    />
                )}

                { /* Edit / Delete buttons for dynamic entries */}
                {node.canDelete && !editing && hovered && !readOnly && (
                    <Box sx={{ alignItems: "center", display: "inline-flex", gap: "1px" }}>
                        <Tooltip title="Rename key" placement="top">
                            <IconButton
                                size="small"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setEditing(true);
                                }}
                                sx={{
                                    "&:hover": { bgcolor: "transparent", color: V.expose },
                                    color: "grey.300",
                                    p: "2px"
                                }}
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove entry" placement="top">
                            <IconButton
                                size="small"
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    onDelete(node.key);
                                }}
                                sx={{
                                    "&:hover": { bgcolor: "transparent", color: "error.main" },
                                    color: "grey.300",
                                    p: "2px"
                                }}
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1
                                        2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>

            { /* ── Children ── */}
            {expandable && (
                <Collapse in={open} timeout={180}>
                    {node.children.map((child: TreeNodeState) => (
                        <FlowContextTreeNode
                            key={child.key}
                            node={child}
                            depth={depth + 1}
                            hasCertificate={hasCertificate}
                            onToggleExpose={onToggleExpose}
                            onToggleModify={onToggleModify}
                            onToggleExposeEncrypt={onToggleExposeEncrypt}
                            onToggleModifyEncrypt={onToggleModifyEncrypt}
                            onDelete={onDelete}
                            onRename={onRename}
                            onAddChild={onAddChild}
                            readOnly={readOnly}
                            data-componentid={componentId}
                        />
                    ))}
                    {node.dynamicEntryAllowed && node.children.length === 0 && (
                        <Typography
                            sx={{
                                color: "grey.300",
                                fontSize: 10,
                                fontStyle: "italic",
                                pb: "4px",
                                pl: `${(depth + 1) * INDENT + 23}px`,
                                pt: "2px"
                            }}
                        >
                            No entries yet
                        </Typography>
                    )}
                </Collapse>
            )}
        </Box>
    );
};

export default FlowContextTreeNode;
