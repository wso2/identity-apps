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
import { Grid, Icon, List, Popup } from "semantic-ui-react";
import { getGravatarImage } from "../../api";
import { resolveUsername } from "../../helpers";
import { LinkedAccountInterface } from "../../models";
import { UserAvatar } from "../shared";

/**
 * Prop types for the liked accounts list component.
 */
interface LinkedAccountsListProps {
    linkedAccounts: LinkedAccountInterface[];
    onLinkedAccountRemove: (id: string) => void;
    onLinkedAccountSwitch: (account: LinkedAccountInterface) => void;
}

/**
 * Linked accounts list component.
 *
 * @param {LinkedAccountsListProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const LinkedAccountsList: FunctionComponent<LinkedAccountsListProps> = (
    props: LinkedAccountsListProps
): JSX.Element => {
    const { linkedAccounts, onLinkedAccountRemove, onLinkedAccountSwitch } = props;
    const { t } = useTranslation();

    return (
        <List divided verticalAlign="middle" className="main-content-inner">
            {
                linkedAccounts.map((account, index) => (
                    <List.Item className="inner-list-item" key={ index }>
                        <Grid padded>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column width={ 11 } className="first-column">
                                    <UserAvatar
                                        floated="left"
                                        spaced="right"
                                        size="mini"
                                        image={ getGravatarImage(account.email) }
                                        name={ account.username }
                                    />
                                    <List.Header>
                                        { resolveUsername(account.username, account.userStoreDomain) }
                                    </List.Header>
                                    <List.Description>
                                        <p style={ { fontSize: "11px" } }>{ account.tenantDomain }</p>
                                    </List.Description>
                                </Grid.Column>
                                <Grid.Column width={ 5 } className="last-column">
                                    <List.Content floated="right">
                                        <div className="list-item-action">
                                            <Popup
                                                trigger={ (
                                                    <Icon
                                                        link
                                                        className="list-icon"
                                                        size="small"
                                                        color="grey"
                                                        name="exchange"
                                                        onClick={ () => onLinkedAccountSwitch(account) }
                                                    />
                                                ) }
                                                position="top center"
                                                content={ t("common:switch") }
                                                inverted
                                            />
                                        </div>
                                        <div className="list-item-action">
                                            <Popup
                                                trigger={ (
                                                    <Icon
                                                        link
                                                        className="list-icon"
                                                        size="small"
                                                        color="red"
                                                        name="trash alternate outline"
                                                        onClick={ () => onLinkedAccountRemove(account.userId) }
                                                    />
                                                ) }
                                                position="top center"
                                                content={ t("common:remove") }
                                                inverted
                                            />
                                        </div>
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Item>
                )) }
        </List>
    );
};
