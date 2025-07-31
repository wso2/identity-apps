/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import CommonElementFactory, {
    CommonElementFactoryPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resources/elements/common-element-factory";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Props interface of {@link ElementFactory}
 */
export type ElementFactoryPropsInterface = CommonElementFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * Factory for creating components.
 *
 * @param props - Props injected to the component.
 * @returns The ElementFactory component.
 */
export const ElementFactory: FunctionComponent<ElementFactoryPropsInterface> = ({
    resource,
    stepId
}: ElementFactoryPropsInterface & Node): ReactElement => {
    return <CommonElementFactory resource={ resource } stepId={ stepId } />;
};

export default ElementFactory;
