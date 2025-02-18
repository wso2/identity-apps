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

import { Resource } from "../models/resources";

/**
 * Checks if the given resource is a widget.
 *
 * A widget is identified by the presence of a `flow` property in its configuration.
 *
 * @param resource - The resource to check.
 * @returns True if the resource is a widget, otherwise false.
 *
 * @example
 * const result = isWidget(resource);
 * console.log(result); // true
 */
const isWidget = (resource: Resource): boolean => {
    return resource?.config?.flow;
};

export default isWidget;
