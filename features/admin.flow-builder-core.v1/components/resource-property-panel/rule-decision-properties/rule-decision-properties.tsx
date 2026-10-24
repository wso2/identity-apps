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
import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    GridDotsVerticalIcon,
    PlusIcon,
    TrashIcon
} from "@oxygen-ui/react-icons";
import RulesComponent from "@wso2is/admin.rules.v1/components/rules-component";
import { ConditionExpressionsMetaDataInterface } from "@wso2is/admin.rules.v1/models/meta";
import { RuleWithoutIdInterface } from "@wso2is/admin.rules.v1/models/rules";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Edge, Node, useEdges, useNodesData, useReactFlow } from "@xyflow/react";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import "./rule-decision-properties.scss";
import FlowConstants from "../../../constants/flow-constants";
import VisualFlowConstants from "../../../constants/visual-flow-constants";
import Handle from "../../dnd/handle";
import Sortable from "../../dnd/sortable";
import useAuthenticationFlowBuilderCore from "../../../hooks/use-authentication-flow-builder-core-context";
import { Action, Branch } from "../../../models/elements";
import { BranchRuleInterface } from "../../../models/rule-expression";
import { Resource } from "../../../models/resources";
import {
    addBranch,
    deriveBranchName,
    newBranch,
    removeBranch,
    renameBranch,
    setBranchRule
} from "../../../utils/branch-operations";
import {
    fromEditorRule,
    isRuleComplete,
    toEditorRule,
    toEditorMetadata
} from "../../../utils/rule-expression";
import { DEFAULT_BRANCH_NAME } from "../../../utils/seed-rule-decision-branches";

/**
 * Props interface of {@link RuleDecisionProperties}
 */
interface RuleDecisionPropertiesPropsInterface extends IdentifiableComponentInterface {
    /**
     * The rule decision step being configured.
     */
    resource: Resource;
}

/**
 * Props interface of {@link BranchRow}
 */
interface BranchRowPropsInterface extends IdentifiableComponentInterface {
    /**
     * The branch shown in the row.
     */
    branch: Branch;
    /**
     * Position in the evaluation order, or null for the default branch.
     */
    index: number | null;
    /**
     * ID of the decision step the branch belongs to.
     */
    stepId: string;
    /**
     * Where this branch leads, already rendered.
     */
    target: ReactElement;
    /**
     * Whether a condition of the branch is not filled in, which blocks publishing.
     */
    incomplete?: boolean;
    /**
     * Opens this branch in the panel, where it is named and, unless it is the default, given conditions.
     */
    onOpen: () => void;
}

/**
 * One row of the branch list.
 *
 * @param props - Props injected to the component.
 * @returns The branch row.
 */
const BranchRow: FunctionComponent<BranchRowPropsInterface> = ({
    ["data-componentid"]: componentId = "rule-decision-branch-row",
    branch,
    index,
    stepId,
    target,
    incomplete,
    onOpen
}: BranchRowPropsInterface): ReactElement => {
    const handleRef: MutableRefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null);
    const isDefault: boolean = index === null;
    // Read the way the branches are tried: the first that holds wins, and the default catches the rest.
    const keyword: string = isDefault ? "ELSE" : index === 0 ? "IF" : "ELSE IF";

    const body: ReactElement = (
        <Box>
            <Typography
                variant="caption"
                className="rule-decision-row-keyword"
                data-componentid={ `${componentId}-keyword` }
            >
                { keyword }
            </Typography>
            <Box
                className={ isDefault ? "rule-decision-row rule-decision-row-default" : "rule-decision-row" }
                data-componentid={ componentId }
            >
                <Stack direction="row" alignItems="center" spacing={ 1 }>
                    { !isDefault && (
                        <Handle label="Reorder" cursor="grab" ref={ handleRef }>
                            <GridDotsVerticalIcon size={ 14 } />
                        </Handle>
                    ) }
                    <Typography
                        variant="body2"
                        className={
                            branch.name
                                ? "rule-decision-row-name"
                                : "rule-decision-row-name rule-decision-row-name-unset"
                        }
                        noWrap
                    >
                        { branch.name || "Untitled branch" }
                    </Typography>
                    <Tooltip title={ isDefault ? "Edit branch" : "Edit conditions" }>
                        <IconButton
                            size="small"
                            onClick={ onOpen }
                            data-componentid={ `${componentId}-open` }
                        >
                            <ChevronRightIcon size={ 14 } />
                        </IconButton>
                    </Tooltip>
                </Stack>
                { target }
                { incomplete && (
                    <Typography
                        variant="caption"
                        className="rule-decision-branch-target rule-decision-branch-target-empty"
                        data-componentid={ `${componentId}-incomplete` }
                    >
                        Incomplete condition: each one needs a field, an operator and a value
                    </Typography>
                ) }
            </Box>
        </Box>
    );

    if (isDefault) {
        return body;
    }

    return (
        <Sortable
            id={ branch.id }
            index={ index }
            handleRef={ handleRef }
            data={ { isBranchReordering: true, stepId } }
            type={ VisualFlowConstants.FLOW_BUILDER_BRANCH_DRAGGABLE_ID }
            accept={ [ VisualFlowConstants.FLOW_BUILDER_BRANCH_DRAGGABLE_ID ] }
            data-componentid={ `${componentId}-sortable` }
        >
            { body }
        </Sortable>
    );
};

/**
 * Branch configuration for a rule decision step.
 *
 * @param props - Props injected to the component.
 * @returns The RuleDecisionProperties component.
 */
const RuleDecisionProperties: FunctionComponent<RuleDecisionPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "rule-decision-properties"
}: RuleDecisionPropertiesPropsInterface): ReactElement => {
    const stepId: string = resource?.id;
    const node: Pick<Node, "data" | "type" | "id"> = useNodesData(stepId);
    const edges: Edge[] = useEdges();
    const { setEdges, updateNodeData } = useReactFlow();
    const {
        ruleMetadata,
        ruleLimits,
        setIsResourcePropertiesPanelFooterHidden,
        setLastInteractedResource,
        setResourcePropertiesPanelHeading
    } = useAuthenticationFlowBuilderCore();

    // The editor reads the shared branch metadata shape, which the flow's own metadata is mapped onto.
    const ruleMetaData: ConditionExpressionsMetaDataInterface = useMemo(
        (): ConditionExpressionsMetaDataInterface => toEditorMetadata(ruleMetadata?.ruleMetaData),
        [ ruleMetadata?.ruleMetaData ]
    );

    const [ openBranchId, setOpenBranchId ] = useState<string>(null);

    const branches: Branch[] = ((node?.data?.action as Action)?.branches ?? []) as Branch[];

    useEffect(() => {
        // The property panel is permanent and only hidden, so it is never unmounted between one step
        // and the next. Without this, selecting a second decision would open it on whichever branch
        // was left open on the first.
        setOpenBranchId(null);
    }, [ stepId ]);

    const openBranch: Branch = branches.find((branch: Branch) => branch.id === openBranchId);

    // Remembers that this panel took the header over, so that it is only handed back when returning
    // from a branch rather than on every render that has none open.
    const hasTakenHeader: MutableRefObject<boolean> = useRef<boolean>(false);

    useEffect(() => {
        // While a branch is open the panel is about that branch: its header carries the way back and
        // its footer is the branch's own, so the step's footer actions are put away.
        if (openBranch) {
            hasTakenHeader.current = true;
            setIsResourcePropertiesPanelFooterHidden(true);
            setResourcePropertiesPanelHeading(
                <Stack direction="row" gap={ 1 } alignItems="center" className="sub-title">
                    <Tooltip title="Back to branches">
                        <IconButton size="small" onClick={ () => setOpenBranchId(null) }>
                            <ChevronLeftIcon size={ 16 } />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h6">{ openBranch.name || "Untitled branch" }</Typography>
                </Stack>
            );

            return;
        }

        setIsResourcePropertiesPanelFooterHidden(false);

        if (hasTakenHeader.current) {
            hasTakenHeader.current = false;
            // Rebuilds the step's own heading rather than reproducing it here, so the two cannot drift.
            setLastInteractedResource(resource);
        }
    }, [ openBranch?.id, openBranch?.name ]);

    useEffect(() => () => {
        // The panel outlives this component, so the footer is restored on the way out.
        setIsResourcePropertiesPanelFooterHidden(false);
    }, []);

    /**
     * Writes a new branch list onto the step.
     *
     * @param transform - Produces the new branch list from the current one.
     */
    const updateBranches = (transform: (current: Branch[]) => Branch[]): void => {
        updateNodeData(stepId, (currentNode: any) => {
            const action: Action = (currentNode?.data?.action ?? {}) as Action;

            return {
                action: {
                    ...action,
                    branches: transform((action.branches ?? []) as Branch[])
                }
            };
        });
    };

    const handleAddBranch = (): void => {
        // Built here rather than inside the update so that the new branch can be opened straight
        // away: a branch is added in order to give it conditions.
        const added: Branch = newBranch(branches);

        updateBranches((current: Branch[]) => addBranch(current, added));
        setOpenBranchId(added.id);
    };

    const handleRemoveBranch = (branchId: string): void => {
        if (openBranchId === branchId) {
            setOpenBranchId(null);
        }
        updateBranches((current: Branch[]) => removeBranch(current, branchId));

        // The branch's port goes with it, so an edge left hanging off it would point from nowhere.
        const handleId: string = `${branchId}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`;

        setEdges((current: Edge[]) =>
            current.filter((edge: Edge) => !(edge.source === stepId && edge.sourceHandle === handleId)));
    };

    const handleRenameBranch = (branchId: string, name: string): void => {
        updateBranches((current: Branch[]) => renameBranch(current, branchId, name));
    };

    const handleRuleChange = (branchId: string, rule: BranchRuleInterface): void => {
        updateBranches((current: Branch[]) => setBranchRule(current, branchId, rule));
    };

    /**
     * Whether a branch leads anywhere, by looking for the canvas edge hung off its port.
     *
     * @param branchId - The branch to check.
     * @returns Whether an edge leaves this branch's port.
     */
    const isConnected = (branchId: string): boolean => {
        const handleId: string = `${branchId}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`;

        return edges.some((candidate: Edge) => candidate.sourceHandle === handleId);
    };

    /**
     * Renders the warning for a branch that leads nowhere, and nothing for one that does.
     *
     * @param branchId - The branch to describe.
     * @returns The warning, or null.
     */
    const renderTarget = (branchId: string): ReactElement => {
        if (isConnected(branchId)) {
            return null;
        }

        return (
            <Typography variant="caption" className="rule-decision-branch-target-empty">
                Not connected — drag from this branch's port on the canvas
            </Typography>
        );
    };

    const conditionalBranches: Branch[] = branches.filter((branch: Branch) => branch.rule);
    const defaultBranch: Branch = branches.find((branch: Branch) => !branch.rule);

    if (openBranch) {
        // The default has no conditions and cannot be removed: it is what happens when no other branch holds.
        const isDefaultOpen: boolean = openBranch === defaultBranch;

        return (
            <Stack gap={ 2 } data-componentid={ `${componentId}-detail` } className="rule-decision-properties">
                <TextField
                    size="small"
                    fullWidth
                    label="Name"
                    value={ openBranch.name ?? "" }
                    placeholder="Name this branch"
                    onChange={ (event: React.ChangeEvent<HTMLInputElement>) =>
                        handleRenameBranch(openBranch.id, event.target.value) }
                    onBlur={ () => {
                        // The server rejects a branch without a name, so an emptied one is given
                        // back what its condition says, or its place in the list.
                        if (!openBranch.name?.trim()) {
                            handleRenameBranch(openBranch.id, isDefaultOpen
                                ? DEFAULT_BRANCH_NAME
                                : deriveBranchName(openBranch.rule)
                                    ?? `Branch ${conditionalBranches.indexOf(openBranch) + 1}`);
                        }
                    } }
                    data-componentid={ `${componentId}-detail-name` }
                />
                { isDefaultOpen ? (
                    <Typography variant="body2">
                        Taken when none of the branches above hold.
                    </Typography>
                ) : ruleMetaData ? (
                    <RulesComponent
                        // The editor takes its data once, so it is remounted for each branch opened.
                        key={ openBranch.id }
                        initialData={ toEditorRule(openBranch.rule) }
                        conditionExpressionsMetaData={ ruleMetaData }
                        isMultipleRules={ false }
                        limits={ {
                            maxExpressionsCombinedWithAnd: ruleLimits?.maxExpressionsCombinedWithAnd
                                ?? FlowConstants.DEFAULT_MAX_EXPRESSIONS_COMBINED_WITH_AND,
                            maxRulesCombinedWithOr: ruleLimits?.maxRulesCombinedWithOr
                                ?? FlowConstants.DEFAULT_MAX_RULES_COMBINED_WITH_OR
                        } }
                        executeText="Navigate"
                        onChange={ (editorRule: RuleWithoutIdInterface) =>
                            handleRuleChange(openBranch.id, fromEditorRule(editorRule)) }
                        data-componentid={ `${componentId}-detail-branch` }
                    />
                ) : (
                    <Typography variant="caption" className="rule-decision-branch-target-empty">
                        Conditions cannot be edited: this flow published no branch metadata.
                    </Typography>
                ) }
                { renderTarget(openBranch.id) }
                { !isDefaultOpen && (
                    <Box display="flex" justifyContent="flex-end">
                        <Tooltip title="Delete branch">
                            <Button
                                variant="outlined"
                                color="error"
                                className="flow-builder-right-panel footer-secondary-action icon-button"
                                onClick={ () => handleRemoveBranch(openBranch.id) }
                                data-componentid={ `${componentId}-detail-remove` }
                            >
                                <TrashIcon size={ 14 } />
                            </Button>
                        </Tooltip>
                    </Box>
                ) }
            </Stack>
        );
    }

    return (
        <Stack gap={ 2 } data-componentid={ componentId } className="rule-decision-properties">
            <TextField
                size="small"
                fullWidth
                label="Id"
                value={ stepId ?? "" }
                InputProps={ { readOnly: true } }
                data-componentid={ `${componentId}-step-id` }
            />
            <Typography variant="body2">
                Branches are tried from the top. The first whose conditions hold decides where the flow goes
                next, and the last branch is taken when none of them do.
            </Typography>
            { conditionalBranches.map((branch: Branch, index: number) => (
                <BranchRow
                    key={ branch.id }
                    branch={ branch }
                    index={ index }
                    stepId={ stepId }
                    target={ renderTarget(branch.id) }
                    incomplete={ !isRuleComplete(branch.rule, ruleMetadata?.ruleMetaData) }
                    onOpen={ () => setOpenBranchId(branch.id) }
                    data-componentid={ `${componentId}-branch-${branch.id}` }
                />
            )) }
            { defaultBranch && (
                <BranchRow
                    key={ defaultBranch.id }
                    branch={ defaultBranch }
                    index={ null }
                    stepId={ stepId }
                    target={ renderTarget(defaultBranch.id) }
                    onOpen={ () => setOpenBranchId(defaultBranch.id) }
                    data-componentid={ `${componentId}-branch-${defaultBranch.id}` }
                />
            ) }
            <Box>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={ <PlusIcon size={ 14 } /> }
                    onClick={ handleAddBranch }
                    data-componentid={ `${componentId}-add-branch` }
                >
                    New branch
                </Button>
            </Box>
        </Stack>
    );
};

export default RuleDecisionProperties;
