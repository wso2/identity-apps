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
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EmptyPlaceholder,
    LinkButton,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import React, { Dispatch, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Icon } from "semantic-ui-react";
import { UnificationRulesList } from "../components/unification-rule-list";
import { useUnificationRules } from "../hooks/use-unification-rules";
import { DEFAULT_PAGE_SIZE } from "../models/constants";
import { UnificationRuleModel } from "../models/unification-rules";

interface EnrichedRule extends UnificationRuleModel {
    property_scope: string;
}

const getPropertyScope = (propertyName: string): string => {
    if (propertyName?.startsWith("identity_attributes.")) return "Identity Attribute";
    if (propertyName?.startsWith("application_data.")) return "Application Data";
    if (propertyName?.startsWith("traits.")) return "Trait";

    return "Default";
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
    const [ _alert, _setAlert, alertComponent ] = useConfirmationModalAlert();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ activePage, setActivePage ] = useState<number>(1);
    const dispatch: Dispatch<any> = useDispatch();

    const enrichedRules: EnrichedRule[] = useMemo(() => {
        if (!data) return [];

        const rules: any = Array.isArray(data) ? data : (data as any).rules;

        if (!rules) return [];

        return rules.map((rule: UnificationRuleModel) => ({
            ...rule,
            property_scope: getPropertyScope(rule.property_name)
        }));
    }, [ data ]);

    const filteredRules: EnrichedRule[] = useMemo(() => {
        const trimmed: string = searchQuery?.trim() ?? "";

        if (!trimmed) return enrichedRules;

        const query: string = trimmed.toLowerCase();

        return enrichedRules.filter((rule: EnrichedRule) =>
            rule.rule_name?.toLowerCase().includes(query) ||
            rule.property_name?.toLowerCase().includes(query)
        );
    }, [ enrichedRules, searchQuery ]);

    const totalPages: number = useMemo(() => {
        return Math.max(1, Math.ceil(filteredRules.length / DEFAULT_PAGE_SIZE));
    }, [ filteredRules.length ]);

    const paginatedRules: EnrichedRule[] = useMemo(() => {
        const offset: number = (activePage - 1) * DEFAULT_PAGE_SIZE;

        return filteredRules.slice(offset, offset + DEFAULT_PAGE_SIZE);
    }, [ filteredRules, activePage ]);

    useEffect(() => {
        setActivePage(1);
    }, [ searchQuery ]);

    useEffect(() => {
        if (activePage > totalPages) {
            setActivePage(totalPages);
        }
    }, [ totalPages, activePage ]);

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
        dispatch(addAlert({
            description: t("customerDataService:unificationRules.common.notifications.deleted.description"),
            level: AlertLevels.SUCCESS,
            message: t("customerDataService:unificationRules.common.notifications.deleted.message")
        }));
    };

    const hasRules: boolean = enrichedRules.length > 0;
    const hasSearchQuery: boolean = (searchQuery?.trim()?.length ?? 0) > 0;
    const hasSearchResults: boolean = filteredRules.length > 0;

    if (error) {
        return (
            <PageLayout
                title={ t("customerDataService:unificationRules.list.page.title") }
                description={ t("customerDataService:unificationRules.list.page.description") }
            >
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                    title={ t("customerDataService:unificationRules.list.placeholders.error.title") }
                    subtitle={ [ t("customerDataService:unificationRules.list.placeholders.error.subtitle") ] }
                    action={ (
                        <PrimaryButton onClick={ () => mutate() }>
                            <Icon name="refresh" />
                            { t("customerDataService:unificationRules.list.buttons.retry") }
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
                title={ t("customerDataService:unificationRules.list.page.title") }
                description={ t("customerDataService:unificationRules.list.page.description") }
                action={ hasRules ? (
                    <PrimaryButton onClick={ handleAddRule }>
                        <Icon name="add" />
                        { t("customerDataService:unificationRules.list.buttons.add") }
                    </PrimaryButton>
                ) : null }
                isLoading={ isLoading }
            >
                { !hasRules && !isLoading ? (
                    <EmptyPlaceholder
                        action={ (
                            <PrimaryButton onClick={ handleAddRule }>
                                <Icon name="add" />
                                { t("customerDataService:unificationRules.list.buttons.add") }
                            </PrimaryButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("customerDataService:unificationRules.list.placeholders.empty.title") }
                        subtitle={ [ t("customerDataService:unificationRules.list.placeholders.empty.subtitle") ] }
                    />
                ) : (
                    <ListLayout
                        showTopActionPanel={ hasRules }
                        currentListSize={ paginatedRules.length }
                        listItemLimit={ DEFAULT_PAGE_SIZE }
                        totalListSize={ filteredRules.length }
                        totalPages={ totalPages }
                        isLoading={ isLoading }
                        onPageChange={ handlePageChange }
                        showPagination={ true }
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                disableSearchFilterDropdown={ true }
                                onFilter={ handleRuleSearch }
                                filterAttributeOptions={ [] }
                                placeholder="Search by Rule Name or Attribute Name"
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
                                        { t("customerDataService:unificationRules.list.buttons.clearSearch") }
                                    </LinkButton>
                                ) }
                                image={ getEmptyPlaceholderIllustrations().emptySearch }
                                imageSize="tiny"
                                title={ t("customerDataService:unificationRules.list.placeholders.noResults.title") }
                                subtitle={ [
                                    t("customerDataService:unificationRules.list.placeholders.noResults.subtitle1",
                                        { 0: searchQuery }),
                                    t("customerDataService:unificationRules.list.placeholders.noResults.subtitle2")
                                ] }
                            />
                        ) : (
                            <UnificationRulesList
                                rules={ paginatedRules }
                                isLoading={ isLoading }
                                onDelete={ handleRuleDeleted }
                                onSearchQueryClear={ handleSearchQueryClear }
                                searchQuery={ searchQuery }
                                mutate={ mutate }
                            />
                        ) }
                    </ListLayout>
                ) }
            </PageLayout>
        </>
    );
};

export default ProfileUnificationRulePage;
