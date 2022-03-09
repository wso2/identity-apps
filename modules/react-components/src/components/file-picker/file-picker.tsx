/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { KJUR, X509 } from "jsrsasign";
import * as forge from "node-forge";
import React, { FC, PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";
import {
    Button,
    Divider,
    Icon,
    Message,
    Segment,
    SemanticICONS,
    SemanticShorthandItem,
    Tab,
    TabPaneProps,
    TextArea
} from "semantic-ui-react";
import { GenericIcon } from "../icon";

// TODO: Move polyfills to a generalized module.

// This is a polyfill to support `File.arrayBuffer()` in Safari and IE.
if ("File" in self) File.prototype.arrayBuffer = File.prototype.arrayBuffer || poly;
Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || poly;

function poly() {
    // this: File or Blob
    return new Promise<ArrayBuffer>((resolve) => {
        const fr = new FileReader();

        fr.onload = () => {
            resolve(fr.result as ArrayBuffer);
        };
        fr.readAsArrayBuffer(this);
    });
}

// Developer facing interfaces

export interface FilePickerProps extends IdentifiableComponentInterface {
    /**
     * The target strategy of this file picker. This
     * can take many forms depending on the use-case.
     */
    fileStrategy: PickerStrategy<any>;
    /**
     * The delegated event handler for the parent
     * component. This is called when each time file
     * drag & drop, file input, or content changes.
     * This has no debounce time and will be called
     * immediately.
     *
     * @param result {PickerResult} data.
     */
    onChange: (result: PickerResult<any>) => void;
    /**
     * In the dropzone we can explain what types of file
     * and some descriptive info about the required file.
     */
    dropzoneText?: string;
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
    uploadButtonText?: string;
    /**
     * Please refer {@link GenericIcon} for specific sub
     * attributes. Usually it can be SVG, Semantic UI icon
     * class, or a <Icon> component. The {@link icon} and
     * {@link placeholderIcon} are two different icons.
     *
     * 1) {@link icon} will render once a file has been selected
     *    or dragged on to the area.
     *
     * 2) {@link placeholderIcon} will render when the placeholder
     *    area is active. Usually this can be a plain icon.
     */
    icon?: SemanticICONS | Icon | SVGElement | string | any;
    placeholderIcon?: SemanticICONS | Icon | SVGElement | string | any;
    /**
     * A prop that accepts a file by default. This file will
     * be the initial state for the picker. Behaviour is same
     * as {@link pastedContent}.
     */
    file?: File | null;
    /**
     * A prop that accepts a raw string by default. The raw value
     * should be bind to the form and the api consumer can specify
     * whether to fire the initial values via {@link onChange}
     * callback.
     */
    pastedContent?: string | null;
    /**
     * By enabling this you can always guarantee that a field value
     * remove operation (either file or pasted content) will provide
     * the subsequent serialized value of the next available value
     * or none at all.
     *
     * Say for example: A user can upload a certificate or paste the PEM
     * string in the textarea. First, user will switch to "Paste" tab
     * and paste the value. Now component will propagate the change
     * to parent with {@link PickerResult}. However, then the user switch
     * to "Upload" tab and uploads a different file. Once again component
     * will propagate those change to parent. However, if the user remove
     * a certain input value we need a way to show what input is being
     * used in the form.
     *
     * This property ensures the value that gets saved to the state,
     * propagate, and also visually represent in the form which input
     * is being used.
     */
    normalizeStateOnRemoveOperations?: boolean;
    /**
     * Hide selection taps & paste section.
     */
    hidePasteOption?: boolean;
    /**
     * Trigger empty file error.
     */
    emptyFileError?: boolean;
    /**
     * Empty file message.
     */
    emptyFileErrorMsg?: string;
}

// Internal workings interfaces, type defs, and aliases.

interface PaneItem {
    pane?: SemanticShorthandItem<TabPaneProps>;
    menuItem?: any;
    render?: () => React.ReactNode;
}

type FilePickerPropsAlias = PropsWithChildren<FilePickerProps>;

// Component constants

const FIRST_FILE_INDEX = 0;
const FIRST_TAB_INDEX = 0;
const SECOND_TAB_INDEX = 1;
const EMPTY_STRING = "";

export const FilePicker: FC<FilePickerProps> = (props: FilePickerPropsAlias): ReactElement => {

    const {
        fileStrategy,
        onChange,
        dropzoneText,
        pasteAreaPlaceholderText,
        uploadButtonText,
        icon,
        placeholderIcon,
        file: initialFile,
        pastedContent: initialPastedContent,
        normalizeStateOnRemoveOperations,
        emptyFileError,
        emptyFileErrorMsg,
        hidePasteOption,
        [ "data-componentid" ]: componentId
    } = props;

    // Document queries
    const hiddenFileUploadInput = useRef<HTMLInputElement>(null);

    // Functional State
    const [ dark, setDark ] = useState(false);
    const [ activeIndex, setActiveIndex ] = useState(FIRST_TAB_INDEX);
    const [ dragOver, setDragOver ] = useState(false);

    // Behavioural State
    const [ file, setFile ] = useState<File>(initialFile);
    const [ pastedContent, setPastedContent ] = useState<string>(initialPastedContent);
    const [ serializedData, setSerializedData ] = useState<any>(null);

    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>(null);
    const [ pasteFieldTouched, setPasteFieldTouched ] = useState<boolean>(false);
    const [ fileFieldTouched, setFileFieldTouched ] = useState<boolean>(false);

    // Hooks

    useEffect(() => {
        if (emptyFileError) {
            setHasError(true);
            setErrorMessage(emptyFileErrorMsg? emptyFileErrorMsg : "Please add a file");
        }
    },[ emptyFileError ]);

    useEffect(() => {
        if (initialFile) {
            addFileToState(initialFile);
            setActiveIndex(FIRST_TAB_INDEX);

            return;
        }
        if (initialPastedContent) {
            addPastedDataToState(initialPastedContent);
            setActiveIndex(SECOND_TAB_INDEX);

            return;
        }
    }, [ initialFile, initialPastedContent ]);

    useEffect(() => {
        // Query the preferred color scheme.
        const mql = window.matchMedia("(prefers-color-scheme:dark)");

        // Check and set the dark mode initially.
        if (mql?.matches) setDark(true);
        // Callback for triggering the same for change events.
        const triggerColorScheme = (event): void => {
            setDark(event.matches ?? false);
        };

        // Check to see if match media API is available with the browser.
        if (mql?.addEventListener) {
            mql.addEventListener("change", triggerColorScheme);
        }

        // Cleanup logic.
        return () => {
            if (mql?.addEventListener) {
                mql.removeEventListener("change", triggerColorScheme);
            }
        };
    }, []);

    useEffect(() => {
        if (onChange) {
            onChange({
                file: file,
                pastedContent: pastedContent,
                serialized: serializedData,
                /**
                 * In order result to be valid. Form should not contain errors,
                 * there should be some serialized content, and one of the used
                 * input methods. !! is equivalent to val !== null or Boolean(val)
                 */
                valid: !hasError && !!serializedData && (!!file || !!pastedContent)
            });
        }
    }, [ serializedData, errorMessage, file, pastedContent ]);

    // Functional logic that used by event handlers to
    // update the state of the picker.

    const validate = async (data: File | string): Promise<boolean> => {
        try {
            await fileStrategy.validate(data);
            setHasError(false);
            setErrorMessage(null);

            return true;
        } catch (error) {
            // Ideally the validation result must be type
            // ValidationResult. However, if for some reason
            // developer overrides it and just send a string
            // or a Error object we need to gracefully handle
            // the result.
            readDynamicErrorAndSetToState(error);

            return false;
        }
    };

    const readDynamicErrorAndSetToState = (error: any): void => {
        setHasError(true);
        if (error) {
            if (typeof error === "string") {
                setErrorMessage(error);
            } else if (error instanceof Error) {
                setErrorMessage(error?.message);
            } else if (isTypeValidationResult(error)) {
                setErrorMessage(error.errorMessage ?? EMPTY_STRING);
            } else {
                setErrorMessage("Your input has unknown errors.");
            }
        }
    };

    // TODO: As a improvement add multiple tabs option. The implementation
    //       of that is a little tricky. We can achieve the behaviour using
    //       the same strategy pattern but it MUST not complex the concrete
    //       implementation.

    // TODO: As a improvement implement the context component (this)
    //       to support multiple file upload/attach strategy. If attaching
    //       multiple then tabs Paste option should be removed dynamically.

    // TODO: As a improvement compare newly added file or the
    //       pasted content with the previous state and set it
    //       to the state only if its a new change.

    const addFileToState = async (file: File): Promise<void> => {
        if (await validate(file)) {
            setFile(file);

            try {
                setSerializedData(await fileStrategy.serialize(file));
            } catch (error) {
                readDynamicErrorAndSetToState(error);
            }
        }
    };

    const addPastedDataToState = async (text: string): Promise<void> => {
        if (await validate(text)) {
            try {
                setSerializedData(await fileStrategy.serialize(text));
            } catch (error) {
                readDynamicErrorAndSetToState(error);
            }
        }
        setPastedContent(text);
    };

    // Events that takes care of the drag drop input. User drops
    // a file onto the drop area.

    const handleOnDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setDragOver(false);
        if (event.dataTransfer.files[ FIRST_FILE_INDEX ]) {
            const file = event.dataTransfer.files[ FIRST_FILE_INDEX ];

            if (file) {
                addFileToState(file);
                setFileFieldTouched(true);
                setPasteFieldTouched(false);
            } else {
                setFile(null);
            }
        }
    };

    const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setDragOver(true);
    };

    const handleOnDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setDragOver(false);
    };

    // Events that takes care of the manual input. Where the user
    // clicks the upload button and related file input field changes.

    const handleOnFileInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file: File = event.target.files[ FIRST_FILE_INDEX ];

        event.target.value = null;
        addFileToState(file);
        setFileFieldTouched(true);
        setPasteFieldTouched(false);
    };

    const handleOnUploadButtonClick = (event: React.MouseEvent): void => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        hiddenFileUploadInput.current.click();
    };

    /**
     * Once the selected file gets removed. We need to re-evaluate
     * the pasted content properly to send the serialized value to
     * the parent component. This is because the values can differ
     * in both the inputs and can lead to data inconsistencies if
     * not handled properly.
     */
    const normalizeSerializationOnFileRemoval = (): void => {
        if (pastedContent) {
            addPastedDataToState(pastedContent);
            setActiveIndex(SECOND_TAB_INDEX);
        } else {
            setSerializedData(null);
        }
    };

    /**
     * This should be used when the user removed the entire string
     * from the textarea. Same as above {@link normalizeSerializationOnFileRemoval}
     * scenario we need to re-evaluate the selected file properly and set
     * the serialized value to the parent component since two inputs can
     * have different values simultaneously.
     */
    const normalizeSerializationOnPastedTextClear = (): void => {
        if (file) {
            addFileToState(file);
            setActiveIndex(FIRST_TAB_INDEX);
        } else {
            setSerializedData(null);
        }
    };

    // UI elements and render()

    const dragOption: PaneItem = {
        menuItem: "Upload",
        render: () => {
            const previewPlaceholder = (
                <Segment placeholder>
                    <Segment textAlign="center" basic>
                        <GenericIcon
                            inline
                            transparent
                            size="auto"
                            icon={ placeholderIcon }
                        />
                        <p>You have selected <em className="file-name">{ file?.name }</em> file</p>
                        <p>Not this file?</p>
                        <Button
                            inverted
                            color="red"
                            onClick={ () => {
                                setFile(null);
                                setFileFieldTouched(false);
                                setErrorMessage(null);
                                setHasError(false);
                                if (normalizeStateOnRemoveOperations) {
                                    normalizeSerializationOnFileRemoval();
                                }
                            } }>
                            <Icon name="trash alternate"/> Remove
                        </Button>
                    </Segment>
                </Segment>
            );
            const dragDropArea = (
                <div
                    onDrop={ handleOnDrop }
                    onDragOver={ handleOnDragOver }
                    onDragLeave={ handleOnDragLeave }
                    data-testid={ "generic-file-upload-dropzone" }
                >
                    <Segment placeholder className={ `drop-zone ${ dragOver && "drag-over" }` }>
                        <div className="certificate-upload-placeholder">
                            <GenericIcon inline transparent size="mini" icon={ icon }/>
                            <p className="description">{ dropzoneText }</p>
                            <p className="description">– or –</p>
                        </div>
                        <Button basic primary onClick={ handleOnUploadButtonClick }>
                            { uploadButtonText }
                        </Button>
                    </Segment>
                </div>
            );

            return (file) ? previewPlaceholder : dragDropArea;
        }
    };

    const pasteOption: PaneItem = {
        menuItem: "Paste",
        render: () => {
            return (
                <TextArea
                    rows={ 10 }
                    placeholder={ pasteAreaPlaceholderText ?? "Paste your content in this area..." }
                    value={ pastedContent }
                    onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                        if (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        if (event?.target?.value) {
                            addPastedDataToState(event.target.value);
                        } else {
                            /**
                             * CLEAR OPERATION:
                             * This block executes when the user have cleared all the content
                             * from the textarea and we will evaluate it as a empty string.
                             */
                            setPastedContent(EMPTY_STRING);
                            /**
                             * If the string is empty we can't show error messages below the
                             * fields. Because, it's like the initial state.
                             */
                            setErrorMessage(null);
                            setHasError(false);
                            if (normalizeStateOnRemoveOperations) {
                                normalizeSerializationOnPastedTextClear();
                            }
                        }
                        setPasteFieldTouched(true);
                        setFileFieldTouched(false);
                    } }
                    spellCheck={ false }
                    className={ `certificate-editor ${ dark ? "dark" : "light" }` }
                />
            );
        }
    };

    return (
        <React.Fragment>
            <input
                hidden
                ref={ hiddenFileUploadInput }
                type="file"
                accept={ fileStrategy.mimeTypes.join(",") }
                onChange={ handleOnFileInputChange }
                data-componentid={ `${ componentId }-input` }
            />
            { /*TODO: Improvement*/ }
            { /*A dynamic input should be placed here so that we can*/ }
            { /*take a preferred file name for the picked file. */ }
            {
                !hidePasteOption
                    ? (
                        <Tab
                            className="tabs resource-tabs"
                            menu={ { pointing: true, secondary: true } }
                            panes={ [ dragOption, pasteOption ] }
                            activeIndex={ activeIndex }
                            data-componentid={ `${ componentId }-tabs` }
                            onTabChange={ (event, { activeIndex }) => {
                                const index = parseInt(activeIndex.toString());

                                setActiveIndex(index);
                                if (index === FIRST_TAB_INDEX && fileFieldTouched && !pastedContent) {
                                    validate(file);
                                } else if (index === SECOND_TAB_INDEX && pasteFieldTouched && !file) {
                                    validate(pastedContent);
                                }
                            } }
                        />
                    )
                    : (
                        <>
                            <Divider hidden/>
                            { dragOption.render() }
                        </>
                    )
            }
            {
                <Message
                    error
                    visible={ hasError }
                    data-testid={ "file-picker-error-message" }
                    data-componentid={ `${ componentId }-error-message` }
                >
                    <Icon name="file"/>
                    { errorMessage }
                </Message>
            }
        </React.Fragment>
    );

};

FilePicker.defaultProps = {
    "data-componentid": "file-picker",
    hidePasteOption: false
};

/**
 * Re-usable and pluggable file strategies for the component. The context of these
 * different strategies is the FilePicker component itself. It makes the FilePicker
 * dynamic on handling the file specific logic. You can implement different
 * strategies for each use-case or use the available ones.
 */

export interface PickerResult<T> {
    file?: File;
    pastedContent?: string;
    serialized?: T | any;
    valid?: boolean;
}

export interface PickerStrategy<T> {
    /**
     * Should contain the logic to validate a attached file or
     * the pasted text into the text area. For example, you can
     * validate the type, size, name, and the expected content
     * if applicable.
     *
     * @param data {File | string} uploaded file or the pasted text.
     */
    validate: (data: File | string) => Promise<ValidationResult>;
    /**
     * The associated mime-types for the target file.
     * This will be used in the {@link HTMLInputElement.accept}
     * attribute to specify the allowed ones in the interface.
     *
     * file_extension   [.gif, .jpg, .png, .doc .pem, .cert]
     * audio/*          All audio file types.
     * video/*          All video file types.
     * image/*          All image file types.
     *
     * Or just specify the exact mime type:
     * {@link https://www.iana.org/assignments/media-types/media-types.xhtml}
     */
    mimeTypes: string[];
    /**
     * Serialize the uploaded file / pasted text to a more primitive
     * representation. You can return an empty string if there's
     * no post-processing logic to your use-case.
     *
     * @param data {File | string} uploaded file or pasted text.
     */
    serialize: (data: File | string) => Promise<T>;
}

// Validation stuff.

interface ValidationResult {
    valid: boolean;
    errorMessage?: string | undefined | null;
}

function isTypeValidationResult(obj: any): boolean {
    return obj && ("valid" in obj || "errorMessage" in obj);
}

// Concrete strategies implementations.

export class DefaultFileStrategy implements PickerStrategy<string> {

    mimeTypes: string[];

    constructor() {
        this.mimeTypes = [ "*" ];
    }

    async serialize(): Promise<string> {
        return Promise.resolve("");
    }

    async validate(): Promise<ValidationResult> {
        return Promise.resolve({ valid: true });
    }

}

export class XMLFileStrategy implements PickerStrategy<string> {

    static readonly ENCODING: string = "UTF-8";
    static readonly DEFAULT_MIMES: string[] = [
        "text/xml",
        "application/xml"
    ];

    static readonly MEGABYTE: number = 1e+6;
    static readonly MAX_FILE_SIZE: number = 3 * XMLFileStrategy.MEGABYTE;

    mimeTypes: string[];

    constructor(mimeTypes?: string[]) {
        if (!mimeTypes || mimeTypes.length === 0)
            this.mimeTypes = XMLFileStrategy.DEFAULT_MIMES;
        else
            this.mimeTypes = mimeTypes;
    }

    async serialize(data: File | string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!data) {
                reject({ valid: false });

                return;
            }
            if (data instanceof File) {
                const reader = new FileReader();

                reader.readAsText(data, XMLFileStrategy.ENCODING);
                reader.onload = () => {
                    this.parseXML(reader.result).then((rawXML) => {
                        resolve(btoa(rawXML));
                    }).catch((error) => {
                        reject({
                            errorMessage: error ?? "XML file content is invalid",
                            valid: false
                        });
                    });
                };
            } else {
                this.parseXML(data).then((rawXML) => {
                    resolve(btoa(rawXML));
                }).catch((error) => {
                    reject({
                        errorMessage: error ?? "XML string is invalid",
                        valid: false
                    });
                });
            }
        });
    }

    async validate(data: File | string): Promise<ValidationResult> {
        return new Promise<ValidationResult>((resolve, reject) => {
            if (data instanceof File) {
                const expected = XMLFileStrategy.MAX_FILE_SIZE * XMLFileStrategy.MEGABYTE;

                if ((data as File).size > expected) {
                    reject({
                        errorMessage: `File exceeds max size of ${ XMLFileStrategy.MAX_FILE_SIZE } MB`,
                        valid: false
                    });
                }
                const reader = new FileReader();

                reader.readAsText(data, XMLFileStrategy.ENCODING);
                reader.onload = () => {
                    this.parseXML(reader.result).then(() => {
                        resolve({ valid: true });
                    }).catch((error) => {
                        reject({
                            errorMessage: error ?? "XML file has errors",
                            valid: false
                        });
                    });
                };
            } else {
                this.parseXML(data).then(() => {
                    resolve({ valid: true });
                }).catch((error) => {
                    reject({
                        errorMessage: error ?? "XML string has errors",
                        valid: false
                    });
                });
            }
        });
    }

    async parseXML(xml: string | ArrayBuffer): Promise<string> {
        const domParser = new DOMParser();

        // If the xml is a instance of ArrayBuffer then first
        // convert it to a primitive string.
        if (xml instanceof ArrayBuffer) {
            // TODO: Add the polyfills for IE and older browsers.
            // https://github.com/inexorabletash/text-encoding
            const enc = new TextDecoder(XMLFileStrategy.ENCODING);
            const arr = new Uint8Array(xml);

            xml = enc.decode(arr);
        }
        // Below this point we can ensure that xml is
        // a string type and proceed to parse.
        const dom = domParser.parseFromString(xml, "text/xml");

        if (dom.getElementsByTagName("parsererror").length > 0) {
            throw "Error while parsing XML file";
        }

        return xml;
    }

}

export interface CertificateDecodeResult {
    forgeObject: any;
    pem: string;
    pemStripped: string;
}

export class CertFileStrategy implements PickerStrategy<CertificateDecodeResult> {

    static readonly DEFAULT_MIMES: string[] = [
        ".pem", ".cer", ".crt", ".cert"
    ];

    mimeTypes: string[];

    constructor(mimeTypes?: string[]) {
        if (!mimeTypes || mimeTypes.length === 0)
            this.mimeTypes = CertFileStrategy.DEFAULT_MIMES;
        else
            this.mimeTypes = mimeTypes;
    }

    serialize(data: File | string): Promise<CertificateDecodeResult> {
        if (data instanceof File) {
            return this.convertFromFile(data);
        } else {
            return this.convertFromString(data);
        }
    }

    validate(data: File | string): Promise<ValidationResult> {
        return new Promise((resolve, reject) => {
            if (data instanceof File) {
                this.convertFromFile(data).then(() => {
                    resolve({ valid: true });
                }).catch(() => {
                    reject({
                        errorMessage: "Invalid certificate file. " +
                            "Please use one of the following formats " +
                            this.mimeTypes.join(","),
                        valid: false
                    });
                });
            } else {
                this.convertFromString(data).then(() => {
                    resolve({ valid: true });
                }).catch(() => {
                    reject({
                        errorMessage: "Invalid certificate pem string.",
                        valid: false
                    });
                });
            }
        });
    }

    convertFromString(text: string): Promise<CertificateDecodeResult> {
        return new Promise<CertificateDecodeResult>((resolve, reject) => {
            try {
                const certificateForge = new X509().readCertFromPEM(text);

                resolve({
                    forgeObject: certificateForge,
                    pem: text,
                    pemStripped: CertificateManagementUtils.stripPem(text)
                });
            } catch {
                try {
                    const pemValue = CertificateManagementUtils.enclosePem(text);
                    const certificate = forge.pki.certificateFromPem(pemValue);
                    const pem = forge.pki.certificateToPem(certificate);
                    const certificateForge = new X509();

                    certificateForge.readCertPEM(pem);
                    resolve({
                        forgeObject: certificateForge,
                        pem: text,
                        pemStripped: CertificateManagementUtils.stripPem(text)
                    });
                } catch (error) {
                    reject("Failed to decode pem certificate data.");
                }
            }
        });
    }

    convertFromFile(file: File): Promise<CertificateDecodeResult> {
        return new Promise((resolve, reject) => {
            file.arrayBuffer().then((buf: ArrayBuffer) => {
                try {
                    const hex = Array.prototype.map.call(
                        new Uint8Array(buf),
                        (x) => ("00" + x.toString(16)).slice(-2)
                    ).join("");
                    const cert = new X509();

                    cert.readCertHex(hex);
                    const certificate = new KJUR.asn1.x509.Certificate(cert.getParam());
                    const pem = certificate.getPEM();
                    const pemStripped = CertificateManagementUtils.stripPem(pem);

                    resolve({
                        forgeObject: cert,
                        pem: pem,
                        pemStripped: pemStripped
                    });
                } catch {
                    const byteString = forge.util.createBuffer(buf);

                    try {
                        const asn1 = forge.asn1.fromDer(byteString);
                        const certificate = forge.pki.certificateFromAsn1(asn1);
                        const pem = forge.pki.certificateToPem(certificate);
                        const cert = new X509();

                        cert.readCertPEM(pem);
                        const pemStripped = CertificateManagementUtils.stripPem(pem);

                        resolve({
                            forgeObject: cert,
                            pem: pem,
                            pemStripped: pemStripped
                        });
                    } catch {
                        try {
                            const cert = new X509();

                            cert.readCertPEM(byteString.data);
                            const certificate = new KJUR.asn1.x509.Certificate(cert.getParam());
                            const pem = certificate.getPEM();
                            const pemStripped = CertificateManagementUtils.stripPem(pem);

                            resolve({
                                forgeObject: cert,
                                pem: pem,
                                pemStripped: pemStripped
                            });
                        } catch {
                            try {
                                const certificate = forge.pki.certificateFromPem(byteString.data);
                                const pem = forge.pki.certificateToPem(certificate);
                                const cert = new X509();

                                cert.readCertPEM(pem);
                                const pemStripped = CertificateManagementUtils.stripPem(pem);

                                resolve({
                                    forgeObject: cert,
                                    pem: pem,
                                    pemStripped: pemStripped
                                });
                            } catch {
                                reject({
                                    errorMessage: "Certificate file has errors.",
                                    valid: false
                                });
                            }
                        }
                    }
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

}
