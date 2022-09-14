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
import { GenericIcon, Media } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List } from "semantic-ui-react";
import { AppConsentEdit } from "./consent-edit";
import { ConsentedAppIcon } from "../../configs";
import { ConsentInterface, ConsentState, PIICategoryClaimToggleItem } from "../../models";
import { toSentenceCase } from "../../utils";

/**
 * Prop-types for the application consents list component.
 * Also see {@link AppConsentList.defaultProps}
 */
interface ConsentsListProps extends TestableComponentInterface {
    consentedApps: ConsentInterface[];
    consentListActiveIndexes?: number[];
    onAppConsentRevoke: (consent: ConsentInterface) => void;
    onConsentDetailClick: (index: number, id: string) => void;
    onClaimUpdate: (receiptId: string) => void;
    acceptedPIIClaimList?: Set<PIICategoryClaimToggleItem>;
    deniedPIIClaimList?: Set<PIICategoryClaimToggleItem>;
    onPIIClaimToggle?: (piiCategoryId: number, purposeId: number, receiptId: string) => void;
}

/**
 * Application consents list component.
 *
 * @param props - Props injected to the application consent list component.
 * @returns App Consents List component.
 */
export const AppConsentList: FunctionComponent<ConsentsListProps> = (
    props: ConsentsListProps
): JSX.Element => {

    const {
        consentedApps,
        consentListActiveIndexes,
        onAppConsentRevoke,
        onClaimUpdate,
        onConsentDetailClick,
        onPIIClaimToggle,
        acceptedPIIClaimList,
        deniedPIIClaimList,
        ["data-testid"]: testId
    } = props;
    const { t } = useTranslation();

    /**
     * Resolves the classname for the active label based on the consent state.
     *
     * @param state - state of the consent.
     * @returns Resolved classname.
     */
    const resolveStateClassname = (state: ConsentState): string => {
        if (state === ConsentState.ACTIVE) {
            return "positive";
        }

        return "";
    };

    return (
        <>
            <List divided verticalAlign="middle" className="main-content-inner" data-testid={ testId }>
                {
                    (consentedApps && consentedApps.length && consentedApps.length > 0)
                        ? consentedApps.map((consent: ConsentInterface, index) => {
                            return (
                                <List.Item className="inner-list-item" key={ consent.consentReceiptID }>
                                    <Grid padded>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 11 } className="first-column">
                                                <List.Content verticalAlign="middle">
                                                    <GenericIcon
                                                        icon={ ConsentedAppIcon }
                                                        size="micro"
                                                        bordered
                                                        defaultIcon
                                                        relaxed
                                                        rounded
                                                        spaced="right"
                                                        square
                                                        floated="left"
                                                    />
                                                    <List.Header>{ consent.spDisplayName }</List.Header>
                                                    <List.Description>
                                                        <p className="small-text">
                                                            <span
                                                                className={ `active-label ${ resolveStateClassname(
                                                                    consent.state) }` }
                                                            />
                                                            { toSentenceCase(consent.state) }
                                                        </p>
                                                    </List.Description>
                                                </List.Content>
                                            </Grid.Column>
                                            {
                                                consentListActiveIndexes
                                                    ? (
                                                        <Grid.Column width={ 5 } className="last-column">
                                                            <List.Content floated="right">
                                                                <Media lessThan="computer">
                                                                    <Button
                                                                        className="borderless-button"
                                                                        basic={ true }
                                                                        onClick={
                                                                            () => onConsentDetailClick(
                                                                                index, consent.consentReceiptID
                                                                            )
                                                                        }
                                                                    >
                                                                        <Icon
                                                                            name={
                                                                                consentListActiveIndexes.includes(index)
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
                                                                        size="mini"
                                                                        data-testid={
                                                                            `${ testId }-` +
                                                                            `${ consent.spDisplayName }` +
                                                                            "-app-consent-detail-button"
                                                                        }
                                                                        onClick={
                                                                            () => onConsentDetailClick(
                                                                                index, consent.consentReceiptID
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            consentListActiveIndexes.includes(index)
                                                                                ? (
                                                                                    <>
                                                                                        { t("common:showLess") }
                                                                                        <Icon
                                                                                            name="arrow down"
                                                                                            flipped="vertically"
                                                                                        />
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    <>
                                                                                        { t("common:showMore") }
                                                                                        <Icon name="arrow down"/>
                                                                                    </>
                                                                                )
                                                                        }
                                                                    </Button>
                                                                </Media>
                                                            </List.Content>
                                                        </Grid.Column>
                                                    ) : null
                                            }
                                        </Grid.Row>
                                        {
                                            consentListActiveIndexes && consentListActiveIndexes.includes(index)
                                                ? (
                                                    <AppConsentEdit
                                                        data-testid={ `${testId}-app-consent-edit` }
                                                        editingConsent={ consent }
                                                        onAppConsentRevoke={ onAppConsentRevoke }
                                                        onClaimUpdate={ onClaimUpdate }
                                                        onPIIClaimToggle={ onPIIClaimToggle }
                                                        acceptedPIIClaimList={ acceptedPIIClaimList }
                                                        deniedPIIClaimList={ deniedPIIClaimList }
                                                    />
                                                ) : null
                                        }
                                    </Grid>
                                </List.Item>
                            );
                        })
                        : null
                }
            </List>
        </>
    );
};

/**
 * Default properties for the {@link AppConsentList}
 * See type definitions in {@link ConsentsListProps}
 */
AppConsentList.defaultProps = {
    "data-testid": "app-consent-list"
};
