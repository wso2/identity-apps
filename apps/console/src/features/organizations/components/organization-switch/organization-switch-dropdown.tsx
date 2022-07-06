/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { setServiceResourceEndpoints } from "@wso2is/core/src/store";
import { GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Dropdown, Input, Item, Menu, Placeholder } from "semantic-ui-react";
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

/**
 * Interface for tenant dropdown.
 */
type OrganizationSwitchDropdownInterface = TestableComponentInterface;

const OrganizationSwitchDropdown: FunctionComponent<OrganizationSwitchDropdownInterface> = (
    props: OrganizationSwitchDropdownInterface
): ReactElement => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const currentOrganization: OrganizationInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

    const [ associatedOrganizations, setAssociatedOrganizations ] = useState<OrganizationInterface[]>([]);
    // ToDo - Need to set the current Organization ID
    const [ listFilter, setListFilter ] = useState("");
    const [ afterCursor, setAfterCursor ] = useState<string>();
    const [ beforeCursor, setBeforeCursor ] = useState<string>();

    const getOrganizationList = useCallback((filter: string, after: string, before: string) => {
        getOrganizations(filter, 5, after, before, true).then((response: OrganizationListInterface) => {
            const organizations = [ OrganizationManagementConstants.ROOT_ORGANIZATION, ...response.organizations ];

            setAssociatedOrganizations(organizations);

            setPaginationData(response.links);
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
        getOrganizationList(listFilter, null, null);
    }, [ getOrganizationList, listFilter ]);

    const triggerTenant = (
        <span className="tenant-dropdown-trigger" data-testid="tenant-dropdown-trigger">
            <GenericIcon
                transparent
                inline
                className="tenant-dropdown-trigger-icon"
                data-testid="tenant-dropdown-trigger-icon"
                icon={ getMiscellaneousIcons().tenantIcon }
                size="micro"
                fill="white"
                spaced="right"
            />
            <div className="tenant-dropdown-trigger-display-name ellipsis" data-testid="tenant-dropdown-display-name">
                { !currentOrganization ? (
                    <Placeholder data-testid="organization-loading-placeholder">
                        <Placeholder.Line />
                    </Placeholder>
                ) : (
                    currentOrganization?.name
                ) }
            </div>
        </span>
    );

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
                    dispatch(setOrganization(organization));
                    dispatch(setServiceResourceEndpoints(Config.getServiceResourceEndpoints()));
                } }
            >
                {
                    <GenericIcon
                        transparent
                        inline
                        className="associated-tenant-icon"
                        data-testid="associated-organization-icon"
                        icon={ getMiscellaneousIcons().tenantIcon }
                        size="mini"
                    />
                }
                <Item.Content verticalAlign="middle">
                    <Item.Description>
                        <div
                            className="name ellipsis tenant-description"
                            data-testid={ "organization-dropdown-display-name" }
                        >
                            { organization?.name ?? (
                                <Placeholder>
                                    <Placeholder.Line />
                                </Placeholder>
                            ) }

                            <GenericIcon
                                transparent
                                inline
                                className="manage-tenant-icon"
                                data-testid="associated-tenant-icon"
                                icon={ getSidePanelIcons().serverConfigurations }
                                onClick={ (event: SyntheticEvent) => {
                                    history.push({
                                        pathname: AppConstants.getPaths()
                                            .get("ORGANIZATION_UPDATE")
                                            .replace(":id", organization?.id)
                                    });
                                    event.stopPropagation();
                                } }
                            />
                        </div>
                    </Item.Description>
                </Item.Content>
            </Item>
        </Item.Group>
    );

    const resolveAssociatedOrganizations = (): ReactElement => {
        if (Array.isArray(associatedOrganizations)) {
            return (
                <Item.Group className="tenants-list" unstackable data-testid={ "associated-organizations-container" }>
                    { associatedOrganizations.length > 0 ? (
                        associatedOrganizations.map((organization, _) =>
                            organization.id !== currentOrganization?.id ? getOrganizationItemGroup(organization) : null
                        )
                    ) : (
                        <Item className="empty-list">
                            <Item.Content verticalAlign="middle">
                                <Item.Description>
                                    <div className="message">
                                        { // ToDo - Set this key
                                            t(
                                                "extensions:manage.features.tenant.header." +
                                                "tenantSearch.emptyResultMessage"
                                            ) }
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
    const searchOrganizationList = (event): void => {
        const changeValue = event.target.value;

        setListFilter(`eq name ${ changeValue }`);
    };

    /**
     * Resets the dropdown states.
     */
    const resetTenantDropdown = (): void => {
        setListFilter("");
        setAfterCursor(undefined);
        setBeforeCursor(undefined);
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
        <div className="tenant-pagination">
            <Button disabled={ beforeCursor === undefined } onClick={ () => handlePaginationChange(false) }>
                Previous
            </Button>
            <Button disabled={ afterCursor === undefined } onClick={ () => handlePaginationChange(true) }>
                Next
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
                data-testid={ "tenant-dropdown" }
            >
                <Dropdown.Menu onClick={ handleDropdownClick }>
                    { getOrganizationItemGroup(currentOrganization) }

                    <Divider />

                    <Item.Group className="search-bar">
                        <div className="advanced-search-wrapper aligned-left fill-default">
                            <Input
                                className="advanced-search with-add-on"
                                data-testid="list-search-input"
                                icon="search"
                                iconPosition="left"
                                onChange={ searchOrganizationList }
                                placeholder={ t("extensions:manage.features.tenant.header.tenantSearch.placeholder") }
                                floated="right"
                                size="small"
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
