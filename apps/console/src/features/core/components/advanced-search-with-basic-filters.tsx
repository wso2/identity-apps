/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { SearchUtils } from "@wso2is/core/utils";
import { DropdownChild, Field, Forms } from "@wso2is/forms";
import { AdvancedSearch, AdvancedSearchPropsInterface, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Form, Grid } from "semantic-ui-react";
import { commonConfig } from "../../../extensions";
import { getAdvancedSearchIcons } from "../configs";

/**
 * Filter attribute field identifier.
 * @type {string}
 */
const FILTER_ATTRIBUTE_FIELD_IDENTIFIER = "filterAttribute";

/**
 * Filter condition field identifier.
 * @type {string}
 */
const FILTER_CONDITION_FIELD_IDENTIFIER = "filterCondition";

/**
 * Filter value field identifier.
 * @type {string}
 */
const FILTER_VALUES_FIELD_IDENTIFIER = "filterValues";

/**
 * Prop types for the application search component.
 */
export interface AdvancedSearchWithBasicFiltersPropsInterface extends TestableComponentInterface {
    /**
     * Default Search attribute. ex: "name"
     */
    defaultSearchAttribute: string;
    /**
     * Default Search operator. ex: "co"
     */
    defaultSearchOperator: string;
    /**
     * Position of the search dropdown.
     */
    dropdownPosition?: AdvancedSearchPropsInterface["dropdownPosition"];
    /**
     * Fill color.
     */
    fill?: AdvancedSearchPropsInterface[ "fill" ];
    /**
     * Callback to be triggered on filter query change.
     */
    onFilter: (query: string) => void;
    /**
     * Filter attributes options.
     */
    filterAttributeOptions: DropdownChild[];
    /**
     * Filter attribute placeholder.
     */
    filterAttributePlaceholder?: string;
    /**
     * Filter condition options.
     */
    filterConditionOptions?: DropdownChild[];
    /**
     * Filter conditions placeholder.
     */
    filterConditionsPlaceholder?: string;
    /**
     * Filter value placeholder.
     */
    filterValuePlaceholder?: string;
    /**
     * Search input placeholder.
     */
    placeholder: string;
    /**
     * Submit button text.
     */
    submitButtonLabel?: string;
    /**
     * Reset button text.
     */
    resetButtonLabel?: string;
    /**
     * Show reset button flag.
     */
    showResetButton?: boolean;
    /**
     * Manually trigger query clear action from outside.
     */
    triggerClearQuery?: boolean;
    /**
     * Enable query search with shift and enter.
     */
    enableQuerySearch?: boolean;
}

/**
 * Advanced search component with SCIM like basic filters form.
 *
 * @param {AdvancedSearchWithBasicFiltersPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const AdvancedSearchWithBasicFilters: FunctionComponent<AdvancedSearchWithBasicFiltersPropsInterface> = (
    props: AdvancedSearchWithBasicFiltersPropsInterface
): ReactElement => {

    const {
        defaultSearchAttribute,
        defaultSearchOperator,
        dropdownPosition,
        enableQuerySearch,
        fill,
        filterAttributeOptions,
        filterConditionOptions,
        filterConditionsPlaceholder,
        filterAttributePlaceholder,
        filterValuePlaceholder,
        onFilter,
        placeholder,
        resetButtonLabel,
        showResetButton,
        submitButtonLabel,
        triggerClearQuery,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isFormSubmitted, setIsFormSubmitted ] = useState<boolean>(false);
    const [ isFiltersReset, setIsFiltersReset ] = useState<boolean>(false);
    const [ externalSearchQuery, setExternalSearchQuery ] = useState<string>("");

    /**
     * Handles the form submit.
     *
     * @param {Map<string, string | string[]>} values - Form values.
     */
    const handleFormSubmit = (values: Map<string, string | string[]>): void => {
        const query = values.get(FILTER_ATTRIBUTE_FIELD_IDENTIFIER)
            + " "
            + values.get(FILTER_CONDITION_FIELD_IDENTIFIER)
            + " "
            + values.get(FILTER_VALUES_FIELD_IDENTIFIER);

        setExternalSearchQuery(query);
        onFilter(query);
        setIsFormSubmitted(true);
    };

    /**
     * Handles the search query submit.
     *
     * @param {boolean} processQuery - Flag to enable query processing.
     * @param {string} query - Search query.
     */
    const handleSearchQuerySubmit = (processQuery: boolean, query: string): void => {
        if (!processQuery) {
            onFilter(query);

            return;
        }

        onFilter(SearchUtils.buildSearchQuery(query));
    };

    /**
     * Handles the submitted state reset action.
     */
    const handleResetSubmittedState = (): void => {
        setIsFormSubmitted(false);
    };

    /**
     * Handles the external search query clear action.
     */
    const handleExternalSearchQueryClear = (): void => {
        setExternalSearchQuery("");
    };

    /**
     * Handles resetting the filters.
     */
    const handleResetFilter = (): void => {
        setIsFiltersReset(true);
    };

    /**
     * Default filter condition options.
     *
     * @type {({text: string; value: string})[]}
     */
    const defaultFilterConditionOptions = [
        {
            text: t("common:startsWith"),
            value: "sw"
        },
        {
            text: t("common:endsWith"),
            value: "ew"
        },
        {
            text: t("common:contains"),
            value: "co"
        },
        {
            text: t("common:equals"),
            value: "eq"
        }
    ];

    return (
        <AdvancedSearch
            aligned="left"
            clearButtonPopupLabel={ t("console:common.advancedSearch.popups.clear") }
            clearIcon={ getAdvancedSearchIcons().clear }
            defaultSearchStrategy={ defaultSearchAttribute + " " + defaultSearchOperator }
            dropdownTriggerPopupLabel={ t("console:common.advancedSearch.popups.dropdown") }
            fill={ fill }
            hintActionKeys={ t("console:common.advancedSearch.hints.querySearch.actionKeys") }
            hintLabel={ t("console:common.advancedSearch.hints.querySearch.label") }
            onExternalSearchQueryClear={ handleExternalSearchQueryClear }
            onSearchQuerySubmit={ handleSearchQuerySubmit }
            placeholder={ placeholder }
            resetSubmittedState={ handleResetSubmittedState }
            searchOptionsHeader={ t("console:common.advancedSearch.options.header") }
            enableQuerySearch={ enableQuerySearch }
            externalSearchQuery={ externalSearchQuery }
            submitted={ isFormSubmitted }
            dropdownPosition={ dropdownPosition }
            triggerClearQuery={ triggerClearQuery }
            filterConditionOptions={ filterConditionOptions || defaultFilterConditionOptions }
            filterAttributeOptions={ filterAttributeOptions }
            data-testid={ testId }
            data-componentid={ testId }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Forms
                            onSubmit={ (values) => handleFormSubmit(values) }
                            resetState={ isFiltersReset }
                            onChange={ () => setIsFiltersReset(false) }
                        >
                            <Field
                                children={
                                    filterAttributeOptions.map((attribute, index) => {
                                        return {
                                            key: index,
                                            text: attribute.text,
                                            value: attribute.value
                                        };
                                    })
                                }
                                // TODO: Enable this once default value is working properly for the dropdowns.
                                // readOnly={ filterAttributeOptions.length === 1 }
                                label={ t("console:common.advancedSearch.form.inputs.filterAttribute.label") }
                                name={ FILTER_ATTRIBUTE_FIELD_IDENTIFIER }
                                placeholder={
                                    filterAttributePlaceholder
                                        ? filterAttributePlaceholder
                                        : t("console:common.advancedSearch.form.inputs.filterAttribute" +
                                        ".placeholder")
                                }
                                required={ true }
                                requiredErrorMessage={
                                    t("console:common.advancedSearch.form.inputs.filterAttribute" +
                                        ".validations.empty")
                                }
                                type="dropdown"
                                value={ defaultSearchAttribute }
                                data-testid={ `${ testId }-filter-attribute-dropdown` }
                                data-componentid={ `${ testId }-filter-attribute-dropdown` }
                            />
                            <Form.Group widths="equal">
                                <Field
                                    children={
                                        filterConditionOptions
                                            ? filterConditionOptions.map((attribute, index) => {
                                                return {
                                                    key: index,
                                                    text: attribute.text,
                                                    value: attribute.value
                                                };
                                            })
                                            : defaultFilterConditionOptions.map((attribute, index) => {
                                                return {
                                                    key: index,
                                                    text: attribute.text,
                                                    value: attribute.value
                                                };
                                            })
                                    }
                                    label={
                                        t("console:common.advancedSearch.form.inputs.filterCondition.label")
                                    }
                                    name={ FILTER_CONDITION_FIELD_IDENTIFIER }
                                    placeholder={
                                        filterConditionsPlaceholder
                                            ? filterConditionsPlaceholder
                                            : t("console:common.advancedSearch.form.inputs.filterCondition" +
                                            ".placeholder")
                                    }
                                    required={ true }
                                    requiredErrorMessage={ t("console:common.advancedSearch.form.inputs" +
                                        ".filterCondition.validations.empty") }
                                    type="dropdown"
                                    value={ defaultSearchOperator }
                                    data-testid={ `${ testId }-filter-condition-dropdown` }
                                />
                                <Field
                                    label={ t("console:common.advancedSearch.form.inputs.filterValue.label") }
                                    name={ FILTER_VALUES_FIELD_IDENTIFIER }
                                    placeholder={
                                        filterValuePlaceholder
                                            ? filterValuePlaceholder
                                            : t("console:common.advancedSearch.form.inputs.filterValue" +
                                            ".placeholder")
                                    }
                                    required={ true }
                                    requiredErrorMessage={ t("console:common.advancedSearch.form.inputs" +
                                        ".filterValue.validations.empty") }
                                    type="text"
                                    data-testid={ `${ testId }-filter-value-input` }
                                    data-componentid={ `${ testId }-filter-value-input` }
                                />
                            </Form.Group>
                            <Divider hidden/>
                            <Form.Group inline>
                                <PrimaryButton
                                    size="small"
                                    type="submit"
                                    data-testid={ `${ testId }-search-button` }
                                    data-componentid={ `${ testId }-search-button` }
                                >
                                    { submitButtonLabel ? submitButtonLabel : t("common:search") }
                                </PrimaryButton>
                                {
                                    showResetButton && (
                                        <LinkButton
                                            size="small"
                                            type="reset"
                                            data-testid={ `${ testId }-reset-button` }
                                            data-componentid={ `${ testId }-reset-button` }
                                            onClick={ () => handleResetFilter() }
                                        >
                                            { resetButtonLabel ? resetButtonLabel : t("common:resetFilters") }
                                        </LinkButton>
                                    )
                                }
                            </Form.Group>
                        </Forms>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AdvancedSearch>
    );
};

/**
 * Default props for the component.
 */
AdvancedSearchWithBasicFilters.defaultProps = {
    "data-testid": "advanced-search",
    dropdownPosition: "bottom left",
    enableQuerySearch: commonConfig.advancedSearchWithBasicFilters.enableQuerySearch,
    showResetButton: false
};
