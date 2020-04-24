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

import * as forge from "node-forge";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Button, Divider, Form, Icon, Message, Segment, Tab, TextArea } from "semantic-ui-react";
import { CertificateIllustrations } from "../../configs";
import { CERTIFICATE_BEGIN, CERTIFICATE_END, END_LINE } from "../../constants";
import { Certificate } from "../../models";

interface PemCertificate{
    value: string;
    certificate: forge.pki.Certificate;
}
interface UploadCertificatePropsInterface {
    submit: (
        data: Certificate,
        name: string,
        pem: string,
        fileDecoded: string,
        file: File,
        forgeCertificate: forge.pki.Certificate
    ) => void;
    triggerSubmit: boolean;
    nameData: string;
    pemData: string;
    fileDecodedData: string;
    fileData: File;
    forgeCertificateData: forge.pki.Certificate;
}
export const UploadCertificate = (props: UploadCertificatePropsInterface): ReactElement => {

    const { submit, triggerSubmit, nameData, pemData, fileDecodedData, fileData, forgeCertificateData } = props;

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

    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            onSubmit();
        }
    }, [ triggerSubmit ]);

    useEffect(() => {
        if (nameData) {
            setName(nameData);
        }
    }, [ nameData ]);

    useEffect(() => {
        if (fileData) {
            setFile(fileData);
        }
    }, [ fileData ]);

    useEffect(() => {
        if (fileDecoded) {
            setFileDecoded(fileDecodedData);
        }
    }, [ fileDecodedData ]);

    useEffect(() => {
        if (pemData) {
            setPem(pemData);
        }
    }, [ pemData ]);

    useEffect(() => {
        if (name) {
            setNameError(false);
        }
    }, [ name ]);

    useEffect(() => {
        if (file) {
            setFileError(false);
        }
    }, [ file ]);

    useEffect(() => {
        if (forgeCertificateData) {
            setForgeCertificate(forgeCertificateData);
        }
    }, [forgeCertificateData]);

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
        }
        window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", callback);

        return () => {
            window.matchMedia("(prefers-color-scheme:dark)").removeEventListener("change", callback);
        }
    }, []);

    /**
     * This takes in an ArrayBuffer and converts it to PEM.
     * 
     * @param {ArrayBuffer} value .cer `File` converted to `ArrayBuffer`.
     * 
     * @returns {Promise<string>} The PEM encoded string.
     */
    const convertFromDerToPem = (file: File): Promise<string> => {
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

    const enclosePem = (pemString: string): string => {
        const pemValue = pemString.split("\n");

        // adds -----BEGIN CERTIFICATE----- if not present.
        !pemValue[ 0 ]?.includes(CERTIFICATE_BEGIN) && pemValue.unshift(CERTIFICATE_BEGIN);

        // adds -----END CERTIFICATE----- if present.
        !pemValue[ pemValue.length - 1 ]?.includes(CERTIFICATE_END)
            && pemValue.push(CERTIFICATE_END);

        // adds "\n" if not present.
        !(pemValue[ pemValue.length - 1 ] === END_LINE)
            && pemValue.push(END_LINE);

        return pemValue.join("\n");
    }

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
    }

    const checkCertType = (file: File): Promise<string> => {
        const extension = file.name.split(".").pop();
        if (extension === "cer") {
            return convertFromDerToPem(file);
        } else if (extension === "pem") {
            return file.text().then((value: string) => {
                return convertFromPem(value).value;
            }).catch(() => {
                setFileError(true);
                return "";
            })
        }
    };

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
    }

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
                        >
                            <Segment placeholder className={ `drop-zone ${dragOver ? "drag-over" : ""}` }>
                                <div className="certificate-upload-placeholder">
                                    <CertificateIllustrations.uploadPlaceholder.ReactComponent />
                                    <p className="description">Drag and drop a certificate file here</p>
                                    <p className="description">– or –</p>
                                </div>
                                <Button basic primary onClick={ () => {
                                    fileUpload.current.click();
                                } }>
                                    Upload Certificate
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
            menuItem: "Paste",
            render: () => (
                <Form>
                    <TextArea
                        rows={ 13 }
                        placeholder="Paste the content of a PEM certificate"
                        value={ pem }
                        onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setPem(event.target.value);
                            setCertEmpty(false);
                            setFileError(false);
                        } }
                        spellCheck={ false }
                        className={ `certificate-editor ${dark ? "dark" : "light"}` }
                    />
                </Form>
            )
        }
    ];

    const addFile = (file: File): void => {
        checkCertType(file).then((value: string) => {
            setFile(file);
            setCertEmpty(false);
            setFileError(false);

            const fileName = file.name.split(".");
            // removes the file extension
            fileName.pop();
            !name && setName(fileName.join("."));
            setFileDecoded(value);
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
            />
            <Form>
                <Form.Input
                    fluid
                    type="text"
                    placeholder="Enter an alias"
                    label="Alias"
                    required={ true }
                    error={
                        nameError
                            ? {
                                content: "Alias is required"
                            }
                            : false
                    }
                    value={ name }
                    onChange={ (event) => {
                        setName(event.target.value);
                    } }
                />
            </Form>
            <Divider hidden />

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

            {
                (fileError || certEmpty) &&
                <Message error attached="bottom">
                    { fileError
                        ? "An error occurred while decoding the certificate." +
                        " Please ensure the certificate is valid."
                        : "Either add a certificate file or paste the content of a PEM-encoded certificate."
                    }
                </Message>
            }
        </>

    )
};
