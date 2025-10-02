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
import Card from "@oxygen-ui/react/Card";
import IconButton from "@oxygen-ui/react/IconButton";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { GearIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Position, useNodeId } from "@xyflow/react";
import React, { FC, MouseEvent, ReactElement } from "react";
import ExecutionFactory from "./execution-factory";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";

import "./execution-minimal.scss";

/**
 * Props interface of {@link ExecutionMinimal}
 */
export type ExecutionMinimalPropsInterface = Pick<CommonStepFactoryPropsInterface, "resource"> &
    IdentifiableComponentInterface;

/**
 * Execution (Minimal) Node component.
 *
 * @param props - Props injected to the component.
 * @returns Execution (Minimal) node component.
 */
const ExecutionMinimal: FC<ExecutionMinimalPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "minimal-execution"
}: ExecutionMinimalPropsInterface): ReactElement => {
    const { setLastInteractedResource, setLastInteractedStepId } = useAuthenticationFlowBuilderCore();
    const stepId: string = useNodeId();

    return (
        <div className="execution-minimal-step"  data-componentid={ componentId }>
            <Box
                display="flex"
                justifyContent="space-between"
                className="execution-minimal-step-action-panel"
            >
                <Tooltip
                    title={
                        // TODO: Add i18n
                        "Configure"
                    }
                >
                    <IconButton
                        size="small"
                        onClick={ (_: MouseEvent<HTMLButtonElement>) => {
                            setLastInteractedStepId(stepId);
                            setLastInteractedResource({
                                ...resource,
                                config: {
                                    ...(resource?.config || {}),
                                    ...((typeof resource.data?.config === "object" &&
                                        resource.data?.config !== null) ? resource.data.config : {})
                                }
                            });
                        } }
                        className="execution-minimal-step-action"
                    >
                        <GearIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Card
                data-componentid={ componentId }
                className="execution-minimal-step-content"
                onClick={ () => {
                    setLastInteractedStepId(resource.id);
                    setLastInteractedResource(resource);
                } }
            >
                <Handle
                    type="target"
                    id={ `${resource.id}${VisualFlowConstants.FLOW_BUILDER_PREVIOUS_HANDLE_SUFFIX}` }
                    position={ Position.Left }
                />
                <ExecutionFactory resource={ resource } />
                <Handle
                    type="source"
                    id={ `${resource.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
                    position={ Position.Right }
                />
            </Card>
        </div>
    );
};

export default ExecutionMinimal;
