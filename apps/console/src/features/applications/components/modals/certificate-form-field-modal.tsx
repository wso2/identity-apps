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

import { CertificateManagementConstants } from "@wso2is/core/constants";
import { DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Certificate as CertificateDisplay, Code, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalProps, Segment } from "semantic-ui-react";
import { getCertificateIllustrations } from "../../../core";

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

    const CannotReadCertificate = (
        <Segment className="certificate" data-testid={ testId }>
            <p className="certificate-field">
                We were unable to read this certificate. Currently we only
                support displaying public key information in certificate types of {
                    CertificateManagementConstants.SUPPORTED_KEY_ALGORITHMS.map((algo, index) => (
                        <span key={ `${ algo }+${ index }` }>
                            <Code>{ algo }</Code>&nbsp;
                        </span>
                    ))
                } key algorithms. Support for <strong>Elliptic Curve Cryptography</strong>&nbsp;
                key algorithms will be enabled soon.
            </p>
        </Segment>
    );

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
                {
                    certificate?.infoUnavailable
                        ? CannotReadCertificate
                        : (
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
                        )
                }
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
