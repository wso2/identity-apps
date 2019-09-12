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
import { AuthContext } from "../contexts/auth";
import { Title, UserImageDummy } from "./ui";

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
    const { onSidePanelToggleClick, showSidePanelToggle } = props;

    return (
        <Menu id="app-header" fixed="top" borderless>
            <Container>
                { showSidePanelToggle ?
                    <Responsive as={ Menu.Item } maxWidth={ 767 }>
                        <Icon name="bars" size="large" onClick={ onSidePanelToggleClick } link />
                    </Responsive>
                    : null
                }
                <Menu.Item as={ Link } to={ APP_HOME_PATH } header>
                    <Title style={ { marginTop: 0 } }/>
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown
                        item
                        floating
                        text={ (state.displayName !== "undefined") ? state.displayName : state.username }
                        className="user-dropdown">
                        <Dropdown.Menu>
                            <Item.Group>
                                <Item className="header">
                                    <Item.Image size="tiny" circular src={ UserImageDummy }/>

                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <div>{ state.username }</div>
                                            { (state.emails !== "undefined"
                                                && state.emails !== undefined
                                                && state.emails !== "null"
                                                && state.emails !== null) &&
                                            <div>{ state.emails }</div>
                                            }
                                            <Divider hidden/>
                                            <Button as={ Link } to="/my-apps" size="tiny"
                                                    primary>My Apps</Button>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                            <Dropdown.Divider/>
                            <Dropdown.Item
                                icon="shield"
                                as={ Link }
                                to="/overview"
                                text="Identity Server Account"/>
                            <Dropdown.Divider/>
                            <Dropdown.Item as={ Link } to="/logout" text="Logout"/>
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
