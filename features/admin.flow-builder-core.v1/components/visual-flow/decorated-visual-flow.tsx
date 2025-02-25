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

import { DnDProvider } from "@oxygen-ui/react/dnd";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ReactFlowProvider } from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import ResourcePanel from "../resource-panel/resource-panel";
import ElementPropertiesPanel from "../resource-property-panel/resource-property-panel";
import VisualFlow, { VisualFlowPropsInterface } from "./visual-flow";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";

/**
 * Props interface of {@link DecoratedVisualFlow}
 */
export type DecoratedVisualFlowPropsInterface = VisualFlowPropsInterface & IdentifiableComponentInterface;

/**
 * Component to decorate the visual flow editor with the necessary providers.
 *
 * @param props - Props injected to the component.
 * @returns Decorated visual flow component.
 */
const DecoratedVisualFlow: FunctionComponent<DecoratedVisualFlowPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-editor",
    resources,
    ...rest
}: DecoratedVisualFlowPropsInterface): ReactElement => {
    const { isResourcePanelOpen, isResourcePropertiesPanelOpen } = useAuthenticationFlowBuilderCore();

    return (
        <div
            className={ classNames("decorated-visual-flow", "react-flow-container", "visual-editor") }
            data-componentid={ componentId }
        >
            <ReactFlowProvider>
                <DnDProvider>
                    <ResourcePanel resources={ resources } open={ isResourcePanelOpen }>
                        <ElementPropertiesPanel open={ isResourcePropertiesPanelOpen }>
                            <VisualFlow resources={ resources } { ...rest } />
                        </ElementPropertiesPanel>
                    </ResourcePanel>
                </DnDProvider>
            </ReactFlowProvider>
        </div>
    );
};

export default DecoratedVisualFlow;
