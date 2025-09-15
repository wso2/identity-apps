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
import End from "./end/end";
import Start from "./start/start";
import { StaticStepTypes, Step } from "../../../models/steps";

/**
 * Props interface of {@link CommonStaticStepFactory}
 */
export interface CommonStaticStepFactoryPropsInterface extends Node, IdentifiableComponentInterface {
    /**
     * The resource properties.
     */
    type: StaticStepTypes;
    /**
     * The resource properties.
     */
    resource: Step;
}

/**
 * Factory for creating common static nodes in the visual editor.
 *
 * @param props - Props injected to the component.
 * @returns The CommonStaticStepFactory component.
 */
export const CommonStaticStepFactory: FunctionComponent<CommonStaticStepFactoryPropsInterface> = ({
    type,
    resource,
    "data-componentid": componentId = "common-static-node-factory",
    ...rest
}: CommonStaticStepFactoryPropsInterface): ReactElement => {
    if (type === StaticStepTypes.Start) {
        return <Start data-componentid={ componentId } { ...rest } />;
    }

    if (type === StaticStepTypes.UserOnboard) {
        return <End data-componentid={ componentId } resource={resource} { ...rest } />;
    }

    if (type === StaticStepTypes.End) {
        return <End data-componentid={ componentId } resource={resource} { ...rest } />;
    }

    return null;
};

export default CommonStaticStepFactory;
