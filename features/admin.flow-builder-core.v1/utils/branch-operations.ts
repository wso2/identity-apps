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

import { isValueLessOperator } from "@wso2is/admin.rules.v1/utils/operators";
import generateResourceId from "./generate-resource-id";

/**
 * Random characters in a branch id. A branch id keys the flow wide navigation map, so two branches sharing one would
 * overwrite each other's target; the default four characters collide too often across a flow's branches.
 */
export const BRANCH_ID_CHAR_COUNT: number = 10;
import { Branch } from "../models/elements";
import { AtomicConditionInterface, BranchRuleInterface } from "../models/rule-expression";

/**
 * Default label for the branch taken when no other branch holds.
 */
export const DEFAULT_BRANCH_NAME: string = "Default";

/**
 * Pattern of the placeholder a new branch is named with until it has a condition to be named from.
 */
const PLACEHOLDER_NAME_PATTERN: RegExp = /^Branch \d+$/;

/**
 * Builds an empty rule for a newly added branch.
 *
 * @returns An empty rule.
 */
const emptyRule = (): BranchRuleInterface => ({
    conditions: [
        {
            conditions: [ { field: { name: "" }, operator: "", value: { literal: "", type: "literal" } } ],
            operator: "AND"
        }
    ],
    operator: "OR"
});

/**
 * Builds a branch ready to be added.
 *
 * @param existing - The branches already on the step, so the placeholder is not reused.
 * @returns A new conditional branch.
 */
export const newBranch = (existing: Branch[] = []): Branch => {
    const taken: Set<string> = new Set(existing.map((branch: Branch) => branch.name));
    let position: number = existing.filter((branch: Branch) => branch.rule).length + 1;

    while (taken.has(`Branch ${position}`)) {
        position++;
    }

    return {
        id: generateResourceId("branch", BRANCH_ID_CHAR_COUNT),
        name: `Branch ${position}`,
        rule: emptyRule()
    };
};

/**
 * Reads a camel cased operator name as words, `notIn` as `not in`.
 *
 * @param operator - The operator name.
 * @returns The operator as words.
 */
const operatorAsWords = (operator: string): string =>
    operator.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

/**
 * Names a branch after its first condition, `country equals LK`, or `country is blank` for a check of
 * the field alone.
 *
 * @param rule - The branch's rule.
 * @returns The name, or undefined when there is no complete condition to name it from.
 */
export const deriveBranchName = (rule: BranchRuleInterface): string | undefined => {
    const condition: AtomicConditionInterface = rule?.conditions?.[0]?.conditions?.[0];

    if (!condition?.field?.name || !condition?.operator) {
        return undefined;
    }

    // A claim URI is shortened to its last segment, the part an author recognises.
    const lastSegment: (name: string, qualifier?: string) => string = (name: string, qualifier?: string): string =>
        qualifier ? qualifier.split(/[/#]/).filter(Boolean).pop() : name;

    if (isValueLessOperator(condition.operator)) {
        return `${lastSegment(condition.field.name, condition.field.qualifier)} ${
            operatorAsWords(condition.operator)}`;
    }

    let compared: string;

    if (condition.value?.type === "field") {
        compared = condition.value.field?.name
            ? lastSegment(condition.value.field.name, condition.value.field.qualifier)
            : undefined;
    } else {
        compared = Array.isArray(condition.value?.literal)
            ? condition.value.literal.join(", ")
            : condition.value?.literal;
    }

    if (!compared) {
        return undefined;
    }

    return `${lastSegment(condition.field.name, condition.field.qualifier)} ${operatorAsWords(condition.operator)} ${
        compared}`;
};

/**
 * Whether a branch still carries a name the console gave it, and so may be renamed from its rule.
 *
 * @param branch - The branch.
 * @returns true when the name is empty, the placeholder, or what its current branch derives.
 */
const hasGeneratedName = (branch: Branch): boolean =>
    !branch.name?.trim()
    || PLACEHOLDER_NAME_PATTERN.test(branch.name)
    || branch.name === deriveBranchName(branch.rule);

/**
 * Fills in any branch name left empty.
 *
 * @param branches - The branch list.
 * @returns The branches, each with a name.
 */
export const fillBranchNames = (branches: Branch[]): Branch[] =>
    branches.map((branch: Branch, index: number) => {
        if (branch.name?.trim()) {
            return branch;
        }

        return {
            ...branch,
            name: branch.rule ? (deriveBranchName(branch.rule) ?? `Branch ${index + 1}`) : DEFAULT_BRANCH_NAME
        };
    });

/**
 * Adds a branch, in front of the default.
 *
 * @param branches - The current branch list.
 * @param added    - The branch to add. Pass one built with {@link newBranch} to know its id up
 *                   front, so the caller can open what it just created.
 * @returns A new branch list.
 */
export const addBranch = (branches: Branch[], added: Branch = newBranch(branches)): Branch[] => {
    const defaultIndex: number = branches.findIndex((branch: Branch) => !branch.rule);

    if (defaultIndex < 0) {
        return [ ...branches, added ];
    }

    return [ ...branches.slice(0, defaultIndex), added, ...branches.slice(defaultIndex) ];
};

/**
 * Removes a branch.
 *
 * @param branches - The current branch list.
 * @param branchId - The branch to remove.
 * @returns A new branch list.
 */
export const removeBranch = (branches: Branch[], branchId: string): Branch[] =>
    branches.filter((branch: Branch) => branch.id !== branchId);

/**
 * Renames a branch.
 *
 * @param branches - The current branch list.
 * @param branchId - The branch to rename.
 * @param name     - The new name.
 * @returns A new branch list.
 */
export const renameBranch = (branches: Branch[], branchId: string, name: string): Branch[] =>
    branches.map((branch: Branch) => (branch.id === branchId ? { ...branch, name } : branch));

/**
 * Replaces a branch's rule.
 *
 * @param branches - The current branch list.
 * @param branchId   - The branch whose rule changed.
 * @param expression - The new expression.
 * @returns A new branch list.
 */
export const setBranchRule = (
    branches: Branch[],
    branchId: string,
    rule: BranchRuleInterface
): Branch[] =>
    branches.map((branch: Branch) => {
        if (branch.id !== branchId || !branch.rule || !rule) {
            return branch;
        }

        const name: string = hasGeneratedName(branch)
            ? (deriveBranchName(rule) ?? branch.name)
            : branch.name;

        return { ...branch, name, rule };
    });

/**
 * Applies a reordering to the branches that carry a rule, leaving the default last.
 *
 * @param branches - The current branch list.
 * @param reorder  - Reorders the conditional branches among themselves.
 * @returns A new branch list, with the default still last.
 */
export const reorderBranches = (
    branches: Branch[],
    reorder: (conditional: Branch[]) => Branch[]
): Branch[] => [
    ...reorder(branches.filter((branch: Branch) => branch.rule)),
    ...branches.filter((branch: Branch) => !branch.rule)
];
