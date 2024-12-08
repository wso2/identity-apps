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

import { Claim } from "@wso2is/core/models";
import { Context, Dispatch, FunctionComponent, ReactNode, SetStateAction, createContext } from "react";
import { Base } from "../models/base";

/**
 * Props interface of {@link AuthenticationFlowBuilderCoreContext}
 */
export interface AuthenticationFlowBuilderCoreContextProps {
    /**
     * The properties of the active element.
     */
    lastInteractedElement: Base;
    /**
     * The ID of the active element node.
     */
    lastInteractedNodeId: string;
    /**
     * The wrapper for the element properties factory.
     */
    ElementProperties: FunctionComponent<any>;
    /**
     * The heading for the element properties panel.
     */
    elementPropertiesPanelHeading: ReactNode;
    /**
     * Indicates whether the element panel is open.
     */
    isElementPanelOpen: boolean;
    /**
     * Indicates whether the element properties panel is open.
     */
    isElementPropertiesPanelOpen: boolean;
    /**
     * The factory for creating components.
     */
    ComponentFactory: FunctionComponent<any>;
    /**
     * Function to be called when an element is dropped on the canvas.
     * @param element - The element that was dropped on the canvas.
     * @param nodeId - The ID of the node on which the element was dropped.
     */
    onElementDropOnCanvas: (element: Base, nodeId: string) => void;
    /**
     * The set of attributes that are selected for the flow that are maintained per node.
     */
    selectedAttributes: {
        [key: string]: Claim[];
    };
    /**
     * Sets the active element in the canvas.
     */
    setLastInteractedElement: (element: Base) => void;
    /**
     * Sets the active element node ID.
     */
    setLastInteractedNodeId: Dispatch<SetStateAction<string>>;
    /**
     * Sets the heading for the element properties panel.
     *
     * @param heading - The heading to set for the element properties panel.
     */
    setElementPropertiesPanelHeading: Dispatch<SetStateAction<ReactNode>>;
    /**
     * Function to set the state of the element panel.
     *
     * @param isOpen - Boolean indicating whether the element panel should be open.
     */
    setIsElementPanelOpen: Dispatch<SetStateAction<boolean>>;
    /**
     * Function to set the state of the element properties panel.
     *
     * @param isOpen - Boolean indicating whether the element properties panel should be open.
     */
    setIsOpenElementPropertiesPanel: Dispatch<SetStateAction<boolean>>;
    /**
     * Sets the selected attributes for the flow.
     */
    setSelectedAttributes: Dispatch<SetStateAction<{ [key: string]: Claim[] }>>;
}

/**
 * Context object for managing the Authentication flow builder core context.
 */
const AuthenticationFlowBuilderCoreContext: Context<AuthenticationFlowBuilderCoreContextProps> = createContext<
    null | AuthenticationFlowBuilderCoreContextProps
>(
    {
        ComponentFactory: () => null,
        ElementProperties: () => null,
        elementPropertiesPanelHeading: null,
        isElementPanelOpen: true,
        isElementPropertiesPanelOpen: false,
        lastInteractedElement: null,
        lastInteractedNodeId: "",
        onElementDropOnCanvas: () => {},
        selectedAttributes: {},
        setElementPropertiesPanelHeading: () => {},
        setIsElementPanelOpen: () => {},
        setIsOpenElementPropertiesPanel: () => {},
        setLastInteractedElement: () => {},
        setLastInteractedNodeId: () => {},
        setSelectedAttributes: () => {}
    }
);

AuthenticationFlowBuilderCoreContext.displayName = "AuthenticationFlowBuilderCoreContext";

export default AuthenticationFlowBuilderCoreContext;
