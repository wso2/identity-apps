/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
    getConsentById,
    getConsentsBySubject,
    postConsent,
    revokeConsentById
} from "../../api/consents";
import {
    AlertInterface,
    AlertLevels
} from "../../models";
import {
    ConsentedPurposeInterface,
    PreferenceManagementElementInterface,
    PreferenceManagementItemInterface,
    PolicyConsentDetailInterface,
    PolicyConsentListResponseInterface,
    PolicyConsentSummaryInterface
} from "../../models/consents";
import { AppState } from "../../store";
import { ModalComponent, SettingsSection } from "../shared";
import { PreferenceManagementList } from "./preference-management-list";

/**
 * Proptypes for the preference management component.
 */
interface PreferenceManagementComponentProps extends IdentifiableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

export const PreferenceManagement: FunctionComponent<PreferenceManagementComponentProps> = (
    props: PreferenceManagementComponentProps
): ReactElement => {

    const { onAlertFired, ["data-componentid"]: componentId } = props;

    const [ consentItems, setConsentItems ] = useState<PreferenceManagementItemInterface[]>([]);
    const [ activeIndexes, setActiveIndexes ] = useState<number[]>([]);
    const [ deselectedElements, setDeselectedElements ] = useState<Map<string, Set<string>>>(new Map());
    const [ revokingItem, setRevokingItem ] = useState<PreferenceManagementItemInterface | null>(null);
    const [ isRevokeModalVisible, setRevokeModalVisible ] = useState<boolean>(false);
    const [ isRevoking, setIsRevoking ] = useState<boolean>(false);

    const userName: string = useSelector((state: AppState) => state?.authenticationInformation?.profileInfo.userName);
    const consentsBaseUrl: string = useSelector(
        (state: AppState) => state?.config?.endpoints?.consentMgtV2?.consents
    );
    const { t } = useTranslation();

    const loadPreferenceManagement: () => Promise<void> = useCallback(async (): Promise<void> => {
        if (!userName || !consentsBaseUrl) {
            return;
        }

        try {
            const listResponse: PolicyConsentListResponseInterface =
                await getConsentsBySubject(consentsBaseUrl, userName, "ACTIVE");
            const summaries: PolicyConsentSummaryInterface[] = listResponse.Consents ?? [];

            if (summaries.length === 0) {
                setConsentItems([]);
                setDeselectedElements(new Map());

                return;
            }

            const details: PolicyConsentDetailInterface[] = await Promise.all(
                summaries.map((summary: PolicyConsentSummaryInterface) =>
                    getConsentById(consentsBaseUrl, summary.id)
                )
            );

            const preferenceDetails: PolicyConsentDetailInterface[] = details.filter(
                (detail: PolicyConsentDetailInterface) =>
                    detail.purposes?.some(
                        (p: ConsentedPurposeInterface) => p.type === "Preference"
                    )
            );

            const items: PreferenceManagementItemInterface[] = preferenceDetails.map(
                (detail: PolicyConsentDetailInterface): PreferenceManagementItemInterface => {
                    const matchingSummary: PolicyConsentSummaryInterface = summaries.find(
                        (s: PolicyConsentSummaryInterface) => s.id === detail.id
                    ) ?? summaries[0];
                    const purpose: ConsentedPurposeInterface | undefined =
                        Array.isArray(detail.purposes) && detail.purposes.length > 0
                            ? detail.purposes[0]
                            : undefined;

                    return {
                        consentId: detail.id,
                        elements: purpose?.elements ?? [],
                        language: detail.language,
                        policyUrl: purpose?.properties?.policyUrl ?? null,
                        purposeDescription: purpose?.name ?? "",
                        purposeId: purpose?.id ?? "",
                        purposeName: purpose?.name ?? "",
                        purposeVersionId: purpose?.versionId ?? purpose?.purposeVersionId ?? "",
                        serviceId: detail.serviceId,
                        state: detail.state,
                        timestamp: matchingSummary.timestamp,
                        version: purpose?.version ?? null
                    };
                }
            );

            setConsentItems(items);
            // Reset deselected state on reload — all elements start as selected
            setDeselectedElements(new Map(items.map(
                (item: PreferenceManagementItemInterface) => [ item.consentId, new Set<string>() ]
            )));
        } catch {
            onAlertFired({
                description: t(
                    "myAccount:components.preferenceManagement.notifications.fetch.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "myAccount:components.preferenceManagement.notifications.fetch.genericError.message"
                )
            });
        }
    }, [ userName, consentsBaseUrl, t, onAlertFired ]);

    useEffect(() => {
        loadPreferenceManagement();
    }, [ loadPreferenceManagement ]);

    const handleToggleDetail: (index: number) => void = (index: number): void => {
        setActiveIndexes((prev: number[]) =>
            prev.includes(index)
                ? prev.filter((i: number) => i !== index)
                : [ ...prev, index ]
        );
    };

    const handleElementToggle: (consentId: string, elementId: string) => void = (
        consentId: string,
        elementId: string
    ): void => {
        setDeselectedElements((prev: Map<string, Set<string>>) => {
            const next: Map<string, Set<string>> = new Map(prev);
            const deselected: Set<string> = new Set(next.get(consentId) ?? []);

            if (deselected.has(elementId)) {
                deselected.delete(elementId);
            } else {
                deselected.add(elementId);
            }
            next.set(consentId, deselected);

            return next;
        });
    };

    const handleUpdate: (consentId: string) => void = (consentId: string): void => {
        if (!consentsBaseUrl) {
            return;
        }

        const item: PreferenceManagementItemInterface | undefined = consentItems.find(
            (i: PreferenceManagementItemInterface) => i.consentId === consentId
        );

        if (!item) {
            return;
        }

        const deselected: Set<string> = deselectedElements.get(consentId) ?? new Set();
        const visibleElements: PreferenceManagementElementInterface[] = item.elements.filter(
            (e: PreferenceManagementElementInterface) => e.name !== "Preference"
        );
        const allDeselected: boolean = visibleElements.every(
            (e: PreferenceManagementElementInterface) => deselected.has(e.id)
        );

        if (allDeselected) {
            setRevokingItem(item);
            setRevokeModalVisible(true);

            return;
        }

        const remainingElements: Array<{ id: string }> = item.elements
            .filter((e: PreferenceManagementElementInterface) => !deselected.has(e.id))
            .map((e: PreferenceManagementElementInterface) => ({ id: e.id }));

        postConsent(consentsBaseUrl, {
            language: item.language,
            purposes: [ {
                elements: remainingElements,
                id: item.purposeId
            } ],
            serviceId: item.serviceId
        })
            .then(async () => {
                onAlertFired({
                    description: t(
                        "myAccount:components.preferenceManagement.notifications.update.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.preferenceManagement.notifications.update.success.message"
                    )
                });
                await loadPreferenceManagement();
            })
            .catch(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.preferenceManagement.notifications.update.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.preferenceManagement.notifications.update.genericError.message"
                    )
                });
            });
    };

    const handleRevokeClick: (item: PreferenceManagementItemInterface) => void = (
        item: PreferenceManagementItemInterface
    ): void => {
        setRevokingItem(item);
        setRevokeModalVisible(true);
    };

    const handleRevokeModalClose: () => void = (): void => {
        setRevokeModalVisible(false);
        setRevokingItem(null);
    };

    const handleRevokeConfirm: () => void = (): void => {
        if (isRevoking || !revokingItem || !consentsBaseUrl) {
            return;
        }

        setIsRevoking(true);
        revokeConsentById(consentsBaseUrl, revokingItem.consentId)
            .then(async () => {
                onAlertFired({
                    description: t(
                        "myAccount:components.preferenceManagement.notifications.revoke.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.preferenceManagement.notifications.revoke.success.message"
                    )
                });
                handleRevokeModalClose();
                await loadPreferenceManagement();
                setIsRevoking(false);
            })
            .catch(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.preferenceManagement.notifications" +
                        ".revoke.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.preferenceManagement.notifications.revoke.genericError.message"
                    )
                });
                setIsRevoking(false);
            });
    };

    const revokeModal: () => ReactElement = (): ReactElement => {
        return (
            <ModalComponent
                data-componentid={ `${componentId}-revoke-modal` }
                primaryAction={ t("common:revoke") }
                primaryActionDisabled={ isRevoking }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleRevokeModalClose }
                onPrimaryActionClick={ handleRevokeConfirm }
                open={ isRevokeModalVisible }
                onClose={ handleRevokeModalClose }
                type="warning"
                header={ t(
                    "myAccount:components.preferenceManagement.dangerZones.revoke.header"
                ) }
                content={ t(
                    "myAccount:components.preferenceManagement.dangerZones.revoke.subheader"
                ) }
            />
        );
    };

    return (
        <>
            <SettingsSection
                data-componentid={ `${componentId}-settings-section` }
                description={ t("myAccount:sections.preferenceManagement.description") }
                header={ t("myAccount:sections.preferenceManagement.heading") }
                placeholder={
                    !(consentItems && consentItems.length && consentItems.length > 0)
                        ? t("myAccount:sections.preferenceManagement.placeholders.emptyConsentList.heading")
                        : null
                }
                showActionBar={
                    !(consentItems && consentItems.length && consentItems.length > 0)
                }
            >
                <PreferenceManagementList
                    data-componentid={ `${componentId}-list` }
                    items={ consentItems }
                    activeIndexes={ activeIndexes }
                    deselectedElements={ deselectedElements }
                    onToggleDetail={ handleToggleDetail }
                    onElementToggle={ handleElementToggle }
                    onUpdate={ handleUpdate }
                    onRevokeClick={ handleRevokeClick }
                />
                { revokingItem && revokeModal() }
            </SettingsSection>
        </>
    );
};

PreferenceManagement.defaultProps = {
    "data-componentid": "preference-management"
};
