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

import { TestableComponentInterface } from "@wso2is/core/models";
import { DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import { EditSection } from "@wso2is/selfcare.core.v1/components";
import {
    ConsentInterface,
    PIICategory,
    PIICategoryClaimToggleItem,
    PIICategoryWithStatus,
    PurposeInterface,
    ServiceInterface
} from "@wso2is/selfcare.core.v1/models";
import flatten from "lodash-es/flatten";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Divider, Grid, List } from "semantic-ui-react";
import { toSentenceCase } from "../../utils";

/**
 * Proptypes for the application consent edit component.
 * Also see {@link AppConsentEdit.defaultProps}
 */
interface EditConsentProps extends TestableComponentInterface {
    editingConsent: ConsentInterface;
    onAppConsentRevoke: (consent: ConsentInterface) => void;
    onClaimUpdate: (receiptId: string) => void;
    acceptedPIIClaimList?: Set<PIICategoryClaimToggleItem>;
    deniedPIIClaimList?: Set<PIICategoryClaimToggleItem>;
    onPIIClaimToggle?: (piiCategoryId: number, purposeId: number, receiptId: string) => void;
}

/**
 * Application consent edit component.
 *
 * @param props - Props injected to the application consent edit component.
 * @returns application consent edit component
 */
export const AppConsentEdit: FunctionComponent<EditConsentProps> = (
    props: EditConsentProps
): JSX.Element => {

    const {
        editingConsent,
        onAppConsentRevoke,
        onClaimUpdate,
        acceptedPIIClaimList,
        deniedPIIClaimList,
        onPIIClaimToggle,
        ["data-testid"]: testId
    } = props;
    const { t } = useTranslation();

    /**
     * A predicate that checks if the PII category is denied.
     * It iterates through the {@link deniedPIIClaimList} state hook to check
     * whether there's any mapping category is present.
     *
     * Important Note: -
     * We don't use a separate predicate function to check non-revoked
     * or accepted PII categories. The functionality can be achieved via this
     * function itself because if a `PIICategoryClaimToggleItem` is
     * not available in {@link deniedPIIClaimList} it is guaranteed that
     * it is available in {@link acceptedPIIClaimList} vice versa.
     *
     * @param piiCategoryId - PII Claim ID
     * @param purposeId - Purpose ID
     * @param consentReceiptID - Consent receipt ID
     */
    const isRevoked = (piiCategoryId: number, purposeId: number, consentReceiptID: string): boolean => {
        for (const deniedPIIItem of deniedPIIClaimList) {
            if (piiCategoryId === deniedPIIItem.piiCategoryId &&
                purposeId === deniedPIIItem.purposeId &&
                consentReceiptID === deniedPIIItem.receiptId) return true;
        }

        return false;
    };

    /**
     * Checks if the consent is updatable.
     *
     * @returns whether the consent is updatable.
     */
    const isUpdatable = (): boolean => {

        // This consent editing view's model {@link editingConsent}
        const purposes: PurposeInterface[][] = (editingConsent.consentReceipt?.services || [])
            .map((service: ServiceInterface) => service.purposes);

        const piiCategoriesOfAllPurposes: Array<{
            piiCategory: PIICategoryWithStatus[],
            purposeId: number
        }> = flatten(purposes)
            .map((purpose: PurposeInterface) => ({
                piiCategory: purpose.piiCategory as PIICategoryWithStatus[],
                purposeId: purpose.purposeId
            }));

        const recordOnModelReceipt: {
            piiCategory: PIICategoryWithStatus[];
            purposeId: number;
        }[] = flatten(piiCategoriesOfAllPurposes);

        // Filter out the piiClaims of this receipt.
        const recordOnUserInterface: PIICategoryClaimToggleItem[] = [ ...deniedPIIClaimList, ...acceptedPIIClaimList ]
            .filter((piiClaim: PIICategoryClaimToggleItem) => piiClaim.receiptId === editingConsent.consentReceiptID);

        // TODO: solve in linear time
        for (const uiRecord of recordOnUserInterface) {
            for (const { purposeId, piiCategory } of recordOnModelReceipt) {
                if (purposeId === uiRecord.purposeId) {
                    for (const piiCategoryKey of piiCategory) {
                        if (piiCategoryKey.piiCategoryId === uiRecord.piiCategoryId &&
                            piiCategoryKey.status !== uiRecord.status
                        ) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    };

    /**
     * A predicate that checks whether we can show the consents'
     * purposes. This check is needed because {@link ConsentInterface.consentReceipt}
     * is optional and will only fetch asynchronously once the user click the detail view.
     *
     * {@link ConsentInterface} must: -
     * 1. not be `null | undefined`
     * 2. contain the {@link ConsentReceiptInterface}
     * 3. contain a list of {@link ServiceInterface} in {@link ConsentReceiptInterface}
     * 4. contain least 1 {@link ConsentReceiptInterface.services} entry
     *
     * @param editingConsent - consent details being edited
     */
    const hasConsentDetails = (editingConsent: ConsentInterface): boolean => {
        return editingConsent &&
            editingConsent.consentReceipt &&
            editingConsent.consentReceipt.services &&
            editingConsent.consentReceipt.services.length > 0;
    };

    /**
     * A predicate that checks whether a particular service inside
     * a {@link ConsentReceiptInterface} has purposes to show.
     *
     * @param service - service to be checked
     */
    const hasPurposesInService = (service: ServiceInterface): boolean => {
        return service &&
            service.purposes &&
            service.purposes.length > 0;
    };

    /**
     * A predicate that checks whether a particular {@link PurposeInterface}
     * has a list of `PIICategory[]` and is not empty.
     *
     * @param purpose - purpose to be checked
     */
    const hasPIICategoriesInPurpose = (purpose: PurposeInterface): boolean => {
        return purpose.piiCategory && purpose.piiCategory.length > 0;
    };

    /**
     * JSX Builder method. Invoked within the scope of {@link this}
     *
     * @param purpose - purpose to be converted to jsx
     */
    const eachPurposeToJSX = (purpose: PurposeInterface) => {

        /**
         * JSX Builder method. Invoked within the scope of {@link eachPurposeToJSX}
         * @param piiCat - PII category
         */
        const eachPIICategoryItem = (piiCat: PIICategoryWithStatus) => {
            return (<List.Item key={ piiCat.piiCategoryId }>
                <List.Content>
                    <List.Header>
                        <Checkbox
                            checked={ !isRevoked(
                                piiCat.piiCategoryId,
                                purpose.purposeId,
                                editingConsent.consentReceiptID
                            ) }
                            data-testid={ `${testId}-editing-section-claim` +
                                `-${ piiCat.piiCategoryDisplayName.replace(" ", "-") }-checkbox` }
                            label={ piiCat.piiCategoryDisplayName }
                            onChange={ () => onPIIClaimToggle(
                                piiCat.piiCategoryId,
                                purpose.purposeId,
                                editingConsent.consentReceiptID
                            ) }
                        />
                    </List.Header>
                </List.Content>
            </List.Item>);
        };

        return (
            <React.Fragment key={ purpose.purposeId }>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 16 }>
                        <strong>{ toSentenceCase(purpose.purpose) }</strong>
                    </Grid.Column>
                    <Grid.Column width={ 16 }>
                        <em>{ toSentenceCase(purpose.description ?? "") }</em>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <List
                            key={ purpose.purposeId }
                            className="claim-list"
                            verticalAlign="middle"
                            relaxed="very">
                            {
                                hasPIICategoriesInPurpose(purpose) && purpose.piiCategory.map((piiCat: PIICategory) => {
                                    return eachPIICategoryItem(piiCat as PIICategoryWithStatus);
                                })
                            }
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </React.Fragment>
        );
    };

    return (
        <EditSection data-testid={ `${testId}-editing-section` }>
            <Grid padded>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <List.Description>
                            { t("myAccount:components.consentManagement.editConsent.piiCategoryHeading") }
                        </List.Description>
                    </Grid.Column>
                </Grid.Row>
                {
                    hasConsentDetails(editingConsent) ?
                        editingConsent.consentReceipt.services.map(
                            (service: ServiceInterface) => hasPurposesInService(service) &&
                                service.purposes.map(eachPurposeToJSX)
                        )
                        : null
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Button
                            primary
                            onClick={ () => onClaimUpdate(editingConsent.consentReceiptID) }
                            data-testid={ `${ testId }-` +
                                `${ editingConsent.spDisplayName.replace(" ", "-") }` +
                                "-editing-section-update-button" }
                            disabled={ !isUpdatable() }
                        >
                            { t("common:update") }
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                <Divider />
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                            <DangerZone
                                actionTitle={ t("myAccount:components.consentManagement.editConsent.dangerZones." +
                                    "revoke.actionTitle") }
                                header={ t("myAccount:components.consentManagement.editConsent.dangerZones." +
                                    "revoke.header") }
                                subheader={ t("myAccount:components.consentManagement.editConsent.dangerZones." +
                                    "revoke.subheader") }
                                onActionClick={ () => onAppConsentRevoke(editingConsent) }
                                data-testid={ `${testId}-editing-section-revoke-application` }
                            />
                        </DangerZoneGroup>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EditSection>
    );
};

/**
 * Default properties of {@link AppConsentEdit}
 * Also see {@link EditConsentProps}
 */
AppConsentEdit.defaultProps = {
    "data-testid": "app-consent-edit"
};
