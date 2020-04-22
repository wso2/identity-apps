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

import { AlertLevels } from "@wso2is/core/dist/src/models";
import { addAlert } from "@wso2is/core/dist/src/store";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import * as forge from "node-forge";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Divider, Form, Grid, Icon, Message, Modal, Segment, TextArea } from "semantic-ui-react";
import { createKeystoreCertificate } from "../../api";
import { CertificateImage, FileUploadPlaceholder } from "../../configs";
import { Certificate } from "../../models";

interface AddCertificatePropsInterface {
    /**
     * Specifies if the modal should be opened or not.
     */
    open: boolean;
    /**
     * Called when the modal is closed.
     */
    onClose: () => void;
    /**
     * Calls update on the parent component.
     */
    update: () => void;
}
export const AddCertificate = (props: AddCertificatePropsInterface): ReactElement => {

    const { open, onClose, update } = props;

    const [ name, setName ] = useState("");
    const [ file, setFile ] = useState<File>(null);
    const [ pem, setPem ] = useState("");
    const [ nameError, setNameError ] = useState(false);
    const [ fileError, setFileError ] = useState(false);
    const [ certEmpty, setCertEmpty ] = useState(false);
    const [ fileDecoded, setFileDecoded ] = useState("");

    const fileUpload = useRef(null);

    const dispatch = useDispatch();

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

    /**
     * This takes in an ArrayBuffer and converts it to PEM.
     * 
     * @param {ArrayBuffer} value .cer `File` converted to `ArrayBuffer`.
     * 
     * @returns {Promise<string>} The PEM encoded string.
     */
    const convertFromDerToPem = (file: File): Promise<string> => {
        return file.arrayBuffer().then((value: ArrayBuffer) => {
            return forge.pki.certificateToPem(
                forge.pki.certificateFromAsn1(
                    forge.asn1.fromDer(
                        forge.util.createBuffer(value)
                    )
                )
            ).replace("-----BEGIN CERTIFICATE-----", "")
                .replace("-----END CERTIFICATE-----", "");
        }).catch(() => {
            setFileError(true);
            return "";
        });
    };

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
        >
            <Modal.Header>
                Import certificate
            </Modal.Header>
            <Modal.Content scrolling>
                <input
                    ref={ fileUpload }
                    type="file"
                    accept="application/x-x509-ca-cert"
                    hidden
                    onChange={ (event) => {
                        const file = event.target.files[ 0 ];
                        setFile(file);
                        event.target.value = null;
                        setCertEmpty(false);
                        setFileError(false);
                        convertFromDerToPem(file).then((value: string) => {
                            setFileDecoded(value);
                        })
                    } }
                />
                <Form>
                    <Form.Input
                        fluid
                        type="text"
                        placeholder="Enter a name"
                        label="Name"
                        required={ true }
                        error={
                            nameError
                                ? {
                                    content: "Name is required"
                                }
                                : false
                        }
                        value={ name }
                        onChange={ (event) => {
                            setName(event.target.value);
                        } }
                    />
                </Form>
                <Segment placeholder>
                    {
                        !file
                            ? (
                                <Grid columns={ 2 } stackable textAlign='center'>
                                    <Divider vertical>Or</Divider>

                                    <Grid.Row verticalAlign='middle'>
                                        <Grid.Column>
                                            <div style={ { textAlign: "center" } }>
                                                <FileUploadPlaceholder.ReactComponent />
                                            </div>
                                            <LinkButton onClick={ () => {
                                                fileUpload.current.click();
                                            } }>
                                                Add Certificate
                                            </LinkButton>
                                        </Grid.Column>

                                        <Grid.Column>
                                            <Form>
                                                <TextArea
                                                    rows={ 10 }
                                                    placeholder="Paste the content of a PEM certificate"
                                                    value={ pem }
                                                    onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                        setPem(event.target.value);
                                                        setCertEmpty(false);
                                                    } }
                                                />
                                            </Form>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            )
                            : (
                                <Segment textAlign="center" basic>
                                    <CertificateImage.ReactComponent />
                                    <p>{ file.name }</p>
                                    <Icon name="trash alternate" link onClick={ () => {
                                        setFile(null);
                                        setFileError(false);
                                        setFileDecoded("");
                                    } } />
                                </Segment>
                            )
                    }
                </Segment>
                {
                    (fileError || certEmpty) &&
                    <Message error attached="bottom">
                        { fileError
                            ? "An error occurred while decoding the certificate." +
                            " Please ensure the certificate file is valid."
                            : "Either add a certificate file or paste the content of a PEM-encoded certificate."
                        }
                    </Message>
                }
            </Modal.Content>
            <Modal.Actions>
                <LinkButton onClick={ onClose }>
                    Cancel
                </LinkButton>
                <PrimaryButton onClick={ () => {
                    !name && setNameError(true);
                    (!file && !pem) && setCertEmpty(true);
                    if (!name || (!file && !pem) || fileError) {
                        return;
                    }

                    const data: Certificate = {
                        alias: name,
                        certificate: fileDecoded || pem
                    };

                    createKeystoreCertificate(data).then(() => {
                        dispatch(addAlert({
                            description: "The certificate has been imported successfully.",
                            level: AlertLevels.SUCCESS,
                            message: "Certificate import success"
                        }));
                        update();
                        onClose();
                    }).catch(error => {
                        dispatch(addAlert({
                            description: error?.description || "An error occurred while importing the certificate.",
                            level: AlertLevels.ERROR,
                            message: error?.message || "Something went wrong!"
                        }));
                    })


                } }>
                    Import
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    )
};
