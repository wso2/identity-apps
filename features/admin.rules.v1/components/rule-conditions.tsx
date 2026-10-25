/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import { Theme } from "@mui/material/styles";
import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Autocomplete, { AutocompleteInputChangeReason, AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Divider from "@oxygen-ui/react/Divider";
import Fab from "@oxygen-ui/react/Fab";
import FormControl from "@oxygen-ui/react/FormControl";
import Link from "@oxygen-ui/react/Link";
import { ListItemProps } from "@oxygen-ui/react/ListItem";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { MinusIcon, PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { EMPTY_ARRAY } from "@wso2is/core/constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code } from "@wso2is/react-components";
import debounce from "lodash-es/debounce";
import React, { ChangeEvent, Dispatch, Fragment, FunctionComponent, HTMLAttributes, MutableRefObject,
    ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { DropdownProps } from "semantic-ui-react";
import ConditionValueInput, {
    FIELD_TOGGLE_SPACE,
    TEXT_BOX_WITH_FIELD_TOGGLE_SX
} from "./condition-value-input";
import useGetResourceListOrResourceDetails from "../api/use-get-resource-list-or-resource-details";
import useRulesContext from "../hooks/use-rules-context";
import {
    OperatorConstraintsInterface,
    getValueInput,
    narrowOperators
} from "../utils/operators";
import { ExpressionChangeInterface, toConditionValue, toExpressionChanges } from "../utils/condition-value";
import toQualifierOptions, { findQualifierResource, toResourceList } from "../utils/to-qualifier-options";
import {
    ConditionExpressionMetaInterface,
    ExpressionValueInterface,
    LinkInterface,
    ListDataInterface,
    OperatorInterface,
    OperatorValueInputType
} from "../models/meta";
import { ClaimResourceInterface, ResourceInterface } from "../models/resource";
import {
    AdjoiningOperatorTypes,
    ConditionExpressionInterface,
    ConditionValueType,
    ExpressionFieldTypes,
    FieldOptionInterface,
    QualifierOptionInterface,
    RuleConditionInterface,
    RuleConditionsInterface,
    RuleInterface
} from "../models/rules";
import "./rule-conditions.scss";

/**
 * Value input autocomplete options interface.
 */
/**
 * Props interface of the qualifier input.
 */
interface ConditionQualifierInputPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the rule is shown for reading only.
     */
    readonly?: boolean;
    /**
     * ID of the rule the expression belongs to.
     */
    ruleId: string;
    /**
     * ID of the condition group the expression belongs to.
     */
    conditionId: string;
    /**
     * ID of the expression.
     */
    expressionId: string;
    /**
     * The qualifier currently stored on the expression.
     */
    expressionQualifier: string;
    /**
     * How this field's qualifier is chosen, or undefined when the field takes no qualifier.
     */
    metaQualifier: ExpressionValueInterface;
    /**
     * The part of the expression the chosen qualifier is written to: its own qualifier, or the qualifier of the field
     * its value is read from.
     */
    targetField?: ExpressionFieldTypes;
}

/**
 * Props interface of the fetched qualifier input.
 */
interface QualifierReferenceAutocompletePropsInterface extends ConditionQualifierInputPropsInterface {
    /**
     * Endpoint the qualifier metadata links to for its list of values.
     */
    valuesUrl: string;
}

/**
 * Props interface of the expression text field.
 */
interface ExpressionTextFieldPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the rule is shown for reading only.
     */
    readonly?: boolean;
    /**
     * The value currently held on the expression.
     */
    storedValue: string;
    /**
     * Called with the new text on every keystroke.
     */
    onValueChange: (value: string) => void;
}

/**
 * Props interface of the list value input.
 */
interface ConditionValuesInputPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the rule is shown for reading only.
     */
    readonly?: boolean;
    /**
     * ID of the rule the expression belongs to.
     */
    ruleId: string;
    /**
     * ID of the condition group the expression belongs to.
     */
    conditionId: string;
    /**
     * ID of the expression.
     */
    expressionId: string;
    /**
     * The values currently held on the expression.
     */
    expressionValues: string[];
    /**
     * How the field's values are chosen. A field whose values are listed from an endpoint has them picked from that
     * list rather than typed.
     */
    metaValue?: ExpressionValueInterface;
    /**
     * Resources left out of the list of values.
     */
    hiddenResources?: string[];
    /**
     * Shown at the end of the input, inside its box.
     */
    endAdornment?: ReactNode;
}

/**
 * Props interface of the list value input whose values are picked from a linked list.
 */
interface ResourceValuesInputPropsInterface extends ConditionValuesInputPropsInterface {
    /**
     * Endpoint that lists the values.
     */
    valuesUrl: string;
    /**
     * Endpoint that searches the values, when the field publishes one.
     */
    filterUrl?: string;
}

/**
 * Props interface of a source of the label and audience of one value picked from a linked list.
 */
interface ResourceValueLabelSourcePropsInterface {
    /**
     * The value, as stored on the expression.
     */
    id: string;
    /**
     * Endpoint that returns the resource the value refers to.
     */
    detailsUrl: string;
    /**
     * Attribute of the resource that holds its label.
     */
    displayAttribute: string;
    /**
     * Called with the value, labelled, once its resource has arrived.
     */
    onOption: (option: ResourceValueOptionInterface) => void;
}

interface ValueInputAutocompleteOptionsInterface {
    id: string;
    label: string;
}

/**
 * A value picked from a linked list, with the audience of the role it is, so that roles of the same name can be
 * told apart.
 */
interface ResourceValueOptionInterface extends ValueInputAutocompleteOptionsInterface {
    /**
     * Who the role is for, such as `organization` or `application`.
     */
    audience?: string;
    /**
     * The application or organization the role is for.
     */
    audienceDisplay?: string;
}

/**
 * Component common props interface.
 */
interface ComponentCommonPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the rule is shown for reading only.
     */
    readonly?: boolean;
    conditionId: string;
    expressionId: string;
    expressionValue: string;
    ruleId: string;
    /**
     * Shown at the end of the input, inside its box, such as the toggle that reads the value from a field.
     */
    endAdornment?: ReactNode;
}

/**
 * Condition literal input props interface.
 */
interface ConditionLiteralInputPropsInterface extends ComponentCommonPropsInterface {
    metaValue: ExpressionValueInterface;
    findMetaValuesAgainst: ConditionExpressionMetaInterface;
    expressionField: string;
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
    hiddenResources?: string[];
    hiddenValues?: string[];
}

/**
 * Resource list select props interface.
 */
interface ResourceListSelectProps extends ComponentCommonPropsInterface {
    expressionField: string;
    filterBaseResourcesUrl: string;
    findMetaValuesAgainst: ConditionExpressionMetaInterface;
    initialResourcesLoadUrl: string;
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
    hiddenResources?: string[];
}

/**
 * Value input autocomplete props interface.
 */
interface ValueInputAutocompleteProps extends ComponentCommonPropsInterface {
    resourceDetails: ResourceInterface;
    valueReferenceAttribute: string;
    valueDisplayAttribute: string;
    resourceType: string;
    initialResourcesLoadUrl: string;
    filterBaseResourcesUrl: string;
    shouldFetch: boolean;
    hiddenResources?: string[];
}

/**
 * Rule expression component props interface.
 */
interface RuleExpressionComponentProps extends IdentifiableComponentInterface {
    /**
     * Whether the rule is shown for reading only.
     */
    readonly?: boolean;
    expression: ConditionExpressionInterface;
    ruleId: string;
    conditionId: string;
    index: number;
    isConditionLast: boolean;
    isConditionExpressionRemovable: boolean;
    /**
     * Whether the group already has as many conditions as the server allows, so no more can be added with AND.
     */
    isAndLimitReached?: boolean;
    hiddenConditions?: string[];
    hiddenResources?: string[];
    hiddenValues?: string[];
}

/**
 * Props interface of {@link RulesComponent}
 */
interface RulesComponentPropsInterface extends IdentifiableComponentInterface {
    readonly?: boolean;
    rule: RuleInterface;
}

/**
 * Rules condition component to recursive render.
 *
 * @param props - Props injected to the component.
 * @returns Rule condition component.
 */
/**
 * Value input autocomplete component.
 *
 * @param props - Props injected to the component.
 * @returns Value input autocomplete component.
 */
/**
 * A select holding the field toggle keeps room for it at the end of its box, and moves its arrow in front of it.
 */
const SELECT_WITH_END_ADORNMENT_SX: Record<string, unknown> = {
    "& .MuiSelect-icon": { right: (theme: Theme) => `calc(${ theme.spacing(FIELD_TOGGLE_SPACE) } + 7px)` },
    pr: FIELD_TOGGLE_SPACE
};

/**
 * An autocomplete with its own buttons, holding the field toggle, moves those buttons in front of the toggle and
 * keeps room for both.
 */
const AUTOCOMPLETE_WITH_END_ADORNMENT_SX: Record<string, unknown> = {
    "& .MuiAutocomplete-endAdornment": { right: (theme: Theme) => theme.spacing(FIELD_TOGGLE_SPACE) },
    "&&& .MuiAutocomplete-inputRoot": { pr: FIELD_TOGGLE_SPACE + 8 }
};

/**
 * Debounced expression updater with an identity that survives re-renders.
 *
 * @returns A debounced `updateConditionExpression`.
 */
const useDebouncedConditionExpressionChange = (): (
    changedValue: string,
    ruleId: string,
    conditionId: string,
    expressionId: string,
    fieldName: ExpressionFieldTypes,
    isUserOnChange: boolean
) => void => {
    const { updateConditionExpression } = useRulesContext();
    const updateRef: MutableRefObject<typeof updateConditionExpression> = useRef(updateConditionExpression);

    updateRef.current = updateConditionExpression;

    return useMemo(() => debounce((
        changedValue: string,
        ruleId: string,
        conditionId: string,
        expressionId: string,
        fieldName: ExpressionFieldTypes,
        isUserOnChange: boolean
    ) => {
        updateRef.current(changedValue, ruleId, conditionId, expressionId, fieldName, isUserOnChange);
    }, 300), []);
};

/**
 * Free text input for one part of an expression.
 *
 * @param props - Props injected to the component.
 * @returns The text field.
 */
const ExpressionTextField: FunctionComponent<ExpressionTextFieldPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-text-field",
    readonly,
    storedValue,
    onValueChange
}: ExpressionTextFieldPropsInterface): ReactElement => {
    const [ text, setText ] = useState<string>(storedValue ?? "");
    const inputRef: MutableRefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // While this field has focus the typed text is the newer of the two: the stored value is
        // only catching up to an earlier keystroke, and adopting it would swallow everything typed
        // since. Anything that changes the value from outside -- picking a different field, say --
        // happens with the focus elsewhere, and is adopted.
        if (document.activeElement !== inputRef.current) {
            setText(storedValue ?? "");
        }
    }, [ storedValue ]);

    return (
        <TextField
            disabled={ readonly }
            value={ text }
            inputRef={ inputRef }
            data-componentid={ componentId }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => {
                setText(event.target.value);
                onValueChange(event.target.value);
            } }
        />
    );
};

const ValueInputAutocomplete: FunctionComponent<ValueInputAutocompleteProps> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-input-value",
    readonly,
    valueReferenceAttribute,
    valueDisplayAttribute,
    resourceDetails,
    resourceType,
    initialResourcesLoadUrl,
    filterBaseResourcesUrl,
    ruleId,
    conditionId,
    expressionId,
    shouldFetch,
    hiddenResources = EMPTY_ARRAY,
    endAdornment
}: ValueInputAutocompleteProps) => {

    const { t } = useTranslation();
    const handleExpressionChangeDebounced: ReturnType<typeof useDebouncedConditionExpressionChange> =
        useDebouncedConditionExpressionChange();

    const [ inputValue, setInputValue ] = useState<string>(null);
    const [ inputValueLabel, setInputValueLabel ] = useState<string>(null);
    const [ options, setOptions ] = useState<ValueInputAutocompleteOptionsInterface[]>([]);
    const [ open, setOpen ] = useState<boolean>(false);
    // The option lists are loaded when the picker is first opened, not when the condition is shown.
    const [ hasOpened, setHasOpened ] = useState<boolean>(false);

    const MORE_ITEMS: string = "more-items";
    const CLEAR_OPTION: string = "clear-option";

    const filterUrl: string = inputValueLabel
        ? filterBaseResourcesUrl?.replace("filter=", `filter=name+sw+${inputValueLabel}`)
        : initialResourcesLoadUrl;

    const { data: initialResources = [], isLoading: isInitialLoading } =
        useGetResourceListOrResourceDetails(initialResourcesLoadUrl, shouldFetch && hasOpened);
    const { data: filteredResources = [], isLoading: isFiltering } =
        useGetResourceListOrResourceDetails(filterUrl, shouldFetch && hasOpened);

    useEffect(() => {
        if (resourceDetails) {
            setInputValue(resourceDetails[valueReferenceAttribute] || null);
            setInputValueLabel(resourceDetails[valueDisplayAttribute] || null);
        }
    }, [ resourceDetails ]);

    useEffect(() => {
        if (inputValueLabel && filterUrl) {
            if (filteredResources && Array.isArray(filteredResources[resourceType])) {
                const filteredOptions: ValueInputAutocompleteOptionsInterface[] =
                    filteredResources[resourceType]
                        .filter((resource: ResourceInterface) =>
                            !hiddenResources.includes(resource[valueReferenceAttribute])
                        )
                        .map((resource: ResourceInterface) => ({
                            id: resource[valueReferenceAttribute],
                            label: resource[valueDisplayAttribute]
                        }));

                setOptions(filteredOptions);
            }
        } else {
            if (initialResources && Array.isArray(initialResources[resourceType])) {
                const initialOptions: ValueInputAutocompleteOptionsInterface[] =
                        initialResources[resourceType]
                            .filter((resource: ResourceInterface) =>
                                !hiddenResources.includes(resource[valueReferenceAttribute])
                            )
                            .map((resource: ResourceInterface) => ({
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
            className="autocomplete"
            sx={ endAdornment ? AUTOCOMPLETE_WITH_END_ADORNMENT_SX : undefined }
            disabled={ readonly }
            data-componentid={ componentId }
            open={ open }
            onOpen={ () => {
                setOpen(true);
                setHasOpened(true);
            } }
            onClose={ () => setOpen(false) }
            options={ [
                ...options,
                ...(hasMoreItems
                    ? [ {
                        id: MORE_ITEMS,
                        isDisabled: true,
                        label: t("rules:fields.autocomplete.moreItemsMessage")
                    } ]
                    : []),
                ...(inputValueLabel
                    ? [ {
                        id: CLEAR_OPTION,
                        isDisabled: false,
                        label: t("rules:fields.autocomplete.clearFilterActionText")
                    } ]
                    : [])
            ] }
            filterOptions={ (options: ValueInputAutocompleteOptionsInterface[]) => options }
            getOptionLabel={ (option: ValueInputAutocompleteOptionsInterface) => option.label || "" }
            value={ resourceDetails ? { id: inputValue, label: inputValueLabel } : null }
            isOptionEqualToValue={ (
                option: ValueInputAutocompleteOptionsInterface,
                value: ValueInputAutocompleteOptionsInterface
            ) =>
                value?.id && option.id === value.id
            }
            loading={ isFiltering }
            onChange={ (e: React.ChangeEvent, value: ResourceInterface) => {
                if (value?.isDisabled) return; // Prevent selection of disabled option

                if (value?.id === CLEAR_OPTION) {
                    setInputValueLabel("");
                    setTimeout(() => setOpen(true), 0);

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
            renderInput={ (params: AutocompleteRenderInputParams) => (
                <TextField
                    { ...params }
                    variant="outlined"
                    placeholder={ t("rules:fields.autocomplete.placeholderText") }
                    value={ inputValueLabel }
                    InputProps={ {
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                { isInitialLoading || isFiltering ? (
                                    <CircularProgress color="inherit" size={ 20 } />
                                ) : null }
                                { endAdornment }
                                { params.InputProps.endAdornment }
                            </>
                        )
                    } }
                />
            ) }
            renderOption={ (props: ListItemProps, option: { label: string; id: string; isDisabled: boolean }) => {
                if (option.id === MORE_ITEMS) {
                    return (
                        <li
                            { ...props }
                            className="MuiAutocomplete-moreItemsAvailableMessage"
                            key={ option.id }
                        >
                            { option.label }
                        </li>
                    );
                }

                if (option.id === CLEAR_OPTION) {
                    return (
                        <li
                            { ...props }
                            key={ option.id }
                        >
                            <Link className="MuiAutocomplete-clearFilterLink">
                                <TrashIcon className="icon" /> <span className="text">{ option.label }</span>
                            </Link>
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
 * @param props - Props injected to the component.
 * @returns Resource list select component.
 */
const ResourceListSelect: FunctionComponent<ResourceListSelectProps> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-input-value",
    readonly,
    ruleId,
    conditionId,
    setIsResourceMissing,
    expressionValue,
    expressionId,
    expressionField,
    findMetaValuesAgainst,
    initialResourcesLoadUrl,
    filterBaseResourcesUrl,
    hiddenResources = EMPTY_ARRAY,
    endAdornment
}: ResourceListSelectProps) => {

    const { t } = useTranslation();
    const { updateConditionExpression } = useRulesContext();
    const handleExpressionChangeDebounced: ReturnType<typeof useDebouncedConditionExpressionChange> =
        useDebouncedConditionExpressionChange();

    const [ resourceDetails, setResourceDetails ] = useState<ResourceInterface>(null);
    const [ inputValue, setInputValue ] = useState("");
    const [ claimList, setClaimList ] = useState<ValueInputAutocompleteOptionsInterface[]>([]);
    const [ selectedValue, setSelectedValue ] = useState<string>(null);
    const valueReferenceAttribute: string = findMetaValuesAgainst?.value?.valueReferenceAttribute || "id";
    const valueDisplayAttribute: string = findMetaValuesAgainst?.value?.valueDisplayAttribute || "name";

    let resourceType: string;
    let shouldFetch: boolean = false;

    // TODO: Handle other resource types once the API is updated with the required data.
    if (expressionField === "application") {
        resourceType = "applications";
        shouldFetch = true;
    } else if (expressionField === "claim") {
        shouldFetch = false;
    }

    const {
        data: fetchedResourcesList,
        isLoading: isResourcesListLoading
    } = useGetResourceListOrResourceDetails(initialResourcesLoadUrl, true);

    const {
        data: resourcesDetails,
        isLoading: isResourceDetailsLoading,
        error: resourceDetailsError
    } = useGetResourceListOrResourceDetails(`/${resourceType}/${expressionValue}`, shouldFetch);

    useEffect(() => {
        if (!isResourceDetailsLoading) {
            if (resourceDetailsError) {
                setIsResourceMissing(true);
                setResourceDetails(null);
            } else {
                setIsResourceMissing(false);
                setResourceDetails(resourcesDetails);
            }
        }
    }, [ isResourceDetailsLoading, resourceDetailsError, resourcesDetails ]);

    // The flag belongs to the expression, so it is cleared once a change of field, operator or value type
    // takes this input away.
    useEffect(() => () => setIsResourceMissing(false), []);

    useEffect(() => {
        if (expressionField === "claim" && fetchedResourcesList) {
            const initialOptions: ValueInputAutocompleteOptionsInterface[] =
                        fetchedResourcesList?.filter((resource: ClaimResourceInterface) =>
                            !hiddenResources.includes(resource[valueReferenceAttribute])
                        ).map((resource: ClaimResourceInterface) => ({
                            id: resource[valueReferenceAttribute],
                            label: resource[valueDisplayAttribute]
                        }));

            const sortedClaims: ValueInputAutocompleteOptionsInterface[] =
            initialOptions?.sort((a: ValueInputAutocompleteOptionsInterface,
                b: ValueInputAutocompleteOptionsInterface) => {
                return a.label > b.label ? 1 : -1;
            });

            /**
             * Disables the role claim attribute.
             *
             * The role attribute is temporarily disabled until the ambiguities
             * related to the claim are resolved.
             * @param claimsList - List of claims.
             * @returns - Filtered claims list.
             */
            const filterOutRoleClaimAttribute = (claimsList: ValueInputAutocompleteOptionsInterface[]):
            ValueInputAutocompleteOptionsInterface[] => {

                const excludedClaims: Set<string> = new Set([
                    "http://wso2.org/claims/roles",
                    "http://wso2.org/claims/applicationRoles"
                ]);

                return claimsList?.filter((claim: ValueInputAutocompleteOptionsInterface) =>
                    !excludedClaims.has(claim?.id));
            };

            const claimList: ValueInputAutocompleteOptionsInterface[] =
            filterOutRoleClaimAttribute(sortedClaims);

            const matchedClaim: ValueInputAutocompleteOptionsInterface = claimList.find(
                (claim: ValueInputAutocompleteOptionsInterface) => claim.id === expressionValue
            );

            setClaimList(claimList);
            setInputValue(matchedClaim ? matchedClaim.label : "");
            setSelectedValue(matchedClaim ? matchedClaim.id : null);

        }
    }, [ fetchedResourcesList ]);

    if (isResourcesListLoading || !fetchedResourcesList) {
        return;
    }

    if (expressionField == "claim") {

        return (
            <Autocomplete
                loading={ isResourcesListLoading }
                fullWidth
                aria-label="Attribute selection"
                className="pt-2"
                sx={ endAdornment ? AUTOCOMPLETE_WITH_END_ADORNMENT_SX : undefined }
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
                value={ selectedValue ? { id: selectedValue, label: inputValue } : null }
                onInputChange={ (event: ChangeEvent, value: string, reason: AutocompleteInputChangeReason) => {

                    if (reason === "reset") {
                        setInputValue("");

                        return;
                    } else {
                        setInputValue(value);
                    }
                } }
                onChange={ (e: React.ChangeEvent, value: ValueInputAutocompleteOptionsInterface) => {

                    if (value) {
                        setSelectedValue(value?.id);
                        setInputValue(value?.label);
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
                options={ claimList }
                getOptionLabel={ (claim: DropdownProps) =>
                    claim?.label
                }
                isOptionEqualToValue={
                    (option: ValueInputAutocompleteOptionsInterface,
                        value: ValueInputAutocompleteOptionsInterface) =>
                        value?.id && option.id === value.id
                }
                renderOption={ (props: HTMLAttributes<HTMLLIElement>,
                    option: ValueInputAutocompleteOptionsInterface) => (
                    <li { ...props } key={ option.id }>
                        <div className="multiline">
                            <div>{ option?.label }</div>
                            <div>
                                <Code className="description" compact withBackground={ false }>
                                    { option?.id }
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
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    { endAdornment }
                                    { params.InputProps.endAdornment }
                                </>
                            )
                        } }
                    />
                ) }
                key="autocompleteSearchWithList"
                data-componentid={ `${componentId}-select-attributes` }
            />
        );

    } else if (resourceType == "applications") {
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
                    readonly={ readonly }
                    conditionId={ conditionId }
                    ruleId={ ruleId }
                    expressionId={ expressionId }
                    expressionValue={ expressionValue }
                    resourceDetails={ resourceDetails }
                    resourceType={ resourceType }
                    valueReferenceAttribute={ valueReferenceAttribute }
                    valueDisplayAttribute={ valueDisplayAttribute }
                    initialResourcesLoadUrl={ initialResourcesLoadUrl }
                    filterBaseResourcesUrl={ filterBaseResourcesUrl }
                    shouldFetch={ shouldFetch }
                    hiddenResources={ hiddenResources }
                    endAdornment={ endAdornment }
                />
            );
        }

        return (
            <Select
                disabled={ readonly }
                value={ expressionValue }
                data-componentid={ componentId }
                endAdornment={ endAdornment }
                sx={ endAdornment ? SELECT_WITH_END_ADORNMENT_SX : undefined }
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
                { fetchedResourcesList[resourceType]?.filter((resource: ResourceInterface) =>
                    !hiddenResources.includes(resource[valueReferenceAttribute])
                ).map((resource: ResourceInterface, index: number) => (
                    <MenuItem value={ resource[valueReferenceAttribute] } key={ `${expressionId}-${index}` }>
                        { resource[valueDisplayAttribute] }
                    </MenuItem>
                )) }
            </Select>
        );
    }
};

/**
 * Qualifier input backed by a list fetched from the endpoint named in the qualifier metadata.
 *
 * @param props - Props injected to the component.
 * @returns The qualifier autocomplete.
 */
const QualifierReferenceAutocomplete: FunctionComponent<QualifierReferenceAutocompletePropsInterface> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-input-qualifier",
    readonly,
    ruleId,
    conditionId,
    expressionId,
    expressionQualifier,
    metaQualifier,
    valuesUrl,
    targetField = ExpressionFieldTypes.Qualifier
}: QualifierReferenceAutocompletePropsInterface) => {

    const { updateConditionExpression } = useRulesContext();

    const referenceAttribute: string = metaQualifier?.valueReferenceAttribute || "id";
    const displayAttribute: string = metaQualifier?.valueDisplayAttribute || "name";

    // The qualifiers are loaded when the picker is first opened, or straight away when a qualifier is already chosen,
    // so its label can be shown. The list is cached by its URL, so every condition on the same field shares one
    // request.
    const [ hasOpened, setHasOpened ] = useState<boolean>(false);
    const { data: fetchedResources, isLoading } =
        useGetResourceListOrResourceDetails(valuesUrl, !!valuesUrl && (hasOpened || !!expressionQualifier));

    const options: ValueInputAutocompleteOptionsInterface[] = React.useMemo(
        () => toQualifierOptions(fetchedResources, referenceAttribute, displayAttribute),
        [ fetchedResources, referenceAttribute, displayAttribute ]
    );

    // The stored qualifier is the reference attribute; show its label once the list has arrived, and
    // fall back to the raw qualifier so a value set before this list loaded is never shown as blank.
    const selected: ValueInputAutocompleteOptionsInterface =
        options.find((option: ValueInputAutocompleteOptionsInterface) => option.id === expressionQualifier)
        ?? (expressionQualifier ? { id: expressionQualifier, label: expressionQualifier } : null);

    return (
        <Autocomplete
            className="autocomplete"
            disabled={ readonly }
            data-componentid={ componentId }
            options={ options }
            loading={ isLoading }
            onOpen={ () => setHasOpened(true) }
            value={ selected }
            isOptionEqualToValue={ (
                option: ValueInputAutocompleteOptionsInterface,
                value: ValueInputAutocompleteOptionsInterface
            ) => option.id === value?.id }
            getOptionLabel={ (option: ValueInputAutocompleteOptionsInterface) => option?.label ?? "" }
            onChange={ (_: React.SyntheticEvent, option: ValueInputAutocompleteOptionsInterface) => {
                updateConditionExpression(
                    option?.id ?? "",
                    ruleId,
                    conditionId,
                    expressionId,
                    targetField,
                    true
                );
            } }
            renderInput={ (params: AutocompleteRenderInputParams) => (
                <TextField
                    { ...params }
                    InputProps={ {
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                { isLoading && <CircularProgress color="inherit" size={ 16 } /> }
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
 * Qualifier input for a field that names a family of values rather than a single one.
 *
 * @param props - Props injected to the component.
 * @returns The qualifier input, or null when the field takes no qualifier.
 */
const ConditionQualifierInput: FunctionComponent<ConditionQualifierInputPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-input-qualifier",
    readonly,
    ruleId,
    conditionId,
    expressionId,
    expressionQualifier,
    metaQualifier,
    targetField = ExpressionFieldTypes.Qualifier
}: ConditionQualifierInputPropsInterface) => {

    const { updateConditionExpression } = useRulesContext();
    const handleExpressionChangeDebounced: ReturnType<typeof useDebouncedConditionExpressionChange> =
        useDebouncedConditionExpressionChange();

    // A field that names a single value publishes no qualifier metadata, and so takes no qualifier.
    if (!metaQualifier) {
        return null;
    }

    if (metaQualifier.inputType === "input") {
        return (
            <ExpressionTextField
                readonly={ readonly }
                storedValue={ expressionQualifier }
                data-componentid={ componentId }
                onValueChange={ (value: string) => handleExpressionChangeDebounced(
                    value,
                    ruleId,
                    conditionId,
                    expressionId,
                    targetField,
                    true
                ) }
            />
        );
    }

    if (metaQualifier.inputType === "options") {
        if (metaQualifier.values?.length > 0) {
            return (
                <Select
                    disabled={ readonly }
                    value={ expressionQualifier ?? "" }
                    data-componentid={ componentId }
                    onChange={ (e: SelectChangeEvent) => {
                        updateConditionExpression(
                            e.target.value,
                            ruleId,
                            conditionId,
                            expressionId,
                            targetField,
                            true
                        );
                    } }
                >
                    { metaQualifier.values.map((item: ListDataInterface, index: number) => (
                        <MenuItem value={ item.name } key={ `${expressionId}-key-${index}` }>
                            { item.displayName }
                        </MenuItem>
                    )) }
                </Select>
            );
        }

        const valuesUrl: string = metaQualifier.links?.find((link: LinkInterface) => link.rel === "values")?.href;

        if (valuesUrl) {
            return (
                <QualifierReferenceAutocomplete
                    readonly={ readonly }
                    data-componentid={ componentId }
                    ruleId={ ruleId }
                    conditionId={ conditionId }
                    expressionId={ expressionId }
                    expressionQualifier={ expressionQualifier }
                    metaQualifier={ metaQualifier }
                    valuesUrl={ valuesUrl }
                    targetField={ targetField }
                />
            );
        }
    }

    return null;
};

/**
 * Input for a literal value, in the style the field's value metadata asks for: free text, a fixed list,
 * or a list fetched from the endpoint the metadata links to.
 *
 * @param props - Props injected to the component.
 * @returns The literal input.
 */
const ConditionLiteralInput: FunctionComponent<ConditionLiteralInputPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-input-value",
    readonly,
    findMetaValuesAgainst,
    ruleId,
    conditionId,
    expressionField,
    expressionId,
    expressionValue,
    metaValue,
    setIsResourceMissing,
    hiddenResources = EMPTY_ARRAY,
    hiddenValues = EMPTY_ARRAY,
    endAdornment
}: ConditionLiteralInputPropsInterface) => {

    const { updateConditionExpression } = useRulesContext();
    const handleExpressionChangeDebounced: ReturnType<typeof useDebouncedConditionExpressionChange> =
        useDebouncedConditionExpressionChange();

    if (metaValue?.inputType === "input" || null) {
        return (
            <ExpressionTextField
                readonly={ readonly }
                storedValue={ expressionValue }
                data-componentid={ componentId }
                onValueChange={ (value: string) => handleExpressionChangeDebounced(
                    value,
                    ruleId,
                    conditionId,
                    expressionId,
                    ExpressionFieldTypes.Value,
                    true
                ) }
            />
        );
    }

    if (metaValue?.inputType === "options") {
        if (metaValue?.values?.length > 0) {

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
                    data-componentid={ componentId }
                    endAdornment={ endAdornment }
                    sx={ endAdornment ? SELECT_WITH_END_ADORNMENT_SX : undefined }
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
                    { metaValue.values?.filter((item: ListDataInterface) =>
                        !hiddenValues.includes(item.name)
                    ).map((item: ListDataInterface, index: number) => (
                        <MenuItem value={ item.name } key={ `${expressionId}-${index}` }>
                            { item.displayName }
                        </MenuItem>
                    )) }
                </Select>
            );
        }

        if (metaValue?.links?.length >= 1) {
            const initialResourcesLoadUrl: string = metaValue?.links.find(
                (link: LinkInterface) => link.rel === "values")?.href;
            const filterBaseResourcesUrl: string = metaValue?.links.find(
                (link: LinkInterface) => link.rel === "filter")?.href;

            if ((expressionField === "application" && initialResourcesLoadUrl && filterBaseResourcesUrl) ||
                (expressionField === "claim" && initialResourcesLoadUrl)) {

                return (
                    <ResourceListSelect
                        readonly={ readonly }
                        ruleId={ ruleId }
                        conditionId={ conditionId }
                        setIsResourceMissing={ setIsResourceMissing }
                        expressionField={ expressionField }
                        expressionId={ expressionId }
                        expressionValue={ expressionValue }
                        findMetaValuesAgainst={ findMetaValuesAgainst }
                        initialResourcesLoadUrl={ initialResourcesLoadUrl }
                        filterBaseResourcesUrl={ filterBaseResourcesUrl }
                        hiddenResources={ hiddenResources }
                        endAdornment={ endAdornment }
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
 * Props interface of a source of the qualifiers of a field a value may be read from.
 */
interface ValueFieldOptionsSourcePropsInterface {
    /**
     * A field that names a family of values, listed from the endpoint its qualifier metadata links to.
     */
    meta: ConditionExpressionMetaInterface;
    onOptions: (fieldName: string, options: QualifierOptionInterface[]) => void;
}

/**
 * Lists the qualifiers of one field a value may be read from.
 *
 * @param props - Props injected to the component.
 * @returns Nothing; the options are handed to `onOptions`.
 */
const ValueFieldOptionsSource: FunctionComponent<ValueFieldOptionsSourcePropsInterface> = ({
    meta,
    onOptions
}: ValueFieldOptionsSourcePropsInterface): ReactElement => {
    const valuesUrl: string = meta.qualifier?.links?.find((link: LinkInterface) => link.rel === "values")?.href;
    const referenceAttribute: string = meta.qualifier?.valueReferenceAttribute || "id";
    const displayAttribute: string = meta.qualifier?.valueDisplayAttribute || "name";

    const { data: fetchedResources } = useGetResourceListOrResourceDetails(valuesUrl, !!valuesUrl);

    useEffect(() => {
        onOptions(meta.field?.name, toResourceList(fetchedResources)
            .filter((resource: Record<string, unknown>) => resource?.[referenceAttribute])
            .map((resource: Record<string, unknown>): QualifierOptionInterface => ({
                dataType: resource.dataType as string,
                label: (resource[displayAttribute] || resource[referenceAttribute]) as string,
                value: resource[referenceAttribute] as string
            }))
            .sort((a: QualifierOptionInterface, b: QualifierOptionInterface) => (a.label > b.label ? 1 : -1)));
    }, [ fetchedResources, meta, referenceAttribute, displayAttribute ]);

    return null;
};

/**
 * Props interface of the condition value input wired to the rule.
 */
interface ConditionValueReferenceInputPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the rule is shown for reading only.
     */
    readonly?: boolean;
    /**
     * ID of the rule the expression belongs to.
     */
    ruleId: string;
    /**
     * ID of the condition group the expression belongs to.
     */
    conditionId: string;
    /**
     * The expression whose value is edited.
     */
    expression: ConditionExpressionInterface;
    /**
     * Data type of the expression's own field, when its qualifier states one.
     */
    leftDataType?: string;
    /**
     * Metadata of the expression's own field, which says how a literal of it is entered.
     */
    fieldMeta: ConditionExpressionMetaInterface;
    /**
     * The fields the value may be read from.
     */
    fieldMetas: ConditionExpressionMetaInterface[];
    /**
     * What the operator compares with: a single value, or a set for `in` and `notIn`.
     */
    valueInput: OperatorValueInputType;
    /**
     * Called to flag that a resource the value refers to no longer exists.
     */
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
    /**
     * Resources left out of the lists of values.
     */
    hiddenResources?: string[];
    /**
     * Values left out of the lists of values.
     */
    hiddenValues?: string[];
}

/**
 * The value of a condition whose field may also be compared with another field: one input that takes a
 * literal or a field.
 *
 * @param props - Props injected to the component.
 * @returns The value input.
 */
const ConditionValueReferenceInput: FunctionComponent<ConditionValueReferenceInputPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-input-value",
    readonly,
    ruleId,
    conditionId,
    expression,
    leftDataType,
    fieldMeta,
    fieldMetas,
    valueInput,
    setIsResourceMissing,
    hiddenResources = EMPTY_ARRAY,
    hiddenValues = EMPTY_ARRAY
}: ConditionValueReferenceInputPropsInterface): ReactElement => {
    const { updateConditionExpression } = useRulesContext();
    const handleExpressionChangeDebounced: ReturnType<typeof useDebouncedConditionExpressionChange> =
        useDebouncedConditionExpressionChange();

    const [ listedQualifiers, setListedQualifiers ] = useState<Record<string, QualifierOptionInterface[]>>({});

    const readsField: boolean = expression.valueField !== undefined;

    const handleListedOptions: (fieldName: string, options: QualifierOptionInterface[]) => void = useCallback(
        (fieldName: string, options: QualifierOptionInterface[]): void => {
            setListedQualifiers((previous: Record<string, QualifierOptionInterface[]>) =>
                ({ ...previous, [fieldName]: options }));
        }, []);

    const listedMetas: ConditionExpressionMetaInterface[] = fieldMetas.filter(
        (meta: ConditionExpressionMetaInterface) => !(meta.qualifier?.values?.length > 0)
            && meta.qualifier?.links?.some((link: LinkInterface) => link.rel === "values"));

    const availableFields: FieldOptionInterface[] = useMemo((): FieldOptionInterface[] => fieldMetas
        .map((meta: ConditionExpressionMetaInterface): FieldOptionInterface => {
            const field: FieldOptionInterface = { label: meta.field?.displayName, name: meta.field?.name };

            if (!meta.qualifier) {
                return field;
            }
            if (meta.qualifier.values?.length > 0) {
                return {
                    ...field,
                    qualifiers: meta.qualifier.values.map((item: ListDataInterface): QualifierOptionInterface => ({
                        label: item.displayName,
                        value: item.name
                    }))
                };
            }
            if (listedMetas.includes(meta)) {
                return { ...field, qualifiers: listedQualifiers[meta.field?.name] ?? [] };
            }

            // Nothing lists the qualifiers of this field, so one is typed in.
            return { ...field, isQualifierTyped: true, qualifiers: [] };
        }), [ fieldMetas, listedQualifiers ]);

    const value: ConditionValueType = toConditionValue(expression);

    const handleChange: (next: ConditionValueType) => void = (next: ConditionValueType): void => {
        // A literal is typed a letter at a time, so it is written once typing pauses; switching to or from
        // a field is written at once.
        if (!readsField && next.type === "literal") {
            handleExpressionChangeDebounced(next.literal, ruleId, conditionId, expression.id,
                ExpressionFieldTypes.Value, true);

            return;
        }

        toExpressionChanges(expression, next).forEach((change: ExpressionChangeInterface) =>
            updateConditionExpression(change.value, ruleId, conditionId, expression.id, change.fieldName, true));
    };

    // A literal entered with another input gets the field toggle at the end of that input's box.
    const renderLiteralInput: (fieldToggle: ReactNode) => ReactElement = (fieldToggle: ReactNode): ReactElement => {
        if (valueInput === "list") {
            return (
                <ConditionValuesInput
                    readonly={ readonly }
                    ruleId={ ruleId }
                    conditionId={ conditionId }
                    expressionId={ expression.id }
                    expressionValues={ expression.values }
                    metaValue={ fieldMeta?.value }
                    hiddenResources={ hiddenResources }
                    endAdornment={ fieldToggle }
                />
            );
        }
        if (fieldMeta?.value?.inputType === "options") {
            return (
                <ConditionLiteralInput
                    readonly={ readonly }
                    conditionId={ conditionId }
                    expressionField={ expression.field }
                    expressionId={ expression.id }
                    expressionValue={ expression.value }
                    findMetaValuesAgainst={ fieldMeta }
                    metaValue={ fieldMeta.value }
                    ruleId={ ruleId }
                    setIsResourceMissing={ setIsResourceMissing }
                    hiddenResources={ hiddenResources }
                    hiddenValues={ hiddenValues }
                    endAdornment={ fieldToggle }
                />
            );
        }

        return undefined;
    };

    return (
        <>
            { /* The lists of qualifiers are needed only once the value is read from a field. */ }
            { readsField && listedMetas.map((meta: ConditionExpressionMetaInterface) => (
                <ValueFieldOptionsSource key={ meta.field?.name } meta={ meta } onOptions={ handleListedOptions } />
            )) }
            <ConditionValueInput
                data-componentid={ componentId }
                disabled={ readonly }
                value={ value }
                onChange={ handleChange }
                leftField={ {
                    name: expression.field,
                    ...(expression.qualifier && { qualifier: expression.qualifier })
                } }
                leftDataType={ leftDataType }
                availableFields={ availableFields }
                renderLiteralInput={ renderLiteralInput }
            />
        </>
    );
};

/**
 * Who a role is for, as approval workflow rules show it: the audience, and for an application role the application.
 *
 * @param option - The value.
 * @returns The audience, or undefined for a value that is not a role.
 */
const toAudienceLabel = (option: ResourceValueOptionInterface): string | undefined => {
    if (!option?.audience) {
        return undefined;
    }

    return option.audience.toLowerCase() === "application" && option.audienceDisplay
        ? `${option.audience} | ${option.audienceDisplay}`
        : option.audience;
};

/**
 * Looks up a value that the first page of a linked list did not hold, and renders nothing.
 *
 * @param props - Props injected to the component.
 * @returns Null.
 */
const ResourceValueLabelSource: FunctionComponent<ResourceValueLabelSourcePropsInterface> = ({
    id,
    detailsUrl,
    displayAttribute,
    onOption
}: ResourceValueLabelSourcePropsInterface): ReactElement => {
    const { data: resource } = useGetResourceListOrResourceDetails(detailsUrl, !!detailsUrl);

    useEffect(() => {
        const label: unknown = resource?.[displayAttribute];

        if (typeof label === "string" && label) {
            onOption({
                audience: resource?.audience?.type,
                audienceDisplay: resource?.audience?.display,
                id,
                label
            });
        }
    }, [ resource ]);

    return null;
};

/**
 * Input for the set of values `in` and `notIn` compare against, picked from the list the field links to, such as
 * the roles or groups of the organization.
 *
 * @param props - Props injected to the component.
 * @returns The list value input.
 */
const ResourceValuesInput: FunctionComponent<ResourceValuesInputPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-input-values",
    readonly,
    ruleId,
    conditionId,
    expressionId,
    expressionValues,
    metaValue,
    valuesUrl,
    filterUrl,
    hiddenResources = EMPTY_ARRAY,
    endAdornment
}: ResourceValuesInputPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const { updateConditionExpression } = useRulesContext();

    const referenceAttribute: string = metaValue?.valueReferenceAttribute || "id";
    const displayAttribute: string = metaValue?.valueDisplayAttribute || "name";
    const values: string[] = expressionValues ?? EMPTY_ARRAY;

    // The list is loaded when the picker is first opened, or straight away when values are already chosen, so
    // their labels can be shown.
    const [ hasOpened, setHasOpened ] = useState<boolean>(false);
    // What is typed, and the search it starts once typing pauses.
    const [ searchText, setSearchText ] = useState<string>("");
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    // Every value seen, so a chosen value keeps its label and audience after a search changes the list.
    const [ knownOptions, setKnownOptions ] = useState<Record<string, ResourceValueOptionInterface>>({});

    const rememberOptions: (seen: ResourceValueOptionInterface[]) => void = useCallback(
        (seen: ResourceValueOptionInterface[]): void => {
            setKnownOptions((previous: Record<string, ResourceValueOptionInterface>) => {
                const next: Record<string, ResourceValueOptionInterface> = { ...previous };

                seen.forEach((option: ResourceValueOptionInterface) => {
                    next[option.id] = option;
                });

                return next;
            });
        }, []);

    const handleOption: (option: ResourceValueOptionInterface) => void = useCallback(
        (option: ResourceValueOptionInterface): void => rememberOptions([ option ]), []);

    const updateSearchQuery: ReturnType<typeof debounce> = useMemo(
        () => debounce((text: string) => setSearchQuery(text), 300), []);

    useEffect(() => () => updateSearchQuery.cancel(), []);

    // Typing searches the server through the filter link, for values whose label contains what is typed.
    const listUrl: string = searchQuery && filterUrl
        ? filterUrl.replace(/filter=[^&]*/, `filter=${displayAttribute}+co+${encodeURIComponent(searchQuery)}`)
        : valuesUrl;

    const clearSearch: () => void = (): void => {
        updateSearchQuery.cancel();
        setSearchText("");
        setSearchQuery("");
    };

    const { data: fetchedResources, isLoading } =
        useGetResourceListOrResourceDetails(listUrl, hasOpened || values.length > 0);

    const options: ResourceValueOptionInterface[] = useMemo((): ResourceValueOptionInterface[] => {
        const resources: Map<unknown, Record<string, unknown>> = new Map(
            toResourceList(fetchedResources).map((resource: Record<string, unknown>) =>
                [ resource[referenceAttribute], resource ]));

        return toQualifierOptions(fetchedResources, referenceAttribute, displayAttribute)
            .filter((option: ValueInputAutocompleteOptionsInterface) => !hiddenResources.includes(option.id))
            .map((option: ValueInputAutocompleteOptionsInterface): ResourceValueOptionInterface => {
                // Only roles carry an audience.
                const audience: { type?: string; display?: string } =
                    resources.get(option.id)?.audience as { type?: string; display?: string };

                return { ...option, audience: audience?.type, audienceDisplay: audience?.display };
            });
    }, [ fetchedResources, referenceAttribute, displayAttribute, hiddenResources ]);

    useEffect(() => {
        if (options.length === 0) {
            return;
        }

        rememberOptions(options);
    }, [ options ]);

    // A chosen value the list does not hold, such as one past its first page, is looked up on its own once the
    // list has arrived. A value whose resource is gone keeps showing what is stored.
    const detailsBaseUrl: string = valuesUrl?.split("?")[0];
    const unlabelledValues: string[] = isLoading
        ? []
        : values.filter((id: string) => !knownOptions[id]
            && !options.some((option: ValueInputAutocompleteOptionsInterface) => option.id === id));

    // Kept the same between renders: the autocomplete empties what is typed whenever it is handed a new value.
    const selected: ResourceValueOptionInterface[] = useMemo(
        (): ResourceValueOptionInterface[] => values.map(
            (id: string): ResourceValueOptionInterface => knownOptions[id] ?? { id, label: id }),
        [ values, knownOptions ]
    );

    return (
        <>
            { unlabelledValues.map((id: string) => (
                <ResourceValueLabelSource
                    key={ id }
                    id={ id }
                    detailsUrl={ `${detailsBaseUrl}/${encodeURIComponent(id)}` }
                    displayAttribute={ displayAttribute }
                    onOption={ handleOption }
                />
            )) }
            <Autocomplete
                multiple
                disableCloseOnSelect
                // Each value has its own remove button, so clearing them all at once makes way for the field toggle.
                disableClearable={ !!endAdornment }
                className="autocomplete"
                disabled={ readonly }
                data-componentid={ componentId }
                options={ options }
                value={ selected }
                loading={ isLoading }
                onOpen={ () => setHasOpened(true) }
                // A search runs on the server, so the options it returns are shown as they come.
                filterOptions={ filterUrl
                    ? (listed: ValueInputAutocompleteOptionsInterface[]) => listed
                    : undefined }
                isOptionEqualToValue={ (
                    option: ValueInputAutocompleteOptionsInterface,
                    value: ValueInputAutocompleteOptionsInterface
                ) => option.id === value?.id }
                getOptionLabel={ (option: ValueInputAutocompleteOptionsInterface) => option?.label ?? "" }
                // A role is shown with its audience, as approval workflow rules show it, since an organization role
                // and an application role can share a name.
                renderOption={ (props: HTMLAttributes<HTMLLIElement>, option: ResourceValueOptionInterface) => (
                    <li { ...props } key={ option.id }>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            gap={ 1 }
                            width="100%"
                        >
                            <span>{ option.label }</span>
                            { option.audience && <Chip size="small" label={ toAudienceLabel(option) } /> }
                        </Box>
                    </li>
                ) }
                // A chosen role names its audience on hover, as approval workflows do, so two roles of the same
                // name can be told apart before one is removed.
                renderTags={ (chosen: ResourceValueOptionInterface[], getTagProps: AutocompleteRenderGetTagProps) =>
                    chosen.map((option: ResourceValueOptionInterface, index: number) => {
                        const tag: ReactElement = (
                            <Chip { ...getTagProps({ index }) } key={ option.id } label={ option.label } />
                        );

                        return option.audience
                            ? <Tooltip key={ option.id } title={ toAudienceLabel(option) }>{ tag }</Tooltip>
                            : tag;
                    }) }
                // The search is kept while values are picked, so several can be chosen from one search, and is
                // cleared when the list closes. The autocomplete's own resets are not followed for that reason.
                inputValue={ searchText }
                onInputChange={ (_: React.SyntheticEvent, text: string, reason: AutocompleteInputChangeReason) => {
                    if (reason === "input") {
                        setSearchText(text);
                        updateSearchQuery(text);
                    } else if (reason === "clear") {
                        clearSearch();
                    }
                } }
                onClose={ clearSearch }
                onChange={ (_: React.SyntheticEvent, chosen: ResourceValueOptionInterface[]) => {
                    rememberOptions(chosen);
                    updateConditionExpression(
                        chosen.map((option: ResourceValueOptionInterface) => option.id),
                        ruleId,
                        conditionId,
                        expressionId,
                        ExpressionFieldTypes.Values,
                        true
                    );
                } }
                renderInput={ (params: AutocompleteRenderInputParams) => (
                    <TextField
                        { ...params }
                        inputProps={ { ...params.inputProps, "aria-label": t("rules:fields.valueInput.valueLabel") } }
                        placeholder={ values.length > 0 ? "" : t("rules:fields.autocomplete.placeholderText") }
                        sx={ endAdornment ? TEXT_BOX_WITH_FIELD_TOGGLE_SX : undefined }
                        InputProps={ {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    { isLoading && <CircularProgress color="inherit" size={ 16 } /> }
                                    { endAdornment }
                                    { params.InputProps.endAdornment }
                                </>
                            )
                        } }
                    />
                ) }
            />
        </>
    );
};

/**
 * Input for the set of values `in` and `notIn` compare against.
 *
 * @param props - Props injected to the component.
 * @returns The list value input.
 */
const ConditionValuesInput: FunctionComponent<ConditionValuesInputPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-condition-expression-input-values",
    readonly,
    ruleId,
    conditionId,
    expressionId,
    expressionValues,
    metaValue,
    hiddenResources = EMPTY_ARRAY,
    endAdornment
}: ConditionValuesInputPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const { updateConditionExpression } = useRulesContext();

    const valuesUrl: string = metaValue?.inputType === "options"
        ? metaValue?.links?.find((link: LinkInterface) => link.rel === "values")?.href
        : undefined;

    if (valuesUrl) {
        return (
            <ResourceValuesInput
                data-componentid={ componentId }
                readonly={ readonly }
                ruleId={ ruleId }
                conditionId={ conditionId }
                expressionId={ expressionId }
                expressionValues={ expressionValues }
                metaValue={ metaValue }
                valuesUrl={ valuesUrl }
                filterUrl={ metaValue?.links?.find((link: LinkInterface) => link.rel === "filter")?.href }
                hiddenResources={ hiddenResources }
                endAdornment={ endAdornment }
            />
        );
    }

    const handleChange: (values: string[]) => void = (values: string[]): void => {
        const entries: string[] = values
            .flatMap((value: string) => value.split(","))
            .map((value: string) => value.trim())
            .filter((value: string) => value.length > 0);

        updateConditionExpression(
            Array.from(new Set(entries)),
            ruleId,
            conditionId,
            expressionId,
            ExpressionFieldTypes.Values,
            true
        );
    };

    return (
        <Autocomplete
            multiple
            freeSolo
            // Each value has its own remove button, so clearing them all at once makes way for the field toggle.
            disableClearable={ !!endAdornment }
            className="autocomplete"
            disabled={ readonly }
            data-componentid={ componentId }
            options={ [] as string[] }
            value={ expressionValues ?? [] }
            onChange={ (_: React.SyntheticEvent, values: string[]) => handleChange(values) }
            renderInput={ (params: AutocompleteRenderInputParams) => (
                <TextField
                    { ...params }
                    inputProps={ { ...params.inputProps, "aria-label": t("rules:fields.valueInput.valueLabel") } }
                    placeholder={ expressionValues?.length > 0 ? "" : t("rules:fields.valueInput.listPlaceholder") }
                    sx={ endAdornment ? TEXT_BOX_WITH_FIELD_TOGGLE_SX : undefined }
                    InputProps={ {
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                { endAdornment }
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
 * What the resource behind an expression's qualifier says about the values it holds.
 *
 * @param metaQualifier - How the field's qualifier is chosen.
 * @param qualifier     - The qualifier on the expression.
 * @returns The constraints, or undefined when the qualifier's resource states none.
 */
const useQualifierConstraints = (
    metaQualifier: ExpressionValueInterface,
    qualifier: string
): OperatorConstraintsInterface | undefined => {
    const valuesUrl: string = metaQualifier?.links?.find((link: LinkInterface) => link.rel === "values")?.href;
    const referenceAttribute: string = metaQualifier?.valueReferenceAttribute || "id";

    const { data: fetchedResources } = useGetResourceListOrResourceDetails(valuesUrl, !!valuesUrl && !!qualifier);

    return useMemo((): OperatorConstraintsInterface | undefined => {
        const resource: Record<string, unknown> =
            findQualifierResource(fetchedResources, referenceAttribute, qualifier);

        if (!resource || (resource.multiValued === undefined && resource.dataType === undefined)) {
            return undefined;
        }

        return {
            dataType: resource.dataType as string,
            multiValued: resource.multiValued === true || resource.multiValued === "true"
        };
    }, [ fetchedResources, referenceAttribute, qualifier ]);
};

/**
 * Rule expression component to recursive render.
 *
 * @param props - Props injected to the component.
 * @returns Rule expression component.
 */
const RuleExpression: FunctionComponent<RuleExpressionComponentProps> = ({
    ["data-componentid"]: componentId = "rules-condition-expression",
    readonly,
    expression,
    ruleId,
    conditionId,
    index,
    isConditionLast,
    isConditionExpressionRemovable,
    isAndLimitReached = false,
    hiddenConditions = EMPTY_ARRAY,
    hiddenResources = EMPTY_ARRAY,
    hiddenValues = EMPTY_ARRAY
}: RuleExpressionComponentProps) => {

    const { t } = useTranslation();
    const {
        addNewRuleConditionExpression,
        conditionExpressionsMeta,
        updateConditionExpression,
        removeRuleConditionExpression
    } = useRulesContext();

    const [ isResourceMissing, setIsResourceMissing ] = useState<boolean>(false);

    const findMetaValuesAgainst: ConditionExpressionMetaInterface = conditionExpressionsMeta.find(
        (expressionMeta: ConditionExpressionMetaInterface) => expressionMeta?.field?.name === expression.field
    );

    const qualifierConstraints: OperatorConstraintsInterface | undefined =
        useQualifierConstraints(findMetaValuesAgainst?.qualifier, expression.qualifier);

    // Offered only when the field publishes fields its value may be read from, so a field that
    // publishes none -- every action and workflow field -- keeps its value input exactly as it was.
    const valueFieldMetas: ConditionExpressionMetaInterface[] = useMemo(
        (): ConditionExpressionMetaInterface[] => (findMetaValuesAgainst?.valueFieldNames ?? [])
            .filter((name: string) => !hiddenConditions.includes(name))
            .map((name: string) => conditionExpressionsMeta.find(
                (meta: ConditionExpressionMetaInterface) => meta?.field?.name === name))
            .filter(Boolean),
        [ findMetaValuesAgainst, conditionExpressionsMeta, hiddenConditions ]
    );
    const readsField: boolean = expression.valueField !== undefined;
    // What the chosen operator compares the field with: nothing, a set, or a single value.
    const valueInput: OperatorValueInputType = getValueInput(expression.operator, findMetaValuesAgainst?.operators);

    // The field publishes every operator any of its qualifiers could take; the chosen qualifier decides which
    // of those apply.
    const operators: OperatorInterface[] = useMemo(
        () => narrowOperators(findMetaValuesAgainst?.operators, qualifierConstraints),
        [ findMetaValuesAgainst?.operators, qualifierConstraints ]
    );

    useEffect(() => {
        // An operator the newly chosen qualifier cannot take is cleared rather than left to fail on save.
        if (qualifierConstraints && expression.operator
            && !operators?.some((operator: ListDataInterface) => operator.name === expression.operator)) {
            updateConditionExpression(
                "",
                ruleId,
                conditionId,
                expression.id,
                ExpressionFieldTypes.Operator,
                false
            );
        }
    }, [ qualifierConstraints, operators, expression.operator ]);

    return (
        <Box
            sx={ { position: "relative" } }
            key={ index }
            className="box-container"
            data-componentid={ componentId }
        >
            { isResourceMissing && (
                <Alert
                    severity="warning"
                    className="alert-warning"
                    sx={ { mb: 2 } }
                    data-componentid={ "rules-condition-expression-alert" }
                >
                    <AlertTitle
                        className="alert-title"
                    >
                        <Trans i18nKey="actions:fields.rules.alerts.resourceNotFound.title">
                            The resource linked to this rule is no longer available.
                        </Trans>
                    </AlertTitle>
                    <Trans i18nKey="actions:fields.rules.alerts.resourceNotFound.description">
                        Please update to a valid resource.
                    </Trans>
                </Alert>
            ) }
            <FormControl fullWidth size="small">
                <Select
                    disabled={ readonly }
                    value={ expression.field }
                    data-componentid={ "rules-condition-expression-input-field-select" }
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

                        // A qualifier belongs to the field it was chosen for -- a claim URI means
                        // nothing against a different field -- so it is cleared with the value.
                        updateConditionExpression(
                            "",
                            ruleId,
                            conditionId,
                            expression.id,
                            ExpressionFieldTypes.Qualifier,
                            true
                        );
                    } }
                >
                    { conditionExpressionsMeta?.filter((item: ConditionExpressionMetaInterface) =>
                        !hiddenConditions.includes(item.field?.name)
                    ).map((item: ConditionExpressionMetaInterface, index: number) => (
                        <MenuItem value={ item.field?.name } key={ `${expression.id}-${index}` }>
                            { item.field?.displayName }
                        </MenuItem>
                    )) }
                </Select>
            </FormControl>
            { findMetaValuesAgainst?.qualifier && (
                <FormControl fullWidth size="small" sx={ { mt: 1 } }>
                    <ConditionQualifierInput
                        readonly={ readonly }
                        ruleId={ ruleId }
                        conditionId={ conditionId }
                        expressionId={ expression.id }
                        expressionQualifier={ expression.qualifier }
                        metaQualifier={ findMetaValuesAgainst?.qualifier }
                    />
                </FormControl>
            ) }
            <FormControl sx={ { mb: 1, minWidth: 120, mt: 1 } } size="small">
                <Select
                    disabled={ readonly }
                    value={ expression.operator }
                    data-componentid={ "rules-condition-expression-input-operator-select" }
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
                    { operators?.map((item: ListDataInterface, index: number) => (
                        <MenuItem value={ item.name } key={ `${expression.id}-${index}` }>
                            { item.displayName }
                        </MenuItem>
                    )) }
                </Select>
            </FormControl>
            { valueInput !== "none" && (<FormControl fullWidth size="small">
                { valueFieldMetas.length > 0 || readsField ? (
                    <ConditionValueReferenceInput
                        readonly={ readonly }
                        ruleId={ ruleId }
                        conditionId={ conditionId }
                        expression={ expression }
                        leftDataType={ qualifierConstraints?.dataType }
                        fieldMeta={ findMetaValuesAgainst }
                        fieldMetas={ valueFieldMetas }
                        valueInput={ valueInput }
                        setIsResourceMissing={ setIsResourceMissing }
                        hiddenResources={ hiddenResources }
                        hiddenValues={ hiddenValues }
                    />
                ) : valueInput === "list" ? (
                    <ConditionValuesInput
                        readonly={ readonly }
                        ruleId={ ruleId }
                        conditionId={ conditionId }
                        expressionId={ expression.id }
                        expressionValues={ expression.values }
                        metaValue={ findMetaValuesAgainst?.value }
                        hiddenResources={ hiddenResources }
                    />
                ) : (
                    <ConditionLiteralInput
                        readonly={ readonly }
                        conditionId={ conditionId }
                        expressionField={ expression.field }
                        expressionId={ expression.id }
                        expressionValue={ expression.value }
                        findMetaValuesAgainst={ findMetaValuesAgainst }
                        metaValue={ findMetaValuesAgainst?.value }
                        ruleId={ ruleId }
                        setIsResourceMissing={ setIsResourceMissing }
                        hiddenResources={ hiddenResources }
                        hiddenValues={ hiddenValues }
                    />
                ) }
            </FormControl>) }
            { ((!readonly) || (readonly && !isConditionLast)) && (
                <FormControl sx={ { mt: 1 } } size="small">
                    <Tooltip title={ isAndLimitReached ? t("rules:limits.andLimitReached") : "" }>
                        <span>
                            <Button
                                disabled={ readonly || isAndLimitReached }
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
                                startIcon={ !readonly ? <PlusIcon /> : null }
                            >
                                { t("rules:buttons.and") }
                            </Button>
                        </span>
                    </Tooltip>
                </FormControl>
            ) }

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
const RuleConditions: FunctionComponent<RulesComponentPropsInterface> = ({
    ["data-componentid"]: componentId = "rules-component-condition",
    readonly,
    rule: ruleInstance
}: RulesComponentPropsInterface): ReactElement => {

    const ruleConditions: RuleConditionsInterface = ruleInstance.rules;

    const {
        addNewRuleConditionExpression,
        hidden,
        limits
    } = useRulesContext();

    const maxAnd: number = limits?.maxExpressionsCombinedWithAnd;
    const isOrLimitReached: boolean = !!limits?.maxRulesCombinedWithOr
        && ruleConditions?.length >= limits.maxRulesCombinedWithOr;

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

    /**
     * Condition value input component.
     *
     * @param props - Props injected to the component.
     * @returns Condition value input component.
     */
    return (
        <div data-componentid={ componentId }>
            { ruleConditions?.map(
                (condition: RuleConditionInterface, index: number) =>
                    ruleInstance?.condition === AdjoiningOperatorTypes.Or && (
                        <Fragment key={ index }>
                            { condition.condition === AdjoiningOperatorTypes.And && (
                                <>
                                    { condition.expressions?.map(
                                        (expression: ConditionExpressionInterface, exprIndex: number) => (
                                            <Box sx={ { mt: 2 } } key={ exprIndex }>
                                                { (condition.expressions.length === (exprIndex + 1)) }
                                                <RuleExpression
                                                    readonly={ readonly }
                                                    expression={ expression }
                                                    ruleId={ ruleInstance.id }
                                                    conditionId={ condition.id }
                                                    index={ exprIndex }
                                                    isConditionLast={ condition.expressions.length === (exprIndex + 1) }
                                                    isConditionExpressionRemovable={
                                                        condition.expressions.length > 1 ||
                                                        ruleInstance.rules.length > 1
                                                    }
                                                    isAndLimitReached={
                                                        !!maxAnd && condition.expressions.length >= maxAnd
                                                    }
                                                    hiddenConditions={ hidden.conditions }
                                                    hiddenResources={ hidden.resources }
                                                    hiddenValues={ hidden.values }
                                                />
                                            </Box>
                                        )
                                    ) }
                                </>
                            ) }
                            { ((!readonly && (condition.expressions?.length > 0)) ||
                                (readonly && (condition.expressions?.length !== index))) && (
                                <Divider sx={ { mb: 1, mt: 2 } }>
                                    <Tooltip title={ isOrLimitReached ? t("rules:limits.orLimitReached") : "" }>
                                        <span>
                                            <Button
                                                disabled={ readonly || isOrLimitReached }
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
                                                startIcon={ !readonly ? <PlusIcon /> : null }
                                            >
                                                { t("rules:buttons.or") }
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </Divider>
                            ) }
                        </Fragment>
                    )
            ) }
        </div>
    );
};

export default RuleConditions;
