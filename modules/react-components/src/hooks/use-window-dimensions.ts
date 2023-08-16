/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useEffect, useState } from "react";

export interface useWindowDimensionsHookValuesInterface {
    /**
     * Window Height.
     */
    height: Window[ "innerHeight" ];
    /**
     * Window Width.
     */
    width: Window[ "innerWidth" ];
}

/**
 * Hook to retrieve the window dimensions.
 *
 * @param initialValues - Initial Values.
 * @returns Window Dimensions.
 */
export const useWindowDimensions = (initialValues: useWindowDimensionsHookValuesInterface = {
    height: undefined,
    width: undefined
}): useWindowDimensionsHookValuesInterface => {

    const [ windowDimensions, setWindowDimensions ] = useState<useWindowDimensionsHookValuesInterface>(initialValues);

    /**
     * Onmount calculate the window dimensions.
     */
    useEffect(() => {
        // Handler to call on window resize.
        const handleResize = (): void => {
            // Set window width/height to state
            setWindowDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            });
        };

        // Add event listener.
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size.
        handleResize();

        // Housekeeping, Remove event listener on unmount.
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return windowDimensions;
};
