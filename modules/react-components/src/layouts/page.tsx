/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Helmet } from "react-helmet";
import { Divider } from "semantic-ui-react";
import { PageHeader, PageHeaderPropsInterface } from "../components";

/**
 * Page layout component Prop types.
 */
export interface PageLayoutPropsInterface extends PageHeaderPropsInterface, TestableComponentInterface,
    IdentifiableComponentInterface {

    /**
     * Flag to enable/disable content top margin.
     */
    contentTopMargin?: boolean;
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Flag to enable/disable padding.
     */
    padded?: boolean;
    /**
     * Page name to display in the browser tab.
     */
    pageTitle?: string;
    /**
     * Flag to enable/disable help panel visibility.
     */
    showHelpPanel?: boolean;
    /**
     * Flag to determine whether max width should be added to page header.
     */
    pageHeaderMaxWidth?: boolean;
    /**
     * This injects teh passed component above teh page header.
     */
    componentAbovePageHeader?: ReactElement;
}

/**
 * Page layout.
 *
 * @param props - Props injected to the component.
 *
 * @returns Page Layout
 */
export const PageLayout: FunctionComponent<PropsWithChildren<PageLayoutPropsInterface>> = (
    props: PropsWithChildren<PageLayoutPropsInterface>
): ReactElement => {

    const {
        action,
        children,
        contentTopMargin,
        className,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        padded,
        pageTitle,
        componentAbovePageHeader,
        ...rest
    } = props;

    const layoutClasses = classNames(
        "layout",
        "page-layout",
        className
    );

    const layoutContentClasses = classNames(
        "layout-content",
        {
            padded
        }
    );

    return (
        <>
            <Helmet>
                <title>{ pageTitle }</title>
            </Helmet>
            <div className={ layoutClasses } data-testid={ testId } data-componentid={ componentId }>
                <div className={ layoutContentClasses }>
                    { componentAbovePageHeader && componentAbovePageHeader }
                    <PageHeader
                        action={ action }
                        data-testid={ `${testId}-page-header` }
                        data-componentid={ `${componentId}-page-header` }
                        { ...rest }
                    />
                    { contentTopMargin && <Divider hidden /> }
                    { children }
                </div>
            </div>
        </>
    );
};

/**
 * Default props for the page layout.
 */
PageLayout.defaultProps = {
    contentTopMargin: true,
    "data-componentid": "page-layout",
    "data-testid": "page-layout",
    padded: true,
    titleTextAlign: "left"
};
