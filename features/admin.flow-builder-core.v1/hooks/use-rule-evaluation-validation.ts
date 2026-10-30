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

import { Edge, Node, useEdges } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";
import useValidationStatus from "./use-validation-status";
import VisualFlowConstants from "../constants/visual-flow-constants";
import { Action, Branch } from "../models/elements";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../models/resources";
import { isRuleComplete } from "../utils/rule-expression";

/**
 * Reports the branches of a rule evaluation step whose conditions are not filled in or that lead nowhere,
 * and a step left with only its default branch.
 *
 * @param node - The rule evaluation step.
 */
const useRuleEvaluationValidation = (node: Pick<Node, "data" | "type" | "id">): void => {
    const { t } = useTranslation();
    const { ruleMetadata } = useAuthenticationFlowBuilderCore();
    const { addNotification, removeNotification } = useValidationStatus();
    const edges: Edge[] = useEdges();

    const notificationId: string = `rule-evaluation-incomplete-${node?.id}`;
    const noConditionalBranchNotificationId: string = `rule-evaluation-no-conditional-branch-${node?.id}`;
    const unconnectedNotificationId: string = `rule-evaluation-unconnected-${node?.id}`;

    const incompleteBranchNames: string[] = useMemo((): string[] =>
        (((node?.data?.action as Action)?.branches ?? []) as Branch[])
            .filter((branch: Branch) => !isRuleComplete(branch.rule, ruleMetadata?.ruleMetaData))
            .map((branch: Branch) => branch.name || branch.id),
    [ node?.data?.action, ruleMetadata?.ruleMetaData ]);

    // A branch leads where the canvas edge hung off its port goes. Without one, the branch is saved with nowhere
    // to go.
    const unconnectedBranchNames: string[] = useMemo((): string[] =>
        (((node?.data?.action as Action)?.branches ?? []) as Branch[])
            .filter((branch: Branch) => !edges.some((edge: Edge) => edge.source === node?.id
                && edge.sourceHandle === `${branch.id}${VisualFlowConstants.FLOW_BUILDER_NEXT_HANDLE_SUFFIX}`))
            .map((branch: Branch) => branch.name || branch.id),
    [ node?.data?.action, node?.id, edges ]);

    const hasConditionalBranch: boolean = useMemo((): boolean =>
        (((node?.data?.action as Action)?.branches ?? []) as Branch[]).some((branch: Branch) => !!branch.rule),
    [ node?.data?.action ]);

    useEffect(() => {
        removeNotification(noConditionalBranchNotificationId);

        if (!node || hasConditionalBranch) {
            return;
        }

        const notification: Notification = new Notification(
            noConditionalBranchNotificationId,
            t("flows:core.validation.ruleEvaluation.noConditionalBranch"),
            NotificationType.ERROR
        );

        notification.addResource((node as unknown) as Resource);
        addNotification(notification);
    }, [ hasConditionalBranch, node?.id ]);

    useEffect(() => {
        removeNotification(notificationId);

        if (!node || incompleteBranchNames.length === 0) {
            return;
        }

        const notification: Notification = new Notification(
            notificationId,
            t("flows:core.validation.ruleEvaluation.incompleteRules", {
                branches: incompleteBranchNames.join(", ")
            }),
            NotificationType.ERROR
        );

        notification.addResource((node as unknown) as Resource);
        addNotification(notification);
    }, [ incompleteBranchNames.join("\u0000"), node?.id ]);

    useEffect(() => {
        removeNotification(unconnectedNotificationId);

        if (!node || unconnectedBranchNames.length === 0) {
            return;
        }

        const notification: Notification = new Notification(
            unconnectedNotificationId,
            t("flows:core.validation.ruleEvaluation.unconnectedBranches", {
                branches: unconnectedBranchNames.join(", ")
            }),
            NotificationType.ERROR
        );

        notification.addResource((node as unknown) as Resource);
        addNotification(notification);
    }, [ unconnectedBranchNames.join("\u0000"), node?.id ]);

    useEffect(() => () => {
        removeNotification(notificationId);
        removeNotification(noConditionalBranchNotificationId);
        removeNotification(unconnectedNotificationId);
    }, []);
};

export default useRuleEvaluationValidation;
