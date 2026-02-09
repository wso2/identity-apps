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
import { Divider, Form, Grid, Icon, Button } from "semantic-ui-react";
import { getAdvancedSearchIcons } from "../configs/ui";

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
            scope: scopes?.[0] ?? "",
            applicationId: "",
            attribute: "",
            condition: defaultSearchOperator,
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
            const opts = await onFetchAttributesByScope(scope);
            setOptionsByScope((p) => ({ ...p, [scope]: opts ?? [] }));
        } catch (error) {
            console.error('Failed to load scope:', scope, error);
        } finally {
            setLoadingScope((p) => ({ ...p, [scope]: false }));
        }
    };

    useEffect(() => {
        const firstScope = scopes?.[0] ?? "";
        if (firstScope) {
            ensureScopeLoaded(firstScope);
        }
    }, []);

    const handleFormSubmit = (values: Map<string, FormValue>): void => {
        if (onSubmitError && onSubmitError()) return;
    
        const groups: string[] = [];
    
        for (let i = 0; i < filterGroups.length; i++) {
            const scope = values.get(`scope-${i}`) as string;
            const appId = values.get(`app-${i}`) as string;
            const attribute = values.get(`attribute-${i}`) as string;
            const condition = values.get(`condition-${i}`) as string;
            const value = values.get(`value-${i}`) as string;
    
            if (!scope || !attribute || !condition || !value) continue;
    
            if (isAppScope(scope) && !appId) continue;
    
            const field = isAppScope(scope)
                ? `application_data.${appId}.${attribute}`
                : attribute;
    
            // ✅ Use spaces instead of + signs
            groups.push(`${field} ${condition} ${value}`);
        }
    
        // ✅ Join with " and " instead of "+and+"
        const query = groups.join(" and ");
    
        setExternalSearchQuery(query);
        onFilter(query);
        setIsFormSubmitted(true);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            onClose?.();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleResetFilter = (): void => {
        setIsFiltersReset(true);
        const firstScope = scopes?.[0] ?? "";
        setFilterGroups([
            {
                scope: firstScope,
                applicationId: "",
                attribute: "",
                condition: defaultSearchOperator,
                value: ""
            }
        ]);

        if (firstScope) {
            ensureScopeLoaded(firstScope);
        }
    };

    const getAppsForRow = (rowScope: string): string[] => {
        if (!isAppScope(rowScope)) return [];

        const opts = optionsByScope[rowScope] ?? [];
        const ids = opts
            .filter((o) => o.applicationId)
            .map((o) => o.applicationId as string);

        return Array.from(new Set(ids)).sort();
    };

    const getAttributesForRow = (row: FilterGroup): FilterAttributeOption[] => {
        const opts = optionsByScope[row.scope] ?? [];

        if (!isAppScope(row.scope)) {
            return opts;
        }

        return row.applicationId
            ? opts.filter((o) => o.applicationId === row.applicationId)
            : [];
    };

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
                            {filterGroups.map((row, index) => {
                                const appScope = isAppScope(row.scope);
                                const apps = getAppsForRow(row.scope);
                                const attrs = getAttributesForRow(row);
                                const isLoadingAttrs = !!loadingScope[row.scope];

                                return (
                                    <Form.Group widths="equal" key={ index }>
                                        {/* Scope */}
                                        <Field
                                            name={ `scope-${index}` }
                                            label="Scope"
                                            placeholder="Select Scope"
                                            required
                                            type="dropdown"
                                            children={ (scopes || []).map((s) => ({
                                                key: s,
                                                text: s,
                                                value: s
                                            })) }
                                            value={ row.scope }
                                            listen={ (values: Map<string, FormValue>) => {
                                                const newScope = values.get(`scope-${index}`) as string;
                                                
                                                if (!newScope || newScope === row.scope) {
                                                    return;
                                                }

                                                ensureScopeLoaded(newScope);

                                                setFilterGroups((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        scope: newScope,
                                                        applicationId: "",
                                                        attribute: ""
                                                    };
                                                    return updated;
                                                });
                                            } }
                                        />

                                        {/* Application (only for application_data) */}
                                        {appScope && (
                                            <Field
                                                name={ `app-${index}` }
                                                label="Application"
                                                placeholder="Select Application"
                                                required
                                                type="dropdown"
                                                children={ apps.map((id) => ({
                                                    key: id,
                                                    text: id,
                                                    value: id
                                                })) }
                                                value={ row.applicationId }
                                                listen={ (values: Map<string, FormValue>) => {
                                                    const newAppId = values.get(`app-${index}`) as string;
                                                    
                                                    if (!newAppId || newAppId === row.applicationId) {
                                                        return;
                                                    }

                                                    setFilterGroups((prev) => {
                                                        const updated = [...prev];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            applicationId: newAppId,
                                                            attribute: ""
                                                        };
                                                        return updated;
                                                    });
                                                } }
                                            />
                                        )}

                                        {/* Attribute */}
                                        <Field
                                            name={ `attribute-${index}` }
                                            label={ t("console:common.advancedSearch.form.inputs.filterAttribute.label") }
                                            placeholder={
                                                isLoadingAttrs
                                                    ? "Loading attributes..."
                                                    : (filterAttributePlaceholder
                                                        || t("console:common.advancedSearch.form.inputs.filterAttribute.placeholder"))
                                            }
                                            required
                                            type="dropdown"
                                            disabled={ isLoadingAttrs || (appScope && !row.applicationId) }
                                            children={ attrs.map((a, idx) => ({
                                                key: a.key ?? a.value ?? idx,
                                                text: a.label,
                                                value: a.value
                                            })) }
                                            value={ row.attribute }
                                            listen={ (values: Map<string, FormValue>) => {
                                                const newAttr = values.get(`attribute-${index}`) as string;
                                                
                                                if (!newAttr || newAttr === row.attribute) {
                                                    return;
                                                }

                                                setFilterGroups((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        attribute: newAttr
                                                    };
                                                    return updated;
                                                });
                                            } }
                                        />

                                        {/* Condition */}
                                        <Field
                                            name={ `condition-${index}` }
                                            label={ t("console:common.advancedSearch.form.inputs.filterCondition.label") }
                                            placeholder={ filterConditionsPlaceholder
                                                || t("console:common.advancedSearch.form.inputs.filterCondition.placeholder") }
                                            required
                                            type="dropdown"
                                            children={ (filterConditionOptions || defaultFilterConditionOptions).map((o: any, idx) => ({
                                                key: o.key ?? idx,
                                                text: o.text,
                                                value: o.value
                                            })) }
                                            value={ row.condition }
                                            listen={ (values: Map<string, FormValue>) => {
                                                const newCondition = values.get(`condition-${index}`) as string;
                                                
                                                if (!newCondition || newCondition === row.condition) {
                                                    return;
                                                }

                                                setFilterGroups((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        condition: newCondition
                                                    };
                                                    return updated;
                                                });
                                            } }
                                        />

                                        {/* Value */}
                                        <Field
                                            name={ `value-${index}` }
                                            label={ t("console:common.advancedSearch.form.inputs.filterValue.label") }
                                            placeholder={ filterValuePlaceholder
                                                || t("console:common.advancedSearch.form.inputs.filterValue.placeholder") }
                                            required
                                            type="text"
                                            value={ row.value }
                                            listen={ (values: Map<string, FormValue>) => {
                                                const newValue = values.get(`value-${index}`) as string;
                                                
                                                if (newValue === row.value) {
                                                    return;
                                                }

                                                setFilterGroups((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        value: newValue ?? ""
                                                    };
                                                    return updated;
                                                });
                                            } }
                                        />

                                        {index > 0 && (
                                            <Button
                                                icon
                                                type="button"
                                                onClick={ () => setFilterGroups(filterGroups.filter((_, i) => i !== index)) }
                                            >
                                                <Icon name="trash" />
                                            </Button>
                                        )}
                                    </Form.Group>
                                );
                            })}

                            <Button
                                icon
                                labelPosition="left"
                                type="button"
                                onClick={ () => setFilterGroups([
                                    ...filterGroups,
                                    {
                                        scope: scopes?.[0] ?? "",
                                        applicationId: "",
                                        attribute: "",
                                        condition: defaultSearchOperator,
                                        value: ""
                                    }
                                ]) }
                            >
                                <Icon name="plus" /> Add Filter
                            </Button>

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

                                {showResetButton && (
                                    <LinkButton
                                        size="small"
                                        type="reset"
                                        data-testid={ `${testId}-reset-button` }
                                        data-componentid={ `${testId}-reset-button` }
                                        onClick={ handleResetFilter }
                                    >
                                        { resetButtonLabel || t("common:resetFilters") }
                                    </LinkButton>
                                )}
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