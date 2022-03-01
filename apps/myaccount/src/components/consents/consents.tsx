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
import cloneDeep from "lodash-es/cloneDeep";
import flatten from "lodash-es/flatten";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Message, Modal } from "semantic-ui-react";
import { AppConsentList } from "./consents-list";
import { fetchHomeRealmIdentifiers } from "../../api";
import {
    fetchAllPurposes,
    fetchConsentReceipt,
    fetchConsentedApps,
    fetchPurposesByIDs,
    revokeConsentedApp,
    updateConsentedClaims
} from "../../api/consents";
import { AppConstants, ConsentConstants } from "../../constants";
import {
    AlertInterface,
    AlertLevels,
    ConsentInterface,
    ConsentReceiptInterface,
    ConsentState,
    PIICategory,
    PIICategoryClaimToggleItem,
    PIICategoryWithStatus,
    PurposeInterface,
    PurposeModel,
    PurposeModelPartial,
    ServiceInterface
} from "../../models";
import { AppState } from "../../store";
import { useEndUserSession } from "../../utils";
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
    const [ purposeDetailModels, setPurposeDetailModels ] = useState<PurposeModel[]>([]);
    const [ revokingConsent, setRevokingConsent ] = useState<ConsentInterface>();
    const [ isConsentRevokeModalVisible, setConsentRevokeModalVisibility ] = useState(false);
    const [ consentListActiveIndexes, setConsentListActiveIndexes ] = useState([]);
    const [ deniedPIIClaimList, setDeniedPIIClaimList ] = useState<Set<PIICategoryClaimToggleItem>>(new Set());
    const [ acceptedPIIClaimList, setAcceptedPIIClaimList ] = useState<Set<PIICategoryClaimToggleItem>>(new Set());
    const userName: string = useSelector((state: AppState) => state?.authenticationInformation?.profileInfo.userName);
    const tenantDomain: string = useSelector((state: AppState) => state?.authenticationInformation?.tenantDomain);
    const { t } = useTranslation();
    const endUserSession = useEndUserSession();

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
    const getConsentedApps = async (): Promise<void> => {

        try {
            const apps: ConsentInterface[] = await fetchConsentedApps(ConsentState.ACTIVE, userName);
            // Check whether we have the "Resident IDP" consent in the consented apps list and remove it.
            const consentedApps = apps.filter(({ spDisplayName }) =>
                spDisplayName !== ConsentConstants.SERVICE_DISPLAY_NAME);

            setConsentedApps(consentedApps);
        } catch (error) {
            if (error.response && error.response.data && error.response.detail) {
                onAlertFired({
                    description: t(
                        "myAccount:components.consentManagement.notifications.consentedAppsFetch.error" +
                        ".description",
                        { description: error.response.data.detail }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.consentManagement.notifications.consentedAppsFetch.error.message"
                    )
                });
            } else {
                onAlertFired({
                    description: t(
                        "myAccount:components.consentManagement.notifications.consentedAppsFetch.genericError" +
                        ".description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("myAccount:components.consentManagement.notifications.consentedAppsFetch" +
                        ".genericError.message")
                });
            }
        }

    };

    /**
     * Creates an empty "Resident IDP" consent.
     */
    const createEmptyResidentIDPConsent = async (): Promise<ConsentInterface> => {

        // Fetch the home realm identifiers list from the server configuration. If there's any exceptions
        // thrown it will be handled in @link getConsentedApps function.
        const homeRealmIdentifiers: string[] = await fetchHomeRealmIdentifiers();

        // Use the profile username for the piiPrincipalId.
        const piiPrincipalId = userName;

        const receipt: ConsentInterface = {
            consentReceipt: {
                version: "", // Server will set this value
                collectionMethod: ConsentConstants.COLLECTION_METHOD,
                jurisdiction: "", // Optional
                language: "", // Optional
                policyUrl: "", // Optional
                services: [ {
                    purposes: [], // Mandatory length can't be zero
                    service: homeRealmIdentifiers[0], // Mandatory
                    serviceDescription: ConsentConstants.SERVICE_DESCRIPTION, // Mandatory
                    serviceDisplayName: ConsentConstants.SERVICE_DISPLAY_NAME, // Mandatory
                    tenantDomain: tenantDomain // Mandatory
                } ] // Mandatory
            },
            // Below {@code consentReceiptID} will get overridden by the server
            // we use it here just for identifying this receipt
            consentReceiptID: ConsentConstants.PLACEHOLDER_RECEIPT_ID,
            language: "", // Optional
            piiPrincipalId: piiPrincipalId, // Mandatory
            spDescription: ConsentConstants.SERVICE_DESCRIPTION, // Mandatory
            spDisplayName: ConsentConstants.SERVICE_DISPLAY_NAME, // Mandatory
            state: ConsentState.ACTIVE, // Mandatory
            tenantDomain: tenantDomain // Mandatory
        };

        return Promise.resolve(receipt);

    };

    /**
     * We will use this function to pre-fetch the purpose models details.
     *
     * This function calls the {@link fetchAllPurposes} and fetches all the
     * available purposes in this application (including "DEFAULT" & "SYSTEM").
     * Also this function will cache those purposes in a state hook to reuse
     * throughout the life cycle of this component.
     *
     * @see setPurposeModels
     * @see purposeModels
     */
    const getAllPurposesDetails = async (): Promise<void> => {
        // Go and fetch all the available purpose models.
        const purposeModelPartials: PurposeModelPartial[] = await fetchAllPurposes();
        // Now map out only their ids to get the detailed information.
        const purposesIds = new Set(purposeModelPartials.map(({ purposeId }) => purposeId));
        // Now go and fetch all the detailed purposes of every service.
        const response: PurposeModel[] = await fetchPurposesByIDs(purposesIds);
        // Set response value to the hook
        setPurposeDetailModels(response);
    }

    /**
     * Apply any component side-effects here.
     */
    useEffect(() => {
        if (!userName) {
            return;
        }
        ( async function _execute() {
            await getConsentedApps();
            await getAllPurposesDetails();
        }() );
    }, [userName]);

    /**
     * Populates the PII claim list to state hooks.
     *
     * @param {ConsentInterface} app
     * @param {ConsentReceiptInterface} receipt
     */
    const populatePIIClaimListStates = async (app: ConsentInterface, receipt: ConsentReceiptInterface): Promise<void> => {

        const accepted: Set<PIICategoryClaimToggleItem> = new Set(acceptedPIIClaimList.values());
        const denied: Set<PIICategoryClaimToggleItem> = new Set(deniedPIIClaimList.values());

        const purposes = flatten(
            (receipt.services || [] as ServiceInterface[])
                .map((service: ServiceInterface) => service.purposes as PurposeInterface[])
        );

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

    const attachResidentIDPReceiptMissingPurposes = async (receipt: ConsentReceiptInterface): Promise<void> => {

        // Filter out the non-default purposes from the cached {@link purposeModels}
        const allPurposeModelsExceptDefault = purposeDetailModels.filter(
            ({ purpose }) => purpose !== ConsentConstants.DEFAULT_CONSENT
        );

        const createEmptyPurposeObject = (partial: PurposeModelPartial) => {
            return {
                consentType: ConsentConstants.CONSENT_TYPE,
                purpose: partial.purpose,
                purposeId: partial.purposeId,
                description: partial.description,
                piiCategory: [],
                primaryPurpose: true,
                termination: ConsentConstants.TERMINATION,
                thirdPartyDisclosure: true,
                thirdPartyName: ConsentConstants.EMPTY_STRING,
                allPIICategories: [],
            };
        };

        /**
         * In this step what we go through this {@code receipt} services and keep a
         * reference of all of its purposes ids. Then we append the missing purposes
         * to that service.
         */
        for (const service of receipt.services) {
            const availablePurposes = new Set(service.purposes.map(({ purposeId }) => purposeId));
            for (const purposeModel of allPurposeModelsExceptDefault) {
                if (!availablePurposes.has(purposeModel.purposeId)) {
                    service.purposes.push(createEmptyPurposeObject(purposeModel))
                }
            }
        }

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
    const attachResidentIDPReceiptPurposes = async (receipt: ConsentReceiptInterface): Promise<void> => {

        const purposeToServices: Map<number, number[]> = new Map<number, number[]>();

        // In this step what we do is, going through this receipt services and
        // remember which purpose falls in to which service. So, by doing this
        // we can iterate through all the available purposes and along the way
        // we can all the services by calling map.get(purposeId).
        receipt.services.forEach((service: ServiceInterface, index: number) => {
            service.purposes.forEach(({ purposeId }: PurposeInterface) => {
                if (purposeToServices.has(purposeId)) {
                    purposeToServices.get(purposeId).push(index);
                } else {
                    purposeToServices.set(purposeId, [ index ]);
                }
            });
        });

        const allPurposesExceptDefault = purposeDetailModels.filter(
            ({ purpose }) => purpose !== ConsentConstants.DEFAULT_CONSENT
        );

        // Now iterate through each of the {@code PurposeModel[]}
        allPurposesExceptDefault.forEach((detailedPurpose): void => {
            // Now refer back to the services that rely on this purpose.
            const matchingServices = purposeToServices.get(detailedPurpose.purposeId);
            if (matchingServices && matchingServices.length) {
                // Then find the correct purpose and attach the detailed info
                // for that purpose.
                matchingServices.forEach((serviceIndex): void => {
                    const service = receipt.services[serviceIndex];
                    const purpose = service.purposes.find(
                        ({ purposeId }) => purposeId === detailedPurpose.purposeId
                    );
                    if (purpose) {
                        // For each mapped out purpose set the full pii categories
                        purpose.description = detailedPurpose.description;
                        purpose.allPIICategories = detailedPurpose.piiCategories;
                    }
                });
            }
        });

        bindPIICategoryStatus(receipt);

    };

    /**
     * Now we need to figure out which piiCategory claim is denied and which is accepted.
     * @param receipt
     */
    const bindPIICategoryStatus = (receipt: ConsentReceiptInterface): void => {

        const purposes = flatten(
            (receipt.services || [] as ServiceInterface[])
                .map(({ purposes }) => purposes as PurposeInterface[])
        );

        for (const purpose of purposes) {
            // Set the accepted PII categories.
            const accepted = purpose.piiCategory.map((piiCat: PIICategory): PIICategoryWithStatus => {
                return { status: "accepted", ...piiCat }
            });
            // Now keep a reference of these accepted PII categories.
            const acceptedCategoryIDs: Set<number> = new Set<number>(
                accepted.map((pii) => pii.piiCategoryId)
            );
            // Moving on to check if there any denied permissions.
            let denied = [];
            if (purpose.allPIICategories && purpose.allPIICategories.length) {
                // Set the denied PII categories
                denied = purpose.allPIICategories
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
            }
            /**
             * Finally mutate the {@code piiCategory} property with piiCategories
             * with the status attached to them. Note that we are down casting
             * {@code piiCategory} property explicitly.
             * @see PIICategoryWithStatus
             */
            purpose.piiCategory = [ ...accepted, ...denied ] as PIICategoryWithStatus[];
        }

    }

    /**
     * Fetches the consent receipt for the corresponding id.
     *
     * @param receiptId - Consent receipt id.
     */
    const getConsentReceipt = async (receiptId): Promise<void> => {

        try {
            // Get the apps that is previously fetched from the state.
            const apps: ConsentInterface[] = [ ...consentedApps ];
            /**
             * Now we need to find the consent that matches the {@code receiptId}
             * We will use this consent reference to set the {@code receipt}.
             */
            const consent: ConsentInterface = apps.find(
                ({ consentReceiptID }) => consentReceiptID === receiptId
            );
            /**
             * We check if the requesting receiptId matched the {@link ConsentConstants.PLACEHOLDER_RECEIPT_ID}
             * and directly assign the receipt from the consent. If you inspect inside the method
             * {@link createEmptyResidentIDPConsent} you can see that we are assigning a placeholder
             * receipt to its consent object. Therefore we can safely assume {@link consent.consentReceipt}
             * value is always truthy.
             *
             * Also, if the {@code receiptId} is not the placeholder then we know its a legit consent created by
             * our server. And we just have to try and fetch its receipt by id.
             */
            let receipt: ConsentReceiptInterface;
            if (receiptId === ConsentConstants.PLACEHOLDER_RECEIPT_ID) {
                receipt = consent.consentReceipt;
            } else {
                receipt = await fetchConsentReceipt(receiptId);
            }
            /**
             * If the requesting receipt is the "Resident IDP" receipt then apply any missing purpose
             * models to it. Note that we only do this for service provider named "Resident IDP".
             */
            if (consent.spDisplayName === ConsentConstants.SERVICE_DISPLAY_NAME) {
                await attachResidentIDPReceiptMissingPurposes(receipt);
                await attachResidentIDPReceiptPurposes(receipt);
            } else {
                const defaultPurpose = purposeDetailModels.find(
                    ({ purpose }) => purpose === ConsentConstants.DEFAULT_CONSENT
                );
                if (defaultPurpose) {
                    receipt.services.forEach(({ purposes }) => purposes.forEach(
                        (purpose) => purpose.description = defaultPurpose?.description ?? ""
                    ));
                }
                bindPIICategoryStatus(receipt);
            }

            // Set the optional property {@link ConsentInterface.consentReceipt}
            consent.consentReceipt = receipt;
            await populatePIIClaimListStates(consent, receipt);

            // Once we set the newly fetched receipt to the matching
            // consented app instance. We set the consented apps again
            // using the hook {@code setConsentedApps}
            setConsentedApps([ ...apps ]);

        } catch (error) {
            if (error.response && error.response.data && error.response.detail) {
                onAlertFired({
                    description: t(
                        "myAccount:components.consentManagement.notifications.consentReceiptFetch.error" +
                        ".description",
                        { description: error.response.data.detail }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.consentManagement.notifications.consentReceiptFetch.error" +
                        ".message"
                    )
                });
            } else {
                onAlertFired({
                    description: t(
                        "myAccount:components.consentManagement.notifications.consentReceiptFetch" +
                        ".genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.consentManagement.notifications.consentReceiptFetch" +
                        ".genericError.message")
                });
            }
        }
    };

    const piiClaimToggleHandler = (piiCategoryId: number, purposeId: number, receiptId: string): void => {

        const currentState = [ ...deniedPIIClaimList, ...acceptedPIIClaimList ];
        let piiItem: PIICategoryClaimToggleItem;

        for (const item of currentState) {
            if (item.piiCategoryId === piiCategoryId &&
                item.purposeId === purposeId &&
                item.receiptId === receiptId) {
                piiItem = item;
                break;
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
    const resetConsentedAppList = async (refetch = true): Promise<void> => {
        // Close all the opened drawers.
        setConsentListActiveIndexes([]);

        if (refetch) {
            // Re-fetch the consented apps list
            await getConsentedApps();
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
            .then(async () => {
                onAlertFired({
                    description: t(
                        "myAccount:components.consentManagement.notifications.revokeConsentedApp.success" +
                        ".description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.consentManagement.notifications.revokeConsentedApp" +
                        ".success.message")
                });

                // If the revoked app is myaccount, end the session.
                if (self === 0) {
                    endUserSession();

                    return;
                }

                // Reset the list
                await resetConsentedAppList(true);

                setConsentRevokeModalVisibility(false);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.consentManagement.notifications.revokeConsentedApp.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.consentManagement.notifications.revokeConsentedApp.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.consentManagement.notifications.revokeConsentedApp.genericError" +
                        ".description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.consentManagement.notifications.revokeConsentedApp" +
                        ".genericError.message")
                });
            });
    };

    /**
     * Handles the claims update button click action event. In this function
     * we will only be using the {@link acceptedPIIClaimList} to determine
     * which pii category claims are currently accepted for a given consent
     * receipt.
     *
     * @param {string} receiptId - consent receipt id.
     */
    const handleClaimUpdate = (receiptId: string): void => {
        /**
         * Find the matching {@link ConsentInterface} using {@code receiptId}
         * clone deep is needed to avoid mutations.
         */
        const updatingConsent = cloneDeep(consentedApps)
            .find((consent) => consent.consentReceiptID === receiptId);

        // Now refer the {@link acceptedPIIClaimList} and filter out only
        // items that matches {@code updatingConsent.consentReceiptID}
        const acceptedClaimsOfThisReceipt = [ ...acceptedPIIClaimList ].filter(
            (item: PIICategoryClaimToggleItem) => item.receiptId === updatingConsent.consentReceiptID
        );
        /**
         * In below forEach call we will go through each service of this receipt
         * and each purpose of the service to filter out the piiCategories that
         * is not accepted. And preserve only the piiCategories that is accepted.
         *
         * Below operation will mutate the {@code updatingConsent.consentReceipt}
         */
        updatingConsent.consentReceipt.services.forEach((service) => {
            service.purposes.forEach((purpose) => {
                // Now go and find the categories of this purpose and filter
                // out the ones that got revoked. And keep only accepted ones.
                purpose.piiCategory = purpose.piiCategory.filter((piiCat) => {
                    for (const accepted of acceptedClaimsOfThisReceipt) {
                        if (accepted.purposeId === purpose.purposeId &&
                            accepted.piiCategoryId === piiCat.piiCategoryId) {
                            return true;
                        }
                    }
                    return false;
                }).map((piiCat) => {
                    delete piiCat['status'];
                    return piiCat;
                });
            });
        });
        // Now remove all the purposes that don't have any piiCategories.
        // This is mandatory because the API won't allow to save a purpose
        // without at least 1 piiCategory item.
        updatingConsent.consentReceipt.services.forEach((s) => {
            s.purposes = s.purposes.filter(p => p.piiCategory.length > 0);
        });
        // Now check whether all the piiCategories of this specific receipt
        // is revoked. Essentially we are checking the sum of all the
        // {@code receipt.services.purposes.piiCategories}
        const isAllPIICategoriesRemovedFromThisReceipt: boolean = flatten<PurposeInterface>((
                updatingConsent.consentReceipt.services || [] as ServiceInterface[]
            ).map(value => value.purposes as PurposeInterface[])
        )
            .map(v => v.piiCategory?.length ?? 0)
            .reduce((accumulator, currentVal) => accumulator + currentVal, 0) === 0;
        // If consent to all the pii categories in every purpose are revoked
        // then the application (receipt) will have to be revoked.
        if (isAllPIICategoriesRemovedFromThisReceipt) {
            // If the PII category list is empty, show the consent revoke modal.
            // Else, perform the usual consented claims updating process.
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
                        "myAccount:components.consentManagement.notifications.updateConsentedClaims.success" +
                        ".description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t("myAccount:components.consentManagement.notifications.updateConsentedClaims." +
                        "success.message")
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.consentManagement.notifications.updateConsentedClaims.error" +
                            ".description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.consentManagement.notifications.updateConsentedClaims" +
                            ".error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.consentManagement.notifications.updateConsentedClaims.genericError" +
                        ".description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.consentManagement.notifications.updateConsentedClaims." +
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
    const handleConsentDetailClick = async (index: number, receiptId: string): Promise<void> => {
        const indexes = [ ...consentListActiveIndexes ];

        if (consentListActiveIndexes.includes(index)) {
            const removingIndex = consentListActiveIndexes.indexOf(index);
            if (removingIndex !== -1) {
                indexes.splice(removingIndex, 1);
            }
        } else {
            indexes.push(index);
            // Fetch the consent receipt.
            await getConsentReceipt(receiptId);
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
                    t("myAccount:components.consentManagement.modals.consentRevokeModal.heading",
                        { appName: revokingConsent.spDisplayName })
                }
                content={ t("myAccount:components.consentManagement.modals.consentRevokeModal.message") }
            >
                <Modal.Content data-testid={ `${testId}-revoke-modal-content` }>
                    {
                        (self === 0)
                            ? (
                                <Message warning>
                                    <p>{ t("myAccount:components.consentManagement.modals." +
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
                description={ t("myAccount:sections.consentManagement.description") }
                header={ t("myAccount:sections.consentManagement.heading") }
                placeholder={
                    !(consentedApps && consentedApps.length && consentedApps.length > 0)
                        ? t("myAccount:sections.consentManagement.actionTitles.empty")
                        : null
                }
                showActionBar={ !(consentedApps && consentedApps.length && consentedApps.length > 0) }
            >
                <AppConsentList
                    data-testid={ `${testId}-list` }
                    consentedApps={ consentedApps }
                    onClaimUpdate={ handleClaimUpdate }
                    onAppConsentRevoke={ handleAppConsentRevoke }
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
