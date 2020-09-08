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
import { Button, Grid, Icon, List, Responsive } from "semantic-ui-react";
import { AppConsentEdit } from "./consent-edit";
import { ConsentedAppIcon } from "../../configs";
import { ConsentInterface, ConsentState, RevokedClaimInterface } from "../../models";
import { toSentenceCase } from "../../utils";
import { ThemeIcon } from "../shared";

/**
 * Proptypes for the application consents list component.
 */
interface ConsentsListProps {
    consentedApps: ConsentInterface[];
    consentListActiveIndexes?: number[];
    onAppConsentRevoke: (consent: ConsentInterface) => void;
    onConsentDetailClick: (index: number, id: string) => void;
    onClaimUpdate: (receiptId: string) => void;
    onClaimRevokeToggle: (receiptId: string, claimId: number) => void;
    revokedClaimList: RevokedClaimInterface[];
}

/**
 * Application consents list component.
 *
 * @param {UserSessionsEditProps} props - Props injected to the application consent list component.
 * @return {JSX.Element}
 */
export const AppConsentList: FunctionComponent<ConsentsListProps> = (
    props: ConsentsListProps
): JSX.Element => {

    const {
        consentedApps,
        consentListActiveIndexes,
        onAppConsentRevoke,
        onClaimUpdate,
        onClaimRevokeToggle,
        revokedClaimList,
        onConsentDetailClick
    } = props;
    const { t } = useTranslation();

    /**
     * Resolves the classname for the active label based on the consent state.
     * @param {ConsentState} state - state of the consent.
     * @return {string}
     */
    const resolveStateClassname = (state: ConsentState): string => {
        if (state === ConsentState.ACTIVE) {
            return "positive";
        }
        return "";
    };

    return (
        <>
            <List divided verticalAlign="middle" className="main-content-inner">
                {
                    (consentedApps && consentedApps.length && consentedApps.length > 0)
                        ? consentedApps.map((consent: ConsentInterface, index) => {
                            return (
                                <List.Item className="inner-list-item" key={ consent.consentReceiptID }>
                                    <Grid padded>
                                        <Grid.Row columns={ 2 }>
                                            <Grid.Column width={ 11 } className="first-column">
                                                <List.Content verticalAlign="middle">
                                                    <ThemeIcon
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
                                                                <Responsive
                                                                    as={ Button }
                                                                    maxWidth={ Responsive.onlyTablet.maxWidth }
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
                                                                </Responsive>
                                                                <Responsive
                                                                    as={ Button }
                                                                    minWidth={ Responsive.onlyTablet.maxWidth }
                                                                    icon
                                                                    basic
                                                                    labelPosition="right"
                                                                    size="mini"
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
                                                                </Responsive>
                                                            </List.Content>
                                                        </Grid.Column>
                                                    ) : null
                                            }
                                        </Grid.Row>
                                        {
                                            consentListActiveIndexes && consentListActiveIndexes.includes(index)
                                                ? (
                                                    <AppConsentEdit
                                                        editingConsent={ consent }
                                                        onAppConsentRevoke={ onAppConsentRevoke }
                                                        onClaimUpdate={ onClaimUpdate }
                                                        onClaimRevokeToggle={ onClaimRevokeToggle }
                                                        revokedClaimList={ revokedClaimList }
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
