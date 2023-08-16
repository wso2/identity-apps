/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useEffect, useState } from "react";

/**
 * UI element sizes hook args types.
 */
export interface UIElementSizesHookArgsInterface {
    /**
     * Height of footer.
     */
    footerHeight: number;
    /**
     * Height of header.
     */
    headerHeight: number;
    /**
     * Heigh of the top loader bar.
     */
    topLoadingBarHeight: number;
}

/**
 * UI element sizes hook return value types.
 */
export interface UIElementSizesHookReturnValuesInterface {
    /**
     * Height of footer.
     */
    footerHeight: number;
    /**
     * Height of header.
     */
    headerHeight: number;
}

/**
 * Hook to get specifics ui elements sizes.
 *
 * @param props - Default values for the header and footer.
 * @returns App Header Height & Footer Height.
 */
export const useUIElementSizes = (props: UIElementSizesHookArgsInterface): UIElementSizesHookReturnValuesInterface => {

    const {
        footerHeight: _footerHeight,
        headerHeight: _headerHeight,
        topLoadingBarHeight
    } = props;

    const [ headerHeight, setHeaderHeight ] = useState<number>(_headerHeight);
    const [ footerHeight, setFooterHeight ] = useState<number>(_footerHeight);

    const appHeader = document.getElementById("app-header");
    const appFooter = document.getElementById("app-footer");

    useEffect(() => {
        if (headerHeight === appHeader?.offsetHeight) {
            return;
        }
        setHeaderHeight(appHeader?.offsetHeight - topLoadingBarHeight);
    });

    useEffect(() => {
        if (footerHeight === appFooter?.offsetHeight) {
            return;
        }
        setFooterHeight(appFooter?.offsetHeight);
    });

    // This method has to tracked in both identity apps and extensions to fix the eslint issues,
    // hence it can be fixed later.
    // Tracked here: https://github.com/wso2/product-is/issues/12726#issuecomment-954835957
    return {
        headerHeight,
        // eslint-disable-next-line sort-keys
        footerHeight
    };
};
