/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import {
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    ChangeEvent,
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    useState
} from "react";
import { Icon, Input, InputProps, Label } from "semantic-ui-react";

/**
 *
 * Proptypes for the advanced search component.
 */
export interface SearchWithFilterLabelsPropsInterface extends InputProps,
    IdentifiableComponentInterface,
    TestableComponentInterface,
    LoadableComponentInterface {

    /**
     * Set of filter labels.
     */
    filterLabels: string[];
    /**
     * Filter labels' on click callback.
     * @param {string} query - Search query.
     * @param {string[]} selectedFilters - Set of selected filters.
     */
    onFilter?: (query: string, selectedFilters: string[]) => void;
    /**
     * Search query onchange callback.
     * @param {string} query - Search query.
     * @param {string[]} selectedFilters - Set of already selected filters.
     */
    onSearch?: (query: string, selectedFilters: string[]) => void;
    /**
     * Externally provided search input.
     */
    searchInput?: ReactElement;
}

/**
 * Search box with filter labels.
 *
 * @param {React.PropsWithChildren<SearchWithFilterLabelsPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SearchWithFilterLabels: FunctionComponent<PropsWithChildren<SearchWithFilterLabelsPropsInterface>> = (
    props: PropsWithChildren<SearchWithFilterLabelsPropsInterface>
): ReactElement => {

    const {
        className,
        filterLabels,
        onFilter,
        onSearch,
        isLoading,
        icon,
        placeholder,
        searchInput,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ selectedFilterLabels, setSelectedFilterLabels ] = useState<string[]>([]);

    const classes = classNames("search-with-filter-labels", className);

    /**
     * Handles the Search input onchange.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - Change event.
     * @param {string} value - Input value.
     */
    const handleQuerySearch = (e: ChangeEvent<HTMLInputElement>, { value }: { value: string }): void => {

        setSearchQuery(value);
        
        onSearch(value, selectedFilterLabels);
    };

    /**
     * Handles filters on click.
     *
     * @param {string} newFilter - Newly selected label.
     */
    const handleFilter = (newFilter: string): void => {

        let selectedFilters: string[] = [];

        if (selectedFilterLabels.includes(newFilter)) {
            selectedFilters = selectedFilterLabels.filter((selectedLabel: string) => selectedLabel !== newFilter);
        } else {
            selectedFilters = [ ...selectedFilterLabels, newFilter ];
        }

        setSelectedFilterLabels(selectedFilters);

        onFilter(searchQuery, selectedFilters);
    };

    return (
        <div
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            {
                searchInput
                    ? (
                        <div className="search-input-wrapper">
                            { searchInput }
                        </div>
                    )
                    : (
                        <div className="search-input-wrapper">
                            <Input
                                fluid
                                loading={ isLoading }
                                icon={ icon ?? <Icon name="search"/> }
                                value={ searchQuery }
                                iconPosition="left"
                                onChange={ handleQuerySearch }
                                placeholder={ placeholder }
                                { ...rest }
                            />
                        </div>
                    )
            }
            {
                (filterLabels && Array.isArray(filterLabels) && filterLabels.length > 0) && (
                    <Label.Group>
                        {
                            filterLabels.map((label, index: number) => {
                                const isSelected: boolean = selectedFilterLabels.includes(label);

                                return (
                                    <Label
                                        basic
                                        key={ index }
                                        as="a"
                                        className={ `filter-label ${ isSelected ? "active" : "" }` }
                                        onClick={ () => handleFilter(label) }
                                    >
                                        { label }
                                        { isSelected && <Icon name="check"/> }
                                    </Label>
                                );
                            })
                        }
                    </Label.Group>
                )
            }
        </div>
    );
};

/**
 * Default proptypes for the component.
 */
SearchWithFilterLabels.defaultProps = {
    "data-componentid": "search-with-filters",
    "data-testid": "search-with-filters",
    placeholder: "Search"
};
