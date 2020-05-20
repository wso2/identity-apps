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

import { TestableComponentInterface } from "@wso2is/core/models";
import * as forge from "node-forge";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Form, Icon, Message, Segment, Tab, TextArea } from "semantic-ui-react";
import { CertificateIllustrations } from "../../../configs";
import { CERTIFICATE_BEGIN, CERTIFICATE_END, END_LINE } from "../../../constants";
import { Certificate } from "../../../models";

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
    certificate: forge.pki.Certificate;
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
        forgeCertificate: forge.pki.Certificate
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
    forgeCertificateData: forge.pki.Certificate;
    /**
     * Hides the alias input.
     */
    hideAliasInput?: boolean;
}

/**
 * This is teh first step of the import certificate wizard.
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
    const [ forgeCertificate, setForgeCertificate ] = useState<forge.pki.Certificate>(null);

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
        }
    }, []);

    /**
     * This takes in a `.cer` file and converts it to PEM.
     * 
     * @param {File} file .cer `File`.
     * 
     * @returns {Promise<string>} The PEM encoded string.
     */
    const convertFromCerToPem = (file: File): Promise<string> => {
        return file.arrayBuffer().then((value: ArrayBuffer) => {
            const byteString = forge.util.createBuffer(value);
            const asn1 = forge.asn1.fromDer(byteString);
            const certificate = forge.pki.certificateFromAsn1(asn1);
            const pem = forge.pki.certificateToPem(certificate);
            setForgeCertificate(certificate);

            return stripPem(pem);
        }).catch(() => {
            setFileError(true);
            return "";
        });
    };

    /**
     * This strips **BEGIN CERTIFICATE** and **END CERTIFICATE** parts from 
     * the PEM encoded string.
     * 
     * @param {string} pemString The PEM-encoded content of a certificate.
     * 
     * @returns {string} The PEM string without the **BEGIN CERTIFICATE** and **END CERTIFICATE** parts. 
     */
    const stripPem = (pemString: string): string => {
        const pemValue = pemString.split("\n");

        // removes -----BEGIN CERTIFICATE----- if present.
        pemValue[ 0 ]?.includes(CERTIFICATE_BEGIN) && pemValue.shift();

        // removes "\n" if present.
        pemValue[ pemValue.length - 1 ] === END_LINE
            && pemValue.pop();

        // removes -----END CERTIFICATE----- if present.
        pemValue[ pemValue.length - 1 ]?.includes(CERTIFICATE_END)
            && pemValue.pop();

        return pemValue.join("\n");
    };

    /**
     * This encloses a stripped PEM string with **BEGIN CERTIFICATE** and **END CERTIFICATE**.
     * 
     * @param {string} pemString The stripped PEM string (usually received as from an API call)
     * 
     * @returns {string} A full PEM string.
     */
    const enclosePem = (pemString: string): string => {
        const pemValue = pemString.split("\n");

        // adds -----BEGIN CERTIFICATE----- if not present.
        !pemValue[ 0 ]?.includes(CERTIFICATE_BEGIN) && pemValue.unshift(CERTIFICATE_BEGIN);

        // adds "\n" if not present.
        !(pemValue[ pemValue.length - 1 ] === END_LINE)
            && pemValue.push(END_LINE);
        
        // adds -----END CERTIFICATE----- if not present.
        if (!pemValue[ pemValue.length - 2 ]?.includes(CERTIFICATE_END)) {
            const lastLine = pemValue.pop();
            pemValue.push(CERTIFICATE_END);
            pemValue.push(lastLine);
        }

        return pemValue.join("\n");
    };

    /**
     * Convert PEM string to forge certificate object.
     * 
     * @param {string} pem The PEM string.
     * 
     * @returns {PemCertificate} Object containing the stripped PEM string and the forge certificate.
     */
    const convertFromPem = (pem: string): PemCertificate => {
        const pemValue = enclosePem(pem);
        try {
            const certificateForge = forge.pki
                .certificateFromPem(pemValue);
            setForgeCertificate(certificateForge);

            return {
                certificate: certificateForge,
                value: stripPem(pem)
            };
        } catch (error) {
            setFileError(true);
            return null;
        }
    };

    /**
     * Checks the certificate type and decodes appropriately.
     * 
     * @param {File} file The File object.
     * 
     * @returns {Promise<string>} A promise that resolves to teh content of the file.
     */
    const checkCertType = (file: File): Promise<string> => {
        const extension = file.name.split(".").pop();
        if (extension === "cer") {
            return convertFromCerToPem(file);
        } else if (extension==="crt"){ 
            return file.arrayBuffer().then((value: ArrayBuffer) => {
                const byteString = forge.util.createBuffer(value);

                return convertFromPem(byteString?.data).value;
            }).catch((error) => {
                throw Error(error);
            })
        }else if (extension === "pem") {
            return file.text().then((value: string) => {
                return convertFromPem(value).value;
            }).catch((error) => {
                throw Error(error);
            })
        }

        return Promise.reject();
    };

    /**
     * Submits the data to the wizard.
     */
    const onSubmit = (): void => {
        !name && setNameError(true);
        (!file && !pem) && setCertEmpty(true);
        const certificate = resolveCertificate();

        if (!name || (!file && !pem) || fileError || !certificate) {
            return;
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
            menuItem: t("devPortal:components.certificates.keystore.wizard.panes.upload"),
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
                                    <CertificateIllustrations.uploadPlaceholder.ReactComponent />
                                    <p className="description">
                                        { t("devPortal:components.certificates." +
                                            "keystore.wizard.dropZone.description") }
                                    </p>
                                    <p className="description">– or –</p>
                                </div>
                                <Button basic primary onClick={ () => {
                                    fileUpload.current.click();
                                } }>
                                    {t("devPortal:components.certificates.keystore.wizard.dropZone.action")}    
                                </Button>
                            </Segment>
                        </div >
                    )
                    : (
                        <Segment placeholder>
                            <Segment textAlign="center" basic>
                                <CertificateIllustrations.file.ReactComponent />
                                <p className="file-name">{ file.name }</p>
                                <Icon name="trash alternate" link onClick={ () => {
                                    setFile(null);
                                    setFileError(false);
                                    setFileDecoded("");
                                } } />
                            </Segment>
                        </Segment>
                    )
            )
        },
        {
            menuItem: t("devPortal:components.certificates.keystore.wizard.panes.paste"),
            render: () => (
                <Form>
                    <TextArea
                        rows={ 13 }
                        placeholder={ t("devPortal:components.certificates.keystore.wizard.pastePlaceholder") }
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
        })
    };

    return (
        <>
            <input
                ref={ fileUpload }
                type="file"
                accept="application/x-x509-ca-cert"
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
                                placeholder={ t("devPortal:components.certificates.keystore.forms.alias." +
                                    "placeholder") }
                                label={ t("devPortal:components.certificates.keystore.forms.alias.label") }
                                required={ true }
                                error={
                                    nameError
                                        ? {
                                            content: t("devPortal:components.certificates.keystore." +
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
                (fileError || certEmpty) &&
                <Message error attached="bottom" data-testid={ `${ testId }-error-message` }>
                    { fileError
                        ? t("devPortal:components.certificates.keystore.errorCertificate")
                        : t("devPortal:components.certificates.keystore.errorEmpty")
                    }
                </Message>
            }
        </>

    )
};

/**
 * Default props for the component.
 */
UploadCertificate.defaultProps = {
    "data-testid": "upload-certificate"
};
