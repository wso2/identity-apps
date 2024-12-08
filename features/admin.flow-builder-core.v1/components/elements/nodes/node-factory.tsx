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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node as XYFlowNode } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import Rule from "./rule/rule";
import Step from "./step/step";
import { Node, NodeTypes } from "../../../models/node";

/**
 * Props interface of {@link NodeFactory}
 */
export interface NodeFactoryPropsInterface extends XYFlowNode, IdentifiableComponentInterface {
    /**
     * The flow id of the node.
     */
    nodeId: string;
    /**
     * The node properties.
     */
    node: Node;
}

/**
 * Factory for creating common components.
 *
 * @param props - Props injected to the component.
 * @returns The NodeFactory component.
 */
export const NodeFactory: FunctionComponent<NodeFactoryPropsInterface> = ({
    node,
    "data-componentid": componentId = "node-factory",
    ...rest
}: NodeFactoryPropsInterface): ReactElement => {
    if (node.type === NodeTypes.Step) {
        return <Step data-componentid={ componentId } { ...rest } />;
    }

    if (node.type === NodeTypes.Rule) {
        return <Rule data-componentid={ componentId } { ...rest } />;
    }

    return null;
};

export default NodeFactory;
