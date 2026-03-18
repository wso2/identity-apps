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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Autocomplete, {
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Divider from "@oxygen-ui/react/Divider";
import Fab from "@oxygen-ui/react/Fab";
import FormControl from "@oxygen-ui/react/FormControl";
import Link from "@oxygen-ui/react/Link";
import { ListItemProps } from "@oxygen-ui/react/ListItem";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { MinusIcon, PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useRulesContext } from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import {
    ConditionExpressionMetaInterface,
    ExpressionValueInterface,
    LinkInterface,
    ListDataInterface
} from "@wso2is/admin.rules.v1/models/meta";
import { ResourceInterface } from "@wso2is/admin.rules.v1/models/resource";
import {
    AdjoiningOperatorTypes,
    ConditionExpressionInterface,
    ExpressionFieldTypes,
    RuleConditionInterface,
    RuleConditionsInterface,
    RuleInterface
} from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import debounce from "lodash-es/debounce";
import React, {
    ChangeEvent,
    Dispatch,
    Fragment,
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AutoCompleteRenderOption from "./auto-complete-render-option";
import RoleAudienceValueSelector from "./role-audience-value-selector";
import WorkflowClaimSelector, { WorkflowClaimOptionInterface } from "./workflow-claim-selector";
import { APPROVAL_WORKFLOW_RULE_FIELDS } from "../../constants/approval-workflow-constants";
import useGetWorkflowResources from "../../hooks/use-get-workflow-resources";
import { normalizeResourceResponse } from "../../utils/resource-utils";
import { normalizeUserstoreList } from "../../utils/userstore-utils";
import {
    WorkflowClaimFieldGroupInterface,
    WorkflowClaimGroupFieldType,
    buildWorkflowClaimMetaGroups,
    getClaimUriFromWorkflowClaimField,
    getWorkflowClaimDisplayName,
    getWorkflowClaimGroupFromField,
    isWorkflowClaimGroupField,
    isWorkflowClaimMeta
} from "../../utils/workflow-claim-utils";
import "./approval-workflow-rule-conditions.scss";

/**
 * Normalizes resource items, applying userstore-specific normalization when applicable.
 *
 * @param items - Raw resource items.
 * @param initialResourcesLoadUrl - The URL used to load resources.
 * @param systemReservedUserStores - List of system-reserved userstore names to filter out.
 * @returns Processed resource items.
 */
const processResourceItems = (
    items: ResourceInterface[],
    initialResourcesLoadUrl: string,
    systemReservedUserStores: string[]
): ResourceInterface[] => {
    if (initialResourcesLoadUrl?.toLowerCase().includes("/userstores")) {
        return normalizeUserstoreList(items, systemReservedUserStores);
    }

    return items;
};

/**
 * Value input autocomplete options interface.
 */
interface ValueInputAutocompleteOptionsInterface {
    id: string;
    label: string;
    audience?: string;
    audienceDisplay?: string;
    isDisabled?: boolean;
}

/**
 * Field select options interface.
 */
interface FieldSelectionOptionInterface {
    displayName: string;
    name: string;
}

/**
 * Component common props interface.
 */
interface ComponentCommonPropsInterface extends IdentifiableComponentInterface {
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
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
    hiddenResources?: string[];
    hiddenValues?: string[];
    readonly?: boolean;
}

/**
 * Resource list select props interface.
 */
interface ResourceListSelectProps extends ComponentCommonPropsInterface {
    filterBaseResourcesUrl: string;
    findMetaValuesAgainst: ConditionExpressionMetaInterface;
    initialResourcesLoadUrl: string;
    setIsResourceMissing: Dispatch<React.SetStateAction<boolean>>;
    hiddenResources?: string[];
    readonly?: boolean;
}

/**
 * Value input autocomplete props interface.
 */
interface ValueInputAutocompleteProps extends ComponentCommonPropsInterface {
    resourceDetails: ResourceInterface;
    valueReferenceAttribute: string;
    valueDisplayAttribute: string;
    initialResourcesLoadUrl: string;
    filterBaseResourcesUrl: string;
    shouldFetch: boolean;
    hiddenResources?: string[];
    showClearFilter?: boolean;
    readonly?: boolean;
}

/**
 * Rule expression component props interface.
 */
interface RuleExpressionComponentProps extends IdentifiableComponentInterface {
    expression: ConditionExpressionInterface;
    ruleId: string;
    conditionId: string;
    index: number;
    isConditionLast: boolean;
    isConditionExpressionRemovable: boolean;
    hiddenConditions?: string[];
    hiddenResources?: string[];
    hiddenValues?: string[];
    readonly?: boolean;
}

/**
 * Props interface of {@link ApprovalWorkflowRuleConditions}
 */
export interface ApprovalWorkflowRuleConditionsPropsInterface extends IdentifiableComponentInterface {
    readonly?: boolean;
    rule: RuleInterface;
}

/**
 * Approval-workflow-specific rule conditions component.
 *
 * Renders condition expressions for workflow rule fields including user.domain,
 * user.groups, user.roles, role.id, role.audience, user.claims, initiator.claims, etc.
 *
 * @param props - Props injected to the component.
 * @returns Rule conditions component.
 */
const ApprovalWorkflowRuleConditions: FunctionComponent<ApprovalWorkflowRuleConditionsPropsInterface> = ({
    ["data-componentid"]: componentId = "approval-workflow-rules-condition",
    readonly,
    rule: ruleInstance
}: ApprovalWorkflowRuleConditionsPropsInterface): ReactElement => {
    const ruleConditions: RuleConditionsInterface = ruleInstance.rules;

    const {
        addNewRuleConditionExpression,
        conditionExpressionsMeta,
        updateConditionExpression,
        removeRuleConditionExpression,
        hidden
    } = useRulesContext();

    const { t } = useTranslation();

    const workflowClaimMetaGroups: WorkflowClaimFieldGroupInterface[] = useMemo(
        () => buildWorkflowClaimMetaGroups(conditionExpressionsMeta, {
            initiatorClaim: t("approvalWorkflows:pageLayout.create.ruleConditions.fields.initiatorClaim"),
            userClaim: t("approvalWorkflows:pageLayout.create.ruleConditions.fields.userClaim")
        }),
        [ conditionExpressionsMeta, t ]
    );

    const workflowClaimMetaGroupMap: Map<string, ConditionExpressionMetaInterface[]> = useMemo(
        () =>
            new Map<string, ConditionExpressionMetaInterface[]>(
                workflowClaimMetaGroups.map(
                    (group: WorkflowClaimFieldGroupInterface) => [ group.field.name, group.claims ]
                )
            ),
        [ workflowClaimMetaGroups ]
    );

    const fieldSelectionOptions: FieldSelectionOptionInterface[] = useMemo(() => {
        const baseFieldOptions: FieldSelectionOptionInterface[] = conditionExpressionsMeta
            ?.filter((item: ConditionExpressionMetaInterface) => !isWorkflowClaimMeta(item))
            ?.filter((item: ConditionExpressionMetaInterface) => !hidden?.conditions?.includes(item.field?.name))
            ?.map((item: ConditionExpressionMetaInterface) => ({
                displayName: item.field?.displayName,
                name: item.field?.name
            })) ?? [];
        const workflowClaimFieldOptions: FieldSelectionOptionInterface[] = workflowClaimMetaGroups
            .filter(
                (group: WorkflowClaimFieldGroupInterface) => !hidden?.conditions?.includes(group.field?.name)
            )
            .map((group: WorkflowClaimFieldGroupInterface) => group.field);

        return [ ...baseFieldOptions, ...workflowClaimFieldOptions ];
    }, [ conditionExpressionsMeta, hidden?.conditions, workflowClaimMetaGroups ]);

    /**
     * Debounced function to handle the change of the condition expression.
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
     * Value input autocomplete component for workflow resource fields.
     * Used when a field has many possible values that support server-side filtering.
     */
    const WorkflowResourceAutocomplete: FunctionComponent<ValueInputAutocompleteProps> = ({
        ["data-componentid"]: _componentId = "workflow-condition-expression-input-value",
        valueReferenceAttribute,
        valueDisplayAttribute,
        resourceDetails,
        initialResourcesLoadUrl,
        filterBaseResourcesUrl,
        ruleId: _ruleId,
        conditionId: _conditionId,
        expressionId: _expressionId,
        shouldFetch,
        hiddenResources: _hiddenResources = [],
        showClearFilter = false,
        readonly: isReadonly
    }: ValueInputAutocompleteProps) => {
        const [ inputValue, setInputValue ] = useState<string>(null);
        const [ inputValueLabel, setInputValueLabel ] = useState<string>(null);
        const [ debouncedSearchQuery, setDebouncedSearchQuery ] = useState<string>(null);
        const [ options, setOptions ] = useState<ValueInputAutocompleteOptionsInterface[]>([]);
        const [ open, setOpen ] = useState<boolean>(false);

        const MORE_ITEMS: string = "more-items";
        const CLEAR_OPTION: string = "clear-option";
        const ROLES_ENDPOINT: string = "/Roles";

        const systemReservedUserStores: string[] = useSelector(
            (state: AppState) => state?.config?.ui?.systemReservedUserStores
        );

        const isRolesResource: boolean = initialResourcesLoadUrl?.includes(ROLES_ENDPOINT);

        const setDebouncedSearchQueryDebounced: (value: string) => void = useCallback(
            debounce((value: string) => setDebouncedSearchQuery(value), 700),
            []
        );

        const filterUrl: string = debouncedSearchQuery
            ? filterBaseResourcesUrl?.replace(
                "filter=",
                `filter=${valueDisplayAttribute}+sw+${debouncedSearchQuery}`
            )
            : initialResourcesLoadUrl;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: initialResources = [], isLoading: isInitialLoading }: any =
            useGetWorkflowResources(initialResourcesLoadUrl, shouldFetch);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: filteredResources = [], isLoading: isFiltering }: any =
            useGetWorkflowResources(filterUrl, shouldFetch);

        useEffect(() => {
            if (resourceDetails) {
                setInputValue(resourceDetails[valueReferenceAttribute] || null);
                setInputValueLabel(resourceDetails[valueDisplayAttribute] || null);
            }
        }, [ resourceDetails ]);

        useEffect(() => {
            if (debouncedSearchQuery && filterUrl) {
                const { items: filteredItems } = normalizeResourceResponse(filteredResources);
                const processedFilteredItems: ResourceInterface[] = processResourceItems(
                    filteredItems,
                    initialResourcesLoadUrl,
                    systemReservedUserStores
                );
                const filteredOptions: ValueInputAutocompleteOptionsInterface[] = processedFilteredItems
                    .filter(
                        (resource: ResourceInterface) =>
                            !_hiddenResources.includes(resource[valueReferenceAttribute])
                    )
                    .map((resource: ResourceInterface) => ({
                        audience: resource?.audience?.type,
                        audienceDisplay: resource?.audience?.display,
                        id: resource[valueReferenceAttribute],
                        label: resource[valueDisplayAttribute]
                    }));

                setOptions(filteredOptions);
            } else {
                const { items: initialItems } = normalizeResourceResponse(initialResources);
                const processedInitialItems: ResourceInterface[] = processResourceItems(
                    initialItems,
                    initialResourcesLoadUrl,
                    systemReservedUserStores
                );
                const initialOptions: ValueInputAutocompleteOptionsInterface[] = processedInitialItems
                    .filter(
                        (resource: ResourceInterface) =>
                            !_hiddenResources.includes(resource[valueReferenceAttribute])
                    )
                    .map((resource: ResourceInterface) => ({
                        audience: resource?.audience?.type,
                        audienceDisplay: resource?.audience?.display,
                        id: resource[valueReferenceAttribute],
                        label: resource[valueDisplayAttribute]
                    }));

                setOptions(initialOptions);
            }
        }, [ debouncedSearchQuery, initialResources, filteredResources, filterUrl ]);

        const { totalResults: filteredTotalResults, count: filteredCount } = normalizeResourceResponse(
            filteredResources
        );
        const hasMoreItems: boolean = filteredTotalResults > filteredCount;

        const autocompleteComponentsProps: object = useMemo(() => ({
            popper: {
                modifiers: [
                    {
                        enabled: true,
                        fn: ({ state }: { state: Record<string, Record<string, unknown>> }) => {
                            const popperStyles: Record<string, unknown> =
                                state.styles.popper as Record<string, unknown>;

                            popperStyles.width =
                                `${(state.rects.reference as Record<string, number>).width}px`;
                        },
                        name: "sameWidth",
                        phase: "beforeWrite",
                        requires: [ "computeStyles" ]
                    },
                    {
                        enabled: false,
                        name: "flip"
                    },
                    {
                        enabled: false,
                        name: "preventOverflow"
                    }
                ],
                style: { zIndex: 9999 }
            }
        }), []);

        return (
            <Autocomplete
                className="autocomplete"
                disabled={ isReadonly }
                data-componentid={ _componentId }
                open={ open }
                onOpen={ () => setOpen(true) }
                onClose={ () => setOpen(false) }
                componentsProps={ autocompleteComponentsProps }
                options={ [
                    ...options,
                    ...(hasMoreItems
                        ? [ {
                            id: MORE_ITEMS,
                            isDisabled: true,
                            label: t("rules:fields.autocomplete.moreItemsMessage")
                        } ]
                        : []),
                    ...(showClearFilter && inputValueLabel
                        ? [ {
                            id: CLEAR_OPTION,
                            isDisabled: false,
                            label: t("rules:fields.autocomplete.clearFilterActionText")
                        } ]
                        : [])
                ] }
                filterOptions={ (opts: ValueInputAutocompleteOptionsInterface[]) => opts }
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
                    if (value?.isDisabled) return;

                    if (value?.id === CLEAR_OPTION) {
                        setInputValueLabel("");
                        setDebouncedSearchQuery("");
                        setTimeout(() => setOpen(true), 0);

                        return;
                    }

                    if (value) {
                        handleExpressionChangeDebounced(
                            value.id,
                            _ruleId,
                            _conditionId,
                            _expressionId,
                            ExpressionFieldTypes.Value,
                            true
                        );
                    }
                } }
                inputValue={ inputValueLabel }
                onInputChange={ (event: ChangeEvent, value: string) => {
                    setInputValueLabel(value);
                    setDebouncedSearchQueryDebounced(value);
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
                                    { params.InputProps.endAdornment }
                                </>
                            )
                        } }
                    />
                ) }
                renderOption={ (props: ListItemProps, option: {
                    label: string;
                    id: string;
                    isDisabled: boolean;
                    audience?: string;
                    audienceDisplay?: string }) => {
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

                    if (isRolesResource) {
                        return (
                            <AutoCompleteRenderOption
                                renderOptionProps={ props }
                                displayName={ option.label }
                                audience={ option.audience }
                                audienceDisplay={ option.audienceDisplay }
                            />
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
     * Resource list select component for workflow fields.
     * Handles claim autocomplete, searchable autocomplete (roles, groups), and simple Select (userstores).
     */
    const WorkflowResourceListSelect: FunctionComponent<ResourceListSelectProps> = ({
        ["data-componentid"]: _componentId = "workflow-condition-expression-input-value",
        ruleId: _ruleId,
        conditionId: _conditionId,
        setIsResourceMissing,
        expressionValue: _expressionValue,
        expressionId: _expressionId,
        findMetaValuesAgainst,
        initialResourcesLoadUrl,
        filterBaseResourcesUrl,
        hiddenResources: _hiddenResources = [],
        readonly: isReadonly
    }: ResourceListSelectProps) => {
        const [ resourceDetails, setResourceDetails ] = useState<ResourceInterface>(null);
        const valueReferenceAttribute: string = findMetaValuesAgainst?.value?.valueReferenceAttribute || "id";
        const valueDisplayAttribute: string = findMetaValuesAgainst?.value?.valueDisplayAttribute || "name";

        const systemReservedUserStores: string[] = useSelector(
            (state: AppState) => state?.config?.ui?.systemReservedUserStores
        );

        // Generic detail fetch for non-claim fields.
        const needsDetailFetch: boolean = valueReferenceAttribute !== valueDisplayAttribute;
        const detailBaseUrl: string = initialResourcesLoadUrl?.split("?")[0];

        const shouldFetchDetails: boolean =
            !!_expressionValue && !!detailBaseUrl && needsDetailFetch;
        const detailsUrl: string = shouldFetchDetails
            ? `${detailBaseUrl}/${_expressionValue}`
            : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resourcesListResponse: any = useGetWorkflowResources(initialResourcesLoadUrl, true);
        const fetchedResourcesList: any = resourcesListResponse.data;
        const isResourcesListLoading: boolean = resourcesListResponse.isLoading;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resourceDetailsResponse: any = useGetWorkflowResources(detailsUrl, shouldFetchDetails);
        const resourcesDetails: any = resourceDetailsResponse.data;
        const isResourceDetailsLoading: boolean = resourceDetailsResponse.isLoading;
        const resourceDetailsError: any = resourceDetailsResponse.error;

        useEffect(() => {
            if (!isResourceDetailsLoading) {
                if (resourceDetailsError) {
                    setIsResourceMissing(true);
                    setResourceDetails(null);
                } else {
                    setResourceDetails(resourcesDetails);
                }
            }
        }, [ isResourceDetailsLoading, resourceDetailsError ]);

        if (isResourcesListLoading || !fetchedResourcesList) {
            return <CircularProgress size={ 20 } />;
        }

        // Generic path for workflow fields (roles, groups, userstores, etc.).
        // If filtering is supported, use searchable autocomplete.
        if (filterBaseResourcesUrl && initialResourcesLoadUrl) {
            return (
                <WorkflowResourceAutocomplete
                    conditionId={ _conditionId }
                    ruleId={ _ruleId }
                    expressionId={ _expressionId }
                    expressionValue={ _expressionValue }
                    resourceDetails={ resourceDetails }
                    valueReferenceAttribute={ valueReferenceAttribute }
                    valueDisplayAttribute={ valueDisplayAttribute }
                    initialResourcesLoadUrl={ initialResourcesLoadUrl }
                    filterBaseResourcesUrl={ filterBaseResourcesUrl }
                    shouldFetch={ true }
                    hiddenResources={ _hiddenResources }
                    showClearFilter={ false }
                    readonly={ isReadonly }
                />
            );
        }

        // Otherwise fallback to a normal Select dropdown.
        const { items: normalizedItems } = normalizeResourceResponse(fetchedResourcesList);
        const ROLES_ENDPOINT: string = "/Roles";

        // Special handling for userstores (user.domain / initiator.domain).
        const processedItems: ResourceInterface[] = processResourceItems(
            normalizedItems,
            initialResourcesLoadUrl,
            systemReservedUserStores
        );

        const items: ResourceInterface[] =
            resourceDetails &&
            _expressionValue &&
            !processedItems.some(
                (item: ResourceInterface) => item[valueReferenceAttribute] === _expressionValue
            )
                ? [ resourceDetails, ...processedItems ]
                : processedItems;

        return (
            <Select
                disabled={ isReadonly }
                value={ _expressionValue || "" }
                displayEmpty
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
                renderValue={ (selected: string) => {
                    if (!selected) {
                        return (
                            <Box component="span" sx={ { color: "text.disabled" } }>
                                { t("rules:fields.autocomplete.selectPlaceholderText") }
                            </Box>
                        );
                    }

                    return selected;
                } }
            >
                { items
                    ?.filter(
                        (resource: ResourceInterface) =>
                            !_hiddenResources.includes(resource[valueReferenceAttribute])
                    )
                    .map((resource: ResourceInterface, index: number) => {

                        const isRolesResource: boolean =
                            initialResourcesLoadUrl?.includes(ROLES_ENDPOINT);

                        if (isRolesResource) {
                            return (
                                <MenuItem
                                    value={ resource[valueReferenceAttribute] }
                                    key={ `${_expressionId}-${index}` }
                                >
                                    <AutoCompleteRenderOption
                                        displayName={ resource[valueDisplayAttribute] }
                                        audience={ resource.audience?.type }
                                        audienceDisplay={ resource.audience?.display }
                                        renderOptionProps={ {} as HTMLAttributes<HTMLLIElement> }
                                    />
                                </MenuItem>
                            );
                        }

                        return (
                            <MenuItem
                                value={ resource[valueReferenceAttribute] }
                                key={ `${_expressionId}-${index}` }
                            >
                                { resource[valueDisplayAttribute] }
                            </MenuItem>
                        );
                    }) }
            </Select>
        );
    };

    /**
     * Condition value input component.
     * Routes to the appropriate value renderer based on the meta input type.
     */
    const WorkflowConditionValueInput: FunctionComponent<ConditionValueInputProps> = ({
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
        readonly: isReadonly
    }: ConditionValueInputProps) => {
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
                />
            );
        }

        // Text input with local state to prevent focus loss.
        if (metaValue?.inputType === "input" || null) {
            return (
                <TextInputValue
                    expressionValue={ _expressionValue }
                    ruleId={ _ruleId }
                    conditionId={ _conditionId }
                    expressionId={ _expressionId }
                    readonly={ isReadonly }
                />
            );
        }

        if (metaValue?.inputType === "options") {
            if (metaValue?.values?.length > 1) {
                // Set first value of the list if option is empty.
                if (_expressionValue === "") {
                    handleExpressionChangeDebounced(
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
     * Text input value component with local state to prevent focus loss.
     * Commits the value to the context on blur instead of on every keystroke.
     */
    interface TextInputValuePropsInterface {
        expressionValue: string;
        ruleId: string;
        conditionId: string;
        expressionId: string;
        readonly?: boolean;
    }

    const TextInputValue: FunctionComponent<TextInputValuePropsInterface> = ({
        expressionValue: _expressionValue,
        ruleId: _ruleId,
        conditionId: _conditionId,
        expressionId: _expressionId,
        readonly: isReadonly
    }: TextInputValuePropsInterface): ReactElement => {
        const [ localValue, setLocalValue ] = useState<string>(_expressionValue ?? "");

        useEffect(() => {
            setLocalValue(_expressionValue ?? "");
        }, [ _expressionValue ]);

        return (
            <TextField
                disabled={ isReadonly }
                value={ localValue }
                data-componentid="workflow-condition-expression-input-text"
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

    /**
     * Rule expression component for approval workflow conditions.
     * Includes workflow claim group selector support.
     */
    const ApprovalWorkflowRuleExpression: FunctionComponent<RuleExpressionComponentProps> = ({
        ["data-componentid"]: _componentId = "workflow-condition-expression",
        expression,
        ruleId: _ruleId,
        conditionId: _conditionId,
        index,
        isConditionLast,
        isConditionExpressionRemovable,
        hiddenConditions: _hiddenConditions = [],
        hiddenResources: _hiddenResources = [],
        hiddenValues: _hiddenValues = [],
        readonly: isReadonly
    }: RuleExpressionComponentProps) => {
        const [ isResourceMissing, setIsResourceMissing ] = useState<boolean>(false);

        const findMetaValuesAgainst: ConditionExpressionMetaInterface = conditionExpressionsMeta.find(
            (expressionMeta: ConditionExpressionMetaInterface) => expressionMeta?.field?.name === expression.field
        );
        const selectedWorkflowClaimGroup: WorkflowClaimGroupFieldType | null = getWorkflowClaimGroupFromField(
            expression.field
        );
        const workflowClaimOptions: WorkflowClaimOptionInterface[] = selectedWorkflowClaimGroup
            ? (workflowClaimMetaGroupMap.get(selectedWorkflowClaimGroup) ?? []).map(
                (claimMeta: ConditionExpressionMetaInterface) => ({
                    claimUri: getClaimUriFromWorkflowClaimField(claimMeta?.field?.name),
                    fieldName: claimMeta?.field?.name,
                    id: claimMeta?.field?.name,
                    label: getWorkflowClaimDisplayName(claimMeta?.field?.displayName)
                })
            )
            : [];
        const displayedFieldValue: string = selectedWorkflowClaimGroup ?? expression.field;

        return (
            <Box
                sx={ { position: "relative" } }
                key={ index }
                className="box-container"
                data-componentid={ _componentId }
            >
                { isResourceMissing && (
                    <Alert
                        severity="warning"
                        className="alert-warning"
                        sx={ { mb: 2 } }
                        data-componentid={ "workflow-condition-expression-alert" }
                    >
                        <AlertTitle className="alert-title">
                            <Trans i18nKey={ t("actions:fields.rules.alerts.resourceNotFound.title") }>
                                The resource linked to this rule is no longer available.
                            </Trans>
                        </AlertTitle>
                        <Trans i18nKey={ t("actions:fields.rules.alerts.resourceNotFound.description") }>
                            Please update to a valid resource.
                        </Trans>
                    </Alert>
                ) }
                <FormControl fullWidth size="small">
                    <Select
                        disabled={ isReadonly }
                        value={ displayedFieldValue }
                        data-componentid={ "workflow-condition-expression-input-field-select" }
                        MenuProps={ {
                            disablePortal: false,
                            sx: { zIndex: 9999 }
                        } }
                        onChange={ (e: SelectChangeEvent) => {
                            const selectedFieldValue: string = e.target.value;
                            const newField: string | undefined = isWorkflowClaimGroupField(selectedFieldValue)
                                ? workflowClaimMetaGroupMap.get(selectedFieldValue)?.[0]?.field?.name
                                : selectedFieldValue;
                            const meta: ConditionExpressionMetaInterface | undefined =
                                conditionExpressionsMeta.find(
                                    (expressionMeta: ConditionExpressionMetaInterface) =>
                                        expressionMeta?.field?.name === newField
                                );

                            const defaultOperator: string = meta?.operators?.[0]?.name || "";

                            if (!newField) {
                                return;
                            }

                            updateConditionExpression(
                                newField,
                                _ruleId,
                                _conditionId,
                                expression.id,
                                ExpressionFieldTypes.Field,
                                true
                            );

                            updateConditionExpression(
                                defaultOperator,
                                _ruleId,
                                _conditionId,
                                expression.id,
                                ExpressionFieldTypes.Operator,
                                true
                            );

                            updateConditionExpression(
                                "",
                                _ruleId,
                                _conditionId,
                                expression.id,
                                ExpressionFieldTypes.Value,
                                true
                            );
                        } }
                    >
                        { fieldSelectionOptions.map((item: FieldSelectionOptionInterface, index: number) => (
                            <MenuItem value={ item.name } key={ `${expression.id}-${index}` }>
                                { item.displayName }
                            </MenuItem>
                        )) }
                    </Select>
                </FormControl>
                { /* If the selected field is a workflow claim group, display the claim selector. */ }
                { selectedWorkflowClaimGroup && workflowClaimOptions.length > 0 && (
                    <FormControl fullWidth size="small" sx={ { mt: 1 } }>
                        <WorkflowClaimSelector
                            claimOptions={ workflowClaimOptions }
                            conditionId={ _conditionId }
                            expressionField={ expression.field }
                            expressionId={ expression.id }
                            expressionOperator={ expression.operator }
                            readonly={ isReadonly }
                            ruleId={ _ruleId }
                        />
                    </FormControl>
                ) }
                <FormControl sx={ { mb: 1, minWidth: 120, mt: 1 } } size="small">
                    <Select
                        disabled={ isReadonly }
                        value={ expression.operator }
                        data-componentid={ "workflow-condition-expression-input-operator-select" }
                        MenuProps={ {
                            disablePortal: false,
                            sx: { zIndex: 9999 }
                        } }
                        onChange={ (e: SelectChangeEvent) => {
                            updateConditionExpression(
                                e.target.value,
                                _ruleId,
                                _conditionId,
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
                    <WorkflowConditionValueInput
                        conditionId={ _conditionId }
                        expressionId={ expression.id }
                        expressionValue={ expression.value }
                        findMetaValuesAgainst={ findMetaValuesAgainst }
                        metaValue={ findMetaValuesAgainst?.value }
                        ruleId={ _ruleId }
                        setIsResourceMissing={ setIsResourceMissing }
                        hiddenResources={ _hiddenResources }
                        hiddenValues={ _hiddenValues }
                        readonly={ isReadonly }
                    />
                </FormControl>
                { ((!isReadonly) || (isReadonly && !isConditionLast)) && (
                    <FormControl sx={ { mt: 1 } } size="small">
                        <Button
                            disabled={ isReadonly }
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={ () => {
                                addNewRuleConditionExpression(
                                    _ruleId,
                                    _conditionId,
                                    AdjoiningOperatorTypes.And,
                                    expression.id
                                );
                            } }
                            className="add-button"
                            startIcon={ !isReadonly ? <PlusIcon /> : null }
                        >
                            { t("rules:buttons.and") }
                        </Button>
                    </FormControl>
                ) }

                { isConditionExpressionRemovable && !isReadonly && (
                    <Fab
                        aria-label="delete"
                        size="small"
                        sx={ { position: "absolute" } }
                        className="remove-button"
                        onClick={ () => removeRuleConditionExpression(_ruleId, expression.id) }
                    >
                        <MinusIcon className="remove-button-icon" />
                    </Fab>
                ) }
            </Box>
        );
    };

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
                                                <ApprovalWorkflowRuleExpression
                                                    expression={ expression }
                                                    ruleId={ ruleInstance.id }
                                                    conditionId={ condition.id }
                                                    index={ exprIndex }
                                                    isConditionLast={
                                                        condition.expressions.length === (exprIndex + 1)
                                                    }
                                                    isConditionExpressionRemovable={
                                                        condition.expressions.length > 1 ||
                                                        ruleInstance.rules.length > 1
                                                    }
                                                    hiddenConditions={ hidden?.conditions }
                                                    hiddenResources={ hidden?.resources }
                                                    hiddenValues={ hidden?.values }
                                                    readonly={ readonly }
                                                />
                                            </Box>
                                        )
                                    ) }
                                </>
                            ) }
                            { ((!readonly && (condition.expressions?.length > 0)) ||
                                (readonly && (condition.expressions?.length !== index))) && (
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
                                        startIcon={ !readonly ? <PlusIcon /> : null }
                                    >
                                        { t("rules:buttons.or") }
                                    </Button>
                                </Divider>
                            ) }
                        </Fragment>
                    )
            ) }
        </div>
    );
};

export default ApprovalWorkflowRuleConditions;
