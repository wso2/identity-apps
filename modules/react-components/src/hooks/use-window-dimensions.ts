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
