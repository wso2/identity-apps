/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Context, createContext } from "react";
import { ResourceEndpointsInterface } from "../models/config";

// Define the interface for the resource endpoints context value.
export interface ResourceEndpointsContextInterface {
    resourceEndpoints: ResourceEndpointsInterface | undefined;
    setResourceEndpoints: (endpoints: ResourceEndpointsInterface) => void;
}

// Create the resource endpoints context using createContext.
const _ResourceEndpointsContext: Context<ResourceEndpointsContextInterface> = createContext<
    ResourceEndpointsContextInterface | undefined>(undefined);

// Set a display name for the resource endpoints context (optional).
_ResourceEndpointsContext.displayName = "ResourceEndpointsContext";

// Export the resource endpoints context.
export const ResourceEndpointsContext: Context<ResourceEndpointsContextInterface> = _ResourceEndpointsContext;
