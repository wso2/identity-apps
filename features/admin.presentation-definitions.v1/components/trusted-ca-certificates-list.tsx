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

import { CertificateManagementConstants } from "@wso2is/core/constants";
import { CertificateValidity, DisplayCertificate, IdentifiableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Form } from "@wso2is/forms";
import {
    ConfirmationModal,
    Popup,
    ResourceList,
    ResourceListActionInterface,
    ResourceListItem,
    UserAvatar
} from "@wso2is/react-components";
import React, { FC, PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";

interface TrustedCaCertificatesListProps extends IdentifiableComponentInterface {
    trustedCaPems: string[];
    onRemove: (index: number) => void;
    isReadOnly?: boolean;
}

const FORM_ID: string = "trusted-ca-certificates-list-form";

/**
 * List of trusted CA certificates managed entirely in local React state.
 * Calls `onRemove(index)` for deletions — no API calls are made here.
 * The parent commits changes via its Update button.
 */
export const TrustedCaCertificatesList: FC<TrustedCaCertificatesListProps> = (
    props: PropsWithChildren<TrustedCaCertificatesListProps>
): ReactElement => {

    const {
        ["data-componentid"]: testId,
        trustedCaPems,
        onRemove,
        isReadOnly = false
    } = props;

    const { t } = useTranslation();

    const [ displayingCertificates, setDisplayingCertificates ] = useState<ReadonlyArray<DisplayCertificate>>();
    const [ showCertificateModal, setShowCertificateModal ] = useState<boolean>(false);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);

    useEffect(() => {
        bindCertificatesToState();
    }, [ trustedCaPems ]);

    const bindCertificatesToState = (): void => {
        if (trustedCaPems.length > 0) {
            const certificatesList: DisplayCertificate[] = trustedCaPems.map((certificate: string) => {
                if (CertificateManagementUtils.canSafelyParseCertificate(certificate)) {
                    return CertificateManagementUtils.displayCertificate(null, certificate);
                }

                return CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE;
            });

            setDisplayingCertificates([ ...certificatesList ]);
        } else {
            setDisplayingCertificates([]);
        }
    };

    const handleViewCertificate = (certificate: DisplayCertificate) => {
        setCertificateDisplay(certificate);
        setShowCertificateModal(true);
    };

    const createValidityLabel = (validFrom: Date, validTill: Date, issuer: string): ReactElement => {
        let icon: SemanticICONS;
        let iconColor: SemanticCOLORS;

        const validity: CertificateValidity = CertificateManagementUtils.determineCertificateValidityState({
            from: validFrom,
            to: validTill
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

        const expiryLabel: string = validTill
            ? "Expiry date: " + new Date(validTill).toLocaleDateString("en-GB")
            : "";

        return (
            <React.Fragment>
                { issuer + CertificateManagementConstants.SPACE_CHARACTER }
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

    const createDummyValidityLabel = (certificate: DisplayCertificate): ReactNode => (
        <span className="with-muted-list-item-header">
            Unable to visualize the certificate details&nbsp;
            <Popup
                trigger={
                    <Icon
                        onClick={ () => handleViewCertificate(certificate) }
                        name="info circle"
                        color="grey"
                    />
                }
                content="Click for more info"
                inverted
                position="top left"
                size="mini"
            />
        </span>
    );

    const createDescription = (validFrom: Date, validTill: Date): string =>
        CertificateManagementUtils.getValidityPeriodInHumanReadableFormat(validFrom, validTill);

    const createCertificateActions = (certificate: DisplayCertificate, index: number) => ([
        {
            "data-componentid": `${testId}-view-cert-${index}-button`,
            disabled: certificate?.infoUnavailable,
            hidden: certificate?.infoUnavailable,
            icon: "eye",
            onClick: () => handleViewCertificate(certificate),
            popupText: "Preview",
            type: "button"
        },
        {
            "data-componentid": `${testId}-delete-cert-${index}-button`,
            icon: "trash alternate",
            onClick: () => onRemove(index),
            popupText: "Remove",
            type: "button"
        }
    ] as (ResourceListActionInterface & IdentifiableComponentInterface)[]);

    const createCertificateResourceAvatar = (certificate: DisplayCertificate): ReactElement => (
        <UserAvatar
            name={
                certificate?.infoUnavailable
                    ? CertificateManagementConstants.QUESTION_MARK
                    : CertificateManagementUtils.searchIssuerDNAlias(certificate?.issuerDN)
            }
            size="mini"
            floated="left"
        />
    );

    return (
        <Form id={ FORM_ID } onSubmit={ CertificateManagementConstants.NO_OPERATIONS } uncontrolledForm={ true }>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <ResourceList
                            fill
                            relaxed={ false }
                            className="application-list"
                            isLoading={ false }
                            loadingStateOptions={ { count: 2, imageType: "circular" } }
                            readOnly={ isReadOnly }
                        >
                            { displayingCertificates?.map((certificate: DisplayCertificate, index: number) => (
                                <ResourceListItem
                                    key={ index }
                                    actionsColumnWidth={ 3 }
                                    descriptionColumnWidth={ 9 }
                                    actions={ createCertificateActions(certificate, index) }
                                    actionsFloated="right"
                                    avatar={ createCertificateResourceAvatar(certificate) }
                                    itemHeader={
                                        certificate?.infoUnavailable
                                            ? createDummyValidityLabel(certificate)
                                            : createValidityLabel(
                                                certificate.validFrom,
                                                certificate.validTill,
                                                CertificateManagementUtils.searchIssuerDNAlias(certificate?.issuerDN)
                                            )
                                    }
                                    itemDescription={
                                        certificate?.infoUnavailable
                                            ? null
                                            : createDescription(certificate.validFrom, certificate.validTill)
                                    }
                                />
                            )) }
                        </ResourceList>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { showCertificateModal && (
                <ConfirmationModal
                    type="info"
                    open={ showCertificateModal }
                    onClose={ () => setShowCertificateModal(false) }
                    primaryAction={ t("common:close") }
                    onPrimaryActionClick={ () => setShowCertificateModal(false) }
                    data-componentid={ `${testId}-view-certificate-modal` }
                    closeOnDimmerClick={ true }
                >
                    <ConfirmationModal.Header>Certificate Details</ConfirmationModal.Header>
                    <ConfirmationModal.Content>
                        { certificateDisplay && (
                            <pre style={ { fontSize: "0.8em", overflowX: "auto", whiteSpace: "pre-wrap" } }>
                                { JSON.stringify(certificateDisplay, null, 2) }
                            </pre>
                        ) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </Form>
    );
};

TrustedCaCertificatesList.defaultProps = {
    "data-componentid": "trusted-ca-certificates-list"
};
