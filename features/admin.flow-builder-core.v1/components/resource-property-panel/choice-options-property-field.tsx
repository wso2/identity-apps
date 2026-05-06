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
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { FieldOption } from "../../models/base";
import { Resource } from "../../models/resources";

/**
 * Props interface of {@link ChoiceOptionsPropertyField}
 */
export interface ChoiceOptionsPropertyFieldPropsInterface extends IdentifiableComponentInterface {
    /**
     * The resource associated with the property.
     */
    resource: Resource;
    /**
     * The list of options to render.
     */
    options: FieldOption[];
    /**
     * The event handler for the property change.
     * @param propertyKey - The key of the property.
     * @param newValue - The new value of the property.
     * @param resource - The resource associated with the property.
     */
    onChange: (propertyKey: string, newValue: any, resource: Resource) => void;
}

/**
 * Property field component that renders an editable list of radio button options.
 * Each option exposes a Label and a Value field. Options can be added and removed.
 *
 * @param props - Props injected to the component.
 * @returns The ChoiceOptionsPropertyField component.
 */
const ChoiceOptionsPropertyField: FunctionComponent<ChoiceOptionsPropertyFieldPropsInterface> = ({
    "data-componentid": componentId = "choice-options-property-field",
    resource,
    options,
    onChange
}: ChoiceOptionsPropertyFieldPropsInterface): ReactElement => {

    const handleOptionChange = (index: number, field: "label" | "value", newValue: string): void => {
        const updatedOptions: FieldOption[] = options.map((option: FieldOption, i: number) => {
            if (i === index) {
                // Keep key in sync with value so that keys remain unique and meaningful.
                return field === "value"
                    ? { ...option, key: newValue, value: newValue }
                    : { ...option, label: newValue };
            }

            return option;
        });

        onChange("config.options", updatedOptions, resource);
    };

    const handleAddOption = (): void => {
        const newIndex: number = options.length + 1;
        const newValue: string = `option${newIndex}`;
        const newOption: FieldOption = {
            key: newValue,
            label: `Option ${newIndex}`,
            value: newValue
        };

        onChange("config.options", [ ...options, newOption ], resource);
    };

    const handleRemoveOption = (index: number): void => {
        const updatedOptions: FieldOption[] = options.filter((_: FieldOption, i: number) => i !== index);

        onChange("config.options", updatedOptions, resource);
    };

    return (
        <Box data-componentid={ componentId }>
            <Typography variant="caption" color="textSecondary" sx={ { display: "block", mb: 0.5 } }>
                Options
            </Typography>
            { options.map((option: FieldOption, index: number) => (
                <Box
                    key={ index }
                    sx={ { alignItems: "center", display: "flex", gap: 1, mb: 1 } }
                    data-componentid={ `${componentId}-option-${index}` }
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Label"
                        defaultValue={ option.label }
                        onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                            handleOptionChange(index, "label", e.target.value)
                        }
                        data-componentid={ `${componentId}-option-${index}-label` }
                    />
                    <TextField
                        fullWidth
                        size="small"
                        label="Value"
                        defaultValue={ option.value }
                        onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                            handleOptionChange(index, "value", e.target.value)
                        }
                        data-componentid={ `${componentId}-option-${index}-value` }
                    />
                    <Tooltip title="Remove option">
                        <span>
                            <IconButton
                                size="small"
                                onClick={ () => handleRemoveOption(index) }
                                disabled={ options.length <= 1 }
                                aria-label="Remove option"
                                data-componentid={ `${componentId}-option-${index}-remove` }
                            >
                                <TrashIcon size={ 14 } />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            )) }
            <Button
                size="small"
                variant="text"
                startIcon={ <PlusIcon size={ 14 } /> }
                onClick={ handleAddOption }
                data-componentid={ `${componentId}-add-option` }
            >
                Add option
            </Button>
        </Box>
    );
};

export default ChoiceOptionsPropertyField;
