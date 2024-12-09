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

import React, { PropsWithChildren, ReactElement, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DnDContext from "../context/dnd-context";

/**
 * Props interface of {@link DnDProvider}
 */
export type DnDProviderProps = unknown;

/**
 * This component provides Drag & Drop context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The DnDProvider component.
 */
const DnDProvider = ({ children }: PropsWithChildren<DnDProviderProps>): ReactElement => {
    const [ node, setNode ] = useState<any>(null);

    /**
     * Generates a unique component ID for the node.
     * @returns Unique component ID.
     */
    const generateComponentId = (prefix: string = "node"): string => `dnd-${prefix}_${uuidv4()}`;

    return <DnDContext.Provider value={ { generateComponentId, node, setNode } }>{ children }</DnDContext.Provider>;
};

export default DnDProvider;
