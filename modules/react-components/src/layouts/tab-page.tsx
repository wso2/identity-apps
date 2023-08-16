/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
