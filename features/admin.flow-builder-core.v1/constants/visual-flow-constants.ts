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
}

export default VisualFlowConstants;
