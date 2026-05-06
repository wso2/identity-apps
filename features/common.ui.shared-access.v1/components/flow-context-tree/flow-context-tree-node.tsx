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
import Typography from "@oxygen-ui/react/Typography";
import React, { CSSProperties, FunctionComponent, ReactElement, useState } from "react";
import "./flow-context-tree.scss";
import { NodeType, TreeNodeState } from "./models";

const INDENT: number = 18;

interface FlowContextTreeNodeProps {
    node: TreeNodeState;
    depth?: number;
    selectedKey?: string | null;
    onSelect: (key: string) => void;
    onToggleExpose: (key: string) => void;
    onToggleModify: (key: string) => void;
    onAddChild: (node: TreeNodeState) => void;
    readOnly?: boolean;
    "data-componentid"?: string;
}

/**
 * Lock SVG used inside an active EXPOSE / MODIFY chip when the corresponding
 * encryption flag is set. Inherits the chip's foreground color via `currentColor`.
 */
const ChipLockIcon = (): ReactElement => (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={ { marginRight: 3 } }
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

/**
 * EXPOSE / MODIFY / ADD ENTRY chips, always-visible, right-aligned.
 * Lock indicator is folded inside the active chip when the field is encrypted —
 * the chip's foreground color gives the lock its color automatically.
 */
const OpChips = ({
    node,
    onToggleExpose,
    onToggleModify,
    onAddChild,
    readOnly
}: {
    node: TreeNodeState;
    onToggleExpose: () => void;
    onToggleModify: () => void;
    onAddChild: () => void;
    readOnly?: boolean;
}): ReactElement | null => {

    const isLeaf: boolean = node.nodeType === NodeType.LEAF;
    const canExpose: boolean = node.allowedOperations.includes("EXPOSE") && isLeaf;
    const canModify: boolean = node.allowedOperations.includes("MODIFY") && isLeaf && !node.readOnly;
    const showAddEntry: boolean = node.dynamicEntryAllowed && !readOnly;

    if (!canExpose && !canModify && !showAddEntry) {
        return null;
    }

    return (
        <Box
            sx={ {
                alignItems: "center",
                display: "inline-flex",
                flexShrink: 0,
                gap: "4px",
                marginLeft: "auto"
            } }
        >
            { canExpose && (
                <Chip
                    label={ (
                        <Box component="span" sx={ { alignItems: "center", display: "inline-flex" } }>
                            { node.exposed && node.exposeEncrypted && <ChipLockIcon /> }
                            EXPOSE
                        </Box>
                    ) }
                    size="small"
                    className={ `expose-chip${node.exposed ? " expose-chip-active" : ""}` }
                    onClick={ readOnly ? undefined : (e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleExpose();
                    } }
                    sx={ {
                        "& .MuiChip-label": { px: "6px" },
                        cursor: readOnly ? "default" : "pointer"
                    } }
                />
            ) }
            { canModify && (
                <Chip
                    label={ (
                        <Box component="span" sx={ { alignItems: "center", display: "inline-flex" } }>
                            { node.modify && node.modifyEncrypted && <ChipLockIcon /> }
                            MODIFY
                        </Box>
                    ) }
                    size="small"
                    className={ `modify-chip${node.modify ? " modify-chip-active" : ""}` }
                    onClick={ readOnly ? undefined : (e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleModify();
                    } }
                    sx={ {
                        "& .MuiChip-label": { px: "6px" },
                        cursor: readOnly ? "default" : "pointer"
                    } }
                />
            ) }
            { showAddEntry && (
                <Chip
                    label="+ ADD ENTRY"
                    className="add-entry-chip"
                    size="small"
                    onClick={ (e: React.MouseEvent) => {
                        e.stopPropagation();
                        onAddChild();
                    } }
                    variant="outlined"
                    sx={ {
                        "&:hover": {
                            bgcolor: "var(--tree-expose-faint)",
                            border: "1px dashed var(--tree-expose)",
                            color: "var(--tree-expose)"
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
                        ml: 0,
                        transition: "all 0.12s"
                    } }
                />
            ) }
        </Box>
    );
};

/**
 * Recursive tree node renderer. Field-config / encryption / rename / delete
 * actions live in the parent's RHS panel, not on the row itself.
 */
const FlowContextTreeNode: FunctionComponent<FlowContextTreeNodeProps> = ({
    node,
    depth = 0,
    selectedKey,
    onSelect,
    onToggleExpose,
    onToggleModify,
    onAddChild,
    readOnly,
    "data-componentid": componentId = "flow-context-tree-node"
}: FlowContextTreeNodeProps): ReactElement => {

    const [ open, setOpen ] = useState<boolean>(true);

    const expandable: boolean = Array.isArray(node.children);
    const isLeaf: boolean = node.nodeType === NodeType.LEAF;
    const isContainer: boolean =
        node.nodeType === NodeType.OBJECT ||
        node.nodeType === NodeType.MAP ||
        node.nodeType === NodeType.COMPLEX_MAP;
    const selected: boolean = selectedKey === node.key && isLeaf;

    // Container band sits a few pixels to the left of the row's content padding so
    // the chevron + title get a small left gutter inside the band.
    const containerBandLeft: number = Math.max(depth * INDENT + 2, 2);

    const handleRowClick = (): void => {
        if (isLeaf) {
            onSelect(node.key);

            return;
        }
        if (expandable) {
            setOpen((o: boolean) => !o);
        }
    };

    const rowClassName: string =
        "tree-node-row" +
        (expandable ? " expandable" : "") +
        (selected ? " selected" : "") +
        (isContainer ? " tree-node-row--container" : "");

    const rowStyle: CSSProperties & Record<string, string | number> = isContainer
        ? { ["--container-band-left" as string]: `${containerBandLeft}px` }
        : {};

    return (
        <Box data-componentid={ `${componentId}-${node.key}` }>
            <Box
                className={ rowClassName }
                onClick={ handleRowClick }
                style={ rowStyle }
                sx={ {
                    pl: `${depth * INDENT + 6}px`
                } }
            >
                { depth > 0 && (
                    <>
                        <Box
                            className="tree-connector-vertical"
                            sx={ {
                                left: (depth - 1) * INDENT + 9
                            } }
                        />
                        <Box
                            className="tree-connector-horizontal"
                            sx={ {
                                left: (depth - 1) * INDENT + 9
                            } }
                        />
                    </>
                ) }

                { /* Expand / leaf icon */ }
                <Box
                    sx={ {
                        alignItems: "center",
                        display: "flex",
                        flexShrink: 0,
                        justifyContent: "center",
                        width: 12
                    } }
                >
                    { expandable ? (
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--tree-gray-20, #D0D0D0)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={ {
                                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                                transition: "transform 0.18s ease"
                            } }
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
                    ) }
                </Box>

                { /* Title */ }
                <Typography
                    component="span"
                    sx={ {
                        color: node.readOnly
                            ? "text.secondary"
                            : isContainer
                                ? "text.primary"
                                : "text.secondary",
                        flex: "0 1 auto",
                        fontFamily: isLeaf || node.canDelete
                            ? "'JetBrains Mono', monospace"
                            : "'Inter', sans-serif",
                        fontSize: node.nodeType === NodeType.OBJECT
                            ? 14
                            : isContainer ? 13.5 : 13,
                        fontWeight: node.nodeType === NodeType.OBJECT
                            ? 700
                            : isContainer ? 600 : 500,
                        letterSpacing: "-0.015em",
                        lineHeight: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    } }
                >
                    { node.title }
                </Typography>

                { /* Operation chips — always pushed to the RHS via marginLeft: auto */ }
                <OpChips
                    node={ node }
                    onToggleExpose={ () => onToggleExpose(node.key) }
                    onToggleModify={ () => onToggleModify(node.key) }
                    onAddChild={ () => onAddChild(node) }
                    readOnly={ readOnly }
                />
            </Box>

            { /* Children */ }
            { expandable && (
                <Collapse in={ open } timeout={ 180 }>
                    { node.children.map((child: TreeNodeState) => (
                        <FlowContextTreeNode
                            key={ child.key }
                            node={ child }
                            depth={ depth + 1 }
                            selectedKey={ selectedKey }
                            onSelect={ onSelect }
                            onToggleExpose={ onToggleExpose }
                            onToggleModify={ onToggleModify }
                            onAddChild={ onAddChild }
                            readOnly={ readOnly }
                            data-componentid={ componentId }
                        />
                    )) }
                    { node.dynamicEntryAllowed && node.children.length === 0 && (
                        <Typography
                            sx={ {
                                color: "grey.300",
                                fontSize: 10,
                                fontStyle: "italic",
                                pb: "4px",
                                pl: `${(depth + 1) * INDENT + 23}px`,
                                pt: "2px"
                            } }
                        >
                            No entries yet
                        </Typography>
                    ) }
                </Collapse>
            ) }
        </Box>
    );
};

export default FlowContextTreeNode;
