/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Container, Message, Modal } from "semantic-ui-react";
import { fetchConsentedApps, fetchConsentReceipt, revokeConsentedApp, updateConsentedClaims } from "../../api/consents";
import * as ApplicationConstants from "../../constants/application-constants";
import {
    ConsentInterface,
    ConsentState,
    createEmptyNotification,
    Notification,
    RevokedClaimInterface,
    ServiceInterface
} from "../../models";
import { endUserSession } from "../../utils";
import { SettingsSection } from "../shared";
import { AppConsentList } from "./consents-list";
import {ModalComponent} from "../shared/modal";

/**
 * Proptypes for the user sessions component.
 */
interface ConsentComponentProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * Consent management component.
 *
 * @return {JSX.Element}
 */
export const Consents: FunctionComponent<ConsentComponentProps> = (props: ConsentComponentProps): JSX.Element => {
    const [ consentedApps, setConsentedApps ] = useState<ConsentInterface[]>([]);
    const [ revokingConsent, setRevokingConsent ] = useState<ConsentInterface>();
    const [ isConsentRevokeModalVisible, setConsentRevokeModalVisibility ] = useState(false);
    const [ revokedClaimList, setRevokedClaimList ] = useState<RevokedClaimInterface[]>([]);
    const [ consentListActiveIndexes, setConsentListActiveIndexes ] = useState([]);

    const { onNotificationFired } = props;
    const { t } = useTranslation();
    let notification: Notification = createEmptyNotification();

    useEffect(() => {
        getConsentedApps();
    }, []);

    /**
     * Retrieves the consented applications of the user.
     */
    const getConsentedApps = (): void => {
        fetchConsentedApps(ConsentState.ACTIVE)
            .then((response) => {
                setConsentedApps(response);
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.consentManagement.notifications.consentedAppsFetch.genericError" +
                        ".description"
                    ),
                    message: t("views:components.consentManagement.notifications.consentedAppsFetch" +
                        ".genericError.message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };

                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.consentManagement.notifications.consentedAppsFetch.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.consentManagement.notifications.consentedAppsFetch.error.message"
                        ),
                    };
                }
            })
            .finally(() => {
                onNotificationFired(notification);
            });
    };

    /**
     * Fetches the consent receipt for the corresponding id.
     *
     * @param receiptId - Consent receipt id.
     */
    const getConsentReceipt = (receiptId): void => {
        fetchConsentReceipt(receiptId)
            .then((response) => {
                const apps = [ ...consentedApps ];

                for (const app of apps) {
                    if (app.consentReceiptID === receiptId) {
                        app.consentReceipt = response;
                    }
                }

                setConsentedApps(apps);
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.consentManagement.notifications.consentReceiptFetch" +
                        ".genericError.description"
                    ),
                    message: t("views:components.consentManagement.notifications.consentReceiptFetch" +
                        ".genericError.message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };

                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.consentManagement.notifications.consentReceiptFetch.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.consentManagement.notifications.consentReceiptFetch.error" +
                            ".message"
                        ),
                    };
                }
            })
            .finally(() => {
                onNotificationFired(notification);
            });
    };

    /**
     * The following method handles the revoke claim checkbox toggle event.
     *
     * @param {string} receiptId - consent receipt id.
     * @param {number} claimId - claim id ie. piiCategoryId.
     */
    const handleClaimRevokeToggle = (receiptId: string, claimId: number): void => {
        const list = [ ...revokedClaimList ];
        let found: boolean = false;

        for (const item of list) {
            if (item.id === receiptId) {
                found = true;
                if (item.revoked.includes(claimId)) {
                    const removingIndex = item.revoked.indexOf(claimId);
                    if (removingIndex !== -1) {
                        item.revoked.splice(removingIndex, 1);
                    }
                    continue;
                }
                item.revoked.push(claimId);
            }
        }

        if (!found) {
            list.push({ id: receiptId, revoked: [ claimId ] });
        }

        setRevokedClaimList(list);
    };

    /**
     * Handles the consent revoke button click. Sets the current consent object as
     * the editing consent and toggles the visibility of the consent revoke modal.
     *
     * @param {ConsentInterface} consent - Corresponding consent object
     */
    const handleAppConsentRevoke = (consent: ConsentInterface): void => {
        setRevokingConsent(consent);
        setConsentRevokeModalVisibility(true);
    };

    /**
     * Revokes the consent of an already consented application.
     *
     * @param {ConsentInterface} consent - Consent which needs to be revoked.
     */
    const revokeAppConsent = (consent: ConsentInterface): void => {
        const isUserPortal: number = ApplicationConstants.USER_PORTAL_IDENTIFIER.localeCompare(consent.spDisplayName);

        revokeConsentedApp(consent.consentReceiptID)
            .then(() => {
                // Reset the list
                resetConsentedAppList(true);

                setConsentRevokeModalVisibility(false);

                // If the revoked app is user portal, end the session.
                if (isUserPortal === 0) {
                    endUserSession();
                }

                notification = {
                    description: t(
                        "views:components.consentManagement.notifications.revokeConsentedApp.success" +
                        ".description"
                    ),
                    message: t("views:components.consentManagement.notifications.revokeConsentedApp" +
                        ".success.message"),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                };
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.consentManagement.notifications.revokeConsentedApp.genericError" +
                        ".description"
                    ),
                    message: t("views:components.consentManagement.notifications.revokeConsentedApp" +
                        ".genericError.message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };

                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.consentManagement.notifications.revokeConsentedApp.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.consentManagement.notifications.revokeConsentedApp.error.message"
                        ),
                    };
                }
            })
            .finally(() => {
                onNotificationFired(notification);
            });
    };

    /**
     * Handles the claims update button click action event. The revoked claims are taken
     * out of the existing receipt object and are passed on to the `updateConsentedClaims`
     * which executes the API request and updates the consented claims.
     *
     * @param {string} receiptId - consent receipt id.
     */
    const handleClaimUpdate = (receiptId: string): void => {
        // clone deep is needed to avoid mutations.
        const updatingConsent = _.cloneDeep(consentedApps).find((consent) => consent.consentReceiptID === receiptId);
        const claimList = [ ...revokedClaimList ].find((item) => item.id === receiptId);

        let isPIIEmpty: boolean = false;

        // If the `piiCategory` id is in the `revokedClaimIds`,
        // then the category is removed from the list.
        updatingConsent.consentReceipt.services.map((service: ServiceInterface) => {
            service.purposes.map((purpose) => {
                purpose.piiCategory = purpose.piiCategory.filter((category) => {
                    if (!claimList.revoked.includes(category.piiCategoryId)) {
                        return category;
                    }
                });
                // If consent to all the pii categories are revoked
                // the application will have to be revoked.
                if (purpose.piiCategory.length === 0) {
                    isPIIEmpty = true;
                }
            });
        });

        // If the PII category list is empty, show the consent revoke modal.
        // Else, perform the usual consented claims updating process.
        if (isPIIEmpty) {
            setRevokingConsent(updatingConsent);
            setConsentRevokeModalVisibility(true);
            return;
        }

        updateConsentedClaims(updatingConsent.consentReceipt)
            .then(() => {
                // Reset the list
                resetConsentedAppList(true);

                notification = {
                    description: t(
                        "views:components.consentManagement.notifications.updateConsentedClaims.success" +
                        ".description"
                    ),
                    message: t("views:components.consentManagement.notifications.updateConsentedClaims." +
                        "success.message"),
                    otherProps: {
                        positive: true
                    },
                    visible: true
                };
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.consentManagement.notifications.updateConsentedClaims.genericError" +
                        ".description"
                    ),
                    message: t("views:components.consentManagement.notifications.updateConsentedClaims." +
                        "genericError.message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };

                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.consentManagement.notifications.updateConsentedClaims.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.consentManagement.notifications.updateConsentedClaims" +
                            ".error.message"
                        ),
                    };
                }
            })
            .finally(() => {
                onNotificationFired(notification);
            });
    };

    /**
     * Handler for the consent detail button click.
     *
     * @param {number} index - Index of the clicked item.
     * @param {string} receiptId - Consent receipt id.
     */
    const handleConsentDetailClick = (index: number, receiptId: string): void => {
        const indexes = [ ...consentListActiveIndexes ];

        if (consentListActiveIndexes.includes(index)) {
            const list = [ ...revokedClaimList ];
            const removingIndex = consentListActiveIndexes.indexOf(index);

            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }

            // Reset the revoked list.
            setRevokedClaimList(list.filter((item) => item.id !== receiptId));
        } else {
            indexes.push(index);

            // Fetch the consent receipt.
            getConsentReceipt(receiptId);
        }

        setConsentListActiveIndexes(indexes);
    };

    /**
     * Handles the consent revoke modal close action.
     */
    const handleConsentRevokeModalClose = (): void => {
        setConsentRevokeModalVisibility(false);
    };

    /**
     * Resets the consented apps list.
     *
     * @param {boolean} refetch - Flag to set the if re-fetch is enabled.
     */
    const resetConsentedAppList = (refetch: boolean = true): void => {
        // Close all the opened drawers.
        setConsentListActiveIndexes([]);

        if (refetch) {
            // Re-fetch the consented apps list
            getConsentedApps();
        }
    };

    /**
     * Consent revoke modal.
     *
     * @return {JSX.Element}
     */
    const consentRevokeModal = (): JSX.Element => {
        const isUserPortal: number = ApplicationConstants.USER_PORTAL_IDENTIFIER.localeCompare(
            revokingConsent.spDisplayName);

        return (
            <ModalComponent
                primaryAction={ t("common:revoke") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleConsentRevokeModalClose }
                onPrimaryActionClick={ () => revokeAppConsent(revokingConsent) }
                open={ isConsentRevokeModalVisible }
                onClose={ handleConsentRevokeModalClose }
                type="negative"
                heading={
                    t("views:components.consentManagement.modals.consentRevokeModal.heading",
                        { appName: revokingConsent.spDisplayName })
                }
                description={ t("views:components.consentManagement.modals.consentRevokeModal.message") }
            >
                <Modal.Content>
                    {
                        (isUserPortal === 0)
                            ? (
                                <Message warning>
                                    <p>{ t("views:components.consentManagement.modals." +
                                        "consentRevokeModal.warning") }</p>
                                </Message>
                            )
                            : null
                    }
                </Modal.Content>
            </ModalComponent>
        );
    };

    return (
        <>
            <SettingsSection
                description={ t("views:sections.consentManagement.description") }
                header={ t("views:sections.consentManagement.heading") }
                placeholder={
                    !(consentedApps && consentedApps.length && consentedApps.length > 0)
                        ? t("views:sections.consentManagement.actionTitles.empty")
                        : null
                }
                showActionBar={ !(consentedApps && consentedApps.length && consentedApps.length > 0) }
            >
                <AppConsentList
                    consentedApps={ consentedApps }
                    onClaimUpdate={ handleClaimUpdate }
                    onAppConsentRevoke={ handleAppConsentRevoke }
                    onClaimRevokeToggle={ handleClaimRevokeToggle }
                    revokedClaimList={ revokedClaimList }
                    consentListActiveIndexes={ consentListActiveIndexes }
                    onConsentDetailClick={ handleConsentDetailClick }
                />
                { revokingConsent && consentRevokeModal() }
            </SettingsSection>
        </>
    );
};
