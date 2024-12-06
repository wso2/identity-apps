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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DnDProvider } from "@wso2is/dnd";
import { ReactFlowProvider } from "@xyflow/react";
import classNames from "classnames";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import ElementPropertiesPanel from "./element-property-panel/element-property-panel";
import ElementPanel from "./element-panel/element-panel";
import VisualFlow from "./visual-flow";
import useAuthenticationFlowBuilderCore from "../hooks/use-authentication-flow-builder-core-context";
import { Elements } from "../models/elements";

/**
 * Props interface of {@link DecoratedVisualFlow}
 */
export interface DecoratedVisualFlowPropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    /**
     * Flow elements.
     */
    elements: Elements;
}

/**
 * Component to decorate the visual flow editor with the necessary providers.
 *
 * @param props - Props injected to the component.
 * @returns Decorated visual flow component.
 */
const DecoratedVisualFlow: FunctionComponent<DecoratedVisualFlowPropsInterface> = ({
    "data-componentid": componentId = "authentication-flow-visual-editor",
    elements,
    ...rest
}: DecoratedVisualFlowPropsInterface): ReactElement => {
    const { isElementPanelOpen, isElementPropertiesPanelOpen } = useAuthenticationFlowBuilderCore();

    return (
        <div
            className={ classNames("decorated-visual-flow", "react-flow-container", "visual-editor") }
            data-componentid={ componentId }
            { ...rest }
        >
            <ReactFlowProvider>
                <DnDProvider>
                    <ElementPanel elements={ elements } open={ isElementPanelOpen }>
                        <ElementPropertiesPanel open={ isElementPropertiesPanelOpen }>
                            <VisualFlow />
                        </ElementPropertiesPanel>
                    </ElementPanel>
                </DnDProvider>
            </ReactFlowProvider>
        </div>
    );
};

export default DecoratedVisualFlow;
