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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { TreeNodeState } from "./models";

const FIELD_SX: Record<string, unknown> = {
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.23)",
            borderWidth: "1px"
        },
        borderRadius: "7px"
    }
};

const SELECT_SX: Record<string, unknown> = {
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.23)",
            borderWidth: "1px"
        },
        borderRadius: "7px"
    }
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

interface AttributeDef {
    name: string;
    type: string;
    isArray: boolean;
}

/**
 * Parse a stored object-structure string back into the visual builder state.
 * Inputs (no outer braces — those are added by buildAccessConfig):
 *   ""                                   → primitive String, single
 *   "Integer"                            → primitive Integer, single
 *   "[Integer]"                          → primitive Integer, multivalued
 *   "risk: String, scores: Integer[]"    → Object, single
 *   "[risk: String, scores: Integer[]]"  → Object, multivalued
 */
const parseDataType = (raw: string): {
    selectedType: string;
    isMultiValued: boolean;
    attributes: AttributeDef[];
} => {
    const empty: { selectedType: string; isMultiValued: boolean; attributes: AttributeDef[] } = {
        attributes: [],
        isMultiValued: false,
        selectedType: "String"
    };

    if (!raw) return empty;

    let working: string = raw.trim();
    let isMultiValued: boolean = false;

    if (working.startsWith("[") && working.endsWith("]")) {
        isMultiValued = true;
        working = working.slice(1, -1).trim();
    }

    if (working.includes(":")) {
        const attrs: AttributeDef[] = working
            .split(",")
            .map((part: string) => part.trim())
            .filter((part: string) => part.length > 0)
            .map((part: string): AttributeDef | null => {
                const [ rawName, rawType ] = part.split(":").map((s: string) => s.trim());

                if (!rawName || !rawType) return null;

                const isArray: boolean = rawType.endsWith("[]");
                const type: string = isArray ? rawType.slice(0, -2).trim() : rawType;

                return { isArray, name: rawName, type };
            })
            .filter((a: AttributeDef | null): a is AttributeDef => a !== null);

        return { attributes: attrs, isMultiValued, selectedType: "Object" };
    }

    return { attributes: [], isMultiValued, selectedType: working || "String" };
};

interface AddEntryModalInitialValues {
    keyName: string;
    /**
     * Raw stored data type string — same shape that `buildAccessConfig` round-trips.
     * The modal parses this back into selectedType + isMultiValued + attributes.
     */
    dataType: string;
}

interface AddEntryModalProps {
    open: boolean;
    parentNode: TreeNodeState | null;
    /** "create" (default) opens an empty form; "edit" prefills from `initialValues`. */
    mode?: "create" | "edit";
    initialValues?: AddEntryModalInitialValues;
    onClose: () => void;
    onSubmit: (entry: { keyName: string; objectStructure: string }) => void;
    "data-componentid"?: string;
}

const AddEntryModal: FunctionComponent<AddEntryModalProps> = ({
    open,
    parentNode,
    mode = "create",
    initialValues,
    onClose,
    onSubmit,
    "data-componentid": componentId = "add-entry-modal"
}: AddEntryModalProps): ReactElement => {

    const isPropertiesParent: boolean = parentNode?.path === "/properties/";
    const isEdit: boolean = mode === "edit";

    const [ keyName, setKeyName ] = useState<string>("");
    const [ selectedType, setSelectedType ] = useState<string>("String");
    const [ isMultiValued, setIsMultiValued ] = useState<boolean>(false);
    const [ attributes, setAttributes ] = useState<AttributeDef[]>([]);
    const [ attrName, setAttrName ] = useState<string>("");
    const [ attrType, setAttrType ] = useState<string>("String");
    const [ attrIsArray, setAttrIsArray ] = useState<boolean>(false);

    // Reset / prefill state when the modal opens.
    useEffect(() => {
        if (!open) return;

        if (isEdit && initialValues) {
            const parsed: { selectedType: string; isMultiValued: boolean; attributes: AttributeDef[] } =
                parseDataType(initialValues.dataType);

            setKeyName(initialValues.keyName);
            setSelectedType(parsed.selectedType);
            setIsMultiValued(parsed.isMultiValued);
            setAttributes(parsed.attributes);
        } else {
            setKeyName("");
            setSelectedType("String");
            setIsMultiValued(false);
            setAttributes([]);
        }
        setAttrName("");
        setAttrType("String");
        setAttrIsArray(false);
    }, [ open, isEdit, initialValues ]);

    const isObjectSelected: boolean = selectedType === "Object";

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
    };

    const handleClose = (): void => {
        onClose();
    };

    const title: string = (() => {
        if (isEdit) {
            return isObjectSelected ? "Edit Complex Object Entry" : "Edit Map Entry";
        }

        return isObjectSelected ? "Add Complex Object Entry" : "Add Map Entry";
    })();

    const submitLabel: string = isEdit ? "Save Changes" : "Add Entry";

    const canSubmit: boolean = isPropertiesParent && isObjectSelected
        ? !!keyName.trim() && attributes.length > 0
        : !!keyName.trim();

    return (
        <Dialog
            open={ open }
            onClose={ handleClose }
            maxWidth="sm"
            fullWidth
            data-componentid={ componentId }
            PaperProps={ {
                sx: { border: "1px solid", borderColor: "grey.200", borderRadius: "10px" }
            } }
        >
            <DialogTitle sx={ { pb: 0.5 } }>
                <Typography variant="subtitle2" sx={ { fontWeight: 600 } }>
                    { title }
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    { isObjectSelected
                        ? "Define the key, value shape, and its attributes"
                        : "Define the key that will be written into the map at runtime" }
                </Typography>
            </DialogTitle>
            <DialogContent sx={ { pt: "12px !important" } }>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={ { display: "block", fontWeight: 600, mb: 0.5 } }
                >
                    Key Name <span style={ { color: "var(--tree-danger, #C0392B)" } }>*</span>
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    value={ keyName }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setKeyName(e.target.value) }
                    placeholder="e.g. risk-factor"
                    sx={ FIELD_SX }
                    onKeyDown={ (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" && !isObjectSelected) handleSubmit();
                    } }
                    data-componentid={ `${componentId}-key-input` }
                />

                { isPropertiesParent && (
                    <>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={ { display: "block", fontWeight: 600, mb: 0.5, mt: 1.5 } }
                        >
                            Data Type
                        </Typography>
                        <Select
                            size="small"
                            fullWidth
                            value={ selectedType }
                            onChange={ (e: SelectChangeEvent<string>) => {
                                setSelectedType(e.target.value);
                                if (e.target.value !== "Object") {
                                    setAttributes([]);
                                }
                            } }
                            sx={ SELECT_SX }
                            data-componentid={ `${componentId}-type-select` }
                        >
                            { PRIMARY_TYPES.map((t: string) => (
                                <MenuItem key={ t } value={ t }>
                                    <Typography variant="body2">{ t }</Typography>
                                </MenuItem>
                            )) }
                            <MenuItem key="Object" value="Object">
                                <Typography variant="body2">Object</Typography>
                            </MenuItem>
                        </Select>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={ isMultiValued }
                                    onChange={ () => setIsMultiValued(!isMultiValued) }
                                    size="small"
                                />
                            }
                            label={
                                <Typography variant="body2" sx={ { fontWeight: 500 } }>
                                    Multivalued
                                </Typography>
                            }
                            sx={ { mt: 1 } }
                        />
                    </>
                ) }

                { isPropertiesParent && isObjectSelected && (
                    <>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={ { display: "block", fontWeight: 600, mb: 0.5, mt: 2 } }
                        >
                            Attributes <span style={ { color: "var(--tree-danger, #C0392B)" } }>*</span>
                        </Typography>

                        <Box sx={ {
                            alignItems: "center",
                            border: "1px solid",
                            borderColor: "grey.200",
                            borderRadius: "8px",
                            display: "flex",
                            gap: 1,
                            p: 1
                        } }>
                            <TextField
                                size="small"
                                value={ attrName }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                    setAttrName(e.target.value)
                                }
                                placeholder="Attribute name"
                                sx={ {
                                    ...FIELD_SX,
                                    flex: 1
                                } }
                                onKeyDown={ (e: React.KeyboardEvent) => {
                                    if (e.key === "Enter") handleAddAttribute();
                                } }
                                data-componentid={ `${componentId}-attr-name-input` }
                            />
                            <Select
                                size="small"
                                value={ attrType }
                                onChange={ (e: SelectChangeEvent<string>) =>
                                    setAttrType(e.target.value)
                                }
                                sx={ {
                                    ...SELECT_SX,
                                    minWidth: 100
                                } }
                                data-componentid={ `${componentId}-attr-type-select` }
                            >
                                { PRIMARY_TYPES.map((t: string) => (
                                    <MenuItem key={ t } value={ t }>
                                        <Typography variant="body2">{ t }</Typography>
                                    </MenuItem>
                                )) }
                            </Select>
                            <Tooltip title="Array of this type" placement="top">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={ attrIsArray }
                                            onChange={ () => setAttrIsArray(!attrIsArray) }
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography variant="caption" sx={ { fontWeight: 500 } }>
                                            Multivalued
                                        </Typography>
                                    }
                                    sx={ { mx: 0 } }
                                />
                            </Tooltip>
                            <IconButton
                                size="small"
                                onClick={ handleAddAttribute }
                                disabled={ !attrName.trim() }
                                sx={ {
                                    "&:hover": { bgcolor: "grey.100", color: "text.primary" },
                                    border: "1px solid",
                                    borderColor: "grey.200",
                                    borderRadius: "6px",
                                    color: attrName.trim() ? "text.secondary" : "grey.300",
                                    p: "5px"
                                } }
                                data-componentid={ `${componentId}-add-attr-button` }
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </IconButton>
                        </Box>

                        { attributes.length > 0 && (
                            <Box sx={ {
                                border: "1px solid",
                                borderColor: "grey.200",
                                borderRadius: "8px",
                                maxHeight: 180,
                                mt: 1,
                                overflowY: "auto",
                                scrollbarColor: "#adb2b6 #f1f1f1",
                                scrollbarWidth: "thin"
                            } }>
                                { attributes.map((attr: AttributeDef) => (
                                    <Box
                                        key={ attr.name }
                                        sx={ {
                                            "&:hover": { bgcolor: "grey.50" },
                                            alignItems: "center",
                                            borderBottom: "1px solid",
                                            borderColor: "grey.100",
                                            display: "flex",
                                            gap: 1,
                                            justifyContent: "space-between",
                                            px: 1.5,
                                            py: 0.7
                                        } }
                                    >
                                        <Box sx={ { alignItems: "center", display: "flex", gap: 1 } }>
                                            <Typography variant="body2" sx={ { fontWeight: 500 } }>
                                                { attr.name }
                                            </Typography>
                                            <Box sx={ {
                                                bgcolor: "grey.100",
                                                borderRadius: "4px",
                                                px: "6px",
                                                py: "2px"
                                            } }>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={ { fontWeight: 500 } }
                                                >
                                                    { attr.type }{ attr.isArray ? "[]" : "" }
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={ () => handleRemoveAttribute(attr.name) }
                                            sx={ {
                                                "&:hover": { color: "error.main" },
                                                color: "grey.400",
                                                p: "3px"
                                            } }
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
                                )) }
                            </Box>
                        ) }

                        { attributes.length > 0 && (
                            <Box sx={ {
                                bgcolor: "grey.50",
                                borderRadius: "6px",
                                mt: 1.2,
                                px: 1.2,
                                py: 0.8
                            } }>
                                <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    sx={ { display: "block", fontWeight: 600, mb: 0.3 } }
                                >
                                    Structure preview
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={ {
                                        display: "block",
                                        fontFamily: "'JetBrains Mono', monospace",
                                        lineHeight: 1.5,
                                        overflowWrap: "break-word"
                                    } }
                                >
                                    { `{${buildStructureString()}}` }
                                </Typography>
                            </Box>
                        ) }
                    </>
                ) }
            </DialogContent>
            <Divider sx={ { borderColor: "grey.100" } } />
            <DialogActions sx={ { gap: 1, px: 2.5, py: 1.5 } }>
                <Button
                    onClick={ handleClose }
                    variant="outlined"
                    size="small"
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    Cancel
                </Button>
                <Button
                    onClick={ handleSubmit }
                    variant="contained"
                    size="small"
                    disabled={ !canSubmit }
                    data-componentid={ `${componentId}-submit-button` }
                >
                    { submitLabel }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEntryModal;
