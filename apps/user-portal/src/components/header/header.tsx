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

import { isEmpty } from "lodash";
import React, { SyntheticEvent, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Dropdown, Icon, Item, Menu, Responsive } from "semantic-ui-react";
import { getProfileInformation } from "../../../src/store/actions";
import { switchAccount } from "../../api";
import { AuthContext } from "../../contexts";
import { resolveUserDisplayName } from "../../helpers";
import { AuthStateInterface, createEmptyNotification, LinkedAccountInterface, Notification } from "../../models";
import { AppState } from "../../store";
import { Title, UserAvatar } from "../shared";

/**
 * Header component prop types.
 */
interface HeaderProps {
    onSidePanelToggleClick?: () => void;
    showSidePanelToggle?: boolean;
}

/**
 * Header component.
 *
 * @param {HeaderProps} props - Props supplied to the header component.
 * @return {JSX.Element}
 */
export const Header: React.FunctionComponent<HeaderProps> = (props: HeaderProps): JSX.Element => {
    const { state } = useContext(AuthContext);
    const { t } = useTranslation();
    const { onSidePanelToggleClick, showSidePanelToggle } = props;
    const profileDetails: AuthStateInterface = useSelector(
        (storeState: AppState) => storeState.authenticationInformation
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (isEmpty(profileDetails)) {
            dispatch(getProfileInformation());
        }
    }, []);

    const trigger = (
        <span className="user-dropdown-trigger">
            <div className="username">{ resolveUserDisplayName(profileDetails) }</div>
            <UserAvatar authState={ profileDetails } size="mini" />
        </span>
    );

    /**
     * Stops the dropdown from closing on click.
     *
     * @param {React.SyntheticEvent<HTMLElement>} e - Click event.
     */
    const handleUserDropdownClick = (e: SyntheticEvent<HTMLElement>) => {
        e.stopPropagation();
    };

    /**
     * Handles the account switch click event.
     *
     * @param {LinkedAccountInterface} account - Target account.
     */
    const handleLinkedAccountSwitch = (account: LinkedAccountInterface) => {
        let notification: Notification = createEmptyNotification();

        switchAccount(account)
            .then(() => {
                // reload the page on successful account switch.
                window.location.reload();
            })
            .catch((error) => {
                notification = {
                    description: t(
                        "views:components.linkedAccounts.notifications.switchAccount.genericError.description"
                    ),
                    message: t(
                        "views:components.linkedAccounts.notifications.switchAccount.genericError.message"
                    ),
                    otherProps: {
                        negative: true
                    },
                    visible: true
                };
                if (error.response && error.response.data && error.response.detail) {
                    notification = {
                        ...notification,
                        description: t(
                            "views:components.linkedAccounts.notifications.switchAccount.error.description",
                            { description: error.response.data.detail }
                        ),
                        message: t(
                            "views:components.linkedAccounts.notifications.switchAccount.error.message"
                        ),
                    };
                }
                // TODO: Fire the notification.
            });
    };

    return (
        <Menu id="app-header" className="app-header" fixed="top" borderless>
            <Container>
                { showSidePanelToggle ?
                    (
                        <Responsive as={ Menu.Item } maxWidth={ 767 }>
                            <Icon name="bars" size="large" onClick={ onSidePanelToggleClick } link />
                        </Responsive>
                    )
                    : null
                }
                <Menu.Item as={ Link } to={ APP_HOME_PATH } header>
                    <Title style={ { marginTop: 0 } } />
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown
                        item
                        trigger={ trigger }
                        floating
                        icon={ null }
                        className="user-dropdown"
                    >
                        <Dropdown.Menu onClick={ handleUserDropdownClick }>
                            <Item.Group unstackable>
                                <Item
                                    className="header"
                                    key={ `logged-in-user-${profileDetails.profileInfo.username}` }
                                >
                                    <UserAvatar authState={ profileDetails } size="tiny" />
                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <div className="name">{ resolveUserDisplayName(profileDetails) }</div>
                                            { (profileDetails.profileInfo.emails !== undefined
                                                && profileDetails.profileInfo.emails !== null) &&
                                                <div className="email">{ profileDetails.profileInfo.emails }</div>
                                            }
                                            <Divider hidden />
                                            <Button
                                                as={ Link }
                                                to="/personal-info"
                                                size="tiny"
                                                primary
                                            >
                                                { t("common:personalInfo") }
                                            </Button>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                            <Dropdown.Divider />
                            {
                                (state.profileInfo
                                    && state.profileInfo.associations
                                    && state.profileInfo.associations.length > 0)
                                    ? (
                                        <Item.Group className="linked-accounts-list" unstackable>
                                            {
                                                state.profileInfo.associations.map((association, index) => (
                                                    <Item
                                                        className="linked-account"
                                                        key={ `${association.userId}-${index}` }
                                                        onClick={ () => handleLinkedAccountSwitch(association) }
                                                    >
                                                        <UserAvatar
                                                            bordered
                                                            avatar
                                                            size="little"
                                                            name={ association.username }
                                                        />
                                                        <Item.Content verticalAlign="middle">
                                                            <Item.Description>
                                                                <div className="name">
                                                                    { association.username }
                                                                </div>
                                                                <div className="email">
                                                                    { association.tenantDomain }
                                                                </div>
                                                            </Item.Description>
                                                        </Item.Content>
                                                    </Item>
                                                ))
                                            }
                                        </Item.Group>
                                    )
                                    : null
                            }
                            <Dropdown.Item className="action-panel">
                                <Link className="action-button" to="/logout">{ t("common:logout") }</Link>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Container>
        </Menu>
    );
};

/**
 * Default prop types for the header component.
 */
Header.defaultProps = {
    onSidePanelToggleClick: () => null,
    showSidePanelToggle: true
};
