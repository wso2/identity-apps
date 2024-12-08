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
 * Props interface of {@link DnDContext}
 */
export type DnDContextProps = {
    /**
     * Utility function to generate a unique component ID.
     */
    generateComponentId:  (prefix?: string) => string;
    /**
     * Node object.
     */
    node: any | null;
    /**
     * Setter for the node object.
     * @param node - Node object.
     */
    setNode: (node: any) => void;
};

/**
 * Context object for managing the Drag & Drop context.
 */
const DnDContext: Context<DnDContextProps> = createContext<null | DnDContextProps>({
    generateComponentId: () => "",
    node: null,
    setNode: (_: any) => {}
});

DnDContext.displayName = "DnDContext";

export default DnDContext;
