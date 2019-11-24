/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import classNames from "classnames";
import React, { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { Button, Icon, Input, Popup } from "semantic-ui-react";
import { AdvanceSearchIcons } from "../../configs";
import { useClickOutside } from "../../hooks";
import { ThemeIcon } from "./icon";

/**
 *
 * Proptypes for the advance search component
 */
interface AdvanceSearchProps {
    aligned?: "left" | "right" | "center";
    className?: string;
    clearButtonPopupLabel?: string;
    defaultSearchStrategy: string;
    dropdownTriggerPopupLabel?: string;
    externalSearchQuery?: string;
    hintActionKeys?: string;
    hintLabel?: string;
    onExternalSearchQueryClear?: () => void;
    onSearchQuerySubmit: (processQuery: boolean, query: string) => void;
    placeholder?: string;
    resetSubmittedState?: () => void;
    searchOptionsHeader?: string;
    submitted?: boolean;
}

/**
 * Advance search component.
 *
 * @param {React.PropsWithChildren<AdvanceSearchProps>} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const AdvanceSearch: FunctionComponent<React.PropsWithChildren<AdvanceSearchProps>> = (
    props: React.PropsWithChildren<AdvanceSearchProps>
): JSX.Element => {
    const {
        aligned,
        className,
        children,
        clearButtonPopupLabel,
        defaultSearchStrategy,
        dropdownTriggerPopupLabel,
        externalSearchQuery,
        hintActionKeys,
        hintLabel,
        onExternalSearchQueryClear,
        onSearchQuerySubmit,
        placeholder,
        resetSubmittedState,
        searchOptionsHeader,
        submitted
    } = props;
    const [ internalSearchQuery, setInternalSearchQuery ] = useState("");
    const [ showSearchFieldHint, setShowSearchFieldHint ] = useState(false);
    const { ref, isComponentVisible, setIsComponentVisible } = useClickOutside(false);

    /**
     * useEffect hook to handle `internalSearchQuery` change.
     */
    useEffect(() => {
        if (!internalSearchQuery) {
            setShowSearchFieldHint(false);
        }
        if (internalSearchQuery && !isComponentVisible && (externalSearchQuery !== internalSearchQuery)) {
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
            setIsComponentVisible(false);
            resetSubmittedState();
        }
    }, [ submitted ]);

    /**
     * Wrapper `div` style classes.
     */
    const wrapperClasses = classNames({
        [ `aligned-${ aligned }` ]: aligned
    }, className);

    /**
     * Search field style classes.
     */
    const searchFieldClasses = classNames({
        active: internalSearchQuery
    }, className);

    /**
     * Search field hint style classes.
     */
    const searchFieldHintClasses = classNames({
        active: showSearchFieldHint
    }, className);

    /**
     * Handles the search input field `onChange` event.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
     */
    const handleSearchQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;

        setInternalSearchQuery(value);
    };

    /**
     * Handles the show options dropdown `onClick` event.
     */
    const handleShowOptionsClick = (): void => {
        setIsComponentVisible(!isComponentVisible);
    };

    /**
     * Handles the clear query button `onClick` event.
     */
    const handleQueryClearClick = (): void => {
        setInternalSearchQuery("");
        onSearchQuerySubmit(false, null);
        onExternalSearchQueryClear();
    };

    /**
     * Handles search query submit by keyboard events.
     *
     * @param {KeyboardEvent} e - Keyboard event.
     */
    const handleSearchQuerySubmit = (e: KeyboardEvent): void => {
        const { key, shiftKey } = e;
        let query = "";

        // If only enter key is pressed perform the default filter strategy.
        if (!shiftKey && key === "Enter") {
            query = `${ defaultSearchStrategy } ${ internalSearchQuery }`;
            onSearchQuerySubmit(false, query);
            setShowSearchFieldHint(false);
        }
        // If both `Enter` key and `Shift` key are pressed, treat the input
        // as a query and perform the search.
        if (shiftKey && key === "Enter") {
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

    return (
        <div className={ `advance-search-wrapper ${ wrapperClasses }` }>
            <Input
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
                                                    basic
                                                    compact
                                                    className="input-add-on"
                                                    onClick={ handleQueryClearClick }
                                                >
                                                    <ThemeIcon
                                                        size="nano"
                                                        defaultIcon
                                                        transparent
                                                        icon={ AdvanceSearchIcons.clear }
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
                            disabled={ !dropdownTriggerPopupLabel }
                            trigger={
                                (
                                    <Button basic compact className="input-add-on" onClick={ handleShowOptionsClick }>
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
                className={ `advance-search with-add-on ${ searchFieldClasses }` }
                size="large"
                icon="search"
                iconPosition="left"
                placeholder={ placeholder }
                value={ internalSearchQuery }
                onBlur={ handleSearchFieldBlur }
                onChange={ handleSearchQueryChange }
                onKeyDown={ handleSearchQuerySubmit }
            />
            <div className={ `search-query-hint ${ searchFieldHintClasses }` }>
                <div className="query">{ hintLabel }</div>
                <div className="short-cut"><Icon name="keyboard outline"/>{ " " }{ hintActionKeys }</div>
            </div>
            <div ref={ ref }>
                {
                    isComponentVisible
                        ? (
                            <div className="advance-search-options">
                                <div className="header">{ searchOptionsHeader }</div>
                                <div className="form-wrapper">
                                    { children }
                                </div>
                            </div>
                        )
                        : null
                }
            </div>
        </div>
    );
};

/**
 * Default proptypes for the Advance search component.
 */
AdvanceSearch.defaultProps = {
    aligned: "left",
    className: null,
    clearButtonPopupLabel: null,
    dropdownTriggerPopupLabel: null,
    externalSearchQuery: "",
    hintActionKeys: "Enter",
    hintLabel: "Search for",
    onExternalSearchQueryClear: null,
    placeholder: null,
    searchOptionsHeader: "Advance Search",
    submitted: false
};
