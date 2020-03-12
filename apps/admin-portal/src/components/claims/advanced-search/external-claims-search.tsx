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

import { SearchUtils } from "@wso2is/core/utils";
import { Field, Forms } from "@wso2is/forms";
import { AdvancedSearch } from "@wso2is/react-components";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Grid } from "semantic-ui-react";

/**
 * Filter attribute field identifier.
 * @type {string}
 */
const FILTER_ATTRIBUTE_FIELD_IDENTIFIER = "filerAttribute";

/**
 * Filter condition field identifier.
 * @type {string}
 */
const FILTER_CONDITION_FIELD_IDENTIFIER = "filerCondition";

/**
 * Filter value field identifier.
 * @type {string}
 */
const FILTER_VALUES_FIELD_IDENTIFIER = "filerValues";

/**
 * The default search strategy. Search input will append the text
 * field value to this.
 * @type {string}
 */
const DEFAULT_SEARCH_STRATEGY = "name co";

/**
 * Prop types for the application search component.
 */
interface ExternalClaimsSearchPropsInterface {
    onFilter: (query: string) => void;
}

/**
 * Application search component.
 *
 * @return {JSX.Element}
 */
export const ExternalClaimsSearch: FunctionComponent<ExternalClaimsSearchPropsInterface> = (
    props: ExternalClaimsSearchPropsInterface
): JSX.Element => {

    const { onFilter } = props;

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [externalSearchQuery, setExternalSearchQuery] = useState("");

    const { t } = useTranslation();

    /**
     * Filter attribute options.
     *
     * @remarks
     * Only filter by `name` is supported in the current API implementation.
     *
     * @type {({text: string; value: string})[]}
     */
    const filterAttributeOptions = [
        { value: "claimURI", text: "Claim URI" },
        { value:"mappedLocalClaimURI", text:"Mapped Local Claim URI"}
    ];

    /**
     * Filter condition options.
     *
     * @type {({text: string; value: string})[]}
     */
    const filterConditionOptions = [
        { value: "sw", text: t("common:startsWith") },
        { value: "ew", text: t("common:endsWith") },
        { value: "co", text: t("common:contains") },
        { value: "eq", text: t("common:equals") },
    ];

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

    return (
        <AdvancedSearch
            aligned="left"
            clearButtonPopupLabel={ t("views:components.applications.search.popups.clear") }
            defaultSearchStrategy={ DEFAULT_SEARCH_STRATEGY }
            dropdownTriggerPopupLabel={ t("views:components.applications.search.popups.dropdown") }
            hintActionKeys={ t("views:components.applications.search.hints.querySearch.actionKeys") }
            hintLabel={ t("views:components.applications.search.hints.querySearch.label") }
            onExternalSearchQueryClear={ handleExternalSearchQueryClear }
            onSearchQuerySubmit={ handleSearchQuerySubmit }
            placeholder={ t("views:components.applications.search.placeholder") }
            resetSubmittedState={ handleResetSubmittedState }
            searchOptionsHeader={ t("views:components.applications.search.options.header") }
            externalSearchQuery={ externalSearchQuery }
            submitted={ isFormSubmitted }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Forms onSubmit={ (values) => handleFormSubmit(values) }>
                            <Field
                                children={ filterAttributeOptions.map((attribute, index) => {
                                    return {
                                        key: index,
                                        text: attribute.text,
                                        value: attribute.value
                                    };
                                }) }
                                label={ t("views:components.applications.search.forms.searchForm.inputs" +
                                    ".filerAttribute.label") }
                                name={ FILTER_ATTRIBUTE_FIELD_IDENTIFIER }
                                placeholder={ t("views:components.applications.search.forms.searchForm.inputs" +
                                    ".filerAttribute.placeholder") }
                                required={ true }
                                requiredErrorMessage={ t("views:components.applications.search.forms.searchForm" +
                                    ".inputs.filerAttribute.validations.empty") }
                                type="dropdown"
                                width={ 16 }
                            />
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 8 }>
                                        <Field
                                            children={ filterConditionOptions.map((condition, index) => {
                                                return {
                                                    key: index,
                                                    text: condition.text,
                                                    value: condition.value
                                                };
                                            }) }
                                            label={ t("views:components.applications.search.forms.searchForm.inputs" +
                                                ".filterCondition.label") }
                                            name={ FILTER_CONDITION_FIELD_IDENTIFIER }
                                            placeholder={ t("views:components.applications.search.forms." +
                                                "searchForm.inputs.filterCondition.placeholder") }
                                            required={ true }
                                            requiredErrorMessage={ t("views:components.applications.search.forms" +
                                                ".searchForm.inputs.filterCondition.validations.empty") }
                                            type="dropdown"
                                            width={ 16 }
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={ 8 }>
                                        <Field
                                            label={ t("views:components.applications.search.forms.searchForm.inputs" +
                                                ".filterValue.label") }
                                            name={ FILTER_VALUES_FIELD_IDENTIFIER }
                                            placeholder={ t("views:components.applications.search.forms." +
                                                "searchForm.inputs.filterValue.placeholder") }
                                            required={ true }
                                            requiredErrorMessage={ t("views:components.applications.search." +
                                                "forms.searchForm.inputs.filterValue.validations.empty") }
                                            type="text"
                                            width={ 16 }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Field
                                hidden={ true }
                                type="divider"
                            />
                            <Form.Group inline={ true }>
                                <Field
                                    size="small"
                                    type="submit"
                                    value={ t("common:search").toString() }
                                />
                                <Field
                                    className="link-button"
                                    size="small"
                                    type="reset"
                                    value={ t("common:resetFilters").toString() }
                                />
                            </Form.Group>
                        </Forms>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </AdvancedSearch>
    );
};
