/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Button from "@oxygen-ui/react/Button";
import { CertificateViewModal } from "@wso2is/admin.core.v1/components/certificate-view-modal";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { CertificateManagementConstants } from "@wso2is/core/constants";
import { CertificateValidity, DisplayCertificate, IdentifiableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import {
    ConfirmationModal,
    Popup,
    ResourceList,
    ResourceListItem,
    UserAvatar
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import moment, { Moment } from "moment";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid, Icon, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { ActionCertificateWizard } from "./action-certificate-wizard";
import updateAction from "../../api/update-action";
import { ActionsConstants } from "../../constants/actions-constants";
import { PreUpdatePasswordActionUpdateInterface } from "../../models/actions";
import { useHandleError, useHandleSuccess } from "../../util/alert-util";
import "./action-certificate.scss";

/**
 * Prop types for the Action certificate component.
 */
interface ActionCertificatePropsInterface extends IdentifiableComponentInterface {
    /**
     * The PEM value of the certificate.
     */
    certificate: string;
    /**
     * Callback to update the PEM value.
     */
    updatePEMValue: (value: string) => void;
    /**
     * Callback to update the submit state.
     */
    updateSubmit: (value: boolean) => void;
    /**
     * Indicates if the form is in creation mode.
     */
    isCreateFormState: boolean;
    /**
     * The API path for the action type.
     */
    actionTypeApiPath: string;
    /**
     * The ID of the action.
     */
    actionId: string;
    /**
     * Indicates if the form is in read only mode.
     */
    readOnly?: boolean;
}

/**
 * Action certificate component.
 *
 * @param props - Props injected to the component.
 * @returns - Action certificate component.
 */
export const ActionCertificateComponent: FunctionComponent<ActionCertificatePropsInterface> = ({
    certificate,
    updatePEMValue,
    updateSubmit,
    isCreateFormState,
    actionTypeApiPath,
    actionId,
    readOnly,
    [ "data-componentid" ]: _componentId = "action-certificate"
}: ActionCertificatePropsInterface ): ReactElement => {

    const { t } = useTranslation();

    const handleSuccess: (operation: string) => void = useHandleSuccess();
    const handleError: (error: AxiosError, operation: string) => void = useHandleError();

    const [ viewDisplayCertificate, setViewDisplayCertificate ] = useState<boolean>(false);
    const [ displayCertificate, setDisplayCertificate ] = useState<DisplayCertificate>(undefined);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showCertificateDeleteConfirmation, setShowCertificateDeleteConfirmation ] = useState<boolean>(false);

    useEffect(() => {
        if (certificate) {
            if (CertificateManagementUtils.canSafelyParseCertificate(certificate)) {
                setDisplayCertificate(CertificateManagementUtils.displayCertificate(null, certificate));
            } else {
                setDisplayCertificate(CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE);
            }
        }
    }, [ certificate ]);

    /**
     * Show the certificate details.
     * @param certificate - Certificate to be displayed.
     */
    const handleViewCertificate = () => {
        setViewDisplayCertificate(true);
    };

    const handleDeleteCertificate = () => {

        if (isCreateFormState) {
            setDisplayCertificate(undefined);
            updatePEMValue("");
        } else {
            setShowCertificateDeleteConfirmation(true);
        }
    };

    const deleteCertificate = async (): Promise<void> => {

        const EMPTY_STRING: string = "";
        const updatingValues: PreUpdatePasswordActionUpdateInterface = {
            passwordSharing: {
                certificate: EMPTY_STRING
            }
        };

        setIsSubmitting(true);
        updateAction(actionTypeApiPath, actionId, updatingValues)
            .then(() => {
                handleSuccess(ActionsConstants.DELETE_CERTIFICATE);
                setDisplayCertificate(undefined);
                setShowCertificateDeleteConfirmation(false);
            })
            .catch((error: AxiosError) => {
                handleError(error, ActionsConstants.DELETE_CERTIFICATE);
            })
            .finally(() => {
                setIsSubmitting(false);
                updatePEMValue(EMPTY_STRING);
            });
    };

    const DeleteCertConfirmationModal: ReactElement = (
        <ConfirmationModal
            onClose={ (): void => setShowCertificateDeleteConfirmation(false) }
            onSecondaryActionClick={ (): void => setShowCertificateDeleteConfirmation(false) }
            onPrimaryActionClick={ deleteCertificate }
            open={ showCertificateDeleteConfirmation }
            type="negative"
            primaryAction={ t("actions:certificateDeleteConfirmationModal.primaryAction") }
            secondaryAction={ t("actions:certificateDeleteConfirmationModal.secondaryAction") }
            data-componentid={ `${ _componentId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }
            primaryActionLoading={ isSubmitting }
        >
            <ConfirmationModal.Header
                data-componentid={ `${ _componentId }-delete-confirmation-modal-header` }>
                { t("actions:certificateDeleteConfirmationModal.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-componentid={ `${ _componentId }-delete-confirmation-modal-message` }>
                { t("actions:certificateDeleteConfirmationModal.message") }
            </ConfirmationModal.Message>
        </ConfirmationModal>
    );

    const handleAddCertificate = (): void => {
        setShowWizard(true);
    };

    /**
     * Creates the resource item header.
     *
     * @param validFrom - Valid from date.
     * @param validTill - Valid till date.
     * @param issuer - Issuer.
     */
    const createValidityLabel = (validFrom: Date, validTill: Date, issuer: string): ReactElement => {

        let icon: SemanticICONS;
        let iconColor: SemanticCOLORS;

        const expiryDate: Moment = moment(validTill);

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
     *
     * @param certificate - Certificate.
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
     * @param certificate - Certificate.
     */
    const createDummyValidityLabel = (): ReactNode => {
        return (
            <span className="with-muted-list-item-header">
                Unable to visualize the certificate details&nbsp;
                <Popup
                    trigger={ (
                        <Icon
                            onClick={ handleViewCertificate }
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
        <div className="action-certificate" >
            {
                displayCertificate ? (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <ResourceList
                                    fill
                                    relaxed={ false }
                                    className="action-list"
                                    loadingStateOptions={ {
                                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                        imageType: "circular"
                                    } }
                                    data-componentid={ _componentId }
                                >
                                    {
                                        <ResourceListItem
                                            key={ 0 }
                                            actionsColumnWidth={ 3 }
                                            descriptionColumnWidth={ 9 }
                                            actions={ [
                                                {
                                                    "data-componentid": `${ _componentId }-edit-cert-button`,
                                                    disabled: readOnly,
                                                    icon: "pencil",
                                                    onClick: () => setShowWizard(true),
                                                    popupText: t("actions:fields.passwordSharing.certificate"+
                                                            ".icon.changecertificate"),
                                                    type: "button"
                                                },
                                                {
                                                    "data-componentid": `${ _componentId }-view-cert-button`,
                                                    disabled: displayCertificate?.infoUnavailable,
                                                    hidden: displayCertificate?.infoUnavailable,
                                                    icon: "eye",
                                                    onClick: handleViewCertificate,
                                                    popupText: t("actions:fields.passwordSharing.certificate"+
                                                            ".icon.viewcertificate"),
                                                    type: "button"
                                                },
                                                {
                                                    "data-componentid": `${ _componentId }-delete-cert-button`,
                                                    disabled: readOnly,
                                                    icon: "trash alternate",
                                                    onClick: handleDeleteCertificate,
                                                    popupText: t("actions:fields.passwordSharing.certificate"+
                                                            ".icon.deletecertificate"),
                                                    type: "button"
                                                }
                                            ] }
                                            actionsFloated="right"
                                            avatar={ createCertificateResourceAvatar(displayCertificate) }
                                            itemHeader={
                                                displayCertificate?.infoUnavailable
                                                    ? createDummyValidityLabel()
                                                    : createValidityLabel(
                                                        displayCertificate.validFrom,
                                                        displayCertificate.validTill,
                                                        CertificateManagementUtils.searchIssuerDNAlias(
                                                            displayCertificate?.issuerDN
                                                        ))

                                            }
                                            itemDescription={
                                                displayCertificate?.infoUnavailable
                                                    ? null
                                                    : CertificateManagementUtils
                                                        .getValidityPeriodInHumanReadableFormat(
                                                            displayCertificate.validFrom,
                                                            displayCertificate.validTill
                                                        )
                                            }
                                        />
                                    }
                                </ResourceList>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : (
                    <Alert
                        severity="warning"
                        data-componentid={ `${ _componentId }-no-certificate-alert` }
                    >
                        <AlertTitle
                            className="alert-title"
                        >
                            <Trans>
                                { t("actions:fields.passwordSharing.certificate.info.header") }
                            </Trans>
                        </AlertTitle>
                        <Trans>
                            { t("actions:fields.passwordSharing.certificate.info.description") }
                        </Trans>
                        <div>
                            <Button
                                onClick={ handleAddCertificate }
                                variant="outlined"
                                size="small"
                                className={ "secondary-button" }
                                disabled={ readOnly }
                                data-componentid={ `${ _componentId }-add-certificate-button` }
                            >
                                { t("actions:buttons.addCertificate") }
                            </Button>
                        </div>
                    </Alert>
                )
            }
            { showWizard && (
                <ActionCertificateWizard
                    closeWizard={ () => setShowWizard(false) }
                    updatePEMValue={ updatePEMValue }
                    updateSubmit={ updateSubmit }
                    currentPEMValue={ certificate }
                    isCreateFormState={ isCreateFormState }
                    actionTypeApiPath={ actionTypeApiPath }
                    actionId={ actionId }
                    data-componentid={ `${ _componentId }-add-certificate-wizard` }
                />
            ) }
            { DeleteCertConfirmationModal }
            { viewDisplayCertificate && (
                <CertificateViewModal
                    open={ viewDisplayCertificate }
                    certificate={ displayCertificate }
                    onClose={ () => setViewDisplayCertificate(false) }
                />
            ) }
        </div>
    );
};

export default ActionCertificateComponent;
