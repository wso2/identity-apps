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

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Form, Icon, Label, Modal, Segment } from "semantic-ui-react";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import { CertificateImage, FileUploadPlaceholder } from "../../configs";

interface AddCertificatePropsInterface {
    open: boolean;
    onClose: () => void;
}
export const AddCertificate = (props: AddCertificatePropsInterface): ReactElement => {

    const { open, onClose } = props;
    const [ name, setName ] = useState("");
    const [ file, setFile ] = useState<File>(null);
    const [ nameError, setNameError ] = useState(false);
    const [ fileError, setFileError ] = useState(false);

    const fileUpload = useRef(null);

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

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="tiny"
        >
            <Modal.Header>
                Upload certificate
            </Modal.Header>
            <Modal.Content>
                <input
                    ref={ fileUpload }
                    type="file"
                    accept="application/x-x509-ca-cert"
                    hidden
                    onChange={ (event) => {
                        setFile(event.target.files[ 0 ])
                        event.target.value = null;
                    } }
                />
                <Form.Field>
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
                    <Segment placeholder>
                        {
                            file ? (
                                <Label basic image size="big">
                                    <img src={ CertificateImage.default }/>
                                    { file.name }
                                    <Icon name="delete" onClick={ () => {
                                        setFile(null);
                                    } }/>
                                </Label>
                            )
                                : (
                                    <>
                                        <div style={ { textAlign: "center" } }>
                                            <FileUploadPlaceholder.ReactComponent />
                                        </div>
                                        <LinkButton onClick={ () => {
                                            fileUpload.current.click();
                                        } }>
                                            Add Certificate
                                </LinkButton>
                                    </>
                                )
                        }
                    </Segment>
                </Form.Field>
            </Modal.Content>
            <Modal.Actions>
                <LinkButton onClick={ onClose }>
                    Cancel
                </LinkButton>
                <PrimaryButton onClick={ () => {
                    if (!name) {
                        setNameError(true);
                        return;
                    }
                    if (!file) {
                        setFileError(true);
                        return;
                    }

                    const reader = new FileReader();
                    reader.readAsText(file,"der");

                } }>
                    Upload
                </PrimaryButton>
            </Modal.Actions>
        </Modal>
    )
};
