/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { BreakpointKey } from "@artsy/fresnel";
import { CreateMediaResults } from "@artsy/fresnel/dist/Media";
import { useMemo } from "react";
import { AppMedia, BREAKPOINTS } from "./media-context-core";
import { useWindowDimensions } from "../../hooks";

export interface useMediaContextInterface {
    /**
     * Is the viewport mobile.
     */
    isMobileViewport?: boolean;
    /**
     * Is the viewport width greater than mobile.
     */
     isGreaterThanMobileViewport?: boolean;
    /**
     * Is the viewport width greater than or equal mobile.
     */
    isGreaterThanOrEqualMobileViewport?: boolean;
    /**
     * Is the viewport width less than mobile.
     */
     isLessThanMobileViewport?: boolean;
    /**
     * Is the viewport width less than or equal mobile.
     */
    isLessThanOrEqualMobileViewport?: boolean;
    /**
     * Is the viewport tablet.
     */
    isTabletViewport?: boolean;
    /**
     * Is the viewport width greater than tablet.
     */
    isGreaterThanTabletViewport?: boolean;
    /**
     * Is the viewport width greater than or equal tablet.
     */
    isGreaterThanOrEqualTabletViewport?: boolean;
    /**
     * Is the viewport width less than tablet.
     */
    isLessThanTabletViewport?: boolean;
    /**
     * Is the viewport width less than or equal tablet.
     */
    isLessThanOrEqualTabletViewport?: boolean;
    /**
     * Is the viewport computer.
     */
    isComputerViewport?: boolean;
    /**
     * Is the viewport width greater than computer.
     */
    isGreaterThanComputerViewport?: boolean;
    /**
     * Is the viewport width greater than or equal computer.
     */
    isGreaterThanOrEqualComputerViewport?: boolean;
    /**
     * Is the viewport width less than computer.
     */
    isLessThanComputerViewport?: boolean;
    /**
     * Is the viewport width less than or equal computer.
     */
    isLessThanOrEqualComputerViewport?: boolean;
    /**
     * Finds the breakpoint that matches the given width.
     */
    findBreakpointAtWidth?: CreateMediaResults<BreakpointKey, unknown>[ "findBreakpointAtWidth" ];
    /**
     * Creates a list of your application’s breakpoints that support the given
     * widths and everything in between.
     */
    findBreakpointsForWidths?: CreateMediaResults<BreakpointKey, unknown>[ "findBreakpointsForWidths" ];
    /**
     * A list of your application’s breakpoints sorted from small to large.
     */
    getBreakpoints: () => BreakpointKey[];
    /**
     * A list of your application’s breakpoints with widths.
     */
    getBreakpointsWithWidths: () => typeof BREAKPOINTS;
}

/**
 * Hook to retrieve the window dimensions.
 *
 * @returns Window Dimensions.
 */
export const useMediaContext = (): useMediaContextInterface => {

    const {
        findBreakpointAtWidth,
        findBreakpointsForWidths,
        SortedBreakpoints
    } = AppMedia;

    const { width } = useWindowDimensions();

    const isMobileViewport = useMemo(() => {
        return findBreakpointAtWidth(width) === "mobile" || findBreakpointAtWidth(width) === undefined;
    }, [ width ]);

    const isGreaterThanMobileViewport = useMemo(() => {
        return width > BREAKPOINTS.mobile;
    }, [ width ]);

    const isGreaterThanOrEqualMobileViewport = useMemo(() => {
        return width >= BREAKPOINTS.mobile;
    }, [ width ]);

    const isLessThanMobileViewport = useMemo(() => {
        return width < BREAKPOINTS.mobile;
    }, [ width ]);

    const isLessThanOrEqualMobileViewport = useMemo(() => {
        return width <= BREAKPOINTS.mobile;
    }, [ width ]);

    const isTabletViewport = useMemo(() => {
        return findBreakpointAtWidth(width) === "tablet";
    }, [ width ]);

    const isGreaterThanTabletViewport = useMemo(() => {
        return width > BREAKPOINTS.tablet;
    }, [ width ]);

    const isGreaterThanOrEqualTabletViewport = useMemo(() => {
        return width >= BREAKPOINTS.tablet;
    }, [ width ]);

    const isLessThanTabletViewport = useMemo(() => {
        return width < BREAKPOINTS.tablet;
    }, [ width ]);

    const isLessThanOrEqualTabletViewport = useMemo(() => {
        return width <= BREAKPOINTS.tablet;
    }, [ width ]);

    const isComputerViewport = useMemo(() => {
        return findBreakpointAtWidth(width) === "computer";
    }, [ width ]);

    const isGreaterThanComputerViewport = useMemo(() => {
        return width > BREAKPOINTS.computer;
    }, [ width ]);

    const isGreaterThanOrEqualComputerViewport = useMemo(() => {
        return width >= BREAKPOINTS.computer;
    }, [ width ]);

    const isLessThanComputerViewport = useMemo(() => {
        return width < BREAKPOINTS.computer;
    }, [ width ]);

    const isLessThanOrEqualComputerViewport = useMemo(() => {
        return width <= BREAKPOINTS.computer;
    }, [ width ]);

    return {
        findBreakpointAtWidth,
        findBreakpointsForWidths,
        getBreakpoints: () => SortedBreakpoints,
        getBreakpointsWithWidths: () => BREAKPOINTS,
        isComputerViewport,
        isGreaterThanComputerViewport,
        isGreaterThanMobileViewport,
        isGreaterThanOrEqualComputerViewport,
        isGreaterThanOrEqualMobileViewport,
        isGreaterThanOrEqualTabletViewport,
        isGreaterThanTabletViewport,
        isLessThanComputerViewport,
        isLessThanMobileViewport,
        isLessThanOrEqualComputerViewport,
        isLessThanOrEqualMobileViewport,
        isLessThanOrEqualTabletViewport,
        isLessThanTabletViewport,
        isMobileViewport,
        isTabletViewport
    };
};
