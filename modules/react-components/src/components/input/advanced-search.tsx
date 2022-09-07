/*
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    ChangeEvent,
    FunctionComponent,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { Button, Divider, Icon, Input, InputProps, Popup, PopupProps } from "semantic-ui-react";
import { ReactComponent as CrossIcon } from "../../assets/images/cross-icon.svg";
import { GenericIcon } from "../icon";
import { Heading } from "../typography";

/**
 *
 * Proptypes for the advanced search component.
 */
export interface AdvancedSearchPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Text alignment.
     */
    aligned?: "left" | "right" | "center";
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Clear button tooltip label.
     */
    clearButtonPopupLabel?: string;
    /**
     * Clear icon override.
     */
    clearIcon?: any;
    /**
     * Custom CSS styles for text input box.
     */
    customStyle?: any;
    /**
     * Search strategy ex: name co %search-value%.
     */
    defaultSearchStrategy: string;
    /**
     * Dropdown appearing position.
     */
    dropdownPosition?: PopupProps["position"];
    /**
     * Dropdown trigger icon label.
     */
    dropdownTriggerPopupLabel?: string;
    /**
     * Search query from outside.
     */
    externalSearchQuery?: string;
    /**
     * Fill color.
     */
    fill?: "white" | "default";
    /**
     * Hint action keyboard keys.
     */
    hintActionKeys?: string;
    /**
     * Hint label.
     */
    hintLabel?: string;
    /**
     * Search input size.
     */
    inputSize?: InputProps["size"];
    /**
     * Callback for external search query clear.
     */
    onExternalSearchQueryClear?: () => void;
    /**
     * Callback for search query submit.
     * @param processQuery - process flag.
     * @param query - Search query.
     */
    onSearchQuerySubmit: (processQuery: boolean, query: string) => void;
    /**
     * input placeholder.
     */
    placeholder?: string;
    /**
     * Reset trigger.
     */
    resetSubmittedState?: () => void;
    /**
     * Dropdown heading.
     */
    searchOptionsHeader?: string;
    /**
     * Session Timed Out status.
     */
    sessionTimedOut?: boolean;
    /**
     * Is form submitted.
     */
    submitted?: boolean;
    /**
     * Manually trigger query clear action from outside.
     */
    triggerClearQuery?: boolean;
    /**
     * Enable query search with shift and enter.
     */
    enableQuerySearch?: boolean;
    /**
     * Default filter conditions.
     */
    filterConditionOptions?: any;
    /**
     * Default filter attributes.
     */
    filterAttributeOptions?: any;
}

/**
 * Advanced search component.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
export const AdvancedSearch: FunctionComponent<PropsWithChildren<AdvancedSearchPropsInterface>> = (
    props: PropsWithChildren<AdvancedSearchPropsInterface>
): ReactElement => {

    const {
        aligned,
        className,
        children,
        clearButtonPopupLabel,
        customStyle,
        defaultSearchStrategy,
        dropdownPosition,
        dropdownTriggerPopupLabel,
        enableQuerySearch,
        externalSearchQuery,
        fill,
        clearIcon,
        inputSize,
        onExternalSearchQueryClear,
        onSearchQuerySubmit,
        placeholder,
        resetSubmittedState,
        searchOptionsHeader,
        sessionTimedOut,
        submitted,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        triggerClearQuery,
        filterConditionOptions,
        filterAttributeOptions
    } = props;

    const searchInputRef: MutableRefObject<HTMLDivElement> = useRef();

    const [ internalSearchQuery, setInternalSearchQuery ] = useState<string>("");
    const [ showSearchFieldHint, setShowSearchFieldHint ] = useState<boolean>(false);
    const [ isDropdownVisible, setIsDropdownVisible ] = useState<boolean>(false);
    const [ internalQueryClearTriggerState, setInternalQueryClearTriggerState ] = useState<boolean>(false);

    /**
     * useEffect hook to handle `sessionTimedOut` change.
     */
    useEffect(() => {
        if (sessionTimedOut) {
            setIsDropdownVisible(false);
        }
    }, [ sessionTimedOut ]);

    /**
     * useEffect hook to handle `internalSearchQuery` change.
     */
    useEffect(() => {
        if (!internalSearchQuery) {
            setShowSearchFieldHint(false);
        }
        if (internalSearchQuery && !isDropdownVisible && (externalSearchQuery !== internalSearchQuery)) {
            setShowSearchFieldHint(true);
        }
    }, [ internalSearchQuery ]);

    /**
     * useEffect hook to handle `externalSearchQuery` changes.
     */
    useEffect(() => {
        setInternalSearchQuery(externalSearchQuery);
    }, [ externalSearchQuery ]);

    /**
     * useEffect hook to handle `submitted` prop changes.
     */
    useEffect(() => {
        if (submitted) {
            setIsDropdownVisible(false);
            resetSubmittedState();
        }
    }, [ submitted ]);

    useEffect(() => {
        if (triggerClearQuery === undefined || (internalQueryClearTriggerState === triggerClearQuery)) {
            return;
        }

        clearSearchQuery();
        setInternalQueryClearTriggerState(triggerClearQuery);
    }, [ triggerClearQuery ]);

    /**
     * Wrapper `div` style classes.
     */
    const wrapperClasses = classNames({
        [ "search-hint-active" ]: enableQuerySearch && showSearchFieldHint,
        [ `aligned-${ aligned }` ]: aligned,
        [ `fill-${ fill }` ]: fill
    }, className);

    /**
     * Search field style classes.
     */
    const searchFieldClasses = classNames({
        active: internalSearchQuery
    }, className);

    /**
     * Handles the search input field `onChange` event.
     *
     * @param e - Input change event.
     */
    const handleSearchQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;

        setInternalSearchQuery(value);
    };

    /**
     * Handles the show options dropdown `onClick` event.
     */
    const handleShowOptionsClick = (): void => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    /**
     * Handles the clear query button `onClick` event.
     */
    const clearSearchQuery = (): void => {
        setInternalSearchQuery("");
        onSearchQuerySubmit(false, null);
        onExternalSearchQueryClear();
    };

    /**
     * Handles search query submit by keyboard events.
     *
     * @param e - Keyboard event.
     */
    const handleSearchQuerySubmit = (e: KeyboardEvent): void => {
        const { key, shiftKey } = e;
        let query = "";

        // If only enter key is pressed perform the default filter strategy.
        if (!shiftKey && key === "Enter") {
            if (internalSearchQuery === "") {
                query = null;
            } else {
                let advancedSearch: boolean = false;
                const terms: string[] = internalSearchQuery.split(" ");

                if (terms.length > 2) {
                    const attributes = filterAttributeOptions.filter((attribute) => {
                        return attribute.value === terms[0];
                    });

                    if (attributes.length > 0) {
                        const conditions = filterConditionOptions.filter((condition) => {
                            return condition.value === terms[1];
                        });

                        if (conditions.length > 0) {
                            advancedSearch = true;
                        }
                    }
                }
                if (advancedSearch) {
                    query = internalSearchQuery;
                } else {
                    query = defaultSearchStrategy.replace(/%search-value%/g, internalSearchQuery);
                }
            }
            onSearchQuerySubmit(false, query);
            setShowSearchFieldHint(false);
        }
        // If both `Enter` key and `Shift` key are pressed, treat the input
        // as a query and perform the search.
        if (shiftKey && key === "Enter" && enableQuerySearch) {
            query = internalSearchQuery;
            onSearchQuerySubmit(true, query);
            setShowSearchFieldHint(false);
        }
    };

    /**
     * Handles the search field blur.
     */
    const handleSearchFieldBlur = (): void => {
        setShowSearchFieldHint(false);
    };

    /**
     * Handles the dropdown close event.
     */
    const handleSearchDropdownClose = (): void => {
        setIsDropdownVisible(false);
    };

    return (
        <div
            className={ `advanced-search-wrapper ${ wrapperClasses }` }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            <div ref={ searchInputRef }>
                <Input
                    data-componentid={ `${ componentId }-input` }
                    data-testid={ `${ testId }-input` }
                    action={ (
                        <>
                            {
                                internalSearchQuery
                                    ? (
                                        <Popup
                                            disabled={ !clearButtonPopupLabel }
                                            trigger={
                                                (
                                                    <Button
                                                        data-componentid={ `${ componentId }-clear-button` }
                                                        data-testid={ `${ testId }-clear-button` }
                                                        basic
                                                        compact
                                                        className="input-add-on"
                                                        onClick={ clearSearchQuery }
                                                    >
                                                        <GenericIcon
                                                            size="nano"
                                                            defaultIcon
                                                            transparent
                                                            icon={ clearIcon ? clearIcon : CrossIcon }
                                                        />
                                                    </Button>
                                                )
                                            }
                                            position="top center"
                                            content={ clearButtonPopupLabel }
                                            inverted={ true }
                                        />
                                    )
                                    : null
                            }
                            <Popup
                                disabled={ !dropdownTriggerPopupLabel || isDropdownVisible }
                                trigger={
                                    (
                                        <Button
                                            data-componentid={ `${ componentId }-options-button` }
                                            data-testid={ `${ testId }-options-button` }
                                            basic
                                            compact
                                            className="input-add-on"
                                            onClick={ handleShowOptionsClick }
                                        >
                                            <Icon name="caret down"/>
                                        </Button>
                                    )
                                }
                                position="top center"
                                content={ dropdownTriggerPopupLabel }
                                inverted={ true }
                            />
                        </>
                    ) }
                    className={ `advanced-search with-add-on ${ searchFieldClasses }` }
                    size={ inputSize }
                    style={ customStyle }
                    icon="search"
                    iconPosition="left"
                    placeholder={ placeholder }
                    value={ internalSearchQuery }
                    onBlur={ handleSearchFieldBlur }
                    onChange={ handleSearchQueryChange }
                    onKeyDown={ handleSearchQuerySubmit }
                />
            </div>
            <Popup
                context={ searchInputRef }
                content={ (
                    <div className="search-filters-dropdown">
                        <Heading
                            as="h6"
                            bold="500"
                            compact
                            data-componentid={ `${ componentId }-header` }
                            data-testid={ `${ testId }-header` }
                        >
                            { searchOptionsHeader }
                        </Heading>
                        <Divider className="compact" />
                        <div
                            className="form-wrapper"
                            data-componentid={ `${ componentId }-form-wrapper` }
                            data-testid={ `${ testId }-form-wrapper` }
                        >
                            { children }
                        </div>
                    </div>
                ) }
                on="click"
                position={ dropdownPosition }
                open={ isDropdownVisible }
                onClose={ handleSearchDropdownClose }
                closeOnPortalMouseLeave={ false }
                data-componentid={ `${ componentId }-dropdown` }
                data-testid={ `${ testId }-dropdown` }
                hoverable
                pinned
                className="advanced-search"
            />
        </div>
    );
};

/**
 * Default proptypes for the Advanced search component.
 */
AdvancedSearch.defaultProps = {
    aligned: "left",
    className: null,
    clearButtonPopupLabel: null,
    "data-componentid": "advanced-search",
    "data-testid": "advanced-search",
    dropdownPosition: "bottom left",
    dropdownTriggerPopupLabel: null,
    enableQuerySearch: true,
    externalSearchQuery: "",
    fill: "default",
    hintActionKeys: "Enter",
    hintLabel: "Search for",
    onExternalSearchQueryClear: null,
    placeholder: null,
    searchOptionsHeader: "Advanced Search",
    submitted: false
};
