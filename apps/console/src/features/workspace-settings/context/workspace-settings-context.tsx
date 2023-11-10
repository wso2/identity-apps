/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { Context, createContext } from "react";
import { AssociatedRolesPatchObjectInterface } from "../../roles/models/roles";

/**
 * Props interface of {@link WorkspaceSettingsContext}
 */
export interface WorkspaceSettingsContextProps {
    /**
     * Roles of the workspace.
     */
    workspaceRoles: AssociatedRolesPatchObjectInterface;
}

/**
 * Context object for managing the workspace settings context.
 */
const WorkspaceSettingsContext: Context<WorkspaceSettingsContextProps> =
  createContext<null | WorkspaceSettingsContextProps>(null);

/**
 * Display name for the WorkspaceSettingsContext.
 */
WorkspaceSettingsContext.displayName = "WorkspaceSettingsContext";

export default WorkspaceSettingsContext;
