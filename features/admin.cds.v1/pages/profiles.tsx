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

import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { PageLayout, ListLayout, EmptyPlaceholder } from "@wso2is/react-components";
import { useDispatch } from "react-redux";
import { AlertInterface, AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AdvancedSearchWithMultipleFilters,
    FilterAttributeOption
} from "../components/advanced-search-with-multipe-filters";
import { DropdownProps, PaginationProps } from "semantic-ui-react";
import ProfilesList from "../components/profile-list";
import { ProfileModel, ProfilesListResponse } from "../models/profiles";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { fetchProfiles } from "../api/profiles";
import { ProfileSchemaGroupedScope, ProfileSchemaScope } from "../models/profile-attributes";
import {
    fetchProfileSchemaByScope,
    toAttributeDropdownOptions
} from "../api/profile-attributes";
import { LinkButton } from "@wso2is/react-components";

const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_LIST_FIELDS: string[] = [
    "identity_attributes.username",
    "identity_attributes.givenname",
    "identity_attributes.lastname"
];

const SCOPES: ProfileSchemaGroupedScope[] = [
    "identity_attributes",
    "traits",
    "application_data"
];

const ProfilesPage: FunctionComponent = (): ReactElement => {

    const dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ profileList, setProfileList ] = useState<ProfileModel[]>([]);
    const [ error, setError ] = useState<any>(null);

    // Cursor pagination state.
    const [ pageSize, setPageSize ] = useState<number>(DEFAULT_PAGE_SIZE);
    const [ activePage, setActivePage ] = useState<number>(1);

    const [ currentCursor, setCurrentCursor ] = useState<string | null>(null);
    const [ nextCursor, setNextCursor ] = useState<string | null>(null);
    const [ previousCursor, setPreviousCursor ] = useState<string | null>(null);

    const [ returnedCount, setReturnedCount ] = useState<number>(0);

    // ✅ Advanced search dropdown options (scoped)
    const [ filterAttributeOptions, setFilterAttributeOptions ] = useState<FilterAttributeOption[]>([]);
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    // ✅ Fetch schema attributes ONCE (per scope)
    useEffect(() => {
        const fetchSchemaAttributes = async () => {
            try {
                const optionsByScope = await Promise.all(
                    SCOPES.map(async (scope) => {
                        const attrs = await fetchProfileSchemaByScope(scope);
                        return toAttributeDropdownOptions(scope, attrs) as FilterAttributeOption[];
                    })
                );

                setFilterAttributeOptions(optionsByScope.flat());
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("Failed to fetch profile schema attributes", err);
            }
        };

        fetchSchemaAttributes();
    }, []);

    const fetchProfilesPage = async (cursor: string | null, page: number): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const res: ProfilesListResponse = await fetchProfiles({
                filter: searchQuery || undefined,
                page_size: pageSize,
                cursor,
                attributes: DEFAULT_LIST_FIELDS
            });

            const list = res?.profiles ?? [];

            setProfileList(list);

            setReturnedCount(res?.pagination?.count ?? list.length);
            setNextCursor(res?.pagination?.next_cursor ?? null);
            setPreviousCursor(res?.pagination?.previous_cursor ?? null);

            setCurrentCursor(cursor);
            setActivePage(page);

        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Failed to fetch profiles", err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load.
    useEffect(() => {
        fetchProfilesPage(null, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-fetch when filter / page size changes.
    useEffect(() => {
        fetchProfilesPage(null, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ searchQuery, pageSize ]);

    // Error alert.
    useEffect(() => {
        if (!error) return;

        handleAlerts({
            level: AlertLevels.ERROR,
            message: "Failed to load profiles",
            description: error?.response?.data?.description ?? "An unexpected error occurred."
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ error ]);

    const handleRuleSearch = (query: string): void => {
        setSearchQuery(query);
    };

    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setTriggerClearQuery(!triggerClearQuery);
        fetchProfilesPage(null, 1);
    };

    const handleItemsPerPageChange = (_: any, data: DropdownProps) => {
        setPageSize(data.value as number);
    };

    const loadAttributesForScope = async (scope: string): Promise<FilterAttributeOption[]> => {
        if (scope !== "identity_attributes" && scope !== "traits" && scope !== "application_data") {
            return [];
        }
    
        const attrs = await fetchProfileSchemaByScope(scope as any);
    
        // IMPORTANT: make sure this helper does NOT override `scope`
        // It should use the `scope` param you pass in.
        return toAttributeDropdownOptions(scope, attrs) as FilterAttributeOption[];
    };

    const showPlaceholders = (): ReactElement | null => {
        // When search returns empty.
        if (searchQuery && !isLoading && profileList.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            Clear search
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title="No matching profiles"
                    subtitle={ [
                        "We couldn’t find any profiles matching your search.",
                        "Try changing filters or clearing the search."
                    ] }
                />
            );
        }
    
        // When list is empty (no profiles at all).
        if (!searchQuery && !isLoading && profileList.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title="No customer profiles found"
                    subtitle={ [] }
                />
            );
        }
    
        return null;
    };

    const handlePaginationChange = (_: any, data: PaginationProps) => {
        const targetPage = data.activePage as number;

        if (targetPage === activePage) {
            return;
        }

        // Going next.
        if (targetPage > activePage) {
            if (!nextCursor) return;
            fetchProfilesPage(nextCursor, targetPage);
            return;
        }

        // Going prev.
        if (targetPage < activePage) {
            if (!previousCursor) return;
            fetchProfilesPage(previousCursor, targetPage);
        }
    };

    const hasNext = !!nextCursor;
    const hasPrev = !!previousCursor;

    /**
     * Cursor pagination has no total pages.
     * Keep ListLayout pagination working by exposing a "virtual" totalPages.
     */
    const virtualTotalPages = useMemo(() => {
        return activePage + (hasNext ? 1 : 0);
    }, [ activePage, hasNext ]);

    return (
        <PageLayout
            title="Customer Profiles"
            pageTitle="Customer Profiles"
            description="View and manage unified customer profile data."
            data-testid="profiles-page-layout"
        >
            {profileList.length === 0 && !isLoading ? (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title="No Customer profiles found"
                    subtitle=""
                />
            ) : (
                <ListLayout
                    currentListSize={ profileList?.length ?? 0 }
                    listItemLimit={ pageSize }
                    onItemsPerPageDropdownChange={ handleItemsPerPageChange }
                    onPageChange={ handlePaginationChange }

                    // Virtual cursor pagination.
                    totalPages={ virtualTotalPages }
                    totalListSize={ (activePage - 1) * pageSize + (profileList?.length ?? 0) }

                    showPagination={ true }
                    isLoading={ isLoading }
                    data-testid="profiles-list-layout"
                    paginationOptions={{
                        disableNextButton: !hasNext,
                        disablePreviousButton: !hasPrev,
                        showItemsPerPageDropdown: true
                    }}
                    advancedSearch={
                        <AdvancedSearchWithMultipleFilters
                        onFilter={ handleRuleSearch }
                        onFetchAttributesByScope={ loadAttributesForScope }
                        placeholder="Search profiles"
                        defaultSearchAttribute="profile_id"
                        defaultSearchOperator="co"
                        triggerClearQuery={ triggerClearQuery }
                        scopes={ [ "identity_attributes", "traits", "application_data" ] }
                    />
                    
                    }
                >
                    { showPlaceholders() ?? (
                        <ProfilesList
                            profiles={ profileList }
                            isLoading={ isLoading }
                            onRefresh={ () => fetchProfilesPage(currentCursor, activePage) }
                            onSearchQueryClear={ handleSearchQueryClear }
                            searchQuery={ searchQuery }
                        />
                    ) }
                </ListLayout>
            )}
        </PageLayout>
    );
};

export default ProfilesPage;
