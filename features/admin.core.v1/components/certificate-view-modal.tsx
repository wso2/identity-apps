/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { CertificateManagementConstants } from "@wso2is/core/constants";
import { DisplayCertificate, IdentifiableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Certificate as CertificateDisplay, Code, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalProps, Segment } from "semantic-ui-react";
import { getCertificateIllustrations } from "../configs/ui";

/**
 * Proptypes for the certificate form field modal component.
 */
interface CertificateViewModalInterface extends ModalProps, IdentifiableComponentInterface {
    /**
     * Current certificate configurations.
     */
    certificate: DisplayCertificate;
}

/**
 * Certificate form field modal component.
 * @param  props - Props injected to the component.
 */
export const CertificateViewModal: FunctionComponent<CertificateViewModalInterface> = ({
    certificate,
    [ "data-componentid" ]: _componentId = "certificate-form-field-modal",
    ...rest
}: CertificateViewModalInterface ): ReactElement => {

    const { t } = useTranslation();

    const CannotReadCertificate :JSX.Element = (
        <Segment className="certificate" data-componentid={ _componentId }>
            <p className="certificate-field">
                { t("certificates:keystore.certificateViewValidation" , {
                    algorithms : CertificateManagementConstants.SUPPORTED_KEY_ALGORITHMS.map(
                        (algo : string, index: number) => (
                            <span key={ `${ algo }+${ index }` }>
                                <Code>{ algo }</Code>&nbsp;
                            </span>
                        ))
                } )
                }
            </p>
        </Segment>
    );

    return (
        <Modal
            closeOnDimmerClick
            className="certificate-display"
            dimmer="blurring"
            size="tiny"
            data-testid={ `${ _componentId }-view-certificate-modal` }
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
                    <div className="certificate-serial"> { t("certificates:keystore.serial") }
                        { certificate?.serialNumber }</div>
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
                                    issuerDN: t("certificates:keystore.summary.issuerDN"),
                                    subjectDN: t("certificates:keystore.summary.subjectDN"),
                                    validFrom: t("certificates:keystore.summary.validFrom"),
                                    validTill: t("certificates:keystore.summary.validTill"),
                                    version: t("certificates:keystore.summary.version")
                                } }
                            />
                        )
                }
            </Modal.Content>
        </Modal>
    );
};

export default CertificateViewModal;
