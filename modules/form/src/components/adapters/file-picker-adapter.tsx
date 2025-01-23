/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import { InputLabelProps } from "@oxygen-ui/react/InputLabel";
import {
    DefaultFileStrategy,
    FilePicker,
    JSONFileStrategy,
    PickerResult,
    PickerStrategy,
    XMLFileStrategy
} from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { FieldRenderProps } from "react-final-form";
import "./file-picker-adapter.scss";
import { Icon, SemanticICONS } from "semantic-ui-react";

/**
 * Supported file types for the FilePicker component.
 */
export enum SupportedFileTypes {
    DEFAULT = "default",
    XML = "xml",
    JSON = "json"
}

/**
 * File strategies for each supported file type.
 */
const FILE_STRATEGIES: { [ key in SupportedFileTypes ]: PickerStrategy<any> } = {
    default: new DefaultFileStrategy(),
    json: new JSONFileStrategy(),
    xml: new XMLFileStrategy()
};

/**
 * Interface for the FilePickerAdapter component.
 */
export interface FilePickerAdapterPropsInterface extends FieldRenderProps<string, HTMLElement, string> {
    /**
     * The label to display above the FilePicker.
     */
    label: string;
    /**
     * File type to be used in the FilePicker component.
     */
    fileType: SupportedFileTypes;
    /**
     * In the dropzone we can explain what types of file
     * and some descriptive info about the required file.
     */
    dropzoneText: string;
    /**
     * This is the placeholder text for paste tab content
     * area. By default this has a value like the following:-
     * "Paste your content in this area..."
     */
    pasteAreaPlaceholderText?: string;
    /**
     * The manual upload button text. This button is
     * placed beneath the description.
     */
    uploadButtonText: string;
    /**
     * Hide selection tabs & paste section.
     */
    hidePasteOption?: boolean;
    /**
     * Form control props.
     */
    FormControlProps?: FormControlProps;
    /**
     * Props for the input label component.
     */
    InputLabelProps?: InputLabelProps;
    /**
     * Whether the FilePicker should take full width.
     */
    fullWidth?: boolean;
    /**
     * Indicates whether the field is required.
     */
    required?: boolean;
    /**
     * Helper text for the input field.
     */
    helperText: string;
    /**
     * Placeholder icon for the file picker.
     */
    placeholderIcon?: SemanticICONS | Icon | SVGElement | string | any;
    /**
     * Icon displayed after selecting the file.
     */
    selectedIcon?: SemanticICONS | Icon | SVGElement | string | any;
    /**
     * Show the file list.
     */
    showFileAsList?: boolean;

    fileDisplayName?: string;

    onDelete?: () => void;
}

/**
 * FilePickerAdapter is a React Final Form adapter for the FilePicker component.
 *
 * @param props - Props for the FilePickerAdapter component.
 * @returns The rendered FilePickerAdapter component.
 */
const FilePickerAdapter: FunctionComponent<FilePickerAdapterPropsInterface> = ({
    name,
    input,
    meta,
    label,
    fileType,
    dropzoneText,
    pasteAreaPlaceholderText,
    uploadButtonText,
    fullWidth = true,
    InputLabelProps = {
        disableAnimation: true,
        shrink: false
    },
    required,
    helperText,
    hidePasteOption,
    placeholderIcon,
    selectedIcon,
    showFileAsList,
    fileDisplayName,
    FormControlProps = {},
    onDelete
}: FilePickerAdapterPropsInterface): ReactElement => {

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    const classes: string = classNames(
        "file-picker-adapter",
        {
            error: isError
        }
    );

    const file: File = useMemo(() => {
        if (!meta?.initial) {
            return null;
        }
        const base64DecodeString: string = atob(meta?.initial);

        return new File([ base64DecodeString ], fileDisplayName, { type: FILE_STRATEGIES?.[fileType]?.mimeTypes[0] });
    }, [ meta?.initial ]);

    return (
        <FormControl fullWidth={ fullWidth } className={ classes } { ...FormControlProps }>
            { label && (
                <label htmlFor={ name } required={ required } className="oxygen-input-label" { ...InputLabelProps }>
                    { label }
                    <span aria-hidden="true" className="MuiFormLabel-asterisk MuiInputLabel-asterisk">
                        { " " }
                        *
                    </span>
                </label>
            ) }
            <FilePicker
                fileStrategy={ FILE_STRATEGIES?.[fileType] ?? FILE_STRATEGIES?.default }
                onChange={ (result: PickerResult<any>) => {
                    input.onChange(result?.serialized);
                } }
                dropzoneText={ dropzoneText }
                pasteAreaPlaceholderText={ pasteAreaPlaceholderText }
                uploadButtonText={ uploadButtonText }
                icon={ placeholderIcon }
                placeholderIcon={ selectedIcon }
                file={ file }
                normalizeStateOnRemoveOperations={ true }
                hidePasteOption={ hidePasteOption }
                showFileAsList={ showFileAsList }
                fileDisplayName={ fileDisplayName }
                onFileDelete={ onDelete }
            />
            { isError &&
                <FormHelperText className="helper-text" error>{ meta.error || meta.submitError }</FormHelperText> }
            { helperText && <FormHelperText className="helper-text">{ helperText }</FormHelperText> }
        </FormControl>
    );
};

export default FilePickerAdapter;
