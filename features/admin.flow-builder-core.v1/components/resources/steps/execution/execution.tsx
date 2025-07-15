/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, Position } from "@xyflow/react";
import React, { FC, ReactElement } from "react";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import "./execution.scss";

/**
 * Props interface of {@link Execution}
 */
export type ExecutionPropsInterface = CommonStepFactoryPropsInterface & IdentifiableComponentInterface;

const EXECUTOR_LABELS: Record<string, string> = {
    ConfirmationCodeValidationExecutor: "Confirmation Code"
};

/**
 * Execution node component.
 *
 * @param props - Props injected to the component.
 * @returns Execution node component.
 */
const Execution: FC<ExecutionPropsInterface & Node> = ({
    data,
    id,
    ["data-componentid"]: componentId = "execution"
}: ExecutionPropsInterface & Node): ReactElement => {
    const label: string = EXECUTOR_LABELS[(data as any)?.action?.executor?.name] || "Execution";

    return (
        <div className="flow-builder-execution" data-componentid={ componentId }>
            <Handle
                type="target"
                id={ `${id}${VisualFlowConstants.FLOW_BUILDER_PREVIOUS_HANDLE_SUFFIX}` }
                position={ Position.Left }
            />
            <Box className="flow-builder-execution-content">
                <Typography variant="body2" className="flow-builder-execution-id">
                    { label }
                </Typography>
            </Box>
            <Handle
                type="source"
                id={ `${id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
                position={ Position.Right }
            />
        </div>
    );
};

export default Execution;
