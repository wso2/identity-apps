/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getGravatarImage } from "@wso2is/core/api";
import { resolveUserDisplayName, resolveUsername } from "@wso2is/core/helpers";
import { AuthReducerStateInterface, LinkedAccountInterface, ProfileInfoInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Divider,
    Dropdown,
    Icon,
    Item,
    Menu,
    Placeholder,
    Responsive
} from "semantic-ui-react";
import { UserAvatar } from "../avatar";

/**
 * Header component prop types.
 */
interface HeaderPropsInterface {
    basicProfileInfo: AuthReducerStateInterface;
    brand?: React.ReactNode;
    brandLink?: string;
    className?: string;
    fixed?: "left" | "right" | "bottom" | "top";
    fluid?: boolean;
    isProfileInfoLoading: boolean;
    linkedAccounts?: LinkedAccountInterface[];
    profileInfo: ProfileInfoInterface;
    onLinkedAccountSwitch?: (account: LinkedAccountInterface) => void;
    onSidePanelToggleClick?: () => void;
    showSidePanelToggle?: boolean;
    showUserDropdown?: boolean;
    userDropdownIcon?: any;
    userDropdownInfoAction?: React.ReactNode;
    userDropdownLinks?: HeaderLinkInterface[];
}

/**
 * Header links interface.
 */
interface HeaderLinkInterface {
    to: string;
    name: string;
}

/**
 * Header component.
 *
 * @param {HeaderPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const Header: React.FunctionComponent<HeaderPropsInterface> = (
    props: HeaderPropsInterface
): JSX.Element => {

    const {
        brand,
        brandLink,
        basicProfileInfo,
        className,
        fixed,
        fluid,
        isProfileInfoLoading,
        linkedAccounts,
        profileInfo,
        userDropdownInfoAction,
        showSidePanelToggle,
        showUserDropdown,
        onLinkedAccountSwitch,
        onSidePanelToggleClick,
        userDropdownIcon,
        userDropdownLinks
    } = props;

    const classes = classNames(
        "app-header",
        {
            [ "fluid-header" ]: fluid
        }
        , className
    );

    const trigger = (
        <span className="user-dropdown-trigger">
            <div className="username">{
                isProfileInfoLoading
                    ? (
                        <Placeholder>
                            <Placeholder.Line/>
                        </Placeholder>
                    )
                    : resolveUserDisplayName(profileInfo, basicProfileInfo)
            }</div>
            <UserAvatar
                isLoading={ isProfileInfoLoading }
                authState={ basicProfileInfo }
                profileInfo={ profileInfo }
                size="mini"
            />
        </span>
    );

    /**
     * Stops the dropdown from closing on click.
     *
     * @param { React.SyntheticEvent<HTMLElement> } e - Click event.
     */
    const handleUserDropdownClick = (e: SyntheticEvent<HTMLElement>) => {
        e.stopPropagation();
    };

    /**
     * Handles the account switch click event.
     *
     * @param { LinkedAccountInterface } account - Target account.
     */
    const handleLinkedAccountSwitch = (account: LinkedAccountInterface) => {
        onLinkedAccountSwitch(account);
    };

    const resolveAuthenticatedUserEmail = (): string => {
        if (!profileInfo || !profileInfo.emails || !profileInfo.emails.length || profileInfo.emails.length < 1) {
            return null;
        }

        if (typeof profileInfo.emails[ 0 ] === "string") {
            return profileInfo.emails[ 0 ];
        } else if (typeof profileInfo.emails[ 0 ] === "object") {
            return profileInfo.emails[ 0 ].value;
        }

        return null;
    };

    return (
        <Menu id="app-header" className={ classes } fixed={ fixed } borderless>
            <Container fluid={ fluid }>
                {
                    showSidePanelToggle
                        ? (
                            <Responsive as={ Menu.Item } maxWidth={ 767 }>
                                <Icon name="bars" size="large" onClick={ onSidePanelToggleClick } link/>
                            </Responsive>
                        )
                        : null
                }
                {
                    brand && (
                        <Menu.Item as={ Link } to={ brandLink } header>
                            { brand }
                        </Menu.Item>
                    )
                }
                { (
                    <Menu.Menu position="right">
                        {
                            showUserDropdown && (
                                <Dropdown
                                    item
                                    trigger={ trigger }
                                    floating
                                    icon={ userDropdownIcon }
                                    className="user-dropdown"
                                >
                                    <Dropdown.Menu onClick={ handleUserDropdownClick }>
                                        <Item.Group className="authenticated-user" unstackable>
                                            <Item
                                                className="header"
                                                key={ `logged-in-user-${ profileInfo.userName }` }
                                            >
                                                <UserAvatar
                                                    authState={ basicProfileInfo }
                                                    isLoading={ isProfileInfoLoading }
                                                    size="tiny"
                                                />
                                                <Item.Content verticalAlign="middle">
                                                    <Item.Description>
                                                        < div className="name">
                                                            {
                                                                isProfileInfoLoading
                                                                    ? <Placeholder><Placeholder.Line/></Placeholder>
                                                                    : resolveUserDisplayName(
                                                                    profileInfo, basicProfileInfo
                                                                    )
                                                            }
                                                        </div>

                                                        {
                                                            (profileInfo.emails !== undefined
                                                                && profileInfo.emails !== null) && (
                                                                <div className="email">
                                                                    { isProfileInfoLoading
                                                                        ? <Placeholder><Placeholder.Line/></Placeholder>
                                                                        : resolveAuthenticatedUserEmail()
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            userDropdownInfoAction && (
                                                                <>
                                                                    <Divider hidden/>
                                                                    { userDropdownInfoAction }
                                                                </>
                                                            )
                                                        }
                                                    </Item.Description>
                                                </Item.Content>
                                            </Item>
                                        </Item.Group>
                                        <Dropdown.Divider/>
                                        {
                                            (linkedAccounts && linkedAccounts.length && linkedAccounts.length > 0)
                                                ? (
                                                    <Item.Group className="linked-accounts-list" unstackable>
                                                        {
                                                            linkedAccounts.map((association, index) => (
                                                                <Item
                                                                    className="linked-account"
                                                                    key={ `${ association.userId }-${ index }` }
                                                                    onClick={
                                                                        () => handleLinkedAccountSwitch(association)
                                                                    }
                                                                >
                                                                    <UserAvatar
                                                                        bordered
                                                                        avatar
                                                                        size="little"
                                                                        image={ getGravatarImage(association.email) }
                                                                        name={ association.username }
                                                                    />
                                                                    <Item.Content verticalAlign="middle">
                                                                        <Item.Description>
                                                                            <div className="name">
                                                                                {
                                                                                    resolveUsername(
                                                                                        association.username,
                                                                                        association.userStoreDomain
                                                                                    )
                                                                                }
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
                                        {
                                            (userDropdownLinks
                                                && userDropdownLinks.length
                                                && userDropdownLinks.length > 0)
                                                ? userDropdownLinks.map((link, index) => (
                                                    <Dropdown.Item key={ index } className="action-panel">
                                                        <Link className="action-button" to={ link.to }>
                                                            { link.name }
                                                        </Link>
                                                    </Dropdown.Item>
                                                ))
                                                : null
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            )
                        }
                    </Menu.Menu>
                ) }
            </Container>
        </Menu>
    );
};

/**
 * Default prop types for the header component.
 */
Header.defaultProps = {
    fixed: "top",
    fluid: false,
    onLinkedAccountSwitch: () => null,
    onSidePanelToggleClick: () => null,
    showSidePanelToggle: true,
    showUserDropdown: true,
    userDropdownIcon: null
};
