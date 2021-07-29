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

import { DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Forms } from "@wso2is/forms";
import {
    Certificate as CertificateDisplay,
    EmptyPlaceholder,
    GenericIcon,
    PrimaryButton,
    ResourceList,
    ResourceListItem
} from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Icon, Modal, Popup, Segment, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { AddApplicationCertificateWizard } from "./add-certificate-wizard";
import { UIConstants, getCertificateIllustrations, getEmptyPlaceholderIllustrations } from "../../../../core";

/**
 * Proptypes for the Application certificate list component.
 */
interface ApplicationCertificatesPropsListInterface extends TestableComponentInterface {
    applicationCertificate: string;
    applicationName?: string;
    updatePEMValue: (value: string) => void;
}

/**
 * Application certificates list component.
 *
 * @param {ApplicationCertificatesPropsListInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ApplicationCertificatesListComponent: FunctionComponent<ApplicationCertificatesPropsListInterface> = (
    props: ApplicationCertificatesPropsListInterface
): ReactElement => {

    const {
        applicationCertificate,
        updatePEMValue,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ certificates, setCertificates ] = useState<DisplayCertificate[]>(null);
    const [ certificateModal, setCertificateModal ] = useState<boolean>(false);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    useEffect(() => {
        if (applicationCertificate) {
            const certificatesList: DisplayCertificate[] = [];
            certificatesList?.push(CertificateManagementUtils.displayCertificate(null, applicationCertificate));
            setCertificates(certificatesList);
        }
    }, [applicationCertificate]);

    useEffect(() => {
        if (!certificateDisplay) {
            return;
        }
        setCertificateModal(true);
    }, [certificateDisplay]);

    useEffect(() => {
        if (!certificateModal) {
            setCertificateDisplay(null);
        }
    }, [certificateModal]);

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
                data-testid={ `${testId}-view-certificate-modal` }
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
                        </div>
                        <br/>
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
     * Remove the certificate from the certificated list.
     * The path attribute of the patch request requires the certificate index.
     * At the moment, the index of the certificate to be deleted is obtained from the indexes of
     * @see certificates array. This may cause unexpected behaviours if the certificates array is manipulated
     * for some reason.
     *
     * @param certificateIndex
     */
    const deleteCertificate = () => {
        updatePEMValue("");
        setCertificates(null);
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
                    trigger={ <Icon name={ icon } color={ iconColor }/> }
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
                certificates ? (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <Divider hidden/>
                                <ResourceList
                                    className="application-list"
                                    fill
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
                                                        "data-testid": `${testId}-edit-cert-${index}-button`,
                                                        icon: "pencil",
                                                        onClick: () => setShowWizard(true),
                                                        popupText: "Change certificate",
                                                        type: "button"
                                                    },
                                                    {
                                                        "data-testid": `${testId}-edit-cert-${index}-button`,
                                                        icon: "eye",
                                                        onClick: () => handleViewCertificate(certificate),
                                                        popupText: "View certificate",
                                                        type: "button"
                                                    },
                                                    {
                                                        "data-testid": `${testId}-delete-cert-${index}-button`,
                                                        icon: "trash alternate",
                                                        onClick: () => deleteCertificate(),
                                                        popupText: t("console:manage.features.users.usersList.list." +
                                                            "iconPopups.delete"),
                                                        type: "button"
                                                    }
                                                ] }
                                                actionsFloated="right"
                                                avatar={ <GenericIcon
                                                    inline
                                                    transparent
                                                    size="nano"
                                                    icon={ getCertificateIllustrations().ribbon }
                                                /> }
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
                            <Grid.Column width={ 16 }>
                                <Divider hidden/>
                                <Segment>
                                    <EmptyPlaceholder
                                        title={ t("console:develop.features.applications.wizards." +
                                            "applicationCertificateWizard.emptyPlaceHolder.title") }
                                        image={ getEmptyPlaceholderIllustrations().emptyList }
                                        subtitle={ [
                                            t("console:develop.features.applications.wizards." +
                                                "applicationCertificateWizard.emptyPlaceHolder.description1"),
                                            t("console:develop.features.applications.wizards." +
                                                "applicationCertificateWizard.emptyPlaceHolder.description2")
                                        ] }
                                        imageSize="tiny"
                                        action={ (
                                            <PrimaryButton
                                                onClick={ () => setShowWizard(true) }
                                                data-testid={ `${testId}-emptyPlaceholder-add-certificate-button` }
                                                type="button"
                                            >
                                                <Icon name="add"/>
                                                { t("console:develop.features.authenticationProvider" +
                                                    ".buttons.addCertificate") }
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
                    <AddApplicationCertificateWizard
                        closeWizard={ () => setShowWizard(false) }
                        updatePEMValue={ updatePEMValue }
                        data-testid={ `${testId}-add-certificate-wizard` }
                    />
                )
            }
            { showCertificateModal() }
        </Forms>
    );
};

/**
 * Default proptypes for the application certificate list component.
 */
ApplicationCertificatesListComponent.defaultProps = {
    "data-testid": "application-certificate-list"
};
