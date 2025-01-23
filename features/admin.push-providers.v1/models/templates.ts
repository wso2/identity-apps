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

import { DynamicFormInterface } from "@wso2is/admin.template-core.v1/models/dynamic-fields";
import { PushProviderAPIInterface } from "./push-providers";
import { ExtensionTemplateCommonInterface } from "../../admin.template-core.v1/models/templates";

export interface PushProviderTemplateInterface extends ExtensionTemplateCommonInterface {
    /**
     * Create form payload parameters.
     */
    payload: PushProviderAPIInterface;
}

export interface PushProviderTemplateMetadataInterface {
    /**
     * Push provider edit related metadata.
     */
    edit?: {
        /**
         * Dynamic input fields should be rendered in the push provider edit wizard.
         */
        form?: DynamicFormInterface;
    };
}

export enum PushProviderTemplateFeatureStatus {
    NEW = "new"
}
