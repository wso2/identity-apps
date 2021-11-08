/**
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

import { EffectCallback, useEffect, useRef } from "react";

/**
 * This is a custom React hook that calls the the useEffect hook whenever the passed deps change
 * EXCEPT during initial render
 * @param {React.EffectCallback} effect The callback function passed into the useEffect hook
 * @param deps states or props based on which the callback function should be conditionally called
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
