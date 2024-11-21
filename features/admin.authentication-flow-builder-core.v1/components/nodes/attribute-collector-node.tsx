/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Stack from "@oxygen-ui/react/Stack";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useNodeId } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import AttributeFactory from "./attribute-factory";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";

/**
 * Props interface of {@link AttributeCollectorNode}
 */
export interface AttributeCollectorNodePropsInterface extends IdentifiableComponentInterface {}

/**
 * Factory to generate the property configurator for the given element.
 *
 * @param props - Props injected to the component.
 * @returns The AttributeCollectorNode component.
 */
const AttributeCollectorNode: FunctionComponent<AttributeCollectorNodePropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder-attribute-collector-node"
}: AttributeCollectorNodePropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const { selectedAttributes } = useAuthenticationFlowBuilderCore();

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            { selectedAttributes &&
                Object.prototype.hasOwnProperty.call(selectedAttributes, nodeId) &&
                selectedAttributes[nodeId].map((attribute, index) => (
                    <AttributeFactory key={ attribute.id } attribute={ attribute } />
                )) }
        </Stack>
    );
};

export default AttributeCollectorNode;
