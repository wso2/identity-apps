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
import { LoadableComponentInterface, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Avatar,
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList
} from "@wso2is/react-components";
import { saveAs } from "file-saver";
import * as forge from "node-forge";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Modal } from "semantic-ui-react";
import { Certificate as CertificateDisplay } from ".";
import {
    deleteKeystoreCertificate,
    retrieveCertificateAlias,
    retrieveClientCertificate,
    retrievePublicCertificate
} from "../../api";
import { CertificateIllustrations, EmptyPlaceholderIllustrations } from "../../configs";
import { CERTIFICATE_BEGIN, CERTIFICATE_END, END_LINE, UIConstants } from "../../constants";
import { AlertLevels, Certificate, DisplayCertificate, FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import {CertificateManagementUtils} from "../../utils";

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
interface CertificatesListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * The certificate list
     */
    list: Certificate[];
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery: string;
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
 * This component renders the certificate List.
 *
 * @param {CertificatesListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const CertificatesList: FunctionComponent<CertificatesListPropsInterface> = (
    props: CertificatesListPropsInterface
): ReactElement => {

    const {
        featureConfig,
        isLoading,
        list,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery,
        update,
        type,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteID, setDeleteID ] = useState<string>(null);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ isSuper, setIsSuper ] = useState(true);
    const [ certificateModal, setCertificateModal ] = useState(false);
    const [ deleteCertificatePem, setDeleteCertificatePem ] = useState("");
    const [ tenantCertificate, setTenantCertificate ] = useState("");

    const tenantDomain: string = useSelector<AppState, string>((state: AppState) => state.config.deployment.tenant);

    const dispatch = useDispatch();

    /**
     * Delete a certificate
     *
     * @param {Certificate} certificate - Deleting certificate.
     */
    const initDelete = (certificate: Certificate): void => {
        retrieveCertificateAlias(certificate.alias, true).then(response => {
            setDeleteCertificatePem(response);
            setDeleteID(certificate.alias);
            setDeleteConfirm(true);
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description
                    || t("devPortal:components.certificates.keystore.notifications." +
                        "getAlias.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message
                    || t("devPortal:components.certificates.keystore.notifications." +
                        "getAlias.genericError.message")
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
                    ?? t("devPortal:components.certificates.keystore.notifications." +
                        "getPublicCertificate.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message
                    ?? t("devPortal:components.certificates.keystore.notifications." +
                        "getPublicCertificate.genericError.description")
            }));
        })
    }, []);

    /**
     * Shows the delete confirmation modal.
     * 
     * @return {ReactElement} The delete confirmation modal.
     * 
     */
    const showDeleteConfirm = (): ReactElement => {
        const isTenantCertificate: boolean = decodeCertificate(deleteCertificatePem)
            .serialNumber === tenantCertificate;
        return (
            <ConfirmationModal
                onClose={ closeDeleteConfirm }
                type="warning"
                open={ deleteConfirm }
                assertion={ isTenantCertificate ? deleteID : null }
                assertionHint={
                    <p>
                        <Trans i18nKey="devPortal:components.certificates.keystore.confirmation.hint">
                           Please type <strong>{{ id:deleteID }}</strong> to confirm. 
                        </Trans>
                    </p>
                }
                assertionType={ isTenantCertificate ? "input" : null }
                primaryAction={ t("devPortal:components.certificates.keystore.confirmation.primaryAction") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ closeDeleteConfirm }
                onPrimaryActionClick={ (): void => {
                    deleteKeystoreCertificate(deleteID).then(() => {
                        dispatch(addAlert({
                            description: t("devPortal:components.certificates.keystore.notifications." +
                                "deleteCertificate.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("devPortal:components.certificates.keystore.notifications." +
                                "deleteCertificate.success.message")
                        }));
                        update();
                    }).catch((error) => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? t("devPortal:components.certificates.keystore.notifications." +
                                    "deleteCertificate.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message
                                ?? t("devPortal:components.certificates.keystore.notifications." +
                                    "deleteCertificate.genericError.message")
                        }));
                    }).finally(() => {
                        closeDeleteConfirm();
                    });
                } }
                data-testid={ `${ testId }-delete-confirmation-modal` }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ testId }-delete-confirmation-modal-header` }
                >
                    { t("devPortal:components.certificates.keystore.confirmation.header") }
                </ConfirmationModal.Header>
                { isTenantCertificate
                    ? (
                        <>
                            <ConfirmationModal.Message
                                attached
                                warning
                                data-testid={ `${ testId }-delete-confirmation-modal-message` }
                            >
                                { t("devPortal:components.certificates.keystore.confirmation.message") }
                            </ConfirmationModal.Message>
                            < ConfirmationModal.Content
                                data-testid={ `${ testId }-delete-confirmation-modal-content` }
                            >
                                { t("devPortal:components.certificates.keystore.confirmation.tenantContent") }
                            </ConfirmationModal.Content>
                        </>
                    ) : (
                        < ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("devPortal:components.certificates.keystore.confirmation.content") }
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
            description: t("devPortal:components.certificates.keystore.notifications.download.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("devPortal:components.certificates.keystore.notifications.download.success.message")
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
    };

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
    };

    /**
     * This renders the modal that displays the certificate.
     * 
     * @returns {ReactElement} The certificate modal.
     */
    const renderCertificateModal = (): ReactElement => {
        return (
            <Modal
                className="certificate-display"
                dimmer="blurring"
                size="tiny"
                open={ certificateModal }
                onClose={ () => { setCertificateModal(false) } }
                data-testid={ `${ testId }-certificate-display-modal` }
            >
                <Modal.Header>
                    <div className="certificate-ribbon">
                        <CertificateIllustrations.ribbon.ReactComponent />
                        <div className="certificate-alias">
                            View Certificate - {
                            certificateDisplay?.alias
                                ? certificateDisplay?.alias
                                : certificateDisplay?.issuerDN && (
                                    CertificateManagementUtils.searchIssuerDNAlias(certificateDisplay?.issuerDN)
                            )
                        }
                        </div><br/>
                        <div className="certificate-serial">Serial Number: { certificateDisplay?.serialNumber }</div>
                    </div>
                </Modal.Header>
                <Modal.Content className="certificate-content">
                    <CertificateDisplay data-testid={ `${ testId }-certificate` } certificate={ certificateDisplay } />
                </Modal.Content>
            </Modal>
        )
    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("devPortal:components.certificates.keystore.placeholders.emptySearch.action") }
                        </LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ t("devPortal:components.certificates.keystore.placeholders.emptySearch.title") }
                    subtitle={ [
                        t("devPortal:components.certificates.keystore.placeholders.emptySearch.subtitle")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (list?.length === 0 && onEmptyListPlaceholderActionClick) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="cloud upload" />
                            { t("devPortal:components.certificates.keystore.placeholders.emptyList.action") }
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ t("devPortal:components.certificates.keystore.placeholders.emptyList.title") }
                    subtitle={ [
                        t("devPortal:components.certificates.keystore.placeholders.emptyList.subtitle")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    /**
     * Evaluates the permission based on scopes.
     *
     * @return {boolean} If permitted or not.
     */
    const hasRequiredPermissions = (): boolean => {
        if (type === KEYSTORE
            && hasRequiredScopes(featureConfig?.certificates, featureConfig?.certificates?.scopes?.read)) {

            return true;
        }

        return type === TRUSTSTORE
            && hasRequiredScopes(featureConfig?.certificates, featureConfig?.certificates?.scopes?.read);
    };

    return (
        <>
            { deleteID && showDeleteConfirm() }
            { certificateModal && renderCertificateModal() }
            <ResourceList
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                data-testid={ testId }
            >
                {
                    list && list instanceof Array && list.length > 0
                        ? hasRequiredPermissions()
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
                                                data-testid={ `${ testId }-item-image` }
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
                                                                        ?? t("devPortal:components.certificates." +
                                                                            "keystore.notifications.getAlias." +
                                                                            "genericError.description"),
                                                                    level: AlertLevels.ERROR,
                                                                    message: error?.message
                                                                        ?? t("devPortal:components.certificates." +
                                                                            "keystore.notifications.getAlias." +
                                                                            "genericError.message")
                                                                }));
                                                            })
                                                    } else {
                                                        retrieveClientCertificate(certificate.alias, true)
                                                            .then((response) => {
                                                                displayCertificate(certificate, response);
                                                            }).catch(error => {
                                                                dispatch(addAlert({
                                                                    description: error?.description
                                                                        ?? t("devPortal:components.certificates." +
                                                                            "keystore.notifications.getCertificate." +
                                                                            "genericError.description"),
                                                                    level: AlertLevels.ERROR,
                                                                    message: error?.message
                                                                        ?? t("devPortal:components.certificates." +
                                                                            "keystore.notifications.getCertificate." +
                                                                            "genericError.message")
                                                                }));
                                                            })
                                                    }
                                                },
                                                popupText: t("common:view"),
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
                                                                        ?? t("devPortal:components.certificates." +
                                                                            "keystore.notifications.getAlias." +
                                                                            "genericError.description"),
                                                                    level: AlertLevels.ERROR,
                                                                    message: error?.message
                                                                        ?? t("devPortal:components.certificates." +
                                                                            "keystore.notifications.getAlias." +
                                                                            "genericError.message")
                                                                }));
                                                            })
                                                    } else {
                                                        retrieveClientCertificate(certificate.alias, true)
                                                            .then((response) => {
                                                                exportCertificate(certificate.alias, response);
                                                            }).catch(error => {
                                                                dispatch(addAlert({
                                                                    description: error?.description
                                                                        ?? t("devPortal:components.certificates." +
                                                                            "keystore.notifications.getCertificate." +
                                                                            "genericError.description"),
                                                                    level: AlertLevels.ERROR,
                                                                    message: error?.message
                                                                        ?? t("devPortal:components.certificates." +
                                                                            "keystore.notifications.getCertificate." +
                                                                            "genericError.message")
                                                                }));
                                                            })
                                                    }
                                                },
                                                popupText: t("common:export"),
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
                                                popupText: t("common:delete"),
                                                type: "dropdown"
                                            }
                                        ] }
                                        actionsFloated="right"
                                        itemHeader={ certificate.alias }
                                        data-testid={ `${ testId }-item` }
                                    />
                                )
                            })
                            : null
                        : showPlaceholders()
                }
            </ResourceList>
        </>
    )
};

/**
 * Default props for the component.
 */
CertificatesList.defaultProps = {
    "data-testid": "certificates-list"
};
