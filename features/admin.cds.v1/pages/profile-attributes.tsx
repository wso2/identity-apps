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

import Button from "@oxygen-ui/react/Button";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EmptyPlaceholder,
    ListLayout,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { useFullProfileSchema } from "../hooks/use-profile-schema";
import { useProfileSchemaByScope } from "../hooks/use-profile-schema-by-scope";
import { toProfileSchemaListingRows } from "../utils/profile-attribute-utils";
import { ProfileSchemaListing } from "../components/profile-attributes";
import type { ProfileSchemaListingRow, SchemaListingScope } from "../models/profile-attribute-listing";
import type { ProfileSchemaAttribute } from "../models/profile-attributes";

// =============================================================================
// Constants
// =============================================================================

const SORT_BY_NAME: string = "display_name";
const SORT_BY_SCOPE: string = "scope";

const SCOPE_ORDER: Record<string, number> = {

    application_data: 1,
    core: 0,
    identity_attributes: 2,
    traits: 3
};

const SEARCHABLE_SCOPES: SchemaListingScope[] = [
    "identity_attributes",
    "traits",
    "application_data"
];

// =============================================================================
// Local types
// =============================================================================

interface BasicFilterInterface {
    attribute: string;
    operator: string;
    value: string;
}

type ProfileSchemaPagePropsInterface = IdentifiableComponentInterface;

// =============================================================================
// Utilities (module-level — no closures over component state)
// =============================================================================

/**
 * Parses a basic filter query string into its constituent parts.
 * Expected format: `<attribute> <operator> <value>`
 */
const parseBasicFilterQuery = (query: string): BasicFilterInterface | null => {
    const trimmed: string = (query ?? "").trim();

    if (!trimmed) return null;

    const parts: string[] = trimmed.split(" ");

    if (parts.length < 3) return null;

    const attribute: string = parts[0]?.trim();
    const operator: string = parts[1]?.trim();
    const value: string = parts.slice(2).join(" ").trim();

    if (!attribute || !operator || !value) return null;

    return { attribute, operator, value };
};

/**
 * Ensures the search value is prefixed with the given scope.
 */
const withScopePrefix = (scope: SchemaListingScope, value: string): string => {
    const v: string = (value ?? "").trim();

    if (!v) return "";

    return v.startsWith(`${scope}.`) ? v : `${scope}.${v}`;
};

/**
 * Converts a raw scope response into listing rows for the given scope.
 */
/**
 * Converts a raw scope response into listing rows for the given scope.
 *
 * - identity_attributes / traits → API returns ProfileSchemaAttribute[]
 * - application_data             → API returns Record<string, ProfileSchemaAttribute[]>
 */
const toRowsFromScopeResponse = (
    scope: SchemaListingScope,
    data: ProfileSchemaAttribute[] | Record<string, ProfileSchemaAttribute[]> | undefined
): ProfileSchemaListingRow[] => {

    if (!data) return [];

    // ── application_data: object keyed by appId ──────────────────────────────
    if (scope === "application_data") {
        const appData = data as Record<string, ProfileSchemaAttribute[]>;

        return Object.entries(appData).flatMap(([ appId, attrs ]) =>
            (attrs ?? []).map((a: ProfileSchemaAttribute): ProfileSchemaListingRow => {
                const fullName: string = a.attribute_name ?? "";
                const withoutScope: string = fullName.startsWith("application_data.")
                    ? fullName.slice("application_data.".length)
                    : fullName;
                const appPrefix: string = `${appId}.`;
                const fieldPath: string = withoutScope.startsWith(appPrefix)
                    ? withoutScope.slice(appPrefix.length)
                    : withoutScope;

                return {
                    attribute_id: a.attribute_id,
                    attribute_name: fullName,
                    belongs_to: appId,
                    chip_label: scope,
                    deletable: true,
                    display_name: fieldPath || fullName,
                    editable: true,
                    id: `${scope}:${a.attribute_id ?? fullName}`,
                    scope
                };
            })
        );
    }

    // ── identity_attributes / traits: flat array ─────────────────────────────
    const attrs = data as ProfileSchemaAttribute[];

    return attrs.map((a: ProfileSchemaAttribute): ProfileSchemaListingRow => {
        const fullName: string = a.attribute_name ?? "";
        const prefix: string = `${scope}.`;
        const display: string = fullName.startsWith(prefix)
            ? fullName.slice(prefix.length)
            : fullName;

        return {
            attribute_id: a.attribute_id,
            attribute_name: fullName,
            belongs_to: undefined,
            chip_label: scope,
            deletable: scope === "traits",
            display_name: display,
            editable: scope !== "identity_attributes",
            id: `${scope}:${a.attribute_id ?? fullName}`,
            scope
        };
    });
};

/**
 * Sorts listing rows by the given field and direction.
 */
const sortRows = (
    rows: ProfileSchemaListingRow[],
    sortByValue: string,
    ascending: boolean
): ProfileSchemaListingRow[] => {
    return [ ...rows ].sort(
        (
            a: ProfileSchemaListingRow,
            b: ProfileSchemaListingRow
        ): number => {
            if (sortByValue === SORT_BY_SCOPE) {
                const aOrder: number = SCOPE_ORDER[a.scope] ?? 99;
                const bOrder: number = SCOPE_ORDER[b.scope] ?? 99;

                if (aOrder !== bOrder) {
                    return ascending ? aOrder - bOrder : bOrder - aOrder;
                }

                // Tie-breaker: name within the same scope.
                const aName: string = (a.display_name ?? "").toLowerCase();
                const bName: string = (b.display_name ?? "").toLowerCase();

                if (aName < bName) return ascending ? -1 : 1;
                if (aName > bName) return ascending ? 1 : -1;

                return 0;
            }

            const aVal: string = (
                (a[sortByValue as keyof ProfileSchemaListingRow] as string) ?? ""
            ).toString().toLowerCase();
            const bVal: string = (
                (b[sortByValue as keyof ProfileSchemaListingRow] as string) ?? ""
            ).toString().toLowerCase();

            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;

            // Tie-breaker: scope order.
            const aOrder: number = SCOPE_ORDER[a.scope] ?? 99;
            const bOrder: number = SCOPE_ORDER[b.scope] ?? 99;

            return aOrder - bOrder;
        }
    );
};

// =============================================================================
// Component
// =============================================================================

/**
 * Profile schema listing page.
 *
 * @param props - Props injected to the component.
 * @returns The profile schema page.
 */
const ProfileSchemaPage: FunctionComponent<ProfileSchemaPagePropsInterface> = (
    props: ProfileSchemaPagePropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "profile-schema-page"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    // -------------------------------------------------------------------------
    // Dropdown configs
    // -------------------------------------------------------------------------

    const SORT_BY: DropdownItemProps[] = [
        {
            key: 0,
            text: t("traits:page.sortByName", { defaultValue: "Name" }),
            value: SORT_BY_NAME
        },
        { key: 1, text: "Scope", value: SORT_BY_SCOPE }
    ];

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    const [ offset, setOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT
    );
    const [ sortBy, setSortBy ] = useState<DropdownItemProps>(SORT_BY[0]);
    const [ sortAscending, setSortAscending ] = useState<boolean>(true);
    const [ activeFilter, setActiveFilter ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    // filterRows holds results when a search is active; null means "use full schema".
    const [ filterRows, setFilterRows ] = useState<ProfileSchemaListingRow[] | null>(
        null
    );
    const [ isFiltering, setIsFiltering ] = useState<boolean>(false);
    const [ filterError, setFilterError ] = useState<boolean>(false);

    const isInitialRender: React.MutableRefObject<boolean> = useRef<boolean>(true);

    // -------------------------------------------------------------------------
    // Data — full schema (SWR-cached; used when no search is active)
    // -------------------------------------------------------------------------

    const {
        data: fullSchema,
        isLoading: isLoadingSchema,
        mutate: mutateSchema
    } = useFullProfileSchema();

    const baseRows: ProfileSchemaListingRow[] = useMemo(
        (): ProfileSchemaListingRow[] => {
            if (!fullSchema) return [];

            return toProfileSchemaListingRows(fullSchema);
        },
        [ fullSchema ]
    );

    // -------------------------------------------------------------------------
    // Scoped search — driven by activeFilter (set after debounce in handler)
    // -------------------------------------------------------------------------

    const parsedFilter: BasicFilterInterface | null = useMemo(
        (): BasicFilterInterface | null => parseBasicFilterQuery(activeFilter),
        [ activeFilter ]
    );

    // We fire one hook call per scope. shouldFetch is false when no active filter.
    const shouldFetchFilter: boolean = Boolean(parsedFilter);

    const scopeFilterResults: Array<ReturnType<typeof useProfileSchemaByScope>> = [
        useProfileSchemaByScope<ProfileSchemaAttribute[]>(
            "identity_attributes",
            parsedFilter
                ? `${parsedFilter.attribute} ${parsedFilter.operator} ` +
                  `${withScopePrefix("identity_attributes", parsedFilter.value)}`
                : undefined,
            shouldFetchFilter
        ),
        useProfileSchemaByScope<ProfileSchemaAttribute[]>(
            "traits",
            parsedFilter
                ? `${parsedFilter.attribute} ${parsedFilter.operator} ` +
                  `${withScopePrefix("traits", parsedFilter.value)}`
                : undefined,
            shouldFetchFilter
        ),
        useProfileSchemaByScope<ProfileSchemaAttribute[]>(
            "application_data",
            parsedFilter
                ? `${parsedFilter.attribute} ${parsedFilter.operator} ` +
                  `${withScopePrefix("application_data", parsedFilter.value)}`
                : undefined,
            shouldFetchFilter
        )
    ];

    const isFilterLoading: boolean = shouldFetchFilter &&
        scopeFilterResults.some(
            (r: ReturnType<typeof useProfileSchemaByScope>): boolean => r.isLoading
        );

    const hasFilterError: boolean = shouldFetchFilter &&
        scopeFilterResults.some(
            (r: ReturnType<typeof useProfileSchemaByScope>): boolean => Boolean(r.error)
        );

    // Assemble filter rows from all three scope results once loading is done.
    const assembledFilterRows: ProfileSchemaListingRow[] | null = useMemo(
        (): ProfileSchemaListingRow[] | null => {
            if (!shouldFetchFilter) return null;
            if (isFilterLoading) return null;

            return SEARCHABLE_SCOPES.flatMap(
                (scope: SchemaListingScope, index: number): ProfileSchemaListingRow[] => {
                    const data: ProfileSchemaAttribute[] | undefined =
                        scopeFilterResults[index].data as ProfileSchemaAttribute[] | undefined;

                    return toRowsFromScopeResponse(scope, data ?? []);
                }
            );
        },
        // scopeFilterResults are stable references from the hooks — safe to spread here.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ shouldFetchFilter, isFilterLoading, ...scopeFilterResults.map((r) => r.data) ]
    );

    // Alert on filter error.
    useEffect((): void => {
        if (!hasFilterError) return;

        dispatch(
            addAlert({
                description: t(
                    "profileAttributes:notifications.filterProfileAttributes.genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "profileAttributes:notifications.filterProfileAttributes.genericError.message"
                )
            })
        );
    }, [ hasFilterError ]);

    // -------------------------------------------------------------------------
    // Derive active rows (filtered or full) and apply sort
    // -------------------------------------------------------------------------

    const unsortedRows: ProfileSchemaListingRow[] =
        assembledFilterRows ?? baseRows;

    const activeRows: ProfileSchemaListingRow[] = useMemo(
        (): ProfileSchemaListingRow[] => {
            if (isInitialRender.current) return unsortedRows;

            return sortRows(unsortedRows, sortBy.value as string, sortAscending);
        },
        [ unsortedRows, sortBy, sortAscending ]
    );

    // Skip sort on first render to avoid reordering before user interaction.
    useEffect((): void => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
        }
    }, []);

    const paginatedRows: ProfileSchemaListingRow[] = useMemo(
        (): ProfileSchemaListingRow[] =>
            activeRows.slice(offset, offset + listItemLimit),
        [ activeRows, offset, listItemLimit ]
    );

    const isLoading: boolean = isLoadingSchema || isFilterLoading;

    // -------------------------------------------------------------------------
    // Event handlers
    // -------------------------------------------------------------------------

    const handleAddProfileAttribute: () => void = (): void => {
        history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTE_CREATE"));
    };

    const handleItemsPerPageDropdownChange: (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ) => void = (
        _event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
        setOffset(0);
    };

    const handlePaginationChange: (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
    ) => void = (
        _event: React.MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
    ): void => {
        setOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleSortStrategyChange: (
        event: SyntheticEvent<HTMLElement>,
        data: DropdownProps
    ) => void = (
        _event: SyntheticEvent<HTMLElement>,
        data: DropdownProps
    ): void => {
        const selected: DropdownItemProps | undefined = SORT_BY.find(
            (opt: DropdownItemProps): boolean => opt.value === data.value
        );

        if (selected) setSortBy(selected);
    };

    const handleSortOrderChange: (isAscending: boolean) => void = (
        isAscending: boolean
    ): void => {
        setSortAscending(isAscending);
    };

    const handleSchemaFilter: (query: string) => void = (query: string): void => {
        const trimmed: string = (query ?? "").trim();

        if (!trimmed) {
            handleSearchQueryClear();

            return;
        }

        setActiveFilter(trimmed);
        setOffset(0);
    };

    const handleSearchQueryClear: () => void = (): void => {
        setActiveFilter("");
        setTriggerClearQuery((prev: boolean): boolean => !prev);
        setOffset(0);
    };

    const handleRefresh: () => void = (): void => {
        // Revalidate the full schema SWR cache and clear any active filter.
        mutateSchema();
        handleSearchQueryClear();
    };

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    return (
        <PageLayout
            isLoading={ isLoading }
            title={ t("profileAttributes:pageLayout.list.title") }
            pageTitle={ t("profileAttributes:pageLayout.list.title") }
            description={ t("profileAttributes:pageLayout.list.description") }
            data-componentid={ `${componentId}-page-layout` }
            action={
                (
                    <PrimaryButton onClick={ handleAddProfileAttribute} > 
                    <Icon name="add" />
                        { t("profileAttributes:pageLayout.list.primaryAction") }
                    </PrimaryButton>
                )
            }
        >
            { activeRows.length === 0 && !isLoading ? (
                <EmptyPlaceholder
                    action={
                        (
                            <PrimaryButton onClick={ handleAddProfileAttribute} >
                                <Icon name="add" />
                                { t("profileAttributes:pageLayout.list.primaryAction") }
                            </PrimaryButton>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("profileAttributes:placeholders.emptyList.title") }
                    subtitle={ [
                        t("profileAttributes:placeholders.emptyList.subtitles.0")
                    ] }
                    data-componentid={ `${componentId}-empty-placeholder` }
                />
            ) : (
                <ListLayout
                    currentListSize={ paginatedRows.length }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    showPagination={ true }
                    showTopActionPanel={ true }
                    totalPages={ Math.ceil(activeRows.length / listItemLimit) }
                    totalListSize={ activeRows.length }
                    sortOptions={ SORT_BY }
                    sortStrategy={ sortBy }
                    onSortStrategyChange={ handleSortStrategyChange }
                    onSortOrderChange={ handleSortOrderChange }
                    onSearchQueryClear={ handleSearchQueryClear }
                    isLoading={ isLoading }
                    advancedSearch={
                        (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleSchemaFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t(
                                            "profileAttributes:search.filterAttributes.attributeName"
                                        ),
                                        value: "attribute_name"
                                    }
                                ] }
                                disableSearchFilterDropdown={ false }
                                placeholder={ t("profileAttributes:search.placeholder") }
                                defaultSearchAttribute="attribute_name"
                                defaultSearchOperator="sw"
                                filterConditionOptions={ [
                                    { key: 0, text: t("common:startsWith"), value: "sw" },
                                    { key: 1, text: t("common:contains"), value: "co" },
                                    { key: 2, text: t("common:equals"), value: "eq" }
                                ] }
                                triggerClearQuery={ triggerClearQuery }
                                data-componentid={ `${componentId}-search` }
                            />
                        )
                    }
                    data-componentid={ `${componentId}-list-layout` }
                >
                    <ProfileSchemaListing
                        rows={ paginatedRows }
                        isLoading={ isLoading }
                        onRefresh={ handleRefresh }
                        data-componentid={ `${componentId}-listing` }
                    />
                </ListLayout>
            ) }
        </PageLayout>
    );
};

export default ProfileSchemaPage;
