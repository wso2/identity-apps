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

const FEATURE_SCOPE_PREFIX: string = "console:";
const PER_ACTION_FEATURE_SCOPE_SUFFIXES: ReadonlyArray<string> = [ "_create", "_update", "_delete", "_edit" ];

/**
 * Whether a scope is a per-action Console feature scope (see {@link PER_ACTION_FEATURE_SCOPE_SUFFIXES}).
 */
const isPerActionFeatureScope = (scopeName: string): boolean =>
    scopeName.startsWith(FEATURE_SCOPE_PREFIX) &&
    PER_ACTION_FEATURE_SCOPE_SUFFIXES.some((suffix: string) => scopeName.endsWith(suffix));

/**
 * Reduces a level's backing scope names to the set that should decide whether that level is shown
 * checked — every scope except the per-action feature scopes. A level is then considered granted
 * when all of these "eligibility" scopes are present, so two levels that resolve to the same
 * management scopes (differing only by their per-action feature scope) select and clear together.
 *
 * Only meaningful in the granular console-permission model; the legacy read/write path must keep
 * evaluating the raw scope names.
 *
 * @param scopeNames - The full set of backing scope names for a permission level.
 * @returns The scope names to use for the granted/eligible check.
 */
const getEligibilityScopeNames = (scopeNames: string[]): string[] =>
    scopeNames.filter((name: string) => !isPerActionFeatureScope(name));

export default getEligibilityScopeNames;
