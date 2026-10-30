/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
import { BranchRuleInterface } from "./rule-expression";

export interface Executor {
    name?: string;
    [ key: string ]: any;
}

/**
 * One outgoing branch of a rule decision step.
 */
export interface Branch {
    /**
     * Identifier for this branch, stable across saves. Doubles as the node's source handle id.
     */
    id: string;
    /**
     * Label shown on the canvas and cited in server validation messages.
     */
    name: string;
    /**
     * ID of the step taken when this branch is selected.
     */
    next?: string;
    /**
     * The rule under which this branch is taken, in the flow API's shape. Absent on the default branch.
     */
    rule?: BranchRuleInterface;
}

export interface Action {
    executor?: Executor;
    /**
     * Outgoing branches of a rule decision step, in evaluation order.
     */
    branches?: Branch[];
    [ key: string ]: any;
}

/**
 * Interface for a component.
 */
export interface Element<T = any> extends Base<T> {
    /**
     * Nested set of elements.
     * @remarks Some elements like `Form` can have nested elements.
     */
    components?: Element[];
    action?: Action;
};

export enum ElementCategories {
    Action = "ACTION",
    Display = "DISPLAY",
    Field = "FIELD"
}

export enum ElementTypes {
    Input = "INPUT",
    Button = "BUTTON",
    Captcha = "CAPTCHA",
    Policy = "POLICY",
    Preference = "PREFERENCE",
    Divider = "DIVIDER",
    Choice = "CHOICE",
    Image = "IMAGE",
    RichText = "RICH_TEXT",
    Typography = "TYPOGRAPHY",
    Resend = "RESEND",
}

export enum BlockTypes {
    Form = "FORM"
}

export enum InputVariants {
    Text = "TEXT",
    Password = "PASSWORD",
    Email = "EMAIL",
    Telephone = "TELEPHONE",
    Checkbox = "CHECKBOX",
    OTP = "OTP",
    Choice = "CHOICE",
    OrgHandler = "ORG_HANDLE"
}

export enum ButtonVariants {
    Primary = "PRIMARY",
    Secondary = "SECONDARY",
    Social = "SOCIAL",
    Text = "TEXT"
}

export enum ButtonTypes {
    Submit = "submit"
}

export enum TypographyVariants {
    H1 = "H1",
    H2 = "H2",
    H3 = "H3",
    H4 = "H4",
    H5 = "H5",
    H6 = "H6"
}

export enum DividerVariants {
    Horizontal = "HORIZONTAL",
    Vertical = "VERTICAL"
}
