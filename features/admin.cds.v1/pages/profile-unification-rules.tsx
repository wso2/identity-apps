import React, { useEffect, useState } from "react";
import {
    PageLayout,
    ListLayout,
    PrimaryButton,
    EmptyPlaceholder,
    ConfirmationModal,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { DropdownItemProps, DropdownProps, Grid, Icon, List } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import axios from "axios";
import UnificationRuleAddModal from "../components/modals/add-unification-rule";

import { UnificationRulesList } from "../components/unification-rule-list";
import { CDM_BASE_URL } from "../models/constants";

const SORT_BY = [
    { key: 0, text: "Name", value: "rule_name" },
    { key: 1, text: "Scope", value: "property_scope" },
    { key: 2, text: "Priority", value: "priority" }
];

const sortRules = (list: any[], key: string, ascending: boolean): any[] => {
    return [...list].sort((a, b) => {
        if (a[key] < b[key]) return ascending ? -1 : 1;
        if (a[key] > b[key]) return ascending ? 1 : -1;
        return 0;
    });
};

const paginate = (items: any[], limit: number, offset: number): any[] => {
    return items.slice(offset, offset + limit);
};

const ProfileUnificationRulePage = () => {
    const [rules, setRules] = useState([]);
    const [originalRules, setOriginalRules] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState<DropdownItemProps>(SORT_BY[2]);
    const [sortOrder, setSortOrder] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [triggerClearQuery, setTriggerClearQuery] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [deletingRule, setDeletingRule] = useState<any>(null);
    const [alert, setAlert, alertComponent] = useConfirmationModalAlert();
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [togglingRule, setTogglingRule] = useState<any>(null);
    const [nextStatus, setNextStatus] = useState<boolean>(false);

    const [offset, setOffset] = useState(0);
    const listItemLimit = 10;

    const fetchRules = async () => {
        setIsLoading(true);
        try {
            const url = `${CDM_BASE_URL}/unification-rules`;
            const res = await axios.get(url);
            const enriched = (res.data || []).map(rule => {
                let scope = "Default";
                const prop = rule.property_name;
                if (prop?.startsWith("identity_attributes.")) scope = "Identity Attribute";
                else if (prop?.startsWith("application_data.")) scope = "Application Data";
                else if (prop?.startsWith("traits.")) scope = "Trait";
                return { ...rule, property_scope: scope };
            });
            const sorted = sortRules(enriched, sortBy.value as string, sortOrder);
            setOriginalRules(sorted);
            setRules(sorted);
        } catch (err) {
            console.error("Failed to fetch unification rules", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const performToggle = async (ruleId: string, current: boolean) => {
        try {
            await axios.patch(`${CDM_BASE_URL}/unification-rules/${ruleId}`, {
                is_active: !current
            });
            fetchRules();
        } catch (err) {
            console.error("Failed to toggle rule status", err);
        }
    };

    const handleSortStrategyChange = (_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        const selected = SORT_BY.find(option => option.value === data.value);
        setSortBy(selected);
        setRules(prev => sortRules(prev, data.value as string, sortOrder));
    };

    const handleSortOrderChange = (isAscending: boolean) => {
        setSortOrder(isAscending);
        setRules(prev => sortRules(prev, sortBy.value as string, isAscending));
    };

    const handleRuleSearch = (query: string): void => {
        const filtered = originalRules.filter(rule =>
            rule.rule_name?.toLowerCase().includes(query.toLowerCase()) ||
            rule.property_name?.toLowerCase().includes(query.toLowerCase()) ||
            rule.property_scope?.toLowerCase().includes(query.toLowerCase())
        );
        setRules(filtered);
        setSearchQuery(query);
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
        setRules(originalRules);
    };

    return (
        <PageLayout
            title="Unification Rules"
            description="Manage profile unification rules."
            action={rules.length > 0 && (
                <PrimaryButton onClick={() => setOpenModal(true)}>
                    <Icon name="add" />
                    Add Unification Rule
                </PrimaryButton>
            )}
            isLoading={isLoading}
        >
            {rules.length === 0 && !isLoading ? (
                <EmptyPlaceholder
                    action={(
                        <PrimaryButton onClick={() => setOpenModal(true)}>
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
                    showTopActionPanel
                    currentListSize={rules.length}
                    totalListSize={rules.length}
                    sortOptions={SORT_BY}
                    sortStrategy={sortBy}
                    onSortStrategyChange={handleSortStrategyChange}
                    onSortOrderChange={handleSortOrderChange}
                    isLoading={isLoading}
                    onPageChange={(_, data) => setOffset(((data.activePage as number) - 1) * listItemLimit)}
                    totalPages={Math.ceil(rules.length / listItemLimit)}
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
                    <UnificationRulesList
                        rules={paginate(rules, listItemLimit, offset)}
                        isLoading={isLoading}
                        onDelete={fetchRules}
                        onSearchQueryClear={handleSearchQueryClear}
                            searchQuery={searchQuery}
                    />
                </ListLayout>
            )}

            <UnificationRuleAddModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmitSuccess={() => {
                    setOpenModal(false);
                    fetchRules();
                }}
            />
        </PageLayout>
    );
};

export default ProfileUnificationRulePage;
