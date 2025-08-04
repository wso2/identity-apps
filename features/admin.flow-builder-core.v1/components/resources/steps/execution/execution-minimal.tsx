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

import { Theme, useTheme } from "@mui/material/styles";
import Card from "@oxygen-ui/react/Card";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Position } from "@xyflow/react";
import React, { FC, ReactElement } from "react";
import ExecutionFactory from "./execution-factory";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";

/**
 * Props interface of {@link ExecutionMinimal}
 */
export type ExecutionMinimalPropsInterface = Pick<CommonStepFactoryPropsInterface, "id" | "data" | "resource"> &
    IdentifiableComponentInterface;

/**
 * Execution (Minimal) Node component.
 *
 * @param props - Props injected to the component.
 * @returns Execution (Minimal) node component.
 */
const ExecutionMinimal: FC<ExecutionMinimalPropsInterface> = ({
    id,
    data,
    resource,
    ["data-componentid"]: componentId = "minimal-execution"
}: ExecutionMinimalPropsInterface): ReactElement => {
    const { setLastInteractedResource, setLastInteractedStepId } = useAuthenticationFlowBuilderCore();
    const theme: Theme = useTheme();

    return (
        <Card
            data-componentid={ componentId }
            sx={ {
                backgroundColor: (theme as any).colorSchemes.dark.palette.background.default,
                color: (theme as any).colorSchemes.dark.palette.text.primary
            } }
            onClick={ () => {
                setLastInteractedStepId(id);
                setLastInteractedResource(resource);
            } }
        >
            <Handle
                type="target"
                id={ `${id}${VisualFlowConstants.FLOW_BUILDER_PREVIOUS_HANDLE_SUFFIX}` }
                position={ Position.Left }
            />
            <ExecutionFactory data={ data } />
            <Handle
                type="source"
                id={ `${id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
                position={ Position.Right }
            />
        </Card>
    );
};

export default ExecutionMinimal;
