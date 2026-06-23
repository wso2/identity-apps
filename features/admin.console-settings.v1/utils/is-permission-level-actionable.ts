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

import getEligibilityScopeNames from "./get-eligibility-scope-names";
import {
    APIResourceCollectionInterface,
    APIResourceCollectionPermissionCategoryInterface,
    APIResourceCollectionPermissionScopeInterface
} from "../models/console-roles";

/**
 * The granular permission levels a collection can expose. `read` is always actionable; the rest are
 * gated by {@link isPermissionLevelActionable}.
 */
type GranularPermissionLevel = "read" | "create" | "update" | "delete";

/**
 * Flattens a collection's permission-category array into its backing scope names.
 */
const extractScopeNames = (
    categories: APIResourceCollectionPermissionCategoryInterface[] | undefined
): string[] =>
    (categories ?? []).flatMap(
        (category: APIResourceCollectionPermissionCategoryInterface) =>
            (category?.scopes ?? []).map(
                (scope: APIResourceCollectionPermissionScopeInterface) => scope.name)
    );

/**
 * Whether a create / update / delete level genuinely grants something beyond read — i.e. it has a
 * corresponding *action* scope.
 *
 * The meta API returns each level's bucket as a cumulative superset of `read`, so a create / update
 * / delete bucket is never empty just because its action carries no real capability: it still echoes
 * every read scope plus, at minimum, its own per-action **feature** scope
 * (`console:<feature>_create` / `_update` / `_delete`). That feature scope is persisted by the role
 * but the backend `ConsoleRoleListener` expands it to a management (`internal_*`) scope only when the
 * collection actually defines a `<Create>` / `<Update>` / `<Delete>` action — otherwise it resolves
 * to nothing. Such a cell looks interactive but granting it changes no real capability.
 *
 * A level is therefore "actionable" only when its scopes *beyond read*, after dropping the per-action
 * feature scopes (see {@link getEligibilityScopeNames}), still contain at least one scope — that
 * remaining scope is the action's real management scope. `read` is always actionable. Cells that are
 * not actionable are rendered read-only and excluded from every selection / scope-derivation path, so
 * they are never processed.
 *
 * Only meaningful in the granular console-permission model.
 *
 * @param collection - The API resource collection.
 * @param level - The permission level to test.
 * @returns `true` when the level grants a real capability beyond read.
 */
const isPermissionLevelActionable = (
    collection: APIResourceCollectionInterface,
    level: GranularPermissionLevel
): boolean => {
    if (level === "read") {
        return true;
    }

    const readScopeNames: Set<string> = new Set<string>(
        extractScopeNames(collection?.apiResources?.read));
    const marginalScopeNames: string[] = extractScopeNames(collection?.apiResources?.[level])
        .filter((name: string) => !readScopeNames.has(name));

    return getEligibilityScopeNames(marginalScopeNames).length > 0;
};

export default isPermissionLevelActionable;
