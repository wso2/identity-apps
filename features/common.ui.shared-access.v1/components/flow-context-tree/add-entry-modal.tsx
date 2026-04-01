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
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Divider from "@oxygen-ui/react/Divider";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import IconButton from "@oxygen-ui/react/IconButton";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import Switch from "@oxygen-ui/react/Switch";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { TreeNodeState } from "./models";

const EXPOSE_COLOR: string = "var(--tree-expose, #ff7300)";

const FIELD_SX: Record<string, unknown> = {
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": { borderColor: EXPOSE_COLOR },
        borderRadius: "7px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12
    }
};

const SELECT_SX: Record<string, unknown> = {
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": { borderColor: EXPOSE_COLOR },
        borderRadius: "7px",
        fontSize: 12
    }
};

const LABEL_SX: Record<string, unknown> = {
    color: "text.secondary",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.07em",
    mb: 0.6,
    textTransform: "uppercase"
};

const PRIMARY_TYPES: string[] = [
    "String",
    "Integer",
    "Boolean",
    "Float",
    "Double",
    "Long",
    "char[]"
];

/**
 * Attribute definition for complex object builder.
 */
interface AttributeDef {
    name: string;
    type: string;
    isArray: boolean;
}

export interface AddEntryModalProps {
    open: boolean;
    parentNode: TreeNodeState | null;
    onClose: () => void;
    onSubmit: (entry: { keyName: string; objectStructure: string }) => void;
    "data-componentid"?: string;
}

/**
 * Modal for adding new entries to MAP / COMPLEX_MAP nodes.
 * MAP: simple key name. COMPLEX_MAP: key + visual attribute builder.
 */
const AddEntryModal: FunctionComponent<AddEntryModalProps> = ({
    open,
    parentNode,
    onClose,
    onSubmit,
    "data-componentid": componentId = "add-entry-modal"
}: AddEntryModalProps): ReactElement => {

    const isPropertiesParent: boolean = parentNode?.path === "/properties/";

    const [keyName, setKeyName] = useState<string>("");

    // Type selection state.
    const [selectedType, setSelectedType] = useState<string>("String");
    // Complex object builder state.
    const [isMultiValued, setIsMultiValued] = useState<boolean>(false);
    const [attributes, setAttributes] = useState<AttributeDef[]>([]);
    const [attrName, setAttrName] = useState<string>("");
    const [attrType, setAttrType] = useState<string>("String");
    const [attrIsArray, setAttrIsArray] = useState<boolean>(false);

    const isObjectSelected: boolean = selectedType === "Object";

    /**
     * Build the type annotation content from attributes.
     * Returns the inner content WITHOUT outer braces — those are added by buildAccessConfig.
     * e.g. "risk: String, scores: Integer[]"  or  "[risk: String, scores: Integer[]]"
     */
    const buildStructureString = (): string => {
        const inner: string = attributes
            .map((a: AttributeDef) => `${a.name}: ${a.type}${a.isArray ? "[]" : ""}`)
            .join(", ");

        return isMultiValued ? `[${inner}]` : inner;
    };

    const handleAddAttribute = (): void => {
        const trimmed: string = attrName.trim();

        if (!trimmed) return;
        if (attributes.some((a: AttributeDef) => a.name === trimmed)) return;

        setAttributes((prev: AttributeDef[]) => [
            ...prev,
            { isArray: attrIsArray, name: trimmed, type: attrType }
        ]);
        setAttrName("");
        setAttrType("String");
        setAttrIsArray(false);
    };

    const handleRemoveAttribute = (name: string): void => {
        setAttributes((prev: AttributeDef[]) =>
            prev.filter((a: AttributeDef) => a.name !== name)
        );
    };

    const handleSubmit = (): void => {
        if (!keyName.trim()) return;

        if (!isPropertiesParent) {
            onSubmit({ keyName: keyName.trim(), objectStructure: "" });
            resetState();

            return;
        }

        if (isObjectSelected && attributes.length === 0) return;

        let structure: string;

        if (isObjectSelected) {
            structure = buildStructureString();
        } else if (selectedType === "String" && !isMultiValued) {
            structure = "";
        } else if (isMultiValued) {
            structure = `[${selectedType}]`;
        } else {
            structure = selectedType;
        }

        onSubmit({
            keyName: keyName.trim(),
            objectStructure: structure
        });
        resetState();
    };

    const handleClose = (): void => {
        resetState();
        onClose();
    };

    const resetState = (): void => {
        setKeyName("");
        setSelectedType("String");
        setIsMultiValued(false);
        setAttributes([]);
        setAttrName("");
        setAttrType("String");
        setAttrIsArray(false);
    };

    const title: string = isObjectSelected
        ? "Add Complex Object Entry"
        : "Add Map Entry";

    const canSubmit: boolean = isPropertiesParent && isObjectSelected
        ? !!keyName.trim() && attributes.length > 0
        : !!keyName.trim();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            data-componentid={componentId}
            PaperProps={{
                sx: { border: "1px solid", borderColor: "grey.200", borderRadius: "10px" }
            }}
        >
            <DialogTitle sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600, pb: 0.5 }}>
                {title}
                <Typography sx={{ color: "text.disabled", fontSize: 11, fontWeight: 400, mt: 0.3 }}>
                    {isObjectSelected
                        ? "Define the key, value shape, and its attributes"
                        : "Define the key that will be written into the map at runtime"}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: "12px !important" }}>
                { /* ── Key Name ── */ }
                <Typography sx={LABEL_SX}>
                    Key Name <span style={{ color: "var(--tree-danger, #C0392B)" }}>*</span>
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    value={keyName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyName(e.target.value)}
                    placeholder="e.g. risk-factor"
                    sx={FIELD_SX}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter" && !isObjectSelected) handleSubmit();
                    }}
                    data-componentid={`${componentId}-key-input`}
                />

                { /* ── Data Type (only for properties map) ── */ }
                {isPropertiesParent && (<>
                <Typography sx={{ ...LABEL_SX, mt: 1.5 }}>
                    Data Type
                </Typography>
                <Select
                    size="small"
                    fullWidth
                    value={selectedType}
                    onChange={(e: SelectChangeEvent<string>) => {
                        setSelectedType(e.target.value);
                        if (e.target.value !== "Object") {
                            setAttributes([]);
                        }
                    }}
                    sx={SELECT_SX}
                    data-componentid={`${componentId}-type-select`}
                >
                    {PRIMARY_TYPES.map((t: string) => (
                        <MenuItem key={t} value={t}>
                            <Typography sx={{ fontSize: 12 }}>{t}</Typography>
                        </MenuItem>
                    ))}
                    <MenuItem key="Object" value="Object">
                        <Typography sx={{ fontSize: 12 }}>Object</Typography>
                    </MenuItem>
                </Select>

                { /* ── Multivalued toggle ── */ }
                <FormControlLabel
                    control={
                        <Switch
                            checked={isMultiValued}
                            onChange={() => setIsMultiValued(!isMultiValued)}
                            size="small"
                            sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: EXPOSE_COLOR
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                    backgroundColor: EXPOSE_COLOR
                                }
                            }}
                        />
                    }
                    label={
                        <Typography sx={{ fontSize: 11, fontWeight: 500 }}>
                            Multivalued
                        </Typography>
                    }
                    sx={{ mt: 1 }}
                />

                </>)}

                { /* ── Complex object builder (only when Object selected in properties map) ── */ }
                {isPropertiesParent && isObjectSelected && (
                    <>
                        <Typography sx={{ ...LABEL_SX, mt: 2 }}>
                            Attributes <span style={{ color: "var(--tree-danger, #C0392B)" }}>*</span>
                        </Typography>

                        { /* Attribute input row */ }
                        <Box sx={{
                            alignItems: "center",
                            border: "1px solid",
                            borderColor: "grey.200",
                            borderRadius: "8px",
                            display: "flex",
                            gap: 1,
                            p: 1
                        }}>
                            <TextField
                                size="small"
                                value={attrName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setAttrName(e.target.value)
                                }
                                placeholder="Attribute name"
                                sx={{
                                    ...FIELD_SX,
                                    flex: 1
                                }}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === "Enter") handleAddAttribute();
                                }}
                                data-componentid={`${componentId}-attr-name-input`}
                            />
                            <Select
                                size="small"
                                value={attrType}
                                onChange={(e: SelectChangeEvent<string>) =>
                                    setAttrType(e.target.value)
                                }
                                sx={{
                                    ...SELECT_SX,
                                    minWidth: 100
                                }}
                                data-componentid={`${componentId}-attr-type-select`}
                            >
                                {PRIMARY_TYPES.map((t: string) => (
                                    <MenuItem key={t} value={t}>
                                        <Typography sx={{ fontSize: 12 }}>{t}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                            <Tooltip title="Array of this type" placement="top">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={attrIsArray}
                                            onChange={() => setAttrIsArray(!attrIsArray)}
                                            size="small"
                                            sx={{
                                                "& .MuiSwitch-switchBase.Mui-checked": {
                                                    color: EXPOSE_COLOR
                                                },
                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                    backgroundColor: EXPOSE_COLOR
                                                }
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography sx={{ fontSize: 10, fontWeight: 500 }}>
                                            Multivalued
                                        </Typography>
                                    }
                                    sx={{ mx: 0 }}
                                />
                            </Tooltip>
                            <IconButton
                                size="small"
                                onClick={handleAddAttribute}
                                disabled={!attrName.trim()}
                                sx={{
                                    "&:hover": { bgcolor: "rgba(255,115,0,0.1)", color: EXPOSE_COLOR },
                                    border: "1px solid",
                                    borderColor: "grey.200",
                                    borderRadius: "6px",
                                    color: attrName.trim() ? EXPOSE_COLOR : "grey.300",
                                    p: "5px"
                                }}
                                data-componentid={`${componentId}-add-attr-button`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </IconButton>
                        </Box>

                        { /* Added attributes list */ }
                        {attributes.length > 0 && (
                            <Box sx={{
                                border: "1px solid",
                                borderColor: "grey.200",
                                borderRadius: "8px",
                                maxHeight: 180,
                                mt: 1,
                                overflowY: "auto",
                                scrollbarColor: "#adb2b6 #f1f1f1",
                                scrollbarWidth: "thin"
                            }}>
                                {attributes.map((attr: AttributeDef) => (
                                    <Box
                                        key={attr.name}
                                        sx={{
                                            "&:hover": { bgcolor: "grey.50" },
                                            alignItems: "center",
                                            borderBottom: "1px solid",
                                            borderColor: "grey.100",
                                            display: "flex",
                                            gap: 1,
                                            justifyContent: "space-between",
                                            px: 1.5,
                                            py: 0.7
                                        }}
                                    >
                                        <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
                                            <Typography sx={{
                                                fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: 11,
                                                fontWeight: 600
                                            }}>
                                                {attr.name}
                                            </Typography>
                                            <Box sx={{
                                                bgcolor: "grey.100",
                                                borderRadius: "4px",
                                                px: "6px",
                                                py: "2px"
                                            }}>
                                                <Typography sx={{
                                                    color: "text.secondary",
                                                    fontFamily: "'JetBrains Mono', monospace",
                                                    fontSize: 10,
                                                    fontWeight: 500
                                                }}>
                                                    {attr.type}{attr.isArray ? "[]" : ""}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveAttribute(attr.name)}
                                            sx={{
                                                "&:hover": { color: "error.main" },
                                                color: "grey.400",
                                                p: "3px"
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor"
                                                strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        { /* Preview of generated structure */ }
                        {attributes.length > 0 && (
                            <Box sx={{
                                bgcolor: "grey.50",
                                borderRadius: "6px",
                                mt: 1.2,
                                px: 1.2,
                                py: 0.8
                            }}>
                                <Typography sx={{
                                    color: "text.disabled",
                                    fontSize: 9,
                                    fontWeight: 600,
                                    letterSpacing: "0.07em",
                                    mb: 0.3,
                                    textTransform: "uppercase"
                                }}>
                                    Structure preview
                                </Typography>
                                <Typography sx={{
                                    color: "text.secondary",
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 10,
                                    lineHeight: 1.5,
                                    overflowWrap: "break-word"
                                }}>
                                    {`{${buildStructureString()}}`}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
            <Divider sx={{ borderColor: "grey.100" }} />
            <DialogActions sx={{ gap: 1, px: 2.5, py: 1.5 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    size="small"
                    sx={{
                        "&:hover": { bgcolor: "grey.50" },
                        border: "1px solid",
                        borderColor: "grey.200",
                        borderRadius: "6px",
                        color: "text.secondary",
                        fontSize: 12,
                        fontWeight: 500,
                        px: 2
                    }}
                    data-componentid={`${componentId}-cancel-button`}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    size="small"
                    disabled={!canSubmit}
                    sx={{
                        "&:hover": { bgcolor: "#E05E00" },
                        bgcolor: EXPOSE_COLOR,
                        borderRadius: "6px",
                        boxShadow: "0 1px 6px rgba(255,107,0,0.3)",
                        fontSize: 12,
                        fontWeight: 600,
                        px: 2
                    }}
                    data-componentid={`${componentId}-submit-button`}
                >
                    Add Entry
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEntryModal;
