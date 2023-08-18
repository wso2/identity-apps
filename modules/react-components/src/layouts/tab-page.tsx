/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { PageLayout, PageLayoutPropsInterface } from "../";
import { ResourceTab } from "../components";

/**
 * Tab Page layout component Prop types.
 */
export interface TabPageLayoutPropsInterface extends Omit<PageLayoutPropsInterface, "isLoading"> {

    /**
     * Flag for request loading status.
     */
    isLoading: boolean;
}

/**
 * Tab Page layout.
 *
 * @param props - Props injected to the component.
 *
 * @returns Tab Page Layout
 */
export const TabPageLayout: FunctionComponent<PropsWithChildren<TabPageLayoutPropsInterface>> = (
    props: PropsWithChildren<TabPageLayoutPropsInterface>
): ReactElement => {

    const {
        isLoading,
        children,
        ...rest
    } = props;

    if (isLoading) {
        return (
            <PageLayout
                isLoading={ true }
                { ...rest }
            >
                <ResourceTab
                    isLoading={ true }
                    { ...rest }
                />
            </PageLayout>
        );
    }

    return (
        <PageLayout { ...rest }>
            { children }
        </PageLayout>
    );
};

/**
 * Default props for the tab page layout.
 */
TabPageLayout.defaultProps = {
    loadingStateOptions: {
        count: 5,
        imageType: "square"
    }
};
