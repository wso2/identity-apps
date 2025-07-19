import React, { useEffect, useState } from "react";
import {
    PageLayout,
    ListLayout,
    PrimaryButton,
    EmptyPlaceholder
} from "@wso2is/react-components";
import {
    AlertLevels,
} from "@wso2is/core/models";
import { ConfirmationModal, useConfirmationModalAlert } from "@wso2is/react-components";

import {
    Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
    Paper, IconButton, FormControlLabel, Switch
} from "@mui/material";
import {
    DropdownItemProps,
    DropdownProps,
    Icon
} from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import ResolutionRuleModal from "../components/modals/unification-rule-add-modal";

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

const IdentityResolutionPage = () => {
    const [rules, setRules] = useState([]);
    const [originalRules, setOriginalRules] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState<DropdownItemProps>(SORT_BY[2]);
    const [sortOrder, setSortOrder] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [triggerClearQuery, setTriggerClearQuery] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [deletingRule, setDeletingRule] = useState(null);
    const [alert, setAlert, alertComponent] = useConfirmationModalAlert();
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [togglingRule, setTogglingRule] = useState<any>(null);
    const [nextStatus, setNextStatus] = useState<boolean>(false);

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

    return (<PageLayout
        title="Unification Rules"
        description="Manage profile unification rules here."
        action={<PrimaryButton onClick={() => setOpenModal(true)}><Icon name="add" />Add Rule</PrimaryButton>}
        isLoading={isLoading}>

        {rules.length === 0 && !isLoading ? (
            <EmptyPlaceholder
                action={<PrimaryButton onClick={() => setOpenModal(true)}><Icon name="add" />Add Rule</PrimaryButton>}
                image="/path/to/empty-placeholder.svg"
                imageSize="tiny"
                title="No Unification Rules"
                subtitle={["Start by creating a rule to unify profiles."]}
            />
        ) : (
            <ListLayout
                showTopActionPanel
                showPagination={false}
                currentListSize={rules.length}
                totalListSize={rules.length}
                sortOptions={SORT_BY}
                sortStrategy={sortBy}
                onSortStrategyChange={handleSortStrategyChange}
                onSortOrderChange={handleSortOrderChange}
                isLoading={isLoading}
                onPageChange={() => {}}
                totalPages={1}
                advancedSearch={<AdvancedSearchWithBasicFilters
                    onFilter={handleRuleSearch}
                    filterAttributeOptions={SORT_BY}
                    placeholder="Search by Rule Name or Scope"
                    defaultSearchAttribute="rule_name"
                    defaultSearchOperator="co"
                    triggerClearQuery={triggerClearQuery}
                    onSearchQueryClear={handleSearchQueryClear}
                    searchQuery={searchQuery} />}
            >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Rule Name</strong></TableCell>
                                <TableCell><strong>Scope</strong></TableCell>
                                <TableCell><strong>Attribute</strong></TableCell>
                                <TableCell><strong>Priority</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rules.map(rule => {
                                const attr = rule.property_name || "";
                                const isUserId = attr === "user_id";
                                let attrSuffix = attr;
                                if (attr.startsWith("identity_attributes.")) attrSuffix = attr.replace("identity_attributes.", "");
                                else if (attr.startsWith("application_data.")) attrSuffix = attr.replace("application_data.", "");
                                else if (attr.startsWith("traits.")) attrSuffix = attr.replace("traits.", "");

                                return (<TableRow key={rule.rule_id}>
                                    <TableCell>{rule.rule_name}</TableCell>
                                    <TableCell>{rule.property_scope}</TableCell>
                                    <TableCell>{attrSuffix}</TableCell>
                                    <TableCell>{rule.priority}</TableCell>
                                    <TableCell>
                                        <FormControlLabel
                                            control={<Switch
                                                checked={rule.is_active}
                                                onChange={() => {
                                                    setTogglingRule(rule);
                                                    setNextStatus(!rule.is_active);
                                                    setShowStatusChangeModal(true);
                                                }}
                                                disabled={isUserId} />}
                                            label={rule.is_active ? "Active" : "Inactive"} />
                                    </TableCell>
                                    <TableCell>
                                        {!isUserId && <IconButton
                                            onClick={() => {
                                                setDeletingRule(rule);
                                                setShowDeleteConfirmationModal(true);
                                            }}
                                            color="error">
                                            <Delete />
                                        </IconButton>}
                                    </TableCell>
                                </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ListLayout>
        )}

        {deletingRule && <ConfirmationModal
            primaryActionLoading={isLoading}
            onClose={() => setShowDeleteConfirmationModal(false)}
            type="negative"
            open={showDeleteConfirmationModal}
            assertionHint="Please confirm the deletion."
            assertionType="checkbox"
            primaryAction="Confirm"
            secondaryAction="Cancel"
            onSecondaryActionClick={() => {
                setShowDeleteConfirmationModal(false);
                setAlert(null);
            }}
            onPrimaryActionClick={() => handleRuleDelete(deletingRule.rule_id)}
            data-testid="delete-unification-rule-modal"
            closeOnDimmerClick={false}>
            <>
                <ConfirmationModal.Header>Delete Unification Rule</ConfirmationModal.Header>
                <ConfirmationModal.Message attached negative>Deleting this rule will permanently remove it and it cannot be undone. Unifications done using this rule will not be affected, but future unifications will not apply this rule.</ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    <div className="modal-alert-wrapper">{alert && alertComponent}</div>
                    Are you sure you want to delete the rule <b>{deletingRule.rule_name}</b>?
                </ConfirmationModal.Content>
            </>
        </ConfirmationModal>}

        {togglingRule && <ConfirmationModal
            primaryActionLoading={isLoading}
            onClose={() => setShowStatusChangeModal(false)}
            type="warning"
            open={showStatusChangeModal}
            assertionHint="Please confirm your action."
            assertionType="checkbox"
            primaryAction="Confirm"
            secondaryAction="Cancel"
            onSecondaryActionClick={() => setShowStatusChangeModal(false)}
            onPrimaryActionClick={() => {
                performToggle(togglingRule.rule_id, togglingRule.is_active);
                setShowStatusChangeModal(false);
            }}
            data-testid="toggle-unification-rule-status-modal"
            closeOnDimmerClick={false}>
            <>
                <ConfirmationModal.Header>{nextStatus ? "Enable Unification Rule" : "Disable Unification Rule"}</ConfirmationModal.Header>
                <ConfirmationModal.Message attached>{nextStatus
                    ? "Enabling this rule will apply it to future profile unifications."
                    : "Disabling this rule will prevent it from being applied to future profile unifications. Existing unifications will not be affected."}</ConfirmationModal.Message>
                <ConfirmationModal.Content>
                <div className="modal-alert-wrapper">{alert && alertComponent}</div>
                Are you sure you want to <b>{nextStatus ? "enable" : "disable"}</b> the unification rule <b>{togglingRule.rule_name}</b>?
                </ConfirmationModal.Content>
            </>
        </ConfirmationModal>}

        <ResolutionRuleModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSubmitSuccess={() => {
                setOpenModal(false);
                fetchRules();
            }} />
    </PageLayout>);
};

export default IdentityResolutionPage;
