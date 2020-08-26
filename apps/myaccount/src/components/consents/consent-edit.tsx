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

import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Divider, Grid, Label, List } from "semantic-ui-react";
import { ConsentInterface, RevokedClaimInterface } from "../../models";
import { toSentenceCase } from "../../utils";
import { DangerZone, DangerZoneGroup, EditSection } from "../shared";

/**
 * Proptypes for the application consent edit component.
 */
interface EditConsentProps {
    editingConsent: ConsentInterface;
    onAppConsentRevoke: (consent: ConsentInterface) => void;
    onClaimUpdate: (receiptId: string) => void;
    onClaimRevokeToggle: (receiptId: string, claimId: number) => void;
    revokedClaimList: RevokedClaimInterface[];
}

/**
 * Application consent edit component.
 *
 * @param {EditConsentProps} props - Props injected to the application consent edit component.
 * @return {JSX.Element}
 */
export const AppConsentEdit: FunctionComponent<EditConsentProps> = (
    props: EditConsentProps
): JSX.Element => {

    const {
        editingConsent,
        onAppConsentRevoke,
        onClaimUpdate,
        onClaimRevokeToggle,
        revokedClaimList
    } = props;
    const { t } = useTranslation();

    /**
     * Checks if the PII category is revoked.
     *
     * @param {number} claimId - claim id ie. piiCategoryId.
     */
    const isRevoked = (claimId: number): boolean => {
        for (const item of revokedClaimList) {
            if (item.id === editingConsent.consentReceiptID) {
                return !!item.revoked.includes(claimId);
            }
        }
    };

    /**
     * Checks if the consent is updatable.
     *
     * @return {boolean}
     */
    const isUpdatable = (): boolean => {
        for (const item of revokedClaimList) {
            if (item.id === editingConsent.consentReceiptID) {
                return item.revoked && item.revoked.length && item.revoked.length > 0;
            }
        }
    };

    return (
        <EditSection>
            <Grid padded>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <List.Description>
                            { t("userPortal:components.consentManagement.editConsent.piiCategoryHeading") }
                        </List.Description>
                    </Grid.Column>
                </Grid.Row>
                {
                    (editingConsent
                        && editingConsent.consentReceipt
                        && editingConsent.consentReceipt.services
                        && editingConsent.consentReceipt.services.length
                        && editingConsent.consentReceipt.services.length > 0)
                        ? editingConsent.consentReceipt.services.map((service) =>
                        service &&
                        service.purposes &&
                        service.purposes.map((purpose) => {
                            return (
                                <React.Fragment key={ purpose.purposeId }>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column width={ 16 }>
                                            <strong>{ toSentenceCase(purpose.purpose) }</strong>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column width={ 16 }>
                                            <List
                                                key={ purpose.purposeId }
                                                className="claim-list"
                                                verticalAlign="middle"
                                                relaxed="very"
                                            >
                                                {
                                                    purpose.piiCategory && purpose.piiCategory.map((category) => (
                                                        <List.Item key={ category.piiCategoryId }>
                                                            <List.Content>
                                                                <List.Header>
                                                                    <Checkbox
                                                                        className={
                                                                            isRevoked(category.piiCategoryId)
                                                                                ? "revoked"
                                                                                : ""
                                                                        }
                                                                        checked={
                                                                            !isRevoked(category.piiCategoryId)
                                                                        }
                                                                        label={ category.piiCategoryDisplayName }
                                                                        onChange={
                                                                            () => onClaimRevokeToggle(
                                                                                editingConsent.consentReceiptID,
                                                                                category.piiCategoryId)
                                                                        }
                                                                    />
                                                                    {
                                                                        isRevoked(category.piiCategoryId)
                                                                            ? (
                                                                                <Label
                                                                                    className="revoked-label"
                                                                                    horizontal
                                                                                >
                                                                                    { t("common:revoked") }
                                                                                </Label>
                                                                            )
                                                                            : null
                                                                    }

                                                                </List.Header>
                                                            </List.Content>
                                                        </List.Item>
                                                    ))
                                                }
                                            </List>
                                        </Grid.Column>
                                    </Grid.Row>
                                </React.Fragment>
                            );
                        }))
                        : null
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Button
                            primary
                            onClick={ () => onClaimUpdate(editingConsent.consentReceiptID) }
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
                                actionTitle={ t("userPortal:components.consentManagement.editConsent.dangerZones." +
                                    "revoke.actionTitle") }
                                header={ t("userPortal:components.consentManagement.editConsent.dangerZones." +
                                    "revoke.header") }
                                subheader={ t("userPortal:components.consentManagement.editConsent.dangerZones." +
                                    "revoke.subheader") }
                                onActionClick={ () => onAppConsentRevoke(editingConsent) }
                            />
                        </DangerZoneGroup>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EditSection>
    );
};
