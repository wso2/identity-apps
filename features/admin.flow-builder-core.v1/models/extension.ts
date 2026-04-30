/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Enum for event types in the flow builder extension.
 */
export enum EventTypes {
    ON_NODE_DELETE = "onNodeDelete",
    ON_EDGE_DELETE = "onEdgeDelete",
    ON_NODE_ELEMENT_DELETE = "onNodeElementDelete",
    ON_PROPERTY_PANEL_OPEN = "onPropertyPanelOpen",
    ON_PROPERTY_CHANGE = "onPropertyChange",
    ON_NODE_ELEMENT_RENDER = "onNodeElementRender",
    ON_NODE_ELEMENT_FILTER = "onNodeElementFilter",
    ON_TEMPLATE_LOAD = "onTemplateLoad"
}
