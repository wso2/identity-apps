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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Button, Input } from "semantic-ui-react";
import "./edit-input-field.scss";

/**
 * Editable input field props.
 */
export interface EditInputFieldPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Input value.
     */
    value: string;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Label of the input field.
     */
    label?: string;
    /**
     * Callback to handle value changes.
     */
    onChange?: (value: string) => void;
    /**
     * Placeholder value.
     */
    placeholder?: string;
    /**
     * Callback to validate the value.
     */
    validate?: (value: string) => boolean;
}

/**
 * Editable input field component.
 *
 * @param props - Props injected to the component.
 * @returns Edit Input Field Component.
 */

export const EditInputField: FunctionComponent<EditInputFieldPropsInterface> = (
    props: EditInputFieldPropsInterface
): ReactElement => {

    const {
        value,
        className,
        label,
        onChange,
        placeholder,
        validate,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames("edit-input", className);

    const inputRef = useRef<Input>(null);

    const [ isEditing, setIsEditing ] = useState<boolean>(false);
    const [ inputValue, setInputValue ] = useState<string>(value);

    /**
     * Synchronize `inputValue` with the `value` prop when it changes.
     */
    useEffect(() => {
        setInputValue(value);
    }, [ value ]);

    const handleEditClick = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        setInputValue(newValue);
        onChange?.(newValue);

        if (validate) {
            validate(newValue);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return (
        <Input
            label={ label }
            ref={ inputRef }
            value={ inputValue }
            placeholder={ placeholder }
            labelPosition="right"
            readOnly={ !isEditing }
            onChange={ handleInputChange }
            onBlur={ handleBlur }
            action={ (
                <Button
                    className="edit-input-action"
                    icon="edit"
                    type="button"
                    onClick={ handleEditClick }
                />
            ) }
            fluid
            className={ classes }
            data-componentid={ `${ componentId }-wrapper` }
            data-testid={ `${ testId }-wrapper` }
        />
    );
};

/**
 * Default proptypes for the edit input component.
 */
EditInputField.defaultProps = {
    "data-componentid": "edit-input",
    "data-testid": "edit-input"
};
