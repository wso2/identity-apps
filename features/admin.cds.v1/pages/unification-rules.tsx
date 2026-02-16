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

import React, { useMemo, useState, useEffect } from "react";
import {
    PageLayout,
    ListLayout,
    PrimaryButton,
    EmptyPlaceholder,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { DropdownItemProps, DropdownProps, Icon } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { UnificationRulesList } from "../components/unification-rule-list";
import { useUnificationRules } from "../hooks/use-unification-rules";
import { UnificationRuleModel } from "../models/unification-rules";

type SortKey = "rule_name" | "property_scope" | "priority";

interface EnrichedRule extends UnificationRuleModel {
    property_scope: string;
}

const SORT_BY: DropdownItemProps[] = [
    { key: 0, text: "Name", value: "rule_name" },
    { key: 1, text: "Scope", value: "property_scope" },
    { key: 2, text: "Priority", value: "priority" }
];

const LIST_ITEM_LIMIT = 10;

/**
 * Derive property scope from property name
 */
const getPropertyScope = (propertyName: string): string => {
    if (propertyName?.startsWith("identity_attributes.")) return "Identity Attribute";
    if (propertyName?.startsWith("application_data.")) return "Application Data";
    if (propertyName?.startsWith("traits.")) return "Trait";
    return "Default";
};

/**
 * Sort rules by a given key
 */
const sortRules = (list: EnrichedRule[], key: SortKey, ascending: boolean): EnrichedRule[] => {
    return [...list].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
    });
};

/**
 * Paginate array
 */
const paginate = <T,>(items: T[], limit: number, offset: number): T[] => {
    return items.slice(offset, offset + limit);
};

const ProfileUnificationRulePage: React.FC = () => {
    // Hooks
    const { data, error, isLoading, mutate } = useUnificationRules();
    const [alert, setAlert, alertComponent] = useConfirmationModalAlert();

    // State
    const [sortBy, setSortBy] = useState<DropdownItemProps>(SORT_BY[2]); // Default: Priority
    const [sortOrder, setSortOrder] = useState<boolean>(true); // true = ascending
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [triggerClearQuery, setTriggerClearQuery] = useState<boolean>(false);
    const [offset, setOffset] = useState(0);

    // Enrich rules with property_scope
    const enrichedRules = useMemo<EnrichedRule[]>(() => {
        if (!data?.rules) return [];
        
        return data.rules.map(rule => ({
            ...rule,
            property_scope: getPropertyScope(rule.property_name)
        }));
    }, [data?.rules]);

    // Apply sorting
    const sortedRules = useMemo(() => {
        return sortRules(enrichedRules, sortBy.value as SortKey, sortOrder);
    }, [enrichedRules, sortBy, sortOrder]);

    // Apply search filtering
    const filteredRules = useMemo(() => {
        if (!searchQuery.trim()) return sortedRules;

        const query = searchQuery.toLowerCase();
        return sortedRules.filter(rule =>
            rule.rule_name?.toLowerCase().includes(query) ||
            rule.property_name?.toLowerCase().includes(query) ||
            rule.property_scope?.toLowerCase().includes(query)
        );
    }, [sortedRules, searchQuery]);

    // Apply pagination
    const paginatedRules = useMemo(() => {
        return paginate(filteredRules, LIST_ITEM_LIMIT, offset);
    }, [filteredRules, offset]);

    // Reset pagination when filtered results change
    useEffect(() => {
        const maxOffset = Math.max(0, Math.floor((filteredRules.length - 1) / LIST_ITEM_LIMIT) * LIST_ITEM_LIMIT);
        if (offset > maxOffset) {
            setOffset(0);
        }
    }, [filteredRules.length, offset]);

    // Handlers
    const handleSortStrategyChange = (_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const selected = SORT_BY.find(option => option.value === data.value);
        if (selected) {
            setSortBy(selected);
        }
    };

    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
    };

    const handleRuleSearch = (query: string): void => {
        setSearchQuery(query);
        setOffset(0); // Reset to first page when searching
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setOffset(0);
    };

    const handlePageChange = (_: React.MouseEvent<HTMLAnchorElement>, data: any) => {
        setOffset(((data.activePage as number) - 1) * LIST_ITEM_LIMIT);
    };

    const handleAddRule = (): void => {
        history.push(AppConstants.getPaths().get("UNIFICATION_RULE_CREATE"));
    };

    const handleRuleDeleted = () => {
        mutate(); // Refresh the list
        setAlert({
            description: "Unification rule has been deleted successfully.",
            level: "success",
            message: "Rule Deleted"
        });
    };

    // Determine if we have any rules at all
    const hasRules = enrichedRules.length > 0;
    const hasSearchQuery = searchQuery.trim().length > 0;
    const hasSearchResults = filteredRules.length > 0;

    // Show error state
    if (error) {
        return (
            <PageLayout
                title="Unification Rules"
                description="Manage profile unification rules."
            >
                <EmptyPlaceholder
                    image={getEmptyPlaceholderIllustrations().genericError}
                    imageSize="tiny"
                    title="Error Loading Rules"
                    subtitle={["Failed to load unification rules. Please try again."]}
                    action={(
                        <PrimaryButton onClick={() => mutate()}>
                            <Icon name="refresh" />
                            Retry
                        </PrimaryButton>
                    )}
                />
            </PageLayout>
        );
    }

    return (
        <>
            {alertComponent}
            <PageLayout
                title="Unification Rules"
                description="Manage profile unification rules."
                action={(
                    <PrimaryButton onClick={handleAddRule}>
                        <Icon name="add" />
                        Add Unification Rule
                    </PrimaryButton>
                )}
                isLoading={isLoading}
            >
                {!hasRules && !isLoading ? (
                    // No rules exist at all - show initial empty state
                    <EmptyPlaceholder
                        action={(
                            <PrimaryButton onClick={handleAddRule}>
                                <Icon name="add" />
                                Add Unification Rule
                            </PrimaryButton>
                        )}
                        image={getEmptyPlaceholderIllustrations().newList}
                        imageSize="tiny"
                        title="No Unification Rules Found"
                        subtitle={["Please add a unification rule to start unifying your profiles."]}
                    />
                ) : (
                    <ListLayout
                        showTopActionPanel={hasRules}
                        currentListSize={filteredRules.length}
                        totalListSize={enrichedRules.length}
                        sortOptions={SORT_BY}
                        sortStrategy={sortBy}
                        onSortStrategyChange={handleSortStrategyChange}
                        onSortOrderChange={handleSortOrderChange}
                        isLoading={isLoading}
                        onPageChange={handlePageChange}
                        totalPages={Math.ceil(filteredRules.length / LIST_ITEM_LIMIT)}
                        advancedSearch={
                            <AdvancedSearchWithBasicFilters
                                onFilter={handleRuleSearch}
                                filterAttributeOptions={SORT_BY}
                                placeholder="Search by Rule Name or Scope"
                                defaultSearchAttribute="rule_name"
                                defaultSearchOperator="co"
                                triggerClearQuery={triggerClearQuery}
                            />
                        }
                    >
                        {!hasSearchResults && hasSearchQuery ? (
                            // Search returned no results
                            <EmptyPlaceholder
                                action={(
                                    <PrimaryButton onClick={handleSearchQueryClear}>
                                        <Icon name="refresh" />
                                        Clear Search
                                    </PrimaryButton>
                                )}
                                image={getEmptyPlaceholderIllustrations().emptySearch}
                                imageSize="tiny"
                                title="No Results Found"
                                subtitle={[
                                    `No unification rules match your search "${searchQuery}".`,
                                    "Try adjusting your search criteria."
                                ]}
                            />
                        ) : (
                            // Show the list
                            <UnificationRulesList
                                rules={paginatedRules}
                                isLoading={isLoading}
                                onDelete={handleRuleDeleted}
                                onSearchQueryClear={handleSearchQueryClear}
                                searchQuery={searchQuery}
                            />
                        )}
                    </ListLayout>
                )}
            </PageLayout>
        </>
    );
};

export default ProfileUnificationRulePage;
