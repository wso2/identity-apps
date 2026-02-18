import React, { useMemo, useState, useEffect } from "react";
import {
    PageLayout,
    ListLayout,
    PrimaryButton,
    EmptyPlaceholder,
    useConfirmationModalAlert,
    LinkButton
} from "@wso2is/react-components";
import { DropdownProps, Icon } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { UnificationRulesList } from "../components/unification-rule-list";
import { useUnificationRules } from "../hooks/use-unification-rules";
import { UnificationRuleModel } from "../models/unification-rules";
import { AlertLevels } from "@wso2is/core/models";
import { DropdownChild } from "@wso2is/forms";
import { useTranslation } from "react-i18next";

type SortKey = "rule_name" | "property_scope" | "priority";

interface EnrichedRule extends UnificationRuleModel {
    property_scope: string;
}

const SORT_BY: DropdownChild[] = [
    { key: 0, text: "Name", value: "rule_name" },
    { key: 1, text: "Scope", value: "property_scope" },
    { key: 2, text: "Priority", value: "priority" }
];

const LIST_ITEM_LIMIT: number = 10;

const getPropertyScope = (propertyName: string): string => {
    if (propertyName?.startsWith("identity_attributes.")) return "Identity Attribute";
    if (propertyName?.startsWith("application_data.")) return "Application Data";
    if (propertyName?.startsWith("traits.")) return "Trait";

    return "Default";
};

const sortRules = (list: EnrichedRule[], key: SortKey, ascending: boolean): EnrichedRule[] => {
    return [ ...list ].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;

        return 0;
    });
};

const extractSearchTerm = (query: string | null | undefined): string => {
    if (!query) return "";

    const trimmed: string = query.trim();

    const quotedMatch: RegExpMatchArray | null = trimmed.match(/^\w+\s+\w+\s+"(.*)"$/);
    if (quotedMatch?.[1] != null) {
        return quotedMatch[1];
    }

    const unquotedMatch: RegExpMatchArray | null = trimmed.match(/^\w+\s+\w+\s+(.+)$/);
    if (unquotedMatch?.[1] != null) {
        return unquotedMatch[1].trim();
    }

    return trimmed;
};

const ProfileUnificationRulePage: React.FC = () => {

    const { t } = useTranslation();

    const { data, error, isLoading, mutate } = useUnificationRules();
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const [ sortBy, setSortBy ] = useState<DropdownChild>(SORT_BY[2]); // Priority
    const [ sortOrder, setSortOrder ] = useState<boolean>(true); // true = ascending
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ activePage, setActivePage ] = useState<number>(1);

    const enrichedRules: EnrichedRule[] = useMemo(() => {
        if (!data) return [];

        const rules = Array.isArray(data) ? data : (data as any).rules;
        if (!rules) return [];

        return rules.map((rule: UnificationRuleModel) => ({
            ...rule,
            property_scope: getPropertyScope(rule.property_name)
        }));
    }, [ data ]);

    const sortedRules: EnrichedRule[] = useMemo(() => {
        return sortRules(enrichedRules, sortBy.value as SortKey, sortOrder);
    }, [ enrichedRules, sortBy, sortOrder ]);

    const filteredRules: EnrichedRule[] = useMemo(() => {
        const trimmed: string = searchQuery?.trim() ?? "";
        if (!trimmed) return sortedRules;

        const query: string = trimmed.toLowerCase();

        return sortedRules.filter((rule: EnrichedRule) =>
            rule.rule_name?.toLowerCase().includes(query) ||
            rule.property_name?.toLowerCase().includes(query)
        );
    }, [ sortedRules, searchQuery ]);

    const totalPages: number = useMemo(() => {
        return Math.max(1, Math.ceil(filteredRules.length / LIST_ITEM_LIMIT));
    }, [ filteredRules.length ]);

    const paginatedRules: EnrichedRule[] = useMemo(() => {
        const offset: number = (activePage - 1) * LIST_ITEM_LIMIT;
        return filteredRules.slice(offset, offset + LIST_ITEM_LIMIT);
    }, [ filteredRules, activePage ]);

    useEffect(() => {
        setActivePage(1);
    }, [ searchQuery, sortBy, sortOrder ]);

    useEffect(() => {
        if (activePage > totalPages) {
            setActivePage(totalPages);
        }
    }, [ totalPages, activePage ]);

    const handleSortStrategyChange = (_: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const selected: DropdownChild | undefined = SORT_BY.find(
            (option: DropdownChild) => option.value === data.value
        );

        if (selected) {
            setSortBy(selected);
        }
    };

    const handleSortOrderChange = (isAscending: boolean): void => {
        setSortOrder(isAscending);
    };

    const handleRuleSearch = (query: string): void => {
        setSearchQuery(extractSearchTerm(query));
    };

    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setTriggerClearQuery(!triggerClearQuery);
    };

    const handlePageChange = (_: React.MouseEvent<HTMLAnchorElement>, data: any): void => {
        setActivePage(data.activePage as number);
    };

    const handleAddRule = (): void => {
        history.push(AppConstants.getPaths().get("UNIFICATION_RULE_CREATE"));
    };

    const handleRuleDeleted = (): void => {
        mutate();
        setAlert({
            description: t("unificationRules.common.notifications.deleted.description"),
            level: AlertLevels.SUCCESS,
            message: t("unificationRules.common.notifications.deleted.message")
        });
    };

    const hasRules: boolean = enrichedRules.length > 0;
    const hasSearchQuery: boolean = (searchQuery?.trim()?.length ?? 0) > 0;
    const hasSearchResults: boolean = filteredRules.length > 0;

    if (error) {
        return (
            <PageLayout
                title={ t("unificationRules.list.page.title") }
                description={ t("unificationRules.list.page.description") }
            >
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                    title={ t("unificationRules.list.placeholders.error.title") }
                    subtitle={ [ t("unificationRules.list.placeholders.error.subtitle") ] }
                    action={ (
                        <PrimaryButton onClick={ () => mutate() }>
                            <Icon name="refresh" />
                            { t("unificationRules.list.buttons.retry") }
                        </PrimaryButton>
                    ) }
                />
            </PageLayout>
        );
    }

    return (
        <>
            { alertComponent }

            <PageLayout
                title={ t("unificationRules.list.page.title") }
                description={ t("unificationRules.list.page.description") }
                action={ hasRules ? (
                    <PrimaryButton onClick={ handleAddRule }>
                        <Icon name="add" />
                        { t("unificationRules.list.buttons.add") }
                    </PrimaryButton>
                ) : null }
                isLoading={ isLoading }
            >
                { !hasRules && !isLoading ? (
                    <EmptyPlaceholder
                        action={ (
                            <PrimaryButton onClick={ handleAddRule }>
                                <Icon name="add" />
                                { t("unificationRules.list.buttons.add") }
                            </PrimaryButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("unificationRules.list.placeholders.empty.title") }
                        subtitle={ [ t("unificationRules.list.placeholders.empty.subtitle") ] }
                    />
                ) : (
                    <ListLayout
                        showTopActionPanel={ hasRules }
                        currentListSize={ paginatedRules.length }
                        listItemLimit={ LIST_ITEM_LIMIT }
                        totalListSize={ filteredRules.length }
                        totalPages={ totalPages }
                        sortOptions={ SORT_BY }
                        sortStrategy={ sortBy }
                        onSortStrategyChange={ handleSortStrategyChange }
                        onSortOrderChange={ handleSortOrderChange }
                        isLoading={ isLoading }
                        onPageChange={ handlePageChange }
                        showPagination={ true }
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleRuleSearch }
                                filterAttributeOptions={ SORT_BY }
                                placeholder="Search by Rule Name or Property"
                                defaultSearchAttribute="rule_name"
                                defaultSearchOperator="co"
                                triggerClearQuery={ triggerClearQuery }
                            />
                        ) }
                    >
                        { !hasSearchResults && hasSearchQuery ? (
                            <EmptyPlaceholder
                                action={ (
                                    <LinkButton onClick={ handleSearchQueryClear }>
                                        { t("unificationRules.list.buttons.clearSearch") }
                                    </LinkButton>
                                ) }
                                image={ getEmptyPlaceholderIllustrations().emptySearch }
                                imageSize="tiny"
                                title={ t("unificationRules.list.placeholders.noResults.title") }
                                subtitle={ [
                                    t("unificationRules.list.placeholders.noResults.subtitle1", { 0: searchQuery }),
                                    t("unificationRules.list.placeholders.noResults.subtitle2")
                                ] }
                            />
                        ) : (
                            <UnificationRulesList
                                rules={ paginatedRules }
                                isLoading={ isLoading }
                                onDelete={ handleRuleDeleted }
                                onSearchQueryClear={ handleSearchQueryClear }
                                searchQuery={ searchQuery }
                                 mutate={mutate} 
                            />
                        ) }
                    </ListLayout>
                ) }
            </PageLayout>
        </>
    );
};

export default ProfileUnificationRulePage;
