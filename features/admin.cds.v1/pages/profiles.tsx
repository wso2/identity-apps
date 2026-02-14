/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, LinkButton, ListLayout, PageLayout } from "@wso2is/react-components";
import React, {
    Dispatch,
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DropdownProps, PaginationProps } from "semantic-ui-react";
import { AdvancedSearchWithMultipleFilters } from "../components/advanced-search-with-multiple-filters";
import ProfilesList from "../components/profile-list";
import { useCDSProfiles } from "../hooks/use-profiles";
import { ProfileListItem } from "../models/profiles";

const DEFAULT_PAGE_SIZE: number = 10;

const DEFAULT_LIST_FIELDS: string[] = [
    "identity_attributes.username",
    "identity_attributes.givenname",
    "identity_attributes.lastname"
];

const ProfilesPage: FunctionComponent = (): ReactElement => {

    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    // Cursor pagination state
    const [ pageSize, setPageSize ] = useState<number>(DEFAULT_PAGE_SIZE);
    const [ activePage, setActivePage ] = useState<number>(1);
    const [ currentCursor, setCurrentCursor ] = useState<string | null>(null);

    // Fetch profiles with cursor pagination and search query
    const { data, error, isLoading, mutate } = useCDSProfiles({
        attributes: DEFAULT_LIST_FIELDS,
        cursor: currentCursor,
        filter: searchQuery || undefined,
        page_size: pageSize
    });

    const profileList: ProfileListItem[] = data?.profiles ?? [];
    const nextCursor: string | null = data?.pagination?.next_cursor ?? null;
    const previousCursor: string | null = data?.pagination?.previous_cursor ?? null;

    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    /**
     * Extracts a user-friendly error message from the API error response.
     */
    const getErrorMessage = (err: any, fallback: string): string => {
        const description: any = err?.response?.data?.message;

        if (description) {
            return String(description);
        }

        const firstError: any = err?.response?.data?.errors?.[0]?.description;

        if (firstError) {
            return String(firstError);
        }

        return fallback;
    };

    // Handle errors
    useEffect(() => {
        if (!error) return;

        handleAlerts({
            description: getErrorMessage(error,
                t("customerDataService:profiles.list.notifications.fetchProfiles.error.description")
            ),
            level: AlertLevels.ERROR,
            message: t("customerDataService:profiles.list.notifications.fetchProfiles.error.message")
        });
    }, [ error ]);

    // Reset to first page when search query or page size changes
    useEffect(() => {
        setCurrentCursor(null);
        setActivePage(1);
    }, [ searchQuery, pageSize ]);

    const handleRuleSearch = (query: string): void => {
        setSearchQuery(query);
    };

    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setTriggerClearQuery(!triggerClearQuery);
        setCurrentCursor(null);
        setActivePage(1);
    };

    const handleItemsPerPageChange = (_: any, data: DropdownProps): void => {
        setPageSize(data.value as number);
    };

    const showPlaceholders = (): ReactElement | null => {
        // When search returns empty
        if (searchQuery && !isLoading && profileList.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            { t("customerDataService:profiles.list.placeholders.emptySearch.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("customerDataService:profiles.list.placeholders.emptySearch.title") }
                    subtitle={ t("customerDataService:profiles.list.placeholders.emptySearch.subtitle") }
                />
            );
        }

        // When list is empty (no profiles at all)
        if (!searchQuery && !isLoading && profileList.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("customerDataService:profiles.list.placeholders.emptyList.title") }
                    subtitle={ t("customerDataService:profiles.list.placeholders.emptyList.subtitle") }
                />
            );
        }

        return null;
    };

    const handlePaginationChange = (_: any, data: PaginationProps): void => {
        const targetPage: number = data.activePage as number;

        if (targetPage === activePage) {
            return;
        }

        if (targetPage > activePage) {
            if (!nextCursor) return;
            setCurrentCursor(nextCursor);
            setActivePage(targetPage);

            return;
        }

        if (targetPage < activePage) {
            if (!previousCursor) return;
            setCurrentCursor(previousCursor);
            setActivePage(targetPage);
        }
    };

    const hasNext: boolean = !!nextCursor;
    const hasPrev: boolean = !!previousCursor;

    /**
     * Cursor pagination has no total pages.
     * Keep ListLayout pagination working by exposing a "virtual" totalPages.
     */
    const virtualTotalPages: number = useMemo(() => {
        return activePage + (hasNext ? 1 : 0);
    }, [ activePage, hasNext ]);

    return (
        <PageLayout
            title={ t("customerDataService:profiles.page.title") }
            pageTitle={ t("customerDataService:profiles.page.pageTitle") }
            description={ t("customerDataService:profiles.page.description") }
            data-testid="profiles-page-layout"
        >
            <ListLayout
                currentListSize={ profileList?.length ?? 0 }
                listItemLimit={ pageSize }
                onItemsPerPageDropdownChange={ handleItemsPerPageChange }
                onPageChange={ handlePaginationChange }
                totalPages={ virtualTotalPages }
                totalListSize={ (activePage - 1) * pageSize + (profileList?.length ?? 0) }
                showPagination={ true }
                isLoading={ isLoading }
                data-testid="profiles-list-layout"
                paginationOptions={ {
                    disableNextButton: !hasNext,
                    disablePreviousButton: !hasPrev,
                    showItemsPerPageDropdown: true
                } }
                advancedSearch={
                    (<AdvancedSearchWithMultipleFilters
                        onFilter={ handleRuleSearch }
                        placeholder={ t("customerDataService:profiles.list.search.placeholder") }
                        defaultSearchAttribute="profile_id"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        scopes={ [ "identity_attributes", "traits", "application_data" ] }
                    />)
                }
            >
                { showPlaceholders() ?? (
                    <ProfilesList
                        profiles={ profileList }
                        isLoading={ isLoading }
                        onRefresh={ () => mutate() }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                    />
                ) }
            </ListLayout>
        </PageLayout>
    );
};

export default ProfilesPage;
