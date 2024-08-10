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

import { Context, createContext } from "react";
import {
    CategorizedExtensionTemplatesInterface,
    ExtensionTemplateListInterface
} from "../models/templates";

/**
 * Props interface for ExtensionTemplatesContext.
 */
export interface ExtensionTemplatesContextProps {
    /**
     * Templates categorized by their `category`.
     */
    categorizedTemplates: CategorizedExtensionTemplatesInterface[];
    /**
     * Extension Templates.
     */
    templates: ExtensionTemplateListInterface[];
    /**
     * Flag to determine if the extension templates are being loaded.
     */
    isExtensionTemplatesRequestLoading: boolean;
}

/**
 * Context object for managing extension templates.
 */
const ExtensionTemplatesContext: Context<ExtensionTemplatesContextProps> =
  createContext<null | ExtensionTemplatesContextProps>(null);

/**
 * Display name for the ExtensionTemplatesContext.
 */
ExtensionTemplatesContext.displayName = "ExtensionTemplatesContext";

export default ExtensionTemplatesContext;
