/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
import {
    IdentifiableComponentInterface,
    LinkedAccountInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
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
    Placeholder
} from "semantic-ui-react";
import { UserAvatar } from "../avatar";
import { GenericIcon } from "../icon";
import { Media } from "../media";

/**
 * Header component prop types.
 */
export interface HeaderPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
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
    isPrivilegedUser?: boolean;
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
export interface HeaderExtension extends IdentifiableComponentInterface, TestableComponentInterface {
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
export interface StrictHeaderLinkInterface extends IdentifiableComponentInterface, TestableComponentInterface {
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
     * @param event - React's original SyntheticEvent.
     * @param data - All props.
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>, data: DropdownItemProps) => void;
}

/**
 * Header component.
 *
 * @param props - Props injected to the component.
 * @returns Header Component.
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
        isPrivilegedUser,
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
        [ "data-componentid" ]: componentId,
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
     * @returns User Dropdown rigger component.
     */
    const renderUserDropdownTrigger = (): ReactElement => {

        const renderUserDropdownTriggerAvatar = (hoverable: boolean) => (
            <UserAvatar
                hoverable={ hoverable }
                isLoading={ isProfileInfoLoading }
                authState={ basicProfileInfo }
                profileInfo={ profileInfo }
                size="mini"
                data-componentid={ `${ componentId }-user-avatar` }
                data-testid={ `${ testId }-user-avatar` }
                data-suppress=""
            />
        );

        return (
            <span
                className="user-dropdown-trigger"
                data-componentid={ `${ componentId }-user-dropdown-trigger` }
                data-testid={ `${ testId }-user-dropdown-trigger` }
            >
                {
                    showUserDropdownTriggerLabel && (
                        <Media
                            greaterThan="mobile"
                            className="username"
                            data-componentid={ `${ componentId }-user-display-name` }
                            data-testid={ `${ testId }-user-display-name` }
                        >
                            {
                                isProfileInfoLoading
                                    ? (
                                        <Placeholder
                                            data-componentid={ `${ componentId }-username-loading-placeholder` }
                                            data-testid={ `${ testId }-username-loading-placeholder` }
                                        >
                                            <Placeholder.Line/>
                                        </Placeholder>
                                    )
                                    : resolveUserDisplayName(profileInfo, basicProfileInfo)
                            }
                        </Media>
                    )
                }
                {
                    !showUserDropdownTriggerLabel && showUserDropdownTriggerBars
                        ? (
                            <div className="user-dropdown-trigger-with-bars-wrapper">
                                <Icon
                                    name="bars"
                                    size="large"
                                    data-componentid={ `${ componentId }-hamburger-icon` }
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
     * @param e - Click event.
     */
    const handleUserDropdownClick = (e: SyntheticEvent<HTMLElement>): void => {
        e.stopPropagation();
    };

    /**
     * Handles the account switch click event.
     *
     * @param account - Target account.
     */
    const handleLinkedAccountSwitch = (account: LinkedAccountInterface): void => {
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
     * @param accounts - Linked accounts.
     * @returns Link Accounts list.
     */
    const renderLinkedAccounts = (accounts: LinkedAccountInterface[]): ReactElement => {

        if (!(accounts && Array.isArray(accounts) && accounts.length > 0)) {
            return null;
        }

        return (
            <Item.Group
                unstackable
                className="linked-accounts-list"
                data-componentid={ `${ componentId }-linked-accounts-container` }
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
                                data-componentid={ `${ componentId }-la-avatar` }
                                data-testid={ `${ testId }-la-avatar` }
                                spaced="right"
                                data-suppress=""
                            />
                            <Item.Content verticalAlign="middle">
                                <Item.Description>
                                    <div
                                        className="name"
                                        data-componentid={ `${ componentId }-la-name` }
                                        data-testid={ `${ testId }-la-name` }
                                    >
                                        { resolveUsername(association.username, association.userStoreDomain) }
                                    </div>
                                    <div
                                        className="email"
                                        data-componentid={ `${ componentId }-la-email` }
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
     * @returns User Dropdown links.
     */
    const renderUserDropdownLinks = (): ReactElement[] => {

        if (!(userDropdownLinks && userDropdownLinks.length && userDropdownLinks.length > 0)) {
            return null;
        }

        const adjustedUserDropdownLinks: HeaderLinkCategoryInterface[] = userDropdownLinks
            .reduce((previous: HeaderLinkCategoryInterface[], current: HeaderLinkCategoryInterface) => {
                const { category, categoryLabel, links } : Partial<HeaderLinkCategoryInterface> = current;

                if (isPrivilegedUser && category === "APPS") {
                    // Remove my account app from privileged users.
                    return previous;
                }

                const findObj : Partial<HeaderLinkCategoryInterface> = [ ...previous ]
                    .find((obj) => obj.category === category);

                if (!findObj) {
                    previous.push({ category, categoryLabel, links });
                } else {
                    findObj.links.push(...links);
                }

                return previous;
            }, []);

        return adjustedUserDropdownLinks.map((category: HeaderLinkCategoryInterface, categoryIndex: number) => {

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

                            if (!link) {
                                return;
                            }

                            const {
                                content,
                                "data-componentid": linkComponentId,
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
                                    data-componentid={ linkComponentId }
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
     * @param floated - Floated direction.
     * @returns Header Extension links.
     */
    const renderHeaderExtensionLinks = (floated: HeaderExtension[ "floated" ]): ReactElement => {

        return (
            <>
                {
                    extensions.map((extension: HeaderExtension, index: number) => {
                        if (extension.floated !== floated || !extension.component) {
                            return;
                        }

                        if (typeof extension.component === "string") {
                            return (
                                <div
                                    key={ index }
                                    data-componentid={ extension[ "data-componentid" ] }
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
        <Menu
            id="app-header"
            className={ classes }
            fixed={ fixed }
            borderless
            data-componentid={ componentId }
            data-testid={ testId }
        >
            { announcement }
            <Container
                fluid={ fluid }
                data-componentid={ `${ componentId }-container` }
                data-testid={ `${ testId }-container` }
                className="app-header-container"
            >
                {
                    showSidePanelToggle
                        ? (
                            <Media lessThan="tablet">
                                { (className: string, renderChildren: boolean) => (
                                    <span className={ className }>
                                        { renderChildren && (
                                            <Menu.Item className="bars-container">
                                                <Icon
                                                    name="bars"
                                                    size="large"
                                                    onClick={ onSidePanelToggleClick }
                                                    data-componentid={ `${ componentId }-hamburger-icon` }
                                                    data-testid={ `${ testId }-hamburger-icon` }
                                                    link
                                                />
                                            </Menu.Item>
                                        ) }
                                    </span>
                                ) }
                            </Media>
                        )
                        : null
                }
                {
                    brand && (
                        <Media greaterThan="mobile">
                            { (className: string, renderChildren: boolean) => (
                                <span className={ className }>
                                    { renderChildren && (
                                        <Menu.Item className="brand-container">
                                            <Menu.Item
                                                as={ Link }
                                                to={ brandLink }
                                                header
                                                data-componentid={ `${ componentId }-brand-container` }
                                                data-testid={ `${ testId }-brand-container` }
                                            >
                                                { brand }
                                            </Menu.Item>
                                        </Menu.Item>
                                    ) }
                                </span>
                            ) }
                        </Media>

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
                                data-componentid={ `${ componentId }-left-extensions` }
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
                        data-componentid={ `${ componentId }-user-dropdown-container` }
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
                                        data-componentid={ `${ componentId }-user-dropdown` }
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
                                                            data-componentid={
                                                                `${ componentId }-user-dropdown-avatar`
                                                            }
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
                                                                    data-componentid={
                                                                        `${ componentId }-user-dropdown-display-name`
                                                                    }
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
                                                                            data-componentid={
                                                                                `${ componentId }-user-dropdown-email`
                                                                            }
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
    "data-componentid": "app-header",
    "data-testid": "app-header",
    fixed: "top",
    fluid: false,
    isPrivilegedUser: false,
    onLinkedAccountSwitch: () => null,
    onSidePanelToggleClick: () => null,
    showSidePanelToggle: true,
    showUserDropdown: true,
    showUserDropdownTriggerBars: true,
    showUserDropdownTriggerLabel: true,
    userDropdownIcon: null,
    userDropdownPointing: "top right"
};
