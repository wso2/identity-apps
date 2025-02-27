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

import { Element } from "./elements";
import { Step } from "./steps";
import { Template } from "./templates";
import { Widget } from "./widget";

export interface ResourceDisplayOnlyMeta {
    /**
     * Type of the resource needed for visual editor operations.
     * @remarks This is a display only meta field and not being published to the backend.
     */
    resourceType?: ResourceTypes;
}

export type Resource = (Element | Step | Widget) & ResourceDisplayOnlyMeta;

export enum ResourceTypes {
    Step = "STEP",
    Element = "ELEMENT",
    Widget = "WIDGET"
}

/**
 * Interface for the entire JSON structure.
 */
export interface Resources {
    /**
     * List of blocks.
     */
    elements: Element[];
    /**
     * List of nodes.
     */
    steps: Step[];
    /**
     * List of widgets.
     */
    widgets: Widget[];
    /**
     * List of templates.
     */
    templates: Template[];
}
