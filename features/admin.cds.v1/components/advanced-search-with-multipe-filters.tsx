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
import { commonConfig } from "@wso2is/admin.extensions.v1/configs/common";
import { TestableComponentInterface } from "@wso2is/core/models";
import { SearchUtils } from "@wso2is/core/utils";
import { DropdownChild, Field, FormValue, Forms } from "@wso2is/forms";
import {
    AdvancedSearch,
    AdvancedSearchPropsInterface,
    LinkButton,
    PrimaryButton,
    SessionTimedOutContext
} from "@wso2is/react-components";
import React, {
    CSSProperties,
    FunctionComponent,
    ReactElement,
    ReactNode,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Divider, Form, Grid } from "semantic-ui-react";

interface FilterGroup {
    scope: string;
    applicationId: string;
    attribute: string;
    condition: string;
    value: string;
}

export interface FilterAttributeOption {
    scope: string;
    label: string;
    value: string;
    key?: string;
    applicationId?: string;
}

export interface AdvancedSearchWithMultipleFilters extends TestableComponentInterface {
    children?: ReactNode;
    defaultSearchAttribute: string;
    defaultSearchOperator: string;
    disableSearchFilterDropdown?: boolean;
    dropdownPosition?: AdvancedSearchPropsInterface["dropdownPosition"];
    fill?: AdvancedSearchPropsInterface["fill"];
    onClose?: () => void;
    onFilter: (query: string) => void;
    onSubmitError?: () => boolean;
    onFetchAttributesByScope: (scope: string) => Promise<FilterAttributeOption[]>;
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
        onFetchAttributesByScope,
        placeholder,
        resetButtonLabel,
        showResetButton,
        style,
        submitButtonLabel,
        triggerClearQuery,
        disableSearchAndFilterOptions,
        scopes,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const [ isFormSubmitted, setIsFormSubmitted ] = useState<boolean>(false);
    const [ isFiltersReset, setIsFiltersReset ] = useState<boolean>(false);
    const [ externalSearchQuery, setExternalSearchQuery ] = useState<string>("");

    const sessionTimedOut: boolean = React.useContext(SessionTimedOutContext);
    const formRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const [ optionsByScope, setOptionsByScope ] = useState<Record<string, FilterAttributeOption[]>>({});
    const [ loadingScope, setLoadingScope ] = useState<Record<string, boolean>>({});

    const [ filterGroups, setFilterGroups ] = useState<FilterGroup[]>([
        {
            applicationId: "",
            attribute: "",
            condition: defaultSearchOperator,
            scope: scopes?.[0] ?? "",
            value: ""
        }
    ]);

    const defaultFilterConditionOptions = [
        { text: t("common:startsWith"), value: "sw" },
        { text: t("common:contains"), value: "co" },
        { text: t("common:equals"), value: "eq" }
    ];

    const isAppScope = (scope: string) => scope === "application_data";

    const ensureScopeLoaded = async (scope: string): Promise<void> => {
        if (!scope) return;
        if (optionsByScope[scope]?.length) return;
        if (loadingScope[scope]) return;

        setLoadingScope((p) => ({ ...p, [scope]: true }));

        try {
            const opts: FilterAttributeOption[] = await onFetchAttributesByScope(scope);

            setOptionsByScope((p) => ({ ...p, [scope]: opts ?? [] }));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Failed to load scope:", scope, error);
        } finally {
            setLoadingScope((p) => ({ ...p, [scope]: false }));
        }
    };

    useEffect(() => {
        const firstScope:string = scopes?.[0] ?? "";

        if (firstScope) {
            ensureScopeLoaded(firstScope);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addFilter = (): void => {
        const firstScope:string = scopes?.[0] ?? "";

        setFilterGroups((prev) => ([
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
            ensureScopeLoaded(firstScope);
        }
    };

    const removeFilter = (index: number): void => {
        setFilterGroups((prev:FilterGroup[]) => prev.filter((_:FilterGroup, i: number) => i !== index));
    };

    const handleFormSubmit = (values: Map<string, FormValue>): void => {
        if (onSubmitError && onSubmitError()) return;

        const groups: string[] = [];

        for (let i:number = 0; i < filterGroups.length; i++) {
            const scope: string = values.get(`scope-${i}`) as string;
            const appId: string = values.get(`app-${i}`) as string;
            const attribute: string = values.get(`attribute-${i}`) as string;
            const condition: string = values.get(`condition-${i}`) as string;
            const value: string = values.get(`value-${i}`) as string;

            if (!scope || !attribute || !condition || !value) continue;
            if (isAppScope(scope) && !appId) continue;

            const field:string = isAppScope(scope)
                ? `application_data.${appId}.${attribute}`
                : attribute;

            groups.push(`${field} ${condition} ${value}`);
        }

        const query:string = groups.join(" and ");

        setExternalSearchQuery(query);
        onFilter(query);
        setIsFormSubmitted(true);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            resetAll();
            onClose?.();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleResetFilter = (): void => {
        setIsFiltersReset(true);

        const firstScope:string = scopes?.[0] ?? "";

        setFilterGroups([
            {
                applicationId: "",
                attribute: "",
                condition: defaultSearchOperator,
                scope: firstScope,
                value: ""
            }
        ]);

        if (firstScope) {
            ensureScopeLoaded(firstScope);
        }
    };

    const resetAll = (): void => {
        setExternalSearchQuery("");
        setIsFormSubmitted(false);

        setIsFiltersReset(true);

        const firstScope: string = scopes?.[0] ?? "";

        setFilterGroups([{
            applicationId: "",
            attribute: "",
            condition: defaultSearchOperator,
            scope: firstScope,
            value: ""
        }]);

        if (firstScope) {
            ensureScopeLoaded(firstScope);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const getAppsForRow = (rowScope: string): string[] => {
        if (!isAppScope(rowScope)) return [];

        const opts:FilterAttributeOption[] = optionsByScope[rowScope] ?? [];
        const ids:string[] = opts
            .filter((o:FilterAttributeOption) => o.applicationId)
            .map((o:FilterAttributeOption) => o.applicationId as string);

        return Array.from(new Set(ids)).sort();
    };

    const getAttributesForRow = (row: FilterGroup): FilterAttributeOption[] => {
        const opts:FilterAttributeOption[] = optionsByScope[row.scope] ?? [];

        if (!isAppScope(row.scope)) {
            return opts;
        }

        return row.applicationId
            ? opts.filter((o) => o.applicationId === row.applicationId)
            : [];
    };

    const RenderAddFilterDivider = (
        <Box sx={ { display: "flex", alignItems: "center", my: 2 } }>
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
            onSearchQuerySubmit={ (p, q) => onFilter(p ? SearchUtils.buildSearchQuery(q) : q) }
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
            data-testid={ testId }
            data-componentid={ testId }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Forms
                            onSubmit={ handleFormSubmit }
                            resetState={ isFiltersReset }
                            onChange={ () => setIsFiltersReset(false) }
                            ref={ formRef }
                        >
                            { /* ✅ max width so it doesn't grow forever */ }
                            <Box
                                sx={ {
                                    maxWidth: 1100,
                                    mx: "auto",
                                    overflow: "visible",
                                    width: "100%",

                                    "& .ui.dropdown .menu": {
                                        zIndex: 1200
                                    }
                                } }
                                className="multiple-filters"
                            >
                                { filterGroups.map((row:FilterGroup, index:number) => {
                                    const appScope:boolean = isAppScope(row.scope);
                                    const apps: string[] = getAppsForRow(row.scope);
                                    const attrs:FilterAttributeOption[] = getAttributesForRow(row);
                                    const isLoadingAttrs:boolean = !!loadingScope[row.scope];

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

                                                { /* ✅ Responsive layout:
                                                    - row 1: scope + (app) + attribute
                                                    - row 2: condition + value
                                                */ }
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
                                                            gap: 2,
                                                            flexWrap: "wrap"
                                                        } }
                                                    >
                                                        <Box sx={ { flex: "1 1 220px", minWidth: 220 } }>
                                                            <Field
                                                                name={ `scope-${index}` }
                                                                placeholder="Select scope"
                                                                required
                                                                type="dropdown"
                                                                children={ (scopes || []).map((s:string) => ({
                                                                    key: s,
                                                                    text: s,
                                                                    value: s
                                                                })) }
                                                                value={ row.scope }
                                                                listen={ (values: Map<string, FormValue>) => {
                                                                    const newScope =
                                                                        values.get(`scope-${index}`) as string;

                                                                    if (!newScope || newScope === row.scope) return;

                                                                    ensureScopeLoaded(newScope);

                                                                    setFilterGroups((prev:FilterGroup[]) => {
                                                                        const updated:FilterGroup[] = [ ...prev ];

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
                                                                    children={ apps.map((id:string) => ({
                                                                        key: id,
                                                                        text: id,
                                                                        value: id
                                                                    })) }
                                                                    value={ row.applicationId }
                                                                    listen={ (values: Map<string, FormValue>) => {
                                                                        const newAppId =
                                                                            values.get(`app-${index}`) as string;

                                                                        if (!newAppId || newAppId === row.applicationId)
                                                                            return;

                                                                        setFilterGroups((prev:FilterGroup[]) => {
                                                                            const updated:FilterGroup[] = [ ...prev ];

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
                                                                children={ attrs.map((a:FilterAttributeOption,
                                                                    idx: number) => ({
                                                                    key: a.key ?? a.value ?? idx,
                                                                    text: a.label,
                                                                    value: a.value
                                                                })) }
                                                                value={ row.attribute }
                                                                listen={ (values: Map<string, FormValue>) => {
                                                                    const newAttr =
                                                                        values.get(`attribute-${index}`) as string;

                                                                    if (!newAttr || newAttr === row.attribute) return;

                                                                    setFilterGroups((prev) => {
                                                                        const updated = [ ...prev ];

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
                                                            gap: 2,
                                                            flexWrap: "wrap"
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
                                                                    .map((o: any, idx) => ({
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

                                                                    setFilterGroups((prev:FilterGroup[]) => {
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
                                                                    const newValue : string=
                                                                        values.get(`value-${index}`) as string;

                                                                    if (newValue === row.value) return;

                                                                    setFilterGroups((prev:FilterGroup[]) => {
                                                                        const updated:FilterGroup[] = [ ...prev ];

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
                                                        color="error"
                                                        aria-label="remove"
                                                        size="small"
                                                        className="delete-button"
                                                        sx={ {
                                                            position: "absolute",
                                                            right: 14,
                                                            top: 14
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
    "data-testid": "advanced-search",
    disableSearchFilterDropdown: false,
    dropdownPosition: "bottom right",
    enableQuerySearch: commonConfig?.advancedSearchWithBasicFilters?.enableQuerySearch,
    showResetButton: false
};

export default AdvancedSearchWithMultipleFilters;
