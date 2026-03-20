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
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Link from "@oxygen-ui/react/Link";
import { ListItemProps } from "@oxygen-ui/react/ListItem";
import TextField from "@oxygen-ui/react/TextField";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useRulesContext } from "@wso2is/admin.rules.v1/hooks/use-rules-context";
import { ResourceInterface } from "@wso2is/admin.rules.v1/models/resource";
import { ExpressionFieldTypes } from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import debounce from "lodash-es/debounce";
import React, {
    ChangeEvent,
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AutoCompleteRenderOption from "./auto-complete-render-option";
import useGetWorkflowResources from "../../hooks/use-get-workflow-resources";
import { normalizeResourceResponse, processResourceItems } from "../../utils/resource-utils";

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
 * Props interface of {@link WorkflowResourceAutocomplete}
 */
export interface WorkflowResourceAutocompletePropsInterface extends IdentifiableComponentInterface {
    conditionId: string;
    expressionId: string;
    expressionValue: string;
    ruleId: string;
    resourceDetails: ResourceInterface;
    valueReferenceAttribute: string;
    valueDisplayAttribute: string;
    initialResourcesLoadUrl: string;
    filterBaseResourcesUrl: string;
    shouldFetch: boolean;
    hiddenResources?: string[];
    showClearFilter?: boolean;
    readonly?: boolean;
    showValidationError?: boolean;
}

/**
 * Value input autocomplete component for workflow resource fields.
 * Used when a field has many possible values that support server-side filtering.
 *
 * @param props - Props injected to the component.
 * @returns WorkflowResourceAutocomplete component.
 */
const WorkflowResourceAutocomplete: FunctionComponent<WorkflowResourceAutocompletePropsInterface> = ({
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
    readonly: isReadonly,
    showValidationError = false
}: WorkflowResourceAutocompletePropsInterface) => {
    const [ inputValue, setInputValue ] = useState<string>(null);
    const [ inputValueLabel, setInputValueLabel ] = useState<string>(null);
    const [ debouncedSearchQuery, setDebouncedSearchQuery ] = useState<string>(null);
    const [ options, setOptions ] = useState<ValueInputAutocompleteOptionsInterface[]>([]);
    const [ open, setOpen ] = useState<boolean>(false);

    const MORE_ITEMS: string = "more-items";
    const CLEAR_OPTION: string = "clear-option";
    const ROLES_ENDPOINT: string = "/Roles";

    const { updateConditionExpression } = useRulesContext();
    const { t } = useTranslation();

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
                    updateConditionExpression(
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
                    error={ showValidationError }
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

export default WorkflowResourceAutocomplete;
