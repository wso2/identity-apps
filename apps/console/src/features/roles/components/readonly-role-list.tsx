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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import {
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    RolesInterface
} from "@wso2is/core/models";
import { RolesMemberInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    DataTable,
    EmptyPlaceholder,
    LinkButton, ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownProps, Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { UIConstants } from "../../core";
import { AdvancedSearchWithBasicFilters } from "../../core/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "../../core/configs/ui";
import { RoleAudienceTypes } from "../constants/role-constants";

interface ReadOnlyRoleListProps extends LoadableComponentInterface, IdentifiableComponentInterface {
    /**
     * Roles list.
     */
    totalRoleList: RolesMemberInterface[];
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Is the current org a sub org.
     */
    isSubOrg?: boolean;
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
        isSubOrg,
        onSearchQueryClear,
        totalRoleList,
        searchQuery,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ roleList, setRoleList ] = useState<RolesMemberInterface[]>(undefined);
    const [ listOffset, setListOffset ] = useState<number>(0);

    useEffect(() => {
        if (totalRoleList.length === 0) {
            return;
        }

        setRoleList(getPaginatedRoleList());
        setIsLoading(false);
    }, [ totalRoleList ]);


    useEffect(() => {
        setRoleList(getPaginatedRoleList());
    }, [ listOffset, listItemLimit ]);


    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        const activePage: number = data?.activePage as number ?? 1;

        // setCurrentPage(activePage);
        setListOffset((activePage - 1) * listItemLimit);

    };

    const getPaginatedRoleList = (): RolesMemberInterface[] => {
        // return totalRoleList.slice((currentPage - 1) * listItemLimit, currentPage * listItemLimit);
        return totalRoleList.slice(listOffset, listOffset + listItemLimit);
    };

    /**
     * Shows list placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && totalRoleList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${ componentId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-componentid={ `${ componentId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("console:manage.features.roles.list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.roles.list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("console:manage.features.roles.list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("console:manage.features.roles.list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (totalRoleList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${ componentId }-empty-list-empty-placeholder` }
                    action={ !isSubOrg && (
                        <Show when={ AccessControlConstants.ROLE_WRITE }>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ !isSubOrg && t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.title",
                        { type: "role" }) }
                    subtitle={ isSubOrg
                        ? [
                            t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                { type: "roles" })
                        ]
                        : [
                            t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                { type: "roles" }),
                            t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.1",
                                { type: "role" }),
                            t("console:manage.features.roles.list.emptyPlaceholders.emptyRoleList.subtitles.2",
                                { type: "role" })
                        ]
                    }
                />
            );
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
                    onFilter={ () => {console.log("filter");}  }
                    filterAttributeOptions={ [
                        {
                            key: 0,
                            text: t("console:manage.features.roles.list.filterAttirbutes.name"),
                            value: "displayName"
                        },
                        {
                            key: 1,
                            text: t("console:manage.features.roles.list.filterAttirbutes.audience"),
                            value: "audience.type"
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
                    defaultSearchOperator="co"
                    // triggerClearQuery={ () => {console.log("clear query");} }
                />
            ) }
            currentListSize={ roleList?.length }
            listItemLimit={ listItemLimit }
            onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            onPageChange={ handlePaginationChange }
            // showTopActionPanel={ (rolesList?.totalResults > 0 || filterBy?.length !== 0) }
            showPagination={ totalRoleList?.length > 0 }
            totalPages={ Math.ceil(totalRoleList?.length / listItemLimit) }
            totalListSize={ totalRoleList?.length }
            isLoading={ isLoading }
        >
            <DataTable<RolesMemberInterface>
                loadingStateOptions={ { imageType: "square" } }
                columns={ resolveTableColumns() }
                data={ roleList }
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
