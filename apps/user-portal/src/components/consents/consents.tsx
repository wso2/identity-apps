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

import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {Button, Container, Grid, List, Message, Modal, Placeholder} from "semantic-ui-react";
import { fetchConsentedApps, fetchConsentReceipt, revokeConsentedApp, updateConsentedClaims } from "../../api/consents";
import {
    ConsentInterface,
    ConsentState,
    createEmptyConsentReceipt,
    createEmptyNotification,
    Notification,
    ServiceInterface
} from "../../models";
import { ConsentReceiptInterface } from "../../models/consents";
import { SettingsSection } from "../shared";
import { AppConsentList } from "./consents-list";
import { endUserSession } from "../../utils";

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
    const [consentedApps, setConsentedApps] = useState<ConsentInterface[]>([]);
    const [editConsentedApps, setEditConsentedApps] = useState<ConsentInterface[]>([]);
    const [consentReceipt, setConsentReceipt] = useState<ConsentReceiptInterface>(createEmptyConsentReceipt);
    const [editingConsentReceipt, setEditingConsentReceipt] = useState<ConsentReceiptInterface>();
    const [editingConsent, setEditingConsent] = useState<ConsentInterface>();
    const [activeIndex, setActiveIndex] = useState("");
    const [isConsentRevokeModalVisible, setConsentRevokeModelView] = useState(false);
    const [revokedPIICatList, setRevokedPIICatList] = useState<number[]>([]);

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
                setEditConsentedApps(response);
                notification = {
                    description: t(
                        "views:components.consentManagement.notifications.consentedAppsFetch.success.description"
                    ),
                    message: t("views:components.consentManagement.notifications.consentedAppsFetch.success" +
                        ".message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
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
            });

        onNotificationFired(notification);
    };

    const getConsentReceipt = (receiptId) => {
        fetchConsentReceipt(receiptId)
            .then((response) => {
                setConsentReceipt(response);
                setEditingConsentReceipt(response);
                notification = {
                    description: t(
                        "views:components.consentManagement.notifications.consentReceiptFetch.success" +
                        ".description"
                    ),
                    message: t("views:components.consentManagement.notifications.consentReceiptFetch" +
                        ".success.message"),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
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
            });

        onNotificationFired(notification);
    };

    /**
     * The following method handles the revoke claim button click. This retrieves the
     * pii category id of the revoked claim and stores it in the state.
     * @param piiCategory
     */
    const revokePIICategory = (piiCategory) => {
        const indexes = [ ...revokedPIICatList ];

        if (!revokedPIICatList.includes(piiCategory.piiCategoryId)) {
            indexes.push(piiCategory.piiCategoryId);
        } else if (revokedPIICatList.includes(piiCategory.piiCategoryId)) {
            const removingIndex = revokedPIICatList.indexOf(piiCategory.piiCategoryId);
            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
        }
        setRevokedPIICatList(indexes);
    };

    /**
     * The following method handles the undo claim revoke button click. This retrieves the
     * pii category id of the revoked claim and remove it from the state.
     * @param piiCategory
     */
    const undoRevokePIICategory = (e, { id }) => {
        const indexes = [ ...revokedPIICatList ];

        if (revokedPIICatList.includes(id)) {
            const removingIndex = revokedPIICatList.indexOf(id);
            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
        }
        setRevokedPIICatList(indexes);
    };

    /**
     * Handles the consent edit button click. Retrieves the the receipt information
     * and stores it in the state and sets the current consent object as the editing
     * consent. And finally toggles the consent edit modal visibility.
     * @param {ConsentInterface} consent corresponding consent object
     */
    const handleConsentEditClick = (e, { id }): void => {
        getConsentReceipt(id);
        setActiveIndex(id);
    };

    /**
     * Handles the consent revoke button click. Sets the current consent object as
     * the editing consent and toggles the visibility of the consent revoke modal.
     * @param {ConsentInterface} consent corresponding consent object
     */
    const handleConsentRevokeClick = (consent: ConsentInterface): void => {
        setEditingConsent(consent);
        setConsentRevokeModelView(true);
    };

    /**
     * Revokes the consent of an already consented application.
     */
    const revokeConsent = (consent: ConsentInterface): void => {
        const spName = "This is the user portal application.";
        const compare = spName.localeCompare(consent.spDisplayName);
        revokeConsentedApp(consent.consentReceiptID)
            .then((response) => {
                getConsentedApps();
                setConsentRevokeModelView(false);
                if (compare === 0) {
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
                        negative: true
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
            });

        onNotificationFired(notification);
    };

    /**
     * Handles the claims update button click action event. The revoked claims are taken
     * out of the existing receipt object and are passed on to the `updateConsentedClaims`
     * which executes the API request and updates the consented claims.
     */
    const handleClaimUpdateClick = (): void => {
        const receipt = { ...editingConsentReceipt };

        let isPIIEmpty: boolean = false;

        // If the `piiCategory` id is in the `revokedClaimIds`,
        // then the category is removed from the list.
        receipt.services.map((service: ServiceInterface) => {
            service.purposes.map((purpose) => {
                purpose.piiCategory = purpose.piiCategory.filter((cat) => {
                    if (!revokedPIICatList.includes(cat.piiCategoryId)) {
                        return cat;
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
            setConsentRevokeModelView(true);
        } else {
            updateConsentedClaims(receipt)
                .then(() => {
                    setActiveIndex("");
                    getConsentedApps();
                    notification = {
                        description: t(
                            "views:components.consentManagement.notifications.updateConsentedClaims.success" +
                            ".description"
                        ),
                        message: t("views:components.consentManagement.notifications.updateConsentedClaims." +
                            "success.message"),
                        otherProps: {
                            negative: true
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
                });

            onNotificationFired(notification);
        }
    };

    /**
     * Handles the consent modal close action.
     */
    const handleEditViewClose = (): void => {
        setActiveIndex("");
        setRevokedPIICatList([]);
    };

    /**
     * Handles the consent revoke modal close action.
     */
    const handleConsentRevokeModalClose = (): void => {
        setConsentRevokeModelView(false);
    };

    /**
     * Generates an empty placeholder to be shown until the consented
     * application list is fetched from the API.
     *
     * @return {JSX.Element[]}
     */
    const createConsentedAppsListPlaceholder = (): JSX.Element[] => {
        const placeholder = [];
        for (let i = 0; i < 2; i++) {
            placeholder.push(
                <List.Item className="inner-list-item" key={ i }>
                    <Grid padded>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 } className="first-column">
                                <List.Content verticalAlign="middle">
                                    <Placeholder>
                                        <Placeholder.Header image>
                                            <Placeholder.Line/>
                                            <Placeholder.Line/>
                                        </Placeholder.Header>
                                    </Placeholder>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Item>
            );
        }
        return placeholder;
    };

    const consentRevokeMessage = () => {
        const spName = "This is the user portal application.";
        const compare = spName.localeCompare(editingConsent.spDisplayName);
        if (compare === 0) {
            return (
                <Message warning>
                    <p>Please note that you will be redirected to the login consent page.</p>
                </Message>
            );
        }
    }

    const consentRevokeModal =  editingConsent ? (
    const consentRevokeModal =  editingConsent ? (
        <Modal
            size="mini"
            className="link-button"
            open={ isConsentRevokeModalVisible }
            onClose={ handleConsentRevokeModalClose }
            dimmer="blurring"
        >
            <Modal.Content>
                <Container>
                    <h3>
                        {
                            t("views:components.consentManagement.modals.consentRevokeModal.heading",
                                { appName: editingConsent.spDisplayName })
                        }
                    </h3>
                    { consentRevokeMessage() }
                </Container>
                <br/>
                <p>{ t("views:components.consentManagement.modals.consentRevokeModal.message") }</p>
            </Modal.Content>
            <Modal.Actions>
                <Button className="link-button" onClick={ handleConsentRevokeModalClose }>
                    { t("common:cancel") }
                </Button>
                <Button primary onClick={ () => revokeConsent(editingConsent) }>
                    { t("common:revoke") }
                </Button>
            </Modal.Actions>
        </Modal>
    ) : null;

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
                    editConsentedApps={ editConsentedApps }
                    onConsentEditClick={ handleConsentEditClick }
                    onConsentRevokeClick={ handleConsentRevokeClick }
                    onClaimUpdateClick={ handleClaimUpdateClick }
                    onEditViewCloseClick={ handleEditViewClose }
                    editingConsent={ editingConsent }
                    editingConsentReceipt={ editingConsentReceipt }
                    consentReceipt={ consentReceipt }
                    revokeConsent={ revokeConsent }
                    activeIndex={ activeIndex }
                    revokePIICategory={ revokePIICategory }
                    undoRevokePIICategory={ undoRevokePIICategory }
                    revokedPIICatList={ revokedPIICatList }
                />
                { consentRevokeModal }
            </SettingsSection>
            </>
    );
};
