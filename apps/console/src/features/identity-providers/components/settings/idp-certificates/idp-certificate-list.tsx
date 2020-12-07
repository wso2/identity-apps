/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Forms } from "@wso2is/forms";
import {
    Certificate as CertificateDisplay,
    EmptyPlaceholder,
    GenericIcon,
    PrimaryButton,
    ResourceList,
    ResourceListItem,
    UserAvatar
} from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Icon, Modal, Popup, Segment, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { UIConstants, getCertificateIllustrations, getEmptyPlaceholderIllustrations } from "../../../../core";
import { IdentityProviderInterface } from "../../../models";
import { AddIDPCertificateWizard } from "../../wizards";

/**
 * Proptypes for the IDP certificate list component.
 */
interface IdpCertificatesPropsListInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: IdentityProviderInterface;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 * IDP certificates component.
 *
 * @param {IdpCertificatesPropsListInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const IdpCertificatesListComponent: FunctionComponent<IdpCertificatesPropsListInterface> = (
    props: IdpCertificatesPropsListInterface
): ReactElement => {

    const {
        editingIDP,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ certificates, setCertificates ] = useState<DisplayCertificate[]>(null);
    const [ certificateModal, setCertificateModal ] = useState<boolean>(false);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    useEffect(() => {
        if (editingIDP?.certificate?.certificates?.length > 0) {
            const certificatesList: DisplayCertificate[] = [];
            editingIDP?.certificate?.certificates?.map((certificate) => {
                certificatesList?.push(CertificateManagementUtils.displayCertificate(null, certificate));
            });
            setCertificates(certificatesList);
        }
    }, [ editingIDP?.certificate?.certificates ]);

    useEffect(() => {
        if (!certificateDisplay) {
            return;
        }
        setCertificateModal(true);
    }, [ certificateDisplay ]);

    useEffect(() => {
        if (!certificateModal) {
            setCertificateDisplay(null);
        }
    }, [ certificateModal ]);

    /**
     * Shows the certificate details in modal.
     */
    const showCertificateModal = (): ReactElement => {
        return (
            <Modal
                className="certificate-display"
                dimmer="blurring"
                size="tiny"
                open={ certificateModal }
                onClose={ () => {
                    setCertificateModal(false);
                } }
                data-testid={ `${ testId }-view-certificate-modal` }
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
     * Show the certificate details.
     *
     * @param certificate
     */
    const handleViewCertificate = (certificate: DisplayCertificate) => {
        setCertificateDisplay(certificate);
    };

    /**
     * Creates the resource item description.
     *
     * @param validFrom
     * @param validTill
     */
    const showDescription = (validFrom: Date, validTill: Date): string => {
        const isValid = new Date() >= validFrom && new Date() <= validTill;
        const now = moment(new Date());
        const recievedDate = moment(validTill);
        let description = "";

        isValid
            ? description = "Valid for " + moment.duration(now.diff(recievedDate)).humanize()
            : description = "Expired " + moment.duration(now.diff(recievedDate)).humanize() + " ago";

        return description;
    };

    /**
     * Creates the resource item header.
     *
     * @param validFrom
     * @param validTill
     * @param issuer
     */
    const showValidityLabel = (validFrom: Date, validTill: Date, issuer: string): ReactElement => {
        let icon: SemanticICONS = null;
        let iconColor: SemanticCOLORS = null;

        const currentDate = moment(new Date());
        const expiryDate = moment(validTill);
        const isValid = new Date() >= validFrom && new Date() <= validTill;

        if (isValid) {
            if (Math.abs(moment.duration(currentDate.diff(expiryDate)).months()) > 1) {
                icon = "check circle";
                iconColor = "green";
            } else {
                icon = "exclamation circle";
                iconColor = "yellow";
            }
        } else {
            icon = "times circle";
            iconColor = "red";
        }

        return (
            <>
                { issuer + " " }
                <Popup
                    trigger={ <Icon name={ icon } color={ iconColor } /> }
                    content={ "Expiry date: " + expiryDate.format("DD/MM/YYYY") }
                    inverted
                    position="top left"
                    size="mini"
                />
            </>
        );
    };

    return (
        <Forms>
            {
                editingIDP?.certificate?.certificates?.length >= 1 ? (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                <PrimaryButton
                                    floated="right"
                                    onClick={ () => setShowWizard(true) }
                                    data-testid={ `${testId}-add-certificate-button` }
                                >
                                    <Icon name="add"/>
                                    { t("console:develop.features.idp.buttons.addCertificate") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <ResourceList
                                    className="application-list"
                                    isLoading={ isLoading }
                                    loadingStateOptions={ {
                                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                        imageType: "circular"
                                    } }
                                >
                                    {
                                        certificates?.map((certificate, index) => (
                                            <ResourceListItem
                                                key={ index }
                                                actions={ [
                                                    {
                                                        "data-testid": `${ testId }-edit-cert-${ index }-button`,
                                                        icon: "eye",
                                                        onClick: () => handleViewCertificate(certificate),
                                                        popupText: t("console:manage.features.users.usersList.list." +
                                                            "iconPopups.edit"),
                                                        type: "button"
                                                    },
                                                    {
                                                        "data-testid": `${ testId }-delete-cert-${ index }-button`,
                                                        icon: "trash alternate",
                                                        onClick: (): void => {
                                                            return null;
                                                        },
                                                        popupText: t("console:manage.features.users.usersList.list." +
                                                            "iconPopups.delete"),
                                                        type: "button"
                                                    }
                                                ] }
                                                actionsFloated="right"
                                                avatar={ (
                                                    <UserAvatar
                                                        name={
                                                            CertificateManagementUtils.searchIssuerDNAlias(
                                                                certificate?.issuerDN)
                                                        }
                                                        size="mini"
                                                        floated="left"
                                                    />
                                                ) }
                                                itemHeader={ showValidityLabel(
                                                    certificate.validFrom,
                                                    certificate.validTill,
                                                    CertificateManagementUtils.searchIssuerDNAlias(
                                                        certificate?.issuerDN)
                                                ) }
                                                itemDescription={ showDescription(certificate.validFrom,
                                                    certificate.validTill) }
                                            />
                                        ))
                                    }
                                </ResourceList>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 8 }>
                                <Divider hidden/>
                                <Segment>
                                    <EmptyPlaceholder
                                        title={ t("console:develop.features.idp.placeHolders." +
                                            "emptyCertificateList.title") }
                                        image={ getEmptyPlaceholderIllustrations().emptyList }
                                        subtitle={ [
                                            t("console:develop.features.idp.placeHolders." +
                                                "emptyCertificateList.subtitles.0"),
                                            t("console:develop.features.idp.placeHolders." +
                                                "emptyCertificateList.subtitles.1")
                                        ] }
                                        imageSize="tiny"
                                        action={ (
                                            <PrimaryButton
                                                onClick={ () => setShowWizard(true) }
                                                data-testid={ `${ testId }-emptyPlaceholder-add-certificate-button` }
                                                type="button"
                                            >
                                                <Icon name="add"/>
                                                { t("console:develop.features.idp.buttons.addCertificate") }
                                            </PrimaryButton>
                                        ) }
                                        data-testid={ `${testId}-empty-placeholder` }
                                    />
                                </Segment>
                                <Divider hidden/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
            {
                showWizard && (
                    <AddIDPCertificateWizard
                        closeWizard={ () => setShowWizard(false) }
                        idp={ editingIDP }
                        onUpdate={ onUpdate }
                        data-testid={ `${ testId }-add-certificate-wizard` }
                    />
                )
            }
            { showCertificateModal() }
        </Forms>
    );
};

/**
 * Default proptypes for the IDP certificate list component.
 */
IdpCertificatesListComponent.defaultProps = {
    "data-testid": "idp-certificate-list"
};
