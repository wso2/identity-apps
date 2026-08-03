/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { useMemo } from "react";
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";
import { ExtensionExecutorInterface } from "../models/metadata";

/**
 * Hook that resolves the metadata of an executor contributed by an extension deployed on the server.
 */
export const useExtensionExecutor = (executorName: string): ExtensionExecutorInterface | null => {
    const { metadata } = useAuthenticationFlowBuilderCore();

    return useMemo(() => {
        if (!executorName || !metadata?.extensionExecutors?.length) {
            return null;
        }

        return metadata.extensionExecutors.find(
            (executor: ExtensionExecutorInterface) => executor.name === executorName
        ) || null;
    }, [ executorName, metadata?.extensionExecutors ]);
};

/**
 * Hook that decides whether the connection picker applies to an dynamically registered executor.
 */
export const useIsConnectionlessExtensionExecutor = (executorName: string): boolean => {
    const executor: ExtensionExecutorInterface | null = useExtensionExecutor(executorName);

    return !!executor && executor.requiresConnection === false;
};

export default useExtensionExecutor;
