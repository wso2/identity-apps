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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import useGetResourcesList from "../api/use-get-resource-list";
import {
    ConditionTypes,
    ExpressionInterface,
    LinkInterface,
    ListDataInterface,
    RuleComponentExpressionValueInterface,
    RuleComponentMetaInterface,
    RuleConditionsInterface } from "../models/rules";
import { useRulesContext } from "../providers/rules-provider";
import "./rules-component.scss";

/**
 * Value input autocomplete props interface.
 */
interface ValueInputAutocompleteProps {
    metaValue: RuleComponentExpressionValueInterface;
    resourceType: string;
}

/**
 * Condition value input props interface.
 */
interface ConditionValueInputProps {
    metaValue: RuleComponentExpressionValueInterface;
}

/**
 * Props interface of {@link RulesComponent}
 */
export interface RulesComponentPropsInterface extends IdentifiableComponentInterface {
    /**
     * Conditions to render.
     */
    conditions: RuleConditionsInterface[];

    /**
     * Rule id.
     */
    ruleId: string;

    /**
     * Condition removable flag.
     */
    conditionRemovable: boolean;
}

/**
 * Rules condition component to recursive render.
 *
 * @param props - Props injected to the component.
 * @returns Rule condition component.
 */
const RuleConditions: FunctionComponent<RulesComponentPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-component",
    conditions,
    ruleId,
    conditionRemovable
}: RulesComponentPropsInterface): ReactElement => {

    const {
        addNewRuleCondition,
        conditionExpressionsMeta,
        updateRuleConditionExpression,
        removeRuleCondition
    } = useRulesContext();

    /**
     * Rule expression component.
     *
     * @param props - Props injected to the component.
     * @returns Rule expression component.
     */
    const RuleExpression = ({
        condition,
        ruleId,
        index
    }: {
        ruleId: string;
        condition: RuleConditionsInterface;
        index: number;
    }) => {

        const [ localField, setLocalField ] = useState<string>(condition.expressions[0].field);
        const [ localOperator, setLocalOperator ] = useState<string>(condition.expressions[0].operator);
        const [ localValue, setLocalValue ] = useState<string>(condition.expressions[0].value);

        const [ metaOperators, setMetaOperators ] =
            useState<ListDataInterface[]>(conditionExpressionsMeta[0]?.operators);
        const [ metaValue, setMetaValue ] =
            useState<RuleComponentExpressionValueInterface>(conditionExpressionsMeta[0]?.value);

        useEffect(() => {

            conditionExpressionsMeta?.map((expressionMeta: RuleComponentMetaInterface) => {
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
         * @param changedValue - Changed value.
         * @param ruleId - Rule id.
         * @param conditionId - Condition id.
         * @param expressionId - Expression id.
         * @param fieldName - Field name.
         * @returns Debounced function.
         */
        const handleChangeDebounced: (
            changedValue: string,
            ruleId: string,
            conditionId: string,
            expressionId: string,
            fieldName: keyof ExpressionInterface
        ) => void = debounce(
            (
                changedValue: string,
                ruleId: string,
                conditionId: string,
                expressionId: string,
                fieldName: keyof ExpressionInterface
            ) => {
                updateRuleConditionExpression(changedValue, ruleId, conditionId, expressionId, fieldName);
            },
            300
        );

        /**
         * Value input autocomplete component.
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

            const {
                data: initialResources = [],
                isLoading: isInitialLoading
            } = useGetResourcesList(initialLoadUrl);

            const {
                data: filteredResources = [],
                isLoading: isFiltering
            } = useGetResourcesList(filterUrl);

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
                    onChange={ (
                        event: React.SyntheticEvent,
                        value: { name: string } | null
                    ) => {
                        if (value) {
                            setLocalValue(value.name);
                            handleChangeDebounced(
                                value.name,
                                ruleId,
                                condition.id,
                                condition.expressions[0].id,
                                "value"
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
                                        { (isInitialLoading || isFiltering) ? (
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
         * @param metaValue - Meta value.
         * @returns Condition value input component.
         */
        const ConditionValueInput: FunctionComponent<ConditionValueInputProps> = (props: any) => {

            const { metaValue } = props;

            let resourcesList: any = null;
            let resourceType: string = "";

            // Handle fetching data unconditionally
            const resourcesListLink: string =
            metaValue?.links?.find((link: LinkInterface) => link.rel === "values")?.href;

            const { data: fetchedResourcesList } = useGetResourcesList(resourcesListLink || null);

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
                            handleChangeDebounced(
                                e.target.value,
                                ruleId,
                                condition.id,
                                condition.expressions[0].id,
                                "value"
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
                                updateRuleConditionExpression(
                                    e.target.value,
                                    ruleId,
                                    condition.id,
                                    condition.expressions[0].id,
                                    "value"
                                );
                            } }
                        >
                            { metaValue.values?.map((item: ListDataInterface, index: number) => (
                                <MenuItem value={ item.name } key={ `${condition.id}-${index}` }>
                                    { item.displayName }
                                </MenuItem>
                            )) }
                        </Select>
                    );
                }

                if (resourcesList) {
                    if (resourcesList.count > 10) {
                        return (
                            <ValueInputAutocomplete metaValue={ metaValue } resourceType={ resourceType } />
                        );
                    }

                    return (
                        <Select
                            value={ localValue }
                            onChange={ (e: SelectChangeEvent) => {
                                setLocalValue(e.target.value);
                                updateRuleConditionExpression(
                                    e.target.value,
                                    ruleId,
                                    condition.id,
                                    condition.expressions[0].id,
                                    "value"
                                );
                            } }
                        >
                            { resourcesList[resourceType]?.map((item: any, index: number) => (
                                <MenuItem value={ item.id } key={ `${condition.id}-${index}` }>
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
                data-componentid={ componentId }>
                <FormControl fullWidth size="small">
                    <Select
                        value={ localField }
                        onChange={ (e: SelectChangeEvent) => {
                            setLocalField(e.target.value);
                            updateRuleConditionExpression(e.target.value, ruleId, condition.id,
                                condition.expressions[0].id, "field");
                            updateRuleConditionExpression("", ruleId, condition.id,
                                condition.expressions[0].id, "value");
                        } }>

                        { conditionExpressionsMeta?.map((item: RuleComponentMetaInterface, index: number) => (
                            <MenuItem value={ item.field?.name } key={ `${condition.id}-${index}` }>
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
                            updateRuleConditionExpression(e.target.value, ruleId, condition.id,
                                condition.expressions[0].id, "operator");
                        } }>;

                        { metaOperators?.map((item: ListDataInterface, index: number) => (
                            <MenuItem value={ item.name } key={ `${condition.id}-${index}` }>
                                { item.displayName }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <ConditionValueInput metaValue={ metaValue }  />
                </FormControl>
                <FormControl sx={ { mt: 1 } } size="small">
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={ () => addNewRuleCondition( ruleId, condition.id, ConditionTypes.And ) }
                        className="add-button"
                        startIcon={ <AddIcon /> }
                    >
                        And
                    </Button>
                </FormControl>

                { conditionRemovable && (
                    <Fab
                        aria-label="delete"
                        size="small"
                        sx={ { position: "absolute" } }
                        className="remove-button"
                        onClick={ () => removeRuleCondition(ruleId, condition.id) }
                    >
                        <RemoveIcon className="remove-button-icon" />
                    </Fab>
                ) }
            </Box>
        );
    };

    const ConditionOrDivider = (props: any) => (
        <Divider sx={ { mb: 1, mt: 2 } }>
            <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={ () => addNewRuleCondition( props.ruleId, props.id, ConditionTypes.Or ) }
                startIcon={ <AddIcon /> }
            >
                Or
            </Button>
        </Divider>
    );

    return (
        <>
            { conditions?.map((condition: RuleConditionsInterface, index: any) => (
                <>
                    { (condition?.condition === ConditionTypes.Or && conditions[index - 1]?.id) &&
                        <ConditionOrDivider id={ conditions[index - 1].id } ruleId={ ruleId } />
                    }
                    <Box sx={ { mt:2 } } key={ index }>
                        <RuleExpression
                            ruleId={ ruleId }
                            condition={ condition }
                            index={ index }
                        />
                    </Box>
                </>
            )) }
            { conditions?.length > 0 &&
                <ConditionOrDivider id={ conditions[conditions.length - 1].id } ruleId={ ruleId } />
            }
        </>
    );

};

export default RuleConditions;
