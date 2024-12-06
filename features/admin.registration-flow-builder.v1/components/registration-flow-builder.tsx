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

import DecoratedVisualFlow from "@wso2is/admin.flow-builder-core.v1/components/decorated-visual-flow";
import AuthenticationFlowBuilderCoreProvider from
    "@wso2is/admin.flow-builder-core.v1/providers/authentication-flow-builder-core-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import ElementProperties from "./element-properties/element-properties";
import NodeFactory from "./nodes/node-factory";
import useGetRegistrationFlowBuilderElements from "../api/use-get-registration-flow-builder-elements";
import RegistrationFlowBuilderProvider from "../providers/registration-flow-builder-provider";

/**
 * Props interface of {@link RegistrationFlowBuilder}
 */
export type RegistrationFlowBuilderPropsInterface = IdentifiableComponentInterface & HTMLAttributes<HTMLDivElement>;

/**
 * Entry point for the registration flow builder.
 *
 * @param props - Props injected to the component.
 * @returns Entry point component for the registration flow builder.
 */
const RegistrationFlowBuilder: FunctionComponent<RegistrationFlowBuilderPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-builder",
    ...rest
}: RegistrationFlowBuilderPropsInterface): ReactElement => {
    const { data: elements } = useGetRegistrationFlowBuilderElements();

    return (
        <AuthenticationFlowBuilderCoreProvider
            NodeFactory={ NodeFactory }
            ElementProperties={ ElementProperties }
        >
            <RegistrationFlowBuilderProvider>
                <DecoratedVisualFlow elements={ elements } data-componentid={ componentId } { ...rest } />
            </RegistrationFlowBuilderProvider>
        </AuthenticationFlowBuilderCoreProvider>
    );
};

export default RegistrationFlowBuilder;
