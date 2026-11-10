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

import { SxProps, Theme } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Collapse from "@oxygen-ui/react/Collapse";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronRightIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import FlowExtensionAccessConstants from "../../../constants/flow-extension-access-constants";
import {
    FlowExtensionAccessRowGroupInterface,
    FlowExtensionAccessRowInterface
} from "../../../models/flow-extension-access";

const INDENT: number = 18;

/**
 * Props interface of {@link FlowExtensionAccessRows}
 */
interface FlowExtensionAccessRowsPropsInterface extends IdentifiableComponentInterface {
    title: string;
    emptyText: string;
    rows: FlowExtensionAccessRowInterface[];
    groups?: FlowExtensionAccessRowGroupInterface[];
    disabled?: boolean;
    isRead: (row: FlowExtensionAccessRowInterface) => boolean;
    /**
     * Whether a writable row is marked WRITE. Only needed when a row can be written.
     */
    isWritten?: (row: FlowExtensionAccessRowInterface) => boolean;
    onToggleRead: (row: FlowExtensionAccessRowInterface) => void;
    /**
     * Toggles WRITE on a writable row. Only needed when a row can be written.
     */
    onToggleWrite?: (row: FlowExtensionAccessRowInterface) => void;
}

/**
 * Style of a READ or WRITE chip, matching the access config tree of the flow extension.
 */
const getAccessChipSx: (active: boolean, color: string, background: string) => SxProps<Theme> = (
    active: boolean,
    color: string,
    background: string
): SxProps<Theme> => ({
    "& .MuiChip-label": { px: "6px" },
    ...(!active && {
        "&:hover": { backgroundColor: background, borderColor: color, color }
    }),
    backgroundColor: active ? background : "transparent",
    border: "1px solid",
    borderColor: active ? color : FlowExtensionAccessConstants.IDLE_CHIP_BORDER_COLOR,
    borderRadius: "20px",
    color: active ? color : FlowExtensionAccessConstants.IDLE_CHIP_TEXT_COLOR,
    cursor: "pointer",
    flexShrink: 0,
    fontSize: "9.5px",
    fontWeight: active ? 700 : 600,
    height: 19,
    letterSpacing: "0.05em",
    transition: "all 0.12s ease"
});

/**
 * Fields of the flow under a collapsible section, each with READ and, when it can be written, WRITE toggles, laid
 * out like the access config tree of the flow extension. Groups of fields are listed under their own collapsible
 * rows.
 *
 * @param props - Props injected to the component.
 * @returns FlowExtensionAccessRows component.
 */
const FlowExtensionAccessRows: FunctionComponent<FlowExtensionAccessRowsPropsInterface> = ({
    title,
    emptyText,
    rows,
    groups = [],
    disabled = false,
    isRead,
    isWritten = (): boolean => false,
    onToggleRead,
    onToggleWrite,
    ["data-componentid"]: componentId = "flow-extension-access-rows"
}: FlowExtensionAccessRowsPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const [ open, setOpen ] = useState<boolean>(true);
    const [ closedGroups, setClosedGroups ] = useState<string[]>([]);

    const toggleGroup: (groupId: string) => void = (groupId: string): void =>
        setClosedGroups((closed: string[]) => closed.includes(groupId)
            ? closed.filter((closedId: string) => closedId !== groupId)
            : [ ...closed, groupId ]);

    const renderChevron: (isOpen: boolean) => ReactElement = (isOpen: boolean): ReactElement => (
        <Box
            sx={ {
                alignItems: "center",
                color: FlowExtensionAccessConstants.CHEVRON_COLOR,
                display: "flex",
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.18s ease"
            } }
        >
            <ChevronRightIcon size={ 14 } />
        </Box>
    );

    const renderEmpty: (text: string, indent: number) => ReactElement = (
        text: string,
        indent: number
    ): ReactElement => (
        <Typography
            sx={ {
                color: "grey.400",
                fontSize: 11,
                fontStyle: "italic",
                pl: `${ indent }px`,
                py: "6px"
            } }
        >
            { text }
        </Typography>
    );

    const renderRow: (row: FlowExtensionAccessRowInterface, indent: number) => ReactElement = (
        row: FlowExtensionAccessRowInterface,
        indent: number
    ): ReactElement => (
        <Box
            key={ row.path }
            sx={ {
                "&:hover": { backgroundColor: FlowExtensionAccessConstants.ROW_BAND_COLOR },
                alignItems: "center",
                borderRadius: "6px",
                display: "flex",
                gap: "6px",
                minHeight: "36px",
                pl: `${ indent }px`,
                pr: "8px"
            } }
            data-componentid={ `${ componentId }-${ row.name }` }
        >
            <Typography
                component="span"
                sx={ {
                    color: "text.secondary",
                    fontFamily: "monospace",
                    fontSize: 13,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                } }
            >
                { row.name }
            </Typography>
            <Typography
                component="span"
                sx={ { color: "text.disabled", flexShrink: 0, fontFamily: "monospace", fontSize: "9px" } }
            >
                { row.dataType }
            </Typography>
            { !row.canWrite && (
                <Typography
                    component="span"
                    sx={ { color: "text.disabled", flexShrink: 0, fontSize: "9px", fontWeight: 500 } }
                >
                    { t("flowExtension:contextTree.node.readOnlyBadge") }
                </Typography>
            ) }
            <Box sx={ { display: "inline-flex", flexShrink: 0, gap: "4px", ml: "auto" } }>
                <Chip
                    size="small"
                    label={ t("flowExtension:contextTree.node.readChip") }
                    onClick={ disabled ? undefined : () => onToggleRead(row) }
                    disabled={ disabled }
                    sx={ getAccessChipSx(isRead(row), FlowExtensionAccessConstants.READ_CHIP_COLORS.color,
                        FlowExtensionAccessConstants.READ_CHIP_COLORS.background) }
                    data-componentid={ `${ componentId }-${ row.name }-read` }
                />
                { row.canWrite && onToggleWrite && (
                    <Chip
                        size="small"
                        label={ t("flowExtension:contextTree.node.writeChip") }
                        onClick={ disabled ? undefined : () => onToggleWrite(row) }
                        disabled={ disabled }
                        sx={ getAccessChipSx(isWritten(row), FlowExtensionAccessConstants.WRITE_CHIP_COLORS.color,
                            FlowExtensionAccessConstants.WRITE_CHIP_COLORS.background) }
                        data-componentid={ `${ componentId }-${ row.name }-write` }
                    />
                ) }
            </Box>
        </Box>
    );

    return (
        <Box data-componentid={ componentId }>
            <Box
                onClick={ () => setOpen((isOpen: boolean) => !isOpen) }
                sx={ {
                    alignItems: "center",
                    backgroundColor: FlowExtensionAccessConstants.ROW_BAND_COLOR,
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    gap: "4px",
                    minHeight: "36px",
                    px: "8px"
                } }
            >
                { renderChevron(open) }
                <Typography component="span" sx={ { fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" } }>
                    { title }
                </Typography>
            </Box>
            <Collapse in={ open } timeout={ 180 }>
                { rows.length === 0 && groups.length === 0 && renderEmpty(emptyText, INDENT + 8) }
                { rows.map((row: FlowExtensionAccessRowInterface) => renderRow(row, INDENT + 8)) }
                { groups.map((group: FlowExtensionAccessRowGroupInterface) => {
                    const isGroupOpen: boolean = !closedGroups.includes(group.id);

                    return (
                        <Box key={ group.id } data-componentid={ `${ componentId }-${ group.id }` }>
                            <Box
                                onClick={ () => toggleGroup(group.id) }
                                sx={ {
                                    "&:hover": { backgroundColor: FlowExtensionAccessConstants.ROW_BAND_COLOR },
                                    alignItems: "center",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "flex",
                                    gap: "4px",
                                    minHeight: "36px",
                                    pl: `${ INDENT - 6 }px`,
                                    pr: "8px"
                                } }
                            >
                                { renderChevron(isGroupOpen) }
                                <Typography
                                    component="span"
                                    sx={ {
                                        color: "text.secondary",
                                        fontFamily: "monospace",
                                        fontSize: 13,
                                        fontWeight: 600
                                    } }
                                >
                                    { group.title }
                                </Typography>
                            </Box>
                            <Collapse in={ isGroupOpen } timeout={ 180 }>
                                { group.rows.length === 0 && renderEmpty(group.emptyText, INDENT * 2 + 8) }
                                { group.rows.map(
                                    (row: FlowExtensionAccessRowInterface) => renderRow(row, INDENT * 2 + 8)) }
                            </Collapse>
                        </Box>
                    );
                }) }
            </Collapse>
        </Box>
    );
};

export default FlowExtensionAccessRows;
