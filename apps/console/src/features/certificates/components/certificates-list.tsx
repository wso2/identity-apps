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

import { CertificateManagementConstants } from "@wso2is/core/constants";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertLevels,
    Certificate,
    DisplayCertificate,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import {
    AnimatedAvatar,
    AppAvatar,
    Certificate as CertificateDisplay,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { saveAs } from "file-saver";
import { X509, zulutodate } from "jsrsasign";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, Modal, SemanticICONS } from "semantic-ui-react";
import { AppState, FeatureConfigInterface, UIConstants, getEmptyPlaceholderIllustrations } from "../../core";
import {
    deleteKeystoreCertificate,
    retrieveCertificateAlias,
    retrieveClientCertificate,
    retrievePublicCertificate
} from "../api";
import { getCertificateIllustrations } from "../configs";

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
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
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
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, certificate: Certificate) => void;
    /**
     * Search query for the list.
     */
    searchQuery: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
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
        advancedSearch,
        defaultListItemLimit,
        featureConfig,
        isLoading,
        list,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        onListItemClick,
        searchQuery,
        selection,
        showListItemActions,
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

    const tenantDomain: string = useSelector<AppState, string>(
        (state: AppState) => state.config.deployment.tenant
    );
    const authTenantDomain: string = useSelector<AppState, string>(
        (state: AppState) => state.auth.tenantDomain
    );
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

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
                    || t("console:manage.features.certificates.keystore.notifications." +
                        "getAlias.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message
                    || t("console:manage.features.certificates.keystore.notifications." +
                        "getAlias.genericError.message")
            }));
        });
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
                    ?? t("console:manage.features.certificates.keystore.notifications." +
                        "getPublicCertificate.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message
                    ?? t("console:manage.features.certificates.keystore.notifications." +
                        "getPublicCertificate.genericError.description")
            }));
        });
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
                type="negative"
                open={ deleteConfirm }
                assertion={ isTenantCertificate ? deleteID : null }
                assertionHint={
                    (<p>
                        <Trans i18nKey="console:manage.features.certificates.keystore.confirmation.hint">
                           Please type <strong>{ { id:deleteID } }</strong> to confirm.
                        </Trans>
                    </p>)
                }
                assertionType={ isTenantCertificate ? "input" : null }
                primaryAction={ t("console:manage.features.certificates.keystore.confirmation.primaryAction") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ closeDeleteConfirm }
                onPrimaryActionClick={ (): void => {
                    deleteKeystoreCertificate(deleteID).then(() => {
                        dispatch(addAlert({
                            description: t("console:manage.features.certificates.keystore.notifications." +
                                "deleteCertificate.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("console:manage.features.certificates.keystore.notifications." +
                                "deleteCertificate.success.message")
                        }));
                        update();
                    }).catch((error) => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? t("console:manage.features.certificates.keystore.notifications." +
                                    "deleteCertificate.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message
                                ?? t("console:manage.features.certificates.keystore.notifications." +
                                    "deleteCertificate.genericError.message")
                        }));
                    }).finally(() => {
                        closeDeleteConfirm();
                    });
                } }
                data-testid={ `${ testId }-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ testId }-delete-confirmation-modal-header` }
                >
                    { t("console:manage.features.certificates.keystore.confirmation.header") }
                </ConfirmationModal.Header>
                { isTenantCertificate
                    ? (
                        <>
                            <ConfirmationModal.Message
                                attached
                                negative
                                data-testid={ `${ testId }-delete-confirmation-modal-message` }
                            >
                                { t("console:manage.features.certificates.keystore.confirmation.message") }
                            </ConfirmationModal.Message>
                            < ConfirmationModal.Content
                                data-testid={ `${ testId }-delete-confirmation-modal-content` }
                            >
                                { t("console:manage.features.certificates.keystore.confirmation.tenantContent") }
                            </ConfirmationModal.Content>
                        </>
                    ) : (
                        < ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("console:manage.features.certificates.keystore.confirmation.content") }
                        </ConfirmationModal.Content>
                    )
                }
            </ConfirmationModal>
        );
    };

    /**
     * This converts a PEM-encoded certificate to a
     * binary file and saves it to the disk.
     *
     * @param {string} name The alias of the certificate.
     * @param {string} pem The PEM encoded certificate content.
     */
    const exportCertificate = (name: string, pem: string): void => {
        const certificate = decodeCertificate(pem);
        const hex = certificate.hex;

        const byteArray = new Uint8Array(hex.length / 2);

        for (let x = 0; x < byteArray.length; x++) {
            byteArray[ x ] = parseInt(hex.substr(x * 2, 2), 16);
        }

        const blob = new Blob([ byteArray ], {
            type: "application/x-x509-ca-cert"
        });

        saveAs(blob, name + ".cer");

        dispatch(addAlert({
            description: t("console:manage.features.certificates.keystore.notifications.download.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("console:manage.features.certificates.keystore.notifications.download.success.message")
        }));
    };

    /**
     * Converts a PEM encoded string to a X509 certificate object.
     *
     * @param {string} pem The PEM encoded certificate content.
     *
     * @returns {X509} The X509 Certificate object.
     */
    const decodeCertificate = (pem: string): X509 => {
        const pemValue = pem?.split("\n");

        // appends -----END CERTIFICATE-----.
        pemValue?.push(CertificateManagementConstants.CERTIFICATE_END);

        // appends a new line.
        pemValue?.push(CertificateManagementConstants.END_LINE);

        // pushes -----BEGIN CERTIFICATE----- to the top.
        pemValue?.unshift(CertificateManagementConstants.CERTIFICATE_BEGIN);

        const pemCert = pemValue?.join("\n");

        const cert: X509 = new X509();

        cert.readCertPEM(pemCert);

        return cert;
    };

    /**
     * This serializes the certificate content to a displayable format.
     *
     * @param {Certificate} certificate The Certificate object returned by teh API endpoints.
     * @param {string} pem The PEM encoded certificate content.
     */
    const displayCertificate = (certificate: Certificate, pem: string): void => {
        const cert: X509 = decodeCertificate(pem);

        const displayCertificate: DisplayCertificate = {
            alias: certificate.alias,
            issuerDN: cert.getIssuerString().split("/").slice(1)
                .map(attribute => {
                    return {
                        [ attribute.split("=")[ 0 ] ]: attribute.split("=")[ 1 ]
                    };
                }),
            serialNumber: cert.getSerialNumberHex(),
            subjectDN: cert.getSubjectString().split("/").slice(1)
                .map(attribute => {
                    return {
                        [ attribute.split("=")[ 0 ] ]: attribute.split("=")[ 1 ]
                    };
                }),
            validFrom: new Date(zulutodate(cert.getNotBefore()).toUTCString()),
            validTill: new Date(zulutodate(cert.getNotAfter()).toUTCString()),
            version: cert.getVersion()
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
                onClose={ () => { setCertificateModal(false); } }
                data-testid={ `${ testId }-certificate-display-modal` }
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
                    <CertificateDisplay
                        data-testid={ `${ testId }-certificate` }
                        certificate={ certificateDisplay }
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
                            { t("console:manage.placeholders.emptySearchResult.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:manage.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:manage.placeholders.emptySearchResult.subtitles.1")
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
                            { t("console:manage.features.certificates.keystore.placeholders.emptyList.action") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("console:manage.features.certificates.keystore.placeholders.emptyList.title") }
                    subtitle={ [
                        t("console:manage.features.certificates.keystore.placeholders.emptyList.subtitle")
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
            && hasRequiredScopes(
                featureConfig?.certificates, featureConfig?.certificates?.scopes?.read, allowedScopes
            )) {

            return true;
        }

        return type === TRUSTSTORE
            && hasRequiredScopes(featureConfig?.certificates, featureConfig?.certificates?.scopes?.read, allowedScopes);
    };

    /**
     * Handles certificate view.
     * @param {Certificate} certificate - Certificate.
     */
    const handleCertificateView = (certificate: Certificate): void => {
        if (type === KEYSTORE) {
            retrieveCertificateAlias(certificate.alias, true)
                .then((response: string) => {
                    displayCertificate(certificate, response);
                }).catch(error => {
                    dispatch(addAlert({
                        description: error?.description
                            ?? t("console:manage.features.certificates.keystore.notifications.getAlias." +
                                "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            ?? t("console:manage.features.certificates.keystore.notifications.getAlias." +
                                "genericError.message")
                    }));
                });

            return;
        }

        retrieveClientCertificate(certificate.alias, true)
            .then((response) => {
                displayCertificate(certificate, response);
            }).catch(error => {
                dispatch(addAlert({
                    description: error?.description
                        ?? t("console:manage.features.certificates.keystore.notifications.getCertificate." +
                            "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        ?? t("console:manage.features.certificates.keystore.notifications.getCertificate." +
                            "genericError.message")
                }));
            });
    };

    /**
     * Handles certificate download.
     * @param {Certificate} certificate - Certificate.
     */
    const handleCertificateDownload = (certificate: Certificate) => {
        if (type === KEYSTORE) {
            retrieveCertificateAlias(certificate.alias, true)
                .then((response: string) => {
                    exportCertificate(certificate.alias, response);
                }).catch(error => {
                    dispatch(addAlert({
                        description: error?.description
                            ?? t("console:manage.features.certificates.keystore.notifications.getAlias." +
                                "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            ?? t("console:manage.features.certificates.keystore.notifications.getAlias." +
                                "genericError.message")
                    }));
                });

            return;
        }

        retrieveClientCertificate(certificate.alias, true)
            .then((response) => {
                exportCertificate(certificate.alias, response);
            }).catch(error => {
                dispatch(addAlert({
                    description: error?.description
                        ?? t("console:manage.features.certificates.keystore.notifications.getCertificate." +
                            "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        ?? t("console:manage.features.certificates.keystore.notifications.getCertificate." +
                            "genericError.message")
                }));
            });
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (certificate: Certificate): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ testId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ certificate.alias }
                                    size="mini"
                                    data-testid={ `${ testId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ testId }-item-image` }
                        />
                        <Header.Content>
                            { certificate.alias }
                        </Header.Content>
                    </Header>
                ),
                title: t("console:manage.features.certificates.keystore.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:manage.features.certificates.keystore.list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return [];
        }

        return [
            {
                icon: (): SemanticICONS => "eye",
                onClick: (e: SyntheticEvent, certificate: Certificate): void => handleCertificateView(certificate),
                popupText: (): string => t("common:view"),
                renderer: "semantic-icon"
            },
            {
                icon: (): SemanticICONS => "download",
                onClick: (e: SyntheticEvent, certificate: Certificate): void => handleCertificateDownload(certificate),
                popupText: (): string => t("common:export"),
                renderer: "semantic-icon"
            },
            {
                hidden: ({ alias }: Certificate): boolean => {
                    const hasScopes: boolean = hasRequiredScopes(
                        featureConfig?.certificates,
                        featureConfig?.certificates?.scopes?.delete,
                        allowedScopes
                    );
                    // Checks whether the alias of this certificate matches the tenant domain
                    // or the authenticated user's tenant domain.
                    const isTenant = tenantDomain === alias || authTenantDomain === alias;

                    return !(type === KEYSTORE && hasScopes) || isSuper || isTenant;
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, certificate: Certificate): void => initDelete(certificate),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <>
            { deleteID && showDeleteConfirm() }
            { certificateModal && renderCertificateModal() }
            <DataTable<Certificate>
                className="certificates-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ hasRequiredPermissions() && list }
                externalSearch={ advancedSearch }
                onRowClick={
                    (e: SyntheticEvent, certificate: Certificate): void => {
                        handleCertificateView(certificate);
                        onListItemClick && onListItemClick(e, certificate);
                    }
                }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
        </>
    );
};

/**
 * Default props for the component.
 */
CertificatesList.defaultProps = {
    "data-testid": "certificates-list",
    selection: true,
    showListItemActions: true
};
