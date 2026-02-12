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
import { fetchProfileSchemaByScope, toAttributeDropdownOptions } from "../api/profile-attributes";
import { fetchCDSProfiles } from "../api/profiles";
import {
    AdvancedSearchWithMultipleFilters,
    FilterAttributeOption
} from "../components/advanced-search-with-multipe-filters";

import ProfilesList from "../components/profile-list";
import { ProfileSchemaGroupedScope, ProfileSchemaScopeResponse } from "../models/profile-attributes";
import { ProfileListItem, ProfileModel, ProfilesListResponse } from "../models/profiles";

const DEFAULT_PAGE_SIZE:number = 10;

const DEFAULT_LIST_FIELDS: string[] = [
    "identity_attributes.username",
    "identity_attributes.givenname",
    "identity_attributes.lastname"
];

// const SCOPES: ProfileSchemaGroupedScope[] = [
//     "identity_attributes",
//     "traits",
//     "application_data"
// ];

const ProfilesPage: FunctionComponent = (): ReactElement => {

    const dispatch:Dispatch<any> = useDispatch();
    const { t } = useTranslation();

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

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    /**
     * VC-style API rejects with AxiosError. Keep parsing here, but messages come from i18n.
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

    // /**
    //  * NOTE: No need to pre-fetch schema "once".
    //  * AdvancedSearch asks attributes lazily by scope via `loadAttributesForScope`.
    //  */
    // useEffect(() => {
    //     const warmup = async () => {
    //         try {
    //             await Promise.all(SCOPES.map((scope:ProfileSchemaGroupedScope) => fetchProfileSchemaByScope(scope)));
    //         } catch (err) {
    //             // eslint-disable-next-line no-console
    //             console.error("Failed to warm up schema scopes", err);
    //         }
    //     };
    //
    //     warmup();
    // }, []);


    const fetchProfilesPage = async (cursor: string | null, page: number): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const res: ProfilesListResponse = await fetchCDSProfiles({
                attributes: DEFAULT_LIST_FIELDS,
                cursor,
                filter: searchQuery || undefined,
                page_size: pageSize
            });

            const list:ProfileListItem[] = res?.profiles ?? [];

            setProfileList(list);

            setNextCursor(res?.pagination?.next_cursor ?? null);
            setPreviousCursor(res?.pagination?.previous_cursor ?? null);

            setCurrentCursor(cursor);
            setActivePage(page);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfilesPage(null, 1);
    }, []);

    // Re-fetch when filter / page size changes.
    useEffect(() => {
        fetchProfilesPage(null, 1);
    }, [ searchQuery, pageSize ]);

    useEffect(() => {
        if (!error) return;

        handleAlerts({
            description: getErrorMessage(error,
                t("customerDataService:profiles.notifications.fetchProfiles.error.description")
            ),
            level: AlertLevels.ERROR,
            message: t("customerDataService:profiles.notifications.fetchProfiles.error.message")
        });
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

        const attrs:ProfileSchemaScopeResponse = await fetchProfileSchemaByScope(scope as any);

        return toAttributeDropdownOptions(scope, attrs) as FilterAttributeOption[];
    };

    const showPlaceholders = (): ReactElement | null => {
        // When search returns empty.
        if (searchQuery && !isLoading && profileList.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            { t("customerDataService:profiles.placeholders.emptySearch.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("customerDataService:profiles.placeholders.emptySearch.title") }
                    subtitle={ t("customerDataService:profiles.placeholders.emptySearch.subtitle") }
                />
            );
        }

        // When list is empty (no profiles at all).
        if (!searchQuery && !isLoading && profileList.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("customerDataService:profiles.placeholders.emptyList.title") }
                    subtitle={ t("customerDataService:profiles.placeholders.emptyList.subtitle") }
                />
            );
        }

        return null;
    };

    const handlePaginationChange = (_: any, data: PaginationProps) => {
        const targetPage:number = data.activePage as number;

        if (targetPage === activePage) {
            return;
        }

        if (targetPage > activePage) {
            if (!nextCursor) return;
            fetchProfilesPage(nextCursor, targetPage);

            return;
        }

        if (targetPage < activePage) {
            if (!previousCursor) return;
            fetchProfilesPage(previousCursor, targetPage);
        }
    };

    const hasNext:boolean = !!nextCursor;
    const hasPrev:boolean = !!previousCursor;

    /**
     * Cursor pagination has no total pages.
     * Keep ListLayout pagination working by exposing a "virtual" totalPages.
     */
    const virtualTotalPages:number = useMemo(() => {
        return activePage + (hasNext ? 1 : 0);
    }, [ activePage, hasNext ]);

    return (
        <PageLayout
            title={ t("customerDataService:profiles.page.title") }
            pageTitle={ t("customerDataService:profiles.page.heading") }
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
                        onFetchAttributesByScope={ loadAttributesForScope }
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
                        onRefresh={ () => fetchProfilesPage(currentCursor, activePage) }
                        onSearchQueryClear={ handleSearchQueryClear }
                        searchQuery={ searchQuery }
                    />
                ) }
            </ListLayout>
        </PageLayout>
    );
};

export default ProfilesPage;
