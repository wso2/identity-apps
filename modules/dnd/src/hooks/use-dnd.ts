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

import { useContext } from "react";
import DnDContext, { DnDContextProps } from "../context/dnd-context";

/**
 * Props interface of {@link useDnD}
 */
export type useDnDInterface = DnDContextProps;

/**
 * Hook that provides Drag & Drop context.
 *
 * This hook allows elements to access drag-and-drop related data and functions
 * provided by the Drag & Drop context. It returns an object containing
 * the context values defined in the Drag & Drop context.
 *
 * @returns An object containing the context values of the Drag & Drop context.
 *
 * @throws Will throw an error if the hook is used outside of a Drag & Drop provider.
 *
 * @example
 * ```tsx
 * const { node, setNode } = useDnD();
 *
 * useEffect(() => {
 *     // Perform drag-and-drop related operations
 * }, []);
 * ```
 */
const useDnD = (): useDnDInterface => {
    const context: DnDContextProps = useContext(DnDContext);

    if (context === undefined) {
        throw new Error("useDnD must be used within a DnDProvider");
    }

    return context;
};

export default useDnD;
