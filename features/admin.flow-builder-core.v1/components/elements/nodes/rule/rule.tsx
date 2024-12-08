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
import Paper from "@oxygen-ui/react/Paper";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Handle, Node, Position, useNodeId, useReactFlow } from "@xyflow/react";
import React, {
    DragEvent,
    FunctionComponent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useRef
} from "react";
import "./rule.scss";

/**
 * Props interface of {@link Rule}
 */
export interface RulePropsInterface extends Node, IdentifiableComponentInterface {}

/**
 * Node for representing an empty step in the flow builder.
 *
 * @param props - Props injected to the component.
 * @returns Rule Node component.
 */
export const Rule: FunctionComponent<RulePropsInterface> = ({
    data,
    "data-componentid": componentId = "rule"
}: RulePropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const { deleteElements } = useReactFlow();

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

    return (
        <div
            ref={ ref }
            className="flow-builder-rule"
            data-componentid={ componentId }
            onDrop={ handleDrop }
            onDrag={ handleDragOver }
        >
            <Box display="flex" justifyContent="space-between" className="flow-builder-rule-action-panel">
                <Typography
                    variant="body2"
                    data-componentid={ `${componentId}-heading-text` }
                    className="flow-builder-rule-id"
                >
                    Rule
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
            <Handle type="target" position={ Position.Left } />
            <Box className="flow-builder-rule-content nodrag" data-componentid={ `${componentId}-inner` }>
                <Paper className="flow-builder-rule-content-box" elevation={ 0 } variant="outlined"></Paper>
            </Box>
            <Handle type="source" position={ Position.Right } id="a" />
        </div>
    );
};

export default Rule;
