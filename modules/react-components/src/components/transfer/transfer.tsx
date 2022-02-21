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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Button, Checkbox, Grid, Icon, Segment } from "semantic-ui-react";
import { TransferListSearch } from "./transfer-list-search";

/**
 * Proptypes transfer component.
 */
export interface TransferComponentPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Render segments with basic formatting.
     */
    basic?: boolean;
    /**
     * Add border to segments.
     */
    bordered?: boolean;
    /**
     * Render with compact formatting. i.e. No padding etc.
     */
    compact?: boolean;
    /**
     * Additional CSS classes.
     */
    className?: string;
    handleUnelectedListSearch: (e: React.FormEvent<HTMLInputElement>, { value }: { value: string }) => void;
    handleSelectedListSearch?: (e: React.FormEvent<HTMLInputElement>, { value }: { value: string }) => void;
    handleHeaderCheckboxChange?: () => void;
    /**
     * position of the search icon
     */
    iconPosition?: "left";
    /**
     * Show loading placeholders.
     */
    isLoading?: boolean;
    isHeaderCheckboxChecked?: boolean;
    addItems?: () => void;
    removeItems?: () => void;
    searchPlaceholder: string;
    selectionComponent?: boolean;
    /**
     * Show/Hide list search.
     */
    showListSearch?: boolean;
    /**
     * Show/Hide select all checkbox.
     */
    showSelectAllCheckbox?: boolean;
    /**
     * Select all checkbox label.
     */
    selectAllCheckboxLabel?: ReactNode;
}

/**
 * Transfer list component.
 *
 * @param {TransferComponentPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const TransferComponent: FunctionComponent<PropsWithChildren<TransferComponentPropsInterface>> = (
    props: PropsWithChildren<TransferComponentPropsInterface>
): ReactElement => {

    const {
        addItems,
        basic,
        bordered,
        compact,
        className,
        iconPosition,
        isLoading,
        removeItems,
        children,
        selectAllCheckboxLabel,
        searchPlaceholder,
        selectionComponent,
        handleUnelectedListSearch,
        handleSelectedListSearch,
        handleHeaderCheckboxChange,
        isHeaderCheckboxChecked,
        showSelectAllCheckbox,
        showListSearch,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "transfer-list",
        {
            bordered,
            compact
        },
        className
    );

    return (
        <Grid className={ classes }>
            {
                React.Children.count(children) > 0 && (
                    <Grid.Row columns={ 3 } className="transfer-list-row">
                        {
                            React.Children.map(children, (list: ReactElement, index: number) => {
                                return (
                                    <>
                                        {
                                            list.props.listType === "unselected" && (
                                                <Grid.Column
                                                    width={ 7 }
                                                    className="transfer-list-column transfer-list-unassigned-column"
                                                >
                                                    <Segment
                                                        basic={ basic }
                                                        disabled={ isLoading }
                                                        data-componentid={
                                                            `${ componentId }-unselected-groups`
                                                        }
                                                        data-testid={
                                                            `${ testId }-unselected-groups`
                                                        }
                                                        className="transfer-segment"
                                                    >
                                                        {
                                                            showListSearch && (
                                                                <TransferListSearch
                                                                    data-componentid={
                                                                        componentId + "-unselected-groups-search-input"
                                                                    }
                                                                    data-testid={
                                                                        testId + "-unselected-groups-search-input"
                                                                    }
                                                                    handleListSearch={ handleUnelectedListSearch }
                                                                    iconPosition={ iconPosition }
                                                                    placeholder={ searchPlaceholder }
                                                                />
                                                            )
                                                        }
                                                        {
                                                            (!isLoading
                                                                && showSelectAllCheckbox
                                                                && selectionComponent) && (
                                                                <Checkbox
                                                                    className="all-select"
                                                                    label={ selectAllCheckboxLabel }
                                                                    checked={ isHeaderCheckboxChecked }
                                                                    onChange={ handleHeaderCheckboxChange }
                                                                    disabled={ isLoading }
                                                                />
                                                            )
                                                        }
                                                        <Segment className="transfer-list-segment">
                                                            { list }
                                                        </Segment>
                                                    </Segment>
                                                </Grid.Column>
                                            )
                                        }
                                        {
                                            index === 0 && !selectionComponent && (
                                                <Grid.Column
                                                    verticalAlign="middle"
                                                    width={ 1 }
                                                    className="transfer-list-button-column"
                                                >
                                                    <Grid.Row>
                                                        <Button
                                                            data-componentid={
                                                                `${ componentId }-unselected-groups-add-button`
                                                            }
                                                            data-testid={
                                                                `${ testId }-unselected-groups-add-button`
                                                            }
                                                            type="button"
                                                            basic
                                                            size="mini"
                                                            onClick={ addItems }
                                                        >
                                                            <Icon name="chevron right" />
                                                        </Button>
                                                    </Grid.Row>
                                                    <Grid.Row>
                                                        <Button
                                                            data-componentid={
                                                                componentId + "-unselected-groups-remove-button"
                                                            }
                                                            data-testid={ testId + "-unselected-groups-remove-button" }
                                                            type="button"
                                                            basic
                                                            size="mini"
                                                            onClick={ removeItems }
                                                        >
                                                            <Icon name="chevron left" />
                                                        </Button>
                                                    </Grid.Row>
                                                </Grid.Column>
                                            )
                                        }
                                        {
                                            list.props.listType === "selected" && (
                                                <Grid.Column
                                                    width={ 7 }
                                                    className="transfer-list-column transfer-list-assigned-column"
                                                >
                                                    <Segment
                                                        basic={ basic }
                                                        disabled={ isLoading }
                                                        data-componentid={ `${ componentId }-selected-groups` }
                                                        data-testid={ `${ testId }-selected-groups` }
                                                        className="transfer-segment"
                                                    >
                                                        <TransferListSearch
                                                            data-componentid={
                                                                `${ componentId }-selected-groups-search-input`
                                                            }
                                                            data-testid={ `${ testId }-selected-groups-search-input` }
                                                            handleListSearch={ handleSelectedListSearch }
                                                            iconPosition={ iconPosition }
                                                            placeholder={ searchPlaceholder }
                                                        />
                                                        <Segment className="transfer-list-segment">
                                                            { list }
                                                        </Segment>
                                                    </Segment>
                                                </Grid.Column>
                                            )
                                        }
                                    </>
                                );
                            })
                        }
                    </Grid.Row>
                )
            }
        </Grid>
    );
};

/**
 * Default props for the transfer component.
 */
TransferComponent.defaultProps = {
    basic: false,
    bordered: true,
    "data-componentid": "transfer-component",
    "data-testid": "transfer-component",
    isLoading: false,
    selectAllCheckboxLabel: "Select all",
    showListSearch: true
};
