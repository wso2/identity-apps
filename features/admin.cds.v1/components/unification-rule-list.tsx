import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import {
    DataTable,
    AppAvatar,
    AnimatedAvatar,
    ConfirmationModal,
    Popup
} from "@wso2is/react-components";
import {
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { UnificationRuleInterface } from "../models/unification-rules";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import Chip from "@oxygen-ui/react/Chip/Chip";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { CDM_BASE_URL } from "../models/constants";

interface ResolutionRulesListProps {
    rules: UnificationRuleInterface[];
    isLoading: boolean;
    // onEdit: (rule: UnificationRuleInterface) => void;
    onDelete: (rule: UnificationRuleInterface) => void;
    onSearchQueryClear ?: () => void;
                            searchQuery ?: string;
}

export const UnificationRulesList: FunctionComponent<ResolutionRulesListProps> = ({
    rules,
    isLoading,
    onDelete,
}: ResolutionRulesListProps): ReactElement => {

    const [ deletingRule, setDeletingRule ] = useState<UnificationRuleInterface>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);

    const dispatch = useDispatch();

    const getChipStyles = (scope: string) => {
        switch (scope) {
            case "identity Attribute":
                return {
                    backgroundColor: "#e0f2f1",
                    color: "#00796b",
                    fontWeight: 500,
                    border : "none"
                };
            case "Application Data":
                return {
                    backgroundColor: "#fce4ec",
                    color: "#c2185b",
                    fontWeight: 500,
                    border : "none"
                };
            case "Trait":
                return {
                    backgroundColor: "#dcf0fa",
                    color: "#0082c3",
                    fontWeight: 500,
                    border : "none"
                };
            default:
                return {
                    backgroundColor: "#f5f5f5",
                    color: "#616161",
                    fontWeight: 500,
                    // borderColor: "#bdbdbd"
                };
        }
    };
    
    const handleDelete = async () => {
        try {
            await axios.delete(`${CDM_BASE_URL}/unification-rules/${deletingRule.rule_id}`);
            dispatch(addAlert({
                level: AlertLevels.SUCCESS,
                message: "Deleted",
                description: "The unification rule was successfully deleted."
            }));
            onDelete?.(deletingRule);
        } catch (error) {
            dispatch(addAlert({
                level: AlertLevels.ERROR,
                message: "Delete Failed",
                description: error?.message || "Failed to delete the rule."
            }));
        } finally {
            setShowDeleteModal(false);
            setDeletingRule(null);90
        }
    };

    const columns: TableColumnInterface[] = [
        {
            dataIndex: "rule_name",
            id: "rule_name",
            key: "rule_name",
            title: "Rule",
            render: (rule: UnificationRuleInterface) => {
                const displayName = rule.rule_name;

                return (
                    <div className="header-with-icon">
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ displayName }
                                    size="mini"
                                />
                            ) }
                            size="mini"
                            spaced="right"
                        />
                        <Header.Content>
                            {
                                rule.is_active
                                    ? (
                                        <Popup
                                            trigger={ (
                                                <Icon
                                                    className="mr-2 ml-0 vertical-aligned-baseline"
                                                    size="small"
                                                    name="circle"
                                                    color="green"
                                                />
                                            ) }
                                            content={ "Enabled" }
                                            inverted
                                        />
                                    ) : (
                                        <Popup
                                            trigger={ (
                                                <Icon
                                                    className="mr-2 ml-0 vertical-aligned-baseline"
                                                    size="small"
                                                    name="circle"
                                                    color="orange"
                                                />
                                            ) }
                                            content={ "Disabled" }
                                            inverted
                                        />
                                    )
                            }
                        </Header.Content>
                        <Header.Content>
                        { displayName }
                        </Header.Content>
                    </div>
                );
            }
        },
        {
            dataIndex: "property_name",
            id: "property_name",
            key: "property_name",
            title: "Attribute",
            render: (rule: UnificationRuleInterface) => {
                let suffix = rule.property_name || "";
                let scope: string;

                if (suffix.startsWith("identity_attributes.")) {
                    suffix = suffix.replace("identity_attributes.", "");
                    scope = "Identity Attribute";
                } else if (suffix.startsWith("application_data.")) {
                    suffix = suffix.replace("application_data.", "");
                    scope = "Application Data";
                } else if (suffix.startsWith("traits.")) {
                    suffix = suffix.replace("traits.", "");
                    scope = "Trait";
                }
                else {
                    scope = "Default";
                }
                return (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>{ suffix }</span>
                        { scope && (
                            <Chip size="small" sx={ getChipStyles(scope) } variant="outlined" label={ scope } />
                        ) }
                    </div>
                );
            }
        },
        {
            dataIndex: "priority",
            id: "priority",
            key: "priority",
            title: "Priority"
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "action",
            key: "action",
            title: "",
            textAlign: "right"
        }
    ]
    
    const actions: TableActionsInterface[] = [
        {
            icon: (): SemanticICONS => "pencil alternate",
            onClick: (_: SyntheticEvent, rule: UnificationRuleInterface): void => {
                if (rule.property_name !== "user_id") {
                    history.push(AppConstants.getPaths().get("UNIFICATION_RULE_EDIT").replace(":id", rule.rule_id));
                }
            },
            popupText: (): string => "Edit",
            renderer: "semantic-icon",
            hidden: (rule: UnificationRuleInterface) => rule.property_name === "user_id"
        },
        {
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_: SyntheticEvent, rule: UnificationRuleInterface): void => {
                setDeletingRule(rule);
                setShowDeleteModal(true);
            },
            popupText: (): string => "Delete",
            renderer: "semantic-icon",
            hidden: (rule: UnificationRuleInterface) => rule.property_name === "user_id"
        }
    ];

    return (
        <>
            <DataTable<UnificationRuleInterface>
                isLoading={ isLoading }
                columns={ columns }
                data={ rules }
                actions={ actions }
                showHeader={ true }
                showActions={ true }
                onRowClick={ (e: SyntheticEvent, rule: UnificationRuleInterface): void => {
                    if (rule.property_name === "user_id") {
                        e.preventDefault();
                        return;
                    }
                    history.push(AppConstants.getPaths().get("UNIFICATION_RULE_EDIT").replace(":id", rule.rule_id));
                    
                } }
            />

            {deletingRule && (
                <ConfirmationModal
                    onClose={ () => {
                        setDeletingRule(null);
                        setShowDeleteModal(false);
                    } }
                    type="negative"
                    open={ showDeleteModal }
                    assertionHint="Please confirm the deletion."
                    assertionType="checkbox"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ () => {
                        setShowDeleteModal(false);
                        setDeletingRule(null);
                    } }
                    onPrimaryActionClick={ () => {
                        handleDelete();
                    } }
                    closeOnDimmerClick={ false }
                >
                    <>
                        <ConfirmationModal.Header>Delete Unification Rule</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            Deleting this rule will permanently remove it and it cannot be undone.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            Are you sure you want to delete the rule <b>{ deletingRule.rule_name }</b>?. 
                            Deleting the rule will remove it from engaging in unification of user profiles. Exisiting unification will not be affected.
                        </ConfirmationModal.Content>
                    </>
                </ConfirmationModal>
            )}
        </>
    );
};
