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

import Autocomplete from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import Box from "@oxygen-ui/react/Box";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Fab from "@oxygen-ui/react/Fab";
import Divider from "@oxygen-ui/react/Divider";
import FormControl from "@oxygen-ui/react/FormControl";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { SelectChangeEvent } from '@mui/material';
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import debounce from "lodash-es/debounce";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { ConditionTypes, ExpressionInterface, RuleConditionsInterface } from "../models/rules";
import { useRulesContext } from "../providers/rules-provider";
import useGetResourcesList from "../api/use-get-resource-list";
import "./rules-component.scss";

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
        index,
      }: {
        ruleId: string;
        condition: RuleConditionsInterface;
        index: number;
      }) => {

        const [ localField, setLocalField ] = useState(condition.expressions[0].field);
        const [ localOperator, setLocalOperator ] = useState(condition.expressions[0].operator);
        const [ localValue, setLocalValue ] = useState(condition.expressions[0].value);

        const [ metaOperators, setMetaOperators ] = useState(conditionExpressionsMeta[0]?.operators);
        const [ metaValue, setMetaValue ] = useState(conditionExpressionsMeta[0]?.value);

        useEffect(() => {

            conditionExpressionsMeta?.map((expressionMeta) => {
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
         * @type {Function}
         */
        const handleChangeDebounced = debounce(
            (
                changedValue: string,
                ruleId: string,
                conditionId: string,
                expressionId: string,
                fieldName: keyof ExpressionInterface
            ) => {
                updateRuleConditionExpression(changedValue, ruleId, conditionId, expressionId, fieldName);
            }, 300
        );

        /**
         * Value input autocomplete component.
         * @param metaValue - Meta value.
         * @param resourceType - Resource type.
         * @returns Value input autocomplete component.
         * @constructor
         * @return {ReactElement}
         */
        const ValueInputAutocomplete = ({ metaValue, resourceType }) => {

            const [ inputValue, setInputValue ] = useState(localValue);
            const [ options, setOptions ] = useState([]);
            const [ open, setOpen ] = useState(false);
          
            const initialLoadUrl = metaValue?.links.find(link => link.rel === "values")?.href;
            const filterBaseUrl = metaValue?.links.find(link => link.rel === "filter")?.href;
            const filterUrl = inputValue ? filterBaseUrl?.replace('*', inputValue) : null;
          
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
                    getOptionLabel={ (option) => option.name || '' }
                    loading={ isInitialLoading || isFiltering }
                    value={ options.find(option => option.name === inputValue) || null }
                    onChange={ (e, value) => {
                        if (value) {
                            setLocalValue(value.name);
                            handleChangeDebounced(value.name, ruleId, condition.id, 
                                condition.expressions[0].id, "value");
                        }
                    } }
                    onInputChange={ (e, value) => setInputValue(value) }
                    renderInput={ (params) => (
                        <TextField
                            { ...params }
                            variant="outlined"
                            value={ inputValue }
                            InputProps={ {
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        { (isInitialLoading || isFiltering) ? (
                                            <CircularProgress color="inherit" size={20} />
                                        ) : null }
                                        { params.InputProps.endAdornment }
                                    </>
                                ),
                            } }
                        />
                    ) }
                />
            );
        };

        /**
         * Condition value input component.
         * @returns Condition value input component.
         * @constructor
         * @return {ReactElement}
         */
        const ConditionValueInput = () => {
            if (metaValue?.inputType === "input") {

                return (
                    <TextField
                        value={ localValue }
                        onChange={(e) => {
                            setLocalValue(e.target.value);
                            handleChangeDebounced(e.target.value, ruleId, condition.id,
                                condition.expressions[0].id, "value");
                        }}
                    />
                );
            }

            if (metaValue?.inputType === "options") {

                if (metaValue?.values?.length > 1) {

                    return (
                        <Select
                            value={ localValue }
                            onChange={(e: SelectChangeEvent) => {
                                setLocalValue(e.target.value);
                                updateRuleConditionExpression(e.target.value, ruleId, condition.id,
                                    condition.expressions[0].id, "value")
                            }}
                        >
                            { metaValue.values.map((item, index) => (
                                <MenuItem value={ item.name } key={ `${condition.id}-${index}` }>
                                    { item.displayName }
                                </MenuItem>
                            )) }
                        </Select>
                    );
                }

                if (metaValue?.links?.length > 1) {

                    const {
                        data: resourcesList
                    } = useGetResourcesList(metaValue?.links.find(link => link.rel === "values")?.href);

                    let resourceType;

                    switch (localField) {
                        case "application":
                            resourceType = "applications";
                            break;
                        default:
                            resourceType = "";
                    }

                    if (resourcesList) {
                        if (resourcesList.count > 10) {
                            return ( <ValueInputAutocomplete metaValue={ metaValue } resourceType={ resourceType } /> );
                        }

                        return (
                            <Select
                                value={ localValue }
                                onChange={(e: SelectChangeEvent) => {
                                    setLocalValue(e.target.value);
                                    updateRuleConditionExpression(e.target.value, ruleId, condition.id,
                                        condition.expressions[0].id, "value")
                                }}
                            >
                                { resourcesList && resourcesList[resourceType]?.map((item, index) => (
                                    <MenuItem value={ item.id } key={ `${condition.id}-${index}` }>
                                        { item.name }
                                    </MenuItem>
                                )) }
                            </Select>
                        );
                    }
                }

                return null;
            }

            return null;
        };

        return (
            <Box sx={ { position: "relative" } }  className="box-container">
                <FormControl fullWidth size="small">
                     <Select 
                        value={ localField }
                        onChange={ (e: SelectChangeEvent) => {
                            setLocalField(e.target.value);
                            updateRuleConditionExpression(e.target.value, ruleId, condition.id,
                                condition.expressions[0].id, "field")
                            updateRuleConditionExpression("", ruleId, condition.id,
                                condition.expressions[0].id, "value")
                        }}>

                        { conditionExpressionsMeta?.map((item, index) => (
                            <MenuItem value={ item.field?.name } key={ `${condition.id}-${index}` }>
                                { item.field?.displayName }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
                <FormControl sx={{ mt: 1, mb: 1, minWidth: 120 }} size="small">
                    <Select 
                        value={ localOperator }
                        onChange={ (e: SelectChangeEvent) => {
                            setLocalOperator(e.target.value);
                            updateRuleConditionExpression(e.target.value, ruleId, condition.id,
                                condition.expressions[0].id, "operator") 
                        }}>

                        { metaOperators?.map((item, index) => (
                            <MenuItem value={ item.name } key={ `${condition.id}-${index}` }>
                                { item.displayName }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <ConditionValueInput  />
                </FormControl>
                <FormControl sx={ { mt: 1 } } size="small">
                    <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => addNewRuleCondition( ruleId, condition.id, ConditionTypes.And )}
                        className="add-button"
                        startIcon={<AddIcon />}
                    >
                        And
                    </Button>
                </FormControl>
                   
                { conditionRemovable &&
                    <Fab
                        aria-label="delete"
                        size="small"
                        sx={ { position: 'absolute' } }
                        className="remove-button"
                        onClick={ () => removeRuleCondition(ruleId, condition.id) }
                    >
                        <RemoveIcon className="remove-button-icon" />
                    </Fab>
                }
            </Box>
        )
    };

    const ConditionOrDivider = (props) => (
        <Divider sx={{ mt: 2, mb: 1 }}>
            <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => addNewRuleCondition( props.ruleId, props.id, ConditionTypes.Or )}
                startIcon={<AddIcon />}
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
            ))}
            { conditions?.length > 0 &&
                <ConditionOrDivider id={ conditions[conditions.length - 1].id } ruleId={ ruleId } />
            }
        </>
    );

};

export default RuleConditions;
