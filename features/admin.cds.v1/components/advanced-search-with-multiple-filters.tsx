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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Fab from "@oxygen-ui/react/Fab";
import Typography from "@oxygen-ui/react/Typography";
import { MinusIcon, PlusIcon } from "@oxygen-ui/react-icons";
import { getAdvancedSearchIcons } from "@wso2is/admin.core.v1/configs/ui";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { SearchUtils } from "@wso2is/core/utils";
import { DropdownChild, Field, FormValue, Forms } from "@wso2is/forms";
import {
    AdvancedSearch,
    AdvancedSearchPropsInterface,
    LinkButton,
    PrimaryButton,
    SessionTimedOutContext
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    CSSProperties,
    FunctionComponent,
    ReactElement,
    ReactNode,
    RefObject,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Divider, Form, Grid } from "semantic-ui-react";
import { SWRResponse } from "swr";
import { useProfileSchemaDropdownOptions } from "../hooks/use-profile-attributes";
import { FilterAttributeOption, ProfileSchemaScopeResponse } from "../models/profile-attributes";

interface FilterGroup {
    scope: string;
    applicationId: string;
    attribute: string;
    condition: string;
    value: string;
}

type ProfileSchemaDropdownResult = SWRResponse<ProfileSchemaScopeResponse, AxiosError> & {
    dropdownOptions: FilterAttributeOption[];
};

export interface AdvancedSearchWithMultipleFilters extends IdentifiableComponentInterface {
    children?: ReactNode;
    defaultSearchAttribute: string;
    defaultSearchOperator: string;
    disableSearchFilterDropdown?: boolean;
    dropdownPosition?: AdvancedSearchPropsInterface["dropdownPosition"];
    fill?: AdvancedSearchPropsInterface["fill"];
    onClose?: () => void;
    onFilter: (query: string) => void;
    onSubmitError?: () => boolean;
    filterAttributePlaceholder?: string;
    filterConditionOptions?: DropdownChild[];
    filterConditionsPlaceholder?: string;
    filterValuePlaceholder?: string;
    placeholder: string;
    style?: CSSProperties | undefined;
    submitButtonLabel?: string;
    resetButtonLabel?: string;
    showResetButton?: boolean;
    triggerClearQuery?: boolean;
    enableQuerySearch?: boolean;
    disableSearchAndFilterOptions?: boolean;
    scopes?: string[];
}

export const AdvancedSearchWithMultipleFilters: FunctionComponent<AdvancedSearchWithMultipleFilters> = (
    props: AdvancedSearchWithMultipleFilters
): ReactElement => {

    const {
        defaultSearchAttribute,
        defaultSearchOperator,
        disableSearchFilterDropdown,
        dropdownPosition,
        enableQuerySearch,
        fill,
        filterConditionOptions,
        filterConditionsPlaceholder,
        filterAttributePlaceholder,
        filterValuePlaceholder,
        onClose,
        onFilter,
        onSubmitError,
        placeholder,
        resetButtonLabel,
        showResetButton,
        style,
        submitButtonLabel,
        triggerClearQuery,
        disableSearchAndFilterOptions,
        scopes,
        "data-componentid" : testId
    } = props;

    const { t } = useTranslation();

    const APPLICATION_DATA: string = "application_data";
    const IDENTITY_ATTRIBUTES: string = "identity_attributes";
    const TRAITS: string = "traits";
    const AND_OPERATOR: string = "and";
    const [ isFormSubmitted, setIsFormSubmitted ] = useState<boolean>(false);
    const [ externalSearchQuery, setExternalSearchQuery ] = useState<string>("");
    const [ formKey, setFormKey ] = useState<number>(0);

    const sessionTimedOut: boolean = useContext(SessionTimedOutContext);
    const formRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    // Track which scopes need to be loaded
    const [ activeScopesSet, setActiveScopesSet ] = useState<Set<string>>(() => {
        return scopes ? new Set(scopes) : new Set();
    });

    const [ filterGroups, setFilterGroups ] = useState<FilterGroup[]>([
        {
            applicationId: "",
            attribute: "",
            condition: defaultSearchOperator,
            scope: scopes?.[0] ?? "",
            value: ""
        }
    ]);

    // Use SWR hooks for each active scope
    const identityAttrsResult: ProfileSchemaDropdownResult = useProfileSchemaDropdownOptions(
        activeScopesSet.has("identity_attributes") ? "identity_attributes" : null
    );
    const traitsResult: ProfileSchemaDropdownResult = useProfileSchemaDropdownOptions(
        activeScopesSet.has("traits") ? "traits" : null
    );
    const appDataResult: ProfileSchemaDropdownResult = useProfileSchemaDropdownOptions(
        activeScopesSet.has("application_data") ? "application_data" : null
    );

    // Combine results into a lookup map
    const optionsByScope: Record<string, FilterAttributeOption[]> = useMemo(() => {
        return {
            application_data: appDataResult.dropdownOptions ?? [],
            identity_attributes: identityAttrsResult.dropdownOptions ?? [],
            traits: traitsResult.dropdownOptions ?? []
        };
    }, [
        identityAttrsResult.dropdownOptions,
        traitsResult.dropdownOptions,
        appDataResult.dropdownOptions
    ]);

    const loadingScope: Record<string, boolean> = useMemo(() => {
        return {
            application_data: appDataResult.isLoading ?? false,
            identity_attributes: identityAttrsResult.isLoading ?? false,
            traits: traitsResult.isLoading ?? false
        };
    }, [
        identityAttrsResult.isLoading,
        traitsResult.isLoading,
        appDataResult.isLoading
    ]);

    const defaultFilterConditionOptions: Array<{ text: string; value: string }> = [
        { text: t("common:startsWith"), value: "sw" },
        { text: t("common:contains"), value: "co" },
        { text: t("common:equals"), value: "eq" }
    ];

    const isAppScope = (scope: string): boolean => scope === APPLICATION_DATA;

    // Activate scope for SWR fetching
    const activateScope = (scope: string): void => {
        if (!scope) return;
        setActiveScopesSet((prev: Set<string>) => new Set(prev).add(scope));
    };

    const addFilter = (): void => {
        const firstScope: string = scopes?.[0] ?? "";

        setFilterGroups((prev: FilterGroup[]) => ([
            ...prev,
            {
                applicationId: "",
                attribute: "",
                condition: defaultSearchOperator,
                scope: firstScope,
                value: ""
            }
        ]));

        if (firstScope) {
            activateScope(firstScope);
        }
    };

    const removeFilter = (index: number): void => {
        setFilterGroups((prev: FilterGroup[]) => prev.filter((_: FilterGroup, i: number) => i !== index));
    };

    const handleFormSubmit = (values: Map<string, FormValue>): void => {
        if (onSubmitError && onSubmitError()) return;

        const groups: string[] = [];

        for (let i: number = 0; i < filterGroups.length; i++) {
            const scope: string = values.get(`scope-${i}`) as string;
            const appId: string = values.get(`app-${i}`) as string;
            const attribute: string = values.get(`attribute-${i}`) as string;
            const condition: string = values.get(`condition-${i}`) as string;
            const value: string = values.get(`value-${i}`) as string;

            if (!scope || !attribute || !condition || !value) continue;
            if (isAppScope(scope) && !appId) continue;

            const field: string = isAppScope(scope)
                ? `application_data.${appId}.${attribute}`
                : `${scope}.${attribute}`;

            groups.push(`${field} ${condition} ${value}`);
        }

        const query: string = groups.join(" and ");

        setExternalSearchQuery(query);
        onFilter(query);
        setIsFormSubmitted(true);
    };

    const handleClickOutside = (event: MouseEvent): void => {
        const target: HTMLElement = event.target as HTMLElement;

        if (formRef.current && formRef.current.contains(target)) {
            return;
        }

        // Check if click is on a dropdown menu (which renders outside the form)
        const isDropdownMenu: boolean = target.closest(".ui.dropdown .menu") !== null;
        const isDropdownItem: boolean = target.closest(".item") !== null;

        if (isDropdownMenu || isDropdownItem) {
            return;
        }

        // Check if click is on the search input or search-related elements
        const isSearchInput: boolean = target.closest(".advanced-search") !== null ||
                                    target.closest("input[type=\"text\"]") !== null ||
                                    target.closest(".search") !== null;

        if (isSearchInput) {
            return;
        }

        // Reset and close
        resetAll();
        onClose?.();
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleResetFilter = (): void => {
        resetAll();
    };

    const resetAll = (): void => {
        const firstScope: string = scopes?.[0] ?? "";

        setFilterGroups([
            {
                applicationId: "",
                attribute: "",
                condition: defaultSearchOperator,
                scope: firstScope,
                value: ""
            }
        ]);

        setExternalSearchQuery("");
        onFilter("");
        setIsFormSubmitted(false);

        // Increment key to force form remount
        setFormKey((prev: number) => prev + 1);
    };

    const getAppsForRow = (rowScope: string): string[] => {
        if (!isAppScope(rowScope)) return [];

        const opts: FilterAttributeOption[] = optionsByScope[rowScope] ?? [];
        const ids: string[] = opts
            .filter((o: FilterAttributeOption) => o.applicationId)
            .map((o: FilterAttributeOption) => o.applicationId as string);

        return Array.from(new Set(ids)).sort();
    };

    const getAttributesForRow = (row: FilterGroup): FilterAttributeOption[] => {
        const opts: FilterAttributeOption[] = optionsByScope[row.scope] ?? [];

        if (!isAppScope(row.scope)) {
            return opts;
        }

        return row.applicationId
            ? opts.filter((o: FilterAttributeOption) => o.applicationId === row.applicationId)
            : [];
    };

    const RenderAddFilterDivider: ReactElement = (
        <Box sx={ { alignItems: "center", display: "flex", my: 2 } }>
            <Divider style={ { flex: 1, margin: 0 } } />
            <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={ addFilter }
                startIcon={ <PlusIcon /> }
                sx={ { mx: 2, whiteSpace: "nowrap" } }
            >
                Add filter
            </Button>
            <Divider style={ { flex: 1, margin: 0 } } />
        </Box>
    );

    // Create a combined list of all attributes from all scopes
    const allFilterAttributes: DropdownChild[] = useMemo(() => {
        const combined: FilterAttributeOption[] = [
            ...optionsByScope.identity_attributes,
            ...optionsByScope.traits,
            ...optionsByScope.application_data
        ];

        return combined.map((attr: FilterAttributeOption) => ({
            key: attr.key ?? attr.value,
            text: attr.label,
            value: attr.value
        }));
    }, [ optionsByScope ] );

    return (
        <AdvancedSearch
            disableSearchAndFilterOptions={ disableSearchAndFilterOptions }
            aligned="left"
            disableSearchFilterDropdown={ disableSearchFilterDropdown }
            clearButtonPopupLabel={ t("console:common.advancedSearch.popups.clear") }
            clearIcon={ getAdvancedSearchIcons().clear }
            style={ style }
            defaultSearchStrategy={ `${defaultSearchAttribute} ${defaultSearchOperator} %search-value%` }
            dropdownTriggerPopupLabel={ t("console:common.advancedSearch.popups.dropdown") }
            fill={ fill }
            hintActionKeys={ t("console:common.advancedSearch.hints.querySearch.actionKeys") }
            hintLabel={ t("console:common.advancedSearch.hints.querySearch.label") }
            onExternalSearchQueryClear={ () => setExternalSearchQuery("") }
            onSearchQuerySubmit={ (processQuery: boolean, query: string) => {
                if (!query) {
                    onFilter("");

                    return;
                }

                const isFilterQuery: boolean =
                    query.includes(IDENTITY_ATTRIBUTES) ||
                    query.includes(TRAITS) ||
                    query.includes(APPLICATION_DATA) ||
                    query.includes(AND_OPERATOR);

                if (isFilterQuery) {
                    const prefix: string = `${defaultSearchAttribute} ${defaultSearchOperator} `;
                    const cleanQuery: string = query.startsWith(prefix)
                        ? query.substring(prefix.length)
                        : query;

                    onFilter(cleanQuery);
                } else {
                    if (processQuery) {
                        onFilter(SearchUtils.buildSearchQuery(query));
                    } else {
                        onFilter(`${defaultSearchAttribute} ${defaultSearchOperator} ${query}`);
                    }
                }
            } }
            placeholder={ placeholder }
            resetSubmittedState={ () => setIsFormSubmitted(false) }
            searchOptionsHeader={ t("console:common.advancedSearch.options.header") }
            sessionTimedOut={ sessionTimedOut }
            enableQuerySearch={ enableQuerySearch }
            externalSearchQuery={ externalSearchQuery }
            submitted={ isFormSubmitted }
            dropdownPosition={ dropdownPosition }
            triggerClearQuery={ triggerClearQuery }
            filterConditionOptions={ filterConditionOptions || defaultFilterConditionOptions }
            filterAttributeOptions={ allFilterAttributes }
            data-testid={ testId }
            data-componentid={ testId }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Forms
                            key={ formKey }
                            onSubmit={ handleFormSubmit }
                            ref={ formRef }
                        >
                            <Box
                                sx={ {
                                    "& .ui.dropdown .menu": {
                                        zIndex: 1200
                                    },
                                    maxWidth: 1100,
                                    mx: "auto",
                                    overflow: "visible",
                                    width: "100%"
                                } }
                                className="multiple-filters"
                            >
                                { filterGroups.map((row: FilterGroup, index: number) => {
                                    const appScope: boolean = isAppScope(row.scope);
                                    const apps: string[] = getAppsForRow(row.scope);
                                    const attrs: FilterAttributeOption[] = getAttributesForRow(row);
                                    const isLoadingAttrs: boolean = !!loadingScope[row.scope];

                                    return (
                                        <React.Fragment key={ index }>
                                            <Card
                                                sx={ {
                                                    mb: 2,
                                                    overflow: "visible",
                                                    position: "relative"
                                                } }
                                            >
                                                <Box sx={ { mb: 2 } }>
                                                    <Typography variant="body2">
                                                        Filter { index + 1 }
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={ {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 2
                                                    } }
                                                >
                                                    { /* Row 1 */ }
                                                    <Box
                                                        sx={ {
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: 2
                                                        } }
                                                    >
                                                        <Box sx={ { flex: "1 1 220px", minWidth: 220 } }>
                                                            <Field
                                                                name={ `scope-${index}` }
                                                                placeholder="Select scope"
                                                                required
                                                                type="dropdown"
                                                                children={ (scopes || []).map((s: string) => ({
                                                                    key: s,
                                                                    text: s,
                                                                    value: s
                                                                })) }
                                                                value={ row.scope }
                                                                listen={ (values: Map<string, FormValue>) => {
                                                                    const newScope: string =
                                                                        values.get(`scope-${index}`) as string;

                                                                    if (!newScope || newScope === row.scope) return;

                                                                    activateScope(newScope);

                                                                    setFilterGroups((prev: FilterGroup[]) => {
                                                                        const updated: FilterGroup[] = [ ...prev ];

                                                                        updated[index] = {
                                                                            ...updated[index],
                                                                            applicationId: "",
                                                                            attribute: "",
                                                                            scope: newScope
                                                                        };

                                                                        return updated;
                                                                    });
                                                                } }
                                                            />
                                                        </Box>

                                                        { appScope && (
                                                            <Box sx={ { flex: "1 1 260px", minWidth: 260 } }>
                                                                <Field
                                                                    name={ `app-${index}` }
                                                                    placeholder="Select Application"
                                                                    required
                                                                    type="dropdown"
                                                                    children={ apps.map((id: string) => ({
                                                                        key: id,
                                                                        text: id,
                                                                        value: id
                                                                    })) }
                                                                    value={ row.applicationId }
                                                                    listen={ (values: Map<string, FormValue>) => {
                                                                        const newAppId: string =
                                                                            values.get(`app-${index}`) as string;

                                                                        if (!newAppId || newAppId === row.applicationId)
                                                                            return;

                                                                        setFilterGroups((prev: FilterGroup[]) => {
                                                                            const updated: FilterGroup[] = [ ...prev ];

                                                                            updated[index] = {
                                                                                ...updated[index],
                                                                                applicationId: newAppId,
                                                                                attribute: ""
                                                                            };

                                                                            return updated;
                                                                        });
                                                                    } }
                                                                />
                                                            </Box>
                                                        ) }

                                                        <Box sx={ { flex: "1 1 280px", minWidth: 280 } }>
                                                            <Field
                                                                name={ `attribute-${index}` }
                                                                placeholder={
                                                                    isLoadingAttrs
                                                                        ? "Loading attributes..."
                                                                        : (filterAttributePlaceholder
                                                                            || t("console:common.advancedSearch." +
                                                                                "form.inputs." +
                                                                                "filterAttribute.placeholder"))
                                                                }
                                                                required
                                                                type="dropdown"
                                                                disabled={ isLoadingAttrs ||
                                                                    (appScope && !row.applicationId) }
                                                                children={ attrs.map((a: FilterAttributeOption,
                                                                    idx: number) => ({
                                                                    key: a.key ?? a.value ?? idx,
                                                                    text: a.label,
                                                                    value: a.value
                                                                })) }
                                                                value={ row.attribute }
                                                                listen={ (values: Map<string, FormValue>) => {
                                                                    const newAttr: string =
                                                                        values.get(`attribute-${index}`) as string;

                                                                    if (!newAttr || newAttr === row.attribute) return;

                                                                    setFilterGroups((prev: FilterGroup[]) => {
                                                                        const updated: FilterGroup[] = [ ...prev ];

                                                                        updated[index] = {
                                                                            ...updated[index],
                                                                            attribute: newAttr
                                                                        };

                                                                        return updated;
                                                                    });
                                                                } }
                                                            />
                                                        </Box>
                                                    </Box>

                                                    { /* Row 2 */ }
                                                    <Box
                                                        sx={ {
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: 2
                                                        } }
                                                    >
                                                        <Box sx={ { flex: "1 1 220px", minWidth: 220 } }>
                                                            <Field
                                                                name={ `condition-${index}` }
                                                                label={
                                                                    t("console:common.advancedSearch.form.inputs." +
                                                                    "filterCondition.label") }
                                                                placeholder={ filterConditionsPlaceholder
                                                                    || t("console:common.advancedSearch.form." +
                                                                        "inputs.filterCondition.placeholder") }
                                                                required
                                                                type="dropdown"
                                                                children={ (filterConditionOptions ||
                                                                    defaultFilterConditionOptions)
                                                                    .map((o: any, idx: number) => ({
                                                                        key: o.key ?? idx,
                                                                        text: o.text,
                                                                        value: o.value
                                                                    })) }
                                                                value={ row.condition }
                                                                listen={ (values: Map<string, FormValue>) => {
                                                                    const newCondition: string =
                                                                        values.get(`condition-${index}`) as string;

                                                                    if (!newCondition ||
                                                                        newCondition === row.condition) return;

                                                                    setFilterGroups((prev: FilterGroup[]) => {
                                                                        const updated: FilterGroup[] = [ ...prev ];

                                                                        updated[index] = {
                                                                            ...updated[index],
                                                                            condition: newCondition
                                                                        };

                                                                        return updated;
                                                                    });
                                                                } }
                                                            />
                                                        </Box>

                                                        <Box sx={ { flex: "2 1 360px", minWidth: 320 } }>
                                                            <Field
                                                                name={ `value-${index}` }
                                                                label={
                                                                    t("console:common.advancedSearch.form.inputs." +
                                                                    "filterValue.label") }
                                                                placeholder={ filterValuePlaceholder
                                                                    || t("console:common.advancedSearch.form." +
                                                                        "inputs.filterValue.placeholder") }
                                                                required
                                                                type="text"
                                                                value={ row.value }
                                                                listen={ (values: Map<string, FormValue>) => {
                                                                    const newValue: string =
                                                                        values.get(`value-${index}`) as string;

                                                                    if (newValue === row.value) return;

                                                                    setFilterGroups((prev: FilterGroup[]) => {
                                                                        const updated: FilterGroup[] = [ ...prev ];

                                                                        updated[index] = {
                                                                            ...updated[index],
                                                                            value: newValue ?? ""
                                                                        };

                                                                        return updated;
                                                                    });
                                                                } }
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                { index > 0 && (
                                                    <Fab
                                                        color="default"
                                                        aria-label="remove"
                                                        size="small"
                                                        className="delete-button"
                                                        sx={ {
                                                            position: "absolute",
                                                            right: 8,
                                                            top: 8
                                                        } }
                                                        onClick={ () => removeFilter(index) }
                                                        data-componentid={ `${testId}-remove-filter-${index}` }

                                                    >
                                                        <MinusIcon className="delete-button-icon" />
                                                    </Fab>
                                                ) }
                                            </Card>

                                            { index === filterGroups.length - 1 ? null : RenderAddFilterDivider }
                                        </React.Fragment>
                                    );
                                }) }

                                { RenderAddFilterDivider }
                            </Box>

                            <Divider hidden />

                            <Form.Group inline>
                                <PrimaryButton
                                    size="small"
                                    type="submit"
                                    data-testid={ `${testId}-search-button` }
                                    data-componentid={ `${testId}-search-button` }
                                >
                                    { submitButtonLabel || t("common:search") }
                                </PrimaryButton>

                                { showResetButton && (
                                    <LinkButton
                                        size="small"
                                        type="reset"
                                        data-testid={ `${testId}-reset-button` }
                                        data-componentid={ `${testId}-reset-button` }
                                        onClick={ handleResetFilter }
                                    >
                                        { resetButtonLabel || t("common:resetFilters") }
                                    </LinkButton>
                                ) }
                            </Form.Group>
                        </Forms>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AdvancedSearch>
    );
};

AdvancedSearchWithMultipleFilters.defaultProps = {
    disableSearchFilterDropdown: false,
    dropdownPosition: "bottom right",
    enableQuerySearch: false,
    showResetButton: false
};

export default AdvancedSearchWithMultipleFilters;
