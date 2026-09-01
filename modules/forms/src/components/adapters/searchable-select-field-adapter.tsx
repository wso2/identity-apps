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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import InputLabel from "@oxygen-ui/react/InputLabel";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useMemo
} from "react";
import { FieldRenderProps } from "react-final-form";

import "./select-field-adapter.scss";

/**
 * Interface for the items passed as options.
 */
interface DropDownItemInterface {
    text: ReactNode;
    value: string;
}

/**
 * Props for the SearchableSelectFieldAdapter component.
 */
interface SearchableSelectFieldAdapterPropsInterface
    extends FieldRenderProps<string, HTMLElement, string>, IdentifiableComponentInterface {
    /**
     * The label to display above the field.
     */
    label: string;
    /**
     * Options list for the field.
     * @see DropDownItemInterface
     */
    options: DropDownItemInterface[];
    /**
     * Whether the field should take full width.
     * Defaults to true.
     */
    fullWidth?: boolean;
    /**
     * Whether the options are still being resolved.
     * Defaults to false.
     */
    loading?: boolean;
}

/**
 * Resolves the searchable text of an option.
 *
 * @param option - Option to resolve the label of.
 * @returns Label of the option.
 */
const getOptionText = (option: DropDownItemInterface): string =>
    typeof option?.text === "string" ? option.text : option?.value ?? "";

/**
 * A single select field adapter with type ahead filtering for use with React Final Form.
 * Unlike {@link AutocompleteFieldAdapter}, the form value stays the `value` of the selected
 * option instead of the option itself, which makes it a drop in replacement for
 * {@link SelectFieldAdapter} when the options have to be searchable.
 *
 * @param props - The component props.
 * @returns The rendered searchable select field component.
 */
const SearchableSelectFieldAdapter: FunctionComponent<SearchableSelectFieldAdapterPropsInterface> = (
    props: SearchableSelectFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        label,
        meta,
        fullWidth = true,
        placeholder,
        helperText,
        required,
        options,
        loading = false,
        readOnly = false,
        "data-componentid": componentId = "searchable-select-field-adapter"
    } = props;

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    /**
     * Option matching the current form value. Derived on every render so that asynchronously
     * resolved options and values are always reflected.
     */
    const selectedOption: DropDownItemInterface = useMemo(() => {
        if (!input.value) {
            return null;
        }

        return options?.find((option: DropDownItemInterface) => option.value === input.value) ?? null;
    }, [ options, input.value ]);

    return (
        <div className="select-field-adapter" data-componentid={ componentId }>
            <InputLabel htmlFor={ `${input.name}-input` } required={ required }>{ label }</InputLabel>
            <Autocomplete
                disablePortal
                size="small"
                fullWidth={ fullWidth }
                disabled={ readOnly }
                loading={ loading }
                options={ options ?? [] }
                value={ selectedOption }
                getOptionLabel={ getOptionText }
                isOptionEqualToValue={
                    (option: DropDownItemInterface, value: DropDownItemInterface) =>
                        option?.value === value?.value
                }
                onChange={ (_: SyntheticEvent, option: DropDownItemInterface) => {
                    input.onChange(option?.value ?? "");
                } }
                onBlur={ input.onBlur }
                onFocus={ input.onFocus }
                renderOption={ (
                    optionProps: HTMLAttributes<HTMLLIElement>,
                    option: DropDownItemInterface
                ) => (
                    <li { ...optionProps } key={ option.value }>
                        { option.text }
                    </li>
                ) }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        id={ `${input.name}-input` }
                        name={ input.name }
                        margin="dense"
                        placeholder={ placeholder }
                        error={ isError }
                        size="small"
                        variant="outlined"
                        fullWidth={ fullWidth }
                        InputProps={ {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    { loading && <CircularProgress color="inherit" size={ 16 } /> }
                                    { params.InputProps?.endAdornment }
                                </>
                            )
                        } }
                    />
                ) }
                data-componentid={ `${componentId}-input` }
            />
            { isError && (
                <FormHelperText data-componentid={ `${componentId}-error` } error>
                    { meta.error || meta.submitError }
                </FormHelperText>
            ) }
            { helperText && (
                <FormHelperText data-componentid={ `${componentId}-helper-text` }>{ helperText }</FormHelperText>
            ) }
        </div>
    );
};

export default SearchableSelectFieldAdapter;
