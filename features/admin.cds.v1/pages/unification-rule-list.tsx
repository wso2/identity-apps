import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import {
    DataTable,
    AppAvatar,
    AnimatedAvatar,
    ConfirmationModal
} from "@wso2is/react-components";
import {
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { SemanticICONS } from "semantic-ui-react";
import { UnificationRuleInterface } from "../models/unification-rules";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import Chip from "@oxygen-ui/react/Chip/Chip";

interface ResolutionRulesListProps {
    rules: UnificationRuleInterface[];
    isLoading: boolean;
    onEdit: (rule: UnificationRuleInterface) => void;
    onDelete: (rule: UnificationRuleInterface) => void;
}

export const UnificationRulesList: FunctionComponent<ResolutionRulesListProps> = ({
    rules,
    isLoading,
}: ResolutionRulesListProps): ReactElement => {

    const [ deletingRule, setDeletingRule ] = useState<UnificationRuleInterface>(null);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);

    const columns: TableColumnInterface[] = [
        {
            dataIndex: "rule_name",
            id: "rule_name",
            key: "rule_name",
            title: "Rule Name",
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
                        { displayName }
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
                            <Chip size="small" color="primary" variant="outlined" label={ scope } />
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
                onRowClick={ (_: SyntheticEvent, rule: UnificationRuleInterface): void => {
                    if (rule.property_name !== "user_id") {
                        history.push(AppConstants.getPaths().get("UNIFICATION_RULE_EDIT").replace(":id", rule.rule_id));
                    }
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
                        setShowDeleteModal(false);
                        setDeletingRule(null);
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
