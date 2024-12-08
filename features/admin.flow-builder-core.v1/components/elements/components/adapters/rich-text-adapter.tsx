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

import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Encode } from "@wso2is/core/utils";
import parse, { domToReact } from "html-react-parser"; 
import React, { FunctionComponent, ReactElement } from "react";
import { Component } from "../../../../models/component";

/**
 * Props interface of {@link RichTextAdapter}
 */
export interface RichTextAdapterPropsInterface extends IdentifiableComponentInterface {
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
 * Adapter for the Rich Text component.
 *
 * @param props - Props injected to the component.
 * @returns The RichTextAdapter component.
 */
export const RichTextAdapter: FunctionComponent<RichTextAdapterPropsInterface> = ({
    node
}: RichTextAdapterPropsInterface): ReactElement => (
    <>
        { parse(Encode.forHtml(node?.config?.field?.text), {
            replace(domNode) {
                if ((domNode as unknown as any).name === "h1") {
                    <Typography variant="h1">{ domToReact((domNode as unknown as any).children) }</Typography>;
                }
            }
        }) }
    </>
);

export default RichTextAdapter;
