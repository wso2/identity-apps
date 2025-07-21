/**
 *  Application list item model.
 */
export interface UnificationRuleInterface {
    rule_id: string;
    property_name: string;
    rule_name: string;
    is_active: boolean;
    priority: number;
}

export interface UnificationRuleListInterface  extends UnificationRuleInterface {
    image: string;
}

