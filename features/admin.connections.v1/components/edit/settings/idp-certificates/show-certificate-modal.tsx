/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { getCertificateIllustrations } from "@wso2is/admin.core.v1";
import { CertificateManagementConstants } from "@wso2is/core/constants";
import { DisplayCertificate, IdentifiableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Certificate as CertificateDisplay, Code, GenericIcon } from "@wso2is/react-components";
import React, { FC, PropsWithChildren, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Segment } from "semantic-ui-react";

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
 * @param props- ShowCertificateModalProps
 */
export const ShowCertificateModal: FC<ShowCertificateModalProps> = (
    props: PropsWithChildren<ShowCertificateModalProps>
): ReactElement => {

    const {
        [ "data-componentid" ]: testId,
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

    /**
     * Content to render if we cannot read the certificate content.
     */
    const CannotReadCertificate: JSX.Element = (
        <Segment className="certificate" data-testid={ testId }>
            <p className="certificate-field">
                We were unable to read this certificate. Currently we only
                support displaying public key information in certificate types of {
                    CertificateManagementConstants.SUPPORTED_KEY_ALGORITHMS.map((algo: string, index: number) => (
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
                {
                    certificateToDisplay?.infoUnavailable
                        ? CannotReadCertificate
                        : (
                            <CertificateDisplay
                                certificate={ certificateToDisplay }
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

const EMPTY_STRING:string = "";

/**
 * Default props of {@link ShowCertificateModal}
 */
ShowCertificateModal.defaultProps = {
    "data-componentid": "show-certificate-modal"
};
