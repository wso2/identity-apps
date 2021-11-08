/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { Certificate, TestableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Forms } from "@wso2is/forms";
import * as forge from "node-forge";
import React, { ReactElement, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { UploadCertificate } from "../../../../core";

/**
 * Proptypes for the add Application certificate form component.
 */
interface AddApplicationCertificateFormProps extends TestableComponentInterface {
    triggerCertificateUpload: boolean;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    /**
     * Sets the visibility of the finish button.
     *
     * @param buttonState - button active state
     */
    setShowFinishButton?: (buttonState: boolean) => void;
}

/**
 * Add Application certificate form component.
 *
 * @return {ReactElement}
 */
export const AddApplicationCertificateFormComponent: React.FunctionComponent<AddApplicationCertificateFormProps> = (
    props: AddApplicationCertificateFormProps): ReactElement => {

    const {
        triggerCertificateUpload,
        onSubmit,
        setShowFinishButton,
        ["data-testid"]: testId
    } = props;

    const [ name, setName ] = useState("");
    const [ fileDecoded, setFileDecoded ] = useState("");
    const [ pem, setPem ] = useState("");
    const [ file, setFile ] = useState<File>(null);
    const [ certificate, setCertificate ] = useState<forge.pki.Certificate>(null);
    const [ certString, setCertString ] = useState("");

    useEffect(() => {
        if (certString === "") {
            return;
        }
        onSubmit(certString);
    }, [ certString ]);

    /**
     * This is called when the first step is submitted.
     * It stores
     *      1. the data returned by the first step to be posted.
     *      2. the state of the first step component
     *       so that they can be sent back if previous is clicked.
     *
     * @param {Certificate} data The alias and the PEM-encoded certificate string.
     * @param {string} name The alias of the certificate.
     * @param {string} pem The PEM-encoded string.
     * @param {string} fileDecoded The decoded `.cer` file content.
     * @param {File} file The File object.
     * @param {forge.pki.Certificate} forgeCertificate The forge certificate object.
     */
    const onSubmitCertificate = (
        data: Certificate,
        name: string,
        pem: string,
        fileDecoded: string,
        file: File,
        forgeCertificate: forge.pki.Certificate
    ): void => {
        setName(name);
        setPem(pem);
        setFileDecoded(fileDecoded);
        setFile(file);
        setCertificate(forgeCertificate);
        setCertString(btoa(CertificateManagementUtils.enclosePem(data.certificate)));
    };

    const addApplicationCertificateForm = (): ReactElement => (
        <Forms
            data-testid={ `${testId}-form` }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <UploadCertificate
                            submit={ onSubmitCertificate }
                            triggerSubmit={ triggerCertificateUpload }
                            pemData={ pem }
                            nameData={ name }
                            fileDecodedData={ fileDecoded }
                            fileData={ file }
                            forgeCertificateData={ certificate }
                            data-testid={ `${testId}-upload` }
                            hideAliasInput={ true }
                            setShowFinishButton={ setShowFinishButton }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );

    return (
        <>
            { addApplicationCertificateForm() }
        </>
    );

};

/**
 * Default props for the add application certificate form component.
 */
AddApplicationCertificateFormComponent.defaultProps = {
    "data-testid": "add-application-certificate-form"
};
