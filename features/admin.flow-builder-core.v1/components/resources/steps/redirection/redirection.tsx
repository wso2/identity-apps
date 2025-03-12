/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import { Handle, Position, useNodeId, useReactFlow } from "@xyflow/react";
import React, { FC, ReactElement, useMemo } from "react";
import RedirectionFactory from "./redirection-factory";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { Step } from "../../../../models/steps";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";

/**
 * Props interface of {@link Redirection}
 */
export type RedirectionPropsInterface = CommonStepFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * Redirection Node component.
 * This is a custom node supported by react flow renderer library.
 * See {@link https://reactflow.dev/docs/api/node-types/} for its documentation
 * and {@link https://reactflow.dev/examples/custom-node/} for an example
 *
 * @param props - Props injected to the component.
 * @returns Redirection node component.
 */
const Redirection: FC<RedirectionPropsInterface> = ({
    ["data-componentid"]: componentId = "done",
    id,
    ...rest
}: RedirectionPropsInterface): ReactElement => {
    const stepId: string = useNodeId();
    const { getNode } = useReactFlow();
    const { setLastInteractedResource, setLastInteractedStepId } = useAuthenticationFlowBuilderCore();
    const theme: Theme = useTheme();

    const redirection = useMemo(() => getNode(id), [ id, getNode ]);

    return (
        <Card
            data-componentid={ componentId }
            sx={ {
                backgroundColor: (theme as any).colorSchemes.dark.palette.background.default,
                color: (theme as any).colorSchemes.dark.palette.text.primary
            } }
            onClick={ () => {
                setLastInteractedStepId(stepId);
                setLastInteractedResource(redirection as Step);
            } }
        >
            <Handle
                type="target"
                id={ `${id}${VisualFlowConstants.FLOW_BUILDER_PREVIOUS_HANDLE_SUFFIX}` }
                position={ Position.Left }
            />
            <RedirectionFactory id={ id } resource={ redirection as Step } { ...rest } />
            <Handle
                type="source"
                id={ `${id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
                position={ Position.Right }
            />
        </Card>
    );
};

export default Redirection;
