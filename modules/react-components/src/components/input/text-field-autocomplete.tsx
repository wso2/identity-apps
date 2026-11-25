/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import TextField, { TextFieldProps } from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ComponentProps, ComponentType, FunctionComponent, ReactElement, ReactNode } from "react";

type BaseAutocompleteProps = ComponentProps<typeof Autocomplete>;

interface TextFieldAutocompletePropsInterface extends Omit<BaseAutocompleteProps, "renderInput"> {
    autocompleteComponent?: ComponentType<BaseAutocompleteProps>;
    inputLabel?: ReactNode;
    textFieldProps: TextFieldProps & IdentifiableComponentInterface;
}

/**
 * Renders an autocomplete with a configurable Oxygen UI text field.
 *
 * @param props - Autocomplete and text field properties.
 * @returns The autocomplete control.
 */
export const TextFieldAutocomplete: FunctionComponent<TextFieldAutocompletePropsInterface> = ({
    autocompleteComponent: AutocompleteComponent = Autocomplete,
    inputLabel,
    textFieldProps,
    ...autocompleteProps
}: TextFieldAutocompletePropsInterface): ReactElement => (
    <AutocompleteComponent
        { ...autocompleteProps }
        renderInput={ (params: AutocompleteRenderInputParams): ReactElement => (
            <>
                { inputLabel }
                <TextField { ...params } { ...textFieldProps } />
            </>
        ) }
    />
);
