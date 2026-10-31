/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
import {
    Handle,
    Node,
    Position,
    useNodeId,
    useNodesData,
    useReactFlow,
    useUpdateNodeInternals
} from "@xyflow/react";
import { UpdateNodeInternals } from "@xyflow/system";
import React, {
    DragEvent,
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useRef
} from "react";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import useRuleEvaluationValidation from "../../../../hooks/use-rule-evaluation-validation";
import { Base } from "../../../../models/base";
import { Action, Branch } from "../../../../models/elements";
import { DEFAULT_BRANCH_NAME } from "../../../../utils/seed-rule-decision-branches";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import "./rule.scss";

/**
 * Props interface of {@link Rule}
 */
type RulePropsInterface = CommonStepFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * Rule decision step, rendered as one labelled output port per branch.
 *
 * @param props - Props injected to the component.
 * @returns The Rule component.
 */
const Rule: FunctionComponent<RulePropsInterface> = ({
    data,
    "data-componentid": componentId = "rule"
}: RulePropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const node: Pick<Node, "data" | "type" | "id"> = useNodesData(nodeId);

    useRuleEvaluationValidation(node);
    const { getNode } = useReactFlow();
    const { setLastInteractedResource, setLastInteractedStepId } = useAuthenticationFlowBuilderCore();

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

    const branches: Branch[] = ((node?.data?.action as Action)?.branches ?? []) as Branch[];

    // A branch is the default exactly when it carries no rule, so nothing else has to mark it.
    const conditionalBranches: Branch[] = branches.filter((branch: Branch) => branch.rule);
    const defaultBranch: Branch = branches.find((branch: Branch) => !branch.rule);

    const updateNodeInternals: UpdateNodeInternals = useUpdateNodeInternals();
    const branchOrder: string = branches.map((branch: Branch) => branch.id).join(",");

    // Each edge hangs off its branch's own port, so it follows the branch when the order changes. React Flow
    // only caches where the ports were, though, so they are measured again once the rows have moved; otherwise
    // the lines stay drawn from the old positions and appear to connect the wrong branches.
    useEffect(() => {
        updateNodeInternals(nodeId);
    }, [ branchOrder ]);

    /**
     * Renders one branch row, with the source handle that carries its outgoing edge.
     *
     * @param branch - The branch to render.
     * @returns The branch row.
     */
    const renderBranch = (branch: Branch): ReactElement => (
        <div
            key={ branch.id }
            className={
                branch.rule
                    ? "flow-builder-rule-item"
                    : "flow-builder-rule-item flow-builder-rule-item-default"
            }
            data-componentid={ `${componentId}-branch-${branch.id}` }
        >
            <Typography variant="body2" className="flow-builder-rule-item-name" noWrap>
                { branch.name || (branch.rule ? "Untitled branch" : DEFAULT_BRANCH_NAME) }
            </Typography>
            <Handle
                type="source"
                position={ Position.Right }
                id={ `${branch.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}` }
            />
        </div>
    );

    /**
     * Opens the property panel for this step.
     */
    const handleOpenProperties = (): void => {
        const step: Node = getNode(nodeId);

        setLastInteractedStepId(nodeId);
        setLastInteractedResource({ ...step, ...(step?.data ?? {}), id: nodeId } as unknown as Base);
    };

    return (
        <div
            ref={ ref }
            className="flow-builder-step flow-builder-rule"
            data-componentid={ componentId }
            onDrop={ handleDrop }
            onDrag={ handleDragOver }
        >
            <Box
                display="flex"
                justifyContent="space-between"
                className="flow-builder-step-action-panel"
            >
                <Typography
                    variant="body2"
                    data-componentid={ `${componentId}-heading-text` }
                    className="flow-builder-step-id"
                >
                    Decision
                </Typography>
                <Tooltip title={ "Configure" }>
                    <IconButton
                        size="small"
                        onClick={ handleOpenProperties }
                        className="flow-builder-step-action"
                        data-componentid={ `${componentId}-configure-button` }
                    >
                        <GearIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Handle type="target" position={ Position.Left } />
            <Box className="flow-builder-step-content" data-componentid={ `${componentId}-inner` }>
                <Paper className="flow-builder-step-content-box" elevation={ 0 }>
                    <div className="flow-builder-rule-list" onClick={ handleOpenProperties }>
                        { conditionalBranches.map((branch: Branch) => renderBranch(branch)) }
                        { defaultBranch && renderBranch(defaultBranch) }
                    </div>
                </Paper>
            </Box>
        </div>
    );
};

export default Rule;
