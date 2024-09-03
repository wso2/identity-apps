/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { SelectChangeEvent } from "@mui/material/Select";
import Alert from "@oxygen-ui/react/Alert";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemText from "@oxygen-ui/react/ListItemText";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { GroupsInterface } from "@wso2is/admin.groups.v1";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants";
import {
    GovernanceConnectorConstants
} from "@wso2is/admin.server-configurations.v1/constants/governance-connector-constants";
import { RolesInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PasswordExpiryRule, PasswordExpiryRuleAttribute, PasswordExpiryRuleOperator } from "../models";

interface PasswordExpiryRuleListProps {
    componentId: string;
    ruleList: PasswordExpiryRule[];
    isPasswordExpiryEnabled: boolean;
    isSkipFallbackEnabled: boolean;
    defaultPasswordExpiryTime: number;
    rolesList: RolesInterface[];
    groupsList: GroupsInterface[];
    isReadOnly: boolean;
    onSkipFallbackChange: (value: boolean) => void;
    onDefaultPasswordExpiryTimeChange: (value: number) => void;
    onRuleChange: (rules: PasswordExpiryRule[]) => void;
    onRuleError: (hasErrors: boolean) => void;
}

type Resource = RolesInterface | GroupsInterface;

enum Direction {
    UP = "up",
    DOWN = "down"
}

export const PasswordExpiryRuleList: FunctionComponent<PasswordExpiryRuleListProps> = (
    {
        componentId,
        ruleList,
        isPasswordExpiryEnabled,
        isSkipFallbackEnabled,
        defaultPasswordExpiryTime,
        rolesList,
        groupsList,
        isReadOnly,
        onSkipFallbackChange,
        onDefaultPasswordExpiryTimeChange,
        onRuleChange,
        onRuleError
    }: PasswordExpiryRuleListProps
) => {

    const [ rules, setRules ] = useState<PasswordExpiryRule[]>(ruleList);
    const [ hasErrors, setHasErrors ] = useState<{ [key: string]: { values: boolean; expiryDays: boolean } }>({});
    const { t } = useTranslation();

    useEffect(() => {
        setRules(ruleList);
        validateRules(ruleList);
    }, [ ruleList ]);

    /**
     * Validate the password expiry rules.
     *
     * @param rulesToValidate - Password expiry rules to validate.
     */
    const validateRules = (rulesToValidate: PasswordExpiryRule[]) => {
        const ruleValidationErrors: { [key: string]: { values: boolean; expiryDays: boolean } } = {};
        let hasAnyError: boolean = false;

        rulesToValidate.forEach((rule: PasswordExpiryRule) => {
            ruleValidationErrors[rule?.id] = { expiryDays: false, values: false };

            if (rule?.values.length === 0) {
                ruleValidationErrors[rule?.id].values = true;
                hasAnyError = true;
            }

            if (rule?.operator === PasswordExpiryRuleOperator.EQ
                && (rule?.expiryDays <
                    GovernanceConnectorConstants.PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE
                || rule?.expiryDays >
                    GovernanceConnectorConstants.PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE)) {
                ruleValidationErrors[rule?.id].expiryDays = true;
                hasAnyError = true;
            }
        });

        setHasErrors(ruleValidationErrors);
        onRuleError(hasAnyError);
    };


    /**
     * Handle the rule change.
     *
     * @param index - index of the rule.
     * @param field - field to update.
     * @param value - value to update.
     */
    const handleRuleChange = (index: number, field: keyof PasswordExpiryRule, value: any) => {
        const updatedRules: PasswordExpiryRule[] = [ ...rules ];

        updatedRules[index] = { ...updatedRules[index], [field]: value };
        updateRules(updatedRules);
    };

    /**
     * Add a new rule.
     */
    const addRule = () => {
        if (rules?.length >= GovernanceConnectorConstants.PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.
            EXPIRY_RULES_MAX_COUNT) return;

        const newRule: PasswordExpiryRule = {
            attribute: PasswordExpiryRuleAttribute.ROLES,
            expiryDays: 30,
            id: `rule${Date.now()}`,
            operator: PasswordExpiryRuleOperator.EQ,
            priority: 1,
            values: []
        };
        const updatedRules: PasswordExpiryRule[] =
            [ newRule, ...rules.map((rule: PasswordExpiryRule) => ({ ...rule, priority: rule?.priority + 1 })) ];

        updateRules(updatedRules);
    };

    /**
     * Delete a rule.
     *
     * @param id - id of the rule to delete.
     */
    const deleteRule = (id: string) => {
        const updatedRules: PasswordExpiryRule[] = rules
            .filter((rule: PasswordExpiryRule) => rule?.id !== id)
            .map((rule: PasswordExpiryRule, index: number) => ({ ...rule, priority: index + 1 }));

        updateRules(updatedRules);
    };

    /**
     * Update the rules.
     *
     * @param updatedRules - Updated rules.
     */
    const updateRules = (updatedRules: PasswordExpiryRule[]) => {
        setRules(updatedRules);
        onRuleChange(updatedRules);
    };

    /**
     * Move the priority of a rule.
     *
     * @param index - index of the rule.
     * @param direction - direction to move the rule.
     */
    const movePriority = (index: number, direction: Direction) => {
        if ((direction === Direction.UP && index === 0) || (direction === Direction.DOWN && index === rules.length - 1))
        {
            return;
        }
        const updatedRules: PasswordExpiryRule[] = [ ...rules ];
        const swapIndex: number = direction === Direction.UP ? index - 1 : index + 1;

        [ updatedRules[index], updatedRules[swapIndex] ] = [ updatedRules[swapIndex], updatedRules[index] ];
        updatedRules.forEach((rule: PasswordExpiryRule, i: number) => rule.priority = i + 1);
        updateRules(updatedRules);
    };

    const attributeOptions: {label: string, value: PasswordExpiryRuleAttribute}[] = [
        { label: t("validation:passwordExpiry.rules.attributes.roles"), value: PasswordExpiryRuleAttribute.ROLES },
        { label: t("validation:passwordExpiry.rules.attributes.groups"), value: PasswordExpiryRuleAttribute.GROUPS }
    ];

    const operatorOptions: { label: string, value: PasswordExpiryRuleOperator }[] = [
        { label: t("validation:passwordExpiry.rules.actions.apply"), value: PasswordExpiryRuleOperator.EQ },
        { label: t("validation:passwordExpiry.rules.actions.skip"), value: PasswordExpiryRuleOperator.NE }
    ];

    /**
     * Handle the expiry days change.
     *
     * @param index - index of the rule.
     * @param value - value to update.
     */
    const handleExpiryDaysChange = (index: number, value: string) => {
        const newValue: number = value === "" ? 0 : parseInt(value);

        handleRuleChange(index, "expiryDays", newValue);
    };

    /**
     * Handle the rule values change.
     *
     * @param index - index of the rule.
     * @param event - event object.
     * @param isRole - is the object a role.
     */
    const handleValuesChange = (index: number, event: SelectChangeEvent<string[]>, isRole: boolean) => {
        const {
            target: { value }
        } = event;

        const selectedValues: string[] = typeof value === "string" ? value.split(",") : value;
        const validList: Resource[] = isRole ? rolesList : groupsList;
        const validatedValues: string[] = selectedValues.filter((selectedValue: string) =>
            validList.some((item: Resource) => item.id === selectedValue)
        ).slice(0, GovernanceConnectorConstants.PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_RULE_MAX_VALUES_PER_RULE);

        handleRuleChange(
            index,
            "values",
            validatedValues
        );
    };

    /**
     * Get the identifier of the role or group.
     *
     * @param resource - Role or Group object.
     * @param isRole - is the object a role.
     * @returns - Identifier of the role or group.
     */
    const getResourceIdentifier = (resource: Resource, isRole: boolean): string => {
        if (isRole) {
            const { audience } = resource as RolesInterface;

            return audience?.type?.toLowerCase() === RoleAudienceTypes.APPLICATION.toLowerCase()
                ? `application | ${audience?.display}`
                : audience?.type ?? "";
        }

        const { displayName } = resource as GroupsInterface;

        return displayName?.includes("/")
            ? displayName.split("/")[0]
            : userstoresConfig?.primaryUserstoreName;
    };

    /**
     * Get the display name of the role or group.
     *
     * @param resource - Role or Group object.
     * @param isRole - is the object a role.
     * @returns - Display name of the role or group.
     */
    const getResourceDisplayName = (resource: Resource, isRole: boolean): string => {
        if (isRole) {
            return resource.displayName ?? "";
        }
        const { displayName } = resource as GroupsInterface;

        return displayName?.includes("/")
            ? displayName.split("/")[1]
            : displayName ?? "";
    };

    /**
     * Render the resource (roles or groups) menu items.
     *
     * @param rule - password expiry rule.
     */
    const renderResourceMenuItems = (rule: PasswordExpiryRule): ReactElement[] => {
        const isRoleAttribute: boolean = rule?.attribute === PasswordExpiryRuleAttribute.ROLES;
        const valueOptions: Resource[] = isRoleAttribute ? rolesList : groupsList;

        return (
            valueOptions.map((item: Resource) => (
                <MenuItem key={ item.id } value={ item.id } className="flex-row-gap-10">
                    <Checkbox checked={ rule?.values.indexOf(item.id) > -1 } />
                    <Chip label={ getResourceIdentifier(item, isRoleAttribute) } />
                    <ListItemText primary={ getResourceDisplayName(item, isRoleAttribute) } />
                </MenuItem>
            ))
        );
    };

    /**
     * Render the selected rule values.
     *
     * @param selected - selected rule values.
     * @param rule - password expiry rule.
     */
    const renderSelectedValues = (selected: string[], rule: PasswordExpiryRule): ReactElement[] | ReactElement => {
        if (!selected || selected?.length === 0) {
            return null;
        }
        // console.log("testing:selected:", selected, "\n", rule);
        const isRoleAttribute: boolean = rule?.attribute === PasswordExpiryRuleAttribute.ROLES;
        const resourceList: Resource[] = isRoleAttribute ? rolesList : groupsList;
        const firstItem: Resource | undefined =
                resourceList?.find((resource: Resource) => resource.id === selected[0]);

        if (!firstItem) {
            return null;
        }

        return (
            <div className="flex-row-gap-10">
                <div className="flex-row-gap-10">
                    <Chip label={ getResourceIdentifier(firstItem, isRoleAttribute) } size="small" />
                    <ListItemText primary={ getResourceDisplayName(firstItem, isRoleAttribute) } />
                </div>
                { selected?.length > 1 && (
                    <Chip label={ `+${selected?.length - 1} ${t("common:more")}` } size="small" />
                ) }
            </div>
        );
    };

    /**
     * Handle the default behavior change.
     *
     * @param event - event object.
     */
    const handleSkipFallbackChange = (event: SelectChangeEvent<PasswordExpiryRuleOperator>) => {
        const value: PasswordExpiryRuleOperator = event.target.value as PasswordExpiryRuleOperator;

        onSkipFallbackChange(value === PasswordExpiryRuleOperator.NE);
    };

    /**
     * Handle the default expiry time change.
     *
     * @param event - event object.
     */
    const handleDefaultExpiryTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value: number = parseInt(event.target.value, 10);

        onDefaultPasswordExpiryTimeChange(value);
    };

    return (
        <div data-componentid={ componentId }>
            <div className="flex-row-gap-10">
                <Select
                    value={ isSkipFallbackEnabled ? PasswordExpiryRuleOperator.NE : PasswordExpiryRuleOperator.EQ }
                    onChange={ handleSkipFallbackChange }
                    disabled={ !isPasswordExpiryEnabled }
                    readOnly={ isReadOnly }
                    data-componentid={ `${componentId}-skip-fallback-select` }
                >
                    { operatorOptions.map((option: { label: string, value: PasswordExpiryRuleOperator }) => (
                        <MenuItem key={ option.value } value={ option.value }>
                            { option.label }
                        </MenuItem>
                    )) }
                </Select>
                { !isSkipFallbackEnabled
                    ? (
                        <div className="flex-row-gap-10">
                            <TextField
                                type="number"
                                value={ defaultPasswordExpiryTime }
                                data-componentid={ `${componentId}-default-expiry-time` }
                                onChange={ handleDefaultExpiryTimeChange }
                                disabled={ !isPasswordExpiryEnabled }
                                inputProps={ {
                                    max: GovernanceConnectorConstants.
                                        PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE,
                                    min: GovernanceConnectorConstants.
                                        PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE,
                                    readOnly: isReadOnly
                                } }
                            />
                            { t("validation:passwordExpiry.rules.messages.defaultRuleApplyMessage") }
                        </div>
                    )
                    : (" " + t("validation:passwordExpiry.rules.messages.defaultRuleSkipMessage"))
                }
            </div>
            <Alert severity="info" className="info-box">
                { t("validation:passwordExpiry.rules.messages.info") }
            </Alert>
            <Button
                variant="text"
                onClick={ addRule }
                className="add-rule-btn"
                disabled={ !isPasswordExpiryEnabled || isReadOnly }
                data-componentid={ `${componentId}-add-rule` }
            >
                <div className="flex-row-gap-10">
                    <PlusIcon />
                    { t("validation:passwordExpiry.rules.buttons.addRule") }
                </div>
            </Button>
            {
                rules?.length > 0 && (
                    <div>
                        { t("validation:passwordExpiry.rules.messages.ifUserHas") }
                    </div>
                )
            }
            <List>
                { rules?.map((rule: PasswordExpiryRule, index: number) => (
                    <ListItem key={ rule?.id }>
                        <Grid container spacing={ 2 } alignItems="center" className="full-width">
                            <Grid md={ 1 }>
                                <div className="priority-arrows">
                                    <IconButton
                                        onClick={ () => movePriority(index, Direction.UP) }
                                        disabled={ !isPasswordExpiryEnabled || index === 0 || isReadOnly }
                                        data-componentid={ `${componentId}-move-up-${index}` }
                                    >
                                        <ChevronUpIcon
                                            fill="#000000"
                                        />
                                    </IconButton>
                                    <IconButton
                                        disabled={ !isPasswordExpiryEnabled
                                            || index === rules.length - 1
                                            || isReadOnly }
                                        onClick={ () => movePriority(index, Direction.DOWN) }
                                        data-componentid={ `${componentId}-move-down-${index}` }
                                    >
                                        <ChevronDownIcon
                                            fill="#000000"
                                        />
                                    </IconButton>
                                </div>
                            </Grid>
                            <Grid md={ 1.5 }>
                                <Select
                                    value={ rule?.attribute }
                                    onChange={ (e: SelectChangeEvent<PasswordExpiryRuleAttribute>) =>
                                        handleRuleChange(
                                            index,
                                            "attribute",
                                            e.target.value as PasswordExpiryRuleAttribute
                                        )
                                    }
                                    fullWidth
                                    readOnly={ isReadOnly }
                                    disabled={ !isPasswordExpiryEnabled }
                                    data-componentid={ `${componentId}-attribute-select-${index}` }
                                >
                                    { attributeOptions?.map((
                                        option: { label: string, value: PasswordExpiryRuleAttribute }
                                    ) => (
                                        <MenuItem key={ option.value } value={ option.value }>
                                            { option.label }
                                        </MenuItem>
                                    )) }
                                </Select>
                            </Grid>
                            <Grid md={ 4 }>
                                <Select
                                    className="select-multiple-menu"
                                    labelId={ `${componentId}-values-select-label-${index}` }
                                    data-componentid={ `${componentId}-values-select-${index}` }
                                    multiple
                                    readOnly={ isReadOnly }
                                    value={ rule?.values }
                                    onChange={ (e: SelectChangeEvent<string[]>) =>
                                        handleValuesChange(
                                            index,
                                            e as SelectChangeEvent<string[]>,
                                            rule?.attribute === PasswordExpiryRuleAttribute.ROLES) }
                                    renderValue={ (selected: string[]) => renderSelectedValues(selected, rule) }
                                    disabled={ !isPasswordExpiryEnabled }
                                    error={ hasErrors[rule?.id]?.values }
                                >
                                    {
                                        renderResourceMenuItems(rule)
                                    }
                                </Select>
                            </Grid>
                            <Grid md={ 1.5 }>
                                <Select
                                    value={ rule?.operator }
                                    onChange={ (e: SelectChangeEvent<PasswordExpiryRuleOperator>) =>
                                        handleRuleChange(index, "operator", e.target.value) }
                                    fullWidth
                                    readOnly={ isReadOnly }
                                    disabled={ !isPasswordExpiryEnabled }
                                    data-componentid={ `${componentId}-operator-select-${index}` }
                                >
                                    { operatorOptions.map((
                                        option: { label: string, value: PasswordExpiryRuleOperator }
                                    ) => (
                                        <MenuItem key={ option.value } value={ option.value }>
                                            { option.label }
                                        </MenuItem>
                                    )) }
                                </Select>
                            </Grid>
                            { rule?.operator === PasswordExpiryRuleOperator.EQ && (
                                <Grid md={ 1 }>
                                    <TextField
                                        id="expiryDays"
                                        data-componentid={ `${componentId}-expiry-days-${index}` }
                                        required
                                        value={ rule?.expiryDays }
                                        type="number"
                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleExpiryDaysChange(index, e.target.value) }
                                        inputProps={ {
                                            max: GovernanceConnectorConstants.
                                                PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MAX_VALUE,
                                            min: GovernanceConnectorConstants.
                                                PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS.EXPIRY_TIME_MIN_VALUE,
                                            readOnly: isReadOnly
                                        } }
                                        error={ hasErrors[rule?.id]?.expiryDays }
                                        disabled={ !isPasswordExpiryEnabled }
                                    />
                                </Grid>
                            ) }
                            <Grid md={ 2.5 } className="flex-row">
                                { rule?.operator === PasswordExpiryRuleOperator.EQ
                                    ? t("validation:passwordExpiry.rules.messages.applyMessage")
                                    : t("validation:passwordExpiry.rules.messages.skipMessage") }
                            </Grid>
                            { rule?.operator === PasswordExpiryRuleOperator.NE && (
                                <Grid md={ 1 }>
                                    <div></div>
                                </Grid>
                            ) }
                            <Grid md={ 0.5 }>
                                <IconButton
                                    disabled={ isReadOnly || !isPasswordExpiryEnabled }
                                    onClick={ () => deleteRule(rule?.id) }
                                    data-componentid={ `${componentId}-delete-rule-${index}` }
                                >
                                    <TrashIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </ListItem>
                )) }
            </List>
        </div>
    );
};
