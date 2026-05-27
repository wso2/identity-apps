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
    MarketingConsentElementInterface,
    MarketingConsentItemInterface,
    PolicyConsentDetailInterface,
    PolicyConsentListResponseInterface,
    PolicyConsentSummaryInterface
} from "../../models/consents";
import { AppState } from "../../store";
import { ModalComponent, SettingsSection } from "../shared";
import { MarketingConsentList } from "./marketing-consent-list";

/**
 * Proptypes for the marketing consent component.
 */
interface MarketingConsentComponentProps extends IdentifiableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

export const MarketingConsent: FunctionComponent<MarketingConsentComponentProps> = (
    props: MarketingConsentComponentProps
): ReactElement => {

    const { onAlertFired, ["data-componentid"]: componentId } = props;

    const [ consentItems, setConsentItems ] = useState<MarketingConsentItemInterface[]>([]);
    const [ activeIndexes, setActiveIndexes ] = useState<number[]>([]);
    const [ deselectedElements, setDeselectedElements ] = useState<Map<string, Set<string>>>(new Map());
    const [ revokingItem, setRevokingItem ] = useState<MarketingConsentItemInterface | null>(null);
    const [ isRevokeModalVisible, setRevokeModalVisible ] = useState<boolean>(false);
    const [ isRevoking, setIsRevoking ] = useState<boolean>(false);

    const userName: string = useSelector((state: AppState) => state?.authenticationInformation?.profileInfo.userName);
    const consentsBaseUrl: string = useSelector(
        (state: AppState) => state?.config?.endpoints?.consentMgtV2?.consents
    );
    const { t } = useTranslation();

    const loadMarketingConsents: () => Promise<void> = useCallback(async (): Promise<void> => {
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

            const marketingDetails: PolicyConsentDetailInterface[] = details.filter(
                (detail: PolicyConsentDetailInterface) =>
                    detail.purposes?.some(
                        (p: ConsentedPurposeInterface) => p.type === "Marketing"
                    )
            );

            const items: MarketingConsentItemInterface[] = marketingDetails.map(
                (detail: PolicyConsentDetailInterface): MarketingConsentItemInterface => {
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
                (item: MarketingConsentItemInterface) => [ item.consentId, new Set<string>() ]
            )));
        } catch {
            onAlertFired({
                description: t(
                    "myAccount:components.marketingConsentManagement.notifications.fetch.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "myAccount:components.marketingConsentManagement.notifications.fetch.genericError.message"
                )
            });
        }
    }, [ userName, consentsBaseUrl, t, onAlertFired ]);

    useEffect(() => {
        loadMarketingConsents();
    }, [ loadMarketingConsents ]);

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

        const item: MarketingConsentItemInterface | undefined = consentItems.find(
            (i: MarketingConsentItemInterface) => i.consentId === consentId
        );

        if (!item) {
            return;
        }

        const deselected: Set<string> = deselectedElements.get(consentId) ?? new Set();
        const visibleElements: MarketingConsentElementInterface[] = item.elements.filter(
            (e: MarketingConsentElementInterface) => e.name !== "Marketing"
        );
        const allDeselected: boolean = visibleElements.every(
            (e: MarketingConsentElementInterface) => deselected.has(e.id)
        );

        if (allDeselected) {
            setRevokingItem(item);
            setRevokeModalVisible(true);

            return;
        }

        const remainingElements: Array<{ id: string }> = item.elements
            .filter((e: MarketingConsentElementInterface) => !deselected.has(e.id))
            .map((e: MarketingConsentElementInterface) => ({ id: e.id }));

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
                        "myAccount:components.marketingConsentManagement.notifications.update.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.marketingConsentManagement.notifications.update.success.message"
                    )
                });
                await loadMarketingConsents();
            })
            .catch(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.marketingConsentManagement.notifications.update.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.marketingConsentManagement.notifications.update.genericError.message"
                    )
                });
            });
    };

    const handleRevokeClick: (item: MarketingConsentItemInterface) => void = (
        item: MarketingConsentItemInterface
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
                        "myAccount:components.marketingConsentManagement.notifications.revoke.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.marketingConsentManagement.notifications.revoke.success.message"
                    )
                });
                handleRevokeModalClose();
                await loadMarketingConsents();
                setIsRevoking(false);
            })
            .catch(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.marketingConsentManagement.notifications" +
                        ".revoke.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.marketingConsentManagement.notifications.revoke.genericError.message"
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
                    "myAccount:components.marketingConsentManagement.modals.revokeModal.heading",
                    { consentName: revokingItem?.purposeName ?? "" }
                ) }
                content={ t(
                    "myAccount:components.marketingConsentManagement.modals.revokeModal.message"
                ) }
            />
        );
    };

    return (
        <>
            <SettingsSection
                data-componentid={ `${componentId}-settings-section` }
                description={ t("myAccount:sections.marketingConsentManagement.description") }
                header={ t("myAccount:sections.marketingConsentManagement.heading") }
                placeholder={
                    !(consentItems && consentItems.length && consentItems.length > 0)
                        ? t("myAccount:sections.marketingConsentManagement.placeholders.emptyConsentList.heading")
                        : null
                }
                showActionBar={
                    !(consentItems && consentItems.length && consentItems.length > 0)
                }
            >
                <MarketingConsentList
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

MarketingConsent.defaultProps = {
    "data-componentid": "marketing-consent"
};
