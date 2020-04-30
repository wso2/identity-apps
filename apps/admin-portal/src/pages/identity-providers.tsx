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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, MouseEvent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { getIdentityProviderList } from "../api";
import { AdvancedSearchWithBasicFilters, IdentityProviderList } from "../components";
import { EmptyPlaceholderIllustrations } from "../configs";
import { IdentityProviderConstants } from "../constants";
import { history } from "../helpers";
import { ListLayout, PageLayout } from "../layouts";
import { IdentityProviderListResponseInterface } from "../models";

const IDENTITY_PROVIDER_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: "Name",
        value: "name"
    },
    {
        key: 2,
        text: "Type",
        value: "type"
    },
    {
        key: 3,
        text: "Created date",
        value: "createdDate"
    },
    {
        key: 4,
        text: "Last updated",
        value: "lastUpdated"
    }
];

// TODO: Calculate based on the screen dimensions.
const DEFAULT_IDP_LIST_ITEM_LIMIT = 10;

/**
 * Overview page.
 *
 * @return {React.ReactElement}
 */
export const IdentityProvidersPage: FunctionComponent<{}> = (): ReactElement => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        IDENTITY_PROVIDER_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(DEFAULT_IDP_LIST_ITEM_LIMIT);
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(false);

    /**
     * Retrieves the list of identity providers.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getIdPList = (limit: number, offset: number, filter: string): void => {
        setIdPListRequestLoading(true);

        getIdentityProviderList(limit, offset, filter)
            .then((response) => {
                setIdPList(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "An error occurred while retrieving identity providers"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while retrieving identity providers",
                    level: AlertLevels.ERROR,
                    message: "Retrieval Error"
                }));
            })
            .finally(() => {
                setIdPListRequestLoading(false);
            });
    };

    /**
     * Called on every `listOffset` & `listItemLimit` change.
     */
    useEffect(() => {
        getIdPList(listItemLimit, listOffset, null);
    }, [ listOffset, listItemLimit ]);

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (event: SyntheticEvent<HTMLElement>,
                                               data: DropdownProps): void => {
        setListSortingStrategy(_.find(IDENTITY_PROVIDER_LIST_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    /**
     * Handles the `onFilter` callback action from the
     * identity provider search component.
     *
     * @param {string} query - Search query.
     */
    const handleIdentityProviderFilter = (query: string): void => {
        setSearchQuery(query);
        getIdPList(listItemLimit, listOffset, query);
    };

    /**
     * Handles the pagination change.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {PaginationProps} data - Pagination component data.
     */
    const handlePaginationChange = (event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    /**
     * Handles per page dropdown page.
     *
     * @param {React.MouseEvent<HTMLAnchorElement>} event - Mouse event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (event: MouseEvent<HTMLAnchorElement>,
                                              data: DropdownProps): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles identity provider delete action.
     */
    const handleIdentityProviderDelete = (): void => {
        getIdPList(listItemLimit, listOffset, null);
    };

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        getIdPList(listItemLimit, listOffset, null);
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>Clear search query</LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ "No results found" }
                    subtitle={ [
                        `We couldn't find any results for ${ searchQuery }`,
                        "Please try a different search term."
                    ] }
                />
            );
        }

        return (
            <EmptyPlaceholder
                action={ (
                    <PrimaryButton
                        onClick={ (): void => {
                            history.push(IdentityProviderConstants.PATHS.get("IDENTITY_PROVIDER_TEMPLATES"));
                        } }
                    >
                        <Icon name="add"/>New Identity Provider
                    </PrimaryButton>
                ) }
                image={ EmptyPlaceholderIllustrations.newList }
                imageSize="tiny"
                title={ "Create an Identity Provider" }
                subtitle={ [
                    "There are currently no identity providers available.",
                    "You can create a new identity provider easily by using the",
                    "predefined templates."
                ] }
            />
        );
    };

    return (
        <PageLayout
            title="Identity Providers"
            description="Create and manage identity providers based on templates and configure authentication."
            showBottomDivider={ true }
        >
            <ListLayout
                advancedSearch={
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleIdentityProviderFilter  }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("devPortal:components.idp.advancedSearch.form.inputs.filterAttribute.placeholder")
                        }
                        filterConditionsPlaceholder={
                            t("devPortal:components.idp.advancedSearch.form.inputs.filterCondition" +
                                ".placeholder")
                        }
                        filterValuePlaceholder={
                            t("devPortal:components.idp.advancedSearch.form.inputs.filterValue" +
                                ".placeholder")
                        }
                        placeholder={ t("devPortal:components.idp.advancedSearch.placeholder") }
                        defaultSearchAttribute="name"
                        defaultSearchOperator="co"
                    />
                }
                currentListSize={ idpList.count }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                rightActionPanel={
                    (
                        <PrimaryButton
                            onClick={ (): void => {
                                history.push(IdentityProviderConstants.PATHS.get("IDENTITY_PROVIDER_TEMPLATES"));
                            } }
                        >
                            <Icon name="add"/>New Identity Provider
                        </PrimaryButton>
                    )
                }
                showPagination={ true }
                showTopActionPanel={ !(!searchQuery && idpList?.totalResults <= 0) }
                sortOptions={ IDENTITY_PROVIDER_LIST_SORTING_OPTIONS }
                sortStrategy={ listSortingStrategy }
                totalPages={ Math.ceil(idpList.totalResults / listItemLimit) }
                totalListSize={ idpList.totalResults }
            >
                {
                    (idpList?.totalResults > 0 ||
                        idpList?.identityProviders instanceof Array && idpList.identityProviders.length > 0) ?
                        <IdentityProviderList
                            list={ idpList }
                            onIdentityProviderDelete={ handleIdentityProviderDelete }
                        />
                        : !isIdPListRequestLoading && showPlaceholders()
                }
            </ListLayout>
        </PageLayout>
    );
};
