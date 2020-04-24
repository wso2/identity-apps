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

import { LinkButton, PrimaryButton, ResourceList } from "@wso2is/react-components";
import { Avatar } from "@wso2is/react-components";
import { saveAs } from "file-saver";
import * as forge from "node-forge";
import React, { FunctionComponent, ReactElement, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "semantic-ui-react";
import { Certificate as CertificateDisplay } from ".";
import { deleteKeystoreCertificate, retrieveCertificateAlias, retrieveClientCertificate } from "../../api";
import { CertificateIllustrations } from "../../configs";
import { CERTIFICATE_BEGIN, CERTIFICATE_END, END_LINE } from "../../constants";
import { AppConfig } from "../../helpers";
import { AlertLevels, AppConfigInterface, Certificate, DisplayCertificate } from "../../models";
import { AppState } from "../../store";
import { addAlert } from "../../store/actions";

/**
 * @constant
 * @type {string}
 */
const KEYSTORE = "keystore";

/**
 * @constant
 * @type {string}
 */
const TRUSTSTORE = "truststore";

/**
 * Prop types of the `CertificatesList` component
 */
interface CertificatesListPropsInterface {
    /**
     * The certificate list
     */
    list: Certificate[];
    /**
     * Initiate an update
     */
    update: () => void;
    type: typeof TRUSTSTORE | typeof KEYSTORE;
}

/**
 * This component renders the certificate List
 * @param {CertificatesListPropsInterface} props
 * @return {ReactElement}
 */
export const CertificatesList: FunctionComponent<CertificatesListPropsInterface> = (
    props: CertificatesListPropsInterface
): ReactElement => {

    const { list, update, type } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteID, setDeleteID ] = useState<string>(null);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ isSuper, setIsSuper ] = useState(true);
    const [ certificateModal, setCertificateModal ] = useState(false);

    const tenantDomain: string = useSelector<AppState, string>((state: AppState) => state.config.deployment.tenant);

    const dispatch = useDispatch();

    const appConfig: AppConfigInterface = useContext(AppConfig);

    /**
     * Delete a certificate
     * @param {string} id certificate id
     */
    const initDelete = (id: string) => {
        setDeleteID(id);
        setDeleteConfirm(true);
    };

    /**
     * Closes the delete confirmation modal
     */
    const closeDeleteConfirm = () => {
        setDeleteConfirm(false);
        setDeleteID(null);
    };

    useEffect(() => {
        if (tenantDomain === "carbon.super") {
            setIsSuper(true);
        } else {
            setIsSuper(false);
        }
    }, [ tenantDomain ]);


    useEffect(() => {
        if (certificateDisplay) {
            setCertificateModal(true);
        }
    }, [ certificateDisplay ]);

    /**
     * Shows the delete confirmation modal
     * @return {ReactElement}
     */
    const showDeleteConfirm = (): ReactElement => {
        return (
            <Modal
                open={ deleteConfirm }
                onClose={ closeDeleteConfirm }
                size="mini"
                dimmer="blurring"
            >
                <Modal.Header>
                    Confirm Delete
                </Modal.Header>
                <Modal.Content>
                    This will delete the certificate permanently. Do you want to continue?
                </Modal.Content>
                <Modal.Actions>
                    <LinkButton onClick={ closeDeleteConfirm }>
                        Cancel
                    </LinkButton>
                    <PrimaryButton onClick={ () => {
                        deleteKeystoreCertificate(deleteID).then(() => {
                            dispatch(addAlert({
                                description: "The certificate has been successfully deleted.",
                                level: AlertLevels.SUCCESS,
                                message: "Certificate deleted successfully"
                            }));
                            update();
                        }).catch((error) => {
                            dispatch(addAlert({
                                description: error?.description
                                    ?? "There was an error while deleting the certificate",
                                level: AlertLevels.ERROR,
                                message: error?.message ?? "Something went wrong!"
                            }));
                        }).finally(() => {
                            closeDeleteConfirm();
                        });
                    } }>
                        Delete
                    </PrimaryButton>
                </Modal.Actions>
            </Modal>
        )
    };

    const exportCertificate = (name: string, pem: string): void => {

        const certificate = decodeCertificate(pem);

        const der = forge.asn1.toDer(
            forge.pki.certificateToAsn1(certificate)
        );

        const intArray = der.data.split("").map(char => {
            return char.charCodeAt(0);
        });

        const buffer = new Uint8Array(intArray).buffer;

        const blob = new Blob([ buffer ], {
            type: "application/x-x509-ca-cert"
        });

        saveAs(blob, name + ".cer");

        dispatch(addAlert({
            description: "The certificate has started downloading.",
            level: AlertLevels.SUCCESS,
            message: "Certificate download started"
        }));
    };


    const decodeCertificate = (pem: string): forge.pki.Certificate => {
        const pemValue = pem.split("\n");

        // appends -----END CERTIFICATE-----.
        pemValue.push(CERTIFICATE_END);

        // appends a new line.
        pemValue.push(END_LINE);

        // pushes -----BEGIN CERTIFICATE----- to the top.
        pemValue.unshift(CERTIFICATE_BEGIN);

        const pemCert = pemValue.join("\n");

        const certificateForge = forge.pki
            .certificateFromPem(pemCert);

        return certificateForge;
    }

    const displayCertificate = (certificate: Certificate, pem: string): void => {

        const certificateForge = decodeCertificate(pem);

        const displayCertificate: DisplayCertificate = {
            alias: certificate.alias,
            issuerDN: certificateForge.issuer.attributes
                .map(attribute => {
                    return {
                        [ attribute.shortName ]: attribute.value
                    }
                }),
            serialNumber: certificateForge.serialNumber,
            subjectDN: certificateForge.subject.attributes
                .map(attribute => {
                    return {
                        [ attribute.shortName ]: attribute.value
                    }
                }),
            validFrom: certificateForge.validity.notBefore,
            validTill: certificateForge.validity.notAfter,
            version: certificateForge.version
        };

        setCertificateDisplay(displayCertificate);
    }

    const renderCertificateModal = (): ReactElement => {
        return (
            <Modal
                dimmer="blurring"
                size="tiny"
                open={ certificateModal }
                onClose={ () => { setCertificateModal(false) } }
            >
                <Modal.Header>
                    View certificate
                </Modal.Header>
                <Modal.Content className="certificate-content">
                    <CertificateDisplay certificate={ certificateDisplay } />
                </Modal.Content>
            </Modal>
        )
    }

    return (
        <>
            { showDeleteConfirm() }
            { certificateModal && renderCertificateModal() }
            <ResourceList>
                {
                    (
                        type === KEYSTORE
                        && appConfig?.certificates?.features?.keystore?.permissions?.read
                    )
                        || (
                            type === TRUSTSTORE
                            && appConfig?.certificates?.features?.truststore?.permissions?.read
                        )
                        ? list?.map((certificate: Certificate, index: number) => {
                            return (
                                <ResourceList.Item
                                    avatar={
                                        <Avatar
                                            image={ <CertificateIllustrations.avatar.ReactComponent /> }
                                            transparent={ true }
                                            avatarType="app"
                                            spaced="right"
                                            floated="left"
                                        />
                                    }
                                    key={ index }
                                    actions={ [
                                        {
                                            icon: "eye",
                                            onClick: () => {
                                                if (type === KEYSTORE) {
                                                    retrieveCertificateAlias(certificate.alias, true)
                                                        .then((response: string) => {
                                                            displayCertificate(certificate, response);
                                                        }).catch(error => {
                                                            dispatch(addAlert({
                                                                description: error?.description
                                                                    ?? "There was an error while " +
                                                                    "fetching the certificate",
                                                                level: AlertLevels.ERROR,
                                                                message: error?.message ?? "Something went wrong!"
                                                            }));
                                                        })
                                                } else {
                                                    retrieveClientCertificate(certificate.alias, true)
                                                        .then((response) => {
                                                            displayCertificate(certificate, response);
                                                        }).catch(error => {
                                                            dispatch(addAlert({
                                                                description: error?.description
                                                                    ?? "There was an error while fetching " +
                                                                    "the certificate",
                                                                level: AlertLevels.ERROR,
                                                                message: error?.message ?? "Something went wrong!"
                                                            }));
                                                        })
                                                }
                                            },
                                            popupText: "View",
                                            type: "button"
                                        },
                                        {
                                            icon: "download",
                                            onClick: () => {
                                                if (type === KEYSTORE) {
                                                    retrieveCertificateAlias(certificate.alias, true)
                                                        .then((response: string) => {
                                                            exportCertificate(certificate.alias, response);
                                                        }).catch(error => {
                                                            dispatch(addAlert({
                                                                description: error?.description
                                                                    ?? "There was an error while " +
                                                                    "fetching the certificate",
                                                                level: AlertLevels.ERROR,
                                                                message: error?.message ?? "Something went wrong!"
                                                            }));
                                                        })
                                                } else {
                                                    retrieveClientCertificate(certificate.alias, true)
                                                        .then((response) => {
                                                            exportCertificate(certificate.alias, response);
                                                        }).catch(error => {
                                                            dispatch(addAlert({
                                                                description: error?.description
                                                                    ?? "There was an error while fetching " +
                                                                    "the certificate",
                                                                level: AlertLevels.ERROR,
                                                                message: error?.message ?? "Something went wrong!"
                                                            }));
                                                        })
                                                }
                                            },
                                            popupText: "Export",
                                            type: "dropdown"
                                        },
                                        {
                                            hidden: !(
                                                type === KEYSTORE
                                                && appConfig?.certificates?.features?.keystore?.permissions?.delete
                                            )
                                                || isSuper,
                                            icon: "trash alternate",
                                            onClick: () => { initDelete(certificate?.alias) },
                                            popupText: "Delete",
                                            type: "dropdown"
                                        }
                                    ] }
                                    actionsFloated="right"
                                    itemHeader={ certificate.alias }
                                />
                            )
                        })
                        : null
                }
            </ResourceList>
        </>
    )
};
