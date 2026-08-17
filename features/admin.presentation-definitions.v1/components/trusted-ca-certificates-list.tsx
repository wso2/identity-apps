/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { getCertificateIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AddTrustedCaModal } from "./add-trusted-ca-modal";
import { CertificateManagementConstants } from "@wso2is/core/constants";
import { CertificateValidity, DisplayCertificate, IdentifiableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import {
    Certificate as CertificateDisplay,
    EmphasizedSegment,
    GenericIcon,
    Popup,
    UserAvatar
} from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Modal, Segment, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";

interface TrustedCaCertificatesListPropsInterfaceInterface extends IdentifiableComponentInterface {
    trustedCaPems: string[];
    onRemove: (index: number) => void;
    onReplace?: (index: number, newPem: string) => void;
    isReadOnly?: boolean;
}

/**
 * List of trusted CA certificates managed entirely in local React state.
 * Calls `onRemove(index)` for deletions — no API calls are made here.
 * The parent commits changes via its Update button.
 */
export const TrustedCaCertificatesList: FunctionComponent<TrustedCaCertificatesListPropsInterface> = (
    props: PropsWithChildren<TrustedCaCertificatesListPropsInterface>
): ReactElement => {

    const {
        ["data-componentid"]: testId,
        trustedCaPems,
        onRemove,
        onReplace,
        isReadOnly = false
    } = props;

    const { t } = useTranslation();

    const [ displayingCertificates, setDisplayingCertificates ] = useState<ReadonlyArray<DisplayCertificate>>([]);
    const [ showCertificateModal, setShowCertificateModal ] = useState<boolean>(false);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ showReplaceModal, setShowReplaceModal ] = useState<boolean>(false);
    const [ replacingIndex, setReplacingIndex ] = useState<number | null>(null);

    useEffect(() => {
        if (trustedCaPems.length > 0) {
            const certificatesList: DisplayCertificate[] = trustedCaPems.map((pem: string) => {
                if (CertificateManagementUtils.canSafelyParseCertificate(pem)) {
                    return CertificateManagementUtils.displayCertificate(null, pem);
                }

                return CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE;
            });

            setDisplayingCertificates([ ...certificatesList ]);
        } else {
            setDisplayingCertificates([]);
        }
    }, [ trustedCaPems ]);

    const handleViewCertificate = (certificate: DisplayCertificate): void => {
        setCertificateDisplay(certificate);
        setShowCertificateModal(true);
    };

    const createValidityLabel = (certificate: DisplayCertificate): ReactNode => {
        if (certificate?.infoUnavailable) {
            return (
                <span className="with-muted-list-item-header">
                    { t("presentationDefinitions:editPage.issuerTrust.certificate.infoUnavailable") }
                </span>
            );
        }

        let icon: SemanticICONS;
        let iconColor: SemanticCOLORS;

        const validity: CertificateValidity = CertificateManagementUtils.determineCertificateValidityState({
            from: certificate.validFrom,
            to: certificate.validTill
        });

        switch (validity) {
            case CertificateValidity.VALID:
                icon = "check circle";
                iconColor = "green";
                break;
            case CertificateValidity.WILL_EXPIRE_SOON:
                icon = "exclamation circle";
                iconColor = "yellow";
                break;
            default:
                icon = "times circle";
                iconColor = "red";
        }

        const alias: string = CertificateManagementUtils.searchIssuerDNAlias(certificate?.issuerDN);
        const expiryLabel: string = certificate.validTill
            ? t("presentationDefinitions:editPage.issuerTrust.certificate.expiryDate", {
                date: new Date(certificate.validTill).toLocaleDateString("en-GB")
            })
            : "";

        return (
            <React.Fragment>
                { alias + CertificateManagementConstants.SPACE_CHARACTER }
                <Popup
                    trigger={ <Icon name={ icon } color={ iconColor } /> }
                    content={ expiryLabel }
                    inverted
                    position="top left"
                    size="mini"
                />
            </React.Fragment>
        );
    };

    const getSerialNumber = (cert: DisplayCertificate): string => {
        if (!cert || cert.infoUnavailable) return "";
        const sn: unknown = (cert as Record<string, unknown>)["serialNumber"];

        return typeof sn === "string" ? sn : "";
    };

    return (
        <>
            { displayingCertificates.map((certificate: DisplayCertificate, index: number) => (
                <EmphasizedSegment key={ index } style={ { marginBottom: "0.5em" } }>
                    <div style={ { alignItems: "center", display: "flex", gap: "1em" } }>
                        <UserAvatar
                            name={
                                certificate?.infoUnavailable
                                    ? CertificateManagementConstants.QUESTION_MARK
                                    : CertificateManagementUtils.searchIssuerDNAlias(certificate?.issuerDN)
                            }
                            size="mini"
                            floated="left"
                        />
                        <div style={ { flex: 1 } }>
                            <div>{ createValidityLabel(certificate) }</div>
                            { !certificate?.infoUnavailable && (
                                <div style={ { color: "grey", fontSize: "13px" } }>
                                    { CertificateManagementUtils.getValidityPeriodInHumanReadableFormat(
                                        certificate.validFrom,
                                        certificate.validTill
                                    ) }
                                </div>
                            ) }
                        </div>
                        <div style={ { display: "flex", gap: "8px", marginLeft: "1em" } }>
                            { !isReadOnly && onReplace && (
                                <Popup
                                    trigger={
                                        <Icon
                                            link
                                            name="pencil"
                                            size="small"
                                            color="grey"
                                            className="list-icon"
                                            onClick={ () => {
                                                setReplacingIndex(index);
                                                setShowReplaceModal(true);
                                            } }
                                            data-componentid={ `${testId}-change-cert-${index}-button` }
                                        />
                                    }
                                    content={ t(
                                        "presentationDefinitions:editPage.issuerTrust.certificate.actions.change"
                                    ) }
                                    inverted
                                    position="top center"
                                    size="mini"
                                />
                            ) }
                            { !certificate?.infoUnavailable && (
                                <Popup
                                    trigger={
                                        <Icon
                                            link
                                            name="eye"
                                            size="small"
                                            color="grey"
                                            className="list-icon"
                                            onClick={ () => handleViewCertificate(certificate) }
                                            data-componentid={ `${testId}-view-cert-${index}-button` }
                                        />
                                    }
                                    content={ t(
                                        "presentationDefinitions:editPage.issuerTrust.certificate.actions.view"
                                    ) }
                                    inverted
                                    position="top center"
                                    size="mini"
                                />
                            ) }
                            { !isReadOnly && (
                                <Popup
                                    trigger={
                                        <Icon
                                            link
                                            name="trash alternate"
                                            size="small"
                                            color="grey"
                                            className="list-icon"
                                            onClick={ () => onRemove(index) }
                                            data-componentid={ `${testId}-delete-cert-${index}-button` }
                                        />
                                    }
                                    content={ t(
                                        "presentationDefinitions:editPage.issuerTrust.certificate.actions.remove"
                                    ) }
                                    inverted
                                    position="top center"
                                    size="mini"
                                />
                            ) }
                        </div>
                    </div>
                </EmphasizedSegment>
            )) }
            { showReplaceModal && replacingIndex !== null && onReplace && (
                <AddTrustedCaModal
                    existingCertPems={ trustedCaPems.filter(
                        (_: string, i: number) => i !== replacingIndex
                    ) }
                    onAdd={ (newPem: string) => {
                        onReplace(replacingIndex, newPem);
                        setShowReplaceModal(false);
                        setReplacingIndex(null);
                    } }
                    isOpen={ showReplaceModal }
                    onClose={ () => {
                        setShowReplaceModal(false);
                        setReplacingIndex(null);
                    } }
                    data-componentid={ `${testId}-replace-cert-modal` }
                />
            ) }
            { showCertificateModal && certificateDisplay && (
                <Modal
                    closeOnDimmerClick
                    className="certificate-display"
                    dimmer="blurring"
                    size="tiny"
                    open={ showCertificateModal }
                    onClose={ () => setShowCertificateModal(false) }
                    data-componentid={ `${testId}-view-certificate-modal` }
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
                                { t(
                                    "presentationDefinitions:editPage.issuerTrust.certificate.modal.title",
                                    {
                                        alias: certificateDisplay.infoUnavailable
                                            ? CertificateManagementConstants.QUESTION_MARK
                                            : CertificateManagementUtils.searchIssuerDNAlias(
                                                certificateDisplay?.issuerDN
                                            )
                                    }
                                ) }
                            </div>
                            <br />
                            <div className="certificate-serial">
                                { t(
                                    "presentationDefinitions:editPage.issuerTrust.certificate.modal.serialNumber",
                                    { serialNumber: getSerialNumber(certificateDisplay) }
                                ) }
                            </div>
                        </div>
                    </Modal.Header>
                    <Modal.Content className="certificate-content">
                        { certificateDisplay.infoUnavailable ? (
                            <Segment className="certificate">
                                <p className="certificate-field">
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust.certificate.modal.unsupportedPrefix"
                                    ) }{ " " }
                                    { CertificateManagementConstants.SUPPORTED_KEY_ALGORITHMS.map(
                                        (algorithm: string, algorithmIndex: number) => (
                                            <strong key={ algorithmIndex }>{ algorithm }</strong>
                                        )
                                    ) }{ " " }
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust.certificate.modal.unsupportedSuffix"
                                    ) }
                                </p>
                            </Segment>
                        ) : (
                            <CertificateDisplay
                                certificate={ certificateDisplay }
                                labels={ {
                                    issuerDN: t("certificates:keystore.summary.issuerDN"),
                                    subjectDN: t("certificates:keystore.summary.subjectDN"),
                                    validFrom: t("certificates:keystore.summary.validFrom"),
                                    validTill: t("certificates:keystore.summary.validTill"),
                                    version: t("certificates:keystore.summary.version")
                                } }
                            />
                        ) }
                    </Modal.Content>
                </Modal>
            ) }
        </>
    );
};

TrustedCaCertificatesList.defaultProps = {
    "data-componentid": "trusted-ca-certificates-list"
};
