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

import Autocomplete, {
    AutocompleteInputChangeReason,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import TextField from "@oxygen-ui/react/TextField";
import { useRulesContext } from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ConditionExpressionMetaInterface, ListDataInterface } from "@wso2is/admin.rules.v1/models/meta";
import { ExpressionFieldTypes } from "@wso2is/admin.rules.v1/models/rules";
import { Code } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";

/**
 * Workflow claim selector option interface.
 */
export interface WorkflowClaimOptionInterface {
    id: string;
    label: string;
    claimUri: string;
    fieldName: string;
}

/**
 * Workflow claim selector props interface.
 */
interface WorkflowClaimSelectorPropsInterface {
    claimOptions: WorkflowClaimOptionInterface[];
    conditionId: string;
    expressionField: string;
    expressionId: string;
    expressionOperator: string;
    readonly?: boolean;
    ruleId: string;
}

/**
 * Component for selecting a specific claim within a workflow claim group
 * (e.g., user.claims or initiator.claims).
 *
 * Renders the second dropdown used only for grouped workflow claim fields.
 */
const WorkflowClaimSelector: FunctionComponent<WorkflowClaimSelectorPropsInterface> = ({
    claimOptions,
    conditionId,
    expressionField,
    expressionId,
    expressionOperator,
    readonly: isReadonly = false,
    ruleId
}: WorkflowClaimSelectorPropsInterface): ReactElement => {
    const { conditionExpressionsMeta, updateConditionExpression } = useRulesContext();
    const { t } = useTranslation();

    const selectedClaimOption: WorkflowClaimOptionInterface | null = claimOptions.find(
        (claimOption: WorkflowClaimOptionInterface) => claimOption.fieldName === expressionField
    ) ?? null;
    const [ inputValue, setInputValue ] = useState<string>(selectedClaimOption?.label ?? "");

    useEffect(() => {
        setInputValue(selectedClaimOption?.label ?? "");
    }, [ selectedClaimOption?.fieldName, selectedClaimOption?.label ]);

    return (
        <Autocomplete
            fullWidth
            disabled={ isReadonly }
            aria-label={ t("approvalWorkflows:pageLayout.create.ruleConditions.fields.workflowClaimSelector") }
            className="pt-2"
            componentsProps={ {
                paper: {
                    elevation: 2
                },
                popper: {
                    modifiers: [
                        {
                            enabled: false,
                            name: "flip"
                        },
                        {
                            enabled: false,
                            name: "preventOverflow"
                        }
                    ]
                }
            } }
            inputValue={ inputValue }
            value={ selectedClaimOption }
            onInputChange={ (
                _event: SyntheticEvent<Element, Event>,
                value: string,
                reason: AutocompleteInputChangeReason
            ): void => {
                if (reason === "reset") {
                    setInputValue(selectedClaimOption?.label ?? "");

                    return;
                }

                setInputValue(value);
            } }
            onChange={ (
                _event: SyntheticEvent<Element, Event>,
                value: WorkflowClaimOptionInterface | null
            ): void => {
                if (!value) {
                    return;
                }

                const selectedClaimMeta: ConditionExpressionMetaInterface | undefined = conditionExpressionsMeta
                    ?.find((meta: ConditionExpressionMetaInterface) => meta?.field?.name === value.fieldName);
                const nextOperator: string = selectedClaimMeta?.operators?.some(
                    (operator: ListDataInterface) => operator.name === expressionOperator
                )
                    ? expressionOperator
                    : selectedClaimMeta?.operators?.[0]?.name || "";

                updateConditionExpression(
                    value.fieldName,
                    ruleId,
                    conditionId,
                    expressionId,
                    ExpressionFieldTypes.Field,
                    true
                );

                if (nextOperator !== expressionOperator) {
                    updateConditionExpression(
                        nextOperator,
                        ruleId,
                        conditionId,
                        expressionId,
                        ExpressionFieldTypes.Operator,
                        true
                    );
                }
            } }
            options={ claimOptions }
            getOptionLabel={ (claim: WorkflowClaimOptionInterface) =>
                claim?.label
            }
            isOptionEqualToValue={
                (option: WorkflowClaimOptionInterface, value: WorkflowClaimOptionInterface) =>
                    value?.fieldName && option.fieldName === value.fieldName
            }
            renderOption={ (
                props: HTMLAttributes<HTMLLIElement>,
                option: WorkflowClaimOptionInterface
            ) => (
                <li { ...props } key={ option.fieldName }>
                    <div className="multiline">
                        <div>{ option.label }</div>
                        <div>
                            <Code className="description" compact withBackground={ false }>
                                { option.claimUri }
                            </Code>
                        </div>
                    </div>
                </li>
            ) }
            renderInput={ (params: AutocompleteRenderInputParams) => (
                <TextField
                    { ...params }
                    variant="outlined"
                    placeholder={ t("rules:fields.autocomplete.placeholderText") }
                    value={ inputValue }
                    InputProps={ {
                        ...params.InputProps
                    } }
                />
            ) }
            key="workflowClaimSelector"
            data-componentid={ "rules-condition-expression-input-workflow-claim-select" }
        />
    );
};

export default WorkflowClaimSelector;
