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

import { Element } from "../models/elements";

/**
 * Checks if the given element is a widget.
 *
 * A widget is identified by the presence of a `flow` property in its configuration.
 *
 * @param element - The element to check.
 * @returns True if the element is a widget, otherwise false.
 *
 * @example
 * const result = isWidget(element);
 * console.log(result); // true
 */
const isWidget = (element: Element): boolean => {
    return element?.config?.flow;
};

export default isWidget;
