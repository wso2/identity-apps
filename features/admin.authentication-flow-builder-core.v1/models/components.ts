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

/**
 * Interface for the properties of a block variant.
 */
export interface BlockVariantProperties {
    /**
     * Font size of the text.
     */
    fontSize?: string;
    /**
     * Color of the text.
     */
    color?: string;
    /**
     * Font weight of the text.
     */
    fontWeight?: string;
    /**
     * Text alignment.
     */
    textAlign?: string;
    /**
     * Text content.
     */
    text?: string;
    /**
     * Width of the element.
     */
    width?: string;
    /**
     * Height of the element.
     */
    height?: string;
    /**
     * Visibility of the element.
     */
    visibility?: string;
    /**
     * Border radius of the element.
     */
    borderRadius?: string;
    /**
     * Border of the element.
     */
    border?: string;
    /**
     * Padding of the element.
     */
    padding?: string;
}

/**
 * Interface for the properties of a field.
 */
export interface FieldProperties {
    /**
     * Border radius of the field.
     */
    borderRadius?: string;
    /**
     * Border of the field.
     */
    border?: string;
    /**
     * Padding of the field.
     */
    padding?: string;
    /**
     * Width of the field.
     */
    width?: string;
    /**
     * Height of the field.
     */
    height?: string;
    /**
     * Font size of the field text.
     */
    fontSize?: string;
    /**
     * Color of the field text.
     */
    color?: string;
    /**
     * Font weight of the field text.
     */
    fontWeight?: string;
    /**
     * Text alignment of the field text.
     */
    textAlign?: string;
}

/**
 * Interface for the properties of a widget.
 */
export interface WidgetProperties {
    /**
     * Version of the widget.
     */
    version?: string;
}

/**
 * Interface for a component.
 */
export interface Component<T = {}> {
    /**
     * ID of the component.
     */
    id: string;
    /**
     * Type of the node.
     */
    type: string;
    /**
     * Display name of the node.
     */
    displayName: string;
    /**
     * Image URL of the node.
     */
    image: string;
    /**
     * Properties of the widget.
     */
    properties?: T;
    /**
     *
     */
    Variants?: Component[];
}

export type Block = Component<BlockVariantProperties>;
export type Field = Component<FieldProperties>;
export type Widget = Component<WidgetProperties>;
export type Node = Component;

/**
 * Interface for the entire JSON structure.
 */
export interface Components {
    /**
     * List of blocks.
     */
    blocks: Block[];
    /**
     * List of fields.
     */
    fields: Field[];
    /**
     * List of widgets.
     */
    widgets: Widget[];
    /**
     * List of nodes.
     */
    nodes: Node[];
}
