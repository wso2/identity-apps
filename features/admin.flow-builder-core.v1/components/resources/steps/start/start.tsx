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

import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { GearIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, Position, useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import useVariablesValidation from "../../../../hooks/use-variables-validation";
import { Base } from "../../../../models/base";
import { StaticStepTypes } from "../../../../models/steps";
import { FlowVariableInterface, FlowVariablesInterface } from "../../../../models/variables";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import "./start.scss";

/**
 * Props interface of {@link Start}
 */
type StartPropsInterface = CommonStepFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * The kinds of variables the start node lists, in the order they are shown.
 */
const VARIABLE_KINDS: (keyof FlowVariablesInterface)[] = [ "headers", "runtimeValues" ];

/**
 * Colour of the start node's heading, as the start node had before it listed the variables.
 */
const HEADING_COLOR: string = "#63a9f3";

/**
 * Start Node component. It shows the names of the variables the flow defines, and opens the property panel where
 * they are defined.
 * This is a custom node supported by react flow renderer library.
 * See {@link https://reactflow.dev/docs/api/node-types/} for its documentation
 * and {@link https://reactflow.dev/examples/custom-node/} for an example
 *
 * @param props - Props injected to the component.
 * @returns Start node component.
 */
const Start: FunctionComponent = ({
    ["data-componentid"]: componentId = "start"
}: StartPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const nodeId: string = useNodeId();
    const node: Pick<Node, "data" | "type" | "id"> = useNodesData(nodeId);
    const { getNode } = useReactFlow();
    const { setLastInteractedResource, setLastInteractedStepId } = useAuthenticationFlowBuilderCore();

    useVariablesValidation(node);

    const variables: FlowVariablesInterface = (node?.data?.variables ?? {}) as FlowVariablesInterface;

    /**
     * Opens the property panel, where the variables of the flow are defined.
     */
    const handleOpenProperties = (): void => {
        const step: Node = getNode(nodeId);

        setLastInteractedStepId(nodeId);
        setLastInteractedResource({ ...step, ...(step?.data ?? {}), id: nodeId } as unknown as Base);
    };

    return (
        <div
            className="flow-builder-step flow-builder-start-step"
            style={ { background: HEADING_COLOR } }
            data-componentid={ componentId }
        >
            <Box display="flex" justifyContent="space-between" className="flow-builder-step-action-panel">
                <Typography
                    variant="body2"
                    className="flow-builder-step-id"
                    data-componentid={ `${componentId}-heading-text` }
                >
                    { t("flows:core.steps.start.node.heading", "Start") }
                </Typography>
                <Tooltip title={ t("flows:core.steps.start.node.configure", "Configure flow variables") }>
                    <IconButton
                        size="small"
                        aria-label={ t("flows:core.steps.start.node.configure", "Configure flow variables") }
                        onClick={ handleOpenProperties }
                        className="flow-builder-step-action"
                        data-componentid={ `${componentId}-configure` }
                    >
                        <GearIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Paper
                className="flow-builder-start-step-content"
                elevation={ 0 }
                sx={ { display: "flex", flexDirection: "column", gap: 1.5, px: 1.75, py: 1.5, width: 220 } }
            >
                { VARIABLE_KINDS.map((kind: keyof FlowVariablesInterface) => {
                    const names: string[] = (variables[ kind ] ?? [])
                        .map((variable: FlowVariableInterface) => variable?.name?.trim())
                        .filter(Boolean);

                    return (
                        <Box
                            key={ kind }
                            className="flow-builder-start-step-section"
                            data-componentid={ `${componentId}-${kind}` }
                        >
                            <Typography
                                variant="body2"
                                className="flow-builder-start-step-section-title"
                                sx={ { fontWeight: 500, mb: 0.5 } }
                            >
                                { t(`flows:core.steps.start.variables.tabs.${kind}`) }
                            </Typography>
                            { names.length > 0
                                ? names.map((name: string, index: number) => (
                                    <Typography
                                        key={ `${name}-${index}` }
                                        variant="body2"
                                        className="flow-builder-start-step-name"
                                    >
                                        { name }
                                    </Typography>
                                ))
                                : (
                                    <Typography variant="body2" color="text.secondary">
                                        { t("flows:core.steps.start.node.none", "None") }
                                    </Typography>
                                ) }
                        </Box>
                    );
                }) }
            </Paper>
            <Handle
                className="hidden-handle"
                id={ `${StaticStepTypes.Start.toLowerCase()}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
                type="source"
                position={ Position.Right }
            />
        </div>
    );
};

export default Start;
