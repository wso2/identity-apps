/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import {
    AlertLevels,
    CertificateValidity,
    DisplayCertificate,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Form } from "@wso2is/form";
import { ResourceList, ResourceListActionInterface, ResourceListItem, UserAvatar } from "@wso2is/react-components";
import moment from "moment";
import React, { FC, PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Popup, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { ShowCertificateModal } from "./show-certificate-modal";
import { updateIDPCertificate } from "../../../api";
import { IdentityProviderInterface } from "../../../models";

/**
 * Props interface of {@link IdpCertificatesList}
 */
export interface IdpCertificatesListProps extends IdentifiableComponentInterface {
    currentlyEditingIdP: IdentityProviderInterface;
    refreshIdP: (id: string) => void;
    isReadOnly: boolean;
}

const FORM_ID: string = "idp-certificates-list-form";

/**
 * List of added certificates.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const IdpCertificatesList: FC<IdpCertificatesListProps> = (
    props: PropsWithChildren<IdpCertificatesListProps>
): ReactElement => {

    const {
        [ "data-componentid" ]: testId,
        currentlyEditingIdP,
        refreshIdP,
        isReadOnly
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    /**
     * @see {@link deleteCertificate} function's doc comment. Enforcing this in components
     * state to ensure developers to not to make mistakes.
     *
     * {@link https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type}
     */
    const [ displayingCertificates, setDisplayingCertificates ] = useState<ReadonlyArray<DisplayCertificate>>();
    const [ showCertificateModal, setShowCertificateModal ] = useState<boolean>(false);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    /**
     * When component initialize check the IdP model and set
     * the available certificates if exists.
     */
    useEffect(() => {
        bindCertificatesToState();
    }, []);

    /**
     * Create {@link DisplayCertificate} objects for all
     * available certificates.
     */
    useEffect(() => {
        bindCertificatesToState();
    }, [ currentlyEditingIdP?.certificate?.certificates ]);

    /**
     * Why call this in two places?
     *
     * 1) First, this func checks whether this IdP has certificates and
     *    re-binds the new state to the component as @see DisplayCertificate[].
     *
     * 2) Initially, when the component renders and when user adds a new certificate
     *    we need to refresh the state.
     */
    const bindCertificatesToState = (): void => {
        if (currentlyEditingIdP?.certificate?.certificates?.length > 0) {
            const certificatesList: DisplayCertificate[] = [];

            currentlyEditingIdP?.certificate?.certificates?.map((certificate) => {
                if (CertificateManagementUtils.canSafelyParseCertificate(certificate)) {
                    certificatesList?.push(CertificateManagementUtils.displayCertificate(null, certificate));
                } else {
                    certificatesList?.push(CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE);
                }
            });
            setDisplayingCertificates([ ...certificatesList ]);
        }
    };

    /**
     * Remove the certificate from the certificated list.
     * The path attribute of the patch request requires the certificate index.
     * At the moment, the index of the certificate to be deleted is obtained from the indexes of
     * @see certificates array. This may cause unexpected behaviours if the certificates array is manipulated
     * for some reason.
     *
     * @param certificateIndex - Cert index.
     */
    const deleteCertificate = async (certificateIndex: number) => {

        setIsLoading(true);

        const PATCH_OBJECT = [ {
            "operation": "REMOVE",
            "path": "/certificate/certificates/" + certificateIndex,
            "value": null
        } ];

        const doOnSuccess = () => {
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider" +
                    ".notifications.deleteCertificate.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:develop.features.authenticationProvider" +
                    ".notifications.deleteCertificate.success.message")
            }));
            refreshIdP(currentlyEditingIdP.id);
            setIsLoading(false);
        };

        const ifTheresAnyError = (error) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider" +
                        ".notifications.deleteCertificate.error.message")
                }));
                setIsLoading(false);

                return;
            }
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider.notifications" +
                    ".deleteCertificate.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.authenticationProvider.notifications" +
                    ".deleteCertificate.genericError.message")
            }));
            setIsLoading(false);
        };

        await updateIDPCertificate(currentlyEditingIdP?.id, PATCH_OBJECT)
            .then(doOnSuccess)
            .catch(ifTheresAnyError);

    };

    const handleViewCertificate = (certificate: DisplayCertificate) => {
        setCertificateDisplay(certificate);
        setShowCertificateModal(true);
    };

    /**
     * Creates the resource item header.
     *
     * @param validFrom - Validate from date.
     * @param validTill - Validate till date.
     * @param issuer - Issuer.
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
     * Creates a dummy label telling that we're unable to visualize
     * this certificate.
     *
     * @param certificate - Certificate.
     * @returns Dummy validity label.
     */
    const createDummyValidityLabel = (certificate: DisplayCertificate): ReactNode => {
        return (
            <span className="with-muted-list-item-header">
                Unable to visualize the certificate details&nbsp;
                <Popup
                    trigger={
                        (<Icon
                            onClick={ () => handleViewCertificate(certificate) }
                            name={ "info circle" }
                            color={ "grey" }/>) }
                    content={ "Click for more info" }
                    inverted
                    position="top left"
                    size="mini"
                />
            </span>
        );
    };

    /**
     * Creates the resource item description.
     *
     * @param validFrom - Validate from date.
     * @param validTill - Validate till date.
     */
    const createDescription = (validFrom: Date, validTill: Date): string => {
        return CertificateManagementUtils.getValidityPeriodInHumanReadableFormat(
            validFrom,
            validTill
        );
    };

    /**
     * Creates the certificate actions.
     *
     * @param certificate - Certificate.
     * @param index - Cert index.
     */
    const createCertificateActions = (certificate: DisplayCertificate, index: number) => {
        return [
            {
                "data-componentid": `${ testId }-edit-cert-${ index }-button`,
                disabled: certificate?.infoUnavailable,
                hidden: certificate?.infoUnavailable,
                icon: "eye",
                onClick: () => handleViewCertificate(certificate),
                popupText: "Preview",
                type: "button"
            },
            {
                "data-componentid": `${ testId }-delete-cert-${ index }-button`,
                icon: "trash alternate",
                onClick: () => deleteCertificate(index),
                popupText: "Delete",
                type: "button"
            }
        ] as (ResourceListActionInterface & IdentifiableComponentInterface)[];
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

    return (
        <Form
            id={ FORM_ID }
            onSubmit={ CertificateManagementConstants.NO_OPERATIONS }
            uncontrolledForm={ true }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <ResourceList
                            fill
                            relaxed={ false }
                            className="application-list"
                            isLoading={ isLoading }
                            loadingStateOptions={ {
                                count: 2,
                                imageType: "circular"
                            } }
                            readOnly={ isReadOnly }>
                            {
                                displayingCertificates?.map((certificate, index) => (
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
                                                    CertificateManagementUtils.searchIssuerDNAlias(
                                                        certificate?.issuerDN
                                                    ))
                                        }
                                        itemDescription={
                                            certificate?.infoUnavailable
                                                ? null
                                                : createDescription(certificate.validFrom, certificate.validTill)
                                        }
                                    />
                                ))
                            }
                        </ResourceList>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <ShowCertificateModal
                show={ showCertificateModal }
                certificateToDisplay={ certificateDisplay }
                onCloseClicked={ () => setShowCertificateModal(false) }/>
        </Form>
    );

};

/**
 * Default properties of {@link IdpCertificatesList}
 */
IdpCertificatesList.defaultProps = {
    "data-componentid": "idp-certificates-list"
};
