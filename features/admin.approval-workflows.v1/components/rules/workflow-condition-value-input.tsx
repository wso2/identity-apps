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

import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import { useRulesContext } from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import {
    ConditionExpressionMetaInterface,
    ExpressionValueInterface,
    LinkInterface,
    ListDataInterface
} from "@wso2is/admin.rules.v1/models/meta";
import { ExpressionFieldTypes } from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { Dispatch, FunctionComponent } from "react";
import RoleAudienceValueSelector from "./role-audience-value-selector";
import WorkflowConditionTextInput from "./workflow-condition-text-input";
import WorkflowResourceListSelect from "./workflow-resource-list-select";
import { APPROVAL_WORKFLOW_RULE_FIELDS } from "../../constants/approval-workflow-constants";

/**
 * Props interface of {@link WorkflowConditionValueInput}
 */
export interface WorkflowConditionValueInputPropsInterface extends IdentifiableComponentInterface {
    conditionId: string;
    expressionId: string;
    expressionValue: string;
    ruleId: string;
    metaValue: ExpressionValueInterface;
    findMetaValuesAgainst: ConditionExpressionMetaInterface;
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
    hiddenResources?: string[];
    hiddenValues?: string[];
    readonly?: boolean;
    showValidationError?: boolean;
}

/**
 * Condition value input component.
 * Routes to the appropriate value renderer based on the meta input type.
 *
 * @param props - Props injected to the component.
 * @returns WorkflowConditionValueInput component.
 */
const WorkflowConditionValueInput: FunctionComponent<WorkflowConditionValueInputPropsInterface> = ({
    ["data-componentid"]: _componentId = "workflow-condition-expression-input-value",
    findMetaValuesAgainst,
    ruleId: _ruleId,
    conditionId: _conditionId,
    expressionId: _expressionId,
    expressionValue: _expressionValue,
    metaValue,
    setIsResourceMissing,
    hiddenResources: _hiddenResources = [],
    hiddenValues: _hiddenValues = [],
    readonly: isReadonly,
    showValidationError = false
}: WorkflowConditionValueInputPropsInterface) => {
    const { updateConditionExpression } = useRulesContext();

    // Custom handler for role.audience field.
    if (findMetaValuesAgainst?.field?.name === APPROVAL_WORKFLOW_RULE_FIELDS.ROLE_AUDIENCE) {
        const audienceValuesUrl: string = metaValue?.links?.find(
            (link: LinkInterface) => link.rel === "values"
        )?.href;
        const audienceFilterUrl: string = metaValue?.links?.find(
            (link: LinkInterface) => link.rel === "filter"
        )?.href;

        return (
            <RoleAudienceValueSelector
                conditionId={ _conditionId }
                expressionId={ _expressionId }
                expressionValue={ _expressionValue }
                ruleId={ _ruleId }
                setIsResourceMissing={ setIsResourceMissing }
                initialResourcesLoadUrl={ audienceValuesUrl }
                filterBaseResourcesUrl={ audienceFilterUrl }
                readonly={ isReadonly }
                showValidationError={ showValidationError }
            />
        );
    }

    // Text input with local state to prevent focus loss.
    if (metaValue?.inputType === "input" || null) {
        return (
            <WorkflowConditionTextInput
                expressionValue={ _expressionValue }
                ruleId={ _ruleId }
                conditionId={ _conditionId }
                expressionId={ _expressionId }
                readonly={ isReadonly }
                showValidationError={ showValidationError }
            />
        );
    }

    if (metaValue?.inputType === "options") {
        if (metaValue?.values?.length > 1) {
            // Set first value of the list if option is empty.
            if (_expressionValue === "") {
                updateConditionExpression(
                    metaValue?.values[0].name,
                    _ruleId,
                    _conditionId,
                    _expressionId,
                    ExpressionFieldTypes.Value,
                    false
                );
            }

            return (
                <Select
                    disabled={ isReadonly }
                    value={ _expressionValue }
                    error={ showValidationError }
                    data-componentid={ _componentId }
                    MenuProps={ {
                        disablePortal: false,
                        sx: { zIndex: 9999 }
                    } }
                    onChange={ (e: SelectChangeEvent) => {
                        updateConditionExpression(
                            e.target.value,
                            _ruleId,
                            _conditionId,
                            _expressionId,
                            ExpressionFieldTypes.Value,
                            true
                        );
                    } }
                >
                    { metaValue.values?.filter((item: ListDataInterface) =>
                        !_hiddenValues.includes(item.name)
                    ).map((item: ListDataInterface, index: number) => (
                        <MenuItem value={ item.name } key={ `${_expressionId}-${index}` }>
                            { item.displayName }
                        </MenuItem>
                    )) }
                </Select>
            );
        }

        if (metaValue?.links?.length >= 1) {
            const resourcesLoadUrl: string = metaValue?.links.find(
                (link: LinkInterface) => link.rel === "values")?.href;
            const filterResourcesUrl: string = metaValue?.links.find(
                (link: LinkInterface) => link.rel === "filter")?.href;

            if (resourcesLoadUrl) {
                return (
                    <WorkflowResourceListSelect
                        ruleId={ _ruleId }
                        conditionId={ _conditionId }
                        setIsResourceMissing={ setIsResourceMissing }
                        expressionId={ _expressionId }
                        expressionValue={ _expressionValue }
                        findMetaValuesAgainst={ findMetaValuesAgainst }
                        initialResourcesLoadUrl={ resourcesLoadUrl }
                        filterBaseResourcesUrl={ filterResourcesUrl }
                        hiddenResources={ _hiddenResources }
                        readonly={ isReadonly }
                        showValidationError={ showValidationError }
                    />
                );
            }

            return null;
        }

        return null;
    }

    return null;
};

export default WorkflowConditionValueInput;
