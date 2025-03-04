/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

import { Certificate, IdentifiableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Forms } from "@wso2is/forms";
import * as forge from "node-forge";
import React, { ReactElement, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { UploadCertificate } from "./upload-certificate";

/**
 * Proptypes for the add Application certificate form component.
 */
interface AddCertificateFormProps extends IdentifiableComponentInterface {
    /**
     * Flag to trigger the certificate upload process.
     */
    triggerCertificateUpload: boolean;
    /**
     * Flag to trigger the form submission.
     */
    triggerSubmit: boolean;
    /**
     * Callback to handle form submission.
     *
     * @param values - The submitted form values.
     */
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
 * @returns ReactElement
 */
export const AddCertificateFormComponent: React.FunctionComponent<AddCertificateFormProps> = ({
    triggerCertificateUpload,
    onSubmit,
    setShowFinishButton,
    ["data-componentid"]: _componentId = "add-certificate-form"
}: AddCertificateFormProps ): ReactElement => {

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
     * @param data - The alias and the PEM-encoded certificate string.
     * @param name - The alias of the certificate.
     * @param pem - The PEM-encoded string.
     * @param fileDecoded - The decoded `.cer` file content.
     * @param file - The File object.
     * @param forgeCertificate - The forge certificate object.
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
            data-testid={ `${_componentId}-form` }
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
                            data-testid={ `${ _componentId }-upload` }
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

export default AddCertificateFormComponent;
