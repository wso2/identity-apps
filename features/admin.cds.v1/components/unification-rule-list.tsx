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

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { Dispatch, FunctionComponent, ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Header, Label, SemanticICONS } from "semantic-ui-react";
import { deleteUnificationRule, updateUnificationRule } from "../api/unification-rules";
import { TEMP_PRIORITY } from "../models/constants";
import { UnificationRuleModel } from "../models/unification-rules";

interface UnificationRulesListProps {
    rules: UnificationRuleModel[];
    isLoading: boolean;
    onDelete: () => void;
    onUpdate?: () => void;
    onSearchQueryClear?: () => void;
    searchQuery?: string;
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
    searchQuery,
    mutate
}: UnificationRulesListProps): ReactElement => {

    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();
    const filteredRules: UnificationRuleModel[] = useMemo(() => {
        if (!searchQuery?.trim()) return rules;

        const query: string = searchQuery.toLowerCase().trim();

        return rules.filter((rule: UnificationRuleModel) => {
            const ruleName: string = rule.rule_name?.toLowerCase() || "";
            const propertyName: string = rule.property_name?.toLowerCase() || "";
            const propertySuffix: string= getPropertySuffix(rule.property_name)?.toLowerCase() || "";
            const scope: string = getPropertyScope(rule.property_name)?.toLowerCase() || "";

            return (
                ruleName.includes(query) ||
                propertyName.includes(query) ||
                propertySuffix.includes(query) ||
                scope.includes(query)
            );
        });
    }, [ rules, searchQuery ]);

    const sortedRules: UnificationRuleModel[] = useMemo(
        () => [ ...filteredRules ].sort((a:UnificationRuleModel, b:UnificationRuleModel) => a.priority - b.priority),
        [ filteredRules ]
    );

    const [ deletingRule, setDeletingRule ] = useState<UnificationRuleModel | null>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const [ isDeleting, setIsDeleting ] = useState(false);
    const [ isSwapping, setIsSwapping ] = useState(false);
    const [ togglingRule, setTogglingRule ] = useState<UnificationRuleModel | null>(null);
    const [ pendingToggleState, setPendingToggleState ] = useState<boolean>(false);
    const [ showToggleModal, setShowToggleModal ] = useState(false);
    const [ isToggleInProgress, setIsToggleInProgress ] = useState(false);

    const canMoveUp = (rule: UnificationRuleModel): boolean => {
        const idx: number = sortedRules.findIndex((r: UnificationRuleModel) => r.rule_id === rule.rule_id);

        return idx > 0;
    };

    const canMoveDown = (rule: UnificationRuleModel): boolean => {
        const idx: number = sortedRules.findIndex((r: UnificationRuleModel) => r.rule_id === rule.rule_id);

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

        const currentIndex: number = sortedRules.findIndex((r: UnificationRuleModel) => r.rule_id === rule.rule_id);

        if (currentIndex === -1) return;

        const swapIndex: number = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (swapIndex < 0 || swapIndex >= sortedRules.length) return;

        const adjacentRule: UnificationRuleModel = sortedRules[swapIndex];
        const originalPriority: number = rule.priority;
        const targetPriority: number = adjacentRule.priority;

        setIsSwapping(true);

        try {
            // Step 1: Move rule A to a temporary priority to free up the slot.
            await updateUnificationRule(rule.rule_id, { priority: TEMP_PRIORITY });
            // Step 2: Move rule B to rule A's original priority.
            await updateUnificationRule(adjacentRule.rule_id, { priority: originalPriority });
            // Step 3: Move rule A to rule B's original priority.
            await updateUnificationRule(rule.rule_id, { priority: targetPriority });

            dispatch(addAlert({
                description: t("customerDataService:unificationRules.list.notifications.priorityUpdated" +
                    ".success.description", { direction, ruleName: rule.rule_name }),
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:unificationRules.list.notifications.priorityUpdated" +
                    ".success.message")
            }));

            // Re-fetch the rules list.
            mutate?.();
        } catch (error) {
            dispatch(addAlert({
                description: error?.message ||
                    t("customerDataService:unificationRules.list.notifications.priorityUpdated" +
                        ".error.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:unificationRules.list.notifications.priorityUpdated" +
                    ".error.message")
            }));
            // Re-fetch even on error to restore consistent state.
            mutate?.();
        } finally {
            setIsSwapping(false);
        }
    };

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
                description: pendingToggleState
                    ? t("customerDataService:unificationRules.list.notifications.ruleEnabled" +
                    ".success.description", { ruleName: togglingRule.rule_name })
                    : t("customerDataService:unificationRules.list.notifications.ruleDisabled" +
                    ".success.description", { ruleName: togglingRule.rule_name }),
                level: AlertLevels.SUCCESS,
                message: pendingToggleState
                    ? t("customerDataService:unificationRules.list.notifications.ruleEnabled" +
                        ".success.message")
                    : t("customerDataService:unificationRules.list.notifications.ruleDisabled" +
                        ".success.message")
            }));
            setShowToggleModal(false);
            // Re-fetch the rules list.
            mutate?.();
        } catch (error) {
            dispatch(addAlert({
                description: error?.message ||
                    t("customerDataService:unificationRules.list.notifications.toggleFailed" +
                        ".error.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:unificationRules.list.notifications.toggleFailed" +
                    ".error.message")
            }));
        } finally {
            setIsToggleInProgress(false);
            setTogglingRule(null);
        }
    };

    const handleDelete = async () => {
        if (!deletingRule) return;
        setIsDeleting(true);

        try {
            await deleteUnificationRule(deletingRule.rule_id);
            onDelete?.();
            // Re-fetch the rules list.
            mutate?.();
        } catch (error) {
            dispatch(addAlert({
                description: error?.message ||
                    t("customerDataService:unificationRules.common.notifications" +
                        ".deletionFailed.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:unificationRules.common.notifications" +
                    ".deletionFailed.message")
            }));
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDeletingRule(null);
        }
    };

    const columns: TableColumnInterface[] = [
        {
            dataIndex: "rule_name",
            id: "rule_name",
            key: "rule_name",
            render: (rule: UnificationRuleModel) => (
                <Box sx={ { alignItems: "center", display: "flex" } }>
                    <AppAvatar
                        image={ <AnimatedAvatar name={ rule.rule_name } size="mini" /> }
                        size="mini"
                        spaced="right"
                    />
                    <Header.Content>{ rule.rule_name }</Header.Content>
                </Box>
            ),
            title: t("customerDataService:unificationRules.list.columns.rule"),
            width: 3
        },
        {
            dataIndex: "property_name",
            id: "property_name",
            key: "property_name",
            render: (rule: UnificationRuleModel) => {
                const suffix: string = getPropertySuffix(rule.property_name);
                const scope: string = getPropertyScope(rule.property_name);

                const scopeStyle:
                { color: string; fontWeight: number; backgroundColor: string } = scope === "Identity Attribute"
                    ? { backgroundColor: "#e0f2f1", color: "#00796b", fontWeight: 500 }
                    : { backgroundColor: "#dcf0fa", color: "#0082c3", fontWeight: 500 };

                return (
                    <Header as="h6">
                        <Header.Content>
                            <Header.Subheader>
                                <Box
                                    sx={ {
                                        alignItems: "center", display: "inline-flex", gap: "6px", padding: "4px 0" } }>
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
                                </Box>
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                );
            },
            title: t("customerDataService:unificationRules.list.columns.attribute"),
            width: 5
        },
        {
            dataIndex: "priority",
            id: "priority",
            key: "priority",
            render: (rule: UnificationRuleModel) => {
                const moveUpDisabled: boolean = !canMoveUp(rule) || isSwapping;
                const moveDownDisabled: boolean = !canMoveDown(rule) || isSwapping;

                return (
                    <Box sx={ { alignItems: "center", display: "flex", gap: "2px", justifyContent: "center" } }>
                        <Typography
                            variant="body2"
                            sx={ {
                                color: isSwapping ? "text.disabled" : "text.primary",
                                fontWeight: 500,
                                minWidth: "20px",
                                textAlign: "center"
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
                                        color: moveUpDisabled ? "action.disabled" : "text.secondary",
                                        padding: "2px"
                                    } }
                                >
                                    <ArrowUpwardIcon sx={ { fontSize: "16px" } } />
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
                                        color: moveDownDisabled ? "action.disabled" : "text.secondary",
                                        padding: "2px"
                                    } }
                                >
                                    <ArrowDownwardIcon sx={ { fontSize: "16px" } } />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                );
            },
            textAlign: "center",
            title: t("customerDataService:unificationRules.list.columns.priority"),
            width: 2
        },
        {
            dataIndex: "is_active",
            id: "is_active",
            key: "is_active",
            render: (rule: UnificationRuleModel) => (
                <Box sx={ { alignItems: "center", display: "flex", justifyContent: "center" } }>
                    <Tooltip
                        title={ rule.is_active
                            ? t("customerDataService:unificationRules.list.actions.disable")
                            : t("customerDataService:unificationRules.list.actions.enable")
                        }>
                        <Switch
                            checked={ rule.is_active }
                            onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                                handleToggleChange(event, rule) }
                            disabled={ isSwapping }
                            size="small"
                            color="primary"
                        />
                    </Tooltip>
                </Box>
            ),
            textAlign: "center",
            title: t("customerDataService:unificationRules.list.columns.enabled"),
            width: 2
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "action",
            key: "action",
            textAlign: "right",
            title: "",
            width: 1
        }
    ];

    const actions: TableActionsInterface[] = [
        {
            hidden: (rule: UnificationRuleModel) =>
                rule.property_name === "user_id" || isSwapping,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_: SyntheticEvent, rule: UnificationRuleModel): void => {
                setDeletingRule(rule);
                setShowDeleteModal(true);
            },
            popupText: (): string =>
                t("customerDataService:unificationRules.list.actions.delete"),
            renderer: "semantic-icon"
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

            { /* ── Toggle confirmation modal ── */ }
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
                        { pendingToggleState ? (
                            <Trans
                                i18nKey="customerDataService:unificationRules.list.confirmations.toggle.enableContent"
                                values={ { ruleName: togglingRule.rule_name } }
                                components={ [ null, <strong key="0" /> ] }
                            />
                        ) : (
                            <Trans
                                i18nKey="customerDataService:unificationRules.list.confirmations.toggle.disableContent"
                                values={ { ruleName: togglingRule.rule_name } }
                                components={ [ null, <strong key="0" /> ] }
                            />
                        ) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }

            { /* ── Delete confirmation modal ── */ }
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
                        <Trans
                            i18nKey="customerDataService:unificationRules.list.confirmations.delete.content"
                            values={ { ruleName: deletingRule.rule_name } }
                            components={ [ null, <strong key="0" /> ] }
                        />
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};
