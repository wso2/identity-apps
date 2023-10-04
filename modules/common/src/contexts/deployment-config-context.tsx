/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { Context, createContext } from "react";
import { DeploymentConfigInterface } from "../models/config";

// Define the interface for the deployment config context value.
export interface DeploymentConfigContextInterface {
    deploymentConfig: DeploymentConfigInterface;
    setDeploymentConfig: (configs: DeploymentConfigInterface) => void;
}

// Create the deployment config context using createContext.
const _DeploymentConfigContext: Context<DeploymentConfigContextInterface> = createContext<
    DeploymentConfigContextInterface | undefined>(undefined);

// Set a display name for the deployment config context (optional).
_DeploymentConfigContext.displayName = "DeploymentConfigContext";

// Export the deployment config context.
export const DeploymentConfigContext: Context<DeploymentConfigContextInterface> = _DeploymentConfigContext;
