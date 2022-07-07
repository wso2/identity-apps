/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { SessionStorageUtils } from "@wso2is/core/utils";
import { TestableComponentInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { setServiceResourceEndpoints } from "@wso2is/core/src/store";
import { GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Divider, Dropdown, Input, Item, Menu, Placeholder, Popup } from "semantic-ui-react";
import { ReactComponent as CrossIcon } from "../../../../themes/default/assets/images/icons/cross-icon.svg";
import {
    AppConstants,
    AppState,
    Config,
    getMiscellaneousIcons,
    getSidePanelIcons,
    history,
    setOrganization
} from "../../../core";
import { getOrganizations } from "../../api";
import { OrganizationManagementConstants } from "../../constants";
import { OrganizationInterface, OrganizationLinkInterface, OrganizationListInterface } from "../../models";
import { OrganizationUtils } from "../../utils";

/**
 * Interface for component dropdown.
 */
type OrganizationSwitchDropdownInterface = IdentifiableComponentInterface;

const OrganizationSwitchDropdown: FunctionComponent<OrganizationSwitchDropdownInterface> = (
    props: OrganizationSwitchDropdownInterface
): ReactElement => {
    const { "data-componentid": componentId } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const currentOrganization: OrganizationInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const [ associatedOrganizations, setAssociatedOrganizations ] = useState<OrganizationInterface[]>([]);
    const [ listFilter, setListFilter ] = useState("");
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ beforeCursor, setBeforeCursor ] = useState<string>();
    const [ isDropDownOpen, setIsDropDownOpen ] = useState<boolean>(false);
    const [ search, setSearch ] = useState<string>("");

    const getOrganizationList = useCallback((filter: string, after: string, before: string) => {
        getOrganizations(filter, 5, after, before, true, true)
            .then((response: OrganizationListInterface) => {
                if (!response || !response.organizations) {
                    setAssociatedOrganizations([ OrganizationManagementConstants.ROOT_ORGANIZATION ]);
                    setPaginationData(response.links);
                } else {
                    const organizations = [
                        OrganizationManagementConstants.ROOT_ORGANIZATION,
                        ...response?.organizations
                    ];

                    setAssociatedOrganizations(organizations);

                    setPaginationData(response.links);
                }
            });
    }, []);

    const setPaginationData = (links: OrganizationLinkInterface[]) => {
        setAfterCursor(undefined);
        setBeforeCursor(undefined);
        if (!links || links.length === 0) {
            return;
        }

        links.forEach((link) => {
            if (link.rel === "next") {
                const afterCursorLink = link.href.toString().split("after=")[ 1 ];

                setAfterCursor(afterCursorLink);
            } else {
                const beforeCursorLink = link.href.toString().split("before=")[ 1 ];

                setBeforeCursor(beforeCursorLink);
            }
        });
    };

    useEffect(() => {
        if (!isDropDownOpen) {
            return;
        }

        getOrganizationList(listFilter, null, null);
    }, [ getOrganizationList, listFilter, isDropDownOpen ]);

    const triggerTenant = (
        <span className="tenant-dropdown-trigger" data-componentid="component-dropdown-trigger">
            <GenericIcon
                transparent
                inline
                className="tenant-dropdown-trigger-icon"
                data-componentid="component-dropdown-trigger-icon"
                icon={ getMiscellaneousIcons().tenantIcon }
                size="micro"
                fill="white"
                spaced="right"
            />
            <div
                className="tenant-dropdown-trigger-display-name ellipsis"
                data-componentid="component-dropdown-display-name"
            >
                { !currentOrganization ? (
                    <Placeholder data-componentid="organization-loading-placeholder">
                        <Placeholder.Line />
                    </Placeholder>
                ) : (
                    currentOrganization?.name
                ) }
            </div>
        </span>
    );

    const handleOrganizationSwitch = (organization: OrganizationInterface): void => {
        let newOrgPath: string = "";

        if (OrganizationUtils.isRootOrganization(organization)) {
            newOrgPath = `${ window[ "AppUtils" ].getConfig().tenantPathWithoutSuperTenant }/${
                window[ "AppUtils" ].getConfig().appBase
            }`;
        } else {
            newOrgPath = window[ "AppUtils" ].getConfig().tenantPathWithoutSuperTenant
                + "/o/" + organization.id + "/" +
                window[ "AppUtils" ].getConfig().appBase;
        }

        // Clear the callback url of the previous organization.
        SessionStorageUtils.clearItemFromSessionStorage("auth_callback_url_console");

        // Redirect the user to the newly selected organization path.
        window.location.replace(newOrgPath);

        setIsDropDownOpen(false);
    };

    /**
     * Stops the dropdown from closing on click.
     *
     * @param { React.SyntheticEvent<HTMLElement> } e - Click event.
     */
    const handleDropdownClick = (e: SyntheticEvent<HTMLElement>): void => {
        e.stopPropagation();
    };

    const getOrganizationItemGroup = (organization: OrganizationInterface) => (
        <Item.Group className="tenant-item-wrapper" unstackable>
            <Item
                className="header"
                key={ `${ organization?.name }-organization-item` }
                onClick={ () => {
                    handleOrganizationSwitch(organization);
                    setIsDropDownOpen(false);
                } }
            >
                {
                    <GenericIcon
                        transparent
                        inline
                        className="associated-tenant-icon"
                        data-componentid="associated-organization-icon"
                        icon={ getMiscellaneousIcons().tenantIcon }
                        size="mini"
                    />
                }
                <Item.Content verticalAlign="middle">
                    <Item.Description>
                        <div
                            className="name ellipsis tenant-description"
                            data-componentid={ "organization-dropdown-display-name" }
                        >
                            { organization?.name ?? (
                                <Placeholder>
                                    <Placeholder.Line />
                                </Placeholder>
                            ) }

                            { !OrganizationUtils.isRootOrganization(organization) && (
                                <GenericIcon
                                    transparent
                                    inline
                                    className="manage-tenant-icon"
                                    data-componentid="associated-component-icon"
                                    icon={ getSidePanelIcons().serverConfigurations }
                                    onClick={ (event: SyntheticEvent) => {
                                        history.push({
                                            pathname: AppConstants.getPaths()
                                                .get("ORGANIZATION_UPDATE")
                                                .replace(":id", organization?.id)
                                        });
                                        setIsDropDownOpen(false);
                                        event.stopPropagation();
                                    } }
                                />
                            ) }
                        </div>
                    </Item.Description>
                </Item.Content>
            </Item>
        </Item.Group>
    );

    const resolveAssociatedOrganizations = (): ReactElement => {
        if (Array.isArray(associatedOrganizations)) {
            return (
                <Item.Group
                    className="tenants-list organizations"
                    unstackable
                    data-componentid={ "associated-organizations-container" }

                >
                    { associatedOrganizations.length > 1 ? (
                        associatedOrganizations.map((organization, _) =>
                            organization.id !== currentOrganization?.id ? getOrganizationItemGroup(organization) : null
                        )
                    ) : (
                        <Item className="empty-list">
                            <Item.Content verticalAlign="middle">
                                <Item.Description>
                                    <div className="message">
                                        { // ToDo - Set this key
                                            t("console:manage.features.organizations.switching." + "emptyList") }
                                    </div>
                                </Item.Description>
                            </Item.Content>
                        </Item>
                    ) }
                </Item.Group>
            );
        }
    };

    /**
     * Search the organization list.
     *
     * @param event
     */
    const searchOrganizationList = (search: string): void => {
        const changeValue = search.trim();

        setListFilter(changeValue ? `name co ${ changeValue }` : "");
    };

    /**
     * Resets the dropdown states.
     */
    const resetTenantDropdown = (): void => {
        setListFilter("");
        setAfterCursor(undefined);
        setBeforeCursor(undefined);
        setIsDropDownOpen(false);
    };

    /**
     * Handles the pagination change.
     *
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (isNext: boolean): void => {
        if (isNext) {
            getOrganizationList(listFilter, afterCursor, null);
        } else {
            getOrganizationList(listFilter, null, beforeCursor);
        }
    };

    const tenantPagination = (
        <div className="tenant-pagination organizations">
            <Button disabled={ beforeCursor === undefined } onClick={ () => handlePaginationChange(false) }>
                { t("common:previous") }
            </Button>
            <Button disabled={ afterCursor === undefined } onClick={ () => handlePaginationChange(true) }>
                { t("common:next") }
            </Button>
        </div>
    );

    const tenantDropdownMenu = (
        <Menu.Item className="tenant-dropdown-wrapper" key="tenant-dropdown">
            <Dropdown
                onBlur={ resetTenantDropdown }
                item
                trigger={ triggerTenant }
                floating
                pointing="top left"
                className="tenant-dropdown"
                data-componentid={ "component-dropdown" }
                onClick={ () => {
                    setIsDropDownOpen(!isDropDownOpen);
                } }
                open={ isDropDownOpen }
            >
                <Dropdown.Menu onClick={ handleDropdownClick }>
                    { getOrganizationItemGroup(currentOrganization) }

                    <Divider />
                data-testid={ "tenant-dropdown" }
                onClick={ () => {
                    setIsDropDownOpen(!isDropDownOpen);
                } }
                open={ isDropDownOpen }
            >
                <Dropdown.Menu onClick={ handleDropdownClick }>
                    { getOrganizationItemGroup(currentOrganization) }

                    <Divider />

                    <Item.Group className="search-bar">
                        <div className="advanced-search-wrapper aligned-left fill-default">
                            <Input
                                className="advanced-search with-add-on"
                                data-componentid="list-search-input"
                                icon="search"
                                iconPosition="left"
                                value={ search }
                                onChange={ (event) => {
                                    setSearch(event.target.value);
                                } }
                                onKeyDown={ (event: React.KeyboardEvent) => {
                                    event.key === "Enter" && searchOrganizationList(search);
                                    event.stopPropagation();
                                } }
                                placeholder={ t("console:manage.features.organizations.switching.search.placeholder") }
                                floated="right"
                                size="small"
                                action={
                                    search ? (
                                        <Popup
                                            trigger={
                                                (<Button
                                                    data-componentid={ `${ componentId }-clear-button` }
                                                    basic
                                                    compact
                                                    className="input-add-on organizations"
                                                >
                                                    <GenericIcon
                                                        size="nano"
                                                        defaultIcon
                                                        transparent
                                                        icon={ CrossIcon }
                                                        onClick={ () => {
                                                            setSearch("");
                                                            searchOrganizationList("");
                                                        } }
                                                    />
                                                </Button>)
                                            }
                                            position="top center"
                                            content={ t("console:common.advancedSearch.popups.clear") }
                                            inverted={ true }
                                        />
                                    ) : null
                                }
                            />
                        </div>
                    </Item.Group>

                    { associatedOrganizations ? resolveAssociatedOrganizations() : null }

                    <Divider />

                    { tenantPagination }
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>
    );

    return <>{ tenantDropdownMenu }</>;
};

export default OrganizationSwitchDropdown;

OrganizationSwitchDropdown.defaultProps = {
    "data-componentid": "organization-switch-dropdown"
};
