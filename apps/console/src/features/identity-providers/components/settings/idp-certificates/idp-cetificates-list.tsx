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

import { AlertLevels, DisplayCertificate, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Form } from "@wso2is/form";
import { ResourceList, ResourceListActionInterface, ResourceListItem, UserAvatar } from "@wso2is/react-components";
import moment from "moment";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Popup, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { ShowCertificateModal } from "./show-certificate-modal";
import { UIConstants } from "../../../../core";
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

/**
 * List of added certificates.
 *
 * @param props {IdpCertificatesListProps}
 * @constructor
 */
export const IdpCertificatesList: FC<IdpCertificatesListProps> = (props): ReactElement => {

    const {
        ["data-componentid"]: testId,
        currentlyEditingIdP,
        refreshIdP,
        isReadOnly
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    /**
     * {@see deleteCertificate} function's doc comment. Enforcing this in components
     * state to ensure developers to not to make mistakes.
     *
     * {@link https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type}
     */
    const [ displayingCertificates, setDisplayingCertificates ] = useState<ReadonlyArray<DisplayCertificate>>();
    const [ showCertificateModal, setShowCertificateModal ] = useState<boolean>(false);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    /**
     * Create {@link DisplayCertificate} objects for all
     * available certificates.
     */
    useEffect(() => {
        if (currentlyEditingIdP?.certificate?.certificates?.length > 0) {
            const certificatesList: DisplayCertificate[] = [];
            currentlyEditingIdP?.certificate?.certificates?.map((certificate) => {
                certificatesList?.push(CertificateManagementUtils.displayCertificate(null, certificate));
            });
            setDisplayingCertificates([ ...certificatesList ]);
        }
    }, [ currentlyEditingIdP?.certificate?.certificates ]);

    /**
     * Remove the certificate from the certificated list.
     * The path attribute of the patch request requires the certificate index.
     * At the moment, the index of the certificate to be deleted is obtained from the indexes of
     * {@see certificates} array. This may cause unexpected behaviours if the certificates array is manipulated
     * for some reason.
     *
     * @param certificateIndex {number}
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
     * @param validFrom {Date}
     * @param validTill {Date}
     * @param issuer {string}
     */
    const createValidityLabel = (validFrom: Date, validTill: Date, issuer: string): ReactElement => {

        let icon: SemanticICONS;
        let iconColor: SemanticCOLORS;

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
            <React.Fragment>
                { issuer + SPACE_CHAR }
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
     * Creates the resource item description.
     *
     * @param validFrom {Date}
     * @param validTill {Date}
     */
    const createDescription = (validFrom: Date, validTill: Date): string => {
        const isValid = new Date() >= validFrom && new Date() <= validTill;
        const now = moment(new Date());
        const receivedDate = moment(validTill);
        let description;
        if (isValid) {
            description = "Valid for " + moment.duration(now.diff(receivedDate)).humanize();
        } else {
            description = "Expired " + moment.duration(now.diff(receivedDate)).humanize() + " ago";
        }
        return description;
    };

    /**
     * Creates the certificate actions.
     *
     * @param certificate {DisplayCertificate}
     * @param index {number}
     */
    const createCertificateActions = (certificate: DisplayCertificate, index: number) => {
        return [
            {
                "data-componentid": `${ testId }-edit-cert-${ index }-button`,
                icon: "eye",
                onClick: () => handleViewCertificate(certificate),
                popupText: t("console:manage.features.users.usersList.list." +
                    "iconPopups.edit"),
                type: "button"
            },
            {
                "data-componentid": `${ testId }-delete-cert-${ index }-button`,
                icon: "trash alternate",
                onClick: () => deleteCertificate(index),
                popupText: t("console:manage.features.users.usersList.list." +
                    "iconPopups.delete"),
                type: "button"
            }
        ] as (ResourceListActionInterface & IdentifiableComponentInterface)[];
    };

    /**
     * Creates what to show as the resource list item avatar.
     * @param certificate {DisplayCertificate}
     */
    const createCertificateResourceAvatar = (certificate: DisplayCertificate): ReactElement => {
        return (
            <UserAvatar
                name={ CertificateManagementUtils.searchIssuerDNAlias(certificate?.issuerDN) }
                size="mini"
                floated="left"
            />
        );
    };

    return (
        <Form onSubmit={ NO_OPERATIONS } uncontrolledForm={ true }>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <ResourceList
                            relaxed={ false }
                            className="application-list"
                            isLoading={ isLoading }
                            loadingStateOptions={ {
                                count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                                imageType: "circular"
                            } }
                            readOnly={ isReadOnly }>
                            {
                                displayingCertificates?.map((certificate, index) => (
                                    <ResourceListItem
                                        key={ index }
                                        actions={ createCertificateActions(certificate, index) }
                                        actionsFloated="right"
                                        avatar={ createCertificateResourceAvatar(certificate) }
                                        itemHeader={ createValidityLabel(
                                            certificate.validFrom,
                                            certificate.validTill,
                                            CertificateManagementUtils.searchIssuerDNAlias(certificate?.issuerDN)
                                        ) }
                                        itemDescription={
                                            createDescription(certificate.validFrom, certificate.validTill)
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

// Component constants

const SPACE_CHAR = " ";
const NO_OPERATIONS = (): void => void 0;

/**
 * Default properties of {@link IdpCertificatesList}
 */
IdpCertificatesList.defaultProps = {
    "data-componentid": "idp-certificates-list"
};
