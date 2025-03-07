/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, Position, useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import React, {
    DragEvent,
    FunctionComponent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useRef
} from "react";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { Base } from "../../../../models/base";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import "./rule.scss";

/**
 * Props interface of {@link Rule}
 */
export type RulePropsInterface = CommonStepFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * Representation of an empty step in the flow builder.
 *
 * @param props - Props injected to the component.
 * @returns Rule component.
 */
export const Rule: FunctionComponent<RulePropsInterface> = ({
    data,
    "data-componentid": componentId = "rule"
}: RulePropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const node: Pick<Node, "data" | "type" | "id"> = useNodesData(nodeId);
    const { deleteElements } = useReactFlow();
    const { setLastInteractedResource } = useAuthenticationFlowBuilderCore();

    const ref: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const handleDragOver: (event: DragEvent) => void = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const handleDrop: (e: DragEvent) => void = useCallback(
        (event: DragEvent) => {
            event.preventDefault();
        },
        [ data?.type ]
    );

    const ruleStep: Base = { ...node.data, id: node.id } as Base;

    return (
        <div
            ref={ ref }
            className="flow-builder-rule"
            data-componentid={ componentId }
            onDrop={ handleDrop }
            onDrag={ handleDragOver }
        >
            <Handle type="target" position={ Position.Left } />
            <Box
                display="flex"
                justifyContent="space-between"
                className="flow-builder-rule-action-panel"
                onClick={ () => setLastInteractedResource(ruleStep) }
            >
                <Typography
                    variant="body2"
                    data-componentid={ `${componentId}-heading-text` }
                    className="flow-builder-rule-id"
                >
                    Conditional Rule
                </Typography>
                <Tooltip title={ "Remove" }>
                    <IconButton
                        size="small"
                        onClick={ (_: MouseEvent<HTMLButtonElement>) => {
                            deleteElements({ nodes: [ { id: nodeId } ] });
                        } }
                        className="flow-builder-rule-remove-button"
                    >
                        <XMarkIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Handle type="source" position={ Position.Right } id="a" />
        </div>
    );
};

export default Rule;
