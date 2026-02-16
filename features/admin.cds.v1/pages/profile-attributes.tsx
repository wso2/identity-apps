import React, { FunctionComponent, ReactElement, useEffect, useRef, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { useTranslation } from "react-i18next";
import {
    PageLayout,
    ListLayout,
    PrimaryButton,
    EmptyPlaceholder
} from "@wso2is/react-components";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { DropdownItemProps, DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";

import { AddTraitModal } from "../modals/add-profile-attribute";
import { toProfileSchemaListingRows } from "../profile-schema-listing";
import { ProfileSchemaListingRow, SchemaListingScope } from "../models/profile-attribute-listing";
import { ProfileSchemaListing } from "../components/profile-attribute-list";
import { fetchProfileSchemaByScope } from "../api/profile-attributes";
import { useFullProfileSchema } from "../hooks/use-profile-schema-swr";

const ProfileSchemaPage: FunctionComponent = (): ReactElement => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Use SWR hook for data fetching
    const {
        data: schemaData,
        error: schemaError,
        isLoading: isFetchingSchema,
        mutate: refetchSchema
    } = useFullProfileSchema({
        onError: (error) => {
            dispatch(addAlert({
                description: error?.message || t("traits:page.errors.fetchFailed"),
                level: AlertLevels.ERROR,
                message: t("traits:page.errors.error")
            }));
        }
    });

    const SORT_BY: DropdownItemProps[] = [
        { key: 0, text: t("traits:page.sortByName"), value: "display_name" }, 
        { key: 1, text: t("traits:page.sortByScope"), value: "scope" }
    ];

    const SCOPE_ORDER: Record<string, number> = {
        core: 0,
        application_data: 1,
        identity_attributes: 2,
        traits: 3,
    };

    // Transform schema data to rows using useMemo
    const originalRows = useMemo(() => {
        if (!schemaData) return [];
        return toProfileSchemaListingRows(schemaData);
    }, [schemaData]);

    const [rows, setRows] = useState<ProfileSchemaListingRow[]>([]);
    const [isFilterLoading, setIsFilterLoading] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const [listItemLimit, setListItemLimit] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [sortBy, setSortBy] = useState<DropdownItemProps>(SORT_BY[0]);
    const [sortOrder, setSortOrder] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [triggerClearQuery, setTriggerClearQuery] = useState<boolean>(false);
    const [showAddTraitModal, setShowAddTraitModal] = useState<boolean>(false);

    const initialRender = useRef(true);

    // Update rows when original data changes
    useEffect(() => {
        setRows(originalRows);
        setOffset(0);
    }, [originalRows]);

    // Sorting logic
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const sorted = [...rows].sort((a, b) => {
            if (sortBy.value === "scope") {
                const aOrder = SCOPE_ORDER[a.scope] ?? 99;
                const bOrder = SCOPE_ORDER[b.scope] ?? 99;

                if (aOrder !== bOrder) {
                    return sortOrder ? (aOrder - bOrder) : (bOrder - aOrder);
                }

                const aName = (a.display_name ?? "").toLowerCase();
                const bName = (b.display_name ?? "").toLowerCase();

                if (aName < bName) return sortOrder ? -1 : 1;
                if (aName > bName) return sortOrder ? 1 : -1;

                return 0;
            }

            const aVal = ((a as any)[sortBy.value as string] ?? "").toString().toLowerCase();
            const bVal = ((b as any)[sortBy.value as string] ?? "").toString().toLowerCase();

            if (aVal < bVal) return sortOrder ? -1 : 1;
            if (aVal > bVal) return sortOrder ? 1 : -1;

            const aOrder = SCOPE_ORDER[a.scope] ?? 99;
            const bOrder = SCOPE_ORDER[b.scope] ?? 99;

            return aOrder - bOrder;
        });

        setRows(sorted);
    }, [sortBy, sortOrder]);

    const handleItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ) => {
        setListItemLimit(data.value as number);
        setOffset(0);
    };

    const handlePaginationChange = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
    ) => {
        setOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleSortStrategyChange = (
        event: React.SyntheticEvent<HTMLElement>,
        data: DropdownProps
    ) => {
        setSortBy(SORT_BY.find(option => option.value === data.value));
    };

    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    const handleAddProfileAttribute = () => {
        setShowAddTraitModal(true);
    };

    const toRowsFromScopeResponse = (scope: SchemaListingScope, attrs: any[]): ProfileSchemaListingRow[] => {
        return (attrs ?? []).map((a) => {
            const fullName = a.attribute_name ?? "";
            const display = fullName.split(".").pop() || fullName;

            return {
                id: `${scope}:${a.attribute_id ?? fullName}`,
                scope,
                attribute_id: a.attribute_id,
                attribute_name: fullName,
                display_name: display,
                chip_label: scope,
                belongs_to: scope === "application_data" ? (a.application_identifier ?? "") : undefined,
                editable: scope !== "identity_attributes",
                deletable: scope === "traits" || scope === "application_data"
            };
        });
    };

    type BasicFilter = {
        attribute: string;
        operator: string;
        value: string;
    };

    const parseBasicFilterQuery = (q: string): BasicFilter | null => {
        const trimmed = (q ?? "").trim();
        if (!trimmed) return null;

        const parts = trimmed.split(" ");
        if (parts.length < 3) return null;

        const attribute = parts[0]?.trim();
        const operator = parts[1]?.trim();
        const value = parts.slice(2).join(" ").trim();

        if (!attribute || !operator || !value) return null;

        return { attribute, operator, value };
    };

    const withScopePrefix = (scope: SchemaListingScope, value: string): string => {
        const v = (value ?? "").trim();
        if (!v) return "";

        if (v.startsWith(`${scope}.`)) {
            return v;
        }

        return `${scope}.${v}`;
    };

    const handleSchemaFilter = async (query: string): Promise<void> => {
        if (!query || query.trim() === "") {
            setRows(originalRows);
            setOffset(0);
            return;
        }

        const parsed = parseBasicFilterQuery(query);

        if (!parsed) {
            setRows(originalRows);
            setOffset(0);
            return;
        }

        const { attribute, operator, value } = parsed;

        setIsFilterLoading(true);

        try {
            const scopes: SchemaListingScope[] = ["identity_attributes", "traits", "application_data"];
            
            const searchPromises = scopes.map(async (scope) => {
                const scopedValue = withScopePrefix(scope, value);
                const filter = `${attribute} ${operator} ${scopedValue}`;
                
                try {
                    const attrs = await fetchProfileSchemaByScope(scope as any, filter);
                    return toRowsFromScopeResponse(scope, attrs);
                } catch (error) {
                    console.error(`Failed to fetch from scope ${scope}:`, error);
                    return [];
                }
            });

            const results = await Promise.all(searchPromises);
            const allRows = results.flat(); 

            setRows(allRows);
            setOffset(0);
        } catch (error: any) {
            dispatch(addAlert({
                description: error?.message || t("traits:page.errors.filterFailed"),
                level: AlertLevels.ERROR,
                message: t("traits:page.errors.error")
            }));
        } finally {
            setIsFilterLoading(false);
        }
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setOffset(0);
        setRows(originalRows);
    };

    const handleTraitAddSuccess = () => {
        // Refresh the schema data using SWR's mutate
        refetchSchema();
    };

    const paginate = (list: ProfileSchemaListingRow[], limit: number, offset: number): ProfileSchemaListingRow[] => {
        return list?.slice(offset, offset + limit);
    };

    const paginatedRows = paginate(rows, listItemLimit, offset);
    const combinedLoading = isFetchingSchema || isFilterLoading;

    return (
        <PageLayout
            isLoading={combinedLoading}
            title={t("traits:page.title")}
            pageTitle={t("traits:page.title")}
            description={t("traits:page.description")}
            backButton={{
                onClick: () => { history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES")); },
                text: t("traits:page.backButton")
            }}
            action={(
                <PrimaryButton onClick={handleAddProfileAttribute}>
                    <Icon name="add" />
                    {t("traits:page.addTrait")}
                </PrimaryButton>
            )}
        >
            {
                rows.length === 0 && !combinedLoading ? (
                    <EmptyPlaceholder
                        action={(
                            <PrimaryButton onClick={handleAddProfileAttribute}>
                                <Icon name="add" />
                                {t("traits:page.addTrait")}
                            </PrimaryButton>
                        )}
                        image={getEmptyPlaceholderIllustrations().newList}
                        imageSize="tiny"
                        title={t("traits:page.noAttributes.title")}
                        subtitle={[t("traits:page.noAttributes.subtitle")]}
                    />
                ) : (
                    <ListLayout
                        currentListSize={rows.length}
                        listItemLimit={listItemLimit}
                        onItemsPerPageDropdownChange={handleItemsPerPageDropdownChange}
                        onPageChange={handlePaginationChange}
                        showPagination={true}
                        showTopActionPanel={true}
                        totalPages={Math.ceil(rows.length / listItemLimit)}
                        totalListSize={rows.length}
                        sortOptions={SORT_BY}
                        sortStrategy={sortBy}
                        onSortStrategyChange={handleSortStrategyChange}
                        onSortOrderChange={handleSortOrderChange}
                        onSearchQueryClear={handleSearchQueryClear}   
                        advancedSearch={(
                            <AdvancedSearchWithBasicFilters
                                onFilter={handleSchemaFilter}
                                filterAttributeOptions={[
                                    { key: 0, text: t("traits:page.search.attributeName"), value: "attribute_name" }
                                ]}
                                disableSearchFilterDropdown={false}
                                placeholder={t("traits:page.search.placeholder")}
                                defaultSearchAttribute="attribute_name"
                                defaultSearchOperator="sw"
                                filterConditionOptions={[
                                    { key: 0, text: t("traits:page.search.startsWith"), value: "sw" },
                                    { key: 1, text: t("traits:page.search.contains"), value: "co" },
                                    { key: 2, text: t("traits:page.search.equals"), value: "eq" }
                                ]}
                                triggerClearQuery={triggerClearQuery}
                            />
                        )}
                        isLoading={combinedLoading}
                    >
                        <ProfileSchemaListing
                            rows={paginatedRows}
                            isLoading={combinedLoading}
                            onRefresh={() => refetchSchema()}
                        />
                    </ListLayout>
                )
            }

            <AddTraitModal
                open={showAddTraitModal}
                onClose={() => setShowAddTraitModal(false)}
                onAddSuccess={handleTraitAddSuccess}
            />
        </PageLayout>
    );
};

export default ProfileSchemaPage;
