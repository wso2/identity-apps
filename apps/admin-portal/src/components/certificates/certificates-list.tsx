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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LinkButton, PrimaryButton, ResourceList } from "@wso2is/react-components";
import { Avatar } from "@wso2is/react-components";
import { ConfirmationModal } from "@wso2is/react-components";
import { saveAs } from "file-saver";
import * as forge from "node-forge";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Modal } from "semantic-ui-react";
import { Certificate as CertificateDisplay } from ".";
import { deleteKeystoreCertificate, retrieveCertificateAlias, retrieveClientCertificate, retrievePublicCertificate } from "../../api";
import { CertificateIllustrations } from "../../configs";
import { CERTIFICATE_BEGIN, CERTIFICATE_END, END_LINE } from "../../constants";
import { AlertLevels, Certificate, DisplayCertificate, FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";

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
interface CertificatesListPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * The certificate list
     */
    list: Certificate[];
    /**
     * Initiate an update
     */
    update: () => void;
    /**
     * Determines the type of certificate store.
     */
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

    const {
        featureConfig,
        list,
        update,
        type
    } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteID, setDeleteID ] = useState<string>(null);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ isSuper, setIsSuper ] = useState(true);
    const [ certificateModal, setCertificateModal ] = useState(false);
    const [ deleteCertificatePem, setDeleteCertificatePem ] = useState("");
    const [ tenantCertificate, setTenantCertificate ] = useState("");
    const [ tenantAlias, setTenantAlias ] = useState("");
    const [ aliasEmptyError, setAliasEmptyError ] = useState(false);
    const [ aliasMismatch, setAliasMismatch ] = useState(false);

    const tenantDomain: string = useSelector<AppState, string>((state: AppState) => state.config.deployment.tenant);

    const dispatch = useDispatch();

    /**
     * Delete a certificate
     * @param {string} id certificate id
     */
    const initDelete = (certificate: Certificate) => {
        retrieveCertificateAlias(certificate.alias, true).then(response => {
            setDeleteCertificatePem(response);
            setDeleteID(certificate.alias);
            setDeleteConfirm(true);
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description || "An error occurred while fetching the certificate.",
                level: AlertLevels.ERROR,
                message: error?.message || "Something went wrong"
            }));
        })
    };

    /**
     * Closes the delete confirmation modal
     */
    const closeDeleteConfirm = () => {
        setDeleteConfirm(false);
        setDeleteID(null);
    };

    /**
     * Checks if the tenant is the super tenant. 
     * Needed to disable delete and import certificate.
     */
    useEffect(() => {
        if (tenantDomain === "carbon.super") {
            setIsSuper(true);
        } else {
            setIsSuper(false);
        }
    }, [ tenantDomain ]);


    /**
     * Opens the modal that displays the certificate details
     * when the `certificateDisplay` state has been set.
     */
    useEffect(() => {
        if (certificateDisplay) {
            setCertificateModal(true);
        }
    }, [ certificateDisplay ]);

    useEffect(() => {
        retrievePublicCertificate(true).then(response => {
            setTenantCertificate(decodeCertificate(response).serialNumber);
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description
                    ?? "There was an error while fetching the tenant certificate.",
                level: AlertLevels.ERROR,
                message: error?.message ?? "Something went wrong!"
            }));
        })
    }, [])

    /**
     * Shows the delete confirmation modal.
     * 
     * @return {ReactElement} The delete confirmation modal.
     * 
     */
    const showDeleteConfirm = (): ReactElement => {
        const isTenantCertificate: boolean = decodeCertificate(deleteCertificatePem).serialNumber === tenantCertificate;
        return (
            <ConfirmationModal
                onClose={ closeDeleteConfirm }
                type="warning"
                open={ deleteConfirm }
                assertion={ isTenantCertificate ? deleteID : null }
                assertionHint={
                    <p>Please type <strong>{ deleteID }</strong> to confirm.</p>
                }
                assertionType={ isTenantCertificate ? "input" : null }
                primaryAction="Confirm"
                secondaryAction="Cancel"
                onSecondaryActionClick={ closeDeleteConfirm }
                onPrimaryActionClick={ (): void => {
                    if (!tenantAlias) {
                        setAliasEmptyError(true);
                    } else if (tenantAlias !== deleteID) {
                        setAliasMismatch(true);
                    } else {
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
                    }
                } }
            >
                <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                { isTenantCertificate
                    ? (
                        <>
                            <ConfirmationModal.Message attached warning>
                                This action is irreversible and will permanently delete the certificate.
                            </ConfirmationModal.Message>
                            < ConfirmationModal.Content >
                                This will delete the tenant certificate permanently.
                                Once deleted, unless you import a new tenant certificate,
                                you won&apos;t be able to access the portal applications.
                                To continue deleting, enter the alias of the certificate and click delete.
                            </ConfirmationModal.Content>
                        </>
                    ) : (
                        < ConfirmationModal.Content >
                            This action is irreversible and will permanently delete the certificate.
                        </ConfirmationModal.Content>
                    )
                }
            </ConfirmationModal>
        )
    };

    /**
     * This converts a PEM-encoded certificate to a
     * DER encoded ASN.1 certificate and saves it to the disk.
     * 
     * ```
     * const intArray = der.data.split("").map(char => {
            return char.charCodeAt(0);
        });
     * ```
     * The `ByteStringBuffer` that holds the DER encoded
     * string actually has `UTF-16` encoded string values. 
     * 
     * The above code snippet is used to decode the `UTF-16` string. 
     * 
     * @param {string} name The alias of the certificate.
     * @param {string} pem The PEM encoded certificate content.
     */
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

    /**
     * Converts a PEM encoded string to a Forge certificate object.
     * 
     * @param {string} pem The PEM encoded certificate content.
     * 
     * @returns {forge.pki.Certificate} The Forge Certificate object.
     */
    const decodeCertificate = (pem: string): forge.pki.Certificate => {
        const pemValue = pem?.split("\n");

        // appends -----END CERTIFICATE-----.
        pemValue?.push(CERTIFICATE_END);

        // appends a new line.
        pemValue?.push(END_LINE);

        // pushes -----BEGIN CERTIFICATE----- to the top.
        pemValue?.unshift(CERTIFICATE_BEGIN);

        const pemCert = pemValue?.join("\n");

        const certificateForge = forge.pki
            .certificateFromPem(pemCert);

        return certificateForge;
    }

    /**
     * This serializes the certificate content to a displayable format.
     * 
     * @param {Certificate} certificate The Certificate object returned by teh API endpoints.
     * @param {string} pem The PEM encoded certificate content. 
     */
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

    /**
     * This renders the modal that displays the certificate.
     * 
     * @returns {ReactElement} The certificate modal.
     */
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
            { deleteID && showDeleteConfirm() }
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
                                        		&& hasRequiredScopes(featureConfig?.certificates,
                                            		featureConfig?.certificates?.scopes?.delete)
                                            )
                                                || isSuper,
                                            icon: "trash alternate",
                                            onClick: () => { initDelete(certificate) },
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
