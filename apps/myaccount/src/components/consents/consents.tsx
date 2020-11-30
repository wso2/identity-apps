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

import { TestableComponentInterface } from "@wso2is/core/models";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Message, Modal } from "semantic-ui-react";
import { AppConsentList } from "./consents-list";
import {
    fetchConsentReceipt,
    fetchConsentedApps,
    revokeConsentedApp,
    updateConsentedClaims, fetchPurposesByIDs
} from "../../api/consents";
import { AppConstants } from "../../constants";
import {
    AlertInterface,
    AlertLevels,
    ConsentInterface, ConsentReceiptInterface,
    ConsentState, PIICategory, PIICategoryClaimToggleItem, PIICategoryWithStatus, PurposeInterface, PurposeModel,
    RevokedClaimInterface,
    ServiceInterface
} from "../../models";
import { AppState } from "../../store";
import { endUserSession } from "../../utils";
import { ModalComponent, SettingsSection } from "../shared";

/**
 * Proptypes for the user sessions component.
 * Also see {@link Consents.defaultProps}
 */
interface ConsentComponentProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Consent management component.
 *
 * @return {JSX.Element}
 */
export const Consents: FunctionComponent<ConsentComponentProps> = (props: ConsentComponentProps): JSX.Element => {

    const { onAlertFired, ["data-testid"]: testId } = props;

    const [ consentedApps, setConsentedApps ] = useState<ConsentInterface[]>([]);
    const [ revokingConsent, setRevokingConsent ] = useState<ConsentInterface>();
    const [ isConsentRevokeModalVisible, setConsentRevokeModalVisibility ] = useState(false);
    const [ revokedClaimList, setRevokedClaimList ] = useState<RevokedClaimInterface[]>([]);
    const [ consentListActiveIndexes, setConsentListActiveIndexes ] = useState([]);
    const [ deniedPIIClaimList, setDeniedPIIClaimList ] = useState<Set<PIICategoryClaimToggleItem>>(new Set());
    const [ acceptedPIIClaimList, setAcceptedPIIClaimList ] = useState<Set<PIICategoryClaimToggleItem>>(new Set());
    const userName: string = useSelector((state: AppState) => state?.authenticationInformation?.username);
    const { t } = useTranslation();

    /**
     * Retrieves the consented applications of the user. It will only
     * fetch {@link ConsentState.ACTIVE} apps. Once fetched this function will
     * set the consented apps state {@link setConsentedApps}.
     *
     * For example: -
     * The IDP consent "My Account" will always be active and if theres
     * any custom consents added it will be listed as "Resident IDP".
     *
     * @see fetchConsentedApps
     */
    const getConsentedApps = (): void => {
        fetchConsentedApps(ConsentState.ACTIVE, userName)
            .then((response) => {
                setConsentedApps(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "userPortal:components.consentManagement.notifications.consentedAppsFetch.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.consentManagement.notifications.consentedAppsFetch.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "userPortal:components.consentManagement.notifications.consentedAppsFetch.genericError" +
                        ".description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("userPortal:components.consentManagement.notifications.consentedAppsFetch" +
                        ".genericError.message")
                });
            });
    };

    useEffect(() => {
        getConsentedApps();
    }, []);

    /**
     * Populates the PII claim list to state hooks.
     *
     * @param {ConsentInterface} app
     * @param {ConsentReceiptInterface} receipt
     */
    const populatePIIClaimListStates = async (
        app: ConsentInterface,
        receipt: ConsentReceiptInterface
    ): Promise<void> => {
        const accepted: Set<PIICategoryClaimToggleItem> = new Set(acceptedPIIClaimList.values());
        const denied: Set<PIICategoryClaimToggleItem> = new Set(deniedPIIClaimList.values());

        const purposes = _.chain(receipt.services)
            .map((service: ServiceInterface) => service.purposes)
            .flatten()
            .value();

        purposes.forEach((purpose) => {
            purpose.piiCategory.forEach((piiCat: PIICategoryWithStatus) => {
                const toggleItem: PIICategoryClaimToggleItem = {
                    piiCategoryId: piiCat.piiCategoryId,
                    purposeId: purpose.purposeId,
                    receiptId: app.consentReceiptID,
                    status: piiCat.status
                };
                if (piiCat.status === "accepted") {
                    accepted.add(toggleItem);
                } else {
                    denied.add(toggleItem);
                }
            });
        });

        setAcceptedPIIClaimList(accepted);
        setDeniedPIIClaimList(denied);
    };

    /**
     * This method will fetch detailed purposes of every service listed in the
     * {@code receipt} model. See {@link fetchPurposesByIDs} to understand the
     * fetch call.
     *
     * Important Note: -
     * This is a mutating function and therefore the argument {@code receipt}
     * will get mutated after calling this function. If you want to prevent this
     * from happening then deep clone the {@code receipt} via LodashCloneDeep
     * and pass it to the function.
     *
     * @param {ConsentReceiptInterface} receipt
     * @return {Promise<void>} void
     */
    const attachReceiptPurposeDetails = async (receipt: ConsentReceiptInterface): Promise<void> => {

        // First we need to get detailed information of this newly fetched receipt.
        // We may have multiple services in {@code receipt.services} and each
        // service will have multiple purposes.
        //
        // To solve this we use a dynamic programming approach where we store
        // the required values in advance. Why? because if we try to fetch each
        // purpose by its ID within the loop we will exhaust the server.

        const purposeToServices: Map<number, number[]> = new Map<number, number[]>();

        receipt.services.forEach((service: ServiceInterface, index: number) => {
            service.purposes.forEach(({ purposeId }: PurposeInterface) => {
                if (purposeToServices.has(purposeId)) {
                    purposeToServices.get(purposeId).push(index);
                } else {
                    purposeToServices.set(purposeId, [ index ]);
                }
            });
        });

        // Now go and fetch all the detailed purposes of every service.
        const response: PurposeModel[] = await fetchPurposesByIDs(
            Array.from(purposeToServices.keys())
        );

        // Now iterate through each of the {@code PurposeModel[]}
        response.forEach((detailedPurpose): void => {
            // Now refer back to the services that rely on this purpose.
            // Then find the correct purpose and attach the detailed info
            // for that purpose.
            purposeToServices.get(detailedPurpose.purposeId)
                // Map out the matching Purpose
                .map((serviceIndex): PurposeInterface => {
                    return receipt.services[serviceIndex].purposes.find(
                        ({ purposeId }) => purposeId === detailedPurpose.purposeId
                    )
                })
                // For each mapped out purpose set the full pii categories
                .forEach((purpose): void => {
                    purpose.allPIICategories = detailedPurpose.piiCategories;
                })
        });

        // Now we need to figure out which piiCategory claim
        // is denied and which is accepted.
        receipt.services.forEach((service): void => {
            service.purposes.forEach((purpose): void => {

                // Set the accepted PII categories.
                const accepted = _.cloneDeep(purpose.piiCategory)
                    .map((piiCat: PIICategory): PIICategoryWithStatus => {
                        return { status: "accepted", ...piiCat }
                    });
                // Now keep a reference of these accepted PII categories.
                const acceptedCategoryIDs: Set<number> = new Set<number>(
                    accepted.map((pii) => pii.piiCategoryId)
                );

                // Set the denied PII categories
                const denied = purpose.allPIICategories
                    .filter((piiCat): boolean => !acceptedCategoryIDs.has(piiCat.piiCategoryId))
                    .map((piiCat): PIICategoryWithStatus => {
                        return {
                            piiCategoryId: piiCat.piiCategoryId,
                            piiCategoryName: piiCat.piiCategory,
                            piiCategoryDisplayName: piiCat.displayName,
                            validity: "DATE_UNTIL:INDEFINITE",
                            status: "denied",
                        } as PIICategoryWithStatus;
                    });
                // Finally mutate the {@code piiCategory} property with piiCategories
                // with the status attached to them. Note that we are down casting
                // {@code piiCategory} property explicitly.
                //
                // @see PIICategoryWithStatus
                purpose.piiCategory = [ ...accepted, ...denied ] as PIICategoryWithStatus[];
            });
        });

    };

    /**
     * Fetches the consent receipt for the corresponding id.
     *
     * @param receiptId - Consent receipt id.
     */
    const getConsentReceipt = (receiptId): void => {
        fetchConsentReceipt(receiptId)
            .then(async (response) => {
                const apps = [ ...consentedApps ];

                // Go fetch and attach purpose details to this {@code receipt}
                await attachReceiptPurposeDetails(response);

                // Now we need to find the consent that matches the {@code receiptId}
                // and set the optional property {@link ConsentInterface.consentReceipt}
                for (const app of apps) {
                    if (app.consentReceiptID === receiptId) {
                        app.consentReceipt = response;
                        await populatePIIClaimListStates(app, response);
                    }
                }
                // Once we set the newly fetched receipt to the matching
                // consented app instance. We set the consented apps again
                // using the hook {@code setConsentedApps}
                setConsentedApps(apps);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "userPortal:components.consentManagement.notifications.consentReceiptFetch.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.consentManagement.notifications.consentReceiptFetch.error" +
                            ".message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "userPortal:components.consentManagement.notifications.consentReceiptFetch" +
                        ".genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "userPortal:components.consentManagement.notifications.consentReceiptFetch" +
                        ".genericError.message")
                });
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
        let found = false;

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

    const piiClaimToggleHandler = (piiCategoryId: number, purposeId: number, receiptId: string): void => {

        const currentState = [ ...deniedPIIClaimList, ...acceptedPIIClaimList ];
        let piiItem: PIICategoryClaimToggleItem;

        for (const item of currentState) {
            if (item.piiCategoryId === piiCategoryId &&
                item.purposeId === purposeId &&
                item.receiptId === receiptId) {
                piiItem = item;
            }
        }

        // If the toggled PII category item's status is "denied"
        // then move it to the "accepted" list. @see PIICategoryStatus
        if (piiItem.status === "denied") {
            deniedPIIClaimList.delete(piiItem);
            piiItem.status = "accepted";
            setDeniedPIIClaimList(new Set(deniedPIIClaimList.values()));
            setAcceptedPIIClaimList(new Set([ ...acceptedPIIClaimList.values(), piiItem ]));

        } else {
            acceptedPIIClaimList.delete(piiItem);
            piiItem.status = "denied";
            setAcceptedPIIClaimList(new Set(acceptedPIIClaimList.values()));
            setDeniedPIIClaimList(new Set([ ...deniedPIIClaimList.values(), piiItem ]));
        }

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
     * Resets the consented apps list.
     *
     * @param {boolean} refetch - Flag to set the if re-fetch is enabled.
     */
    const resetConsentedAppList = (refetch = true): void => {
        // Close all the opened drawers.
        setConsentListActiveIndexes([]);

        if (refetch) {
            // Re-fetch the consented apps list
            getConsentedApps();
        }
    };

    /**
     * Revokes the consent of an already consented application.
     *
     * @param {ConsentInterface} consent - Consent which needs to be revoked.
     */
    const revokeAppConsent = (consent: ConsentInterface): void => {
        const self: number = AppConstants.PORTAL_SP_DESCRIPTION.localeCompare(consent.spDisplayName);

        revokeConsentedApp(consent.consentReceiptID)
            .then(() => {
                onAlertFired({
                    description: t(
                        "userPortal:components.consentManagement.notifications.revokeConsentedApp.success" +
                        ".description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "userPortal:components.consentManagement.notifications.revokeConsentedApp" +
                        ".success.message")
                });

                // If the revoked app is myaccount, end the session.
                if (self === 0) {
                    endUserSession();

                    return;
                }

                // Reset the list
                resetConsentedAppList(true);

                setConsentRevokeModalVisibility(false);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "userPortal:components.consentManagement.notifications.revokeConsentedApp.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.consentManagement.notifications.revokeConsentedApp.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "userPortal:components.consentManagement.notifications.revokeConsentedApp.genericError" +
                        ".description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "userPortal:components.consentManagement.notifications.revokeConsentedApp" +
                        ".genericError.message")
                });
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

        let isPIIEmpty = false;

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

                onAlertFired({
                    description: t(
                        "userPortal:components.consentManagement.notifications.updateConsentedClaims.success" +
                        ".description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t("userPortal:components.consentManagement.notifications.updateConsentedClaims." +
                        "success.message")
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "userPortal:components.consentManagement.notifications.updateConsentedClaims.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "userPortal:components.consentManagement.notifications.updateConsentedClaims" +
                            ".error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "userPortal:components.consentManagement.notifications.updateConsentedClaims.genericError" +
                        ".description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "userPortal:components.consentManagement.notifications.updateConsentedClaims." +
                        "genericError.message")
                });
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
     * Consent revoke modal.
     *
     * @return {JSX.Element}
     */
    const consentRevokeModal = (): JSX.Element => {
        const self: number = AppConstants.PORTAL_SP_DESCRIPTION.localeCompare(
            revokingConsent.spDisplayName);

        return (
            <ModalComponent
                data-testid={ `${testId}-revoke-modal` }
                primaryAction={ t("common:revoke") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleConsentRevokeModalClose }
                onPrimaryActionClick={ () => revokeAppConsent(revokingConsent) }
                open={ isConsentRevokeModalVisible }
                onClose={ handleConsentRevokeModalClose }
                type="negative"
                header={
                    t("userPortal:components.consentManagement.modals.consentRevokeModal.heading",
                        { appName: revokingConsent.spDisplayName })
                }
                content={ t("userPortal:components.consentManagement.modals.consentRevokeModal.message") }
            >
                <Modal.Content data-testid={ `${testId}-revoke-modal-content` }>
                    {
                        (self === 0)
                            ? (
                                <Message warning>
                                    <p>{ t("userPortal:components.consentManagement.modals." +
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
                data-testid={ `${testId}-settings-section` }
                description={ t("userPortal:sections.consentManagement.description") }
                header={ t("userPortal:sections.consentManagement.heading") }
                placeholder={
                    !(consentedApps && consentedApps.length && consentedApps.length > 0)
                        ? t("userPortal:sections.consentManagement.actionTitles.empty")
                        : null
                }
                showActionBar={ !(consentedApps && consentedApps.length && consentedApps.length > 0) }
            >
                <AppConsentList
                    data-testid={ `${testId}-list` }
                    consentedApps={ consentedApps }
                    onClaimUpdate={ handleClaimUpdate }
                    onAppConsentRevoke={ handleAppConsentRevoke }
                    onClaimRevokeToggle={ handleClaimRevokeToggle }
                    revokedClaimList={ revokedClaimList }
                    consentListActiveIndexes={ consentListActiveIndexes }
                    onConsentDetailClick={ handleConsentDetailClick }
                    onPIIClaimToggle={ piiClaimToggleHandler }
                    deniedPIIClaimList={ deniedPIIClaimList }
                    acceptedPIIClaimList={ acceptedPIIClaimList }
                />
                { revokingConsent && consentRevokeModal() }
            </SettingsSection>
        </>
    );
};

/**
 * Default properties of {@link Consents}
 * See type definitions in {@link ConsentComponentProps}
 */
Consents.defaultProps = {
    "data-testid": "consents"
};
