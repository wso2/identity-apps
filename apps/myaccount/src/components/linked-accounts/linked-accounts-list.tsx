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
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, List, Modal, Popup } from "semantic-ui-react";
import { getGravatarImage } from "../../api";
import { resolveUsername } from "../../helpers";
import { LinkedAccountInterface } from "../../models";
import { UserAvatar } from "../shared";

/**
 * Prop types for the liked accounts list component.
 * Also see {@link LinkedAccountsList.defaultProps}
 */
interface LinkedAccountsListProps extends TestableComponentInterface {
    linkedAccounts: LinkedAccountInterface[];
    onLinkedAccountRemove: (id: string) => void;
    onLinkedAccountSwitch: (account: LinkedAccountInterface) => void;
}

/**
 * Linked accounts list component.
 *
 * @param {LinkedAccountsListProps} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const LinkedAccountsList: FunctionComponent<LinkedAccountsListProps> = (
    props: LinkedAccountsListProps
): React.ReactElement => {
    
    const {
        linkedAccounts,
        onLinkedAccountRemove,
        onLinkedAccountSwitch,
        ["data-testid"]: testId
    } = props;
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [userID, setUserID] = useState(null);

    const { t } = useTranslation();

    /**
     * Pops up a modal requesting confirmation before deleting
     */
    const requestConfirmation = (): React.ReactElement => {
        return (
            <Modal
                data-testid={ `${testId}-account-item-delete-confirmation-modal` }
                size="mini"
                dimmer="blurring"
                open={ confirmDelete }
                onClose={ () => { setConfirmDelete(false); } }
            >
                <Modal.Content>
                    { t("myAccount:components.linkedAccounts.deleteConfirmation") }
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={ () => {
                            setConfirmDelete(false);
                            setUserID(null);
                        } }
                        className="link-button"
                    >
                        { t("common:cancel") }
                    </Button>
                    <Button
                        primary
                        onClick={ () => {
                            onLinkedAccountRemove(userID);
                            setConfirmDelete(false);
                            setUserID(null);
                        } }
                    >
                        { t("common:remove") }
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    };

    return (
        <>
            { requestConfirmation() }
            <List divided verticalAlign="middle" className="main-content-inner">
                {
                    linkedAccounts.map((account, index) => (
                        <List.Item className="inner-list-item" key={ index } data-testid={ testId }>
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
                                                            onClick={ () => {
                                                                setUserID(account.userId);
                                                                setConfirmDelete(true);
                                                            } }
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
        </>
    );
};

/**
 * Default properties of {@link LinkedAccountsList}
 * See type definitions in {@link LinkedAccountsListProps}
 */
LinkedAccountsList.defaultProps = {
    "data-testid": "linked-account-list"
};
