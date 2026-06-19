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

import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Collapse from "@oxygen-ui/react/Collapse";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronRightIcon } from "@oxygen-ui/react-icons";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { NodeType, TreeNodeStateInterface } from "./models";

const INDENT: number = 18;

interface FlowContextTreeNodeProps {
    node: TreeNodeStateInterface;
    depth?: number;
    selectedKey?: string | null;
    onSelect: (key: string) => void;
    onToggleExpose: (key: string) => void;
    onToggleModify: (key: string) => void;
    onAddChild: (node: TreeNodeStateInterface) => void;
    readOnly?: boolean;
    "data-componentid"?: string;
}

/**
 * EXPOSE / MODIFY / ADD ENTRY chips, always-visible, right-aligned.
 */
const OpChips = ({
    node,
    onToggleExpose,
    onToggleModify,
    onAddChild,
    readOnly
}: {
    node: TreeNodeStateInterface;
    onToggleExpose: () => void;
    onToggleModify: () => void;
    onAddChild: () => void;
    readOnly?: boolean;
}): ReactElement | null => {

    const { t } = useTranslation();

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
                    label={ t("flowExtension:contextTree.node.readChip") }
                    size="small"
                    onClick={ readOnly ? undefined : (e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleExpose();
                    } }
                    sx={ {
                        "& .MuiChip-label": { px: "6px" },
                        backgroundColor: node.exposed ? "#E8F5E9" : "transparent",
                        border: "1px solid",
                        borderColor: node.exposed ? "#2E7D32" : "#EBEBEB",
                        borderRadius: "20px",
                        color: node.exposed ? "#2E7D32" : "#787878",
                        cursor: readOnly ? "default" : "pointer",
                        flexShrink: 0,
                        fontSize: "9.5px",
                        fontWeight: node.exposed ? 700 : 600,
                        height: 19,
                        letterSpacing: "0.05em",
                        transition: "all 0.12s ease",
                        ...(!node.exposed && {
                            "&:hover": {
                                backgroundColor: "#E8F5E9",
                                borderColor: "#2E7D32",
                                color: "#2E7D32"
                            }
                        })
                    } }
                />
            ) }
            { canModify && (
                <Chip
                    label={ t("flowExtension:contextTree.node.writeChip") }
                    size="small"
                    onClick={ readOnly ? undefined : (e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleModify();
                    } }
                    sx={ {
                        "& .MuiChip-label": { px: "6px" },
                        backgroundColor: node.modify ? "#E3F2FD" : "transparent",
                        border: "1px solid",
                        borderColor: node.modify ? "#1565C0" : "#EBEBEB",
                        borderRadius: "20px",
                        color: node.modify ? "#1565C0" : "#787878",
                        cursor: readOnly ? "default" : "pointer",
                        flexShrink: 0,
                        fontSize: "9.5px",
                        fontWeight: node.modify ? 700 : 600,
                        height: 19,
                        letterSpacing: "0.05em",
                        transition: "all 0.12s ease",
                        ...(!node.modify && {
                            "&:hover": {
                                backgroundColor: "#E3F2FD",
                                borderColor: "#1565C0",
                                color: "#1565C0"
                            }
                        })
                    } }
                />
            ) }
            { showAddEntry && (
                <Chip
                    label={ t("flowExtension:contextTree.node.addEntryChip") }
                    size="small"
                    onClick={ (e: React.MouseEvent) => {
                        e.stopPropagation();
                        onAddChild();
                    } }
                    variant="outlined"
                    sx={ {
                        "&:hover": {
                            bgcolor: "#FFF4EC",
                            border: "1px dashed #FFB066",
                            color: "#E07B2A"
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
                        ml: "6px",
                        transition: "all 0.12s"
                    } }
                />
            ) }
        </Box>
    );
};

/**
 * Recursive tree node renderer. Field-config / rename / delete
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

    const { t } = useTranslation();

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

    return (
        <Box data-componentid={ `${componentId}-${node.key}` }>
            <Box
                onClick={ handleRowClick }
                sx={ {
                    // Lift row content above the container band drawn by ::before.
                    "& > *": { position: "relative", zIndex: 1 },
                    alignItems: "center",
                    border: "1px solid transparent",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    flexWrap: "nowrap",
                    gap: "4px",
                    minHeight: "36px",
                    pb: "4px",
                    pl: `${depth * INDENT + 6}px`,
                    position: "relative",
                    pr: "10px",
                    pt: "4px",
                    transition: "background 0.1s",
                    ...(isContainer
                        ? {
                            // Container rows (OBJECT/MAP/COMPLEX_MAP) get a banded background that
                            // starts at the row's name column and extends to just before the right
                            // edge of the tree column. The band provides the emphasis, so hover and
                            // selected backgrounds are suppressed.
                            "&::before": {
                                backgroundColor: "#F4F4F4",
                                borderRadius: "6px",
                                bottom: 4,
                                content: "\"\"",
                                left: containerBandLeft,
                                pointerEvents: "none",
                                position: "absolute",
                                right: 6,
                                top: 4,
                                zIndex: 0
                            },
                            "&:hover": { backgroundColor: "transparent" }
                        }
                        : {
                            "&:hover": {
                                backgroundColor: selected ? "#FFF4EC" : "#F4F4F4"
                            },
                            backgroundColor: selected ? "#FFF4EC" : "transparent"
                        })
                } }
            >
                { /* Expand icon (containers only); leaves keep the slot empty for alignment. */ }
                <Box
                    sx={ {
                        alignItems: "center",
                        color: "#D0D0D0",
                        display: "flex",
                        flexShrink: 0,
                        justifyContent: "center",
                        width: 12
                    } }
                >
                    { expandable && !isLeaf && (
                        <Box
                            sx={ {
                                alignItems: "center",
                                display: "flex",
                                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                                transition: "transform 0.18s ease"
                            } }
                        >
                            <ChevronRightIcon size={ 14 } />
                        </Box>
                    ) }
                </Box>

                { /* Title + optional Read-Only indicator (leaves only) */ }
                <Box
                    sx={ {
                        alignItems: "center",
                        display: "flex",
                        flex: "0 1 auto",
                        gap: "6px",
                        minWidth: 0
                    } }
                >
                    <Typography
                        component="span"
                        sx={ {
                            // Group headers are always primary; the "Read-Only" caption (not the
                            // colour) conveys read-only state, so headers don't dim with their content.
                            color: isContainer ? "text.primary" : "text.secondary",
                            fontFamily: isLeaf || node.canDelete
                                ? "monospace"
                                : undefined,
                            fontSize: isContainer ? 14 : 13,
                            fontWeight: isContainer ? 600 : 500,
                            letterSpacing: "-0.01em",
                            lineHeight: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        } }
                    >
                        { node.title }
                    </Typography>
                    { isLeaf && node.readOnly && (
                        <Typography
                            component="span"
                            sx={ {
                                color: "text.disabled",
                                flexShrink: 0,
                                fontSize: "9px",
                                fontWeight: 500,
                                lineHeight: 1
                            } }
                        >
                            { t("flowExtension:contextTree.node.readOnlyBadge") }
                        </Typography>
                    ) }
                </Box>

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
                    { node.children.map((child: TreeNodeStateInterface) => (
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
                            { t("flowExtension:contextTree.node.noEntries") }
                        </Typography>
                    ) }
                </Collapse>
            ) }
        </Box>
    );
};

export default FlowContextTreeNode;
