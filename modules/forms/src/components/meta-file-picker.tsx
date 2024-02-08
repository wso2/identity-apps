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

import { FilePicker, PickerResult, PickerStrategy } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Form, InputOnChangeData } from "semantic-ui-react";

interface MetaFilePickerPropsInterface {
    value: string;
    fileStrategy: PickerStrategy<any>;
    uploadButtonText: string;
    dropzoneText: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FilePickerInterface {
    value: string;
}

export const MetaFilePicker: FunctionComponent<MetaFilePickerPropsInterface> = (
    props: MetaFilePickerPropsInterface) => {

    const {
        value,
        fileStrategy,
        uploadButtonText,
        dropzoneText,
        onChange
    } = props;

    const QUERY_PARAMETER_SEPARATOR = " ";

    const [ metaFilePickerValue, setMetaFilePickerValue ] = useState<string>(null);
    const [ filePicker, setFilePicker ] = useState<FilePickerInterface[]>();

    /**
     * Build query parameter object from the given string form.
     *
     * @param queryParameter - Query parameter in the string form.
     */
    const buildQueryParameter = (filePicker: string): FilePickerInterface => {
        return {
            value: filePicker
        };
    };

    /**
     * Build query parameter string value, from it's object form.
     */
    const buildQueryParameterString = (filePicker: FilePickerInterface) => filePicker.value;

    /**
     * Build query parameters string value, from it's object form.
     */
    const buildQueryParametersString = (filePicker: FilePickerInterface[]): string =>
        filePicker?.map(buildQueryParameterString)?.join(" ");

    /**
     * Trigger provided onChange handler with provided query parameters.
     *
     * @param filePicker - QueryParameters.
     * @param onChange - OnChange handler.
     */
    const fireOnChangeEvent = (
        filePicker: FilePickerInterface[],
        onChange: (event: React.ChangeEvent<HTMLInputElement>
    ) => void) => {

        onChange(
            {
                target: {
                    value: buildQueryParametersString(filePicker)
                }
            } as React.ChangeEvent<HTMLInputElement>
        );
    };

    /**
     * Update input field values for query parameter.
     *
     * @param queryParam - QueryParameter.
     */
    const updateQueryParameterInputFields = (filePicker: FilePickerInterface): void => {
        setMetaFilePickerValue(filePicker?.value);
    };

    /**
     * Called when `initialValue` is changed.
     */
    useEffect(() => {
        if (isEmpty(value)) {
            return;
        }

        setFilePicker(value.split(QUERY_PARAMETER_SEPARATOR)?.map(buildQueryParameter));
    }, [ value ]);

    /**
     * Called when `filePicker` is changed.
     */
    useEffect(() => {
        fireOnChangeEvent(filePicker, onChange);
    }, [ filePicker ]);

    useEffect(() => {
        handleQueryParameterAdd();
    }, [ metaFilePickerValue ]);

    const handleQueryParameterAdd = () => {
        event.preventDefault();
        if (isEmpty(metaFilePickerValue)) {
            return;
        }

        const output: FilePickerInterface[] = [ {
            value: metaFilePickerValue
        } ];

        filePicker?.forEach(function(queryParam) {
            const existing = output.filter((item) => {
                return item.value == queryParam.value;
            });

            if (existing.length) {
                return;
            } else {
                output.push(queryParam);
            }
        });

        setFilePicker(output);

        updateQueryParameterInputFields({
            value: ""
        });
    };

    return (
        <>
            <Form.Group style={ { display: "block" } }>
                <Form.Input
                    fluid
                    type="hidden"
                    value={ metaFilePickerValue }
                    focus
                    placeholder="name"
                    onChange={ (
                        event: React.ChangeEvent<HTMLInputElement>,
                        data: InputOnChangeData
                    ) => {
                        setMetaFilePickerValue(data.value);
                    } }
                />
                {
                    (<div style={ { display: "block" } }>
                        <FilePicker
                            fileStrategy={ fileStrategy }
                            normalizeStateOnRemoveOperations={ true }
                            onChange={ (result: PickerResult<File>) => {
                                setMetaFilePickerValue(result.serialized as string);
                                handleQueryParameterAdd();
                            } }
                            uploadButtonText={ uploadButtonText }
                            dropzoneText={ dropzoneText }
                            hidePasteOption
                            pasteAreaPlaceholderText="Paste metadata file in xml format."
                            icon={ null }
                            placeholderIcon={ null }
                            data-testid={ "form-wizard-meta-file-picker" }
                        />
                    </div>)
                }
            </Form.Group>
        </>
    );
};
