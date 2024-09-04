/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { CheckIcon, MagnifyingGlassIcon } from "@oxygen-ui/react-icons";
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
import { Card, Input, InputProps, Label, Placeholder } from "semantic-ui-react";
import "./search-with-filter-labels.scss";

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
     * @param query - Search query.
     * @param selectedFilters - Set of selected filters.
     */
    onFilter?: (query: string, selectedFilters: string[]) => void;
    /**
     * Search query onchange callback.
     * @param query - Search query.
     * @param selectedFilters - Set of already selected filters.
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
 * @param props - Props injected to the component.
 *
 * @returns the search box with filter labels.
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
     * @param e - Change event.
     * @param value - Input value.
     */
    const handleQuerySearch = (e: ChangeEvent<HTMLInputElement>, { value }: { value: string }): void => {

        setSearchQuery(value);

        onSearch(value, selectedFilterLabels);
    };

    /**
     * Handles filters on click.
     *
     * @param newFilter - Newly selected label.
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

    const numberOfPlaceholderCards: number = 4;

    /**
     * Renders the loading state placeholder cards.
     *
     * @returns Loading Placeholder cards.
     */
    const getPlaceholderCards = (): ReactElement[] => {
        const placeholders: ReactElement[] = [];

        for (let i = 0; i < numberOfPlaceholderCards; i++) {
            placeholders.push(
                //TODO: Add placeholder style classes.
                <Card
                    style={ { borderRadius: "50px", boxShadow: "none",  width: "65px" } }>
                    <Placeholder
                        className="testPlaceholder"
                        style={ { borderRadius: "10px" } }>
                        <Placeholder.Image
                            style={ { borderRadius: "10px!important", height: "25px" } } />
                    </Placeholder>
                </Card>
            );
        }

        return placeholders;
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
                                icon={ icon ?? (
                                    <i aria-hidden="true" className="search-with-filter-label-icon icon">
                                        <MagnifyingGlassIcon />
                                    </i>
                                ) }
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
                isLoading
                    ? (
                        <Card.Group style={ { borderRadius: "50px" } }>
                            {
                                getPlaceholderCards()
                            }
                        </Card.Group>
                    )
                    : (
                        filterLabels && Array.isArray(filterLabels) && filterLabels.length > 0) && (
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
                                            { isSelected && <CheckIcon className="filter-label-check-icon" /> }
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
