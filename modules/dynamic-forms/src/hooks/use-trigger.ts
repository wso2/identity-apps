/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useState } from "react";

/**
 * This is a custom React Hook that returns a function that toggles the state and
 * thereby triggers either a reset or a submit event.
 *
 * @param useState - Call the React useState hook.
 * @returns The state, A function that can be called to trigger a reset or submit event.
 */
export const useTrigger = (): [boolean, () => void] => {
    
    const [ state, setState ] = useState(false);

    return [ state, () => {
        setState(!state);
    } ];
};
