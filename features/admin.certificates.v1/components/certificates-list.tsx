/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AppState, FeatureConfigInterface, UIConstants, getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1";
import { CertificateManagementConstants } from "@wso2is/core/constants";
import { IdentityAppsError } from "@wso2is/core/errors";
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
import { Dispatch } from "redux";
import { Header, Icon, Modal, SemanticICONS } from "semantic-ui-react";
import {
    deleteKeystoreCertificate,
    retrieveCertificateAlias,
    retrieveClientCertificate,
    retrievePublicCertificate
} from "../api";
import { getCertificateIllustrations } from "../configs";

const KEYSTORE: string = "keystore";

const TRUSTSTORE: string = "truststore";

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
 * @param props - Props injected to the component.
 * @returns Certificate listing component.
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

    const dispatch : Dispatch = useDispatch();

    /**
     * Delete a certificate
     *
     * @param certificate - Deleting certificate.
     */
    const initDelete = (certificate: Certificate): void => {
        retrieveCertificateAlias(certificate.alias, true).then((response : any)=> {
            setDeleteCertificatePem(response);
            setDeleteID(certificate.alias);
            setDeleteConfirm(true);
        }).catch((error : IdentityAppsError) => {
            dispatch(addAlert({
                description: error?.description
                    || t("certificates:keystore.notifications." +
                        "getAlias.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message
                    || t("certificates:keystore.notifications." +
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
        retrievePublicCertificate(true).then((response : any) => {
            setTenantCertificate(decodeCertificate(response).serialNumber);
        }).catch((error : IdentityAppsError) => {
            dispatch(addAlert({
                description: error?.description
                    ?? t("certificates:keystore.notifications." +
                        "getPublicCertificate.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message
                    ?? t("certificates:keystore.notifications." +
                        "getPublicCertificate.genericError.description")
            }));
        });
    }, []);

    /**
     * Shows the delete confirmation modal.
     *
     * @returns The delete confirmation modal.
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
                        <Trans
                            i18nKey="certificates:keystore.confirmation.hint"
                            i18nOptions={ { id: deleteID } }
                        >
                           Please type <strong>{ deleteID }</strong> to confirm.
                        </Trans>
                    </p>)
                }
                assertionType={ isTenantCertificate ? "input" : null }
                primaryAction={ t("certificates:keystore.confirmation.primaryAction") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ closeDeleteConfirm }
                onPrimaryActionClick={ (): void => {
                    deleteKeystoreCertificate(deleteID).then(() => {
                        dispatch(addAlert({
                            description: t("certificates:keystore.notifications." +
                                "deleteCertificate.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("certificates:keystore.notifications." +
                                "deleteCertificate.success.message")
                        }));
                        update();
                    }).catch((error: IdentityAppsError) => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? t("certificates:keystore.notifications." +
                                    "deleteCertificate.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message
                                ?? t("certificates:keystore.notifications." +
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
                    { t("certificates:keystore.confirmation.header") }
                </ConfirmationModal.Header>
                { isTenantCertificate
                    ? (
                        <>
                            <ConfirmationModal.Message
                                attached
                                negative
                                data-testid={ `${ testId }-delete-confirmation-modal-message` }
                            >
                                { t("certificates:keystore.confirmation.message") }
                            </ConfirmationModal.Message>
                            < ConfirmationModal.Content
                                data-testid={ `${ testId }-delete-confirmation-modal-content` }
                            >
                                { t("certificates:keystore.confirmation.tenantContent") }
                            </ConfirmationModal.Content>
                        </>
                    ) : (
                        < ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("certificates:keystore.confirmation.content") }
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
     * @param name -  The alias of the certificate.
     * @param pem - The PEM encoded certificate content.
     */
    const exportCertificate = (name: string, pem: string): void => {
        const certificate : X509 = decodeCertificate(pem);
        const hex : string = certificate.hex;

        const byteArray : Uint8Array= new Uint8Array(hex.length / 2);

        for (let x:number = 0; x < byteArray.length; x++) {
            byteArray[ x ] = parseInt(hex.substr(x * 2, 2), 16);
        }

        const blob : Blob = new Blob([ byteArray ], {
            type: "application/x-x509-ca-cert"
        });

        saveAs(blob, name + ".cer");

        dispatch(addAlert({
            description: t("certificates:keystore.notifications.download.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("certificates:keystore.notifications.download.success.message")
        }));
    };

    /**
     * Converts a PEM encoded string to a X509 certificate object.
     *
     * @param pem - The PEM encoded certificate content.
     * @returns The X509 Certificate object.
     */
    const decodeCertificate = (pem: string): X509 => {
        const pemValue : string[] = pem?.split("\n");

        // appends -----END CERTIFICATE-----.
        pemValue?.push(CertificateManagementConstants.CERTIFICATE_END);

        // appends a new line.
        pemValue?.push(CertificateManagementConstants.END_LINE);

        // pushes -----BEGIN CERTIFICATE----- to the top.
        pemValue?.unshift(CertificateManagementConstants.CERTIFICATE_BEGIN);

        const pemCert : string = pemValue?.join("\n");

        const cert: X509 = new X509();

        cert.readCertPEM(pemCert);

        return cert;
    };

    /**
     * This serializes the certificate content to a displayable format.
     *
     * @param certificate - The Certificate object returned by teh API endpoints.
     * @param pem - The PEM encoded certificate content.
     */
    const displayCertificate = (certificate: Certificate, pem: string): void => {
        const cert: X509 = decodeCertificate(pem);

        const displayCertificate: DisplayCertificate = {
            alias: certificate.alias,
            issuerDN: cert.getIssuerString().split("/").slice(1)
                .map((attribute : string) => {
                    return {
                        [ attribute.split("=")[ 0 ] ]: attribute.split("=")[ 1 ]
                    };
                }),
            serialNumber: cert.getSerialNumberHex(),
            subjectDN: cert.getSubjectString().split("/").slice(1)
                .map((attribute : string) => {
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
     * @returns The certificate modal.
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
                            issuerDN: t("certificates:keystore.summary.issuerDN"),
                            subjectDN: t("certificates:keystore.summary.subjectDN"),
                            validFrom: t("certificates:keystore.summary.validFrom"),
                            validTill: t("certificates:keystore.summary.validTill"),
                            version: t("certificates:keystore.summary.version")
                        } }
                    />
                </Modal.Content>
            </Modal>
        );
    };

    /**
     * Shows list placeholders.
     *
     * @returns Placeholders.
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
                            { t("certificates:keystore.placeholders.emptyList.action") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("certificates:keystore.placeholders.emptyList.title") }
                    subtitle={ [
                        t("certificates:keystore.placeholders.emptyList.subtitle")
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
     * @returns If permitted or not.
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
     * @param certificate - Certificate.
     */
    const handleCertificateView = (certificate: Certificate): void => {
        if (type === KEYSTORE) {
            retrieveCertificateAlias(certificate.alias, true)
                .then((response: string) => {
                    displayCertificate(certificate, response);
                }).catch((error : IdentityAppsError) => {
                    dispatch(addAlert({
                        description: error?.description
                            ?? t("certificates:keystore.notifications.getAlias." +
                                "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            ?? t("certificates:keystore.notifications.getAlias." +
                                "genericError.message")
                    }));
                });

            return;
        }

        retrieveClientCertificate(certificate.alias, true)
            .then((response : any) => {
                displayCertificate(certificate, response);
            }).catch((error : IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description
                        ?? t("certificates:keystore.notifications.getCertificate." +
                            "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        ?? t("certificates:keystore.notifications.getCertificate." +
                            "genericError.message")
                }));
            });
    };

    /**
     * Handles certificate download.
     * @param certificate - Certificate.
     */
    const handleCertificateDownload = (certificate: Certificate) => {
        if (type === KEYSTORE) {
            retrieveCertificateAlias(certificate.alias, true)
                .then((response: string) => {
                    exportCertificate(certificate.alias, response);
                }).catch((error : IdentityAppsError) => {
                    dispatch(addAlert({
                        description: error?.description
                            ?? t("certificates:keystore.notifications.getAlias." +
                                "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            ?? t("certificates:keystore.notifications.getAlias." +
                                "genericError.message")
                    }));
                });

            return;
        }

        retrieveClientCertificate(certificate.alias, true)
            .then((response : any) => {
                exportCertificate(certificate.alias, response);
            }).catch((error : IdentityAppsError) => {
                dispatch(addAlert({
                    description: error?.description
                        ?? t("certificates:keystore.notifications.getCertificate." +
                            "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        ?? t("certificates:keystore.notifications.getCertificate." +
                            "genericError.message")
                }));
            });
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
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
                title: t("certificates:keystore.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("certificates:keystore.list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
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
                    const isTenant : boolean = tenantDomain === alias || authTenantDomain === alias;

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
