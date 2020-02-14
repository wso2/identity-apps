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

import { PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { getApplicationList } from "../api";
import { ApplicationList, ApplicationSearch } from "../components";
import { history } from "../helpers/history";
import { ListLayout, PageLayout } from "../layouts";
import { ApplicationListInterface } from "../models";

const APPLICATIONS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
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

const DEFAULT_APP_LIST_ITEM_LIMIT: number = 10;

/**
 * Overview page.
 *
 * @return {JSX.Element}
 */
export const ApplicationsPage = (): JSX.Element => {

    const [ searchQuery, setSearchQuery ] = useState("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        APPLICATIONS_LIST_SORTING_OPTIONS[ 0 ]
    );
    const [ appList, setAppList ] = useState<ApplicationListInterface>({});
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(DEFAULT_APP_LIST_ITEM_LIMIT);

    const getAppLists = (limit: number, offset: number) => {
        getApplicationList(limit, offset)
            .then((response) => {
                setAppList(response);
            })
            .catch((error) => {
                // TODO add notifications
            });
    };

    useEffect(() => {
        getAppLists(listItemLimit, listOffset);
    }, [ listOffset, listItemLimit ]);

    const handleListSortingStrategyOnChange = (event: React.SyntheticEvent<HTMLElement>,
                                               data: DropdownProps) => {
        setListSortingStrategy(_.find(APPLICATIONS_LIST_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    /**
     * Handles the `onFilter` callback action from the
     * application search component.
     *
     * @param {string} query - Search query.
     */
    const handleApplicationFilter = (query: string): void => {
        setSearchQuery(query);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    return (
        <PageLayout
            title="Applications"
            description="Create applications based on templates and configure authentication."
            showBottomDivider={ true }
        >
            <ListLayout
                advancedSearch={ <ApplicationSearch onFilter={ handleApplicationFilter }/> }
                currentListSize={ appList.count }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ handleListSortingStrategyOnChange }
                rightActionPanel={
                    (
                        <PrimaryButton
                            onClick={ () => {
                                history.push("/applications/templates");
                            } }
                        >
                            <Icon name="add"/>Add application
                        </PrimaryButton>
                    )
                }
                showPagination={ true }
                sortOptions={ APPLICATIONS_LIST_SORTING_OPTIONS }
                sortStrategy={ listSortingStrategy }
                totalPages={ Math.ceil(appList.totalResults / listItemLimit) }
                totalListSize={ appList.totalResults }
            >
                <ApplicationList list={ appList } />
            </ListLayout>
        </PageLayout>
    );
};
