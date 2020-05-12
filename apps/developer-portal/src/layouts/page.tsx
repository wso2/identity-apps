/*
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { PageHeader, PageHeaderPropsInterface } from "@wso2is/react-components";
import classNames from "classnames";
import React, { PropsWithChildren, ReactElement } from "react";
import { Divider } from "semantic-ui-react";

/**
 * Page layout component Prop types.
 */
interface PageLayoutPropsInterface extends PageHeaderPropsInterface, TestableComponentInterface {
    contentTopMargin?: boolean;
    padded?: boolean;
    showHelpPanel?: boolean;
}

/**
 * Page layout.
 *
 * @param {React.PropsWithChildren<PageLayoutPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const PageLayout: React.FunctionComponent<PropsWithChildren<PageLayoutPropsInterface>> = (
    props: PropsWithChildren<PageLayoutPropsInterface>
): ReactElement => {

    const {
        children,
        contentTopMargin,
        [ "data-testid" ]: testId,
        padded,
        ...rest
    } = props;

    const layoutClasses = classNames("layout", "page-layout");
    const layoutContentClasses = classNames("layout-content", {
        padded
    });

    return (
        <div className={ layoutClasses } data-tesid={ testId }>
            <div className={ layoutContentClasses }>
                <PageHeader
                    data-testid={ `${ testId }-page-header` }
                    { ...rest }
                />
                { contentTopMargin && <Divider hidden/> }
                { children }
            </div>
        </div>
    );
};

/**
 * Default props for the page layout.
 */
PageLayout.defaultProps = {
    contentTopMargin: true,
    "data-testid": "page-layout",
    padded: true,
    titleTextAlign: "left"
};
