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

import React, { FunctionComponent, ReactElement, SyntheticEvent, useMemo, useState } from "react";
import {
    DataTable,
    AppAvatar,
    AnimatedAvatar,
    ConfirmationModal
} from "@wso2is/react-components";
import { TableActionsInterface, TableColumnInterface } from "@wso2is/react-components";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { UnificationRuleModel } from "../models/unification-rules";
import { deleteUnificationRule, updateUnificationRule } from "../api/unification-rules";
import { Header, Label, SemanticICONS } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";

/**
 * Temporary priority value used during the sequential swap to avoid
 * two rules having the same priority at any point.
 */
const TEMP_PRIORITY: number = 999999;

interface UnificationRulesListProps {
    rules: UnificationRuleModel[];
    isLoading: boolean;
    onDelete: () => void;
    onUpdate?: () => void;
    onSearchQueryClear?: () => void;
    searchQuery?: string;
    /**
     * SWR mutate function to re-fetch the rules list after any mutation.
     */
    mutate?: () => void;
}

const getPropertyScope = (propertyName: string): string => {
    if (propertyName?.startsWith("identity_attributes.")) return "Identity Attribute";
    if (propertyName?.startsWith("application_data.")) return "Application Data";
    if (propertyName?.startsWith("traits.")) return "Trait";
    return "Default";
};

const getPropertySuffix = (propertyName: string): string => {
    if (propertyName?.startsWith("identity_attributes.")) return propertyName.replace("identity_attributes.", "");
    if (propertyName?.startsWith("application_data.")) return propertyName.replace("application_data.", "");
    if (propertyName?.startsWith("traits.")) return propertyName.replace("traits.", "");
    return propertyName || "";
};

export const UnificationRulesList: FunctionComponent<UnificationRulesListProps> = ({
    rules,
    isLoading,
    onDelete,
    onUpdate,
    searchQuery,
    mutate
}: UnificationRulesListProps): ReactElement => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    // ── Client-side search filtering ─────────────────────────
    const filteredRules = useMemo(() => {
        if (!searchQuery?.trim()) return rules;

        const query = searchQuery.toLowerCase().trim();

        return rules.filter((rule) => {
            const ruleName = rule.rule_name?.toLowerCase() || "";
            const propertyName = rule.property_name?.toLowerCase() || "";
            const propertySuffix = getPropertySuffix(rule.property_name)?.toLowerCase() || "";
            const scope = getPropertyScope(rule.property_name)?.toLowerCase() || "";

            return (
                ruleName.includes(query) ||
                propertyName.includes(query) ||
                propertySuffix.includes(query) ||
                scope.includes(query)
            );
        });
    }, [rules, searchQuery]);

    // ── Sorted rules for determining adjacent items ──────────
    const sortedRules = useMemo(
        () => [...filteredRules].sort((a, b) => a.priority - b.priority),
        [filteredRules]
    );

    // ── Delete ────────────────────────────────────────────────
    const [deletingRule, setDeletingRule] = useState<UnificationRuleModel | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Global swap lock — disables ALL arrows while a swap is in progress ──
    const [isSwapping, setIsSwapping] = useState(false);

    // ── Toggle confirmation ───────────────────────────────────
    const [togglingRule, setTogglingRule] = useState<UnificationRuleModel | null>(null);
    const [pendingToggleState, setPendingToggleState] = useState<boolean>(false);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [isToggleInProgress, setIsToggleInProgress] = useState(false);

    // ── Priority helpers ──────────────────────────────────────

    const canMoveUp = (rule: UnificationRuleModel): boolean => {
        const idx = sortedRules.findIndex((r) => r.rule_id === rule.rule_id);

        return idx > 0;
    };

    const canMoveDown = (rule: UnificationRuleModel): boolean => {
        const idx = sortedRules.findIndex((r) => r.rule_id === rule.rule_id);

        return idx >= 0 && idx < sortedRules.length - 1;
    };

    /**
     * Swaps the priority of the given rule with its adjacent neighbour.
     *
     * Uses a 3-step sequential approach to avoid two rules ever sharing
     * the same priority value at the same time:
     *   1. Move rule A to a temporary priority (TEMP_PRIORITY).
     *   2. Move rule B to rule A's original priority.
     *   3. Move rule A to rule B's original priority.
     *
     * A global `isSwapping` flag prevents any further swaps until all
     * three operations complete. After completion, calls `mutate()` to
     * re-fetch the list.
     */
    const handlePriorityMove = async (
        rule: UnificationRuleModel,
        direction: "up" | "down"
    ): Promise<void> => {
        if (isSwapping) return;

        const currentIndex = sortedRules.findIndex((r) => r.rule_id === rule.rule_id);

        if (currentIndex === -1) return;

        const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (swapIndex < 0 || swapIndex >= sortedRules.length) return;

        const adjacentRule = sortedRules[swapIndex];
        const originalPriority = rule.priority;
        const targetPriority = adjacentRule.priority;

        setIsSwapping(true);

        try {
            // Step 1: Move rule A to a temporary priority to free up the slot.
            await updateUnificationRule(rule.rule_id, { priority: TEMP_PRIORITY });
            // Step 2: Move rule B to rule A's original priority.
            await updateUnificationRule(adjacentRule.rule_id, { priority: originalPriority });
            // Step 3: Move rule A to rule B's original priority.
            await updateUnificationRule(rule.rule_id, { priority: targetPriority });

            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:unificationRules.list.notifications.priorityUpdated" +
                    ".success.message"),
                description: t("customerDataService:unificationRules.list.notifications.priorityUpdated" +
                    ".success.description", { ruleName: rule.rule_name, direction })
            }));

            // Re-fetch the rules list.
            mutate?.();
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: t("customerDataService:unificationRules.list.notifications.priorityUpdated" +
                    ".error.message"),
                description: error?.message ||
                    t("customerDataService:unificationRules.list.notifications.priorityUpdated" +
                        ".error.description")
            }));
            // Re-fetch even on error to restore consistent state.
            mutate?.();
        } finally {
            setIsSwapping(false);
        }
    };

    // ── Toggle handlers ───────────────────────────────────────

    const handleToggleChange = (
        _event: React.ChangeEvent<HTMLInputElement>,
        rule: UnificationRuleModel
    ): void => {
        setTogglingRule(rule);
        setPendingToggleState(!rule.is_active);
        setShowToggleModal(true);
    };

    const handleToggleConfirm = async (): Promise<void> => {
        if (!togglingRule) return;
        setIsToggleInProgress(true);
        try {
            await updateUnificationRule(togglingRule.rule_id, { is_active: pendingToggleState });
            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: pendingToggleState
                    ? t("customerDataService:unificationRules.list.notifications.ruleEnabled" +
                        ".success.message")
                    : t("customerDataService:unificationRules.list.notifications.ruleDisabled" +
                        ".success.message"),
                description: pendingToggleState
                    ? t("customerDataService:unificationRules.list.notifications.ruleEnabled" +
                        ".success.description", { ruleName: togglingRule.rule_name })
                    : t("customerDataService:unificationRules.list.notifications.ruleDisabled" +
                        ".success.description", { ruleName: togglingRule.rule_name })
            }));
            setShowToggleModal(false);
            // Re-fetch the rules list.
            mutate?.();
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: t("customerDataService:unificationRules.list.notifications.toggleFailed" +
                    ".error.message"),
                description: error?.message ||
                    t("customerDataService:unificationRules.list.notifications.toggleFailed" +
                        ".error.description")
            }));
        } finally {
            setIsToggleInProgress(false);
            setTogglingRule(null);
        }
    };

    // ── Delete handler ────────────────────────────────────────
    const handleDelete = async () => {
        if (!deletingRule) return;
        setIsDeleting(true);
        try {
            await deleteUnificationRule(deletingRule.rule_id);
            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:unificationRules.common.notifications.deleted.message"),
                description: t("customerDataService:unificationRules.common.notifications" +
                    ".deleted.description")
            }));
            onDelete?.();
            // Re-fetch the rules list.
            mutate?.();
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: t("customerDataService:unificationRules.common.notifications" +
                    ".deletionFailed.message"),
                description: error?.message ||
                    t("customerDataService:unificationRules.common.notifications" +
                        ".deletionFailed.description")
            }));
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeletingRule(null);
        }
    };

    // ── Columns ───────────────────────────────────────────────
    const columns: TableColumnInterface[] = [
        {
            dataIndex: "rule_name",
            id: "rule_name",
            key: "rule_name",
            title: t("customerDataService:unificationRules.list.columns.rule"),
            render: (rule: UnificationRuleModel) => (
                <Box sx={ { display: "flex", alignItems: "center" } }>
                    <AppAvatar
                        image={ <AnimatedAvatar name={ rule.rule_name } size="mini" /> }
                        size="mini"
                        spaced="right"
                    />
                    <Header.Content>{ rule.rule_name }</Header.Content>
                </Box>
            )
        },
        {
            dataIndex: "property_name",
            id: "property_name",
            key: "property_name",
            title: t("customerDataService:unificationRules.list.columns.attribute"),
            render: (rule: UnificationRuleModel) => {
                const suffix = getPropertySuffix(rule.property_name);
                const scope = getPropertyScope(rule.property_name);

                const scopeStyle = scope === "Identity Attribute"
                    ? { color: "#00796b", fontWeight: 500, backgroundColor: "#e0f2f1" }
                    : { color: "#0082c3", fontWeight: 500, backgroundColor: "#dcf0fa" };

                return (
                    <Header as="h6">
                        <Header.Content>
                            <Header.Subheader>
                                { suffix }
                                { scope && (
                                    <Label
                                        pointing="left"
                                        size="mini"
                                        style={ scopeStyle }
                                    >
                                        { scope }
                                    </Label>
                                ) }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                );
            }
        },
        {
            dataIndex: "priority",
            id: "priority",
            key: "priority",
            title: t("customerDataService:unificationRules.list.columns.priority"),
            render: (rule: UnificationRuleModel) => {
                const moveUpDisabled = !canMoveUp(rule) || isSwapping;
                const moveDownDisabled = !canMoveDown(rule) || isSwapping;

                return (
                    <Box sx={ { display: "flex", alignItems: "center", gap: "4px" } }>
                        <Typography
                            variant="body2"
                            sx={ {
                                minWidth: "24px",
                                textAlign: "center",
                                fontWeight: 500,
                                color: isSwapping ? "#9ca3af" : "#374151"
                            } }
                        >
                            { rule.priority }
                        </Typography>
                        <Tooltip
                            title={ t("customerDataService:unificationRules.list.actions.moveUp") }
                        >
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={ () => handlePriorityMove(rule, "up") }
                                    disabled={ moveUpDisabled }
                                    sx={ {
                                        padding: "4px",
                                        color: moveUpDisabled ? "#d1d5db" : "#6b7280",
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            color: "primary.main"
                                        }
                                    } }
                                >
                                    <ArrowUpwardIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip
                            title={ t("customerDataService:unificationRules.list.actions.moveDown") }
                        >
                            <span>
                                <IconButton
                                    size="small"
                                    onClick={ () => handlePriorityMove(rule, "down") }
                                    disabled={ moveDownDisabled }
                                    sx={ {
                                        padding: "4px",
                                        color: moveDownDisabled ? "#d1d5db" : "#6b7280",
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            color: "primary.main"
                                        }
                                    } }
                                >
                                    <ArrowDownwardIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                );
            }
        },
        {
            dataIndex: "is_active",
            id: "is_active",
            key: "is_active",
            title: t("customerDataService:unificationRules.list.columns.enabled"),
            render: (rule: UnificationRuleModel) => (
                <Box sx={ { display: "flex", justifyContent: "flex-end", alignItems: "center" } }>
                    <Tooltip title={ rule.is_active
                        ? t("customerDataService:unificationRules.list.actions.disable")
                        : t("customerDataService:unificationRules.list.actions.enable")
                    }>
                        <Switch
                            checked={ rule.is_active }
                            onChange={ (event) => handleToggleChange(event, rule) }
                            disabled={ isSwapping }
                            size="small"
                            color="primary"
                        />
                    </Tooltip>
                </Box>
            )
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "action",
            key: "action",
            title: "",
            textAlign: "right"
        }
    ];

    const actions: TableActionsInterface[] = [
        {
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_: SyntheticEvent, rule: UnificationRuleModel): void => {
                setDeletingRule(rule);
                setShowDeleteModal(true);
            },
            popupText: (): string =>
                t("customerDataService:unificationRules.list.actions.delete"),
            renderer: "semantic-icon",
            hidden: (rule: UnificationRuleModel) =>
                rule.property_name === "user_id" || isSwapping
        }
    ];

    return (
        <>
            <DataTable<UnificationRuleModel>
                isLoading={ isLoading }
                columns={ columns }
                data={ sortedRules }
                actions={ actions }
                showHeader={ true }
                showActions={ true }
                onRowClick={ () => {} }
            />

            {/* ── Toggle confirmation modal ── */}
            { togglingRule && (
                <ConfirmationModal
                    onClose={ () => { setShowToggleModal(false); setTogglingRule(null); } }
                    type="warning"
                    open={ showToggleModal }
                    primaryAction={ t("customerDataService:common.buttons.confirm") }
                    secondaryAction={ t("customerDataService:common.buttons.cancel") }
                    onSecondaryActionClick={ () => { setShowToggleModal(false); setTogglingRule(null); } }
                    onPrimaryActionClick={ handleToggleConfirm }
                    closeOnDimmerClick={ false }
                    primaryActionLoading={ isToggleInProgress }
                >
                    <ConfirmationModal.Header>
                        { pendingToggleState
                            ? t("customerDataService:unificationRules.list.confirmations" +
                                ".toggle.enableHeader")
                            : t("customerDataService:unificationRules.list.confirmations" +
                                ".toggle.disableHeader")
                        }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { pendingToggleState
                            ? t("customerDataService:unificationRules.list.confirmations" +
                                ".toggle.enableMessage")
                            : t("customerDataService:unificationRules.list.confirmations" +
                                ".toggle.disableMessage")
                        }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { pendingToggleState
                            ? t("customerDataService:unificationRules.list.confirmations" +
                                ".toggle.enableContent", { ruleName: togglingRule.rule_name })
                            : t("customerDataService:unificationRules.list.confirmations" +
                                ".toggle.disableContent", { ruleName: togglingRule.rule_name })
                        }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }

            {/* ── Delete confirmation modal ── */}
            { deletingRule && (
                <ConfirmationModal
                    onClose={ () => { setDeletingRule(null); setShowDeleteModal(false); } }
                    type="negative"
                    open={ showDeleteModal }
                    assertionHint={ t("customerDataService:unificationRules.list.confirmations" +
                        ".delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("customerDataService:common.buttons.confirm") }
                    secondaryAction={ t("customerDataService:common.buttons.cancel") }
                    onSecondaryActionClick={ () => { setShowDeleteModal(false); setDeletingRule(null); } }
                    onPrimaryActionClick={ () => handleDelete() }
                    closeOnDimmerClick={ false }
                    loading={ isDeleting }
                >
                    <ConfirmationModal.Header>
                        { t("customerDataService:unificationRules.list.confirmations.delete.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("customerDataService:unificationRules.list.confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("customerDataService:unificationRules.list.confirmations.delete.content",
                            { ruleName: deletingRule.rule_name }) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};
