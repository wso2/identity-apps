/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
 * Describes a single configurable meta property for an action executor.
 * Add entries to `actions.json` to expose new checkboxes — no component changes required.
 */
export interface ActionMetaConfigItemInterface {
    /**
     * The key written to `executor.meta` when the user toggles this option.
     */
    key: string;
    /**
     * Display label shown next to the checkbox.
     */
    label: string;
    /**
     * Short description rendered as helper text directly below the label.
     */
    description?: string;
    /**
     * Optional security or informational warning rendered below the description.
     */
    warning?: string;
    /**
     * Tooltip shown when this item is disabled. Explains why it is disabled / how to enable it.
     */
    disabledTooltip?: string;
    /**
     * Key of another meta item that must be enabled for this item to be interactive.
     * When the referenced item is unchecked, this checkbox is disabled and auto-cleared.
     * Items with this field are rendered indented (nested) under their parent.
     */
    dependsOn?: string;
}

/**
 * Describes a single action type within an action group, matching the shape in `actions.json`.
 */
export interface ActionTypeInterface {
    action: Record<string, unknown>;
    display: {
        label: string;
        image: string;
        defaultVariant?: string;
    };
    metaConfig?: ActionMetaConfigItemInterface[];
}

/**
 * Describes a group of related action types, matching the top-level shape in `actions.json`.
 */
export interface ActionGroupInterface {
    display?: {
        label?: string;
    };
    types: ActionTypeInterface[];
}
