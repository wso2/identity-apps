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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import Execution from "./execution/execution";
import Rule from "./rule/rule";
import View from "./view/view";
import { Step, StepTypes } from "../../../models/steps";

/**
 * Props interface of {@link CommonStepFactory}
 */
export interface CommonStepFactoryPropsInterface extends Node, IdentifiableComponentInterface {
    /**
     * The flow id of the resource.
     */
    resourceId: string;
    /**
     * The resource properties.
     */
    resource: Step;
}

/**
 * Factory for creating common steps.
 *
 * @param props - Props injected to the component.
 * @returns The CommonStepFactory component.
 */
export const CommonStepFactory: FunctionComponent<CommonStepFactoryPropsInterface> = ({
    resource,
    "data-componentid": componentId = "step-factory",
    ...rest
}: CommonStepFactoryPropsInterface): ReactElement => {
    if (resource.type === StepTypes.View) {
        return <View data-componentid={ componentId } resource={ resource } { ...rest } />;
    }

    if (resource.type === StepTypes.Rule) {
        return <Rule data-componentid={ componentId } resource={ resource } { ...rest } />;
    }

    if (resource.type === StepTypes.Execution) {
        return <Execution data-componentid={ componentId } resource={ resource } { ...rest } />;
    }

    return null;
};

export default CommonStepFactory;
