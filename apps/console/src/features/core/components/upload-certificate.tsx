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

import { Certificate, TestableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { GenericIcon, Message } from "@wso2is/react-components";
import { KJUR, X509 } from "jsrsasign";
import * as forge from "node-forge";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Form, Icon, Segment, Tab, TextArea } from "semantic-ui-react";
import { getCertificateIllustrations } from "../configs";

// This is a polyfill to support `File.arrayBuffer()` in Safari and IE.
if ("File" in self) {
    File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer;
}
Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer;

function myArrayBuffer() {
    // this: File or Blob
    return new Promise<ArrayBuffer>((resolve) => {
        const fr = new FileReader();

        fr.onload = () => {
            resolve(fr.result as ArrayBuffer);
        };
        fr.readAsArrayBuffer(this);
    });
}

/**
 * The model of the object returned by the `convertFromPem()` function.
 */
interface PemCertificate {
    /**
     * The PEM string.
     */
    value: string;
    /**
     * The forge certificate object.
     */
    certificate: X509;
}

/**
 * Prop types of the `UploadCertificate` component.
 */
interface UploadCertificatePropsInterface extends TestableComponentInterface {
    /**
     * Submits this step.
     */
    submit: (
        data: Certificate,
        name: string,
        pem: string,
        fileDecoded: string,
        file: File,
        forgeCertificate: X509
    ) => void;
    /**
     * Triggers submit.
     */
    triggerSubmit: boolean;
    /**
     * The certificate alias.
     */
    nameData: string;
    /**
     * The textarea content.
     */
    pemData: string;
    /**
     * The decoded file content.
     */
    fileDecodedData: string;
    /**
     * The uploaded file.
     */
    fileData: File;
    /**
     * The forge certificate object.
     */
    forgeCertificateData: X509;
    /**
     * Hides the alias input.
     */
    hideAliasInput?: boolean;
    /**
     * Sets the visibility of the finish button.
     *
     * @param buttonState - Active state of the button.
     */
    setShowFinishButton?: (buttonState: boolean) => void;
}

/**
 * This is the first step of the import certificate wizard.
 * TODO: Move this to `@wso2is/react-components`.
 *
 * @param {UploadCertificatePropsInterface} props
 *
 * @returns {ReactElement}
 */
export const UploadCertificate: FunctionComponent<UploadCertificatePropsInterface> = (
    props: UploadCertificatePropsInterface
): ReactElement => {

    const {
        submit,
        triggerSubmit,
        nameData,
        pemData,
        fileDecodedData,
        fileData,
        forgeCertificateData,
        hideAliasInput,
        setShowFinishButton,
        [ "data-testid" ]: testId
    } = props;

    const [ name, setName ] = useState("");
    const [ file, setFile ] = useState<File>(null);
    const [ pem, setPem ] = useState("");
    const [ nameError, setNameError ] = useState(false);
    const [ fileError, setFileError ] = useState(false);
    const [ certEmpty, setCertEmpty ] = useState(false);
    const [ fileDecoded, setFileDecoded ] = useState("");
    const [ dragOver, setDragOver ] = useState(false);
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ dark, setDark ] = useState(false);
    const [ forgeCertificate, setForgeCertificate ] = useState<X509>(null);

    const fileUpload = useRef(null);
    const init = useRef(true);

    const { t } = useTranslation();


    /**
     * This checks if this isn't and the initial call and then submits.
     */
    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            onSubmit();
        }
    }, [ triggerSubmit ]);

    /**
     * Gets the alias from the wizard on coming back from the following step.
     */
    useEffect(() => {
        if (nameData) {
            setName(nameData);
        }
    }, [ nameData ]);

    /**
     * Gets the file from the wizard on coming back from the following step.
     */
    useEffect(() => {
        if (fileData) {
            setFile(fileData);
        }
    }, [ fileData ]);

    /**
     * Gets the decoded file data from the wizard on coming back from the following step.
     */
    useEffect(() => {
        if (fileDecoded) {
            setFileDecoded(fileDecodedData);
        }
    }, [ fileDecodedData ]);

    /**
     * The textarea content from the wizard on coming back from the following step.
     */
    useEffect(() => {
        if (pemData) {
            setPem(pemData);
        }
    }, [ pemData ]);

    /**
     * Sets no name error to false when a value for name is entered.
     */
    useEffect(() => {
        if (name) {
            setNameError(false);
        }
    }, [ name ]);

    /**
     * Sets file error to false when a new file is added.
     */
    useEffect(() => {
        if (file) {
            setFileError(false);
        }
    }, [ file ]);

    /**
     * Sets the visibility of the Finish button.
     */
    useEffect(() => {
        if (!setShowFinishButton) {
            return;
        }

        if (!file && !pem) {
            setShowFinishButton(false);
        } else {
            setShowFinishButton(true);
        }
    }, [ file, pem ]);

    /**
     * Gets the forge certificate data from the wizard on coming back from the following step.
     */
    useEffect(() => {
        if (forgeCertificateData) {
            setForgeCertificate(forgeCertificateData);
        }
    }, [ forgeCertificateData ]);

    /**
     * Gets the browser color scheme so that the color scheme of the textarea can be decided.
     */
    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme:dark)")?.matches) {
            setDark(true);
        }
        const callback = (e) => {
            if (e.matches) {
                setDark(true);
            } else {
                setDark(false);
            }
        };

        // Check to see if match media API is available with the browser.
        if (window.matchMedia("(prefers-color-scheme:dark)")?.addEventListener) {
            window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", callback);
        }

        return () => {
            // Check to see if match media API is available with the browser.
            if (window.matchMedia("(prefers-color-scheme:dark)")?.addEventListener) {
                window.matchMedia("(prefers-color-scheme:dark)").removeEventListener("change", callback);
            }
        };
    }, []);

    /**
     * Convert PEM string to forge certificate object.
     *
     * @param {string} pem The PEM string.
     *
     * @returns {PemCertificate} Object containing the stripped PEM string and the forge certificate.
     */
    const convertFromPem = (pem: string): PemCertificate => {
        const pemValue = CertificateManagementUtils.enclosePem(pem);

        try {
            const certificateForge = new X509().readCertFromPEM(pemValue);

            setForgeCertificate(certificateForge);

            return {
                certificate: certificateForge,
                value: CertificateManagementUtils.stripPem(pem)
            };
        } catch {
            try {
                const certificate = forge.pki.certificateFromPem(pemValue);
                const pem = forge.pki.certificateToPem(certificate);
                const cert = new X509();

                cert.readCertPEM(pem);

                return {
                    certificate: cert,
                    value: CertificateManagementUtils.stripPem(pem)
                };
            } catch (error) {
                setFileError(true);

                return null;
            }
        }
    };

    /**
     * Checks the certificate type and decodes appropriately.
     *
     * @param {File} file The File object.
     *
     * @returns {Promise<string>} A promise that resolves to the content of the file.
     */
    const checkCertType = (file: File): Promise<string> => {
        return file.arrayBuffer().then((value: ArrayBuffer) => {
            try {
                const hex = Array.prototype.map
                    .call(new Uint8Array(value), x => ("00" + x.toString(16)).slice(-2)).join("");
                const cert = new X509();

                cert.readCertHex(hex);
                const certificate = new KJUR.asn1.x509.Certificate(cert.getParam());
                const pem = certificate.getPEM();

                setForgeCertificate(cert);

                return Promise.resolve(CertificateManagementUtils.stripPem(pem));
            } catch {
                const byteString = forge.util.createBuffer(value);

                try {
                    const asn1 = forge.asn1.fromDer(byteString);
                    const certificate = forge.pki.certificateFromAsn1(asn1);
                    const pem = forge.pki.certificateToPem(certificate);
                    const cert = new X509();

                    cert.readCertPEM(pem);
                    setForgeCertificate(cert);

                    return Promise.resolve(CertificateManagementUtils.stripPem(pem));
                } catch {
                    try {
                        const cert = new X509();

                        cert.readCertPEM(byteString.data);
                        const certificate = new KJUR.asn1.x509.Certificate(cert.getParam());
                        const pem = certificate.getPEM();

                        setForgeCertificate(cert);

                        return Promise.resolve(CertificateManagementUtils.stripPem(pem));
                    } catch {
                        const certificate = forge.pki.certificateFromPem(byteString.data);
                        const pem = forge.pki.certificateToPem(certificate);
                        const cert = new X509();

                        cert.readCertPEM(pem);
                        setForgeCertificate(cert);

                        return Promise.resolve(CertificateManagementUtils.stripPem(pem));
                    }
                }
            }
        }).catch((error) => {
            return Promise.reject(error);
        });
    };

    /**
     * Submits the data to the wizard.
     */
    const onSubmit = (): void => {
        (!file && !pem) && setCertEmpty(true);
        const certificate = resolveCertificate();

        if (!hideAliasInput) {
            !name && setNameError(true);
            if (!name || (!file && !pem) || fileError || !certificate) {
                return;
            }
        } else {
            if ((!file && !pem) || fileError || !certificate) {
                return;
            }
        }

        let pemString;
        let certificateObject;

        if (typeof certificate === "string") {
            pemString = certificate;
            certificateObject = forgeCertificate;
        } else {
            pemString = certificate?.value;
            certificateObject = certificate.certificate;
        }

        const data: Certificate = {
            alias: name,
            certificate: pemString
        };

        submit(data, name, pem, fileDecoded, file, certificateObject);
    };

    /**
     * Decides which certificate to import when
     * both a file has been uploaded and text has been inserted.
     *
     * @returns {string | PemCertificate} The decoded string or an object containing it.
     */
    const resolveCertificate = (): string | PemCertificate => {
        if (fileDecoded && pem) {
            if (activeIndex === 0) {
                return fileDecoded;
            } else {
                return convertFromPem(pem);
            }
        } else {
            return fileDecoded || convertFromPem(pem);
        }
    };

    /**
     * The tab panes that display the drop zone and the textarea.
     */
    const panes = [
        {
            menuItem: t("console:manage.features.certificates.keystore.wizard.panes.upload"),
            render: () => (
                !file
                    ? (
                        <div
                            onDrop={ (event: React.DragEvent<HTMLDivElement>) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setDragOver(false);
                                if (event.dataTransfer.files[ 0 ]) {
                                    const file = event.dataTransfer.files[ 0 ];

                                    addFile(file);
                                }
                            }
                            }
                            onDragOver={ event => {
                                event.preventDefault();
                                event.stopPropagation();
                                setDragOver(true);
                            } }
                            onDragLeave={ () => {
                                setDragOver(false);
                            } }
                            data-testid={ `${ testId }-certificate-upload-dropzone` }
                        >
                            <Segment placeholder className={ `drop-zone ${dragOver ? "drag-over" : ""}` }>
                                <div className="certificate-upload-placeholder">
                                    <GenericIcon
                                        inline
                                        transparent
                                        size="mini"
                                        icon={ getCertificateIllustrations().uploadPlaceholder }
                                    />
                                    <p className="description">
                                        { t("console:manage.features.certificates." +
                                            "keystore.wizard.dropZone.description") }
                                    </p>
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
                                    { t("console:manage.features.certificates.keystore.wizard.dropZone.action") }
                                </Button>
                            </Segment>
                        </div >
                    )
                    : (
                        <Segment placeholder>
                            <Segment textAlign="center" basic>
                                <GenericIcon
                                    inline
                                    transparent
                                    size="auto"
                                    icon={ getCertificateIllustrations().file }
                                />
                                <p className="file-name">{ file.name }</p>
                                <Icon
                                    name="trash alternate"
                                    link
                                    onClick={ () => {
                                        setFile(null);
                                        setFileError(false);
                                        setFileDecoded("");
                                    } }
                                />
                            </Segment>
                        </Segment>
                    )
            )
        },
        {
            menuItem: t("console:manage.features.certificates.keystore.wizard.panes.paste"),
            render: () => (
                <Form>
                    <TextArea
                        rows={ 13 }
                        placeholder={ t("console:manage.features.certificates.keystore.wizard.pastePlaceholder") }
                        value={ pem }
                        onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setPem(event.target.value);
                            setCertEmpty(false);
                            setFileError(false);
                        } }
                        spellCheck={ false }
                        className={ `certificate-editor ${dark ? "dark" : "light"}` }
                        data-testid={ `${ testId }-certificate-content-textarea` }
                    />
                </Form>
            )
        }
    ];

    /**
     * Called when a file is added.
     * The file is decoded and saved to the state.
     *
     * @param {File} file The file to be added.
     */
    const addFile = (file: File): void => {
        checkCertType(file)?.then((value: string) => {
            setFile(file);
            setCertEmpty(false);
            setFileError(false);

            const fileName = file.name.split(".");

            // removes the file extension
            fileName.pop();
            !name && setName(fileName.join("."));
            setFileDecoded(value);
        }).catch(() => {
            setFileError(true);
        });
    };

    return (
        <>
            <input
                ref={ fileUpload }
                type="file"
                accept=".pem, .cer, .crt, .cert"
                hidden
                onChange={ (event) => {
                    const file: File = event.target.files[ 0 ];

                    event.target.value = null;
                    addFile(file);
                } }
                data-testid={ `${ testId }-file-upload-input` }
            />
            {
                !hideAliasInput && (
                    <>
                        <Form>
                            <Form.Input
                                fluid
                                type="text"
                                placeholder={ t("console:manage.features.certificates.keystore.forms.alias." +
                                    "placeholder") }
                                label={ t("console:manage.features.certificates.keystore.forms.alias.label") }
                                required={ true }
                                error={
                                    nameError
                                        ? {
                                            content: t("console:manage.features.certificates.keystore." +
                                                "forms.alias.requiredErrorMessage")
                                        }
                                        : false
                                }
                                value={ name }
                                onChange={ (event) => {
                                    setName(event.target.value);
                                } }
                                data-testid={ `${ testId }-alias-input` }
                            />
                        </Form>
                        <Divider hidden />
                    </>
                )
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
                data-testid={ `${ testId }-certificate-upload-tab` }
            />

            {
                (fileError || certEmpty) && (
                    <Message
                        type="error"
                        data-testid={ `${ testId }-error-message` }
                        content={
                            fileError
                                ? t("console:manage.features.certificates.keystore.errorCertificate")
                                : t("console:manage.features.certificates.keystore.errorEmpty")
                        }
                    />
                )
            }
        </>

    );
};

/**
 * Default props for the component.
 */
UploadCertificate.defaultProps = {
    "data-testid": "upload-certificate",
    hideAliasInput: false
};
