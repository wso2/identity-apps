/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Autocomplete from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Divider from "@oxygen-ui/react/Divider";
import Fab from "@oxygen-ui/react/Fab";
import FormControl from "@oxygen-ui/react/FormControl";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { MinusIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import debounce from "lodash-es/debounce";
import React, { ChangeEvent, Dispatch, Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import getResourceDetails from "../api/get-resource-details";
import useGetResourceList from "../api/use-get-resource-list";
import { useRulesContext } from "../hooks/use-rules-context";
import {
    ConditionExpressionMetaInterface,
    ExpressionValueInterface,
    LinkInterface,
    ListDataInterface
} from "../models/meta";
import { ResourceInterface } from "../models/resource";
import {
    AdjoiningOperatorTypes,
    ConditionExpressionInterface,
    ExpressionFieldTypes,
    RuleConditionInterface,
    RuleConditionsInterface,
    RuleInterface
} from "../models/rules";

/**
 * Value input autocomplete options interface.
 */
interface ValueInputAutocompleteOptionsInterface {
    id: string;
    label: string;
}

/**
 * Component common props interface.
 */
interface ComponentCommonPropsInterface {
    conditionId: string;
    expressionId: string;
    expressionValue: string;
    ruleId: string;
}

/**
 * Condition value input props interface.
 */
interface ConditionValueInputProps extends ComponentCommonPropsInterface {
    metaValue: ExpressionValueInterface;
    findMetaValuesAgainst: ConditionExpressionMetaInterface;
    expressionField: string;
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
}

interface ResourceListSelectProps extends ComponentCommonPropsInterface {
    expressionField: string;
    filterBaseResourcesUrl: string;
    findMetaValuesAgainst: ConditionExpressionMetaInterface;
    initialResourcesLoadUrl: string;
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Value input autocomplete props interface.
 */
interface ValueInputAutocompleteProps extends ComponentCommonPropsInterface {
    valueReferenceAttribute: string;
    valueDisplayAttribute: string;
    resourceType: string;
    initialResourcesLoadUrl: string;
    filterBaseResourcesUrl: string;
}

/**
 * Props interface of {@link RulesComponent}
 */
export interface RulesComponentPropsInterface extends IdentifiableComponentInterface {
    readonly?: boolean;
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
    readonly,
    rule: ruleInstance
}: RulesComponentPropsInterface): ReactElement => {

    const ruleConditions: RuleConditionsInterface = ruleInstance.rules;

    const {
        addNewRuleConditionExpression,
        conditionExpressionsMeta,
        updateConditionExpression,
        removeRuleConditionExpression
    } = useRulesContext();

    const { t } = useTranslation();

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
        fieldName: ExpressionFieldTypes,
        isUserOnChange: boolean
    ) => void = debounce(
        (
            changedValue: string,
            ruleId: string,
            conditionId: string,
            expressionId: string,
            fieldName: ExpressionFieldTypes,
            isUserOnChange: boolean
        ) => {
            updateConditionExpression(changedValue, ruleId, conditionId, expressionId, fieldName, isUserOnChange);
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
        expressionValue,
        valueReferenceAttribute,
        valueDisplayAttribute,
        resourceType,
        initialResourcesLoadUrl,
        filterBaseResourcesUrl,
        ruleId,
        conditionId,
        expressionId
    }: ValueInputAutocompleteProps) => {

        const [ inputValue, setInputValue ] = useState<string>(null);
        const [ inputValueLabel, setInputValueLabel ] = useState<string>(null);
        const [ options, setOptions ] = useState([]);
        const [ open, setOpen ] = useState<boolean>(false);

        const filterUrl: string = inputValueLabel
            ? filterBaseResourcesUrl?.replace("filter=", `filter=name+sw+${inputValueLabel}`)
            : initialResourcesLoadUrl;

        const { data: initialResources = [], isLoading: isInitialLoading } =
            useGetResourceList(initialResourcesLoadUrl);
        const { data: filteredResources = [], isLoading: isFiltering } =
            useGetResourceList(filterUrl);
        const { data: resourceDetails, isLoading: isResourceDetailsLoading } =
            useGetResourceList(`/${resourceType}/${expressionValue}`);

        useEffect(() => {
            if (resourceDetails && !isResourceDetailsLoading) {
                setInputValue(resourceDetails[valueReferenceAttribute]);
                setInputValueLabel(resourceDetails[valueDisplayAttribute]);
            }
        }, [ expressionValue, isResourceDetailsLoading ]);

        useEffect(() => {
            if (inputValueLabel && filterUrl) {
                if (filteredResources && Array.isArray(filteredResources[resourceType])) {
                    const filteredOptions: any[] =
                        filteredResources[resourceType].map((resource: ResourceInterface) => ({
                            id: resource[valueReferenceAttribute],
                            label: resource[valueDisplayAttribute]
                        }));

                    setOptions(filteredOptions);
                }
            } else {
                if (initialResources && Array.isArray(initialResources[resourceType])) {
                    const initialOptions: any[] = initialResources[resourceType].map((resource: ResourceInterface) => ({
                        id: resource[valueReferenceAttribute],
                        label: resource[valueDisplayAttribute]
                    }));

                    setOptions(initialOptions);
                }
            }
        }, [ inputValueLabel, initialResources, filteredResources, filterUrl ]);

        const hasMoreItems: boolean = filteredResources?.totalResults > filteredResources?.count;

        return (
            <Autocomplete
                disabled={ readonly }
                open={ open }
                onOpen={ () => setOpen(true) }
                onClose={ () => setOpen(false) }
                options={
                    hasMoreItems
                        ? [ ...options, {
                            id: "more-items",
                            isDisabled: true,
                            label: t("rules:fields.autocomplete.moreItemsMessage")
                        } ]
                        : options  || []
                }
                getOptionLabel={ (option: ValueInputAutocompleteOptionsInterface) => option.label || "" }
                value={ resourceDetails ? { id: inputValue, label: inputValueLabel } : null }
                isOptionEqualToValue={ (
                    option: ValueInputAutocompleteOptionsInterface,
                    value: ValueInputAutocompleteOptionsInterface
                ) =>
                    value?.id && option.id === value.id
                }
                loading={ isInitialLoading || isFiltering || isResourceDetailsLoading }
                onChange={ (e: any, value: any) => {
                    if (value?.isDisabled) {
                        // Prevent selection of the disabled option
                        return;
                    }
                    if (value) {
                        handleExpressionChangeDebounced(
                            value.id,
                            ruleId,
                            conditionId,
                            expressionId,
                            ExpressionFieldTypes.Value,
                            true
                        );
                    }
                } }
                inputValue={ inputValueLabel }
                onInputChange={ (event: ChangeEvent, value: string) => {
                    setInputValueLabel(value);
                } }
                renderInput={ (params: any) => (
                    <TextField
                        { ...params }
                        variant="outlined"
                        value={ inputValueLabel }
                        InputProps={ {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    { isInitialLoading || isFiltering || isResourceDetailsLoading ? (
                                        <CircularProgress color="inherit" size={ 20 } />
                                    ) : null }
                                    { params.InputProps.endAdornment }
                                </>
                            )
                        } }
                    />
                ) }
                renderOption={ (props: any, option: { label: string; id: string, isDisabled: boolean }) => {
                    if (option.id === "more-items") {
                        return (
                            <li
                                { ...props }
                                // TODO: Check the issue why className is not working.
                                // And move styles to a css file.
                                style={ {
                                    color: "#666666",
                                    fontStyle: "italic",
                                    padding: "12px 15px 5px",
                                    pointerEvents: option.isDisabled ? "none" : "auto"
                                } }
                                key={ option.id }
                            >
                                { option.label }
                            </li>
                        );
                    }

                    return (
                        <li { ...props }>
                            { option.label }
                        </li>
                    );
                } }
            />
        );
    };

    /**
     * Resource list select component.
     *
     * @returns Resource list select component.
     */
    const ResourceListSelect: FunctionComponent<ResourceListSelectProps> = (props: ResourceListSelectProps) => {
        const {
            ruleId,
            conditionId,
            setIsResourceMissing,
            expressionValue,
            expressionId,
            expressionField,
            findMetaValuesAgainst,
            initialResourcesLoadUrl,
            filterBaseResourcesUrl
        } = props;

        const valueReferenceAttribute: string = findMetaValuesAgainst?.value?.valueReferenceAttribute || "id";
        const valueDisplayAttribute: string = findMetaValuesAgainst?.value?.valueDisplayAttribute || "name";

        let resourceType: string;

        // TODO: Handle other resource types once the API updates with the required data.
        if (expressionField === "application") {
            resourceType = "applications";
        }

        const {
            data: fetchedResourcesList
        } = useGetResourceList(initialResourcesLoadUrl);

        useEffect(() => {
            getResourceDetails(`/${resourceType}/${expressionValue}`)
                .then(() => {
                    return;
                })
                .catch(() => {
                    setIsResourceMissing(true);
                });
        }, [ expressionValue ]);

        if (fetchedResourcesList) {
            // Set first value of the list if option is empty
            if (expressionValue === "") {
                handleExpressionChangeDebounced(
                    fetchedResourcesList[resourceType][0]?.id,
                    ruleId,
                    conditionId,
                    expressionId,
                    ExpressionFieldTypes.Value,
                    false
                );
            }

            if (fetchedResourcesList.totalResults > fetchedResourcesList.count) {
                return (
                    <ValueInputAutocomplete
                        conditionId={ conditionId }
                        ruleId={ ruleId }
                        expressionId={ expressionId }
                        expressionValue={ expressionValue }
                        resourceType={ resourceType }
                        valueReferenceAttribute={ valueReferenceAttribute }
                        valueDisplayAttribute={ valueDisplayAttribute }
                        initialResourcesLoadUrl={ initialResourcesLoadUrl }
                        filterBaseResourcesUrl={ filterBaseResourcesUrl }
                    />
                );
            }

            return (
                <Select
                    disabled={ readonly }
                    value={ expressionValue }
                    onChange={ (e: SelectChangeEvent) => {
                        updateConditionExpression(
                            e.target.value,
                            ruleId,
                            conditionId,
                            expressionId,
                            ExpressionFieldTypes.Value,
                            true
                        );
                    } }
                >
                    { fetchedResourcesList[resourceType]?.map((resource: ResourceInterface, index: number) => (
                        <MenuItem value={ resource[valueReferenceAttribute] } key={ `${expressionId}-${index}` }>
                            { resource[valueDisplayAttribute] }
                        </MenuItem>
                    )) }
                </Select>
            );
        }
    };

    /**
     * Condition value input component.
     *
     * @param metaValue - Meta value.
     * @returns Condition value input component.
     */
    const ConditionValueInput: FunctionComponent<ConditionValueInputProps> = (props: ConditionValueInputProps) => {
        const {
            findMetaValuesAgainst,
            ruleId,
            conditionId,
            expressionField,
            expressionId,
            expressionValue,
            metaValue,
            setIsResourceMissing
        } = props;

        if (metaValue?.inputType === "input" || null) {
            return (
                <TextField
                    disabled={ readonly }
                    value={ expressionValue }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
                        handleExpressionChangeDebounced(
                            e.target.value,
                            ruleId,
                            conditionId,
                            expressionId,
                            ExpressionFieldTypes.Value,
                            true
                        );
                    } }
                />
            );
        }

        if (metaValue?.inputType === "options") {
            if (metaValue?.values?.length > 1) {

                // Set first value of the list if option is empty
                if (expressionValue === "") {
                    handleExpressionChangeDebounced(
                        metaValue?.values[0].name,
                        ruleId,
                        conditionId,
                        expressionId,
                        ExpressionFieldTypes.Value,
                        false
                    );
                }

                return (
                    <Select
                        disabled={ readonly }
                        value={ expressionValue }
                        onChange={ (e: SelectChangeEvent) => {
                            updateConditionExpression(
                                e.target.value,
                                ruleId,
                                conditionId,
                                expressionId,
                                ExpressionFieldTypes.Value,
                                true
                            );
                        } }
                    >
                        { metaValue.values?.map((item: ListDataInterface, index: number) => (
                            <MenuItem value={ item.name } key={ `${expressionId}-${index}` }>
                                { item.displayName }
                            </MenuItem>
                        )) }
                    </Select>
                );
            }

            if (metaValue?.links?.length > 1) {
                const initialResourcesLoadUrl: string = metaValue?.links.find(
                    (link: LinkInterface) => link.rel === "values")?.href;
                const filterBaseResourcesUrl: string = metaValue?.links.find(
                    (link: LinkInterface) => link.rel === "filter")?.href;

                if (initialResourcesLoadUrl && filterBaseResourcesUrl) {
                    return (
                        <ResourceListSelect
                            ruleId={ ruleId }
                            conditionId={ conditionId }
                            setIsResourceMissing={ setIsResourceMissing }
                            expressionField={ expressionField }
                            expressionId={ expressionId }
                            expressionValue={ expressionValue }
                            findMetaValuesAgainst={ findMetaValuesAgainst }
                            initialResourcesLoadUrl={ initialResourcesLoadUrl }
                            filterBaseResourcesUrl={ filterBaseResourcesUrl }
                        />
                    );
                }

                return null;
            }

            return null;
        }

        return null;
    };

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
        const [ isResourceMissing, setIsResourceMissing ] = useState<boolean>(false);

        const findMetaValuesAgainst: ConditionExpressionMetaInterface = conditionExpressionsMeta.find(
            (expressionMeta: ConditionExpressionMetaInterface) => expressionMeta.field.name === expression.field
        );

        return (
            <Box
                sx={ { position: "relative" } }
                key={ index }
                className="box-container"
                data-componentid={ componentId }
            >
                { isResourceMissing && (
                    <Alert severity="warning" className="alert-warning" sx={ { mb: 2 } }>
                        <AlertTitle
                            className="alert-title"
                        >
                            <Trans i18nKey={ t("actions:fields.rules.alerts.resourceNotFound.title") }>
                                Previous configured resource cannot be found.
                            </Trans>
                        </AlertTitle>
                        <Trans
                            i18nKey={ t("actions:fields.rules.alerts.resourceNotFound.description") }
                        >
                            Please make sure to update it to a resource that is available.
                        </Trans>
                    </Alert>
                ) }
                <FormControl fullWidth size="small">
                    <Select
                        disabled={ readonly }
                        value={ expression.field }
                        onChange={ (e: SelectChangeEvent) => {
                            updateConditionExpression(
                                e.target.value,
                                ruleId,
                                conditionId,
                                expression.id,
                                ExpressionFieldTypes.Field,
                                true
                            );
                            updateConditionExpression(
                                "",
                                ruleId,
                                conditionId,
                                expression.id,
                                ExpressionFieldTypes.Value,
                                true
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
                        disabled={ readonly }
                        value={ expression.operator }
                        onChange={ (e: SelectChangeEvent) => {
                            updateConditionExpression(
                                e.target.value,
                                ruleId,
                                conditionId,
                                expression.id,
                                ExpressionFieldTypes.Operator,
                                true
                            );
                        } }
                    >
                        { findMetaValuesAgainst?.operators?.map((item: ListDataInterface, index: number) => (
                            <MenuItem value={ item.name } key={ `${expression.id}-${index}` }>
                                { item.displayName }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <ConditionValueInput
                        conditionId={ conditionId }
                        expressionField={ expression.field }
                        expressionId={ expression.id }
                        expressionValue={ expression.value }
                        findMetaValuesAgainst={ findMetaValuesAgainst }
                        metaValue={ findMetaValuesAgainst?.value }
                        ruleId={ ruleId }
                        setIsResourceMissing={ setIsResourceMissing }
                    />
                </FormControl>
                <FormControl sx={ { mt: 1 } } size="small">
                    <Button
                        disabled={ readonly }
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
                        startIcon={ <PlusIcon /> }
                    >
                        { t("rules:buttons.and") }
                    </Button>
                </FormControl>

                { isConditionExpressionRemovable && !readonly && (
                    <Fab
                        aria-label="delete"
                        size="small"
                        sx={ { position: "absolute" } }
                        className="remove-button"
                        onClick={ () => removeRuleConditionExpression(ruleId, expression.id) }
                    >
                        <MinusIcon className="remove-button-icon" />
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
                                        disabled={ readonly }
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
                                        startIcon={ <PlusIcon /> }
                                    >
                                        { t("rules:buttons.or") }
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
