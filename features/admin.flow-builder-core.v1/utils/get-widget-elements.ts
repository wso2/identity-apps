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
import { Widget } from "../models/widget";

/**
 * Retrieves the elements of a widget.
 *
 * A widget is identified by the presence of a `flow` property in its configuration.
 * This function returns the elements defined in the widget's flow configuration.
 *
 * @param widget - The widget to retrieve elements from.
 * @returns An array of elements if the widget has a flow configuration, otherwise an empty array.
 *
 * @example
 * const elements = getWidgetElements(widget); // Returns an array of elements.
 */
const getWidgetElements = (widget: Widget): Element[] => {
    return widget?.config?.flow?.elements;
};

export default getWidgetElements;
