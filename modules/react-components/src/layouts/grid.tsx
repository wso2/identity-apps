/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import classNames from "classnames";
import React, { Fragment, FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Divider, Grid, Loader, Visibility } from "semantic-ui-react";

/**
 * Grid layout component Prop types.
 */
export interface GridLayoutPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface,
    LoadableComponentInterface {

    /**
     * Is Pagination in-progress.
     */
    isPaginating?: boolean;
    /**
     * Search component.
     */
    search?: ReactNode;
    /**
     * Position of the advanced search component.
     */
    searchPosition?: "left" | "right";
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Left action panel component.
     */
    leftActionPanel?: ReactNode;
    /**
     * Enable/Disable Pagination.
     */
    paginate?: () => void;
    /**
     * Right action panel component.
     */
    rightActionPanel?: ReactNode;
    /**
     * Flag to toggle top action panel visibility.
     */
    showTopActionPanel?: boolean;
    /**
     * i18n translations for content.
     */
    translations?: GridLayoutContentI18nInterface;
}

/**
 * Interface for the i18n string of the component.
 */
export interface GridLayoutContentI18nInterface {
    loading: ReactNode;
}

/**
 * Grid layout component.
 *
 * @param props - Props injected to the component.
 *
 * @returns the React component for Grid layout.
 */
export const GridLayout: FunctionComponent<PropsWithChildren<GridLayoutPropsInterface>> = (
    props: PropsWithChildren<GridLayoutPropsInterface>
): ReactElement => {

    const {
        isPaginating,
        search,
        searchPosition,
        children,
        className,
        isLoading,
        leftActionPanel,
        paginate,
        rightActionPanel,
        showTopActionPanel,
        translations,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "layout",
        "grid-layout",
        className
    );

    return (
        <div
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            {
                !isLoading
                    ? (
                        <Fragment>
                            {
                                showTopActionPanel && (
                                    <Fragment>
                                        <div
                                            className="top-action-panel"
                                            data-componentid={ `${ componentId }-top-action-panel` }
                                            data-testid={ `${ testId }-top-action-panel` }
                                        >
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 }>
                                                        <div className="left-aligned actions">
                                                            { searchPosition === "left" && search }
                                                            { leftActionPanel }
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 }>
                                                        <div className="actions right-aligned">
                                                            { searchPosition === "right" && search }
                                                            { rightActionPanel }
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </div>
                                        <Divider hidden/>
                                    </Fragment>
                                )
                            }
                            {
                                paginate
                                    ? (
                                        <Visibility once onBottomVisible={ () => paginate() }>
                                            <div className="list-container">
                                                { children }
                                            </div>
                                            { isPaginating && (
                                                <div className="pagination-loader-container">
                                                    <Loader active indeterminate size="small" inline="centered">
                                                        { translations?.loading || "Loading..." }
                                                    </Loader>
                                                </div>
                                            ) }
                                        </Visibility>
                                    )
                                    : (
                                        <div className="list-container">
                                            { children }
                                        </div>
                                    )
                            }
                        </Fragment>
                    )
                    : <Loader active inline="centered" />
            }
        </div>
    );
};

/**
 * Default props for the component.
 */
GridLayout.defaultProps = {
    "data-componentid": "grid-layout",
    "data-testid": "grid-layout",
    searchPosition: "left",
    showTopActionPanel: true
};
