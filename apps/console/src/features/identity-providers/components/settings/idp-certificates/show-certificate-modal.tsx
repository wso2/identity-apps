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

import { DisplayCertificate, IdentifiableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Certificate as CertificateDisplay, GenericIcon } from "@wso2is/react-components";
import React, { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import { getCertificateIllustrations } from "../../../../core";

/**
 * Props interface of {@link ShowCertificateModal}
 */
export interface ShowCertificateModalProps extends IdentifiableComponentInterface {
    certificateToDisplay: DisplayCertificate;
    show: boolean;
    onCloseClicked: (certificate: DisplayCertificate) => void;
}

/**
 * Displays the certificate in a modal.
 *
 * @param props {ShowCertificateModalProps}
 * @constructor
 */
export const ShowCertificateModal: FC<ShowCertificateModalProps> = (props): ReactElement => {

    const {
        ["data-componentid"]: testId,
        certificateToDisplay,
        show,
        onCloseClicked
    } = props;

    const { t } = useTranslation();

    const getCertificateAlias = () => {
        if (certificateToDisplay?.alias) {
            return certificateToDisplay.alias;
        } else if (certificateToDisplay?.issuerDN) {
            return CertificateManagementUtils.searchIssuerDNAlias(certificateToDisplay?.issuerDN);
        }
        return EMPTY_STRING;
    };

    return (
        <Modal
            className="certificate-display"
            dimmer="blurring"
            size="tiny"
            open={ show }
            onClose={ () => onCloseClicked(certificateToDisplay) }
            data-testid={ `${ testId }-view-certificate-modal` }
        >
            <Modal.Header>
                <div className="certificate-ribbon">
                    <GenericIcon
                        inline
                        transparent
                        size="auto"
                        icon={ getCertificateIllustrations().ribbon }/>
                    <div className="certificate-alias">
                        View Certificate - { getCertificateAlias() }
                    </div>
                    <br/>
                    <div className="certificate-serial">
                        Serial Number: { certificateToDisplay?.serialNumber }
                    </div>
                </div>
            </Modal.Header>
            <Modal.Content className="certificate-content">
                <CertificateDisplay
                    certificate={ certificateToDisplay }
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

const EMPTY_STRING = "";

/**
 * Default props of {@link ShowCertificateModal}
 */
ShowCertificateModal.defaultProps = {
    "data-componentid": "show-certificate-modal"
};
