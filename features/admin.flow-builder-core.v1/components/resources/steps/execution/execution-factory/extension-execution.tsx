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

import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import loadStaticResource from "@wso2is/admin.core.v1/utils/load-static-resource";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, useMemo, useState } from "react";
import useAuthenticationFlowBuilderCore from "../../../../../hooks/use-authentication-flow-builder-core-context";
import { ExtensionExecutorInterface } from "../../../../../models/metadata";
import { DEFAULT_EXTENSION_EXECUTOR_ICON } from "../../../../../utils/build-extension-executor-steps";
import { ExecutionMinimalPropsInterface } from "../execution-minimal";

/**
 * Props interface of ExtensionExecution.
 */
type ExtensionExecutionPropsInterface = ExecutionMinimalPropsInterface & IdentifiableComponentInterface;

/**
 * Canvas node for an executor contributed by an extension deployed on the server.
 */
const ExtensionExecution = ({
    resource,
    "data-componentid": componentId = "extension-execution"
}: ExtensionExecutionPropsInterface): ReactElement => {
    const { metadata } = useAuthenticationFlowBuilderCore();
    const [ hasIconFailed, setHasIconFailed ] = useState<boolean>(false);

    const executorName: string = resource?.data?.action?.executor?.name;

    const executor: ExtensionExecutorInterface | null = useMemo(() => {
        if (!executorName || !metadata?.extensionExecutors?.length) {
            return null;
        }

        return metadata.extensionExecutors.find(
            (candidate: ExtensionExecutorInterface) => candidate.name === executorName
        ) || null;
    }, [ executorName, metadata?.extensionExecutors ]);

    const isDefaultIcon: boolean = hasIconFailed || !executor?.icon;
    const iconSrc: string = isDefaultIcon
        ? loadStaticResource(DEFAULT_EXTENSION_EXECUTOR_ICON)
        : loadStaticResource(executor.icon);

    const displayName: string = executor?.displayName || resource?.display?.label || executorName;

    return (
        <Box
            display="flex"
            gap={ 1 }
            data-componentid={ componentId }
            className="flow-builder-execution extension-execution"
        >
            <img
                src={ iconSrc }
                alt={ displayName }
                height="20"
                style={ { filter: isDefaultIcon ? "invert(1)" : "none", objectFit: "contain" } }
                onError={ () => setHasIconFailed(true) }
            />
            <Typography variant="body1">{ displayName }</Typography>
        </Box>
    );
};

export default ExtensionExecution;
