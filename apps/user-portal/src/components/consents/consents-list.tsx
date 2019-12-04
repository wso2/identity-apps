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

import React, { FunctionComponent, MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List } from "semantic-ui-react";
import { ConsentedAppIcon } from "../../configs";
import { ConsentInterface, ConsentReceiptInterface, PIICategory } from "../../models";
import { ThemeIcon } from "../shared";
import { AppConsentEdit } from "./consent-edit";

/**
 * Proptypes for the application consents list component.
 */
interface ConsentsListProps {
    consentedApps: ConsentInterface[];
    onConsentEditClick?: (e: MouseEvent<HTMLButtonElement>, element: HTMLButtonElement) => void;
    onConsentRevokeClick?: (consent: ConsentInterface) => void;
    onClaimUpdateClick?: () => void;
    onEditViewCloseClick?: () => void;
    editingConsent: ConsentInterface;
    consentReceipt: ConsentReceiptInterface;
    revokeConsent?: (consent: ConsentInterface) => void;
    editingConsentReceipt: ConsentReceiptInterface;
    editConsentedApps: ConsentInterface[];
    activeIndex: string;
    revokePIICategory: (category: PIICategory) => void;
    undoRevokePIICategory: (e: MouseEvent<HTMLButtonElement>, element: HTMLButtonElement) => void;
    revokedPIICatList: number[];
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

    const { consentReceipt, consentedApps, onConsentEditClick, onConsentRevokeClick,
            onClaimUpdateClick, onEditViewCloseClick, editingConsent,
            editConsentedApps, editingConsentReceipt,
            activeIndex, revokePIICategory, undoRevokePIICategory, revokedPIICatList
    } = props;
    const { t } = useTranslation();

    return (
        <>
        <List divided verticalAlign="middle" className="main-content-inner">
            {
                editConsentedApps && editConsentedApps.map((consent: ConsentInterface, index: number) => {
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
                                                <p style={ { fontSize: "10px" } }>
                                                    { consent.consentReceiptID }
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </Grid.Column>
                                    <Grid.Column width={ 5 } className="last-column">
                                        <List.Content floated="right">
                                            <Icon
                                                id={ consent.consentReceiptID }
                                                link
                                                className="list-icon"
                                                size="large"
                                                name="pencil alternate"
                                                onClick={ onConsentEditClick }
                                            />
                                            <Button
                                                basic
                                                compact
                                                color="red"
                                                size="tiny"
                                                onClick={ () => onConsentRevokeClick(consent) }
                                            >
                                                { t("common:revoke") }
                                            </Button>
                                        </List.Content>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            {
                                    activeIndex === consent.consentReceiptID
                                    ? (
                                        <AppConsentEdit
                                            editingConsent={ editingConsent }
                                            onClaimUpdateClick={ onClaimUpdateClick }
                                            onEditViewCloseClick={ onEditViewCloseClick }
                                            state={ consent.state }
                                            spDescription={ consent.spDescription }
                                            services={ consentReceipt.services }
                                            revokePIICategory={ revokePIICategory }
                                            undoRevokePIICategory={ undoRevokePIICategory }
                                            revokedPIICatList={ revokedPIICatList }
                                        />
                                    ) : null
                            }
                        </List.Item>
                    );
                })
            }
        </List>
        </>
    );
};
