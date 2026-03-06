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
import Button from "@oxygen-ui/react/Button";
import FormControl from "@oxygen-ui/react/FormControl";
import InputLabel from "@oxygen-ui/react/InputLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { DataTable, EmptyPlaceholder, TableActionsInterface, TableColumnInterface } from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Label, SemanticICONS } from "semantic-ui-react";

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
    fullWidth: _fullWidth = true,
    FormControlProps: _FormControlProps = {},
    "aria-label": ariaLabel,
    "data-componentid": dataComponentId = "key-value-map-field",
    name: _name,
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

    const { t } = useTranslation();

    const [ selectedKey, setSelectedKey ] = useState<string>("");
    const [ inputValue, setInputValue ] = useState<string>("");
    const [ keyValuePairs, setKeyValuePairs ] = useState<{ key: string; value: string }[]>(() => {
        // Initialize from form value if provided
        if (value && typeof value === "object") {
            return Object.entries(value)
                .filter(([ _, val ]: [ string, string ]) => val)
                .map(([ key, val ]: [ string, string ]) => ({ key, value: val as string }));
        }

        return [];
    });

    useEffect(() => {
        // Update local state if form value changes externally
        if (value && typeof value === "object" && Object.keys(value).length > 0) {
            setKeyValuePairs(
                Object.entries(value)
                    .filter(([ _, val ]: [ string, string ]) => val)
                    .map(([ key, val ]: [ string, string ]) => ({ key, value: val as string }))
            );
        } else {
            // Clear the pairs when form is reset or value is empty
            setKeyValuePairs([]);
        }
    }, [ value ]);

    /**
     * Handles adding a new key-value pair.
     */
    const handleAddPair = (): void => {
        if (selectedKey && inputValue) {
            const updatedPairs: { key: string; value: string }[] = [
                ...keyValuePairs,
                { key: selectedKey, value: inputValue }
            ];

            setSelectedKey("");
            setInputValue("");

            // Update form value
            if (onChange) {
                const formValue: Record<string, string> = {};

                updatedPairs.forEach((pair: { key: string; value: string }) => {
                    formValue[pair.key] = pair.value;
                });
                onChange(formValue);
            }
        }
    };

    /**
     * Handles removing a key-value pair.
     */
    const handleRemovePair = (pair: { key: string; value: string }): void => {
        const updatedPairs: { key: string; value: string }[] = keyValuePairs.filter(
            (p: { key: string; value: string }) => p.key !== pair.key
        );

        // Update form value
        if (onChange) {
            if (updatedPairs.length === 0) {
                // Set to null when list is empty so required validation works
                onChange(null);
            } else {
                const formValue: Record<string, string> = {};

                updatedPairs.forEach((p: { key: string; value: string }) => {
                    formValue[p.key] = p.value;
                });
                onChange(formValue);
            }
        }
    };

    /**
     * Resolves data table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (readOnly) {
            return [];
        }

        return [
            {
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, pair: { key: string; value: string }): void => {
                    handleRemovePair(pair);
                },
                popupText: (): string => "Remove",
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "key",
                id: "key",
                key: "key",
                render: (pair: { key: string; value: string }): ReactNode => (
                    <Header as="h6" data-testid={ `${dataComponentId}-key-${pair.key}` }>
                        <Header.Content>
                            { keyOptions.find((option: DropDownItemInterface) => option.value === pair.key)?.text }
                        </Header.Content>
                    </Header>
                ),
                title: keyName || "Key",
                width: 2
            },
            {
                allowToggleVisibility: false,
                dataIndex: "value",
                id: "value",
                key: "value",
                render: (pair: { key: string; value: string }): ReactNode => (
                    <Header as="h6" data-testid={ `${dataComponentId}-value-${pair.key}` }>
                        <Header.Content>
                            <Label>
                                { pair.value }
                            </Label>
                        </Header.Content>
                    </Header>
                ),
                title: "Value"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: "",
                width: 1
            }
        ];
    };

    /**
     * Empty placeholder for the list.
     */
    const showPlaceholders = (): ReactElement => {
        if (keyValuePairs?.length === 0) {
            return (
                <EmptyPlaceholder
                    subtitle={ [ `No ${label} are added yet` ] }
                />
            );
        }

        return null;
    };

    return (
        <Box data-componentid={ dataComponentId } aria-label={ ariaLabel }>
            <InputLabel required={ required } sx={ { mb: 1.5 } }>
                { label }
            </InputLabel>

            <Box
                sx={ {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2
                } }
            >
                <Box
                    sx={ {
                        flex: "1 1 200px",
                        maxWidth: { sm: "250px", xs: "100%" },
                        minWidth: "200px"
                    } }
                >
                    <FormControl
                        fullWidth
                        size="small"
                        variant="outlined"
                        disabled={ readOnly }
                    >
                        <Select
                            value={ selectedKey }
                            onChange={ (e: SelectChangeEvent<string>) => setSelectedKey(e.target.value as string) }
                            displayEmpty
                            disabled={ readOnly }
                            data-componentid={ `${dataComponentId}-key-select` }
                        >
                            <MenuItem value="" disabled>
                                { `Select ${keyName ? keyName : "Key"}` }
                            </MenuItem>
                            { keyOptions
                                .filter((option: DropDownItemInterface) =>
                                    !keyValuePairs.some(
                                        (pair: { key: string; value: string }) => pair.key === option.value
                                    )
                                )
                                .map((option: DropDownItemInterface) => (
                                    <MenuItem key={ option.value } value={ option.value }>
                                        { option.text }
                                    </MenuItem>
                                )) }
                        </Select>
                    </FormControl>
                </Box>

                { valuetype == KeyValueMapValueFieldTypes.TEXT && (
                    <Box
                        sx={ {
                            flex: "1 1 300px",
                            minWidth: "200px"
                        } }
                    >
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder={ placeholder || "" }
                            value={ inputValue }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value) }
                            disabled={ readOnly }
                            data-componentid={ `${dataComponentId}-value-input` }
                        />
                    </Box>
                ) }

                <Box
                    sx={ {
                        flex: "0 1 auto",
                        minWidth: "100px"
                    } }
                >
                    <Button
                        onClick={ handleAddPair }
                        disabled={ readOnly || !selectedKey || !inputValue }
                        data-componentid={ `${dataComponentId}-add-button` }
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={ <PlusIcon /> }
                        fullWidth
                        sx={ { height: "40px" } }
                    >
                        { t("common:add") }
                    </Button>
                </Box>
            </Box>

            <Box
                p={ 2 }
                border="1px solid"
                borderColor="divider"
                borderRadius={ 1 }
                minHeight={ 60 }
                sx={ { overflowX: "auto" } }
            >

                <DataTable<{ key: string; value: string }>
                    className="key-value-map-table"
                    columnCount={ 3 }
                    loadingStateOptions={ {
                        count: 5,
                        imageType: "square"
                    } }
                    onRowClick={ () => null }
                    showHeader={ false }
                    placeholders={ showPlaceholders() }
                    transparent={ true }
                    data-testid={ dataComponentId }
                    actions={ resolveTableActions() }
                    columns={ resolveTableColumns() }
                    data={ keyValuePairs }
                />
            </Box>
        </Box>
    );
};
