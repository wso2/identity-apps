/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { TenantAssociationsInterface, TestableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Dropdown, Input, Item, Menu, Placeholder } from "semantic-ui-react";
import { AppState, getMiscellaneousIcons, getSidePanelIcons } from "../../../core";
import { getOrganizations } from "../../api";
import { OrganizationInterface, OrganizationListInterface } from "../../models";
// import { getUsersOrganization } from "../../api/organizations";
// import { getMiscellaneousIcons, getSidePanelIcons } from "../configs";
// import { OrganizationListInterface } from "../models/organizations";
// import { TenantInfo } from "../models/tenants";
// import { AppState, setActiveView } from "../store";

/**
 * Interface for tenant dropdown.
 */
type OrganizationSwitchDropdownInterface = TestableComponentInterface;

const OrganizationSwitchDropdown: FunctionComponent<OrganizationSwitchDropdownInterface> = (
    props: OrganizationSwitchDropdownInterface
): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const username: string = useSelector((state: AppState) => state.auth.username);
    const email: string = useSelector((state: AppState) => state.auth.email);
    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);

    const [ tenantAssociations, setTenantAssociations ] = useState<TenantAssociationsInterface>(undefined);
    const [ tempTenantAssociationsList, setTempTenantAssociationsList ] = useState<string[]>(undefined);
    const [ showTenantAddModal, setShowTenantAddModal ] = useState<boolean>(false);
    const [ isSwitchTenantsSelected, setIsSwitchTenantsSelected ] = useState<boolean>(false);
    const [ isSetDefaultTenantInProgress, setIsSetDefaultTenantInProgress ] = useState<boolean>(false);

    const [ currentOrganization, setCurrentOrganization ] = useState<OrganizationInterface>();
    const [ associatedOrganizations, setAssociatedOrganizations ] = useState<OrganizationInterface[]>([]);
    // ToDo - Need to set the current Organization ID
    const [ currentOrganizationId, setCurrentOrganizationId ] = useState<string>("carbon.super");
    const [ listFilter, setListFilter ] = useState("");
    const [ afterCursor, setAfterCursor ] = useState();
    const [ beforeCursor, setBeforeCursor ] = useState();

    const getOrganizationList = useCallback(() => {
        getOrganizations(
            listFilter,
            5,
            afterCursor,
            beforeCursor,
            true
        ).then((response: OrganizationListInterface) => {
            console.log(response);

            const associatedOrganizations: Array<OrganizationInterface> = response.organizations
                .map((organization) => organization)
                .filter((organization) => {
                    if (currentOrganizationId === organization.name) {
                        setCurrentOrganization(organization);

                        return false;
                    }

                    return true;
                });

            setAssociatedOrganizations(associatedOrganizations);
        });
    }, [ listFilter, afterCursor, beforeCursor ]);

    // ToDo
    // 1. How to get the carbon.super org/tenant? How it's done for now
    // 2. Default organization?
    // 3. Store to set default org/tenant
    // 4. Refresh page when switching an organization
    useEffect(() => {
        getOrganizationList();
    }, [ listFilter ]);

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
                {
                    !currentOrganization
                        ? (
                            <Placeholder data-testid="organization-loading-placeholder">
                                <Placeholder.Line/>
                            </Placeholder>
                        )
                        : currentOrganization?.name
                }
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

    const getOrganizationItemGroup = (organizationName: string) => (
        <Item.Group className="tenant-item-wrapper" unstackable>
            <Item
                className="header"
                key={ `${organizationName}-organization-item` }
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
                            data-testid={
                                "organization-dropdown-display-name"
                            }
                        >
                            {
                                organizationName
                                ?? (<Placeholder>
                                    <Placeholder.Line/>
                                </Placeholder>)
                            }

                            <GenericIcon
                                transparent
                                inline
                                className="manage-tenant-icon"
                                data-testid="associated-tenant-icon"
                                icon={ getSidePanelIcons().serverConfigurations }
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
                <Item.Group
                    className="tenants-list"
                    unstackable
                    data-testid={ "associated-organizations-container" }
                >
                    {
                        associatedOrganizations.length > 0 ?
                            (
                                associatedOrganizations.map((organization, _) => (
                                    (organization.id !== currentOrganization.id) ?
                                        getOrganizationItemGroup(organization.name)
                                        : null
                                ))
                            )
                            :
                            (
                                <Item
                                    className="empty-list"
                                >
                                    <Item.Content verticalAlign="middle">
                                        <Item.Description>
                                            <div className="message">
                                                {
                                                    // ToDo - Set this key
                                                    t("extensions:manage.features.tenant.header." +
                                                        "tenantSearch.emptyResultMessage")
                                                }
                                            </div>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            )
                    }
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

        setListFilter(`eq name ${changeValue}`);
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
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (event: React.MouseEvent<HTMLButtonElement>): void => {
        getOrganizationList();
    };

    const tenantPagination = (
        <div className="tenant-pagination">
            <Button
                disabled={ beforeCursor === undefined }
                onClick={ handlePaginationChange }>
                Previous
            </Button>
            <Button
                disabled={ afterCursor === undefined }
                onClick={ handlePaginationChange }>
                Next
            </Button>
        </div>
    );

    // ToDo -
    //  1 - Need to add pagination
    //  2 - Click to actions
    //  3 - Manage Organization Icon (What's the route should be?)
    //  4 - Filter
    //  5 - Cursor based pagination
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
                    {
                        getOrganizationItemGroup(currentOrganization?.name)
                    }

                    <Divider/>

                    <Item.Group className="search-bar">
                        <div className="advanced-search-wrapper aligned-left fill-default">
                            <Input
                                className="advanced-search with-add-on"
                                data-testid="list-search-input"
                                icon="search"
                                iconPosition="left"
                                onChange={ searchOrganizationList }
                                placeholder={
                                    t("extensions:manage.features.tenant.header.tenantSearch.placeholder")
                                }
                                floated="right"
                                size="small"
                            />
                        </div>
                    </Item.Group>

                    {
                        tenantAssociations
                            ? resolveAssociatedOrganizations()
                            : null
                    }

                    <Divider/>

                    { tenantPagination }

                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>
    );

    return (
        <>
            { tenantDropdownMenu }
        </>
    );
};

export default OrganizationSwitchDropdown;
