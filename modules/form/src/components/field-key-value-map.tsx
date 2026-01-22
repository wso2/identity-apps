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
import FormControl from "@oxygen-ui/react/FormControl";
import IconButton from "@oxygen-ui/react/IconButton";
import InputLabel from "@oxygen-ui/react/InputLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { PlusIcon, XMarkIcon } from "@oxygen-ui/react-icons";
import React, { ReactElement, ReactNode, useState } from "react";
import { Label } from "semantic-ui-react";

/**
 * Interface for the items passed as key options.
 */
interface DropDownItemInterface {
    text: ReactNode;
    value: string;
}
/**
 * Supported value types for key value map fields.
 */
export enum KeyValueMapValueFieldTypes {
    /**
     * Text value type.
     */
    TEXT = "text"
}

export interface KeyValueMapProps {
    /**
     * Full width flag.
     */
    fullWidth?: boolean;
    /**
     * Form control props.
     */
    FormControlProps?: {
        margin?: "dense" | "normal" | "none";
    };
    /**
     * Aria label for accessibility.
     */
    "aria-label"?: string;
    /**
     * Data component ID for testing.
     */
    "data-componentid"?: string;
    /**
     * Field name.
     */
    name: string;
    /**
     * Field label.
     */
    label: string;
    /**
     * Placeholder text.
     */
    placeholder?: string;
    /**
     * Read only flag.
     */
    readOnly?: boolean;
    /**
     * Required flag.
     */
    required?: boolean;
    /**
     * Name of the key.
     */
    keyName?: string;
    /**
     * Key options.
     */
    keyOptions: DropDownItemInterface[];
    /**
     * Value field type.
     */
    valuetype: KeyValueMapValueFieldTypes;
    /**
     * onChange callback from React Final Form.
     */
    onChange?: (value: Record<string, string>) => void;
    /**
     * Initial value from React Final Form.
     */
    value?: Record<string, string>;
}

export const KeyValueMapField = ({
    fullWidth = true,
    FormControlProps = {},
    "aria-label": ariaLabel,
    "data-componentid": dataComponentId = "key-value-map-field",
    name,
    label,
    placeholder,
    readOnly = false,
    required = false,
    valuetype,
    keyName,
    keyOptions,
    onChange,
    value
}: KeyValueMapProps): ReactElement => {

    const [selectedKey, setSelectedKey] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [keyValuePairs, setKeyValuePairs] = useState<{ key: string; value: string }[]>(() => {
        // Initialize from form value if provided
        if (value && typeof value === 'object') {
            return Object.entries(value)
                .filter(([_, val]) => val)
                .map(([key, val]) => ({ key, value: val as string }));
        }
        return [];
    });

    /**
     * Handles adding a new key-value pair.
     */
    const handleAddPair = (): void => {
        if (selectedKey && inputValue) {
            const updatedPairs: { key: string; value: string }[] = [...keyValuePairs, { key: selectedKey, value: inputValue }];
            
            setKeyValuePairs(updatedPairs);
            setSelectedKey("");
            setInputValue("");
            
            // Update form value
            if (onChange) {
                const formValue: Record<string, string> = {};
                
                updatedPairs.forEach(pair => {
                    formValue[pair.key] = pair.value;
                });
                onChange(formValue);
            }
        }
    };

    /**
     * Handles removing a key-value pair.
     */
    const handleRemovePair = (index: number): void => {
        const updatedPairs: { key: string; value: string }[] = [...keyValuePairs];

        updatedPairs.splice(index, 1);
        setKeyValuePairs(updatedPairs);
        
        // Update form value
        if (onChange) {
            const formValue: Record<string, string> = {};
            
            updatedPairs.forEach(pair => {
                formValue[pair.key] = pair.value;
            });
            onChange(formValue);
        }
    };

    return (
        <Box data-componentid={dataComponentId} aria-label={ariaLabel}>
            <InputLabel required={required} sx={{ mb: 1 }}>
                {label}
            </InputLabel>

            <Box display="flex" gap={1} mb={2} >
                <FormControl
                    size="small"
                    variant="outlined"
                    sx={{ minWidth: 200, maxWidth: 200 }}
                    disabled={readOnly}
                >
                    <Select
                        value={selectedKey}
                        onChange={(e) => setSelectedKey(e.target.value as string)}
                        displayEmpty
                        disabled={readOnly}
                        data-componentid={`${dataComponentId}-key-select`}
                    >
                        <MenuItem value="" disabled>
                            {`Select ${keyName ? keyName : "Key"}`}
                        </MenuItem>
                        {keyOptions
                            .filter(option => !keyValuePairs.some(pair => pair.key === option.value))
                            .map((option: DropDownItemInterface) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.text}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {valuetype == KeyValueMapValueFieldTypes.TEXT &&
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder={placeholder || ""}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={readOnly}
                            data-componentid={`${dataComponentId}-value-input`}
                        />
                    </Box>
                }

                <IconButton
                    onClick={handleAddPair}
                    disabled={readOnly || !selectedKey || !inputValue}
                    data-componentid={`${dataComponentId}-add-button`}
                    variant="contained"
                    sx={{ width: 40, height: 40 }}
                >
                    <PlusIcon />
                </IconButton>
            </Box>

            {keyValuePairs.length > 0 ? (
                <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    {keyValuePairs.map((pair: { key: string; value: string }, index: number) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            gap={1}
                            p={1}
                            bgcolor="grey.100"
                            borderRadius={1}
                            data-componentid={`${dataComponentId}-pair-${index}`}
                        >
                            <Box flex={1}>
                                <strong>{keyOptions.find(option => option.value === pair.key)?.text}:</strong> {pair.value}
                            </Box>
                            {!readOnly && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemovePair(index)}
                                    data-componentid={`${dataComponentId}-remove-${index}`}
                                >
                                    <XMarkIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Box>
            ) : (
                <Label
                    aria-label={`${label}-no-pairs-label`}
                    data-componentid={`${dataComponentId}-no-pairs-label`}
                >
                    {`No ${label} are added yet`}
                </Label>
            )}
        </Box>
    );
};