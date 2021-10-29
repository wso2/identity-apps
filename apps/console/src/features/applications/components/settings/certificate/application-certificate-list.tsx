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

import { CertificateManagementConstants } from "@wso2is/core/constants";
import { AlertLevels, CertificateValidity, DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Forms } from "@wso2is/forms";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    PrimaryButton,
    ResourceList,
    ResourceListItem,
    UserAvatar
} from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid, Icon, Popup, Segment, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { AddApplicationCertificateWizard } from "./add-certificate-wizard";
import { UIConstants, getEmptyPlaceholderIllustrations } from "../../../../core";
import { updateApplicationDetails } from "../../../api";
import { ApplicationInterface, CertificateTypeInterface } from "../../../models";
import { CertificateFormFieldModal } from "../../modals";

/**
 * Proptypes for the Application certificate list component.
 */
interface ApplicationCertificatesPropsListInterface extends TestableComponentInterface {
    /**
     * Specifies whether JWKS or Certificates
     * remove/delete is allowed or not.
     */
    deleteAllowed?: boolean;
    /**
     * The message or the content of the pop up saying
     * why it's being disabled.
     */
    reasonInsideTooltipWhyDeleteIsNotAllowed?: ReactNode;
    application: ApplicationInterface;
    onUpdate: (id: string) => void;
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
        deleteAllowed,
        reasonInsideTooltipWhyDeleteIsNotAllowed,
        onUpdate,
        application,
        applicationCertificate,
        updatePEMValue,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ certificates, setCertificates ] = useState<DisplayCertificate[]>(null);
    const [ certificateModal, setCertificateModal ] = useState<boolean>(false);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showCertificateDeleteConfirmation, setShowCertificateDeleteConfirmation ] = useState<boolean>(false);
    const [ ongoingDeleteRequest, setOngoingDeleteRequest ] = useState<boolean>(false);

    useEffect(() => {
        if (applicationCertificate) {
            const certificatesList: DisplayCertificate[] = [];

            if (CertificateManagementUtils.canSafelyParseCertificate(applicationCertificate)) {
                certificatesList?.push(CertificateManagementUtils.displayCertificate(null, applicationCertificate));
            } else {
                certificatesList?.push(CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE);
            }
            setCertificates(certificatesList);
        }
    }, [ applicationCertificate ]);

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
     * Show the certificate details.
     * @param certificate
     */
    const handleViewCertificate = (certificate: DisplayCertificate) => {
        setCertificateDisplay(certificate);
    };

    const deleteCertificate = async (): Promise<void> => {

        const EMPTY_STRING = "";

        setOngoingDeleteRequest(true);
        updatePEMValue(EMPTY_STRING);
        setCertificates(null);

        try {
            const patchObject: any = {
                general: {
                    advancedConfigurations: {
                        certificate: {
                            type: CertificateTypeInterface.PEM,
                            value: EMPTY_STRING
                        }
                    }
                }
            };

            await updateApplicationDetails({
                id: application?.id,
                ...(patchObject.general)
            });
            dispatch(addAlert({
                description: t("console:develop.features.applications.notifications" +
                    ".deleteCertificateSuccess.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:develop.features.applications.notifications" +
                    ".deleteCertificateSuccess.message")
            }));
        } catch (error) {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data.message
                }));

                return;
            }
            dispatch(addAlert({
                description: t("console:develop.features.applications.notifications" +
                    ".deleteCertificateGenericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.applications.notifications." +
                    "deleteCertificateGenericError.message")
            }));
        } finally {
            setShowCertificateDeleteConfirmation(false);
            setOngoingDeleteRequest(false);
            onUpdate(application.id);
        }

    };

    const DeleteCertConfirmationModal: ReactElement = (
        <ConfirmationModal
            onClose={ (): void => setShowCertificateDeleteConfirmation(false) }
            onSecondaryActionClick={ (): void => setShowCertificateDeleteConfirmation(false) }
            primaryActionLoading={ ongoingDeleteRequest }
            onPrimaryActionClick={ deleteCertificate }
            open={ showCertificateDeleteConfirmation }
            type="negative"
            primaryAction={ t("console:develop.features.applications.confirmations.certificateDelete.primaryAction") }
            secondaryAction={ t("console:develop.features.applications.confirmations" +
                ".certificateDelete.secondaryAction") }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }>
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                { t("console:develop.features.applications.confirmations.certificateDelete.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-testid={ `${ testId }-delete-confirmation-modal-message` }>
                { t("console:develop.features.applications.confirmations.certificateDelete.message") }
            </ConfirmationModal.Message>
        </ConfirmationModal>
    );

    /**
     * Creates the resource item header.
     *
     * @param validFrom {Date}
     * @param validTill {Date}
     * @param issuer {string}
     */
    const createValidityLabel = (validFrom: Date, validTill: Date, issuer: string): ReactElement => {

        let icon: SemanticICONS;
        let iconColor: SemanticCOLORS;

        const expiryDate = moment(validTill);

        const validity: CertificateValidity = CertificateManagementUtils
            .determineCertificateValidityState({
                from: validFrom,
                to: validTill
            });

        switch (validity) {
            case CertificateValidity.VALID: {
                icon = "check circle";
                iconColor = "green";

                break;
            }
            case CertificateValidity.WILL_EXPIRE_SOON: {
                icon = "exclamation circle";
                iconColor = "yellow";

                break;
            }
            default: {
                icon = "times circle";
                iconColor = "red";
            }
        }

        return (
            <React.Fragment>
                { issuer + CertificateManagementConstants.SPACE_CHARACTER }
                <Popup
                    trigger={ <Icon name={ icon } color={ iconColor }/> }
                    content={ "Expiry date: " + expiryDate.format("DD/MM/YYYY") }
                    inverted
                    position="top left"
                    size="mini"
                />
            </React.Fragment>
        );

    };

    /**
     * Creates what to show as the resource list item avatar.
     * @param certificate {DisplayCertificate}
     */
    const createCertificateResourceAvatar = (certificate: DisplayCertificate): ReactElement => {
        return (
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
    };

    /**
     * Creates a dummy label telling that we're unable to visualize
     * this certificate.
     * @param certificate {DisplayCertificate}
     */
    const createDummyValidityLabel = (certificate: DisplayCertificate): ReactNode => {
        return (
            <span className="with-muted-list-item-header">
                Unable to visualize the certificate details&nbsp;
                <Popup
                    trigger={ (
                        <Icon
                            onClick={ () => handleViewCertificate(certificate) }
                            name={ "info circle" }
                            color={ "grey" }
                        />
                    ) }
                    content={ "Click for more info" }
                    inverted
                    position="top left"
                    size="mini"
                />
            </span>
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
                                    fill
                                    relaxed={ false }
                                    className="application-list"
                                    loadingStateOptions={ {
                                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                        imageType: "circular"
                                    } }
                                >
                                    {
                                        certificates?.map((certificate, index) => (
                                            <ResourceListItem
                                                key={ index }
                                                actionsColumnWidth={ 3 }
                                                descriptionColumnWidth={ 9 }
                                                actions={ [
                                                    {
                                                        "data-testid": `${ testId }-edit-cert-${ index }-button`,
                                                        icon: "pencil",
                                                        onClick: () => setShowWizard(true),
                                                        popupText: "Change certificate",
                                                        type: "button"
                                                    },
                                                    {
                                                        "data-testid": `${ testId }-edit-cert-${ index }-button`,
                                                        disabled: certificate?.infoUnavailable,
                                                        hidden: certificate?.infoUnavailable,
                                                        icon: "eye",
                                                        onClick: () => handleViewCertificate(certificate),
                                                        popupText: "View certificate",
                                                        type: "button"
                                                    },
                                                    {
                                                        "data-testid": `${ testId }-delete-cert-${ index }-button`,
                                                        disabled: !deleteAllowed,
                                                        icon: "trash alternate",
                                                        onClick: () => setShowCertificateDeleteConfirmation(true),
                                                        popupText: deleteAllowed
                                                            ? t("console:manage.features.users.usersList.list." +
                                                                "iconPopups.delete")
                                                            : reasonInsideTooltipWhyDeleteIsNotAllowed,
                                                        type: "button"
                                                    }
                                                ] }
                                                actionsFloated="right"
                                                avatar={ createCertificateResourceAvatar(certificate) }
                                                itemHeader={
                                                    certificate?.infoUnavailable
                                                        ? createDummyValidityLabel(certificate)
                                                        : createValidityLabel(
                                                            certificate.validFrom,
                                                            certificate.validTill,
                                                            CertificateManagementUtils.searchIssuerDNAlias(
                                                                certificate?.issuerDN
                                                            ))

                                                }
                                                itemDescription={
                                                    certificate?.infoUnavailable
                                                        ? null
                                                        : CertificateManagementUtils
                                                            .getValidityPeriodInHumanReadableFormat(
                                                                certificate.validFrom,
                                                                certificate.validTill
                                                            )
                                                }
                                            />
                                        ))
                                    }
                                </ResourceList>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : (
                    <Grid>
                        <Grid.Row columns={ 1 }>
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
                        data-testid={ `${ testId }-add-certificate-wizard` }
                    />
                )
            }
            { DeleteCertConfirmationModal }
            { certificateModal && (
                <CertificateFormFieldModal
                    open={ certificateModal }
                    certificate={ certificateDisplay }
                    onClose={ () => setCertificateModal(false) }
                />
            ) }
        </Forms>
    );
};

/**
 * Default proptypes for the application certificate list component.
 */
ApplicationCertificatesListComponent.defaultProps = {
    "data-testid": "application-certificate-list",
    deleteAllowed: true,
    reasonInsideTooltipWhyDeleteIsNotAllowed: null
};
