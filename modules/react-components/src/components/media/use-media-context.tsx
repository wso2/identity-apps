/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

import { BreakpointKey } from "@artsy/fresnel";
import { CreateMediaResults } from "@artsy/fresnel/dist/Media";
import { useMemo } from "react";
import { AppMedia } from "./media-context-core";
import { useWindowDimensions } from "../../hooks";

export interface useMediaContextInterface {
    /**
     * Is the viewport mobile.
     */
     isMobileViewport?: boolean;
    /**
     * Finds the breakpoint that matches the given width.
     */
     findBreakpointAtWidth?: CreateMediaResults<BreakpointKey, unknown>[ "findBreakpointAtWidth" ];
    /**
     * Creates a list of your application’s breakpoints that support the given
     * widths and everything in between.
     */
     findBreakpointsForWidths?: CreateMediaResults<BreakpointKey, unknown>[ "findBreakpointsForWidths" ]
}

/**
 * Hook to retrieve the window dimensions.
 *
 * @returns Window Dimensions.
 */
export const useMediaContext = (): useMediaContextInterface => {

    const {
        findBreakpointAtWidth,
        findBreakpointsForWidths
    } = AppMedia;

    const { width } = useWindowDimensions();

    const isMobileViewport = useMemo(() => {
        return findBreakpointAtWidth(width) === "mobile" || findBreakpointAtWidth(width) === undefined;
    }, [ width ]);

    return {
        findBreakpointAtWidth,
        findBreakpointsForWidths,
        isMobileViewport
    };
};
