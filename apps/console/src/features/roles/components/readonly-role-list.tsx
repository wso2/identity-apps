/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface, LoadableComponentInterface, RolesMemberInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    ListLayout,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownItemProps, DropdownProps, Header, Label } from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters, UIConstants, getEmptyPlaceholderIllustrations } from "../../core";
import { RoleAudienceTypes } from "../constants";

const DEFAULT_SEARCH_OPERATOR: string = "co";

interface ReadOnlyRoleListProps extends LoadableComponentInterface, IdentifiableComponentInterface {
    /**
     * Roles list.
     */
    totalRoleList: RolesMemberInterface[];
    /**
     * Placeholder to be displayed when the list is empty.
     */
    emptyRolesListPlaceholder: ReactElement;
}

/**
 * List component for Role Management list
 *
 * @param props - contains the role list as a prop to populate
 */
export const ReadOnlyRoleList: React.FunctionComponent<ReadOnlyRoleListProps> = (
    props: ReadOnlyRoleListProps
): ReactElement => {

    const {
        totalRoleList,
        emptyRolesListPlaceholder,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ resetPagination, setResetPagination ] = useState<boolean>(false);
    const [ finalRoleList, setFinalRoleList ] = useState<RolesMemberInterface[]>(undefined);
    const [ filteredRoleList, setFilteredRoleList ] = useState<RolesMemberInterface[]>(undefined);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ roleNameSearchQuery, setRoleNameSearchQuery ] = useState<string>(undefined);
    const [ roleAudienceFilter, setRoleAudienceFilter ] = useState<string>(undefined);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    /**
     * Filter options for the roles list.
     */
    const filterOptions: DropdownItemProps[] = [
        {
            key: undefined,
            text: t("console:manage.features.roles.list.filterOptions.all"),
            value: undefined
        },
        {
            key: RoleAudienceTypes.APPLICATION,
            text: t("console:manage.features.roles.list.filterOptions.applicationRoles"),
            value: RoleAudienceTypes.APPLICATION
        },
        {
            key: RoleAudienceTypes.ORGANIZATION,
            text: t("console:manage.features.roles.list.filterOptions.organizationRoles"),
            value: RoleAudienceTypes.ORGANIZATION
        }
    ];

    useEffect(() => {

        if (!totalRoleList) {
            return;
        }

        setFilteredRoleList(totalRoleList);
        setIsLoading(false);
    }, [ totalRoleList ]);

    useEffect(() => {

        let filteredList: RolesMemberInterface[] = totalRoleList;

        if (roleAudienceFilter) {
            filteredList = filteredList.filter(
                (role: RolesMemberInterface) => role.audienceType.toUpperCase() === roleAudienceFilter
            );
        }
        if (roleNameSearchQuery) {
            const roleNameToFilter: string = roleNameSearchQuery.split(DEFAULT_SEARCH_OPERATOR)[1].trim().toLowerCase();

            filteredList = filteredList.filter(
                (role: RolesMemberInterface) => role.display.toLowerCase().includes(roleNameToFilter)
            );
        }

        setFilteredRoleList(filteredList);
    }, [ roleNameSearchQuery, roleAudienceFilter ]);


    useEffect(() => {
        setFinalRoleList(getPaginatedRoleList(filteredRoleList));
    }, [ listOffset, listItemLimit, filteredRoleList ]);

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {

        setListItemLimit(data.value as number);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {

        const activePage: number = data?.activePage as number ?? 1;

        setListOffset((activePage - 1) * listItemLimit);
    };

    const getPaginatedRoleList = (roleListToPaginate: RolesMemberInterface[]): RolesMemberInterface[] => {

        return roleListToPaginate?.length >= 0 ? roleListToPaginate.slice(listOffset, listOffset + listItemLimit) : [];
    };


    const handleSearchByRoleName = (query: string) => {

        setListOffset(0);
        setResetPagination(true);
        setRoleNameSearchQuery(query);
    };

    const handleFilterByRoleAudience = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {

        setListOffset(0);
        setResetPagination(true);
        setRoleAudienceFilter(data.value as string);
    };

    const handleSearchQueryClear = () => {

        setTriggerClearQuery(true);
        setRoleNameSearchQuery(null);
    };

    /**
     * Shows list placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if ((roleNameSearchQuery || roleAudienceFilter) && finalRoleList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${ componentId }-search-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.roles.readOnlyList.emptyPlaceholders.searchAndFilter.title") }
                    subtitle={ [
                        t("console:manage.features.roles.readOnlyList.emptyPlaceholders.searchAndFilter.subtitles.0"),
                        t("console:manage.features.roles.readOnlyList.emptyPlaceholders.searchAndFilter.subtitles.1")
                    ] }
                />
            );
        }

        if (finalRoleList?.length === 0) {
            return emptyRolesListPlaceholder;
        }

        return null;
    };

    /**
     * Resolves data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (role: RolesMemberInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-componentid={ `${ componentId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ role.display }
                                    size="mini"
                                    data-componentid={ `${ componentId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-componentid={ `${ componentId }-item-image` }
                        />
                        <Header.Content>
                            { role?.display }
                        </Header.Content>
                    </Header>
                ),
                title: t("console:manage.features.roles.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "audience",
                id: "audience",
                key: "audience",
                render: (role: RolesMemberInterface) => (
                    <Label size="mini">
                        { role.audienceType }
                        {
                            role.audienceType.toUpperCase() === RoleAudienceTypes.APPLICATION
                                ? ` | ${role.audienceDisplay} `
                                : ""
                        }
                    </Label>
                ),
                title: (
                    <div className="pl-3">
                        { t("console:manage.features.roles.list.columns.audience") }
                    </div>
                )
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: null
            }
        ];
    };


    return (
        <ListLayout
            advancedSearch={ (
                <AdvancedSearchWithBasicFilters
                    data-componentid={ `${componentId}-list-advanced-search` }
                    onFilter={ handleSearchByRoleName }
                    disableSearchFilterDropdown={ true }
                    filterAttributeOptions={ [
                        {
                            key: 0,
                            text: t("console:manage.features.roles.list.filterAttirbutes.name"),
                            value: "displayName"
                        }
                    ] }
                    filterAttributePlaceholder={
                        t("console:manage.features.roles.advancedSearch.form.inputs.filterAttribute." +
                            "placeholder")
                    }
                    filterConditionsPlaceholder={
                        t("console:manage.features.roles.advancedSearch.form.inputs.filterCondition" +
                            ".placeholder")
                    }
                    filterValuePlaceholder={
                        t("console:manage.features.roles.advancedSearch.form.inputs.filterValue" +
                            ".placeholder")
                    }
                    placeholder={ t("console:manage.features.roles.advancedSearch.placeholder") }
                    defaultSearchAttribute="displayName"
                    defaultSearchOperator= { DEFAULT_SEARCH_OPERATOR }
                />
            ) }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            onPageChange={ handlePaginationChange }
            showTopActionPanel={ true }
            rightActionPanel={
                (
                    <Dropdown
                        data-componentid={ `${componentId}-list-filters-dropdown` }
                        selection
                        options={ filterOptions }
                        placeholder= { t("console:manage.features.roles.list.buttons.filterDropdown") }
                        onChange={ handleFilterByRoleAudience }
                    />
                )
            }
            showPagination={ filteredRoleList?.length > 0 }
            totalPages={ Math.ceil(filteredRoleList?.length / listItemLimit) }
            totalListSize={ filteredRoleList?.length }
            isLoading={ isLoading }
            resetPagination={ resetPagination }
        >
            <DataTable<RolesMemberInterface>
                loadingStateOptions={ { imageType: "square" } }
                columns={ resolveTableColumns() }
                data={ finalRoleList }
                onRowClick={ () => { return; } }
                placeholders={ showPlaceholders() }
                data-componentid={ componentId }
            />
        </ListLayout>
    );
};

/**
 * Default props for the component.
 */
ReadOnlyRoleList.defaultProps = {
    "data-componentid": "role-mgt-roles-list"
};
