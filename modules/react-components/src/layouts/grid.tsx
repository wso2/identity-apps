/**
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
 * @param {React.PropsWithChildren<GridLayoutPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
