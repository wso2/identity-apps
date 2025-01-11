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

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { SelectChangeEvent } from "@mui/material";
import Autocomplete from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Divider from "@oxygen-ui/react/Divider";
import Fab from "@oxygen-ui/react/Fab";
import FormControl from "@oxygen-ui/react/FormControl";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import debounce from "lodash-es/debounce";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import useGetResourcesList from "../api/use-get-resource-list";
import { useRulesContext } from "../hooks/use-rules-context";
import {
    ConditionExpressionMetaInterface,
    ExpressionValueInterface,
    LinkInterface,
    ListDataInterface
} from "../models/meta";
import {
    AdjoiningOperatorTypes,
    ConditionExpressionInterface,
    ExpressionFieldTypes,
    RuleConditionInterface,
    RuleConditionsInterface,
    RuleInterface
} from "../models/rules";
import "./rules-component.scss";

/**
 * Value input autocomplete props interface.
 */
interface ValueInputAutocompleteProps {
    metaValue: ExpressionValueInterface;
    resourceType: string;
}

/**
 * Condition value input props interface.
 */
interface ConditionValueInputProps {
    metaValue: ExpressionValueInterface;
}

/**
 * Props interface of {@link RulesComponent}
 */
export interface RulesComponentPropsInterface extends IdentifiableComponentInterface {
    rule: RuleInterface;
}

/**
 * Rules condition component to recursive render.
 *
 * @param props - Props injected to the component.
 * @returns Rule condition component.
 */
const RuleConditions: FunctionComponent<RulesComponentPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-component",
    rule: ruleInstance
}: RulesComponentPropsInterface): ReactElement => {
    const ruleConditions: RuleConditionsInterface = ruleInstance.rules;

    const {
        addNewRuleConditionExpression,
        conditionExpressionsMeta,
        updateConditionExpression,
        removeRuleConditionExpression
    } = useRulesContext();

    /**
     * Rule expression component to recursive render.
     *
     * @param props - Props injected to the component.
     * @returns Rule expression component.
     */
    const RuleExpression = ({
        expression,
        ruleId,
        conditionId,
        index,
        isConditionExpressionRemovable
    }: {
        expression: ConditionExpressionInterface;
        ruleId: string;
        conditionId: string;
        index: number;
        isConditionExpressionRemovable: boolean;
    }) => {
        const [ localField, setLocalField ] = useState<string>(expression.field);
        const [ localOperator, setLocalOperator ] = useState<string>(expression.operator);
        const [ localValue, setLocalValue ] = useState<string>(expression.value);

        const [ metaOperators, setMetaOperators ] =
            useState<ListDataInterface[]>(conditionExpressionsMeta[0]?.operators);
        const [ metaValue, setMetaValue ] = useState<ExpressionValueInterface>(conditionExpressionsMeta[0]?.value);

        useEffect(() => {
            conditionExpressionsMeta?.map((expressionMeta: ConditionExpressionMetaInterface) => {
                if (expressionMeta.field.name === localField) {
                    setMetaOperators(expressionMeta.operators);
                    setMetaValue(expressionMeta.value);

                    return;
                }

                return;
            });
        }, [ localField ]);

        /**
         * Debounced function to handle the change of the condition expression.
         *
         * @param changedValue - Changed value.
         * @param ruleId - Rule id.
         * @param conditionId - Condition id.
         * @param expressionId - Expression id.
         * @param fieldName - Field name.
         * @returns Debounced function.
         */
        const handleExpressionChangeDebounced: (
            changedValue: string,
            ruleId: string,
            conditionId: string,
            expressionId: string,
            fieldName: ExpressionFieldTypes
        ) => void = debounce(
            (
                changedValue: string,
                ruleId: string,
                conditionId: string,
                expressionId: string,
                fieldName: ExpressionFieldTypes
            ) => {
                updateConditionExpression(changedValue, ruleId, conditionId, expressionId, fieldName);
            },
            300
        );

        /**
         * Value input autocomplete component.
         *
         * @param metaValue - Meta value.
         * @param resourceType - Resource type.
         * @returns Value input autocomplete component.
         */
        const ValueInputAutocomplete: FunctionComponent<ValueInputAutocompleteProps> = ({
            metaValue,
            resourceType
        }: ValueInputAutocompleteProps) => {
            const [ inputValue, setInputValue ] = useState<string>(localValue);
            const [ options, setOptions ] = useState([]);
            const [ open, setOpen ] = useState<boolean>(false);

            const initialLoadUrl: string = metaValue?.links.find((link: LinkInterface) => link.rel === "values")?.href;
            const filterBaseUrl: string = metaValue?.links.find((link: LinkInterface) => link.rel === "filter")?.href;
            const filterUrl: string = inputValue ? filterBaseUrl?.replace("*", inputValue) : null;

            const { data: initialResources = [], isLoading: isInitialLoading } = useGetResourcesList(initialLoadUrl);

            const { data: filteredResources = [], isLoading: isFiltering } = useGetResourcesList(filterUrl);

            useEffect(() => {
                if (inputValue && filterUrl) {
                    if (filteredResources && Array.isArray(filteredResources[resourceType])) {
                        setOptions(filteredResources[resourceType]);
                    }
                } else {
                    if (initialResources && Array.isArray(initialResources[resourceType])) {
                        setOptions(initialResources[resourceType]);
                    }
                }
            }, [ inputValue, initialResources, filteredResources, filterUrl ]);

            return (
                <Autocomplete
                    open={ open }
                    onOpen={ () => setOpen(true) }
                    onClose={ () => setOpen(false) }
                    options={ options || [] }
                    getOptionLabel={ (option: { name: string }) => option.name || "" }
                    loading={ isInitialLoading || isFiltering }
                    value={ options.find((option: any) => option.name === inputValue) || null }
                    onChange={ (event: React.SyntheticEvent, value: { name: string } | null) => {
                        if (value) {
                            setLocalValue(value.name);
                            handleExpressionChangeDebounced(
                                value.name,
                                ruleId,
                                conditionId,
                                expression.id,
                                ExpressionFieldTypes.Value
                            );
                        }
                    } }
                    onInputChange={ (event: React.ChangeEvent, value: string) => setInputValue(value) }
                    renderInput={ (params: any) => (
                        <TextField
                            { ...params }
                            variant="outlined"
                            value={ inputValue }
                            InputProps={ {
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        { isInitialLoading || isFiltering ? (
                                            <CircularProgress color="inherit" size={ 20 } />
                                        ) : null }
                                        { params.InputProps.endAdornment }
                                    </>
                                )
                            } }
                        />
                    ) }
                />
            );
        };

        /**
         * Condition value input component.
         *
         * @param metaValue - Meta value.
         * @returns Condition value input component.
         */
        const ConditionValueInput: FunctionComponent<ConditionValueInputProps> = (props: any) => {
            const { metaValue } = props;

            let resourcesList: any = null;
            let resourceType: string = "";

            // Handle fetching data unconditionally
            const resourcesListLink: string = metaValue?.links?.find((link: LinkInterface) => link.rel === "values")
                ?.href;

            const { data: fetchedResourcesList } = useGetResourcesList(resourcesListLink || null);

            // TODO: Handle other resource types once the API is ready
            if (localField === "application") {
                resourceType = "applications";
            }

            // Determine resourcesList if it's needed
            if (metaValue?.links?.length > 1 && fetchedResourcesList) {
                resourcesList = fetchedResourcesList;
            }

            if (metaValue?.inputType === "input") {
                return (
                    <TextField
                        value={ localValue }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
                            setLocalValue(e.target.value);
                            handleExpressionChangeDebounced(
                                e.target.value,
                                ruleId,
                                conditionId,
                                expression.id,
                                ExpressionFieldTypes.Value
                            );
                        } }
                    />
                );
            }

            if (metaValue?.inputType === "options") {
                if (metaValue?.values?.length > 1) {
                    return (
                        <Select
                            value={ localValue }
                            onChange={ (e: SelectChangeEvent) => {
                                setLocalValue(e.target.value);
                                updateConditionExpression(
                                    e.target.value,
                                    ruleId,
                                    conditionId,
                                    expression.id,
                                    ExpressionFieldTypes.Value
                                );
                            } }
                        >
                            { metaValue.values?.map((item: ListDataInterface, index: number) => (
                                <MenuItem value={ item.name } key={ `${expression.id}-${index}` }>
                                    { item.displayName }
                                </MenuItem>
                            )) }
                        </Select>
                    );
                }

                if (resourcesList) {
                    if (resourcesList.count > 10) {
                        return <ValueInputAutocomplete metaValue={ metaValue } resourceType={ resourceType } />;
                    }

                    return (
                        <Select
                            value={ localValue }
                            onChange={ (e: SelectChangeEvent) => {
                                setLocalValue(e.target.value);
                                updateConditionExpression(
                                    e.target.value,
                                    ruleId,
                                    conditionId,
                                    expression.id,
                                    ExpressionFieldTypes.Value
                                );
                            } }
                        >
                            { resourcesList[resourceType]?.map((item: any, index: number) => (
                                <MenuItem value={ item.id } key={ `${expression.id}-${index}` }>
                                    { item.name }
                                </MenuItem>
                            )) }
                        </Select>
                    );
                }

                return null;
            }

            return null;
        };

        return (
            <Box
                sx={ { position: "relative" } }
                key={ index }
                className="box-container"
                data-componentid={ componentId }
            >
                <FormControl fullWidth size="small">
                    <Select
                        value={ localField }
                        onChange={ (e: SelectChangeEvent) => {
                            setLocalField(e.target.value);
                            updateConditionExpression(
                                e.target.value,
                                ruleId,
                                conditionId,
                                expression.id,
                                ExpressionFieldTypes.Field
                            );
                            updateConditionExpression(
                                "",
                                ruleId,
                                conditionId,
                                expression.id,
                                ExpressionFieldTypes.Value
                            );
                        } }
                    >
                        { conditionExpressionsMeta?.map((item: ConditionExpressionMetaInterface, index: number) => (
                            <MenuItem value={ item.field?.name } key={ `${expression.id}-${index}` }>
                                { item.field?.displayName }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
                <FormControl sx={ { mb: 1, minWidth: 120, mt: 1 } } size="small">
                    <Select
                        value={ localOperator }
                        onChange={ (e: SelectChangeEvent) => {
                            setLocalOperator(e.target.value);
                            updateConditionExpression(
                                e.target.value,
                                ruleId,
                                conditionId,
                                expression.id,
                                ExpressionFieldTypes.Operator
                            );
                        } }
                    >
                        { metaOperators?.map((item: ListDataInterface, index: number) => (
                            <MenuItem value={ item.name } key={ `${expression.id}-${index}` }>
                                { item.displayName }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <ConditionValueInput metaValue={ metaValue } />
                </FormControl>
                <FormControl sx={ { mt: 1 } } size="small">
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={ () => {
                            addNewRuleConditionExpression(
                                ruleId,
                                conditionId,
                                AdjoiningOperatorTypes.And,
                                expression.id
                            );
                        } }
                        className="add-button"
                        startIcon={ <AddIcon /> }
                    >
                        And
                    </Button>
                </FormControl>

                { isConditionExpressionRemovable && (
                    <Fab
                        aria-label="delete"
                        size="small"
                        sx={ { position: "absolute" } }
                        className="remove-button"
                        onClick={ () => removeRuleConditionExpression(ruleId, expression.id) }
                    >
                        <RemoveIcon className="remove-button-icon" />
                    </Fab>
                ) }
            </Box>
        );
    };

    return (
        <>
            { ruleConditions?.map(
                (condition: RuleConditionInterface, index: number) =>
                    ruleInstance?.condition === AdjoiningOperatorTypes.Or && (
                        <Fragment key={ index }>
                            { condition.condition === AdjoiningOperatorTypes.And && (
                                <>
                                    { condition.expressions?.map(
                                        (expression: ConditionExpressionInterface, exprIndex: number) => (
                                            <Box sx={ { mt: 2 } } key={ exprIndex }>
                                                <RuleExpression
                                                    expression={ expression }
                                                    ruleId={ ruleInstance.id }
                                                    conditionId={ condition.id }
                                                    index={ exprIndex }
                                                    isConditionExpressionRemovable={
                                                        condition.expressions.length > 1 ||
                                                        ruleInstance.rules.length > 1
                                                    }
                                                />
                                            </Box>
                                        )
                                    ) }
                                </>
                            ) }
                            { condition.expressions?.length > 0 && (
                                <Divider sx={ { mb: 1, mt: 2 } }>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        onClick={ () =>
                                            addNewRuleConditionExpression(
                                                ruleInstance.id,
                                                condition.id,
                                                AdjoiningOperatorTypes.Or
                                            )
                                        }
                                        startIcon={ <AddIcon /> }
                                    >
                                        Or
                                    </Button>
                                </Divider>
                            ) }
                        </Fragment>
                    )
            ) }
        </>
    );
};

export default RuleConditions;
