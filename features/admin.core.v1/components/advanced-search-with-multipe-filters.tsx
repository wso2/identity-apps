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
import React, { CSSProperties, FunctionComponent, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Form, Grid, Icon, Button } from "semantic-ui-react";
import { getAdvancedSearchIcons } from "../configs/ui";
import { AdvanceSearchConstants } from "../constants/advance-search";

interface FilterGroup {
    scope: string;
    attribute: string;
    condition: string;
    value: string;
}

export interface FilterAttributeOption {
    scope: string;
    label: string; // display label
    value: string; // actual query param
    key?: string; // optional key for React rendering
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
    onFilterAttributeOptionsChange?: (values) => void;
    onSubmitError?: () => boolean;
    getQuery?: (values) => string;
    filterAttributeOptions: FilterAttributeOption[];
    filterAttributePlaceholder?: string;
    filterConditionOptions?: DropdownChild[];
    filterConditionsPlaceholder?: string;
    filterValuePlaceholder?: string;
    placeholder: string;
    predefinedDefaultSearchStrategy?: string;
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
        filterAttributeOptions,
        filterConditionOptions,
        filterConditionsPlaceholder,
        filterAttributePlaceholder,
        filterValuePlaceholder,
        onClose,
        onFilter,
        onFilterAttributeOptionsChange,
        onSubmitError,
        placeholder,
        predefinedDefaultSearchStrategy,
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
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [isFiltersReset, setIsFiltersReset] = useState<boolean>(false);
    const [externalSearchQuery, setExternalSearchQuery] = useState<string>("");
    const sessionTimedOut: boolean = React.useContext(SessionTimedOutContext);
    const formRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
        { scope: scopes?.[0] ?? "", attribute: defaultSearchAttribute, condition: defaultSearchOperator, value: "" }
    ]);

    const defaultFilterConditionOptions = [
        { text: t("common:startsWith"), value: "sw" },
        { text: t("common:endsWith"), value: "ew" },
        { text: t("common:contains"), value: "co" },
        { text: t("common:equals"), value: "eq" }
    ];

    const handleFormSubmit = (values: Map<string, FormValue>): void => {
        if (onSubmitError && onSubmitError()) return;

        const groups: string[] = [];

        for (let i = 0; i < filterGroups.length; i++) {
            const attribute = values.get(`attribute-${i}`) as string;
            const condition = values.get(`condition-${i}`) as string;
            const value = values.get(`value-${i}`) as string;

            if (attribute && condition && value) {
                groups.push(`${attribute}+${condition}+${value}`);
            }
        }

        const query = groups.join("+and+");

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
        setFilterGroups([{ scope: scopes?.[0] ?? "", attribute: defaultSearchAttribute, condition: defaultSearchOperator, value: "" }]);
    };

    return (
        <AdvancedSearch
            disableSearchAndFilterOptions={disableSearchAndFilterOptions}
            aligned="left"
            disableSearchFilterDropdown={disableSearchFilterDropdown}
            clearButtonPopupLabel={t("console:common.advancedSearch.popups.clear")}
            clearIcon={getAdvancedSearchIcons().clear}
            style={style}
            defaultSearchStrategy={`${defaultSearchAttribute} ${defaultSearchOperator} %search-value%`}
            dropdownTriggerPopupLabel={t("console:common.advancedSearch.popups.dropdown")}
            fill={fill}
            hintActionKeys={t("console:common.advancedSearch.hints.querySearch.actionKeys")}
            hintLabel={t("console:common.advancedSearch.hints.querySearch.label")}
            onExternalSearchQueryClear={() => setExternalSearchQuery("")}
            onSearchQuerySubmit={(p, q) => onFilter(p ? SearchUtils.buildSearchQuery(q) : q)}
            placeholder={placeholder}
            resetSubmittedState={() => setIsFormSubmitted(false)}
            searchOptionsHeader={t("console:common.advancedSearch.options.header")}
            sessionTimedOut={sessionTimedOut}
            enableQuerySearch={enableQuerySearch}
            externalSearchQuery={externalSearchQuery}
            submitted={isFormSubmitted}
            dropdownPosition={dropdownPosition}
            triggerClearQuery={triggerClearQuery}
            filterConditionOptions={filterConditionOptions || defaultFilterConditionOptions}
            filterAttributeOptions={filterAttributeOptions}
            data-testid={testId}
            data-componentid={testId}
        >
            <Grid>
                <Grid.Row columns={1}>
                    <Grid.Column width={16}>
                        <Forms
                            onSubmit={handleFormSubmit}
                            resetState={isFiltersReset}
                            onChange={() => setIsFiltersReset(false)}
                            ref={formRef}
                        >
                            {filterGroups.map((filter, index) => (
                                <Form.Group widths="equal" key={index}>
                                    <Field
                                        name={`scope-${index}`}
                                        label="Scope"
                                        placeholder="Select Scope"
                                        required
                                        type="dropdown"
                                        children={(scopes || []).map((scope, idx) => ({
                                            key: scope,
                                            text: scope,
                                            value: scope
                                        }))}
                                        value={filter.scope}
                                        onChange={(_, { value }) => {
                                            const updated = [...filterGroups];
                                            updated[index].scope = value;
                                            updated[index].attribute = "";
                                            setFilterGroups(updated);
                                        }}
                                    />
                                    <Field
                                        name={`attribute-${index}`}
                                        label={t("console:common.advancedSearch.form.inputs.filterAttribute.label")}
                                        placeholder={filterAttributePlaceholder || t("console:common.advancedSearch.form.inputs.filterAttribute.placeholder")}
                                        required
                                        type="dropdown"
                                        children={filterAttributeOptions
                                            .filter(opt => opt.scope === filter.scope)
                                            .map((attr, idx) => ({
                                                key: attr.key ?? attr.value ?? idx,
                                                text: attr.label,
                                                value: attr.value
                                            }))
                                        }
                                        value={filter.attribute}
                                        onChange={(_, { value }) => {
                                            const updated = [...filterGroups];
                                            updated[index].attribute = value;
                                            setFilterGroups(updated);
                                        }}
                                    />
                                    <Field
                                        name={`condition-${index}`}
                                        label={t("console:common.advancedSearch.form.inputs.filterCondition.label")}
                                        placeholder={filterConditionsPlaceholder || t("console:common.advancedSearch.form.inputs.filterCondition.placeholder")}
                                        required
                                        type="dropdown"
                                        children={(filterConditionOptions || defaultFilterConditionOptions).map((attr, idx) => ({
                                            key: attr.key ?? idx,
                                            text: attr.text,
                                            value: attr.value
                                        }))}
                                        value={filter.condition}
                                        onChange={(_, { value }) => {
                                            const updated = [...filterGroups];
                                            updated[index].condition = value;
                                            setFilterGroups(updated);
                                        }}
                                    />
                                    <Field
                                        name={`value-${index}`}
                                        label={t("console:common.advancedSearch.form.inputs.filterValue.label")}
                                        placeholder={filterValuePlaceholder || t("console:common.advancedSearch.form.inputs.filterValue.placeholder")}
                                        required
                                        type="text"
                                        value={filter.value}
                                        onChange={(_, { value }) => {
                                            const updated = [...filterGroups];
                                            updated[index].value = value;
                                            setFilterGroups(updated);
                                        }}
                                    />
                                    {index > 0 && (
                                        <Button icon type="button" onClick={() => {
                                            const updated = filterGroups.filter((_, i) => i !== index);
                                            setFilterGroups(updated);
                                        }}>
                                            <Icon name="trash"/>
                                        </Button>
                                    )}
                                </Form.Group>
                            ))}
                            <Button icon labelPosition="left" type="button" onClick={() => setFilterGroups([...filterGroups, { scope: scopes?.[0] ?? "", attribute: defaultSearchAttribute, condition: defaultSearchOperator, value: "" }])}>
                                <Icon name="plus"/> Add Filter
                            </Button>
                            <Divider hidden/>
                            <Form.Group inline>
                                <PrimaryButton
                                    size="small"
                                    type="submit"
                                    data-testid={`${testId}-search-button`}
                                    data-componentid={`${testId}-search-button`}
                                >
                                    {submitButtonLabel || t("common:search")}
                                </PrimaryButton>
                                {showResetButton && (
                                    <LinkButton
                                        size="small"
                                        type="reset"
                                        data-testid={`${testId}-reset-button`}
                                        data-componentid={`${testId}-reset-button`}
                                        onClick={handleResetFilter}
                                    >
                                        {resetButtonLabel || t("common:resetFilters")}
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
