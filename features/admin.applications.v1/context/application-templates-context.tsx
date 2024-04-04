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
    ApplicationTemplateListInterface,
    CategorizedApplicationTemplatesInterface
} from "../models/application-templates";

/**
 * Props interface for ApplicationTemplatesContext.
 */
export interface ApplicationTemplatesContextProps {
    /**
     * Templates categorized by their `category`.
     */
    categorizedTemplates: CategorizedApplicationTemplatesInterface;
    /**
     * Application Templates.
     */
    templates: ApplicationTemplateListInterface[];
    /**
     * Flag to determine if the application templates are being loaded.
     */
    isApplicationTemplatesRequestLoading: boolean;
}

/**
 * Context object for managing application templates.
 */
const ApplicationTemplatesContext: Context<ApplicationTemplatesContextProps> =
  createContext<null | ApplicationTemplatesContextProps>(null);

/**
 * Display name for the ApplicationTemplatesContext.
 */
ApplicationTemplatesContext.displayName = "ApplicationTemplatesContext";

export default ApplicationTemplatesContext;
