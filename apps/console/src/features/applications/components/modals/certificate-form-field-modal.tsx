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

import { DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import {
    Certificate as CertificateDisplay,
    GenericIcon} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalProps } from "semantic-ui-react";
import { getCertificateIllustrations } from "../../../core/configs";

/**
 * Proptypes for the certificate form field modal component.
 */
interface CertificateFormFieldModalPropsInterface extends ModalProps, TestableComponentInterface {
    /**
     * Current certificate configurations.
     */
    certificate: DisplayCertificate;
}

/**
 * Certificate form field modal component.
 *
 * @param {CertificateFormFieldModalPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const CertificateFormFieldModal: FunctionComponent<CertificateFormFieldModalPropsInterface> = (
    props: CertificateFormFieldModalPropsInterface
): ReactElement => {

    const {
        certificate,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    return (
        <Modal
            closeOnDimmerClick
            className="certificate-display"
            dimmer="blurring"
            size="tiny"
            data-testid={ `${ testId }-view-certificate-modal` }
            { ...rest }
        >
            <Modal.Header>
                <div className="certificate-ribbon">
                    <GenericIcon
                        inline
                        transparent
                        size="auto"
                        icon={ getCertificateIllustrations().ribbon }
                    />
                    <div className="certificate-alias">
                        View Certificate - {
                        certificate?.alias
                            ? certificate?.alias
                            : certificate?.issuerDN && (
                            CertificateManagementUtils.searchIssuerDNAlias(certificate?.issuerDN)
                        )
                    }
                    </div><br/>
                    <div className="certificate-serial">Serial Number: { certificate?.serialNumber }</div>
                </div>
            </Modal.Header>
            <Modal.Content className="certificate-content">
                <CertificateDisplay
                    certificate={ certificate }
                    labels={ {
                        issuerDN: t("console:manage.features.certificates.keystore.summary.issuerDN"),
                        subjectDN: t("console:manage.features.certificates.keystore.summary.subjectDN"),
                        validFrom: t("console:manage.features.certificates.keystore.summary.validFrom"),
                        validTill: t("console:manage.features.certificates.keystore.summary.validTill"),
                        version: t("console:manage.features.certificates.keystore.summary.version")
                    } }
                />
            </Modal.Content>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
CertificateFormFieldModal.defaultProps = {
    "data-testid": "certificate-form-field-modal"
};
