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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import DecoratedVisualFlow from "./decorated-visual-flow";
import AuthenticationFlowBuilderCoreProvider from "../providers/authentication-flow-builder-core-provider";

/**
 * Props interface of {@link Builder}
 */
export type BuilderPropsInterface = IdentifiableComponentInterface & HTMLAttributes<HTMLDivElement>;

/**
 * Entry point for the authentication flow builder.
 *
 * @param props - Props injected to the component.
 * @returns Entry point component for the authentication flow builder.
 */
const Builder: FunctionComponent<BuilderPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder",
    ...rest
}: BuilderPropsInterface): ReactElement => (
    <AuthenticationFlowBuilderCoreProvider>
        <DecoratedVisualFlow data-componentid={componentId} {...rest} />
    </AuthenticationFlowBuilderCoreProvider>
);

export default Builder;
