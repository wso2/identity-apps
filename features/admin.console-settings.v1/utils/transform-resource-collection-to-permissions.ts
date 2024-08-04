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

import {
    APIResourceCollectionPermissionCategoryInterface,
    APIResourceCollectionPermissionScopeInterface
} from "../models/console-roles";
import { PermissionScopeInterface } from "../models/permissions-ui";

/**
 * Transforms the API resource collection to permission scopes.
 *
 * @example
 * // returns `[{ value: "permission1" }, { value: "permission2" }]`
 * transformResourceCollectionToPermissions(resource);
 *
 * @param resource - API resource collection.
 * @returns Transformed permission scopes.
 */
const transformResourceCollectionToPermissions = (
    resource: APIResourceCollectionPermissionCategoryInterface[]
): PermissionScopeInterface[] => {
    return resource
        .map((resource: APIResourceCollectionPermissionCategoryInterface) =>
            resource.scopes.map((scope: APIResourceCollectionPermissionScopeInterface) => ({ value: scope.name }))
        )
        .reduce(
            (result: PermissionScopeInterface[], permissions: PermissionScopeInterface[]) => result.concat(permissions),
            []
        );
};

export default transformResourceCollectionToPermissions;
