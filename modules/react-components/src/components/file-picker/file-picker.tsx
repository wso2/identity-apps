import React, { FC, PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";
import {
    Button, Form,
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
import { CertificateManagementUtils } from "@wso2is/core/dist/src/utils";
import { KJUR, X509 } from "jsrsasign";
import * as forge from "node-forge";

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

export interface FilePickerProps {
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
    onChange: (result: PickerResult) => void;
    /**
     * In the dropzone we can explain what types of file
     * and some descriptive info about the required file.
     */
    dropzoneText?: string;
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
}

export interface PickerResult {
    file?: File;
    pastedContent?: string;
    serialized?: any;
    valid?: boolean;
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
const EMPTY_STRING = "";

export const FilePicker: FC<FilePickerProps> = (props: FilePickerPropsAlias): ReactElement => {

    const {
        fileStrategy,
        onChange,
        dropzoneText,
        uploadButtonText,
        icon,
        placeholderIcon
    } = props;

    // Document queries
    const hiddenFileUploadInput = useRef<HTMLInputElement>(null);

    // Functional State
    const [ dark, setDark ] = useState(false);
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ dragOver, setDragOver ] = useState(false);

    // Behavioural State
    const [ file, setFile ] = useState<File>(null);
    const [ pastedContent, setPastedContent ] = useState<string>(null);
    const [ serializedData, setSerializedData ] = useState<any>(null);
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>(null);

    // Hooks

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
                valid: !hasError
            });
        }
    }, [ file, pastedContent ]);

    // Functional logic that used by event handlers to
    // update the state of the picker.

    const validate = async (data: File | string): Promise<boolean> => {
        try {
            await fileStrategy.validate(data); // Anonymous result
            setHasError(false);
            setErrorMessage(null);
            return true;
        } catch ({ errorMessage }) {
            setHasError(true);
            setErrorMessage(errorMessage);
            return false;
        }
    };

    // TODO: As a improvement implement the context component (this)
    //       to support multiple file upload/attach strategy. If attaching
    //       multiple then tabs Paste option should be removed dynamically.

    // TODO: As a improvement compare newly added file or the
    //       pasted content with the previous state and set it
    //       to the state only if its a new change.

    const addFileToState = async (file: File): Promise<void> => {
        await validate(file);
        setFile(file);
        try {
            setSerializedData(await fileStrategy.serialize(file));
        } catch ({ errorMessage }) {
            setHasError(true);
            setErrorMessage(errorMessage);
        }
    };

    const addPastedDataToState = async (text: string): Promise<void> => {
        await validate(text);
        setPastedContent(text);
        try {
            setSerializedData(await fileStrategy.serialize(text));
        } catch ({ errorMessage }) {
            setHasError(true);
            setErrorMessage(errorMessage);
        }
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
            }
        }
    }

    const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setDragOver(true);
    }

    const handleOnDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setDragOver(false);
    }

    // Events that takes care of the manual input. Where the user
    // clicks the upload button and related file input field changes.

    const handleOnFileInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file: File = event.target.files[ FIRST_FILE_INDEX ];
        event.target.value = null;
        addFileToState(file);
    };

    const handleOnUploadButtonClick = (event: React.MouseEvent): void => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        hiddenFileUploadInput.current.click();
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
                        <p className="file-name">{ file?.name }</p>
                        <Icon name="trash alternate" link onClick={ () => {
                            // Reset the data and errors back to defaults.
                            setFile(null);
                            setSerializedData(null);
                            setErrorMessage(null);
                            setHasError(false);
                        } }/>
                    </Segment>
                </Segment>
            );
            const dragDropArea = (
                <div
                    onDrop={ handleOnDrop }
                    onDragOver={ handleOnDragOver }
                    onDragLeave={ handleOnDragLeave }
                    data-testid={ `generic-file-upload-dropzone` }
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
                <Form>
                    <TextArea
                        rows={ 10 }
                        placeholder={ "Paste data in this area..." }
                        value={ pastedContent }
                        onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            if (event) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            addPastedDataToState(event.target.value ?? EMPTY_STRING);
                        } }
                        spellCheck={ false }
                        className={ `certificate-editor ${ dark ? "dark" : "light" }` }
                    />
                </Form>
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
            />
            { /*A dynamic input should be placed here so that we can*/ }
            { /*take a preferred file name for the picked file. */ }
            <Tab
                className="tabs resource-tabs"
                menu={ { pointing: true, secondary: true } }
                panes={ [ dragOption, pasteOption ] }
                activeIndex={ activeIndex }
                onTabChange={ (event, { activeIndex }) => {
                    setActiveIndex(parseInt(activeIndex.toString()));
                } }
            />
            {
                <Message
                    error
                    visible={ hasError }
                    attached="bottom"
                    data-testid={ `X-error-message` }
                >
                    <Icon name='file'/>
                    { errorMessage }
                </Message>
            }
        </React.Fragment>
    );

};

// Re-usable and pluggable file strategies for the component. The context of these
// different strategies is the FilePicker component itself. It makes the FilePicker
// dynamic on handling the file specific logic. You can implement different
// strategies for each use-case or use the available ones.

interface PickerStrategy<T> {
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

interface ValidationResult {
    valid: boolean;
    errorMessage?: string;
}

// Concrete strategies

export class DefaultFileStrategy implements PickerStrategy<string> {

    mimeTypes: string[];

    constructor() {
        this.mimeTypes = [ "*" ];
    }

    async serialize(data: File | string): Promise<string> {
        return Promise.resolve("");
    }

    async validate(data: File | string): Promise<ValidationResult> {
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

            if (data instanceof File) {
                const reader = new FileReader();
                reader.readAsText(data, XMLFileStrategy.ENCODING);
                reader.onload = () => {
                    this.parseXML(reader.result).then((rawXML) => {
                        resolve(btoa(
                            unescape(encodeURIComponent(rawXML))
                        ));
                    }).catch((error) => {
                        reject({
                            valid: false,
                            errorMessage: error ?? "XML file content is invalid"
                        });
                    });
                };
            } else {
                this.parseXML(data).then((rawXML) => {
                    resolve(btoa(
                        unescape(encodeURIComponent(rawXML))
                    ));
                }).catch((error) => {
                    reject({
                        valid: false,
                        errorMessage: error ?? "XML string is invalid"
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
                    return reject({
                        valid: false,
                        errorMessage: `File exceeds max size of ${ XMLFileStrategy.MAX_FILE_SIZE } MB`
                    });
                }
                const reader = new FileReader();
                reader.readAsText(data, XMLFileStrategy.ENCODING);
                reader.onload = () => {
                    this.parseXML(reader.result).then(() => {
                        resolve({ valid: true });
                    }).catch((error) => {
                        reject({
                            valid: false,
                            errorMessage: error ?? "XML file has errors"
                        });
                    });
                };
            } else {
                this.parseXML(data).then(() => {
                    resolve({ valid: true });
                }).catch((error) => {
                    reject({
                        valid: false,
                        errorMessage: error ?? "XML string has errors"
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
        const dom = domParser.parseFromString(xml, 'text/xml');
        if (dom.getElementsByTagName("parsererror").length > 0) {
            throw "Error while parsing XML file";
        }
        return xml;
    }

}

interface CertificateDecodeResult {
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

    async serialize(data: File | string): Promise<CertificateDecodeResult> {
        return new Promise<CertificateDecodeResult>((resolve, reject) => {
            if (data instanceof File) {
                return this.convertFromFile(data)
                    .then(resolve)
                    .catch(({ errorMessage }) => reject(errorMessage));
            } else {
                return this.convertFromString(data)
                    .then(resolve)
                    .catch(({ errorMessage }) => reject(errorMessage));
            }
        });
    }

    async validate(data: File | string): Promise<ValidationResult> {
        return new Promise((resolve, reject) => {
            if (data instanceof File) {
                this.convertFromFile(data).then((res) => {
                    resolve({ valid: true });
                }).catch(() => {
                    reject({
                        valid: false,
                        errorMessage: "Invalid certificate file. " +
                            "Please use one of the following formats " +
                            this.mimeTypes.join(",")
                    });
                });
            } else {
                this.convertFromString(data).then((res) => {
                    resolve({ valid: true });
                }).catch(() => {
                    reject({
                        valid: false,
                        errorMessage: "Invalid certificate pem string."
                    });
                });
            }
        });
    }

    async convertFromString(text: string): Promise<CertificateDecodeResult> {
        return new Promise<CertificateDecodeResult>((resolve, reject) => {
            try {
                const certificateForge = new X509().readCertFromPEM(text);
                return resolve({
                    forgeObject: certificateForge,
                    pemStripped: CertificateManagementUtils.stripPem(text),
                    pem: text
                });
            } catch {
                try {
                    const pemValue = CertificateManagementUtils.enclosePem(text);
                    const certificate = forge.pki.certificateFromPem(pemValue);
                    const pem = forge.pki.certificateToPem(certificate);
                    const certificateForge = new X509();
                    certificateForge.readCertPEM(pem);
                    return resolve({
                        forgeObject: certificateForge,
                        pemStripped: CertificateManagementUtils.stripPem(text),
                        pem: text
                    });
                } catch (error) {
                    reject("Failed to decode pem certificate data.");
                }
            }
        });
    }

    async convertFromFile(file: File): Promise<CertificateDecodeResult> {
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
                    return resolve({
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
                        return resolve({
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
                            return resolve({
                                forgeObject: cert,
                                pem: pem,
                                pemStripped: pemStripped
                            });
                        } catch {
                            const certificate = forge.pki.certificateFromPem(byteString.data);
                            const pem = forge.pki.certificateToPem(certificate);
                            const cert = new X509();
                            cert.readCertPEM(pem);
                            const pemStripped = CertificateManagementUtils.stripPem(pem);
                            return resolve({
                                forgeObject: cert,
                                pem: pem,
                                pemStripped: pemStripped
                            });
                        }
                    }
                }
            }).catch((error) => {
                reject("Failed to decode certificate data");
            });
        });
    }

}
