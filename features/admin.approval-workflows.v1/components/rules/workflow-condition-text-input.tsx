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

import TextField from "@oxygen-ui/react/TextField";
import useRulesContext from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ExpressionFieldTypes } from "@wso2is/admin.rules.v1/models/rules";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";

/**
 * Props interface of {@link WorkflowConditionTextInput}
 */
export interface WorkflowConditionTextInputPropsInterface {
    expressionValue: string;
    ruleId: string;
    conditionId: string;
    expressionId: string;
    readonly?: boolean;
    showValidationError?: boolean;
}

/**
 * Text input value component with local state to prevent focus loss.
 * Commits the value to the context on blur instead of on every keystroke.
 *
 * @param props - Props injected to the component.
 * @returns WorkflowConditionTextInput component.
 */
const WorkflowConditionTextInput: FunctionComponent<WorkflowConditionTextInputPropsInterface> = ({
    expressionValue: _expressionValue,
    ruleId: _ruleId,
    conditionId: _conditionId,
    expressionId: _expressionId,
    readonly: isReadonly,
    showValidationError = false
}: WorkflowConditionTextInputPropsInterface): ReactElement => {
    const [ localValue, setLocalValue ] = useState<string>(_expressionValue ?? "");

    const { updateConditionExpression } = useRulesContext();
    const { t } = useTranslation();

    useEffect(() => {
        setLocalValue(_expressionValue ?? "");
    }, [ _expressionValue ]);

    return (
        <TextField
            disabled={ isReadonly }
            value={ localValue }
            data-componentid="workflow-condition-expression-input-text"
            error={ showValidationError }
            fullWidth
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
                setLocalValue(e.target.value);
            } }
            onBlur={ () => {
                if (localValue !== _expressionValue) {
                    updateConditionExpression(
                        localValue,
                        _ruleId,
                        _conditionId,
                        _expressionId,
                        ExpressionFieldTypes.Value,
                        true
                    );
                }
            } }
            placeholder={ t("rules:fields.autocomplete.inputPlaceholderText") }
        />
    );
};

export default WorkflowConditionTextInput;
