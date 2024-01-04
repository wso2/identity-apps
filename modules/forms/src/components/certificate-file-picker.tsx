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

import { FilePicker, PickerResult, XMLFileStrategy } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Form, InputOnChangeData } from "semantic-ui-react";

interface CertificateFilePickerPropsInterface {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FilePickerInterface {
    value: string;
}

export const CertificateFilePicker: FunctionComponent<CertificateFilePickerPropsInterface> = (
    props: CertificateFilePickerPropsInterface) => {

    const {
        value,
        onChange
    } = props;

    const QUERY_PARAMETER_SEPARATOR = " ";

    const [ certificateFilePickerValue, setCertificateFilePickerValue ] = useState<string>(null);
    const [ filePicker, setFilePicker ] = useState<FilePickerInterface[]>();

    const XML_FILE_PROCESSING_STRATEGY: XMLFileStrategy = new XMLFileStrategy();

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
        setCertificateFilePickerValue(filePicker?.value);
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
    }, [ certificateFilePickerValue ]);

    const handleQueryParameterAdd = () => {
        event.preventDefault();
        if (isEmpty(certificateFilePickerValue)) {
            return;
        }

        const output: FilePickerInterface[] = [ {
            value: certificateFilePickerValue
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
                    value={ certificateFilePickerValue }
                    focus
                    placeholder="name"
                    onChange={ (
                        event: React.ChangeEvent<HTMLInputElement>,
                        data: InputOnChangeData
                    ) => {
                        setCertificateFilePickerValue(data.value);
                    } }
                />
                {
                    (<div style={ { display: "block" } }>
                        <FilePicker
                            fileStrategy={ XML_FILE_PROCESSING_STRATEGY }
                            normalizeStateOnRemoveOperations={ true }
                            onChange={ (result: PickerResult<File>) => {
                                setCertificateFilePickerValue(result.serialized as string);
                                handleQueryParameterAdd();
                            } }
                            uploadButtonText="Upload Metadata File"
                            dropzoneText="Drag and drop a XML file here."
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
