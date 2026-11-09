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
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import loadStaticResource from "@wso2is/admin.core.v1/utils/load-static-resource";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import FlowConstants from "../../../../../constants/flow-constants";
import useExtensionExecutor from "../../../../../hooks/use-extension-executor";
import useFlowHandoffDefaultTarget from "../../../../../hooks/use-flow-handoff-default-target";
import { ExtensionExecutorInterface } from "../../../../../models/metadata";
import { ExecutionMinimalPropsInterface } from "../execution-minimal";

/**
 * Props interface of {@link FlowHandoffExecution}.
 */
type FlowHandoffExecutionPropsInterface = ExecutionMinimalPropsInterface & IdentifiableComponentInterface;

/**
 * Canvas node for the flow handoff executor. Shows where the flow continues and how long the link is valid.
 */
const FlowHandoffExecution = ({
    resource,
    "data-componentid": componentId = "flow-handoff-execution"
}: FlowHandoffExecutionPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const defaultTarget: string = useFlowHandoffDefaultTarget();

    const executorName: string = resource?.data?.action?.executor?.name;
    const executor: ExtensionExecutorInterface | null = useExtensionExecutor(executorName);

    const targetUrl: string = resource?.data?.action?.executor?.meta?.[
        FlowConstants.FLOW_HANDOFF_TARGET_URL_META_KEY ] ?? "";
    const expiryTime: string = resource?.data?.action?.executor?.meta?.[
        FlowConstants.FLOW_HANDOFF_EXPIRY_TIME_META_KEY ] || FlowConstants.FLOW_HANDOFF_DEFAULT_EXPIRY_TIME;

    /**
     * Host and path of the target URL, so long URLs still fit in the node.
     */
    const shortTargetUrl: string = useMemo(() => {
        try {
            const url: URL = new URL(targetUrl);

            return `${ url.host }${ url.pathname === "/" ? "" : url.pathname }`;
        } catch {
            return targetUrl;
        }
    }, [ targetUrl ]);

    const displayName: string = executor?.displayName || resource?.display?.label || executorName;

    return (
        <Box
            display="flex"
            flexDirection="column"
            data-componentid={ componentId }
            className="flow-builder-execution flow-handoff-execution"
        >
            <Box display="flex" gap={ 1 } alignItems="center">
                { executor?.icon && (
                    <img
                        src={ loadStaticResource(executor.icon) }
                        alt={ displayName }
                        height="20"
                    />
                ) }
                <Typography variant="h6" className="flow-handoff-execution-name">{ displayName }</Typography>
            </Box>
            <Typography variant="body1" className="flow-handoff-execution-label">
                { t("flows:core.executions.flowHandoff.targetUrlDescription") }
            </Typography>
            <Tooltip title={ targetUrl } disableHoverListener={ !targetUrl }>
                <Typography
                    variant="body1"
                    className={ classNames("flow-handoff-execution-target", { default: !targetUrl }) }
                >
                    { targetUrl ? shortTargetUrl : defaultTarget }
                </Typography>
            </Tooltip>
            <Typography variant="body2" className="flow-handoff-execution-expiry">
                { t("flows:core.executions.flowHandoff.expiryTime", { expiryTime }) }
            </Typography>
        </Box>
    );
};

export default FlowHandoffExecution;
