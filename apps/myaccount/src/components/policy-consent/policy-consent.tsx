/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com).
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

import {
    PolicyConsentDetailInterface,
    PolicyConsentItemInterface,
    PolicyConsentListResponseInterface,
    PolicyConsentSummaryInterface,
    PurposeVersionDTOInterface,
    getConsentById,
    getConsentsBySubject,
    getPurposeVersionById,
    revokeConsentById
} from "@wso2is/common.consents.v1";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PolicyConsentList } from "./policy-consents-list";
import {
    AlertInterface,
    AlertLevels
} from "../../models";
import { AppState } from "../../store";
import { ModalComponent, SettingsSection } from "../shared";

/**
 * Proptypes for the policy consent component.
 * Also see {@link PolicyConsent.defaultProps}
 */
interface PolicyConsentComponentProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

export const PolicyConsent: FunctionComponent<PolicyConsentComponentProps> = (
    props: PolicyConsentComponentProps
): ReactElement => {

    const { onAlertFired, ["data-testid"]: testId } = props;

    const [ policyConsentItems, setPolicyConsentItems ] = useState<PolicyConsentItemInterface[]>([]);
    const [ policyActiveIndexes, setPolicyActiveIndexes ] = useState<number[]>([]);
    const [ revokingPolicyItem, setRevokingPolicyItem ] = useState<PolicyConsentItemInterface | null>(null);
    const [ isPolicyRevokeModalVisible, setPolicyRevokeModalVisible ] = useState<boolean>(false);

    const userName: string = useSelector((state: AppState) => state?.authenticationInformation?.profileInfo.userName);
    const consentsBaseUrl: string = useSelector(
        (state: AppState) => state?.config?.endpoints?.consentMgtV2?.consents
    );
    const purposesBaseUrl: string = useSelector(
        (state: AppState) => state?.config?.endpoints?.consentMgtV2?.purposes
    );
    const { t } = useTranslation();

    const loadPolicyConsents: () => Promise<void> = useCallback(async (): Promise<void> => {
        if (!userName || !consentsBaseUrl || !purposesBaseUrl) {
            return;
        }

        try {
            const listResponse: PolicyConsentListResponseInterface =
                await getConsentsBySubject(consentsBaseUrl, userName, "ACTIVE");
            const summaries: PolicyConsentSummaryInterface[] = listResponse.Consents ?? [];

            if (summaries.length === 0) {
                setPolicyConsentItems([]);

                return;
            }

            const details: PolicyConsentDetailInterface[] = await Promise.all(
                summaries.map((summary: PolicyConsentSummaryInterface) =>
                    getConsentById(consentsBaseUrl, summary.id)
                )
            );

            const items: PolicyConsentItemInterface[] = await Promise.all(
                details.map(async (detail: PolicyConsentDetailInterface, index: number):
                    Promise<PolicyConsentItemInterface> => {
                    const purpose = detail.purposes[0];
                    let policyUrl: string | null = null;

                    if (purpose) {
                        try {
                            const versionDetail: PurposeVersionDTOInterface = await getPurposeVersionById(
                                purposesBaseUrl,
                                purpose.id,
                                purpose.purposeVersionId
                            );

                            policyUrl = versionDetail.properties?.policyUrl ?? null;
                        } catch {
                            // policyUrl stays null if version fetch fails
                        }
                    }

                    return {
                        consentId: summaries[index].id,
                        policyUrl,
                        purposeId: purpose?.id ?? "",
                        purposeName: purpose?.name ?? "",
                        purposeVersionId: purpose?.purposeVersionId ?? "",
                        timestamp: summaries[index].timestamp,
                        version: purpose?.version ?? null
                    };
                })
            );

            setPolicyConsentItems(items);
        } catch {
            onAlertFired({
                description: t(
                    "myAccount:components.policyConsentManagement.notifications.fetch.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "myAccount:components.policyConsentManagement.notifications.fetch.genericError.message"
                )
            });
        }
    }, [ userName, consentsBaseUrl, purposesBaseUrl, t, onAlertFired ]);

    useEffect(() => {
        loadPolicyConsents();
    }, [ loadPolicyConsents ]);

    const handlePolicyToggleDetail = (index: number): void => {
        setPolicyActiveIndexes((prev: number[]) =>
            prev.includes(index)
                ? prev.filter((i: number) => i !== index)
                : [ ...prev, index ]
        );
    };

    const handlePolicyRevokeClick = (item: PolicyConsentItemInterface): void => {
        setRevokingPolicyItem(item);
        setPolicyRevokeModalVisible(true);
    };

    const handlePolicyRevokeModalClose = (): void => {
        setPolicyRevokeModalVisible(false);
        setRevokingPolicyItem(null);
    };

    const handlePolicyRevokeConfirm = (): void => {
        if (!revokingPolicyItem) {
            return;
        }

        revokeConsentById(consentsBaseUrl, revokingPolicyItem.consentId)
            .then(async () => {
                onAlertFired({
                    description: t(
                        "myAccount:components.policyConsentManagement.notifications.revoke.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.policyConsentManagement.notifications.revoke.success.message"
                    )
                });
                handlePolicyRevokeModalClose();
                await loadPolicyConsents();
            })
            .catch(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.policyConsentManagement.notifications.revoke.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.policyConsentManagement.notifications.revoke.genericError.message"
                    )
                });
            });
    };

    const policyConsentRevokeModal = (): ReactElement => {
        return (
            <ModalComponent
                data-testid={ `${testId}-policy-revoke-modal` }
                primaryAction={ t("common:revoke") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handlePolicyRevokeModalClose }
                onPrimaryActionClick={ handlePolicyRevokeConfirm }
                open={ isPolicyRevokeModalVisible }
                onClose={ handlePolicyRevokeModalClose }
                type="warning"
                header={ t(
                    "myAccount:components.policyConsentManagement.modals.revokeModal.heading",
                    { policyName: revokingPolicyItem?.purposeName ?? "" }
                ) }
                content={ t(
                    "myAccount:components.policyConsentManagement.modals.revokeModal.message"
                ) }
            />
        );
    };

    return (
        <>
            <SettingsSection
                data-testid={ `${testId}-settings-section` }
                description={ t("myAccount:sections.policyConsentManagement.description") }
                header={ t("myAccount:sections.policyConsentManagement.heading") }
                placeholder={
                    !(policyConsentItems && policyConsentItems.length && policyConsentItems.length > 0)
                        ? t("myAccount:sections.policyConsentManagement.placeholders.emptyConsentList.heading")
                        : null
                }
                showActionBar={
                    !(policyConsentItems && policyConsentItems.length && policyConsentItems.length > 0)
                }
            >
                <PolicyConsentList
                    data-testid={ `${testId}-policy-consent-list` }
                    items={ policyConsentItems }
                    activeIndexes={ policyActiveIndexes }
                    onToggleDetail={ handlePolicyToggleDetail }
                    onRevokeClick={ handlePolicyRevokeClick }
                />
                { revokingPolicyItem && policyConsentRevokeModal() }
            </SettingsSection>
        </>
    );
};

PolicyConsent.defaultProps = {
    "data-testid": "policy-consent"
};
