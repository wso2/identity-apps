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
import { LinkedAccountInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Divider,
    Dropdown,
    DropdownItemProps,
    Icon,
    Item,
    Menu,
    Placeholder,
    Responsive,
    SemanticICONS
} from "semantic-ui-react";
import { UserAvatar } from "../avatar";

/**
 * Header component prop types.
 */
export interface HeaderPropsInterface extends TestableComponentInterface {
    /**
     * Top announcement component.
     */
    announcement?: ReactNode;
    /**
     * Set of extensions.
     */
    extensions?: HeaderExtension[];
    // TODO: Add proper type interface.
    basicProfileInfo: any;
    brand?: React.ReactNode;
    brandLink?: string;
    children?: any;
    className?: string;
    fixed?: "left" | "right" | "bottom" | "top";
    fluid?: boolean;
    isProfileInfoLoading?: boolean;
    linkedAccounts?: LinkedAccountInterface[];
    // TODO: Add proper type interface.
    profileInfo: any;
    onLinkedAccountSwitch?: (account: LinkedAccountInterface) => void;
    onSidePanelToggleClick?: () => void;
    showSidePanelToggle?: boolean;
    showUserDropdown?: boolean;
    userDropdownIcon?: any;
    userDropdownInfoAction?: React.ReactNode;
    userDropdownLinks?: HeaderLinkInterface[];
}

/**
 * Header extension interface.
 */
interface HeaderExtension {
    /**
     * Component to render.
     */
    component: ReactNode;
    /**
     * Float direction.
     */
    floated: "left" | "right";
}

/**
 * Header links dynamic interface to pass in extra props for `Link` component.
 */
export interface HeaderLinkInterface extends StrictHeaderLinkInterface {
    [ key: string ]: any;
}

/**
 * Header links strict interface.
 */
export interface StrictHeaderLinkInterface {
    /**
     * Children content.
     */
    content?: ReactNode;
    /**
     * Link icon.
     */
    icon?: SemanticICONS;
    /**
     * Link name.
     */
    name: string;
    /**
     * Called on dropdown item click.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props.
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>, data: DropdownItemProps) => void;
}

/**
 * Header component.
 *
 * @param {HeaderPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const Header: FunctionComponent<HeaderPropsInterface> = (
    props: HeaderPropsInterface
): ReactElement => {

    const {
        announcement,
        brand,
        brandLink,
        basicProfileInfo,
        children,
        className,
        extensions,
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
        userDropdownLinks,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "app-header",
        {
            [ "fluid-header" ]: fluid,
            [ "has-announcement" ]: announcement
        }
        , className
    );

    const trigger = (
        <span className="user-dropdown-trigger" data-testid={ `${ testId }-user-dropdown-trigger` }>
            <Responsive minWidth={ 767 } className="username" data-testid={ `${ testId }-user-display-name` }>
                {
                    isProfileInfoLoading
                        ? (
                            <Placeholder data-testid={ `${ testId }-username-loading-placeholder` }>
                                <Placeholder.Line/>
                            </Placeholder>
                        )
                        : resolveUserDisplayName(profileInfo, basicProfileInfo)
                }
            </Responsive>
            <UserAvatar
                isLoading={ isProfileInfoLoading }
                authState={ basicProfileInfo }
                profileInfo={ profileInfo }
                size="mini"
                data-testid={ `${ testId }-user-avatar` }
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
        <Menu id="app-header" className={ classes } fixed={ fixed } borderless data-testid={ testId }>
            { announcement }
            <Container fluid={ fluid } data-testid={ `${ testId }-container` } className="app-header-container">
                {
                    showSidePanelToggle
                        ? (
                            <Responsive as={ Menu.Item } maxWidth={ 767 }>
                                <Icon
                                    name="bars"
                                    size="large"
                                    onClick={ onSidePanelToggleClick }
                                    data-testid={ `${ testId }-hamburger-icon` }
                                    link
                                />
                            </Responsive>
                        )
                        : null
                }
                {
                    brand && (
                        <Responsive className="p-0" as={ Menu.Item } minWidth={ 767 }>
                            <Menu.Item 
                                as={ Link } 
                                to={ brandLink } 
                                header 
                                data-testid={ `${ testId }-brand-container` }
                            >
                                { brand }
                            </Menu.Item>
                        </Responsive>
                        
                    )
                }
                {
                    extensions && (
                        extensions instanceof Array
                        && extensions.length > 0
                        && extensions.some((extension: HeaderExtension) => extension.floated === "left")
                        && (
                            <Menu.Menu
                                position="left"
                                className="header-extensions left"
                                data-testid={ `${ testId }-left-extensions` }
                            >
                                {
                                    extensions.map((extension: HeaderExtension) =>
                                        extension.floated === "left" && extension.component)
                                }
                            </Menu.Menu>
                        )
                    )
                }
                { (
                    <Menu.Menu
                        position="right"
                        className="header-extensions right"
                        data-testid={ `${ testId }-user-dropdown-container` }
                    >
                        {
                            extensions && (
                                extensions instanceof Array
                                && extensions.length > 0
                                && extensions.some((extension: HeaderExtension) => extension.floated === "right")
                                && extensions.map((extension: HeaderExtension) =>
                                    extension.floated === "right" && extension.component)
                            )
                        }
                        {
                            showUserDropdown && (
                                <Dropdown
                                    item
                                    trigger={ trigger }
                                    floating
                                    icon={ userDropdownIcon }
                                    className="user-dropdown"
                                    data-testid={ `${ testId }-user-dropdown` }
                                >
                                    <Dropdown.Menu onClick={ handleUserDropdownClick }>
                                        <Item.Group className="authenticated-user" unstackable>
                                            <Item
                                                className="header"
                                                key={ `logged-in-user-${ profileInfo.userName }` }
                                            >
                                                <UserAvatar
                                                    authState={ basicProfileInfo }
                                                    profileInfo={ profileInfo }
                                                    isLoading={ isProfileInfoLoading }
                                                    data-testid={ `${ testId }-user-dropdown-avatar` }
                                                    size="x60"
                                                />
                                                <Item.Content verticalAlign="middle">
                                                    <Item.Description>
                                                        <div
                                                            className="name"
                                                            data-testid={ `${ testId }-user-dropdown-display-name` }
                                                        >
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
                                                                <div
                                                                    className="email"
                                                                    data-testid={ `${ testId }-user-dropdown-email` }
                                                                >
                                                                    { isProfileInfoLoading
                                                                        ? (
                                                                            <Placeholder>
                                                                                <Placeholder.Line/>
                                                                            </Placeholder>)
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
                                        {
                                            (linkedAccounts && linkedAccounts.length && linkedAccounts.length > 0)
                                                ? (
                                                    <Item.Group
                                                        className="linked-accounts-list"
                                                        unstackable
                                                        data-testid={ `${ testId }-linked-accounts-container` }
                                                    >
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
                                                                        data-testid={ `${ testId }-la-avatar` }
                                                                        spaced="right"
                                                                    />
                                                                    <Item.Content verticalAlign="middle">
                                                                        <Item.Description>
                                                                            <div
                                                                                className="name"
                                                                                data-testid={ `${ testId }-la-name` }
                                                                            >
                                                                                {
                                                                                    resolveUsername(
                                                                                        association.username,
                                                                                        association.userStoreDomain
                                                                                    )
                                                                                }
                                                                            </div>
                                                                            <div
                                                                                className="email"
                                                                                data-testid={ `${ testId }-la-email` }
                                                                            >
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
                                                ? userDropdownLinks.map((link, index) => {
                                                    const {
                                                        content,
                                                        icon,
                                                        name,
                                                        onClick
                                                    } = link;

                                                    return (
                                                        <Dropdown.Item
                                                            key={ index }
                                                            className="action-panel"
                                                            onClick={ onClick }
                                                            data-testid={ `${ testId }-dropdown-link-${ name }` }
                                                        >
                                                            { icon && <Icon className="link-icon" name={ icon } /> }
                                                            { name }
                                                            { content }
                                                        </Dropdown.Item>
                                                    )
                                                })
                                                : null
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            )
                        }
                    </Menu.Menu>
                ) }
            </Container>
            { children }
        </Menu>
    );
};

/**
 * Default prop types for the header component.
 */
Header.defaultProps = {
    "data-testid": "app-header",
    fixed: "top",
    fluid: false,
    onLinkedAccountSwitch: () => null,
    onSidePanelToggleClick: () => null,
    showSidePanelToggle: true,
    showUserDropdown: true,
    userDropdownIcon: null
};
