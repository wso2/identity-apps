import React, { useEffect, useState } from "react";
import {
    PageLayout,
    ListLayout,
    PrimaryButton,
    EmptyPlaceholder,
    ConfirmationModal,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import {
    AlertLevels,
    DropdownItemProps,
    DropdownProps
} from "@wso2is/core/models";
import { Icon } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import axios from "axios";
import UnificationRuleAddModal from "../components/modals/unification-rule-add-modal";
import { UnificationRulesList } from "./unification-rule-list";

const SORT_BY: DropdownItemProps[] = [
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
            const res = await axios.get("http://localhost:8900/api/v1/unification-rules");
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
            console.error("Failed to fetch resolution rules", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const performToggle = async (ruleId: string, current: boolean) => {
        try {
            await axios.patch(`http://localhost:8900/api/v1/unification-rules/${ruleId}`, {
                is_active: !current
            });
            fetchRules();
        } catch (err) {
            console.error("Failed to toggle rule status", err);
        }
    };

    const handleRuleDelete = async (ruleId: string) => {
        setIsLoading(true);
        try {
            await axios.delete(`http://localhost:8900/api/v1/unification-rules/${ruleId}`);
            setShowDeleteConfirmationModal(false);
            setAlert(null);
            fetchRules();
        } catch (err) {
            console.error("Failed to delete rule", err);
            setAlert({
                description: "Something went wrong while deleting the rule.",
                level: AlertLevels.ERROR,
                message: "Delete failed"
            });
        } finally {
            setIsLoading(false);
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
            description="Manage profile unification rules here."
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
                    onPageChange={(page: number) => setOffset((page - 1) * listItemLimit)}
                    totalPages={Math.ceil(rules.length / listItemLimit)}
                    advancedSearch={
                        <AdvancedSearchWithBasicFilters
                            onFilter={handleRuleSearch}
                            filterAttributeOptions={SORT_BY}
                            placeholder="Search by Rule Name or Scope"
                            defaultSearchAttribute="rule_name"
                            defaultSearchOperator="co"
                            triggerClearQuery={triggerClearQuery}
                            onSearchQueryClear={handleSearchQueryClear}
                            searchQuery={searchQuery}
                        />
                    }
                >
                    <UnificationRulesList
                        rules={paginate(rules, listItemLimit, offset)}
                        isLoading={isLoading}
                        onRefresh={fetchRules}
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
