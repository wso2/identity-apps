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

import Stack from "@oxygen-ui/react/Stack";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useNodeId } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import AttributeFactory from "./attribute-factory";
import useRegistrationFlowBuilder from "../../../../../hooks/use-registration-flow-builder-core-context";
import { Attribute } from "../../../../../models/attributes";

/**
 * Props interface of {@link AttributesAdapter}
 */
export type AttributeCollectorNodePropsInterface = IdentifiableComponentInterface;

/**
 * Adapter to generate the attributes.
 *
 * @param props - Props injected to the component.
 * @returns The AttributesAdapter component.
 */
const AttributesAdapter: FunctionComponent<AttributeCollectorNodePropsInterface> = ({
    "data-componentid": componentId = "attributes-adapter"
}: AttributeCollectorNodePropsInterface): ReactElement => {
    const nodeId: string = useNodeId();
    const { selectedAttributes } = useRegistrationFlowBuilder();

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            { selectedAttributes &&
                Object.prototype.hasOwnProperty.call(selectedAttributes, nodeId) &&
                selectedAttributes[nodeId].map((attribute: Attribute) => (
                    <AttributeFactory key={ attribute.id } attribute={ attribute } />
                )) }
        </Stack>
    );
};

export default AttributesAdapter;
