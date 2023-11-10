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

import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { useApplicationList } from "../../applications/api/application";
import { useGetApplication } from "../../applications/api/use-get-application";
import { AppState } from "../../core/store";
import WorkspaceSettingsContext from "../context/workspace-settings-context";

/**
 * Props interface of {@link WorkspaceSettingsProvider}
 */
export type WorkspaceSettingsProviderProps = {};

/**
 * Provider for the workspace settings context.
 *
 * @param props - Props for the client.
 * @returns Workspace settings provider.
 */
const WorkspaceSettingsProvider = (props: PropsWithChildren<WorkspaceSettingsProviderProps>): ReactElement => {
    const { children } = props;

    const consoleClientId: string = useSelector((state: AppState) => state?.config?.deployment?.clientID);

    const { data: applicationList } = useApplicationList(null, null, null, `clientId eq ${consoleClientId}`);

    const consoleId: string = useMemo(() => {
        return applicationList?.applications[0]?.id;
    }, [ applicationList ]);

    const { data: consoleApplication } = useGetApplication(consoleId, !!consoleId);

    return (
        <WorkspaceSettingsContext.Provider
            value={ {
                workspaceRoles: consoleApplication?.associatedRoles
            } }
        >
            { children }
        </WorkspaceSettingsContext.Provider>
    );
};

export default WorkspaceSettingsProvider;
