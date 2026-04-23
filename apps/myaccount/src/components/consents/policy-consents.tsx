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

import { i18nLink } from "@wso2is/common.branding.v1/utils/i18n-link";
import { PolicyConsentItemInterface } from "@wso2is/common.consents.v1";
import { TestableComponentInterface } from "@wso2is/core/models";
import { DangerZone, DangerZoneGroup, GenericIcon, Media } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List } from "semantic-ui-react";
import { PolicyConsentIcon } from "../../configs";
import { EditSection } from "../shared";

/**
 * Prop types for the policy consent list component.
 */
interface PolicyConsentListProps extends TestableComponentInterface {
    items: PolicyConsentItemInterface[];
    activeIndexes: number[];
    onToggleDetail: (index: number) => void;
    onRevokeClick: (item: PolicyConsentItemInterface) => void;
}

/**
 * Pure list component for policy consents.
 * Data fetching and state are managed by the parent.
 */
export const PolicyConsentList: FunctionComponent<PolicyConsentListProps> = (
    props: PolicyConsentListProps
): ReactElement => {

    const { items, activeIndexes, onToggleDetail, onRevokeClick, ["data-testid"]: testId } = props;
    const { t, i18n } = useTranslation();

    return (
        <>
            <List.Item
                className="inner-list-item recovery-options-muted-header"
            >
                <Grid padded={ true }>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column
                            width={ 16 }
                            className="first-column"
                        >
                            { "Manage Policies" }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </List.Item>
            { items.map((item: PolicyConsentItemInterface, index: number) => (
                <List.Item className="inner-list-item" key={ item.consentId }>
                    <Grid padded>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 11 } className="first-column">
                                <List.Content verticalAlign="middle">
                                    <GenericIcon
                                        icon={ PolicyConsentIcon }
                                        size="micro"
                                        bordered
                                        defaultIcon
                                        relaxed
                                        rounded
                                        spaced="right"
                                        square
                                        floated="left"
                                    />
                                    <List.Header>{ item.purposeName }</List.Header>
                                    <List.Description>
                                        <p className="small-text">
                                            <span className="active-label positive" />
                                        </p>
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                            <Grid.Column width={ 5 } className="last-column">
                                <List.Content floated="right">
                                    <Media lessThan="computer">
                                        <Button
                                            className="borderless-button"
                                            basic={ true }
                                            onClick={ () => onToggleDetail(index) }
                                        >
                                            <Icon
                                                name={
                                                    activeIndexes.includes(index)
                                                        ? "angle up"
                                                        : "angle down"
                                                }
                                            />
                                        </Button>
                                    </Media>
                                    <Media greaterThanOrEqual="computer">
                                        { item.policyUrl && (
                                            <Button
                                                style={ { marginRight: "0.5em" } }
                                                as="a"
                                                href={ i18nLink(i18n.language, item.policyUrl) }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                icon
                                                basic
                                                labelPosition="right"
                                                className="show-more-button"
                                                size="mini"
                                                data-testid={ `${ testId }-${ item.purposeId }-view-policy-button` }
                                            >
                                                { t("myAccount:components.policyConsentManagement.policyUrlLabel") }
                                                <Icon name="external alternate" />
                                            </Button>
                                        ) }
                                        <Button
                                            icon
                                            basic
                                            labelPosition="right"
                                            className="show-more-button"
                                            size="mini"
                                            onClick={ () => onToggleDetail(index) }
                                            data-testid={ `${ testId }-${ item.purposeId }-show-more-button` }
                                        >
                                            { activeIndexes.includes(index)
                                                ? (
                                                    <>
                                                        { t("common:showLess") }
                                                        <Icon name="arrow down" flipped="vertically" />
                                                    </>
                                                )
                                                : (
                                                    <>
                                                        { t("common:showMore") }
                                                        <Icon name="arrow down" />
                                                    </>
                                                )
                                            }
                                        </Button>
                                    </Media>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                        { activeIndexes.includes(index) && (
                            <div style={ { padding: 0, width: "100%" } }>
                                <EditSection
                                    data-testid={ `${ testId }-${ item.purposeId }-edit-section` }
                                >
                                    <Grid padded>
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column width={ 16 }>
                                                <DangerZoneGroup
                                                    sectionHeader={ t("common:dangerZone") }
                                                >
                                                    <DangerZone
                                                        actionTitle={ t(
                                                            "myAccount:components.policyConsentManagement" +
                                                            ".dangerZones.revoke.actionTitle"
                                                        ) }
                                                        header={ t(
                                                            "myAccount:components.policyConsentManagement" +
                                                            ".dangerZones.revoke.header"
                                                        ) }
                                                        subheader={ t(
                                                            "myAccount:components.policyConsentManagement" +
                                                            ".dangerZones.revoke.subheader"
                                                        ) }
                                                        onActionClick={ () => onRevokeClick(item) }
                                                        data-testid={
                                                            `${ testId }-${ item.purposeId }-danger-zone-revoke`
                                                        }
                                                    />
                                                </DangerZoneGroup>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </EditSection>
                            </div>
                        ) }
                    </Grid>
                </List.Item>
            )) }
        </>
    );
};

PolicyConsentList.defaultProps = {
    "data-testid": "policy-consent-list"
};
