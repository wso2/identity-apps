/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { Button, Divider, Form, Icon, Message, Segment, Tab, TextArea } from "semantic-ui-react";

/**
 * Component to upload file and read the content.
 */
export interface FileUploadPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Dropzone placeholder icon.
     */
    dropzoneIcon?: ReactNode | any;
    /**
     * Method to update file state in parent component.
     */
    updateFile: (file: File) => void;
    /**
     * Method to update file name state in parent component.
     */
    updateFileName: (name: string) => void;
    /**
     * Method to update file content in parent component.
     */
    updateContent: (value: string) => void;
    /**
     * Method to update paste value in parent component.
     */
    updatePasteContent?: (value: string) => void;
    /**
     * Encode the file content or not.
     */
    encode?: boolean;
    /**
     * Initial file name.
     */
    initialName?: string;
    /**
     * Initial file.
     */
    initialFile?: File;
    /**
     * Initial paste value.
     */
    initialPasteValue?: string;
    /**
     * Initial file content.
     */
    initialContent?: string;
    /**
     * Trigger empty file error.
     */
    triggerEmptyFileError?: boolean;
    /**
     * File type that can be uploaded.
     */
    fileTypeToUpload?: string;
}

/**
 * Component to upload file and read the content.
 * TODO: Pass localized strings and remove the hardcoded text.
 *
 * @param {FileUploadPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}.
 */
export const FileUpload: FunctionComponent<FileUploadPropsInterface> = (
    props: FileUploadPropsInterface
): ReactElement => {

    const {
        dropzoneIcon: DropzoneIcon,
        initialName,
        initialFile,
        initialPasteValue,
        initialContent,
        updateFileName,
        updateFile,
        updateContent,
        updatePasteContent,
        encode,
        triggerEmptyFileError,
        fileTypeToUpload,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const [ name, setName ] = useState("");
    const [ file, setFile ] = useState<File>(null);
    const [ content, setContent ] = useState("");
    const [ pasteContent, setPasteContent ] = useState("");
    const [ encodedContent, setEncodedContent ] = useState("");

    const [ , setNameError ] = useState(false);
    const [ fileError, setFileError ] = useState(false);
    const [ , setEncodeError ] = useState(false);

    const [ dragOver, setDragOver ] = useState(false);
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ dark, setDark ] = useState(false);

    const fileUpload = useRef(null);
    const loadedInitValue = useRef(false);

    /**
     * Set initialValues.
     */
    useEffect(() => {
        if (initialName) {
            setName(initialName);
        }
    }, [ initialName ]);

    /**
     * Set initialValues.
     */
    useEffect(() => {
        if (initialFile) {
            setFile(initialFile);
        }
    }, [ initialFile ]);

    /**
     * Set initialValues.
     */
    useEffect(() => {
        if (initialName) {
            setName(initialName);
        }
        if (initialFile) {
            setFile(initialFile);
        }
        if (initialPasteValue) {
            setPasteContent(initialPasteValue);
        }
        if (!loadedInitValue.current) {
            loadedInitValue.current = true;
        }
        if (initialContent) {
            // Check if initial content is not equal to initial  paste content or not
            if (!(initialPasteValue && (
                (encode && ((initialContent) === btoa(initialPasteValue)))
                    || (!encode && (initialContent === initialPasteValue)))
            )) {
                if (encode) {
                    setEncodedContent(initialContent);

                    return;
                }
                setContent(initialContent);
            }
        }
    }, []);

    /**
     * Trigger file error.
     */
    useEffect(() => {
        if (triggerEmptyFileError) {
            setFileError(true);
        }
    }, [ triggerEmptyFileError ]);

    /**
     * Update file name.
     */
    useEffect(() => {
        if (name || loadedInitValue.current) {
            if (name) {
                setNameError(false);
            }
            updateFileName(name);
        }
    }, [ name ]);

    /***
     * Update file.
     */
    useEffect(() => {
        if (file || loadedInitValue.current) {
            if (file) {
                setFileError(false);
            }
            updateFile(file);
        }
    }, [ file ]);

    /**
     * Update content if encoded content is updated.
     */
    useEffect(() => {
        if (encode && (encodedContent || (loadedInitValue.current))) {
            updateContent(encodedContent);
        }
    }, [ encodedContent ]);

    /**
     * Update content if content is updated.
     */
    useEffect(() => {
        if (!encode && (content || (loadedInitValue.current))) {
            updateContent(content);
        }
    }, [ content ]);

    /**
     * Update content if paste content is updated.
     */
    useEffect(() => {
        if (pasteContent) {
            updatePasteContent(pasteContent);
            if (encode) {
                updateContent(btoa(pasteContent));

                return;
            }
            updateContent(pasteContent);
        } else {
            if (loadedInitValue.current) {
                updatePasteContent(pasteContent);
            }
        }
    }, [ pasteContent ]);

    /**
     * Update contents if paste value or file content removed.
     */
    useEffect(() => {
        const fileContent = encode ? encodedContent : content;
        const newPasteContent = encode ? btoa(pasteContent) : pasteContent;

        if (isEmpty(fileContent) && !isEmpty(newPasteContent)) {
            updateContent(newPasteContent);
        } else if (!isEmpty(fileContent) && isEmpty(newPasteContent)) {
            updateContent(fileContent);
        } else if (isEmpty(fileContent) && isEmpty(newPasteContent)) {
            updateContent("");
        }
    }, [ content, encodedContent, pasteContent ]);

    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme:dark)").matches) {
            setDark(true);
        }
        const callback = (e) => {
            if (e.matches) {
                setDark(true);
            } else {
                setDark(false);
            }
        };

        window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", callback);

        return () => {
            window.matchMedia("(prefers-color-scheme:dark)").removeEventListener("change", callback);
        };
    }, []);

    const panes = [
        {
            menuItem: "Upload",
            render: () => (
                !file
                    ? (
                        <div
                            onDrop={ (event: React.DragEvent<HTMLDivElement>) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setDragOver(false);
                                if (event.dataTransfer.files[0]) {
                                    const file = event.dataTransfer.files[0];

                                    addFile(file);
                                }
                            } }
                            onDragOver={ event => {
                                event.preventDefault();
                                event.stopPropagation();
                                setDragOver(true);
                            } }
                            onDragLeave={ () => {
                                setDragOver(false);
                            } }
                            data-componentid={ `${ componentId }-drop-zone` }
                            data-testid={ `${ testId }-drop-zone` }
                        >
                            <Segment placeholder className={ `drop-zone ${ dragOver ? "drag-over" : "" }` }>
                                <div className="certificate-upload-placeholder">
                                    <DropzoneIcon />
                                    <p className="description">Drag and drop file here</p>
                                    <p className="description">– or –</p>
                                </div>
                                <Button
                                    basic
                                    primary
                                    onClick={ (event) => {
                                        event.preventDefault();
                                        fileUpload.current.click();
                                    } }
                                >
                                    Upload
                                </Button>
                            </Segment>
                        </div>
                    )
                    : (
                        <Segment placeholder>
                            <Segment textAlign="center" basic>
                                <Icon name="file code outline" size="huge"/>
                                <p className="file-name">{ file.name }</p>
                                <Icon
                                    name="trash alternate"
                                    link
                                    onClick={ () => {
                                        setFile(null);
                                        setContent("");
                                        setEncodedContent("");
                                        setFileError(false);
                                    } }
                                />
                            </Segment>
                        </Segment>
                    )
            )
        },
        {
            menuItem: "Paste",
            render: () => (
                <Form>
                    <TextArea
                        rows={ 13 }
                        placeholder="Paste the content File"
                        value={ pasteContent }
                        onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setPasteContent(event.target.value);
                            setEncodeError(false);
                            setFileError(false);
                        } }
                        spellCheck={ false }
                        className={ `certificate-editor ${ dark ? "dark" : "light" }` }
                        data-componentid={ `${ componentId }-paste-content-textarea` }
                        data-testid={ `${ testId }-paste-content-textarea` }
                    />
                </Form>
            )
        }
    ];

    /**
     * Add the file.
     * @param file File to be added.
     */
    const addFile = (file: File): void => {
        setFile(file);
        setEncodeError(false);
        setFileError(false);
        const fileName = file.name.split(".");

        // removes the file extension
        fileName.pop();
        !name && setName(fileName.join("."));
        readFile(file);
    };

    const readFile = ((newFile: File) => {

        const reader = new FileReader();

        reader.readAsText(newFile);
        reader.onload = () => {
            setContent(reader.result as string);
            setEncodedContent(btoa(reader.result as string));
        };
    });

    return (
        <>
            <input
                ref={ fileUpload }
                type="file"
                accept={ fileTypeToUpload }
                hidden
                onChange={ (event) => {
                    const file: File = event.target.files[0];

                    event.target.value = null;
                    addFile(file);
                } }
                data-componentid={ componentId }
                data-testid={ testId }
            />
            {
                fileError
                    ? (
                        <Message negative attached="bottom">
                            <Message.Header> Either add a file or paste the content of the file</Message.Header>
                        </Message>
                    )
                    : <Divider hidden/>
            }
            <Tab
                className="tabs resource-tabs"
                menu={ {
                    pointing: true,
                    secondary: true
                } }
                panes={ panes }
                activeIndex={ activeIndex }
                onTabChange={ (event, { activeIndex }) => {
                    setActiveIndex(parseInt(activeIndex.toString()));
                } }
            />

        </>

    );
};

/**
 * Default props for the file upload component.
 */
FileUpload.defaultProps = {
    "data-componentid": "file-upload",
    "data-testid": "file-upload",
    encode: false,
    fileTypeToUpload: "text/xml"
};
