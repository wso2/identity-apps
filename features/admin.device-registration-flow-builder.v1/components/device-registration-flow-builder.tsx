/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import React, { FunctionComponent, ReactElement } from "react";
import DeviceRegistrationFlowBuilderCore from "./device-registration-flow-builder-core";

/**
 * Props interface of {@link DeviceRegistrationFlowBuilder}
 */
type DeviceRegistrationFlowBuilderPropsInterface = IdentifiableComponentInterface;

/**
 * Entry point for the device registration flow builder.
 *
 * @param props - Props injected to the component.
 * @returns DeviceRegistrationFlowBuilder component.
 */
const DeviceRegistrationFlowBuilder: FunctionComponent<DeviceRegistrationFlowBuilderPropsInterface> = ({
    "data-componentid": componentId = "device-registration-flow-builder",
    ...rest
}: DeviceRegistrationFlowBuilderPropsInterface): ReactElement => (
    <DeviceRegistrationFlowBuilderCore
        data-componentid={ componentId }
        { ...rest }
    />
);

export default DeviceRegistrationFlowBuilder;
