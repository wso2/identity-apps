/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import FormControl, { FormControlProps } from "@oxygen-ui/react/FormControl";
import { URLInput, URLInputPropsInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import "./url-field-adapter.scss";

/**
 * Interface for the URLInputAdapter component.
 */
export interface URLInputAdapterPropsInterface
    extends FieldRenderProps<string, HTMLElement, string>,
        URLInputPropsInterface {
    /**
     * Form control props.
     */
    FormControlProps?: FormControlProps;
    /**
     * Callback to be fired on allowed origins change.
     */
    onAllowedOriginsChange?: (origins: string[]) => void;
}

/**
 * URLInputAdapter is a React Final Form adapter for the URLInput component.
 *
 * @param input - The input field props provided by React Final Form.
 * @param props - Additional props for the URLInput component.
 * @returns The rendered URLInput component.
 */
const URLInputAdapter: FunctionComponent<URLInputAdapterPropsInterface> = (
    props: URLInputAdapterPropsInterface
): ReactElement => {
    const {
        name,
        input,
        meta,
        labelName,
        label,
        allowedOrigins,
        onAllowedOriginsChange,
        validationErrorMsg,
        duplicateURLErrorMessage,
        validate,
        fullWidth = true,
        InputLabelProps,
        required,
        FormControlProps = {},
        ...rest
    } = props;

    const [ filteredAllowedCORSOrigins, setFilteredAllowedCORSOrigins ] = useState<string[]>([]);
    const [ newAllowedCORSOrigins, setNewAllowedCORSOrigins ] = useState<string[]>([]);

    /**
     * Use useEffect to update filteredAllowCORSOrigins when allowedOrigins changes.
     */
    useEffect(() => {
        // Check if allowedOrigins is available and not empty.
        if (allowedOrigins?.length > 0) {
            setFilteredAllowedCORSOrigins([ ...allowedOrigins ]);
        }
    }, [ allowedOrigins ]);


    /**
     * Get the moderated value of the input.
     *
     * @example
     * // When the input is a single value:
     * getModeratedValue("https://example.com/login");
     * // Result: "https://example.com/login"
     *
     * // When the input is an array of values:
     * getModeratedValue(["https://example.com/login", "https://app.example.com/login"]);
     * // Result: "https://example.com/login,https://app.example.com/login"
     *
     * // When the input is an empty array:
     * getModeratedValue([]);
     * // Result: ""
     *
     * @param value - The value of the input.
     * @returns The moderated value of the input.
     */
    const getModeratedValue = (value: string | string[]): string => {
        if (Array.isArray(value)) {
            if (value.length > 0) {
                return value.join(",");
            } else {
                return "";
            }
        }

        return value;
    };

    /**
     * Handles the removal of a CORS allowed origin.
     *
     * @param url - The origin to be removed.
     */
    const handleRemoveAllowOrigin = (url: string): void => {
        const updatedAllowedOrigins: string[] = filteredAllowedCORSOrigins.filter((origin: string) => origin !== url);

        setFilteredAllowedCORSOrigins(updatedAllowedOrigins);

        const updatedNewlyAddedOrigins: string[] = newAllowedCORSOrigins.filter((origin: string) => origin === url);

        setNewAllowedCORSOrigins(updatedNewlyAddedOrigins);
        onAllowedOriginsChange && onAllowedOriginsChange(updatedNewlyAddedOrigins);
    };

    /**
     * Handles the addition of a CORS allowed origin.
     *
     * @param url - The origin to be allowed.
     */
    const handleAddAllowOrigin = (url: string): void => {
        const updatedAllowedOrigins: string[] = [ ...filteredAllowedCORSOrigins, url ];

        setFilteredAllowedCORSOrigins(updatedAllowedOrigins);

        const updatedNewlyAddedOrigins: string[] = [ ...newAllowedCORSOrigins, url ];

        setNewAllowedCORSOrigins(updatedNewlyAddedOrigins);
        onAllowedOriginsChange && onAllowedOriginsChange(updatedNewlyAddedOrigins);
    };

    return (
        <FormControl fullWidth={ fullWidth } className="url-field-adapter" { ...FormControlProps }>
            { label && (
                <label htmlFor={ name } required={ required } className="oxygen-input-label" { ...InputLabelProps }>
                    { label }
                    <span aria-hidden="true" className="MuiFormLabel-asterisk MuiInputLabel-asterisk">
                        { " " }
                        *
                    </span>
                </label>
            ) }
            <URLInput
                labelEnabled
                id={ name }
                duplicateURLErrorMessage={ duplicateURLErrorMessage }
                labelName={ labelName }
                validationErrorMsg={ validationErrorMsg }
                validation={ (value: string) => {
                    if (validate) {
                        return !validate(value);
                    }

                    return true;
                } }
                urlState={ getModeratedValue(input.value) }
                setURLState={ input.onChange }
                required={ required }
                className="oxygen-url-field"
                allowedOrigins={ filteredAllowedCORSOrigins }
                handleAddAllowedOrigin={ handleAddAllowOrigin }
                handleRemoveAllowedOrigin={ handleRemoveAllowOrigin }
                { ...input }
                { ...rest }
            />
        </FormControl>
    );
};

URLInputAdapter.defaultProps = {
    InputLabelProps: {
        disableAnimation: true,
        shrink: false
    }
};

export default URLInputAdapter;
