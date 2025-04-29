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
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import "./flow-builder-layout.scss";

/**
 * Props interface of {@link FlowBuilderLayout}
 */
export interface FlowBuilderLayoutProps extends IdentifiableComponentInterface {
    /**
     * The header to be displayed.
     */
    header: ReactNode;
}

/**
 * Header component for the flow builder page.
 *
 * @param props - Props injected to the component.
 * @returns FlowBuilderLayout component.
 */
const FlowBuilderLayout: FunctionComponent<PropsWithChildren<FlowBuilderLayoutProps>> = ({
    header,
    children,
    ["data-componentid"]: componentId = "flow-builder-layout"
}: PropsWithChildren<FlowBuilderLayoutProps>): ReactElement => {
    return (
        <div className="flow-builder-layout" data-componentid={ componentId }>
            <div className="flow-builder-header-wrapper">{ header }</div>
            { children }
        </div>
    );
};

export default FlowBuilderLayout;
