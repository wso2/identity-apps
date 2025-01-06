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

import Box from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Component } from "../../../../models/component";

/**
 * Props interface of {@link ImageAdapter}
 */
export interface ImageAdapterPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the node.
     */
    nodeId: string;
    /**
     * The node properties.
     */
    node: Component;
}

/**
 * Adapter for displaying images.
 *
 * @param props - Props injected to the component.
 * @returns The ImageAdapter component.
 */
export const ImageAdapter: FunctionComponent<ImageAdapterPropsInterface> = ({
    node
}: ImageAdapterPropsInterface): ReactElement => (
    <Box display="flex" alignItems="center" justifyContent="center">
        <img
            src={ node?.config?.field?.src }
            alt={ node?.config?.field?.alt }
            width="100%"
            style={ node?.config?.styles }
        />
    </Box>
);

export default ImageAdapter;
