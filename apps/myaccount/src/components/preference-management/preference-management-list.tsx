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
import { DangerZone, DangerZoneGroup, GenericIcon, Media } from "@wso2is/react-components";
import { ShieldSquareCheckIcon } from "@oxygen-ui/react-icons";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Divider, Grid, Icon, List } from "semantic-ui-react";
import {
    PreferenceManagementElementInterface,
    PreferenceManagementItemInterface
} from "../../models/consents";
import { toSentenceCase } from "../../utils";
import { EditSection } from "../shared";

/**
 * Prop types for the preference management list component.
 */
interface PreferenceManagementListPropsInterface extends IdentifiableComponentInterface {
    items: PreferenceManagementItemInterface[];
    activeIndexes: number[];
    deselectedElements: Map<string, Set<string>>;
    onToggleDetail: (index: number) => void;
    onElementToggle: (consentId: string, elementId: string) => void;
    onUpdate: (consentId: string) => void;
    onRevokeClick: (item: PreferenceManagementItemInterface) => void;
}

/**
 * Pure list component for preference management.
 * Data fetching and state are managed by the parent.
 */
export const PreferenceManagementList: FunctionComponent<PreferenceManagementListPropsInterface> = (
    props: PreferenceManagementListPropsInterface
): ReactElement => {

    const {
        items,
        activeIndexes,
        deselectedElements,
        onToggleDetail,
        onElementToggle,
        onUpdate,
        onRevokeClick,
        ["data-componentid"]: componentId
    } = props;
    const { t, i18n } = useTranslation();

    const resolveStateClassname: (state: string) => string = (state: string): string => {
        if (state === "ACTIVE") {
            return "positive";
        }

        return "";
    };

    const isUpdatable: (item: PreferenceManagementItemInterface) => boolean = (
        item: PreferenceManagementItemInterface
    ): boolean => {
        return (deselectedElements.get(item.consentId)?.size ?? 0) > 0;
    };

    const visibleElements: (item: PreferenceManagementItemInterface) => PreferenceManagementElementInterface[] = (
        item: PreferenceManagementItemInterface
    ): PreferenceManagementElementInterface[] => {
        return item.elements.filter(
            (element: PreferenceManagementElementInterface) => element.name !== "Preference"
        );
    };

    return (
        <List divided verticalAlign="middle" className="main-content-inner" data-componentid={ componentId }>
            {
                items.length > 0 && items.map((item: PreferenceManagementItemInterface, index: number) => (
                    <List.Item className="inner-list-item" key={ item.consentId }>
                        <Grid padded>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column className="first-column">
                                    <List.Content verticalAlign="middle">
                                        <GenericIcon
                                            icon={ ShieldSquareCheckIcon }
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
                                                <span
                                                    className={
                                                        `active-label ${resolveStateClassname(item.state)}`
                                                    }
                                                />
                                                { item.state === "ACTIVE"
                                                    ? `${t(
                                                        "myAccount:components" +
                                                        ".preferenceManagement" +
                                                        ".consentedOnLabel"
                                                    )} ${new Date(
                                                        item.timestamp
                                                    ).toLocaleDateString(i18n.language)}`
                                                    : toSentenceCase(item.state)
                                                }
                                            </p>
                                        </List.Description>
                                    </List.Content>
                                </Grid.Column>
                                <Grid.Column className="last-column">
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
                                            <Button
                                                icon
                                                basic
                                                labelPosition="right"
                                                className="show-more-button"
                                                size="mini"
                                                onClick={ () => onToggleDetail(index) }
                                                data-componentid={
                                                    `${componentId}-${item.purposeId}-show-more-button`
                                                }
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
                        </Grid>
                        {
                            activeIndexes.includes(index) && (
                                <EditSection
                                    data-componentid={
                                        `${componentId}-${item.purposeId}-edit-section`
                                    }
                                >
                                    <Grid padded>
                                        { visibleElements(item).length > 0 && (
                                            <>
                                                <Grid.Row columns={ 1 }>
                                                    <Grid.Column width={ 16 }>
                                                        <List.Description>
                                                            { t(
                                                                "myAccount:components.preferenceManagement" +
                                                                ".elementsHeading"
                                                            ) }
                                                        </List.Description>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={ 1 }>
                                                    <Grid.Column width={ 16 }>
                                                        <List
                                                            className="claim-list"
                                                            verticalAlign="middle"
                                                            relaxed="very"
                                                        >
                                                            { visibleElements(item).map(
                                                                (element: PreferenceManagementElementInterface) => (
                                                                    <List.Item key={ element.id }>
                                                                        <List.Content>
                                                                            <List.Header>
                                                                                <Checkbox
                                                                                    checked={
                                                                                        !deselectedElements
                                                                                            .get(item.consentId)
                                                                                            ?.has(element.id)
                                                                                    }
                                                                                    label={ element.displayName || element.name }
                                                                                    onChange={ () =>
                                                                                        onElementToggle(
                                                                                            item.consentId,
                                                                                            element.id
                                                                                        )
                                                                                    }
                                                                                    data-componentid={
                                                                                        `${componentId}-` +
                                                                                        `${item.purposeId}-` +
                                                                                        `${element.id}-checkbox`
                                                                                    }
                                                                                />
                                                                            </List.Header>
                                                                        </List.Content>
                                                                    </List.Item>
                                                                )
                                                            ) }
                                                        </List>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={ 1 }>
                                                    <Grid.Column width={ 16 }>
                                                        <Button
                                                            primary
                                                            disabled={ !isUpdatable(item) }
                                                            onClick={ () => onUpdate(item.consentId) }
                                                            data-componentid={
                                                                `${componentId}-${item.purposeId}-update-button`
                                                            }
                                                        >
                                                            { t("common:update") }
                                                        </Button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Divider />
                                            </>
                                        ) }
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column width={ 16 }>
                                                <DangerZoneGroup
                                                    sectionHeader={ t("common:dangerZone") }
                                                >
                                                    <DangerZone
                                                        actionTitle={ t(
                                                            "myAccount:components" +
                                                            ".preferenceManagement" +
                                                            ".dangerZones.revoke.actionTitle"
                                                        ) }
                                                        header={ t(
                                                            "myAccount:components" +
                                                            ".preferenceManagement" +
                                                            ".dangerZones.revoke.header"
                                                        ) }
                                                        subheader={ t(
                                                            "myAccount:components" +
                                                            ".preferenceManagement" +
                                                            ".dangerZones.revoke.subheader"
                                                        ) }
                                                        onActionClick={ () => onRevokeClick(item) }
                                                        data-componentid={
                                                            `${componentId}-${item.purposeId}` +
                                                            "-danger-zone-revoke"
                                                        }
                                                    />
                                                </DangerZoneGroup>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </EditSection>
                            )
                        }
                    </List.Item>
                ))
            }
        </List>
    );
};

PreferenceManagementList.defaultProps = {
    "data-componentid": "preference-management-list"
};
