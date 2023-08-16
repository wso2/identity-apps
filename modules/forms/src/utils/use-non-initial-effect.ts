/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { EffectCallback, useEffect, useRef } from "react";

/**
 * This is a custom React hook that calls the the useEffect hook whenever the passed deps change
 * EXCEPT during initial render.
 *
 * @param effect - The callback function passed into the useEffect hook.
 * @param deps - states or props based on which the callback function should be conditionally called.
 */
export const useNonInitialEffect = (effect: EffectCallback, deps?: readonly any[]): void => {

    const initialRender = useRef(true);

    useEffect(() => {
        let returned;

        if (initialRender.current) {
            initialRender.current = false;
        } else {
            returned = effect();
        }

        if (returned && typeof returned === "function") {
            return returned();
        }
    }, deps);
};
