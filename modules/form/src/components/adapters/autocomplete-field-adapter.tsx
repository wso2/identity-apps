/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, { AutocompleteProps, AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import { FormControlProps } from "@oxygen-ui/react/FormControl";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import InputLabel, { InputLabelProps } from "@oxygen-ui/react/InputLabel";
import TextField, { TextFieldProps } from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLProps, ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import InfiniteScroll from "react-infinite-scroll-component";
import "./autocomplete-field-adapter.scss";
import { Item } from "semantic-ui-react";

/**
 * Props interface of {@link AutocompleteFieldAdapter}
 */
export interface AutocompleteFieldAdapterPropsInterface
    extends FieldRenderProps<string, HTMLElement, string>,
        AutocompleteProps<unknown>,
        IdentifiableComponentInterface {
    /**
     * Form control props.
     */
    FormControlProps?: FormControlProps;
    /**
     * Props for the input element.
     */
    InputProps?: TextFieldProps;
    /**
     * Props for the input label.
     */
    InputLabelProps?: InputLabelProps;
    /**
     * Alias for `multiple` prop from `AutocompleteProps` since it's a reserved keyword in React Final Form.
     */
    multipleValues?: boolean;
    /**
     * Array of options.
     */
    options: ReadonlyArray<any>;
    /**
     * Flag indicating if there are more items to load.
     */
    hasMore?: boolean;
    /**
     * Callback to load more items when triggered.
     */
    loadMore?: () => void;
    /**
     * Callback to handle input changes.
     */
    handleInputChange?: () => void;
    /**
     * Callback to handle form changes.
     */
    handleOnChange?: () => void;
}

/**
 * A custom Autocomplete field adapter for the React Final Form library.
 * This adapter wraps a `@oxygen-ui/react` Autocomplete component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered Select component.
 */
const AutocompleteFieldAdapter: FunctionComponent<AutocompleteFieldAdapterPropsInterface> = (
    props: AutocompleteFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        meta,
        FormControlProps = {},
        InputProps = {},
        InputLabelProps = {},
        placeholder,
        options,
        fullWidth,
        required,
        helperText,
        label,
        multipleValues,
        hasMore = false,
        loadMore,
        handleInputChange,
        handleOnChange,
        ...rest
    } = props;

    const [ value, setValue ] = useState<unknown>(multipleValues ? [] : undefined);

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    /**
     * Loading component.
     */
    const loadingComponent = () => {
        return (
            <Item className="loading-component">
                <CircularProgress size={ 22 } className="list-item-loader"/>
                <Item.Content className="list-item-content"></Item.Content>
            </Item>
        );
    };

    /**
     * Custom listbox component with infinite scroll.
     */
    const customListboxComponent: (listboxProps: HTMLProps<HTMLDivElement>) => JSX.Element = useMemo(
        () => (listboxProps: HTMLProps<HTMLDivElement>) => (
            <InfiniteScroll
                dataLength={ options.length }
                next={ loadMore }
                hasMore={ hasMore }
                loader={ loadingComponent() }
                height={ options.length < 10 ? "auto" : 360 }
            >
                <div style={ { overflow: "visible" } } { ...listboxProps }/>
            </InfiniteScroll>
        ),
        [ options.length, loadMore, hasMore ]
    );

    return (
        <>
            <Autocomplete
                { ...input }
                disablePortal
                size="small"
                multiple={ multipleValues }
                value={ value }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <>
                        <InputLabel
                            disableAnimation
                            error={ isError }
                            htmlFor={ InputProps?.id ?? `${input.name}-input` }
                            shrink={ false }
                            required={ required }
                            { ...InputLabelProps }
                        >
                            { label }
                        </InputLabel>
                        { /* `autocomplete`, `capture`, etc. are not part of TextField API */ }
                        { /* TODO: Tracker: https://github.com/wso2/oxygen-ui/issues/292 */ }
                        { /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */ }
                        { /* @ts-ignore */ }
                        <TextField
                            { ...params }
                            id={ `${input.name}-input` }
                            margin="dense"
                            placeholder={ placeholder }
                            required={ required }
                            error={ isError }
                            size="small"
                            variant="outlined"
                            fullWidth={ fullWidth }
                            { ...InputProps }
                            { ...FormControlProps }
                        />
                        { isError && <FormHelperText error>{ meta.error || meta.submitError }</FormHelperText> }
                    </>
                ) }
                onChange={ (event: SyntheticEvent, value: any) => {
                    handleOnChange?.();
                    setValue(value);
                    input.onChange(value);
                } }
                options={ options }
                ListboxComponent={ hasMore ? customListboxComponent : undefined }
                onInputChange={ hasMore ? handleInputChange : undefined }
                { ...rest }
            />
            <FormHelperText id={ `${input.name}-helper-text` }>{ helperText }</FormHelperText>
        </>
    );
};

AutocompleteFieldAdapter.defaultProps = {
    fullWidth: true
};

export default AutocompleteFieldAdapter;
