/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
    disabled?: boolean;
}

/**
 * Transfer list component.
 *
 * @param props - Props injected to the component.
 *
 * @returns
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
        disabled,
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
                                                        disabled={ isLoading || disabled }
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
                                                                    disabled={ disabled }
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
                                                                    disabled={ isLoading || disabled }
                                                                />
                                                            )
                                                        }
                                                        <Segment
                                                            className="transfer-list-segment"
                                                            disabled={ disabled }
                                                        >
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
                                                            disabled={ disabled }
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
                                                            disabled={ disabled }
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
                                                        disabled={ isLoading || disabled }
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
                                                            disabled={ disabled }
                                                        />
                                                        <Segment
                                                            className="transfer-list-segment"
                                                            disabled={ disabled }
                                                        >
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
    disabled: false,
    isLoading: false,
    selectAllCheckboxLabel: "Select all",
    showListSearch: true
};
