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

import Avatar from "@oxygen-ui/react/Avatar";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { Claim } from "@wso2is/core/models";
import capitalize from "lodash-es/capitalize";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode, useState } from "react";
import AuthenticationFlowBuilderCoreContext from "../context/authentication-flow-builder-core-context";
import { Base } from "../models/base";
import { ElementCategories } from "../models/elements";
import { NodeTypes } from "../models/node";

/**
 * Props interface of {@link AuthenticationFlowBuilderCoreProvider}
 */
export interface AuthenticationFlowBuilderProviderProps {
    /**
     * The factory for creating nodes.
     */
    NodeFactory: FunctionComponent<any>;
    /**
     * The factory for creating element properties.
     */
    ElementProperties: FunctionComponent<any>;
}

/**
 * This component provides authentication flow builder core related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The AuthenticationFlowBuilderCoreProvider component.
 */
const AuthenticationFlowBuilderCoreProvider = ({
    NodeFactory,
    ElementProperties,
    children
}: PropsWithChildren<AuthenticationFlowBuilderProviderProps>): ReactElement => {
    const [ isElementPanelOpen, setIsElementPanelOpen ] = useState<boolean>(true);
    const [ isElementPropertiesPanelOpen, setIsOpenElementPropertiesPanel ] = useState<boolean>(false);
    const [ elementPropertiesPanelHeading, setElementPropertiesPanelHeading ] = useState<ReactNode>(null);
    const [ lastInteractedElementInternal, setLastInteractedElementInternal ] = useState<Base>(null);
    const [ lastInteractedNodeId, setLastInteractedNodeId ] = useState<string>("");
    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Claim[] }>({});

    const onElementDropOnCanvas = (element: Base, nodeId: string): void => {
        setLastInteractedElement(element);
        setLastInteractedNodeId(nodeId);
    };

    const setLastInteractedElement = (element: Base): void => {
        // TODO: Internationalize this string and get from a mapping.
        setElementPropertiesPanelHeading(
            <Stack>
                <Typography variant="h6">{ capitalize(element.category) } Properties</Typography>
                <Stack direction="row" className="sub-title" gap={ 1 } alignItems="center">
                    <Avatar src={ element?.display?.image } variant="square" />
                    <Typography variant="body2">{ capitalize(element.variant ?? element.type) }</Typography>
                </Stack>
            </Stack>
        );
        setLastInteractedElementInternal(element);

        // If the element is a step node, do not open the properties panel for now.
        // TODO: Figure out if there are properties for a step.
        if (element.category === ElementCategories.Nodes && element.type === NodeTypes.Step) {
            setIsOpenElementPropertiesPanel(false);

            return;
        }

        setIsOpenElementPropertiesPanel(true);
    };

    return (
        <AuthenticationFlowBuilderCoreContext.Provider
            value={ {
                ElementProperties,
                NodeFactory,
                elementPropertiesPanelHeading,
                isElementPanelOpen,
                isElementPropertiesPanelOpen,
                lastInteractedElement: lastInteractedElementInternal,
                lastInteractedNodeId,
                onElementDropOnCanvas,
                selectedAttributes,
                setElementPropertiesPanelHeading,
                setIsElementPanelOpen,
                setIsOpenElementPropertiesPanel,
                setLastInteractedElement,
                setLastInteractedNodeId,
                setSelectedAttributes
            } }
        >
            { children }
        </AuthenticationFlowBuilderCoreContext.Provider>
    );
};

export default AuthenticationFlowBuilderCoreProvider;
