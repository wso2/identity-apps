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
    DropdownProps,
    Icon,
    Item,
    Menu,
    Placeholder,
    Responsive
} from "semantic-ui-react";
import { UserAvatar } from "../avatar";
import { GenericIcon } from "../icon";

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
    showUserDropdownTriggerLabel?: boolean;
    /**
     * Show hamburger icon near the user dropdown trigger.
     */
    showUserDropdownTriggerBars?: boolean;
    userDropdownIcon?: any;
    userDropdownInfoAction?: React.ReactNode;
    userDropdownLinks?: HeaderLinkCategoryInterface[];
    /**
     * User dropdown pointing direction.
     */
    userDropdownPointing?: DropdownProps[ "pointing" ];
    onAvatarClick?: () => void;
    /**
     * Show account management label.
     */
    showOrganizationLabel?: boolean;
    /**
     * Organization label.
     */
    organizationLabel?: ReactNode;
}

/**
 * Header extension interface.
 */
export interface HeaderExtension extends TestableComponentInterface {
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
 * Interface for categorized header links.
 */
export interface HeaderLinkCategoryInterface {
    /**
     * Category to group the links.
     */
    category: "APPS" | string;
    /**
     * Label to be displayed.
     */
    categoryLabel?: ReactNode;
    /**
     * Links array.
     */
    links: HeaderLinkInterface[];
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
export interface StrictHeaderLinkInterface extends TestableComponentInterface {
    /**
     * Children content.
     */
    content?: ReactNode;
    /**
     * Link icon.
     */
    icon?: ReactElement | any;
    /**
     * Link name.
     */
    name: ReactNode;
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
        showUserDropdownTriggerBars,
        showUserDropdownTriggerLabel,
        showOrganizationLabel,
        organizationLabel,
        onLinkedAccountSwitch,
        onSidePanelToggleClick,
        userDropdownIcon,
        userDropdownLinks,
        userDropdownPointing,
        onAvatarClick,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "app-header",
        {
            [ "fluid-header" ]: fluid,
            [ "has-announcement" ]: announcement !== undefined,
            "show-hamburger": showSidePanelToggle
        }
        , className
    );

    /**
     * Renders the User dropdown trigger.
     * @return {React.ReactElement}
     */
    const renderUserDropdownTrigger = (): ReactElement => {

        const renderUserDropdownTriggerAvatar = (hoverable: boolean) => (
            <UserAvatar
                hoverable={ hoverable }
                isLoading={ isProfileInfoLoading }
                authState={ basicProfileInfo }
                profileInfo={ profileInfo }
                size="mini"
                data-testid={ `${ testId }-user-avatar` }
                data-suppress=""
            />
        );

        return (
            <span className="user-dropdown-trigger" data-testid={ `${ testId }-user-dropdown-trigger` }>
                {
                    showUserDropdownTriggerLabel && (
                        <Responsive
                            minWidth={ 767 }
                            className="username"
                            data-testid={ `${ testId }-user-display-name` }
                        >
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
                    )
                }
                {
                    !showUserDropdownTriggerLabel && showUserDropdownTriggerBars
                        ? (
                            <div className="user-dropdown-trigger-with-bars-wrapper">
                                <Icon
                                    name="bars"
                                    size="large"
                                    data-testid={ `${ testId }-hamburger-icon` }
                                    link
                                />
                                { renderUserDropdownTriggerAvatar(false) }
                            </div>
                        )
                        : renderUserDropdownTriggerAvatar(true)
                }
            </span>
        );
    };

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
        if (!profileInfo || !profileInfo.userName) {
            return null;
        }

        if (typeof profileInfo.userName === "string") {
            return profileInfo?.userName?.split("/").length > 1
                ? profileInfo.userName.split("/")[ 1 ]
                : profileInfo.userName;
        } else if (typeof profileInfo.userName === "object") {
            return profileInfo?.userName?.value.split("/").length > 1
                ? profileInfo.userName.value.split("/")[ 1 ]
                : profileInfo.userName.value;
        }

        return null;
    };

    /**
     * Renders the list of linked accounts.
     *
     * @param {LinkedAccountInterface[]} accounts - Linked accounts.
     *
     * @return {React.ReactElement}
     */
    const renderLinkedAccounts = (accounts: LinkedAccountInterface[]): ReactElement => {

        if (!(accounts && Array.isArray(accounts) && accounts.length > 0)) {
            return null;
        }

        return (
            <Item.Group
                unstackable
                className="linked-accounts-list"
                data-testid={ `${ testId }-linked-accounts-container` }
            >
                {
                    accounts.map((association, index) => (
                        <Item
                            className="linked-account"
                            key={ `${ association.userId }-${ index }` }
                            onClick={ () => handleLinkedAccountSwitch(association) }
                        >
                            <UserAvatar
                                bordered
                                avatar
                                size="little"
                                image={ getGravatarImage(association.email) }
                                name={ association.username }
                                data-testid={ `${ testId }-la-avatar` }
                                spaced="right"
                                data-suppress=""
                            />
                            <Item.Content verticalAlign="middle">
                                <Item.Description>
                                    <div
                                        className="name"
                                        data-testid={ `${ testId }-la-name` }
                                    >
                                        { resolveUsername(association.username, association.userStoreDomain) }
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
        );
    };

    /**
     * Renders the links in the dropdown.
     *
     * @return {React.ReactElement[]}
     */
    const renderUserDropdownLinks = (): ReactElement[] => {

        if (!(userDropdownLinks && userDropdownLinks.length && userDropdownLinks.length > 0)) {
            return null;
        }

        return userDropdownLinks.map((category: HeaderLinkCategoryInterface, categoryIndex: number) => {

            if (!(category.links && Array.isArray(category.links) && category.links.length > 0)) {
                return null;
            }

            return (
                <>
                    { category?.categoryLabel && (
                        <Dropdown.Header
                            className="user-dropdown-links-category-header"
                            content={ category.categoryLabel }
                        />
                    ) }
                    {
                        category.links.map((link: HeaderLinkInterface, linkIndex: number) => {

                            const {
                                content,
                                "data-testid": linkTestId,
                                icon,
                                name,
                                onClick
                            } = link;

                            return (
                                <Dropdown.Item
                                    key={ linkIndex }
                                    className="action-panel user-dropdown-link"
                                    onClick={ onClick }
                                    data-testid={ linkTestId }
                                >
                                    {
                                        icon && (
                                            <GenericIcon
                                                transparent
                                                icon={ icon }
                                                size="micro"
                                                spaced="right"
                                            />
                                        )
                                    }
                                    { name }
                                    { content }
                                </Dropdown.Item>
                            );
                        })
                    }
                    { (categoryIndex !== userDropdownLinks.length - 1) && <Dropdown.Divider /> }
                </>
            );
        });
    };

    /**
     * Renders the header extensions.
     *
     * @param {HeaderExtension["floated"]} floated - Floated direction.
     *
     * @return {React.ReactElement}
     */
    const renderHeaderExtensionLinks = (floated: HeaderExtension[ "floated" ]): ReactElement => {

        return (
            <>
                {
                    extensions.map((extension: HeaderExtension) => {
                        if (extension.floated !== floated || !extension.component) {
                            return;
                        }

                        if (typeof extension.component === "string") {
                            return (
                                <div
                                    data-testid={ extension[ "data-testid" ] }
                                    className="header-link"
                                >
                                    { extension.component }
                                </div>
                            );
                        }

                        return extension.component;
                    })
                }
            </>
        );
    };

    return (
        <Menu id="app-header" className={ classes } fixed={ fixed } borderless data-testid={ testId }>
            { announcement }
            <Container
                fluid={ fluid }
                data-testid={ `${ testId }-container` }
                className="app-header-container"
            >
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
                                { renderHeaderExtensionLinks("left") }
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
                        { renderHeaderExtensionLinks("right") }
                        {
                            showUserDropdown && (
                                <Menu.Item className="user-dropdown-menu-trigger" key="user-dropdown-trigger">
                                    <Dropdown
                                        item
                                        trigger={ renderUserDropdownTrigger() }
                                        floating
                                        pointing={ userDropdownPointing }
                                        icon={ userDropdownIcon }
                                        className="user-dropdown"
                                        data-testid={ `${ testId }-user-dropdown` }
                                    >
                                        {
                                            <Dropdown.Menu
                                                className="user-dropdown-menu"
                                                onClick={ handleUserDropdownClick }
                                            >
                                                { showOrganizationLabel && (organizationLabel) }
                                                <Item.Group className="authenticated-user" unstackable>
                                                    <Item
                                                        className="header"
                                                        key={ `logged-in-user-${ profileInfo.userName }` }
                                                        onClick={ onAvatarClick }
                                                    >
                                                        <UserAvatar
                                                            hoverable={ false }
                                                            authState={ basicProfileInfo }
                                                            profileInfo={ profileInfo }
                                                            isLoading={ isProfileInfoLoading }
                                                            data-testid={ `${ testId }-user-dropdown-avatar` }
                                                            size="x50"
                                                            onClick={ onAvatarClick }
                                                            data-suppress=""
                                                        />
                                                        <Item.Content verticalAlign="middle">
                                                            <Item.Description
                                                                className={
                                                                    onAvatarClick
                                                                        ? "linked"
                                                                        : ""
                                                                }
                                                            >
                                                                <div
                                                                    className="name"
                                                                    data-testid={
                                                                        `${ testId }-user-dropdown-display-name`
                                                                    }
                                                                    data-suppress=""
                                                                >
                                                                    {
                                                                        isProfileInfoLoading
                                                                            ? (
                                                                                <Placeholder>
                                                                                    <Placeholder.Line/>
                                                                                </Placeholder>
                                                                            )
                                                                            : resolveUserDisplayName(
                                                                                profileInfo, basicProfileInfo
                                                                            )
                                                                    }
                                                                </div>

                                                                {
                                                                    (profileInfo.emails !== undefined
                                                                        && profileInfo.emails !== null
                                                                        && resolveAuthenticatedUserEmail() !==
                                                                            resolveUserDisplayName(
                                                                                profileInfo, basicProfileInfo)) && (
                                                                        <div
                                                                            className="email"
                                                                            data-testid={
                                                                                `${ testId }-user-dropdown-email`
                                                                            }
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
                                                { renderLinkedAccounts(linkedAccounts) }
                                                { renderUserDropdownLinks() }
                                            </Dropdown.Menu>
                                        }
                                    </Dropdown>
                                </Menu.Item>
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
    showUserDropdownTriggerBars: true,
    showUserDropdownTriggerLabel: true,
    userDropdownIcon: null,
    userDropdownPointing: "top right"
};
