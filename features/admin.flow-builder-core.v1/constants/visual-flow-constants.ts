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

import { ActionTypes } from "../models/actions";
import { BlockTypes, ElementTypes } from "../models/elements";
import { ExecutionTypes, StepTypes } from "../models/steps";
import { TemplateTypes } from "../models/templates";
import { WidgetTypes } from "../models/widget";

class VisualFlowConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    public static readonly FLOW_BUILDER_CANVAS_ID: string = "flow-builder-canvas";
    public static readonly FLOW_BUILDER_VIEW_ID: string = "flow-builder-view";
    public static readonly FLOW_BUILDER_FORM_ID: string = "flow-builder-form";
    public static readonly FLOW_BUILDER_DRAGGABLE_ID: string = "flow-builder-draggable";
    public static readonly FLOW_BUILDER_DROPPABLE_CANVAS_ID: string = "flow-builder-droppable-canvas";
    public static readonly FLOW_BUILDER_DROPPABLE_VIEW_ID: string = "flow-builder-droppable-view";
    public static readonly FLOW_BUILDER_DROPPABLE_FORM_ID: string = "flow-builder-droppable-form";
    public static readonly FLOW_BUILDER_NEXT_HANDLE_SUFFIX: string = `_${ ActionTypes.Next }`;
    public static readonly FLOW_BUILDER_PREVIOUS_HANDLE_SUFFIX: string = `_${ ActionTypes.Previous }`;

    public static readonly FLOW_BUILDER_CANVAS_ALLOWED_RESOURCE_TYPES: string[] = [
        StepTypes.View,
        StepTypes.Rule,
        StepTypes.Execution,
        TemplateTypes.Basic,
        TemplateTypes.BasicFederated,
        TemplateTypes.Blank,
        TemplateTypes.BasicPasskey
    ];

    public static readonly FLOW_BUILDER_VIEW_ALLOWED_RESOURCE_TYPES: string[] = [
        BlockTypes.Form,
        ElementTypes.Button,
        ElementTypes.Typography,
        ElementTypes.RichText,
        ElementTypes.Divider,
        ElementTypes.Image,
        ElementTypes.Captcha,
        WidgetTypes.EmailOTP,
        WidgetTypes.GoogleFederation,
        WidgetTypes.IdentifierPassword,
        WidgetTypes.SMSOTP,
        WidgetTypes.AppleFederation,
        WidgetTypes.FacebookFederation,
        WidgetTypes.MicrosoftFederation,
        WidgetTypes.GithubFederation,
        WidgetTypes.PasskeyEnrollment,
        WidgetTypes.MagicLink
    ];

    public static readonly FLOW_BUILDER_FORM_ALLOWED_RESOURCE_TYPES: string[] = [
        ElementTypes.Input,
        ElementTypes.Button,
        ElementTypes.Typography,
        ElementTypes.RichText,
        ElementTypes.Divider,
        ElementTypes.Image
    ];

    public static readonly FLOW_BUILDER_STATIC_CONTENT_ALLOWED_RESOURCE_TYPES: string[] = [
        ElementTypes.Typography,
        ElementTypes.RichText,
        ElementTypes.Divider,
        ElementTypes.Image
    ];

    public static readonly FLOW_BUILDER_PLUGIN_FUNCTION_IDENTIFIER: string = "uniqueName";

    public static readonly FLOW_BUILDER_STATIC_CONTENT_ALLOWED_EXECUTION_TYPES: ExecutionTypes[] = [
        ExecutionTypes.MagicLinkExecutor
    ];
}

export default VisualFlowConstants;
