/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Context, createContext } from "react";
import { UIConfigInterface } from "../models/config";

// Define the interface for the UI config context value.
export interface UIConfigContextInterface {
    UIConfig: UIConfigInterface;
    setUIConfig: (configs: UIConfigInterface) => void;
}

// Create the UI config context using createContext.
const _UIConfigContext: Context<UIConfigContextInterface> = createContext<
    UIConfigContextInterface | undefined>(undefined);

// Set a display name for the UI config context (optional).
_UIConfigContext.displayName = "UIConfigContext";

// Export the UI config context.
export const UIConfigContext: Context<UIConfigContextInterface> = _UIConfigContext;
