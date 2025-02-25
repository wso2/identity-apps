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

import Divider, { DividerProps } from "@oxygen-ui/react/Divider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { DividerVariants, Element } from "../../../../models/elements";

/**
 * Props interface of {@link DividerAdapter}
 */
export interface DividerAdapterPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the resource.
     */
    resourceId: string;
    /**
     * The resource properties.
     */
    resource: Element;
}

/**
 * Adapter for the Divider component.
 *
 * @param props - Props injected to the component.
 * @returns The DividerAdapter component.
 */
export const DividerAdapter: FunctionComponent<DividerAdapterPropsInterface> = ({
    resource
}: DividerAdapterPropsInterface): ReactElement => {
    let config: DividerProps = {};

    if (resource?.variant === DividerVariants.Horizontal || resource?.variant === DividerVariants.Vertical) {
        config = {
            ...config,
            orientation: resource?.variant?.toLowerCase()
        };
    } else {
        config = {
            ...config,
            variant: resource?.variant?.toLowerCase()
        };
    }

    return <Divider { ...config }>{ resource?.config?.text }</Divider>;
};

export default DividerAdapter;
