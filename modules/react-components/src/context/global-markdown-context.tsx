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

/**
 * Props interface for GlobalMarkdownContext.
 */
export interface GlobalMarkdownContextProps {
    /**
     * When the navigation URL is relative, this function defines
     * how it should be handled.
     *
     * @param path - href value.
     */
    onHandleInternalUrl: (path: string) => void;
}

/**
 * Context object for managing global markdown props.
 */
const GlobalMarkdownContext: Context<GlobalMarkdownContextProps> =
  createContext<null | GlobalMarkdownContextProps>(null);

/**
 * Display name for the GlobalMarkdownContext.
 */
GlobalMarkdownContext.displayName = "GlobalMarkdownContext";

export default GlobalMarkdownContext;
