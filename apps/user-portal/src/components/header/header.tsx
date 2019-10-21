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

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Dropdown, Icon, Item, Menu, Responsive } from "semantic-ui-react";
import { AuthContext } from "../../contexts";
import { Title, UserImage } from "../shared";

/**
 * Header component prop types.
 */
interface HeaderProps {
    onSidePanelToggleClick?: () => void;
    showSidePanelToggle?: boolean;
}

/**
 * Header component.
 * TODO: Fix avatar responsive issue on mobile.
 *
 * @param {HeaderProps} props - Props supplied to the header component.
 * @return {JSX.Element}
 */
export const Header: React.FunctionComponent<HeaderProps> = (props: HeaderProps): JSX.Element => {
    const { state } = useContext(AuthContext);
    const { onSidePanelToggleClick, showSidePanelToggle } = props;

    const trigger = (
        <span className="user-dropdown-trigger">
            <div className="username">
                {
                    (state.profileInfo.displayName || state.profileInfo.lastName)
                        ? state.profileInfo.displayName + " " + state.profileInfo.lastName
                        : (state.displayName !== "undefined") ? state.displayName : state.username
                }
            </div>
            <UserImage bordered avatar size="mini" name={ state.username } />
        </span>
    );

    return (
        <Menu id="app-header" className="app-header" fixed="top" borderless>
            <Container>
                { showSidePanelToggle ?
                    <Responsive as={ Menu.Item } maxWidth={ 767 }>
                        <Icon name="bars" size="large" onClick={ onSidePanelToggleClick } link/>
                    </Responsive>
                    : null
                }
                <Menu.Item as={ Link } to={ APP_HOME_PATH } header>
                    <Title style={ { marginTop: 0 } }/>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown
                        item
                        trigger={ trigger }
                        floating
                        icon={ null }
                        className="user-dropdown">
                        <Dropdown.Menu>
                            <Item.Group unstackable>
                                <Item className="header">
                                    <UserImage bordered avatar size="tiny" name={ state.username } />
                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <div className="name">{ state.username }</div>
                                            { (state.emails !== "undefined"
                                                && state.emails !== undefined
                                                && state.emails !== "null"
                                                && state.emails !== null) &&
                                            <div className="email">{ state.emails }</div>
                                            }
                                            <Divider hidden/>
                                            <Button as={ Link } to="/my-apps" size="tiny"
                                                    primary>My Apps</Button>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                            <Dropdown.Divider/>
                            {
                                (state.profileInfo
                                    && state.profileInfo.associations
                                    && state.profileInfo.associations.length > 0)
                                    ? (
                                        <Item.Group className="linked-accounts-list" unstackable>
                                            {
                                                state.profileInfo.associations.map((association) => (
                                                    <Item className="linked-account">
                                                        <UserImage
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
                                <Link className="action-button" to="/logout">Logout</Link>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Container>
        </Menu>
    );
};

/**
 * Default proptypes for the header component.
 */
Header.defaultProps = {
    onSidePanelToggleClick: () => null,
    showSidePanelToggle: true
};
