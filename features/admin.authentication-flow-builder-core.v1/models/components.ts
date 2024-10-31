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

import { Base } from "./base";

/**
 * Interface for a component.
 */
export type Component<T = unknown> = Base<T>;

export type Display = Component;
export type Input = Component;
export type Widget = Component<WidgetExtendedConfig>;
export type Node = Component;

/**
 * Interface for the entire JSON structure.
 */
export interface Components {
    /**
     * List of blocks.
     */
    display: Display[];
    /**
     * List of fields.
     */
    inputs: Input[];
    /**
     * List of widgets.
     */
    widgets: Widget[];
    /**
     * List of nodes.
     */
    nodes: Node[];
}

/**
 * Interface for the properties of a widget.
 */
export interface WidgetExtendedConfig {
    /**
     * Version of the widget.
     */
    version?: string;
}
